#!/usr/bin/env node
// The direction roll for New world work (references/direction.md).
//
//   node roll.mjs --job "..." --action "..." --candidates "name: reason | ... | name: reason"
//                 [--page index] [--mode persuade|operate|read] [--register roll|bolder|safer]
//                 [--from KEY] [--seen "id, id, ..."] [--root DIR]
//   node roll.mjs check [--page index] [--root DIR]
//
// --candidates is the agent's own ranked list, best first, separated by |, each with a
// reason after a colon saying how it carries the visitor's job. --job is what the visitor
// must understand or do; --action is the working control the first screen holds. The roll
// refuses to run without them, so the thinking is fixed before anything is picked.
//
// Picks which of the agent's own ranked candidates gets built, deals a few worlds from
// worlds/worlds.json as challengers, prints the rules for using them, and saves a plan for
// the page to .gradientdeck/pages/<page>.md in the project. Rolling the same page again
// replaces that file whole; the job, action and worlds already dealt carry over. `check`
// prints the saved plan, flags blanks left in it, and lists what to verify on the render.
// Local only: no network, no dependencies; the plan file is the only thing written.
//
// Card images aren't stored in worlds.json: each world's live at
// media.gradientdeck.com/cards/<id>.webp and <id>-hero.webp.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { homedir } from "node:os";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const skillRoot = join(here, "..");
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i !== -1 && args[i + 1] && !args[i + 1].startsWith("--")) return args[i + 1];
  const eq = args.find((a) => a.startsWith(`--${name}=`));
  return eq ? eq.slice(name.length + 3) : fallback;
};
const fail = (lines) => {
  console.log(lines.join("\n"));
  process.exit(2);
};

