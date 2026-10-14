// Benchmark runner: runs each task with and without the skill in isolated workspaces.
//
//   node bench/run.mjs --round r1 [--tasks g01-bakery,e01-gd-changelog] [--reps 3]
//                      [--arms A,B] [--concurrency 3] [--dry]
//
// Arm A = no skill, arm B = GradientDeck skill (installed with the real installer).
// Both arms use the same model, effort, tools and prompt. Runs use an isolated
// Claude Code profile (BENCH_HOME) so no user-level skills or settings leak in.
import { spawn, spawnSync } from "node:child_process";
import {
  cpSync, existsSync, mkdirSync, readFileSync, readdirSync, symlinkSync, writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const BENCH_ROOT = process.env.GD_BENCH_ROOT || "E:/gd-bench";
const BENCH_HOME = join(BENCH_ROOT, ".claude-home");
const MODEL = process.env.GD_BENCH_MODEL || "claude-opus-5-5";
const EFFORT = process.env.GD_BENCH_EFFORT || "low";
const TIMEOUT_MS = 25 * 60 * 1000;
// Same tools for both arms. No shell, browser or web access in round 1.
const ALLOWED = "Read,Write,Edit,Glob,Grep,Skill,TodoWrite";
const DISALLOWED = "Bash,WebFetch,WebSearch,NotebookEdit";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`)) ?? (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : undefined);
  return hit?.includes("=") ? hit.split("=").slice(1).join("=") : hit ?? fallback;
};
const round = opt("round", "r1");
const reps = Number(opt("reps", 3));
const arms = opt("arms", "A,B").split(",");
const concurrency = Number(opt("concurrency", 3));
const dry = args.includes("--dry");
// Set up workspaces with a stub run.json, without calling the agent (for testing the checker).
const prepareOnly = args.includes("--prepare-only");

const spec = JSON.parse(readFileSync(join(repo, "bench", "tasks.json"), "utf8"));
const only = opt("tasks", "");
const tasks = spec.tasks.filter((t) => !only || only.split(",").includes(t.id));
const skillVersion = JSON.parse(readFileSync(join(repo, "package.json"), "utf8")).version;

function copyBase(src, dest) {
  cpSync(src, dest, {
    recursive: true,
    filter: (p) => !/[\\/](node_modules|\.git|\.next|dist)([\\/]|$)/.test(p.slice(src.length)),
  });
  // Share installed packages with the base instead of reinstalling per run.
  symlinkSync(join(src, "node_modules"), join(dest, "node_modules"), "junction");
}

function git(cwd, ...cmd) {
  return spawnSync("git", ["-c", "core.autocrlf=false", "-c", "user.name=bench", "-c", "user.email=bench@local", ...cmd], { cwd, encoding: "utf8" });
}

function prepare(task, arm, workspace) {
  mkdirSync(workspace, { recursive: true });
  if (task.kind === "redesign") cpSync(join(repo, "bench", "fixtures", task.fixture), workspace, { recursive: true });
  if (task.kind === "extend") copyBase(join(BENCH_ROOT, "bases", task.codebase), workspace);
  writeFileSync(join(workspace, ".gitignore"), "node_modules\n.claude\n");
  git(workspace, "init", "-q");
  git(workspace, "add", "-A");
  git(workspace, "commit", "-q", "--allow-empty", "-m", "baseline");
  if (arm === "B") {
    const r = spawnSync(process.execPath, [join(repo, "bin", "gradientdeck.mjs"), "install", "--project", "--only=claude"], { cwd: workspace, encoding: "utf8" });
    if (r.status !== 0) throw new Error("skill install failed: " + r.stderr);
  }
}

function promptFor(task) {
  return task.kind === "greenfield" ? `${task.prompt}\n\n${spec.staticSuffix}` : task.prompt;
}

function runClaude(task, workspace, outDir) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn("claude", [
      "-p", promptFor(task),
      "--model", MODEL,
      "--effort", EFFORT,
      "--output-format", "stream-json", "--verbose",
      "--allowedTools", ALLOWED,
      "--disallowedTools", DISALLOWED,
      "--permission-mode", "acceptEdits",
    ], {
      cwd: workspace,
      env: { ...process.env, CLAUDE_CONFIG_DIR: BENCH_HOME },
      shell: process.platform === "win32",
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => { stdout += d; });
    child.stderr.on("data", (d) => { stderr += d; });
    const timer = setTimeout(() => child.kill(), TIMEOUT_MS);
    child.on("close", (code) => {
      clearTimeout(timer);
      writeFileSync(join(outDir, "transcript.jsonl"), stdout);
      if (stderr) writeFileSync(join(outDir, "stderr.log"), stderr);
      const events = stdout.split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
      const result = events.findLast((e) => e.type === "result") || {};
      const toolUses = events.filter((e) => e.type === "assistant")
        .flatMap((e) => (e.message?.content || []).filter((c) => c.type === "tool_use"));
      const skillCalls = toolUses.filter((t) => t.name === "Skill").map((t) => t.input?.skill || t.input?.command || "?");
      const referenceReads = toolUses.filter((t) => t.name === "Read" && /gradientdeck[\\/]/.test(t.input?.file_path || ""))
        .map((t) => t.input.file_path.split(/[\\/]/).pop());
      resolve({
        exitCode: code,
        wallMs: Date.now() - started,
        isError: result.is_error ?? code !== 0,
        costUsd: result.total_cost_usd ?? null,
        durationMs: result.duration_ms ?? null,
        turns: result.num_turns ?? null,
        usage: result.usage ?? null,
        skillCalls,
        referenceReads,
        finalMessage: (result.result || "").slice(0, 4000),
      });
    });
  });
}

const jobs = [];
for (let rep = 1; rep <= reps; rep++) {
  for (const task of tasks) {
    for (const arm of arms) jobs.push({ task, arm, rep });
  }
}

const pending = jobs.filter(({ task, arm, rep }) => !existsSync(join(BENCH_ROOT, "runs", round, task.id, `${arm}-${rep}`, "run.json")));
console.log(`Round ${round}: ${jobs.length} jobs, ${pending.length} pending · model ${MODEL} (${EFFORT}) · skill v${skillVersion} · concurrency ${concurrency}`);
if (dry) {
  for (const j of pending) console.log(`  ${j.task.id} ${j.arm}-${j.rep}`);
  process.exit(0);
}
if (!prepareOnly && !existsSync(BENCH_HOME)) {
  console.error(`No benchmark profile at ${BENCH_HOME}. Log in once with CLAUDE_CONFIG_DIR set to it (see bench/README.md).`);
  process.exit(1);
}

let done = 0;
async function worker() {
  while (pending.length) {
    const { task, arm, rep } = pending.shift();
    const outDir = join(BENCH_ROOT, "runs", round, task.id, `${arm}-${rep}`);
    const workspace = join(outDir, "workspace");
    try {
      if (!existsSync(workspace)) prepare(task, arm, workspace);
      if (prepareOnly) {
        writeFileSync(join(outDir, "run.json"), JSON.stringify({ round, task: task.id, kind: task.kind, arm, rep, stub: true }));
        console.log(`prepared ${task.id} ${arm}-${rep}`);
        continue;
      }
      const result = await runClaude(task, workspace, outDir);
      const diff = git(workspace, "diff", "--stat", "HEAD").stdout;
      const status = git(workspace, "status", "--porcelain").stdout;
      writeFileSync(join(outDir, "run.json"), JSON.stringify({
        round, task: task.id, kind: task.kind, holdout: !!task.holdout, arm, rep,
        model: MODEL, effort: EFFORT, skillVersion: arm === "B" ? skillVersion : null,
        finishedAt: new Date().toISOString(), changedFiles: status.split("\n").filter(Boolean).length, diffStat: diff.trim().split("\n").pop() || "",
        ...result,
      }, null, 2));
      done++;
      console.log(`[${done}/${jobs.length}] ${task.id} ${arm}-${rep}  ${result.isError ? "ERROR" : "ok"}  $${result.costUsd?.toFixed(2) ?? "?"}  ${Math.round(result.wallMs / 1000)}s  skill:${result.skillCalls.length ? result.skillCalls.join(",") : "-"}`);
    } catch (err) {
      console.error(`${task.id} ${arm}-${rep} failed: ${err.message}`);
    }
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
console.log("Done.");
