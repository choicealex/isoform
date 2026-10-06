#!/usr/bin/env node
/**
 * Looks at a figure: `node look.mjs <name>.js|isoform-<name>.html --at x,y [--edge x,y [--edge x,y]] [--zoom shot]`.
 *
 * Builds and validates the page, then opens ten pictures of it in one browser,
 * each once its drawing holds still, and writes them on one sheet,
 * isoform-<name>-look.png. --at is the stage point (400 × 320) the answering
 * pictures hold the pointer at; --edge the point for the slider's two ends.
 * Prints each picture's read-out and the checks it can make: rest says "rest",
 * nothing leaves the frame, the console is clean, the drawing comes to rest.
 * Exits 0, 1 when a check fails, 2 when it cannot run a browser.
 *
 * The browser comes from browser.mjs (playwright-core, installed once into a cache folder).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { browser as openBrowser } from "./browser.mjs";
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
/* a story is held at a moment with ?t=, so every picture can hold still: rest is its first frame. t=0 is also
   after the intro, so the answering pictures show the drawn figure, not the pen half way */
const SHOTS = [
  ["rest", { t: 0 }], ["answer", { t: 0, at }], ["small", { w: 240, t: 0 }], ["small-answer", { w: 240, t: 0, at }],
  ["low", { intensity: 0, t: 0, at: lo }], ["high", { intensity: 1, t: 0, at: hi }],
  ["dark", { theme: "dark", t: 0, at }], ["light", { theme: "light", t: 0, at }], ["effect", { gl: 1, t: 0, at }], ["effect-subtle", { gl: "subtle", t: 0, at }], ["effect-dark", { gl: 1, theme: "dark", t: 0, at }],
  ["colour", { style: "colour", t: 0, at }], ["fill-off", { fill: 0, t: 0, at }], ["no-effect", { gl: 0, t: 0, at }],
];

const browser = await openBrowser("look");
if (!browser) { console.log("look      do the look as look.md says under \"Without a browser\""); process.exit(2); }

/* a figure that tells a story also gets three moments of it and its poster, the frame reduced motion shows */
let total = 0;
{
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  await p.goto(pathToFileURL(page).href);
  await p.waitForTimeout(400);
  total = Number(await p.evaluate(() => document.getElementById("stage").dataset.storyTotal || 0));
  await ctx.close();
  if (total) {
    for (const f of [0.25, 0.5, 0.75]) SHOTS.push([`story-${Math.round(f * 100)}`, { t: Math.round(total * f) }]);
    SHOTS.push(["poster", { reduce: 1 }]);
    console.log(`story     ${(total / 1000).toFixed(1)}s loop; pictures at 25, 50, 75% and the poster`);
  }
}

let failed = false;
const results = await Promise.all(SHOTS.map(async ([shot, o0]) => {
  const { reduce, ...o } = o0;
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1000 }, deviceScaleFactor: 2, reducedMotion: reduce ? "reduce" : "no-preference" });
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
      if (el.closest(".ghost") || typeof el.getBBox !== "function" || el.tagName === "g") continue; // a group's shapes are measured one by one
      const b = el.getBBox(), m = inv.multiply(el.getScreenCTM());
      /* points on the outline itself: a box's corners, mapped through a part's in-plane stretch or turn (a shear),
         land far outside the shape it holds */
      const L = typeof el.getTotalLength === "function" && el.tagName === "path" ? el.getTotalLength() : 0;
      const pts = L > 0 ? Array.from({ length: 97 }, (_, k) => { const q = el.getPointAtLength((L * k) / 96); return [q.x, q.y]; })
        : [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]];
      for (const [x, y] of pts) {
        const X = m.a * x + m.c * y + m.e, Y = m.b * x + m.d * y + m.f;
        x0 = Math.min(x0, X); y0 = Math.min(y0, Y); x1 = Math.max(x1, X); y1 = Math.max(y1, Y);
      }
    }
    return { read: document.getElementById("read").textContent, error: document.getElementById("error").textContent.trim(), box: [x0, y0, x1, y1] };
  });
  const png = await p.locator("main").screenshot();
  /* the drawing alone (no page chrome), for the answer-vs-rest check below */
  const lines = shot === "rest" || shot === "no-effect" ? await p.locator("#stage svg").first().screenshot() : null;
  /* the icon as Isocons drew it, in the same place and style: the rest picture may add no line to it (rule 05) */
  let plain = null;
  if (shot === "rest") {
    const ok = await p.evaluate(async () => {
      const svg = document.querySelector("#stage svg"), g = svg.querySelector(".icon");
      if (!g || typeof ISOFORM_ICON === "undefined") return false;
      const twin = svg.cloneNode(false);
      svg.after(twin);
      svg.style.visibility = "hidden";
      const ic = IF.icon(twin, ISOFORM_ICON.svg);
      ic.g.setAttribute("transform", g.getAttribute("transform") ?? "");
      ic.ink(1);
      await new Promise((r) => setTimeout(r, 120)); // loose faces are outlined in a microtask
      twin.id = "if-plain";
      return true;
    });
    if (ok) plain = await p.locator("#if-plain").screenshot();
  }
  const zoom = flag("--zoom").includes(shot) ? await p.locator("#stage").screenshot({ scale: "device" }) : null;
  await ctx.close();
  return { shot, url: `isoform-${name}.html${q(o)}`, png, zoom, lines, plain, still, logs, ...info };
}));