// The plan belongs to the project, never the skill. Agents sometimes run the roll from
// inside the skill folder, so step out of it (past .claude/skills and the like).
const inside = (dir, parent) => {
  const rel = relative(parent, dir);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
};
const projectRoot = () => {
  if (opt("root")) return resolve(opt("root"));
  const cwd = process.cwd();
  if (!inside(cwd, skillRoot)) return cwd;
  let dir = dirname(skillRoot);
  while ((basename(dir) === "skills" || basename(dir).startsWith(".")) && dirname(dir) !== dir) dir = dirname(dir);
  if (resolve(dir) === resolve(homedir()) || dirname(dir) === dir) {
    fail(["NO ROLL: run this from the project folder, or pass --root <project folder>."]);
  }
  return dir;
};
const root = projectRoot();
const page = String(opt("page", "index")).replace(/\.[a-z0-9]+$/i, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "index";
const planPath = join(root, ".gradientdeck", "pages", `${page}.md`);
const prior = existsSync(planPath) ? readFileSync(planPath, "utf8") : "";
const field = (name) => (prior.match(new RegExp(`^${name}: (.*)$`, "m")) || [])[1]?.trim() || "";

// A light read of the project's own files: which icon set it already uses. Detection only;
// nothing here recommends a set.
const SKIP = new Set(["node_modules", ".git", ".gradientdeck", ".claude", ".agents", ".codex", ".cursor", ".github", "dist", "build", "out", ".next", ".nuxt", ".svelte-kit", "coverage", "vendor"]);
const sourceFiles = (() => {
  const found = [];
  const walk = (dir, depth) => {
    if (depth > 5 || found.length > 400) return;
    let entries = [];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (!SKIP.has(e.name)) walk(join(dir, e.name), depth + 1);
      } else if (/\.(html?|css|scss|less|jsx?|tsx?|vue|svelte|astro)$/i.test(e.name)) found.push(join(dir, e.name));
    }
  };
  walk(root, 0);
  return found;
})();
const read = (file) => {
  try {
    return readFileSync(file, "utf8");
  } catch {
    return "";
  }
};
const ICON_PACKAGE = /^(lucide|@lucide\/|@heroicons\/|heroicons|@phosphor-icons\/|phosphor-|@tabler\/icons|react-icons|@iconify|iconify|@fortawesome\/|font-awesome|@mdi\/|@radix-ui\/react-icons|bootstrap-icons|remixicon|feather-icons|react-feather|ionicons|@ionic\/icons|material-symbols|@material-symbols\/|@material-design-icons\/|@mui\/icons-material|unplugin-icons|@primer\/octicons|@carbon\/icons|boxicons|iconoir|@hugeicons\/|@untitledui\/icons|simple-icons)/;
const iconSets = (() => {
  const sets = new Set();
  const pkg = read(join(root, "package.json"));
  if (pkg) {
    try {
      const deps = { ...JSON.parse(pkg).dependencies, ...JSON.parse(pkg).devDependencies };
      Object.keys(deps).filter((d) => ICON_PACKAGE.test(d)).forEach((d) => sets.add(d));
    } catch {}
  }
  for (const file of sourceFiles.filter((f) => /\.html?$/i.test(f))) {
    for (const m of read(file).matchAll(/(?:src|href)=["'][^"']*?(lucide|heroicons|phosphor|tabler[-/]icons|iconify|font-?awesome|material-symbols|bootstrap-icons|remixicon|feather|ionicons|iconoir)[^"']*["']/gi)) sets.add(`${m[1].toLowerCase()} (from a CDN link)`);
  }
  if (["icons", "src/icons", "assets/icons", "src/assets/icons", "public/icons", "components/icons", "src/components/icons"].some((d) => existsSync(join(root, d)))) sets.add("the project's own icons folder");
  return [...sets];
})();
const iconLine = iconSets.length
  ? `this project already uses ${iconSets.join(", ")}: every icon comes from it, imported the way the code already does`
  : "no icon set found in this project; if the page needs icons, use one set, never emoji or Unicode symbols";

const out = [];
const say = (text = "") => out.push(text);
const wrap = (text, indent = "  ") => {
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if ((line + " " + word).trim().length > 88) {
      lines.push(indent + line.trim());
      line = word;
    } else line += " " + word;
  }
  if (line.trim()) lines.push(indent + line.trim());
  return lines.join("\n");
};

// What to verify on the rendered page, by mode. Printed by `check`, one line each and
// unwrapped, so an agent that reads only the tail of the output still sees all of it.
const CHECKS = {
  persuade: [
    "The action is on the first screen at 1440 and 390, working: the control itself, not a link to it further down.",
    "The first screen shows this product's own thing (its object, its result, its action), not a centred headline over a row of cards.",
  ],
  operate: [
    "Layout, controls and navigation are the conventional ones for this screen; the world shows in type, palette, density and one signature detail.",
    "The main task is reachable without scrolling, and empty, loading and error states exist.",
  ],
  read: ["The reading column is calm (typography.md); the world lives in the frame around it."],
};
const COMMON_CHECKS = [
  "Type and color read easily at 390 and 1440: headline and body are comfortable, nothing shouts or fights, one accent leads the eye. If not, go back to the pairing that lost, or quiet the palette.",
  "The craft floor holds on the screenshots (references/craft.md, Verify before you finish): largest heading under about 6rem and four lines, two font families at most, one accent, no box inside a box, nothing cramped at 390.",
  "Nothing invented: no quotes, ratings, counts, logos or product facts the user didn't supply; illustrative data is labelled.",
];

if (args[0] === "check") {
  if (!prior) {
    fail([
      `NO PLAN for page "${page}" at ${planPath}.`,
      "New world work runs the roll first (direction.md). For Extend or New surface, review against review.md instead.",
    ]);
  }
  const mode = (prior.match(/· mode (\w+)/) || [])[1] || "persuade";
  const open = prior.split("\n").filter((l) => l.includes("___"));

  const firstScreen = field("First screen").replace(/\s*\(spatially.*$/, "");
  say(`GRADIENTDECK PLAN CHECK  page ${page} · plan ${planPath} · read all of this output, it is short`);
  say(`Job: ${field("Job")} · Action: ${field("Action")}`);
  if (firstScreen && !firstScreen.startsWith("___")) say(`Planned first screen: ${firstScreen}`);
  say("VERIFY ON THE RENDER: answer each from the screenshots, not from the code; fix every no.");
  [...(CHECKS[mode] || CHECKS.persuade), ...COMMON_CHECKS].forEach((c, i) => say(`  ${i + 1}. ${c}`));
  say("FRESH EYES: if you can start a subagent, give it the request, this plan's path, the three screenshots and references/review.md (none of your reasoning); fix its P0/P1 findings. That is your second round.");
  say("FOUND IN THE PROJECT FILES");
  say(`  Icons: ${iconLine}.`);
  if (open.length) say(`  FIX: plan lines still blank: ${open.map((l) => l.split(":")[0].replace(/^[-\s]+/, "")).join(", ")}. Fill them with what you built, or fix the page to match the plan.`);
  say("THEN: fix every no and every FIX, and render all three widths again.");
  console.log(out.join("\n"));
  process.exit(0);
}

const list = String(opt("candidates", ""))
  .split("|")
  .map((item) => item.trim())
  .filter(Boolean)
  .map((item) => {
    const at = item.indexOf(":");
    return at === -1 ? { name: item, reason: "" } : { name: item.slice(0, at).trim(), reason: item.slice(at + 1).trim() };
  });
const job = String(opt("job", field("Job"))).trim();
const action = String(opt("action", field("Action"))).trim();
const example = 'node roll.mjs --job "what the visitor must understand or do" --action "the working control on the first screen" --candidates "<world name>: <how it carries the job> | <world name>: <reason> | ..." --mode persuade';
if (list.length < 5) {
  fail([
    "NO ROLL: write your ranked candidates first and pass them in, best first, separated by |.",
    `Example: ${example}`,
    `Got ${list.length} name${list.length === 1 ? "" : "s"}. Seven is the target; five is the minimum.`,
  ]);
}
const thin = list.filter((c) => c.reason.split(/\s+/).filter(Boolean).length < 3);
if (thin.length) {
  fail([
    "NO ROLL: every candidate needs a reason after a colon: how this world carries the visitor's job or the product's mechanism, in a few words. Colors and type are not a reason.",
    `Missing or too short for: ${thin.map((c) => `"${c.name}"`).join(", ")}`,
    `Example: ${example}`,
  ]);
}
if (!job || !action) {
  fail([
    `NO ROLL: pass ${!job ? "--job" : ""}${!job && !action ? " and " : ""}${!action ? "--action" : ""}.`,
    "--job is the one thing a visitor must understand or do. --action is the control that does it, in working form on the first screen (the order form, the install command, the booking slot, the call button).",
    `Example: ${example}`,
  ]);
}

const candidates = list.length;
const mode = ["persuade", "operate", "read"].includes(opt("mode")) ? opt("mode") : "persuade";
const register = ["roll", "bolder", "safer"].includes(opt("register")) ? opt("register") : "roll";
const seen = new Set(
  [opt("seen", ""), field("Seen")]
    .join(",")
    .split(/[\s,|]+/)
    .filter(Boolean),
);
const key = /^[0-9a-f]{8}$/.test(opt("from", "")) ? opt("from") : randomBytes(4).toString("hex");

// Seeded so `--from KEY` repeats the same roll.
let state = parseInt(key, 16) ^ (register.length * 2654435761) ^ (candidates * 40503);
const random = () => {
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = (n) => 1 + Math.floor(random() * n);
const quoted = `"${list.map((c) => `${c.name}: ${c.reason}`).join(" | ").replace(/"/g, "'")}"`;

let worlds = [];
try {
  worlds = JSON.parse(readFileSync(join(here, "..", "worlds", "worlds.json"), "utf8"));
} catch {
  worlds = [];
}
// How many cards of each tier a hand may hold, by mode. Persuade takes any tier.
// Working screens skip atmosphere worlds, which turn a tool into a costume of
// itself, and take one interaction world at most. Reading pages skip interaction
// worlds, since the column's controls stay standard, and take one atmosphere
// world at most for the frame.
const TIER_CAPS = {
  persuade: { graphic: Infinity, interaction: Infinity, atmosphere: Infinity },
  operate: { graphic: Infinity, interaction: 1, atmosphere: 0 },
  read: { graphic: Infinity, interaction: 0, atmosphere: 1 },
};

// Each card is drawn evenly from the worlds still allowed, so tiers come up in
// proportion to their size. If every card so far shares a tier, the last one comes
// from another, so a hand never sits in a single tier. A family already in the
// hand is skipped while any other family is left.
const deal = (count) => {
  const caps = TIER_CAPS[mode];
  const pool = worlds.filter((w) => !seen.has(w.id) && (caps[w.tier] ?? 0) > 0);
  const hand = [];
  while (pool.length && hand.length < count) {
    const held = (tier) => hand.filter((w) => w.tier === tier).length;
    const tiers = new Set(hand.map((w) => w.tier));
    const families = new Set(hand.map((w) => w.family));
    let from = pool.filter((w) => held(w.tier) < caps[w.tier]);
    const last = hand.length > 0 && hand.length === count - 1 && tiers.size === 1;
    const others = last ? from.filter((w) => !tiers.has(w.tier)) : [];
    if (others.length) from = others;
    const fresh = from.filter((w) => !families.has(w.family));
    if (fresh.length) from = fresh;
    if (!from.length) break;
    const world = from[Math.floor(random() * from.length)];
    pool.splice(pool.indexOf(world), 1);
    hand.push(world);
  }
  return hand;
};

// Both registers pick from the top three: lower-ranked ideas are, by the agent's own
// ranking, the ones the audience is least likely to recognise. Safer differs in dealing
// no worlds and building straight.
const assigned = register === "bolder" ? pick(candidates) : pick(Math.min(3, candidates));
// Working screens keep their conventional layout, so the roll deals them no worlds to
// fuse: the pick lends type, palette and one small detail only.
const hand = register === "safer" || (mode === "operate" && register !== "bolder") ? [] : deal(register === "bolder" ? 3 : Math.min(4, worlds.length));
const built = register === "bolder" && hand.length ? `dealt world 1, "${hand[0].name}", fused with the product` : `"${list[assigned - 1].name}" (#${assigned} of your top three; first-ranked was "${list[0].name}")`;

// The plan file. A new roll for this page replaces it whole; repeating the exact same
// roll leaves a plan the agent may already have filled in alone.
const plan = [
  `# Page plan: ${page}`,
  "",
  "<!-- Written by the GradientDeck roll. Rolling this page again replaces the whole file. Development notes only: never copy any of this into the page, and keep .gradientdeck/ out of what you deploy. -->",
  "",
  `Key: ${key} · register ${register} · mode ${mode}`,
  `Build: ${built}`,
  `Job: ${job}`,
  `Action: ${action}`,
  `Seen: ${[...seen, ...hand.map((w) => w.id)].join(", ")}`,
  "",
  "## Ranked candidates",
  ...list.map((c, i) => `${i + 1}. ${c.name}: ${c.reason}`),
  "",
  "## Fill in before writing code",
  "Replace every blank with your decision. `node roll.mjs check` lists any left.",
  "",
  "Thesis: ___ (X becomes Y, and the category page it refuses)",
  "First screen: ___ (spatially, as if to someone drawing it: what sits where, the offer line, where the action sits and how it works)",
  "Type and color: ___ (the two font pairings you rendered, which won and why; ground, text and accent colors, and the setting that decided light or dark)",
  ...(hand.length && register !== "bolder"
    ? ["", "Verdicts (wins / close / declined, then the one discipline raised):", ...hand.map((w) => `- ${w.name}: ___`)]
    : []),
  "",
];
const samePlan = prior && field("Key") === `${key} · register ${register} · mode ${mode}`;
if (!samePlan) {
  mkdirSync(dirname(planPath), { recursive: true });
  writeFileSync(planPath, plan.join("\n"));
}

say(`GRADIENTDECK DIRECTION ROLL  key ${key} · mode ${mode} · register ${register} · ${candidates} candidates`);
say(`Repeat this roll: node roll.mjs --page ${page} --candidates ${quoted} --mode ${mode} --register ${register} --from ${key}`);
say(samePlan ? `PLAN: already saved for this roll at ${planPath}; left as it is.` : `PLAN: saved to ${planPath}${prior ? ", replacing the previous plan for this page" : ""}.`);
say();
say("YOUR RANKED LIST, AS SUBMITTED");
list.forEach((c, i) => say(`  ${i + 1}. ${c.name}: ${c.reason}`));
say(wrap("This list is now fixed. Don't reorder or rename it to change what the roll picked."));
say();

if (register === "bolder") {
  say("BUILD: dealt world 1, fused with the product.");
  say(wrap("The user asked for bolder. None of your own candidates is built this round. Fuse world 1 below with the product: the world supplies the form and its system, the product supplies every fact, and clarity wins any conflict. Build it at full commitment. If world 1 cannot carry the product's job at all (say why in one factual sentence), use world 2."));
} else if (register === "safer") {
  say(`BUILD: "${list[assigned - 1].name}" (#${assigned} of your top three).`);
  say(wrap(`The user asked for safer. Build "${list[assigned - 1].name}" from the top three of your ranked list, executed straight and at full craft. If the user asked for the category standard instead, build the canon: name two or three real products in the category it's measured against, and match their level without irony or smuggled quirks. Safer never means less finished.`));
} else {
  say(`BUILD: "${list[assigned - 1].name}" (#${assigned} of your top three).`);
  say(wrap(`Build "${list[assigned - 1].name}". This is the roll, not a suggestion: your first-ranked candidate is the one every run would build, so the roll decides. Swap only for a factual reason you can name (it cannot carry the job or the action below). Preferring another idea is not a reason.`));
  if (assigned !== 1) say(wrap(`When you present this to the user, you may add one option for your first-ranked candidate ("${list[0].name}"), labelled as your pick, with an honest line saying it's the familiar choice. Never list it first.`));
}
say();

if (hand.length) {
  say("DEALT WORLDS");
  hand.forEach((w, i) => {
    say(`${i + 1}. ${w.name} (${w.tier})`);
    say(wrap(`Form: ${w.form}`, "   "));
    say(wrap(`Spark: ${w.spark}`, "   "));
    say("   System:");
    for (const [label, text] of [
      ["Palette and material", w.grammar.palette],
      ["Type and composition", w.grammar.type],
      ["Structure and navigation", w.grammar.topology],
      ["Controls and states", w.grammar.states],
      ["Phones and motion", w.grammar.responsive],
    ]) say(wrap(`- ${label}: ${text}`, "     "));
    say(wrap(`On the web: ${w.web}`, "   "));
  });
  say(wrap("A re-roll of this page skips these automatically; the plan file remembers them."));
  say();
  if (register !== "bolder") {
    say("HOW TO USE THE DEALT WORLDS");
    say(wrap("Fuse each world with the product before judging it: imagine this product's page built in that world's system, with the product's real facts. Then compare each fused result with the candidate you're building, on two things only: would the audience recognise it as theirs, and is the product clearer. Write one verdict per world in the plan before borrowing anything: wins (better on both; it becomes the build), close (better on one), or declined (worse on both)."));
    say(wrap("A world that doesn't win still gives something. Name one discipline from its system that your direction lacks (a grid rule, a way states behave, a single input that drives the page, a rule about what never disappears) and raise your direction to match. Take the discipline, never the surface: a color, a typeface, a button style or an ornament is the world's clothes, and one world owns the page."));
    say();
  }
}

say("COMMIT");
say(wrap("Open the plan file and fill every blank before any code. Build the direction you were given, not a safer reading of it. The world shows across the page (its object, its structure, its colors), not as one sticker on a generic page; the ground can still be light and quiet. Choose type and color on a render: put the real headline, a paragraph and the main button in two font pairings into a throwaway specimen file, render it at desktop and phone width, and keep the one that reads more easily and feels more like the product (typography.md, color.md). Common faces and light grounds are allowed; a dark or loud palette, or an odd face, picked only to look different is worse, not bolder."));
say();

say("BEFORE ANY CODE");
say(wrap("Read the craft floor now, even if you think you know it. It sets type, color, space and boxes for this mode, and the check at the end verifies them:"));
say(`  ${join(skillRoot, "references", "craft.md")}`);
say();

say(`COMPOSITION (${mode})`);
if (mode === "persuade") {
  say(wrap("The world carries the page; it is never a picture on it. A first screen painted as the world, with an ordinary page underneath, is a poster, not a website. Both ends fail: the painted poster, and the generic page (headline, subline, button, then a row of equal cards). Copy beside a picture of the product is fine when the picture is this product's own thing, shown working."));
  say(wrap("Take the skeleton from the world's own object: an album of numbered slots, a sheet of linked creases, a rack of spinning pockets, a page of interlocked letters. When the world is an object, the page is that one object seen once, at one scale; more content goes on its own surfaces or the next one down, never on copies of it."));
  say(wrap(`The first screen states the offer in one line and holds the action, "${action}", in its working form inside the world's object, not as a link to it further down. It proves one thing only this product can, so a visitor knows what to do about "${job}" within seconds. Every part still works as a page: links read as links, text is set text, the action is unmistakable.`));
} else if (mode === "operate") {
  say(wrap(`This is a working screen. The candidate lends type, palette and one small signature detail, nothing else: never the layout, never its objects drawn as containers or panels. Layout, controls and navigation are the conventional ones (apps-and-data.md): rows and tables over cards, one level of container. The main task, "${action}", is reachable without scrolling.`));
} else {
  say(wrap("The world sets the frame around the reading column, the type pairing and the palette. The column itself stays calm: measure, size and rhythm follow typography.md."));
}
say();

say("PRESENT");
say(wrap("If you can ask the user (a question tool, or a conversation where waiting is fine): show the direction you were given, fully committed, in a few lines (its world, thesis, palette, type, and what the first screen looks like). Add your pick if the roll allowed one, any world that won or came close, and three exits: re-roll bolder, re-roll safer, or the category standard played straight. Never recommend the standard; it's the user's door, not yours. Then build what they choose."));
say(wrap("If you can't ask: build the direction you were given, then end your report with one line offering a bolder or safer re-roll."));
say();

say("BEFORE YOU FINISH");
say(wrap("Render the page at 1440, 768 and 390, then run this. It prints the plan and the checks to run against your screenshots:"));
say(`  node "${join(here, "roll.mjs")}" check --page ${page} --root "${root}"`);

console.log(out.join("\n"));
