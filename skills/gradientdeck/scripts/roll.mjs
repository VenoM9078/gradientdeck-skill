#!/usr/bin/env node
// The direction roll for New world work (references/direction.md).
//
//   node roll.mjs --job "..." --action "..." --candidates "name: reason | ... | name: reason"
//                 --photos "subject | subject" (or "none: reason"; required in persuade)
//                 [--page index] [--mode persuade|operate|read] [--register roll|bolder|safer]
//                 [--from KEY] [--seen "id, id, ..."] [--root DIR]
//   node roll.mjs photos "subject" ["subject" ...] [--n 3] [--orient landscape|portrait|square] [--root DIR]
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
//
// photos/photos.json lists openly licensed Wikimedia Commons photographs, details only:
// pages load each file from Commons itself and credit its author. `photos` ranks the list
// for each subject and prints ready image code; the roll does the same for --photos, and
// `check` counts the photographs on the page and their credits.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { homedir } from "node:os";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const skillRoot = join(here, "..");
const CARDS = "https://media.gradientdeck.com/cards/";
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

// Seeded so the same key repeats the same picks.
const seeded = (seed) => {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// The photo library. Words are matched loosely (plurals and endings dropped), and rare
// words count for more than common ones, so "cobbler" outweighs "workshop".
const PHOTOS = (() => {
  try {
    return JSON.parse(readFileSync(join(skillRoot, "photos", "photos.json"), "utf8")).photos || [];
  } catch {
    return [];
  }
})();
const STOP = new Set("a an the of and or in on at to for with by from into over under its it this that some their our your through near around while".split(" "));
const IRREGULAR = { loaves: "loaf", knives: "knife", leaves: "leaf", shelves: "shelf", children: "child", men: "man", women: "woman", people: "person" };
const stem = (w) => IRREGULAR[w] || w.replace(/ies$/, "y").replace(/(?<=\w{3})(ing|ed)$/, "").replace(/(?<=\w{2}[^s])s$/, "");
const rawWords = (text) =>
  String(text).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").split(/[^a-z0-9]+/).filter((w) => w.length > 1 && !STOP.has(w));
const wordsOf = (text) => rawWords(text).map(stem);
const indexed = PHOTOS.map((p) => ({ p, tags: new Set(wordsOf(p.tags.join(" ") + " " + p.cat)), about: new Set(wordsOf(p.subject)) }));
const df = new Map();
for (const x of indexed) for (const w of new Set([...x.tags, ...x.about])) df.set(w, (df.get(w) || 0) + 1);
const weight = (w) => Math.log((indexed.length + 1) / (1 + (df.get(w) || 0))) + 0.5;
const fileName = (url) => decodeURIComponent(String(url).split("/").pop()).replace(/^\d+px-/, "").replace(/_/g, " ");
const byFile = new Map(PHOTOS.map((p) => [fileName(p.file), p]));
const shapeOf = (p) => (p.w / p.h > 1.2 ? "landscape" : p.w / p.h < 0.85 ? "portrait" : "square");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
// Commons makes thumbnails at fixed widths only, and none wider than the original.
const thumb = (p, w) => `${p.file.replace("/wikipedia/commons/", "/wikipedia/commons/thumb/")}/${w}px-${p.file.split("/").pop()}`;
const imgTag = (p) => {
  const widths = [960, 1280, 1920].filter((w) => w < p.w);
  const src = widths.length ? thumb(p, widths.includes(1280) ? 1280 : widths[widths.length - 1]) : p.file;
  const set = widths.length ? ` srcset="${widths.map((w) => `${thumb(p, w)} ${w}w`).join(", ")}" sizes="(min-width: 900px) 50vw, 100vw"` : "";
  const focus = p.fp ? ` style="object-position: ${Math.round(p.fp[0] * 100)}% ${Math.round(p.fp[1] * 100)}%"` : "";
  return `<img src="${src}"${set} width="${p.w}" height="${p.h}" alt="${esc(p.subject)}" loading="lazy"${focus}>`;
};
const creditOf = (p) => `<a href="${p.page}">${esc(p.author)}</a> (${p.license}, Wikimedia Commons)`;

// Library photos already placed in this project's files, so another page gets different ones.
const photosInProject = (skipPage) => {
  const used = new Map();
  for (const file of sourceFiles) {
    if (skipPage && basename(file).replace(/\.[a-z0-9]+$/i, "").toLowerCase() === skipPage) continue;
    for (const m of read(file).matchAll(/https?:\/\/upload\.wikimedia\.org\/[^\s"'()<>,]+/g)) {
      const p = byFile.get(fileName(m[0]));
      used.set(m[0], { p, file, url: m[0] });
    }
  }
  return used;
};

const pickPhotos = (subject, { n = 3, orient = "", rand = Math.random, avoid = new Set() } = {}) => {
  // A word no photo carries is reported, and weighs little.
  const asked = wordsOf(subject).filter((w) => df.has(w));
  const unknown = rawWords(subject).filter((w) => !df.has(stem(w)));
  if (!asked.length) return { picks: [], unknown };
  // Unmatched words still count a little, so one common word can't carry a long request.
  const total = asked.reduce((sum, w) => sum + weight(w), 0) + unknown.length * 1.5;
  const wantsPeople = /\b(people|person|face|portrait|man|woman|child|crowd|team|chef|baker|worker|customer)s?\b/i.test(subject);
  const scored = indexed.map(({ p, tags, about }) => {
    let hit = 0;
    const missing = [];
    for (const w of asked) {
      if (tags.has(w)) hit += weight(w);
      else if (about.has(w)) hit += weight(w) * 0.5;
      else if (w.length > 3 && [...tags].some((t) => t.length > 3 && (t.startsWith(w) || w.startsWith(t)))) hit += weight(w) * 0.5;
      else missing.push(w);
    }
    let score = (hit / total) * 10 + (p.q - 2) * 0.6 + rand() * 0.8;
    if (p.people === "face" && !wantsPeople) score -= 3;
    if (avoid.has(p.id)) score -= 4;
    if (orient && shapeOf(p) !== orient) score -= 2;
    return { p, score, cover: hit / total, missing };
  });
  const picks = scored.filter((x) => x.cover >= 0.4).sort((a, b) => b.score - a.score).slice(0, n);
  return { picks, unknown };
};

const printPhotos = (subjects, opts) => {
  const shown = new Set(opts.avoid);
  for (const subject of subjects) {
    const { picks, unknown } = pickPhotos(subject, { ...opts, avoid: shown });
    picks.forEach(({ p }) => shown.add(p.id));
    const none = unknown.length ? ` (no photo is tagged "${unknown.join(", ")}")` : "";
    if (!picks.length) {
      say(`"${subject}": nothing in the library${none}. Ask again in other words (the place, the material, the action, the season), or set this part in type.`);
      continue;
    }
    say(`"${subject}"${none}`);
    picks.forEach(({ p, missing }, i) => {
      say(`  ${i + 1}. ${p.subject} · ${shapeOf(p)} ${p.w}x${p.h} · ${p.tone}, ${p.temp} · people: ${p.people}${missing.length ? ` · near miss, lacks: ${missing.join(", ")}` : ""}`);
      say(`     ${imgTag(p)}`);
      say(`     Credit: ${creditOf(p)}`);
    });
  }
};

// What to verify on the rendered page, by mode. Printed by `check`, one line each and
// unwrapped, so an agent that reads only the tail of the output still sees all of it.
const CHECKS = {
  persuade: [
    "The action is on the first screen at 1440 and 390, working: the control itself, not a link to it further down.",
    "The first screen shows this product's own thing (its object, its result, its action), not a centred headline over a row of cards. For software, the product's own interface or output is visible and working there, whatever the world.",
    "Photographs: each shows what its section is about and would leave a gap if deleted; each is big (half the width and about 440px tall, or full-bleed); all share one treatment that sits in the palette; no two photo sections touch; credits sit in the footer. A page about a place, food, a craft or an event leads with one.",
  ],
  operate: [
    "Layout, controls and navigation are the conventional ones for this screen; the world shows in type, palette, density and one signature detail.",
    "The main task is reachable without scrolling, and empty, loading and error states exist.",
  ],
  read: ["The reading column is calm (typography.md); the world lives in the frame around it."],
};
const COMMON_CHECKS = [
  "Type and color read easily at 390 and 1440: headline and body are comfortable, nothing shouts or fights, one accent leads the eye. If not, go back to the pairing that lost, or quiet the palette.",
  "The craft floor holds on the screenshots (references/craft.md, Verify before you finish): largest heading under about 6rem and four lines, two font families at most, one accent, no box inside a box, nothing cramped at 390, nothing from its Refuse list.",
  "Below the first screen, neighbouring sections differ in shape and density, every section is complete (example content labelled, none dropped), and the page ends on a real close with the action.",
  "Every picture says something: no frame holds only a label (\"9:16\", \"image\") in place of a picture, no row of identical marks counts what a number already says, no photo appears twice, and no two photos look like the same shot.",
  "Nothing invented: no quotes, ratings, counts, logos or product facts the user didn't supply; illustrative data is labelled.",
];

// How a page uses photographs. Printed by the roll and by `photos`.
const photoRules = () => {
  say(wrap("Ask yourself, for each photo, before it goes in: does it show what this section is about, or only something near it? Delete it in your head: does the page lose a fact (the place, the dish, the hands at the work, where the product is used)? If not, cut it or ask again in other words. Is it big enough to be seen? Is the page still more than its photos?"));
  say(wrap("How many, by what the page is about. A place, food or drink, a craft or an object, an event, the outdoors, people at work: a photograph is the largest thing on the first screen (full-bleed, or beside the copy at 60 to 75% of the screen tall), then two to four more, each on its subject. Software: the product's own interface leads; one or two photos of where it's used or what it handles, each passing the deletion test (a city at night or a laptop on a desk fails it). Docs, an API, a manifesto: one full-width band at most. You judge which this page is; an off-subject photo is cut, never kept to fill a count."));
  say(wrap("Placing them. Big or not at all: half the width and about 440px tall or more, or full-bleed; smaller only for a true set (three dishes, three rooms). Below the first screen, photos take at most a third of the page, and two photo sections never sit next to each other. Crop with aspect-ratio and object-fit: cover, keep the printed srcset and set sizes to the layout (100vw full-bleed). The first screen's photo loads first: drop loading=\"lazy\" and add fetchpriority=\"high\". Text over a photo sits on its calmest part over a scrim of the page's own dark color."));
  say(wrap("One treatment for every photo on the page, chosen to sit inside the direction's palette (wrap each img in .photo):"));
  for (const t of [
    "natural: no filter, for a direction that is already warm and real",
    "warm:    .photo img { filter: sepia(.18) saturate(1.1) }",
    "muted:   .photo img { filter: saturate(.55) contrast(.95) brightness(1.03) }",
    "mono:    .photo img { filter: grayscale(1) contrast(1.08) }",
    "tint:    .photo { background: var(--accent) }  .photo img { filter: grayscale(1); mix-blend-mode: multiply }",
    "duotone: .photo { position: relative; background: var(--light) }  .photo img { filter: grayscale(1) contrast(1.1); mix-blend-mode: multiply }  .photo::after { content: \"\"; position: absolute; inset: 0; background: var(--dark); mix-blend-mode: lighten }",
  ]) say(`  ${t}`);
  say(wrap("A tint or duotone flattens a pale subject (snow, a white wall) into an empty field; look at each photo through the treatment. Credits: one small line in the footer, \"Photographs:\" then each printed credit. Use only photos printed here or supplied by the user: never an image URL from memory, never a stock site (Unsplash, Pexels, Pixabay). No drawn SVG or CSS picture of the subject in a photo's place."));
};

if (args[0] === "photos") {
  const subjects = [];
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      if (!args[i].includes("=")) i++;
    } else subjects.push(...args[i].split("|").map((s) => s.trim()).filter(Boolean));
  }
  if (!subjects.length) {
    fail([
      'NO PHOTOS: name what the page should show, concretely: node roll.mjs photos "cobbler resoling a boot" "leather offcuts" [--n 3] [--orient landscape|portrait|square]',
      "Ask for the thing itself (the place, the material, the dish, hands at the work), not a mood.",
    ]);
  }
  const used = photosInProject(page);
  const avoid = new Set([...used.values()].filter((u) => u.p).map((u) => u.p.id));
  say(`GRADIENTDECK PHOTOS  ${PHOTOS.length} photographs from Wikimedia Commons · read all of this output, it is short`);
  if (avoid.size) say(`  Skipping ${avoid.size} already used on other pages of this project.`);
  printPhotos(subjects, { n: Math.max(1, Math.min(6, Number(opt("n", 3)) || 3)), orient: opt("orient", ""), avoid });
  say();
  photoRules();
  console.log(out.join("\n"));
  process.exit(0);
}

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
  // Photographs: <img> and CSS backgrounds that are photos (not SVG), library credits,
  // stock sites and Commons links that aren't in the library.
  const text = sourceFiles.map(read).join("\n");
  const photoCount =
    [...text.matchAll(/<(?:img|Image)\b[^>]*>/g)].filter((m) => !/\.svg\b|data:image\/svg/i.test(m[0])).length +
    [...text.matchAll(/url\(\s*["']?([^"')]+\.(?:jpe?g|png|webp|avif)[^"')]*)/gi)].length;
  const library = [...photosInProject("").values()];
  const known = [...new Map(library.filter((u) => u.p).map((u) => [u.p.id, u.p])).values()];
  const uncredited = known.filter((p) => !text.includes(p.author) && !text.includes(esc(p.author)));
  const stock = [...new Set([...text.matchAll(/(?:images\.)?(?:unsplash\.com|pexels\.com|pixabay\.com|picsum\.photos|placehold\.co|via\.placeholder\.com|placekitten\.com|loremflickr\.com)/gi)].map((m) => m[0].toLowerCase()))];
  const strays = library.filter((u) => !u.p && /\.(?:jpe?g|png|webp|tiff?)$/i.test(u.url)).map((u) => fileName(u.url || ""));
  const photoPlan = field("Photos");
  say(`  Photos: ${photoCount} on the page${known.length ? `, ${known.length} from the library` : ""}${photoPlan ? ` · plan: ${photoPlan}` : ""}.`);
  if (mode === "persuade" && !photoCount && !/^none\b/i.test(photoPlan)) {
    say(`  FIX: this page has no photographs. Run node "${join(here, "roll.mjs")}" photos ${photoPlan ? photoPlan.split("|").map((s) => `"${s.trim()}"`).join(" ") : '"<what the page should show>"'} and place the ones that pass the deletion test, or write "Photos: none: <reason>" in the plan if every picture here is the product's own interface or the page is about words.`);
  }
  if (uncredited.length) say(`  FIX: library photos with no credit on the page: ${uncredited.map((p) => p.author).join(", ")}. Add each printed credit to one small "Photographs:" line in the footer.`);
  if (stock.length) say(`  FIX: images from ${stock.join(", ")}. Replace them with library photos (roll.mjs photos) or the user's own.`);
  if (strays.length) say(`  FIX: Wikimedia images not in the library, likely written from memory: ${strays.slice(0, 4).join(", ")}. Replace them with photos the photos command prints.`);
  // Pictures that say less than they seem to: one photo placed twice, library photos close
  // enough to read as one picture, frames holding only a label, and rows of marks that count.
  const libIn = (s) => [...s.matchAll(/(?<![0-9a-z])[0-9a-f]\/[0-9a-f]{2}\/([^\s"'\/()<>,]+?\.(?:jpe?g|png|webp|tiff?))/gi)].map((m) => byFile.get(fileName(m[1]))).filter(Boolean);
  const placed = new Map();
  for (const m of text.matchAll(/<(?:img|Image)\b[^>]*>|url\([^)]*\)/g)) for (const p of new Set(libIn(m[0]))) placed.set(p, (placed.get(p) || 0) + 1);
  const twice = [...placed].filter(([, n]) => n > 1).map(([p]) => p.subject);
  if (twice.length) say(`  FIX: the same photo appears more than once: ${twice.join("; ")}. Use each photo once; a second spot needs a different photo or none.`);
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const alike = (a, b) => {
    const shared = a.tags.filter((t) => b.tags.includes(t)).length / Math.min(a.tags.length, b.tags.length);
    const [x, y] = [hex(a.color), hex(b.color)];
    return a.cat === b.cat && shared >= 0.4 && Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) < 45;
  };
  const inUse = [...new Set(libIn(text))];
  const pairs = inUse.flatMap((a, i) => inUse.slice(i + 1).filter((b) => alike(a, b)).map((b) => `${a.subject} / ${b.subject}`));
  if (pairs.length) say(`  FIX: these photos may read as the same picture: ${pairs.slice(0, 3).join("; ")}. Look at them side by side; if they do, swap one for a different subject (another step, place or person), or drop it.`);
  const frames = [...text.matchAll(/<(div|figure|span|i|b)\b[^>]*>\s*(?:<(span|b|em|small|p)\b[^>]*>)?\s*((?:1|2|3|4|5|9|16|21)\s*[:×]\s*(?:1|2|3|4|5|9|16)|image|photo|picture|video|placeholder|thumbnail)\s*(?:<\/\2>)?\s*<\/\1>/gi)].map((m) => m[3]);
  if (frames.length) say(`  FIX: ${frames.length} frame(s) hold only a label (${[...new Set(frames)].slice(0, 3).join(", ")}) where a picture should be. Put the real thing in each (a photo, the product's own output, the example cropped to that shape) or remove the frames.`);
  const marks = [...text.matchAll(/<(\w+)\b[^>]*\bdata-(?:n|count|total)=["']?\d+[^>]*>\s*<\/\1>/gi)].length +
    [...text.matchAll(/(<(\w+)\b[^>]*\bclass=[^>]*>\s*<\/\2>)(?:\s*\1){4,}/g)].length;
  if (marks) say(`  FIX: ${marks} row(s) of identical marks, likely standing for a number. If the number is already written, delete the marks; a count is read from the figure, not from dots or squares.`);
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
const example = 'node roll.mjs --job "what the visitor must understand or do" --action "the working control on the first screen" --candidates "<world name>: <how it carries the job, and where the product is seen working on its first screen> | <world name>: <reason> | ..." --photos "<thing to show> | <thing to show>" --mode persuade';
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
    "NO ROLL: every candidate needs a reason after a colon: how this world carries the visitor's job or the product's mechanism, and where the product is seen working on its first screen. Colors and type are not a reason.",
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
// What the page should show, named before the direction is picked, so photographs are
// part of the plan rather than an afterthought. Required on persuade pages.
const photos = String(opt("photos", field("Photos"))).trim();
const noPhotos = /^none\b/i.test(photos);
if (mode === "persuade" && (!photos || (noPhotos && photos.replace(/^none\s*:?\s*/i, "").split(/\s+/).filter(Boolean).length < 3))) {
  fail([
    noPhotos ? "NO ROLL: --photos \"none\" needs its reason after a colon, in a few words." : `NO ROLL: pass --photos: two to four things this page should show in photographs, from the brief, separated by |.`,
    'Name the thing itself: the place, the material, the dish, hands at the work, where the software is used. Example: --photos "cobbler resoling a boot | leather offcuts on a bench | old shopfront on a terraced street"',
    'Or --photos "none: <the reason>", when the page is about words or the product\'s own interface carries every picture.',
    "If you can ask the user, ask once whether they have photos of their own; theirs win every slot.",
  ]);
}
const photoSubjects = noPhotos ? [] : photos.split("|").map((s) => s.trim()).filter(Boolean);
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
  ...(photos ? [`Photos: ${photos}`] : []),
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
  "Own system: ___ (palette roles, type voices, surfaces, corners and line weights: specific enough that the page is recognisable with every word removed)",
  "Story: ___ (section by section, what the visitor understands, believes and does, where the pace turns dense or quiet, and how the page closes)",
  "Signature: ___ (the one interaction or motion moment, and the web technique that builds it)",
  ...(photoSubjects.length ? ["Pictures: ___ (each photograph you placed: which, where and how big; the one treatment; the credit line in the footer)"] : []),
  "Example content: ___ (every sample entry, name, figure or image you authored, labelled on the page as an example, for the user to replace)",
  "Finish: done means rendered at 1440, 768 and 390, `check` run, a fresh reviewer's P0/P1 findings fixed, and every example listed in the report.",
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
say(`Repeat this roll: node roll.mjs --page ${page} --candidates ${quoted}${photos ? ` --photos "${photos.replace(/"/g, "'")}"` : ""} --mode ${mode} --register ${register} --from ${key}`);
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
    say(`   Reference images: ${CARDS}${w.id}.webp · ${CARDS}${w.id}-hero.webp`);
  });
  say(wrap("A re-roll of this page skips these automatically; the plan file remembers them."));
  say();
  if (register !== "bolder") {
    say("HOW TO USE THE DEALT WORLDS");
    say(wrap("Fuse each world with the product before judging it: imagine this product's page built in that world's system, with the product's real facts. Then compare each fused result with the candidate you're building, on two things only: would the audience recognise it as theirs, and is the product clearer. Write one verdict per world in the plan before borrowing anything: wins (better on both; it becomes the build), close (better on one), or declined (worse on both)."));
    say(wrap("A world that doesn't win still gives something. Name one discipline from its system that your direction lacks (a grid rule, a way states behave, a single input that drives the page, a rule about what never disappears) and raise your direction to match. Take the discipline, never the surface: a color, a typeface, a button style or an ornament is the world's clothes, and one world owns the page."));
    say(wrap("Open the reference images of any world that wins or comes close, and of the world you build. They show the finish level the world reaches when made well: hold your page to that level of craft, never to their layout."));
    say();
  }
}

say("COMMIT");
say(wrap("Open the plan file and fill every blank before any code. Build the direction you were given, not a safer reading of it. The world shows across the page (its object, its structure, its colors), not as one sticker on a generic page; the ground can still be light and quiet. Choose type and color on a render: put the real headline, a paragraph and the main button in two font pairings into a throwaway specimen file, render it at desktop and phone width, and keep the one that reads more easily and feels more like the product (typography.md, color.md). A face on the overused list in tells.md needs a reason written in the plan that no other face meets; the subject's cliche (books want a serif, tech wants mono) is not a reason. Light grounds are allowed; a dark or loud palette picked only to look different is a new default, not a bolder page."));
say();

say("BEFORE ANY CODE");
say(wrap("Read the craft floor now, even if you think you know it. It sets type, color, space and boxes for this mode, and the check at the end verifies them:"));
say(`  ${join(skillRoot, "references", "craft.md")}`);
say();

say(`COMPOSITION (${mode})`);
if (mode === "persuade") {
  say(wrap("The world carries the page; it is never a picture on it. A first screen painted as the world, with an ordinary page underneath, is a poster, not a website. Both ends fail: the painted poster, and the generic page (headline, subline, button, then a row of equal cards). Copy beside a picture of the product is fine when the picture is this product's own thing, shown working."));
  say(wrap("If the world is an object, take the skeleton from it: an album of numbered slots, a sheet of linked creases, a rack of spinning pockets, a page of interlocked letters. The page is that one object seen once, at one scale; more content goes on its own surfaces or the next one down, never on copies of it."));
  say(wrap("If the world is an interface, a notation or a system of light and motion, and the product is software, the skeleton is the product's own interface shown working, with realistic example data labelled as an example. Never wrap software in a paper object. The world sets the interface's type, surfaces, how its states change, and one signature visual built with the real web technique (canvas, SVG geometry, animated lines, a shader), not a static picture of it."));
  say(wrap("Author the page whole. Every section the visitor needs ships, filled with content you write at full quality: sample entries, names, figures and images in a demo are design material, labelled as an example where a visitor could take them as real. Only claims stay uninvented (prices, customers, quotes, results). A section is never dropped because its content wasn't supplied."));
  say(wrap("Pace the scroll. Below the first screen, vary density, scale, imagery and quiet inside one system: a dense passage earns a quiet one, a big image earns a run of small type, and no two neighbouring sections share a shape. The page ends on a real close, the action again in working form, not a fading footer."));
  say(wrap(`The first screen states the offer in one line and holds the action, "${action}", in its working form inside the world's object or the product's interface, not as a link to it further down. It proves one thing only this product can, so a visitor knows what to do about "${job}" within seconds. Every part still works as a page: links read as links, text is set text, the action is unmistakable.`));
} else if (mode === "operate") {
  say(wrap(`This is a working screen. The candidate lends type, palette and one small signature detail, nothing else: never the layout, never its objects drawn as containers or panels. Layout, controls and navigation are the conventional ones (apps-and-data.md): rows and tables over cards, one level of container. The main task, "${action}", is reachable without scrolling.`));
} else {
  say(wrap("The world sets the frame around the reading column, the type pairing and the palette. The column itself stays calm: measure, size and rhythm follow typography.md."));
}
say();

if (photoSubjects.length) {
  say("PHOTOGRAPHS");
  say(wrap(`Picked from ${PHOTOS.length} openly licensed Wikimedia Commons photographs for what you named. Choose the ones that fit the direction you're building; if the user gives you their own, theirs replace these. To ask again in other words: node "${join(here, "roll.mjs")}" photos "<subject>" [--orient portrait]`));
  const used = photosInProject(page);
  printPhotos(photoSubjects, { n: 3, rand: seeded(parseInt(key, 16) ^ 0x51ed), avoid: new Set([...used.values()].filter((u) => u.p).map((u) => u.p.id)) });
  photoRules();
  say();
}

say("PRESENT");
say(wrap("If you can ask the user (a question tool, or a conversation where waiting is fine): show the direction you were given, fully committed, in a few lines (its world, thesis, palette, type, and what the first screen looks like). Add your pick if the roll allowed one, any world that won or came close, and three exits: re-roll bolder, re-roll safer, or the category standard played straight. Ask in the same message whether they have photos of their own (theirs replace the library's). Never recommend the standard; it's the user's door, not yours. Then build what they choose."));
say(wrap("If you can't ask: build the direction you were given, then end your report with one line offering a bolder or safer re-roll."));
say();

say("BEFORE YOU FINISH");
say(wrap("Render the page at 1440, 768 and 390, then run this. It prints the plan and the checks to run against your screenshots:"));
say(`  node "${join(here, "roll.mjs")}" check --page ${page} --root "${root}"`);

console.log(out.join("\n"));
