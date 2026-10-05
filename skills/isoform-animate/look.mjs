#!/usr/bin/env node
/**
 * Looks at a figure: `node look.mjs <name>.js|isoform-<name>.html --at x,y [--edge x,y [--edge x,y]] [--zoom shot]`.
 *
 * Builds and validates the page, then opens nine pictures of it in one browser,
 * each once its drawing holds still, and writes them on one sheet,
 * isoform-<name>-look.png. --at is the stage point (400 × 320) the answering
 * pictures hold the pointer at; --edge the point for the slider's two ends.
 * Prints each picture's read-out and the checks it can make: rest says "rest",
 * nothing leaves the frame, the console is clean, the drawing comes to rest.
 * Exits 0, 1 when a check fails, 2 when it cannot run a browser.
 *
 * playwright-core is installed once into a cache folder of yours
 * (~/Library/Caches/isoform-look, %LOCALAPPDATA%\isoform-look or ~/.cache/isoform-look;
 * ISOFORM_LOOK_CACHE moves it), never into the skill or the working directory.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "./build.mjs";
import { check } from "./validate.mjs";

const argv = process.argv.slice(2);
const flag = (name) => argv.flatMap((a, i) => (a === name ? [argv[i + 1]] : []));
const src = argv.find((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));
if (!src) { console.error("usage: node look.mjs <name>.js|isoform-<name>.html --at x,y [--edge x,y] [--zoom shot]"); process.exit(2); }

const page = src.endsWith(".html") ? resolve(src) : await build(src);
const errs = check(readFileSync(page, "utf8"));
if (errs.length) { for (const e of errs) console.log(e); console.log("validate  fix these first; no pictures taken"); process.exit(1); }
const name = basename(page).replace(/^isoform-|\.html$/g, "");

const at = flag("--at")[0];
const edges = flag("--edge");
const lo = edges[0] ?? at, hi = edges[1] ?? edges[0] ?? at;
if (!at) console.log("answer    no --at: the answering pictures are taken at rest; that is not a finished look");
const q = (o) => { const s = new URLSearchParams(Object.entries(o).filter(([, v]) => v != null)).toString(); return s ? `?${s}` : ""; };
const SHOTS = [
  ["rest", {}], ["answer", { at }], ["small", { w: 240 }], ["small-answer", { w: 240, at }],
  ["low", { intensity: 0, at: lo }], ["high", { intensity: 1, at: hi }],
  ["dark", { theme: "dark", at }], ["light", { theme: "light", at }], ["no-effect", { gl: 0, at }],
];

/* playwright-core, once, in a cache folder */
const cache = process.env.ISOFORM_LOOK_CACHE ?? (process.platform === "darwin" ? join(homedir(), "Library/Caches/isoform-look")
  : process.platform === "win32" ? join(process.env.LOCALAPPDATA ?? homedir(), "isoform-look") : join(homedir(), ".cache/isoform-look"));
