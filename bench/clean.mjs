// Safely deletes benchmark runs. Workspaces contain node_modules junctions that
// point at the shared bases; those links are removed first so nothing outside
// the run folder is ever touched.
//   node bench/clean.mjs <round> [taskId]
import { existsSync, lstatSync, readdirSync, rmSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const BENCH_ROOT = process.env.GD_BENCH_ROOT || "E:/gd-bench";
const [round, taskId] = process.argv.slice(2);
if (!round) {
  console.error("usage: node bench/clean.mjs <round> [taskId]");
  process.exit(1);
}
const target = join(BENCH_ROOT, "runs", round, ...(taskId ? [taskId] : []));
if (!existsSync(target)) process.exit(0);

function unlinkJunctions(dir, depth = 0) {
  if (depth > 4) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = lstatSync(p);
    if (st.isSymbolicLink()) unlinkSync(p);
    else if (st.isDirectory() && name !== ".git") unlinkJunctions(p, depth + 1);
  }
}
unlinkJunctions(target);
rmSync(target, { recursive: true, force: true });
console.log(`removed ${target}`);
