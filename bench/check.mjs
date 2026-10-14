// Renders every run of a round and measures it.
//   node bench/check.mjs --round r1 [--force]
// Writes check.json, shot-1440.jpg and shot-390.jpg next to each run.json.
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { launchChrome } from "./lib/chrome.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = process.env.GD_BENCH_ROOT || "E:/gd-bench";
const args = process.argv.slice(2);
const round = (args.find((a) => a.startsWith("--round=")) || "--round=r1").split("=")[1];
const force = args.includes("--force");
const spec = JSON.parse(readFileSync(join(here, "tasks.json"), "utf8"));
const taskById = Object.fromEntries(spec.tasks.map((t) => [t.id, t]));
const probe = readFileSync(join(here, "lib", "probe.js"), "utf8");

const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".json": "application/json", ".woff2": "font/woff2" };
function serveStatic(root) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const path = normalize(join(root, decodeURIComponent(req.url.split("?")[0]))).replace(/[\\/]$/, "");
      let file = path.startsWith(normalize(root)) ? path : root;
      if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
      if (!existsSync(file)) { res.writeHead(404); return res.end("not found"); }
      res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
      res.end(readFileSync(file));
    });
    server.listen(0, "127.0.0.1", () => resolve({ url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() }));
  });
}

async function startDevServer(task, workspace) {
  const port = 5600 + Math.floor(Math.random() * 300);
  const cmd = task.codebase === "admin"
    ? [join(workspace, "node_modules", "vite", "bin", "vite.js"), "--port", String(port), "--strictPort", "--host", "127.0.0.1"]
    // Webpack, not Turbopack: Turbopack rejects a node_modules junction that points outside the project.
    : [join(workspace, "node_modules", "next", "dist", "bin", "next"), "dev", "--webpack", "-p", String(port)];
  const child = spawn(process.execPath, cmd, { cwd: workspace, stdio: "ignore", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", BROWSER: "none" } });
  const url = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 240; i++) {
    try {
      const r = await fetch(url + task.route, { signal: AbortSignal.timeout(120000) });
      if (r.status < 500 || i > 200) return { url, close: () => spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"]) || child.kill() };
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  child.kill();
  throw new Error("dev server did not start");
}

// Numbers on the page that the brief didn't supply: a proxy for invented proof.
function unsupportedNumbers(pageText, prompt) {
  const norm = (s) => s.replace(/[,\s]/g, "");
  const given = new Set((prompt.match(/\d[\d,.]*/g) || []).map(norm));
  const found = pageText.match(/\b\d{1,3}(?:,\d{3})+\+?|\b\d+(?:\.\d+)?\s?(?:%|k\+|K\+|M\+|x|×)|\b\d{3,}\+/g) || [];
  return [...new Set(found)].filter((n) => !given.has(norm(n).replace(/[%+kKMx×]/g, "")) && !/^(19|20)\d\d$/.test(norm(n)));
}
function testimonialLike(pageText) {
  const hits = pageText.match(/[“"][^“”"]{25,220}[”"]\s*(?:[—–-]\s*)?[A-Z][a-z]+(?:\s[A-Z][a-z.]+)?/g) || [];
  return hits.length + (/(★★★★★|5\/5 stars|rated 4\.\d)/.test(pageText) ? 1 : 0);
}

// For codebase tasks: did the change use the existing system?
function systemUse(workspace) {
  const diff = spawnSync("git", ["-c", "core.autocrlf=false", "diff", "HEAD", "--unified=0", "--", ".", ":(exclude)node_modules"], { cwd: workspace, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).stdout;
  const untracked = spawnSync("git", ["ls-files", "--others", "--exclude-standard"], { cwd: workspace, encoding: "utf8" }).stdout.split("\n").filter(Boolean);
  let added = diff.split("\n").filter((l) => l.startsWith("+") && !l.startsWith("+++")).map((l) => l.slice(1));
  for (const f of untracked) {
    if (/\.(tsx?|jsx?|css|mdx?)$/.test(f)) added = added.concat(readFileSync(join(workspace, f), "utf8").split("\n"));
  }
  const code = added.join("\n");
  return {
    addedLines: added.length,
    newFiles: untracked.length,
    rawColors: (code.match(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(/g) || []).length,
    arbitraryTailwind: (code.match(/\b[a-z-]+-\[[^\]]+\]/g) || []).length,
    inlineStyles: (code.match(/style=\{\{/g) || []).length,
    uiImports: (code.match(/from ['"]@\/components\/ui\/|from ['"]@\/app\/components\//g) || []).length,
    tokenRefs: (code.match(/var\(--|bg-(?:background|primary|muted|card|accent|secondary)|text-(?:foreground|muted-foreground|primary)|border-(?:border|input)/g) || []).length,
  };
}

const runsDir = join(BENCH_ROOT, "runs", round);
const runs = [];
for (const taskId of existsSync(runsDir) ? readdirSync(runsDir).filter((n) => statSync(join(runsDir, n)).isDirectory()) : []) {
  for (const armRep of readdirSync(join(runsDir, taskId))) {
    const dir = join(runsDir, taskId, armRep);
    if (existsSync(join(dir, "run.json")) && (force || !existsSync(join(dir, "check.json")))) runs.push(dir);
  }
}
console.log(`Checking ${runs.length} runs in ${round}`);
if (!runs.length) process.exit(0);

const chrome = await launchChrome();
for (const dir of runs) {
  const run = JSON.parse(readFileSync(join(dir, "run.json"), "utf8"));
  const task = taskById[run.task];
  const workspace = join(dir, "workspace");
  let server;
  const result = { task: run.task, arm: run.arm, rep: run.rep, kind: task.kind };
  try {
    server = task.kind === "extend" ? await startDevServer(task, workspace) : await serveStatic(workspace);
    const url = server.url + (task.kind === "extend" ? task.route : "/");
    const page = await chrome.newPage();
    await page.goto(url, 1440, 900, task.kind === "extend" ? 6000 : 2500);
    // Dev servers compile on first load; wait (up to ~3 min) until the page has real content.
    for (let i = 0; i < 90 && ((await page.eval("document.body ? document.body.innerText.trim().length : 0")) || 0) < 40; i++) {
      await new Promise((r) => setTimeout(r, 2000));
    }
    await new Promise((r) => setTimeout(r, 1500));
    result.desktop = await page.eval(probe);
    writeFileSync(join(dir, "shot-1440.jpg"), await page.screenshot(1440, 7000));
    await page.goto(url, 390, 844, 2000);
    result.mobile = await page.eval(probe);
    writeFileSync(join(dir, "shot-390.jpg"), await page.screenshot(390, 9000));
    result.consoleErrors = page.logs.slice(0, 10);
    page.close();
    const pageText = result.desktop?.text || "";
    result.unsupportedNumbers = unsupportedNumbers(pageText, task.prompt);
    result.testimonialLike = testimonialLike(pageText);
    if (result.desktop) delete result.desktop.text;
    if (result.mobile) delete result.mobile.text;
  } catch (err) {
    result.renderError = err.message;
  } finally {
    server?.close();
  }
  if (task.kind === "extend") result.system = systemUse(workspace);
  writeFileSync(join(dir, "check.json"), JSON.stringify(result, null, 2));
  const d = result.desktop?.tells;
  console.log(`${run.task} ${run.arm}-${run.rep}: ${result.renderError ? "RENDER ERROR " + result.renderError : `tells g${d.gradients}/pb${d.purpleBlueGradients}/gt${d.gradientText} hero${d.heroCentered && d.heroFullHeight ? "C" : "-"} eyebrow${d.eyebrows} emoji${d.emojiUi} cards${d.identicalCardRows} · contrast ${result.desktop.contrast.fails} · overflow390 ${result.mobile.overflowX} · nums ${result.unsupportedNumbers.length} · quotes ${result.testimonialLike}`}`);
}
chrome.close();
