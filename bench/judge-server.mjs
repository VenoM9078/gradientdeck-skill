// Local blind-judging page.
//   node bench/judge-server.mjs --round r1 --judge you [--port 4815]
// Serves the pairs without arm labels and saves each choice to judgments-<judge>.json.
import { createServer } from "node:http";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = process.env.GD_BENCH_ROOT || "E:/gd-bench";
const arg = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || `--${n}=${d}`).split("=")[1];
const round = arg("round", "r1");
const judge = arg("judge", "you");
const port = Number(arg("port", 4815));
const runsDir = join(BENCH_ROOT, "runs", round);
const pairs = JSON.parse(readFileSync(join(runsDir, "pairs.json"), "utf8"));
const outFile = join(runsDir, `judgments-${judge}.json`);
const judgments = existsSync(outFile) ? JSON.parse(readFileSync(outFile, "utf8")) : {};
const page = readFileSync(join(here, "judge.html"), "utf8");

// Only expose image files that belong to a pair.
const images = new Map();
const publicPairs = pairs.map((p, i) => {
  const sides = {};
  for (const side of ["left", "right"]) {
    sides[side] = {};
    for (const view of ["desktop", "mobile"]) {
      const token = `${i}-${side}-${view}`;
      images.set(token, p[side][view]);
      sides[side][view] = `/img/${token}`;
    }
  }
  return { id: p.id, kind: p.kind, brief: p.brief, ...sides };
});

createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    return res.end(page);
  }
  if (req.method === "GET" && req.url === "/data") {
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify({ round, judge, pairs: publicPairs, judgments }));
  }
  if (req.method === "GET" && req.url.startsWith("/img/")) {
    const file = images.get(req.url.slice(5));
    if (!file || !existsSync(file)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "content-type": "image/jpeg", "cache-control": "max-age=3600" });
    return res.end(readFileSync(file));
  }
  if (req.method === "POST" && req.url === "/judge") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const { id, choice, note } = JSON.parse(body);
      if (!pairs.some((p) => p.id === id) || !["left", "right", "tie"].includes(choice)) { res.writeHead(400); return res.end(); }
      judgments[id] = { choice, note: note || "", at: new Date().toISOString() };
      writeFileSync(outFile, JSON.stringify(judgments, null, 2));
      res.writeHead(200);
      res.end("ok");
    });
    return;
  }
  res.writeHead(404);
  res.end();
}).listen(port, "127.0.0.1", () => console.log(`Judging ${pairs.length} pairs as "${judge}" at http://127.0.0.1:${port}`));
