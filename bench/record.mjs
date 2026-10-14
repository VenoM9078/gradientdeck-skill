// Records a subagent-run result into run.json (used when runs are executed as
// subagents instead of `claude -p`).
//   node bench/record.mjs <round> <task> <arm> <rep> <durationMs> <tokens> <toolUses> "<final reply>"
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const BENCH_ROOT = process.env.GD_BENCH_ROOT || "E:/gd-bench";
const [round, task, arm, rep, durationMs, tokens, toolUses, ...reply] = process.argv.slice(2);
const dir = join(BENCH_ROOT, "runs", round, task, `${arm}-${rep}`);
const file = join(dir, "run.json");
const base = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
const finalMessage = reply.join(" ");
const skillLine = (finalMessage.match(/SKILL:\s*(.*)/i) || [])[1] || "";
const referenceReads = skillLine.split(/[,\s]+/).filter((s) => /\.md$/.test(s));
const status = spawnSync("git", ["status", "--porcelain"], { cwd: join(dir, "workspace"), encoding: "utf8" }).stdout;
const record = {
  ...base,
  stub: false,
  executor: "subagent",
  model: "opus (subagent)",
  effort: "low",
  skillVersion: arm === "B" ? JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version : null,
  wallMs: Number(durationMs),
  tokens: Number(tokens),
  toolUses: Number(toolUses),
  costUsd: null,
  isError: !/^\s*DONE/i.test(finalMessage),
  skillCalls: [],
  referenceReads,
  changedFiles: status.split("\n").filter(Boolean).length,
  finishedAt: new Date().toISOString(),
  finalMessage: finalMessage.slice(0, 2000),
};
writeFileSync(file, JSON.stringify(record, null, 2));
console.log(`${task} ${arm}-${rep}: ${record.isError ? "ERROR" : "ok"} ${Math.round(record.wallMs / 1000)}s ${record.tokens} tok, ${record.changedFiles} files${referenceReads.length ? ", skill: " + referenceReads.join(",") : ""}`);