const errsSeen = new Map(); // the same error in every picture (a mount that throws) is one error, said once
for (const r of results) {
  const [x0, y0, x1, y1] = r.box;
  const out = x0 < 0 || y0 < 0 || x1 > 400 || y1 > 320;
  if (out) { failed = true; console.log(`frame     FAIL ${r.shot}: the drawing reaches ${x0.toFixed(0)},${y0.toFixed(0)} → ${x1.toFixed(0)},${y1.toFixed(0)}, outside 0,0 → 400,320`); }
  if (r.logs.length || r.error) {
    failed = true;
    /* the first line of each: a stack carries the picture's own URL, which would make every copy look different */
    const msg = [...new Set([...r.logs, r.error].filter(Boolean).map((m) => m.split("\n")[0].trim()))].join(" | ").slice(0, 300);
    errsSeen.set(msg, [...(errsSeen.get(msg) ?? []), r.shot]);
  }
  if (r.zoom) writeFileSync(resolve(`isoform-${name}-${r.shot}.png`), r.zoom);
}
for (const [msg, shots] of errsSeen) console.log(`console   FAIL ${shots.length === results.length ? "every picture" : shots.join(", ")}: ${msg}`);
const crashed = errsSeen.size && [...errsSeen.values()].some((s) => s.length === results.length);
const rest = results.find((r) => r.shot === "rest");
if (rest.read !== "rest") { failed = true; console.log(`readout   FAIL rest reads "${rest.read}", not "rest"`); }
for (const r of results) if (r.read === "drawing") { failed = true; console.log(`readout   FAIL ${r.shot} reads "drawing": the picture caught the intro half drawn; ?t= and the answering pictures must show the drawn figure`); }
for (const r of results) if (!crashed && ["answer", "high", "dark", "light", "effect", "effect-dark"].includes(r.shot) && at && r.read === "rest") console.log(`readout   warn ${r.shot} still reads "rest": does --at land on the part?`);
console.log(`readout   ${results.map((r) => `${r.shot}=${r.read}`).join("  ")}`);
/* the answer must change the drawing, not only the read-out or the glow: compare the answer with effects off against
   the rest, in the lines alone. Three stress-test figures passed every other check while nothing visibly happened */
{
  const quiet = results.find((r) => r.shot === "no-effect");
  if (quiet?.lines && rest.lines && quiet.read !== "rest") {
    const ctx = await browser.newContext();
    const pg = await ctx.newPage();
    const share = await pg.evaluate(async ([a, b]) => {
      const load = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = `data:image/png;base64,${s}`; });
      const [A, B] = await Promise.all([load(a), load(b)]);
      const w = Math.min(A.width, B.width), h = Math.min(A.height, B.height), cv = new OffscreenCanvas(w, h), x = cv.getContext("2d");
      x.drawImage(A, 0, 0); const da = x.getImageData(0, 0, w, h).data;
      x.clearRect(0, 0, w, h); x.drawImage(B, 0, 0); const db = x.getImageData(0, 0, w, h).data;
      let n = 0;
      for (let i = 0; i < da.length; i += 4) if (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) > 24) n++;
      return n / (w * h);
    }, [rest.lines.toString("base64"), quiet.lines.toString("base64")]);
    await ctx.close();
    /* calibrated on 21 figures (2026-10-06): every approved one changes 0.17-4.3% (the cart's small box is the quietest);
       the radio button whose dot never visibly left its ring changed 0.08% */
    const pct = `${(share * 100).toFixed(2)}%`;
    if (share < 0.0012) { failed = true; console.log(`answer    FAIL the answer reads "${quiet.read}" but its lines change only ${pct} of the stage from rest (effects off): what happens is in the read-out or the glow, not the drawing. Make the move or the trace bigger, or drive it from the hand (every channel the answer needs must be in live)`); }
    else console.log(`answer    the lines change ${pct} of the stage between rest and the answer (effects off)`);
  }
}
/* rule 05: at rest the figure is the icon as drawn. A cut whose seam is not an edge the object has (a straight cut
   under a scalloped awning) shows as a line the original never had; two stress-test agents shipped one */