const req = createRequire(join(cache, "noop.js"));
let pw;
try { pw = req("playwright-core"); } catch {
  mkdirSync(cache, { recursive: true });
  if (!existsSync(join(cache, "package.json"))) writeFileSync(join(cache, "package.json"), "{\"private\":true}\n");
  console.log(`look      installing playwright-core into ${cache} (once)`);
  const r = spawnSync("npm", ["install", "--silent", "--no-audit", "--no-fund", "playwright-core@1"], { cwd: cache, stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) { console.log("look      could not install playwright-core: do the look as look.md says under \"Without a browser\""); process.exit(2); }
  pw = req("playwright-core");
}
let browser;
for (const opts of [{ channel: "chrome" }, {}]) { try { browser = await pw.chromium.launch(opts); break; } catch {} }
if (!browser) { console.log("look      no Chrome or Chromium: run  npx playwright install chromium  then look again"); process.exit(2); }

let failed = false;
const results = await Promise.all(SHOTS.map(async ([shot, o]) => {
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1000 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const logs = [];
  p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") logs.push(m.text()); });
  p.on("pageerror", (e) => logs.push(e.message));
  await p.goto(pathToFileURL(page).href + q(o));
  await p.waitForTimeout(1500);
  /* wait for the drawing to hold still for a quarter second, at most 5 seconds */
  let still = false, last = "", since = Date.now();
  const t0 = Date.now();
  while (Date.now() - t0 < 5000) {
    const now = await p.evaluate(() => [...document.querySelectorAll("#stage svg [transform], #stage svg .hi")].map((e) => `${e.getAttribute("transform")}|${e.getAttribute("class")}`).join(";"));
    if (now !== last) { last = now; since = Date.now(); } else if (Date.now() - since > 250) { still = true; break; }
    await p.waitForTimeout(60);
  }
  const info = await p.evaluate(() => {
    const svg = document.querySelector("#stage svg"), g = svg.querySelector(".icon");
    const inv = svg.getScreenCTM().inverse();
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const el of g.querySelectorAll(":scope > g[data-part] *, :scope > path")) {
      if (el.closest(".ghost") || typeof el.getBBox !== "function") continue;
      const b = el.getBBox(), m = inv.multiply(el.getScreenCTM());
      for (const [x, y] of [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]) {
        const X = m.a * x + m.c * y + m.e, Y = m.b * x + m.d * y + m.f;
        x0 = Math.min(x0, X); y0 = Math.min(y0, Y); x1 = Math.max(x1, X); y1 = Math.max(y1, Y);
      }
    }
    return { read: document.getElementById("read").textContent, error: document.getElementById("error").textContent.trim(), box: [x0, y0, x1, y1] };
  });
  const png = await p.locator("main").screenshot();
  const zoom = flag("--zoom").includes(shot) ? await p.locator("#stage").screenshot({ scale: "device" }) : null;
  await ctx.close();
  return { shot, url: `isoform-${name}.html${q(o)}`, png, zoom, still, logs, ...info };
}));

for (const r of results) {
  const [x0, y0, x1, y1] = r.box;
  const out = x0 < 0 || y0 < 0 || x1 > 400 || y1 > 320;
  if (out) { failed = true; console.log(`frame     FAIL ${r.shot}: the drawing reaches ${x0.toFixed(0)},${y0.toFixed(0)} → ${x1.toFixed(0)},${y1.toFixed(0)}, outside 0,0 → 400,320`); }
  if (r.logs.length || r.error) { failed = true; console.log(`console   FAIL ${r.shot}: ${[...r.logs, r.error].filter(Boolean).join(" | ").slice(0, 300)}`); }
  if (r.zoom) writeFileSync(resolve(`isoform-${name}-${r.shot}.png`), r.zoom);
}
const rest = results.find((r) => r.shot === "rest");
if (rest.read !== "rest") { failed = true; console.log(`readout   FAIL rest reads "${rest.read}", not "rest"`); }
for (const r of results) if (r.shot !== "rest" && !r.shot.startsWith("small") && at && r.read === "rest" && r.shot !== "low") console.log(`readout   warn ${r.shot} still reads "rest": does --at land on the part?`);
console.log(`readout   ${results.map((r) => `${r.shot}=${r.read}`).join("  ")}`);
const moving = results.filter((r) => !r.still).map((r) => r.shot);
console.log(moving.length ? `still     moving: ${moving.join(", ")} (an effect that runs while held is expected; a loop at rest is not)` : "still     every picture came to rest");
if (!moving.includes("rest") && moving.length) {} else if (moving.includes("rest")) { failed = true; console.log("still     FAIL the rest picture never holds still: rule 07"); }

/* the sheet */
const cards = results.map((r) => `<figure class="${r.shot.startsWith("small") ? "s" : r.shot === "rest" || r.shot === "answer" ? "l" : "m"}"><img src="data:image/png;base64,${r.png.toString("base64")}"><figcaption>${r.shot} · ${r.read}<br><span>${r.url}</span></figcaption></figure>`).join("");
const sheet = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:24px;background:#f4f5f7;font:12px ui-monospace,Menlo,monospace;color:#333;display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;width:1840px}
figure{margin:0;background:#fff;border:1px solid #dde;border-radius:10px;padding:10px}figure.l{width:880px}figure.m{width:430px}figure.s{width:280px}img{width:100%;display:block}figcaption{margin-top:6px}span{color:#889;font-size:10px}</style>${cards}`;
const ctx = await browser.newContext({ viewport: { width: 1888, height: 800 } });
const sp = await ctx.newPage();
await sp.setContent(sheet);
const out = resolve(`isoform-${name}-look.png`);
await sp.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
process.exit(failed ? 1 : 0);
