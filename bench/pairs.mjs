// Builds blind A/B pairs for judging.
//   node bench/pairs.mjs --round r1
// Writes pairs.json (what judges see: left/right, no arm labels) and
// key.json (which side is which arm). Judges must never read key.json.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = process.env.GD_BENCH_ROOT || "E:/gd-bench";
const round = (process.argv.find((a) => a.startsWith("--round=")) || "--round=r1").split("=")[1];
const spec = JSON.parse(readFileSync(join(here, "tasks.json"), "utf8"));
const runsDir = join(BENCH_ROOT, "runs", round);

const pairs = [];
const key = {};
for (const task of spec.tasks) {
  const dir = join(runsDir, task.id);
  if (!existsSync(dir)) continue;
  const reps = new Set(readdirSync(dir).map((n) => n.split("-")[1]));
  for (const rep of reps) {
    const a = join(dir, `A-${rep}`), b = join(dir, `B-${rep}`);
    const ok = (d) => existsSync(join(d, "shot-1440.jpg")) && existsSync(join(d, "shot-390.jpg"));
    if (!ok(a) || !ok(b)) continue;
    // Deterministic but unpredictable side assignment.
    const id = createHash("sha256").update(`${round}:${task.id}:${rep}`).digest("hex").slice(0, 10);
    const aLeft = parseInt(id.slice(0, 2), 16) % 2 === 0;
    const [left, right] = aLeft ? [a, b] : [b, a];
    pairs.push({
      id,
      task: task.id,
      kind: task.kind,
      brief: task.prompt,
      left: { desktop: join(left, "shot-1440.jpg"), mobile: join(left, "shot-390.jpg") },
      right: { desktop: join(right, "shot-1440.jpg"), mobile: join(right, "shot-390.jpg") },
    });
    key[id] = { left: aLeft ? "A" : "B", right: aLeft ? "B" : "A", task: task.id, rep: Number(rep), holdout: !!task.holdout };
  }
}
// Shuffle presentation order so tasks and reps don't cluster.
pairs.sort((x, y) => x.id.localeCompare(y.id));
writeFileSync(join(runsDir, "pairs.json"), JSON.stringify(pairs, null, 2));
writeFileSync(join(runsDir, "key.json"), JSON.stringify(key, null, 2));
console.log(`${pairs.length} pairs → ${join(runsDir, "pairs.json")} (key in key.json; don't show it to judges)`);
