// Aggregates a round into a scorecard.
//   node bench/report.mjs --round r1
// Reads run.json + check.json per run and judgments-*.json, writes report.md.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = process.env.GD_BENCH_ROOT || "E:/gd-bench";
const round = (process.argv.find((a) => a.startsWith("--round=")) || "--round=r1").split("=")[1];
const runsDir = join(BENCH_ROOT, "runs", round);
const spec = JSON.parse(readFileSync(join(here, "tasks.json"), "utf8"));
const holdout = new Set(spec.tasks.filter((t) => t.holdout).map((t) => t.id));

const rows = [];
for (const task of readdirSync(runsDir).filter((n) => statSync(join(runsDir, n)).isDirectory())) {
  for (const armRep of readdirSync(join(runsDir, task))) {
    const dir = join(runsDir, task, armRep);
    if (!existsSync(join(dir, "run.json"))) continue;
    const run = JSON.parse(readFileSync(join(dir, "run.json"), "utf8"));
    const check = existsSync(join(dir, "check.json")) ? JSON.parse(readFileSync(join(dir, "check.json"), "utf8")) : {};
    rows.push({ ...run, check });
  }
}

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
const pct = (xs) => (xs.length ? `${Math.round((100 * xs.filter(Boolean).length) / xs.length)}%` : "–");
const f = (n, d = 1) => (Number.isFinite(n) ? n.toFixed(d) : "–");
const by = (arm, filter = () => true) => rows.filter((r) => r.arm === arm && filter(r));

function metricTable(filter, label) {
  const lines = [`### ${label}`, "", "| Metric | A: no skill | B: GradientDeck |", "|---|---|---|"];
  const add = (name, fn) => lines.push(`| ${name} | ${fn(by("A", filter))} | ${fn(by("B", filter))} |`);
  const d = (r) => r.check.desktop;
  const rendered = (rs) => rs.filter((r) => d(r));
  add("Runs (rendered)", (rs) => `${rs.length} (${rendered(rs).length})`);
  add("Agent errors", (rs) => rs.filter((r) => r.isError).length);
  add("Skill triggered", (rs) => pct(rs.map((r) => (r.skillCalls || []).length > 0 || (r.referenceReads || []).length > 0)));
  add("Purple/blue or cyan/magenta gradients (avg)", (rs) => f(mean(rendered(rs).map((r) => d(r).tells.purpleBlueGradients))));
  add("Gradient-filled text (runs with any)", (rs) => pct(rendered(rs).map((r) => d(r).tells.gradientText > 0)));
  add("Centered full-height hero", (rs) => pct(rendered(rs).map((r) => d(r).tells.heroCentered && d(r).tells.heroFullHeight)));
  add("Eyebrow labels above headings (avg)", (rs) => f(mean(rendered(rs).map((r) => d(r).tells.eyebrows))));
  add("Emoji used as UI (avg)", (rs) => f(mean(rendered(rs).map((r) => d(r).tells.emojiUi))));
  add("Identical card rows (avg)", (rs) => f(mean(rendered(rs).map((r) => d(r).tells.identicalCardRows))));
  add("`transition: all` rules (avg)", (rs) => f(mean(rendered(rs).map((r) => d(r).tells.transitionAll))));
  add("Unsupported numbers on page (avg)", (rs) => f(mean(rendered(rs).map((r) => (r.check.unsupportedNumbers || []).length))));
  add("Testimonial-like quotes (avg)", (rs) => f(mean(rendered(rs).map((r) => r.check.testimonialLike || 0))));
  add("Text contrast failures (avg)", (rs) => f(mean(rendered(rs).map((r) => d(r).contrast.fails))));
  add("Horizontal overflow at 390px", (rs) => pct(rendered(rs).map((r) => r.check.mobile?.overflowX)));
  add("Cost per run (avg $)", (rs) => f(mean(rs.map((r) => r.costUsd).filter(Number.isFinite)), 2));
  add("Time per run (avg min)", (rs) => f(mean(rs.map((r) => r.wallMs / 60000).filter(Number.isFinite))));
  return lines.join("\n");
}

