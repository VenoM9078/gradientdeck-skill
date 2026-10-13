// Checks the skill against AUTHORING.md: size budgets, references that exist,
// links from SKILL.md, frontmatter, and banned content.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillDir = join(root, "skills", "gradientdeck");
const refDir = join(skillDir, "references");

// Rough token estimate: about 4 characters per token for English prose.
const tokens = (text) => Math.round(text.length / 4);
const BUDGET = { skill: 3000, reference: 2300 };

// Named faces we never recommend. Mentioning one is allowed only in tells.md,
// where it describes a generic default.
const NAMED_FACES = [
  "Inter", "Roboto", "Poppins", "Montserrat", "Space Grotesk", "Fraunces",
  "Playfair", "DM Sans", "Geist", "Instrument Serif", "Manrope", "Satoshi",
];
const BANNED_WORDS = ["elevate", "seamless", "stunning", "delightful", "unleash", "game-changer"];

const errors = [];
const warn = (msg) => errors.push(msg);

const skillPath = join(skillDir, "SKILL.md");
const skill = readFileSync(skillPath, "utf8");
if (!skill.startsWith("---\nname: gradientdeck\ndescription: ")) warn("SKILL.md: frontmatter must start with name and description");
const description = (skill.match(/^description: (.*)$/m) || [])[1] || "";
if (description.length > 1024) warn(`SKILL.md: description is ${description.length} chars (max 1024)`);
if (tokens(skill) > BUDGET.skill) warn(`SKILL.md: ~${tokens(skill)} tokens (budget ${BUDGET.skill})`);

const refs = existsSync(refDir) ? readdirSync(refDir).filter((f) => f.endsWith(".md")) : [];
const linked = [...new Set([...skill.matchAll(/`([a-z-]+\.md)`/g)].map((m) => m[1]))];
for (const name of linked) {
  if (!refs.includes(name)) warn(`SKILL.md links ${name}, which does not exist in references/`);
}
for (const name of refs) {
  if (!linked.includes(name)) warn(`references/${name} is not linked from SKILL.md`);
}

const report = [];
for (const name of ["SKILL.md", ...refs.map((r) => `references/${r}`)]) {
  const text = readFileSync(join(skillDir, name), "utf8");
  const t = tokens(text);
  report.push([name, t]);
  if (name !== "SKILL.md" && t > BUDGET.reference) warn(`${name}: ~${t} tokens (budget ${BUDGET.reference})`);
  if (!name.endsWith("tells.md")) {
    for (const face of NAMED_FACES) {
      if (new RegExp(`\\b${face}\\b`).test(text)) warn(`${name}: names the typeface "${face}"`);
    }
  }
  for (const word of BANNED_WORDS) {
    // "delightful" etc. may appear only where the voice rules list them.
    if (new RegExp(`\\b${word}\\b`, "i").test(text) && !/hype|banned|AVOID|filler/i.test(text.slice(Math.max(0, text.search(new RegExp(word, "i")) - 200), text.search(new RegExp(word, "i")))))
      warn(`${name}: uses the word "${word}"`);
  }
  if (/https?:\/\//.test(text)) warn(`${name}: contains a URL (the skill must not fetch remote instructions)`);
}

const total = report.reduce((sum, [, t]) => sum + t, 0);
console.log(report.map(([n, t]) => `${String(t).padStart(5)}  ${n}`).join("\n"));
console.log(`${String(total).padStart(5)}  total (if every file were loaded)`);
if (errors.length) {
  console.error("\n" + errors.map((e) => "x " + e).join("\n"));
  process.exit(1);
}
console.log("\nok");
