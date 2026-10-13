#!/usr/bin/env node
// GradientDeck installer. Copies the skill into the folders coding agents read.
// No dependencies, no network calls, no telemetry.
import {
  cpSync, existsSync, mkdirSync, readFileSync, rmSync, rmdirSync, writeFileSync, statSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));
const SOURCE = join(pkgRoot, "skills", "gradientdeck");
const SKILL = "gradientdeck";
const MARKER = ".gradientdeck-install";

// Where agents look for skills, relative to the project root or the home folder.
// `.agents/skills` is read by most agents; Claude Code reads `.claude/skills`.
const TARGETS = [
  { id: "agents", label: "Shared (.agents): Codex, Cursor, Copilot, Gemini, OpenCode and others", dir: [".agents", "skills"], always: true },
  { id: "claude", label: "Claude Code (.claude)", dir: [".claude", "skills"], detect: [".claude"] },
];

const argv = process.argv.slice(2);
const command = argv.find((a) => !a.startsWith("-")) || "help";
const flag = (name) => argv.includes(`--${name}`);
const dryRun = flag("dry-run");

function findGitRoot(from) {
  let dir = resolve(from);
  while (true) {
    if (existsSync(join(dir, ".git"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function resolveScope() {
  if (flag("global")) return { scope: "global", base: homedir() };
  if (flag("project")) return { scope: "project", base: findGitRoot(process.cwd()) || process.cwd() };
  const gitRoot = findGitRoot(process.cwd());
  return gitRoot ? { scope: "project", base: gitRoot } : { scope: "global", base: homedir() };
}

function manifestPath(base) {
  return join(base, ".gradientdeck", "install.json");
}

function readManifest(base) {
  try {
    return JSON.parse(readFileSync(manifestPath(base), "utf8"));
  } catch {
    return null;
  }
}

function pickTargets(base) {
  const only = argv.find((a) => a.startsWith("--only="));
  if (only) {
    const ids = only.slice(7).split(",");
    return TARGETS.filter((t) => ids.includes(t.id));
  }
  const detected = TARGETS.filter((t) => t.always || (t.detect || []).some((d) => existsSync(join(base, d))));
  // Claude Code is the most common agent; include it when nothing else is detected.
  if (!detected.some((t) => t.id === "claude")) {
    const claudeOnPath = (process.env.PATH || "").split(process.platform === "win32" ? ";" : ":")
      .some((p) => ["claude", "claude.exe", "claude.cmd"].some((b) => existsSync(join(p, b))));
    if (claudeOnPath || !existsSync(join(base, ".cursor"))) detected.push(TARGETS.find((t) => t.id === "claude"));
  }
  return detected;
}

function log(line = "") {
  process.stdout.write(line + "\n");
}

function install() {
  const { scope, base } = resolveScope();
  const targets = pickTargets(base);
  const written = [];
  log(`${dryRun ? "[dry run] " : ""}Installing GradientDeck ${pkg.version} (${scope}: ${base})`);

  for (const target of targets) {
    const dest = join(base, ...target.dir, SKILL);
    if (existsSync(dest) && !existsSync(join(dest, MARKER))) {
      log(`  skip  ${dest} (a folder with this name exists and wasn't installed by GradientDeck)`);
      continue;
    }
    log(`  write ${dest}  ← ${target.label}`);
    if (!dryRun) {
      rmSync(dest, { recursive: true, force: true });
      mkdirSync(dirname(dest), { recursive: true });
      cpSync(SOURCE, dest, { recursive: true });
      writeFileSync(join(dest, MARKER), JSON.stringify({ version: pkg.version, installedAt: new Date().toISOString() }, null, 2));
    }
    written.push(dest);
  }

  if (!dryRun && written.length) {
    const previous = readManifest(base);
    const paths = [...new Set([...(previous?.paths || []), ...written])];
    mkdirSync(dirname(manifestPath(base)), { recursive: true });
    writeFileSync(manifestPath(base), JSON.stringify({ version: pkg.version, scope, paths }, null, 2));
  }

  log("");
  log(written.length
    ? "Done. Ask your agent to build or review some UI, or run a command like \"gradientdeck review\" in your agent."
    : "Nothing was written.");
  if (scope === "project" && !dryRun) log("Tip: commit the skill folders so your team gets the same design rules.");
}

function uninstall() {
  const { scope, base } = resolveScope();
  const manifest = readManifest(base);
  const candidates = manifest?.paths || TARGETS.map((t) => join(base, ...t.dir, SKILL));
  let removed = 0;
  log(`${dryRun ? "[dry run] " : ""}Removing GradientDeck (${scope}: ${base})`);
  for (const dest of candidates) {
    if (!existsSync(dest)) continue;
    if (!existsSync(join(dest, MARKER))) {
      log(`  keep  ${dest} (not installed by GradientDeck)`);
      continue;
    }
    log(`  remove ${dest}`);
    if (!dryRun) rmSync(dest, { recursive: true, force: true });
    removed++;
  }
  if (!dryRun && manifest) {
    rmSync(manifestPath(base), { force: true });
    // Remove the .gradientdeck folder only if nothing else (decisions, config) is in it.
    try { rmdirSync(dirname(manifestPath(base))); } catch {}
  }
  log(removed ? "Done. Your DESIGN.md and .gradientdeck/decisions.md were left in place." : "Nothing to remove.");
}

function doctor() {
  const { scope, base } = resolveScope();
  log(`GradientDeck ${pkg.version} · Node ${process.versions.node} · ${process.platform}`);
  log(`Scope: ${scope} (${base})`);
  for (const target of TARGETS) {
    const dest = join(base, ...target.dir, SKILL);
    if (!existsSync(dest)) {
      log(`  -  ${target.label}: not installed`);
      continue;
    }
    let version = "unknown";
    try { version = JSON.parse(readFileSync(join(dest, MARKER), "utf8")).version; } catch {}
    const stale = version !== pkg.version ? `  (installed ${version}; run "npx gradientdeck update")` : "";
    log(`  ok ${target.label}: ${dest}${stale}`);
  }
  const designMd = join(base, "DESIGN.md");
  log(existsSync(designMd)
    ? `  ok DESIGN.md found (${statSync(designMd).size} bytes)`
    : "  -  No DESIGN.md yet. Ask your agent to run \"extract\" on an existing project, or it will write one after your first new design.");
}

function help() {
  log(`GradientDeck ${pkg.version}: design judgment for coding agents.

Usage: npx gradientdeck <command> [options]

Commands
  install     Copy the skill into your agents' skill folders
  update      Same as install; replaces an older copy
  uninstall   Remove only what GradientDeck installed
  doctor      Show where the skill is installed and whether it's current

Options
  --project   Install into the current project (default inside a git repo)
  --global    Install into your home folder for every project
  --only=ids  Limit to targets: agents, claude
  --dry-run   Show what would change without writing anything`);
}

const commands = { install, update: install, uninstall, remove: uninstall, doctor, help };
(commands[command] || help)();
