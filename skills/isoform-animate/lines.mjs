#!/usr/bin/env node
/**
 * Checks that every line ends on something: `node lines.mjs <name>.js|isoform-<name>.html [--frames n] [--out file.png]`.
 *
 * A line that stops in the air reads as a mistake: a stub left by a cut, a corner of a new face that overshoots
 * the edge it should meet, a scuff mark floating on nothing. The check holds the story still at rest and at n
 * moments through the loop (effect off, so every fallback line is drawn), samples every visible stroke, and finds
 * its ends: the two ends of an open line, every sharp corner, and every place a line passes behind a face. An end
 * is fine when another visible line passes within reach of it. Corners already free at rest are the icon as drawn
 * and stay allowed; a trace made with {free: true} (a flame's tip, an arc's flick) may end in the air.
 * Prints each free end and writes isoform-<name>-lines.png, the worst moment with the free ends ringed.
 * Exits 0 when nothing is loose, 1 when something is, 2 when it cannot run a browser.
 */
import { readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { browser as openBrowser } from "./browser.mjs";
import { build } from "./build.mjs";

const argv = process.argv.slice(2);
const flag = (n) => { const i = argv.indexOf(n); return i < 0 ? null : argv[i + 1]; };
const src = argv.find((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));
if (!src) { console.error("usage: node lines.mjs <name>.js|isoform-<name>.html [--frames n] [--out file.png]"); process.exit(2); }
const page = src.endsWith(".html") ? resolve(src) : await build(src);
readFileSync(page);
const name = basename(page).replace(/^isoform-|\.html$/g, "");
const out = flag("--out") ?? join(dirname(page), `isoform-${name}-lines.png`);
const N = Number(flag("--frames") ?? 12);

const browser = await openBrowser("lines");
if (!browser) process.exit(2);
const ctx = await browser.newContext({ viewport: { width: 900, height: 760 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const url = (t) => `${pathToFileURL(page).href}?t=${t}&gl=0`;

/* runs in the page: every visible end of every stroke, in stage units, and whether another line meets it */
function scan() {
  const svg = document.querySelector("#stage svg");
  const toStage = svg.getScreenCTM().inverse();
  const REACH = 1.6, STEP = 0.8, TURN = 0.6, EDGE = 0.9; // stage units; TURN in radians (about 35°)
  const shown = (el) => {
    let o = 1;
    for (let e = el; e && e !== svg.parentNode; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.display === "none" || s.visibility === "hidden") return 0;
      o *= Number(s.opacity);
    }
    return o;
  };
  const geo = [...svg.querySelectorAll("path, ellipse, circle, polygon, polyline, line, rect")]
    .filter((el) => !el.closest("defs, mask, clipPath, .ghost"));
  /* fills that can hide a line painted before them, in paint order */
  const items = geo.map((el, i) => {
    const s = getComputedStyle(el), o = shown(el);
    return {
      el, i, o, sil: !!el.closest(".sil"), trace: el.classList.contains("trace"), free: el.classList.contains("free"),
      stroked: o > 0.2 && s.stroke !== "none" && Number(s.strokeOpacity) > 0.2 && parseFloat(s.strokeWidth) > 0,
      dashed: !!el.style.strokeDasharray, // drawing on: its head is the pen, not an end
      fills: o > 0.5 && s.fill !== "none" && Number(s.fillOpacity) > 0.5 && !el.closest(".sil"),
      inv: el.getScreenCTM()?.inverse(), box: null, revealed: "revealed" in el.dataset, // a face made by facet/face: hidden at rest
      clip: el.closest("[clip-path]") ? document.querySelector(el.closest("[clip-path]").getAttribute("clip-path").replace(/^url\((.*)\)$/, "$1")) : null,
    };
  });
  for (const it of items) if (it.fills) {
    const b = it.el.getBBox(), m = svg.getScreenCTM().inverse().multiply(it.el.getScreenCTM());
    const c = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]
      .map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
    it.box = [Math.min(...c.map((q) => q[0])), Math.min(...c.map((q) => q[1])), Math.max(...c.map((q) => q[0])), Math.max(...c.map((q) => q[1]))];
  }
  const hidden = (it, x, y) => {
    /* a clipped trace (part.trace {clip}) shows only inside its clip */
    if (it.clip) {
      const lp = new DOMPoint(x, y).matrixTransform(svg.getScreenCTM()).matrixTransform(it.inv);
      const inside = [...it.clip.children].some((c) => {
        const m = c.transform?.baseVal?.consolidate()?.matrix;
        return c.isPointInFill(m ? lp.matrixTransform(m.inverse()) : lp);
      });
      if (!inside) return true;
    }
    for (let j = it.i + 1; j < items.length; j++) {
      const f = items[j];
      if (!f.fills || x < f.box[0] || x > f.box[2] || y < f.box[1] || y > f.box[3]) continue;
      /* hidden only when well inside: a line lying on the face's own edge is that edge, and shows */
      const deep = [[0, 0], [EDGE, 0], [-EDGE, 0], [0, EDGE], [0, -EDGE]].every(([a, b]) =>
        f.el.isPointInFill(new DOMPoint(x + a, y + b).matrixTransform(svg.getScreenCTM()).matrixTransform(f.inv)));
      if (deep) return true;
    }
    return false;
  };
  /* sample each subpath of each stroked item: a temporary twin in the same parent shares its transform */
  const runs = [];
  for (const it of items) {
    if (!it.stroked || (it.trace && it.dashed)) continue; // a trace still drawing on is the pen at work
    const el = it.el;
    const d = el.tagName === "path" ? el.getAttribute("d") : null;
    const subs = d ? d.split(/(?=[Mm])/).filter((x) => x.trim()) : [null];
    if (d && /m/.test(d)) { subs.length = 0; subs.push(d); } // relative moves: keep it whole
    subs.forEach((sd, k) => {
      let g = el;
      if (sd !== null && subs.length > 1) { g = el.cloneNode(); g.setAttribute("d", sd); g.style.cssText = "visibility:hidden"; el.parentNode.insertBefore(g, el); }
      const m = svg.getScreenCTM().inverse().multiply(g.getScreenCTM());
      const L = g.getTotalLength?.() ?? 0;
      const scale = Math.hypot(m.a, m.b) || 1;
      const n = Math.max(2, Math.ceil((L * scale) / STEP));
      const pts = [];
      for (let s = 0; s <= n; s++) {
        const q = g.getPointAtLength((L * s) / n);
        const x = m.a * q.x + m.c * q.y + m.e, y = m.b * q.x + m.d * q.y + m.f;
        pts.push({ x, y, lx: q.x, ly: q.y, v: !hidden(it, x, y) }); // lx, ly: in the line's own space, which moves with its part
      }
      if (g !== el) g.remove();
      const shut = pts.length > 2 && Math.hypot(pts[0].x - pts.at(-1).x, pts[0].y - pts.at(-1).y) < 0.5; // closed by its points
      const closed = shut || (sd ? /[zZ]\s*$/.test(sd.trim()) : el.tagName !== "path" || /[zZ]\s*$/.test(d ?? ""));
      /* a part's silhouette is a twin of its faces, drawn on the same line: a line never meets its own twin */
      runs.push({ it, k, pts, closed, sig: `${sd ?? d ?? el.outerHTML}|${[m.a, m.b, m.c, m.d, m.e, m.f].map((v) => v.toFixed(2))}` });
    });
  }
  /* a grid of visible samples, to ask "does another line pass here?" */
  const grid = new Map(), key = (x, y) => `${Math.floor(x / 4)},${Math.floor(y / 4)}`;
  runs.forEach((r, ri) => { r.pts.forEach((q, qi) => { if (q.v) { const kk = key(q.x, q.y); if (!grid.has(kk)) grid.set(kk, []); grid.get(kk).push([q.x, q.y, ri, qi]); } }); });
  const met = (x, y, ri, qi, n) => {
    const gx = Math.floor(x / 4), gy = Math.floor(y / 4);
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (const [px, py, rj, qj] of grid.get(`${gx + a},${gy + b}`) ?? []) {
      if (rj === ri && Math.min(Math.abs(qj - qi), n - Math.abs(qj - qi)) < 12) continue; // its own line near the end
      if (rj !== ri && runs[rj].sig === runs[ri].sig) continue;
      if (Math.hypot(px - x, py - y) <= REACH) return true;
    }
    return false;
  };
  const ends = [];
  const label = (it) => `${it.trace ? "trace" : it.sil ? "silhouette" : "face"} #${it.i}${it.el.closest("[data-part]")?.dataset.part ? ` (${it.el.closest("[data-part]").dataset.part})` : ""}`;
  runs.forEach((r, ri) => {
    const { pts, it, closed } = r, n = pts.length;
    if (it.free || it.sil) return;
    const at = (i) => pts[closed ? ((i % n) + n) % n : Math.max(0, Math.min(n - 1, i))];
    const add = (i, why) => { const q = pts[i]; if (q.v && !met(q.x, q.y, ri, i, n)) ends.push({ x: q.x, y: q.y, el: it.i, lx: q.lx, ly: q.ly, why, who: label(it) }); };
    if (!closed && !it.dashed) { add(0, "end"); add(n - 1, "end"); }
    for (let i = 0; i < n; i++) {
      const a = at(i - 4), b = pts[i], c = at(i + 4);
      if (!closed && (i < 4 || i > n - 5)) continue;
      const t1 = Math.atan2(b.y - a.y, b.x - a.x), t2 = Math.atan2(c.y - b.y, c.x - b.x);
      let dt = Math.abs(t2 - t1); if (dt > Math.PI) dt = 2 * Math.PI - dt;
      /* corners: only on faces the figure built from points (facet, face): a moving part's own corners are the solid's,
         but a built face's corner must land on the drawing, or it overshoots */
      if (dt > TURN && it.revealed) { // a trace's bends are its shape (an arc's zigzag); only its two ends must land
        const nb = [at(i - 1), at(i + 1)];
        const pa = Math.atan2(b.y - nb[0].y, b.x - nb[0].x), pc = Math.atan2(nb[1].y - b.y, nb[1].x - b.x);
        let dd = Math.abs(pc - pa); if (dd > Math.PI) dd = 2 * Math.PI - dd;
        if (dd >= dt * 0.25) add(i, "corner"); // the sharpest sample of the turn
      }
      const nx = at(i + 1);
      if (i < n - 1 || closed) { if (b.v && !nx.v) add(i, "behind"); if (!b.v && nx.v) add((i + 1) % n, "behind"); }
    }
  });
  /* one per spot */
  const seen = [];
  return ends.filter((e) => { if (seen.some((s) => Math.hypot(s.x - e.x, s.y - e.y) < 3)) return false; seen.push(e); return true; });
}

await p.goto(url(0)); await p.waitForTimeout(500);
const total = Number(await p.evaluate(() => document.getElementById("stage").dataset.storyTotal || 0));
const times = [0, ...(total ? Array.from({ length: N }, (_, i) => Math.round((total * (i + 0.5)) / N)) : [])];
let rest = null, worst = { t: 0, ends: [] }, bad = 0;
for (const t of times) {
  await p.goto(url(t)); await p.waitForTimeout(450);
  const ends = await p.evaluate(scan);
  const read = await p.evaluate(() => document.getElementById("read")?.textContent?.trim() ?? "");
  if (rest === null) { rest = ends; console.log(`lines     rest: ${ends.length} free corner(s) in the icon as drawn, allowed`); continue; }
  /* free at rest = the icon as drawn; matched on the same line, in its own space, so a corner that moves with its part still matches */
  const loose = ends.filter((e) => !rest.some((r) => r.el === e.el && Math.hypot(r.lx - e.lx, r.ly - e.ly) < 2.5));
  if (loose.length) {
    bad++;
    console.log(`lines     t=${t} "${read}": ${loose.length} loose`);
    for (const e of loose.slice(0, 6)) console.log(`            ${e.why.padEnd(6)} at ${e.x.toFixed(1)}, ${e.y.toFixed(1)}  ${e.who}`);
  }
  if (loose.length > worst.ends.length) worst = { t, ends: loose };
}
if (worst.ends.length) {
  await p.goto(url(worst.t)); await p.waitForTimeout(450);
  await p.evaluate((ends) => {
    const svg = document.querySelector("#stage svg");
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    for (const e of ends) {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      Object.entries({ cx: e.x, cy: e.y, r: 4, fill: "none", stroke: "#ff2d55", "stroke-width": 1.2, "vector-effect": "non-scaling-stroke" }).forEach(([k, v]) => { c.setAttribute(k, v); });
      g.appendChild(c);
    }
    svg.appendChild(g);
  }, worst.ends);
  await p.locator("#stage").screenshot({ path: out });
  console.log(`lines     worst moment t=${worst.t} ringed in ${out}`);
}
await browser.close();
console.log(bad ? `lines     FAIL: loose ends at ${bad} of ${times.length - 1} moments` : `lines     ok: every line ends on something at ${times.length - 1} moments`);
process.exit(bad ? 1 : 0);
