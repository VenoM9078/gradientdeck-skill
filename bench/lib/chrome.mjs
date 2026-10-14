// Minimal Chrome DevTools Protocol driver (no dependencies).
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

export async function launchChrome(port = 9400 + Math.floor(Math.random() * 400)) {
  const exe = CANDIDATES.find((p) => existsSync(p));
  if (!exe) throw new Error("Chrome or Edge not found; set CHROME_PATH");
  const profile = mkdtempSync(join(tmpdir(), "gd-bench-chrome-"));
  const proc = spawn(exe, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    "--no-default-browser-check", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank",
  ], { stdio: "ignore" });
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(`http://127.0.0.1:${port}/json/version`);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  return {
    port,
    async newPage() {
      const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
      return connect(target.webSocketDebuggerUrl);
    },
    close() {
      proc.kill();
    },
  };
}

async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const logs = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
    if (m.method === "Runtime.exceptionThrown") logs.push("exception: " + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).slice(0, 300));
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") logs.push("console: " + m.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 300));
  };
  await new Promise((r) => (ws.onopen = r));
  const send = (method, params = {}) => new Promise((resolve) => {
    const i = ++id;
    pending.set(i, resolve);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  await send("Page.enable");
  await send("Runtime.enable");
  return {
    logs,
    send,
    async goto(url, width, height, settleMs = 2500) {
      await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
      await send("Page.navigate", { url });
      await new Promise((r) => setTimeout(r, settleMs));
      await this.eval("document.fonts ? document.fonts.ready.then(() => true) : true", true);
    },
    async eval(expression, awaitPromise = false) {
      const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise });
      if (r.result?.exceptionDetails) this.lastError = r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text;
      return r.result?.result?.value;
    },
    async screenshot(width, maxHeight) {
      const fullHeight = Math.min(await this.eval("Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0)") || 900, maxHeight);
      await send("Emulation.setDeviceMetricsOverride", { width, height: fullHeight, deviceScaleFactor: 1, mobile: width < 768 });
      await new Promise((r) => setTimeout(r, 600));
      const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 72 });
      return Buffer.from(shot.result.data, "base64");
    },
    close() {
      ws.close();
    },
  };
}