if (rest.lines && rest.plain) {
  const ctx = await browser.newContext();
  const pg = await ctx.newPage();
  const [extra, marked] = await pg.evaluate(async ([a, b]) => {
    const load = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = `data:image/png;base64,${s}`; });
    const [A, B] = await Promise.all([load(a), load(b)]);
    const w = Math.min(A.width, B.width), h = Math.min(A.height, B.height), cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    const x = cv.getContext("2d");
    const mask = (img) => {
      x.clearRect(0, 0, w, h); x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, w, h).data;
      const m = new Uint8Array(w * h);
      for (let i = 0; i < w * h; i++) m[i] = Math.abs(d[i * 4] - d[0]) + Math.abs(d[i * 4 + 1] - d[1]) + Math.abs(d[i * 4 + 2] - d[2]) > 60 ? 1 : 0;
      return m;
    };
    const fig = mask(A), base = mask(B), R = 5; // a few pixels of tolerance: a bright stroke is a hair wider
    const near = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let q = 0; q < w; q++) if (base[y * w + q])
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const yy = y + dy, xx = q + dx; if (yy >= 0 && yy < h && xx >= 0 && xx < w) near[yy * w + xx] = 1; }
    x.clearRect(0, 0, w, h); x.drawImage(B, 0, 0);
    const img = x.getImageData(0, 0, w, h);
    let n = 0;
    for (let i = 0; i < w * h; i++) if (fig[i] && !near[i]) { n++; img.data.set([255, 0, 0, 255], i * 4); }
    x.putImageData(img, 0, 0);
    return [n, cv.toDataURL("image/png").split(",")[1]];
  }, [rest.lines.toString("base64"), rest.plain.toString("base64")]);
  await ctx.close();
  /* not a FAIL: a seam on an edge the real object has (a lid's rim, the bolt's break) is allowed; a cut through a
     surface (a straight seam under a scalloped awning) is not, and only the eye can tell them apart */
  if (extra > 40) {
    const file = `isoform-${name}-rest-extra.png`;
    writeFileSync(resolve(file), Buffer.from(marked, "base64"));
    console.log(`rest      warn ${extra} line pixels at rest that the Isocons drawing does not have, in red in ${file}: each must be an edge the real object has (a lid's rim), never a cut through a surface or a trace left showing`);
  } else console.log("rest      the rest picture adds no line to the Isocons drawing");
}
/* rule 03 through the whole story: the pictures above are a handful of moments, and a part that swings or flies (a
   spinning solid) can leave the frame between them. Every 150ms of the loop at intensity 1, the outlines themselves */
if (total) {
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1000 } });
  const pg = await ctx.newPage();
  const out = [];
  for (let t = 0; t <= total; t += 150) {
    await pg.goto(`${pathToFileURL(page).href}${q({ t, intensity: 1 })}`);
    await pg.waitForTimeout(90);
    const b = await pg.evaluate(() => {
      const svg = document.querySelector("#stage svg"), inv = svg.getScreenCTM().inverse();
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const el of svg.querySelectorAll(".icon path")) {
        if (el.closest(".ghost, defs, mask, clipPath") || getComputedStyle(el).visibility === "hidden" || el.closest('[style*="display: none"]')) continue;
        const L = el.getTotalLength?.() ?? 0, m = inv.multiply(el.getScreenCTM());
        for (let k = 0; k <= 48 && L > 0; k++) {
          const p2 = el.getPointAtLength((L * k) / 48), x = m.a * p2.x + m.c * p2.y + m.e, y = m.b * p2.x + m.d * p2.y + m.f;
          x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
        }
      }
      return [x0, y0, x1, y1];
    });
    if (b[0] < 0 || b[1] < 0 || b[2] > 400 || b[3] > 320) out.push(`${t}ms (${b.map((n) => Math.round(n)).join(",")})`);
  }
  await ctx.close();
  if (out.length) { failed = true; console.log(`frame     FAIL at intensity 1 the drawing leaves 400 × 320 during the story at ${out.slice(0, 4).join(", ")}${out.length > 4 ? ` and ${out.length - 4} more` : ""}`); }
  else console.log(`frame     the drawing stays inside the frame through the whole story at intensity 1 (every 150ms)`);
}
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