function systemTable() {
  const lines = ["### Codebase tasks: use of the existing system", "", "| Metric | A: no skill | B: GradientDeck |", "|---|---|---|"];
  const ext = (arm) => by(arm, (r) => r.kind === "extend" && r.check.system);
  const add = (name, fn) => lines.push(`| ${name} | ${fn(ext("A"))} | ${fn(ext("B"))} |`);
  add("Runs", (rs) => rs.length);
  add("Raw color values added (avg)", (rs) => f(mean(rs.map((r) => r.check.system.rawColors))));
  add("Arbitrary Tailwind values added (avg)", (rs) => f(mean(rs.map((r) => r.check.system.arbitraryTailwind))));
  add("Inline styles added (avg)", (rs) => f(mean(rs.map((r) => r.check.system.inlineStyles))));
  add("Existing component imports (avg)", (rs) => f(mean(rs.map((r) => r.check.system.uiImports))));
  add("Token references (avg)", (rs) => f(mean(rs.map((r) => r.check.system.tokenRefs))));
  add("Render errors", (rs) => rs.filter((r) => r.check.renderError).length);
  return lines.join("\n");
}

function convergence() {
  const lines = ["### Convergence across greenfield runs (lower top share = more varied)", "", "| Fingerprint | A: no skill | B: GradientDeck |", "|---|---|---|"];
  const top = (rs, fn) => {
    const counts = {};
    for (const r of rs) { const k = fn(r); if (k != null) counts[k] = (counts[k] || 0) + 1; }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((s, [, c]) => s + c, 0);
    return sorted.length ? `${sorted[0][0]} (${Math.round((100 * sorted[0][1]) / total)}%), ${sorted.length} distinct` : "–";
  };
  const g = (arm) => by(arm, (r) => r.kind === "greenfield" && r.check.desktop);
  const add = (name, fn) => lines.push(`| ${name} | ${top(g("A"), fn)} | ${top(g("B"), fn)} |`);
  add("Headline font", (r) => r.check.desktop.fonts.h1);
  add("Body font", (r) => r.check.desktop.fonts.body);
  add("Accent hue (30° bins)", (r) => r.check.desktop.page.accentHue);
  add("Dark page", (r) => String(r.check.desktop.page.dark));
  add("Cream background", (r) => String(r.check.desktop.page.cream));
  add("Hero layout", (r) => (r.check.desktop.tells.heroCentered ? "centered" : "left/asym") + (r.check.desktop.tells.heroFullHeight ? ", full-height" : ""));
  return lines.join("\n");
}

function judging() {
  const keyFile = join(runsDir, "key.json");
  if (!existsSync(keyFile)) return "### Blind judging\n\nNo pairs yet.";
  const key = JSON.parse(readFileSync(keyFile, "utf8"));
  const lines = ["### Blind judging (B win rate excludes ties from the denominator)", "", "| Judge | Pairs | B wins | A wins | Ties | B win rate | Holdout B win rate |", "|---|---|---|---|---|---|---|"];
  for (const file of readdirSync(runsDir).filter((n) => /^judgments-.*\.json$/.test(n))) {
    const judge = file.slice(10, -5);
    const j = JSON.parse(readFileSync(join(runsDir, file), "utf8"));
    const tally = (filter) => {
      let a = 0, b = 0, t = 0;
      for (const [id, v] of Object.entries(j)) {
        if (!key[id] || !filter(key[id])) continue;
        if (v.choice === "tie") t++;
        else if (key[id][v.choice] === "B") b++;
        else a++;
      }
      return { a, b, t };
    };
    const all = tally(() => true), ho = tally((k) => k.holdout);
    const rate = (x) => (x.a + x.b ? `${Math.round((100 * x.b) / (x.a + x.b))}%` : "–");
    lines.push(`| ${judge} | ${all.a + all.b + all.t} | ${all.b} | ${all.a} | ${all.t} | ${rate(all)} | ${rate(ho)} |`);
  }
  return lines.join("\n");
}

const md = [
  `# GradientDeck benchmark: ${round}`,
  "",
  `Generated ${new Date().toISOString()}. Model and effort per run are in each run.json.`,
  "",
  judging(),
  "",
  metricTable((r) => !holdout.has(r.task), "All tasks except holdout"),
  "",
  metricTable((r) => holdout.has(r.task), "Holdout tasks"),
  "",
  systemTable(),
  "",
  convergence(),
].join("\n");
writeFileSync(join(runsDir, "report.md"), md);
console.log(md);
