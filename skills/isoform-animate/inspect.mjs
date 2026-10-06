#!/usr/bin/env node
/**
 * Shows what an icon is made of, so its faces can be grouped into parts:
 * `node inspect.mjs <icon-id> [variant]`.
 *
 * Prints one line per path, in paint order: its index, which way the face looks
 * (top, left, right, or curved), its box in stage units at the default placement
 * (h 220, centred on 200,166), and its centre. Writes isoform-<id>-parts.png
 * (and the .html it is taken from): the icon with every path numbered and tinted
 * over a grid in stage units, to look at when the lines are not enough. Paths that touch and paint one after another usually belong to
 * one part; a part is always a run of consecutive indices.
 *
 * `--near x,y` (a stage point read off the parts picture) also prints the exact outline points and edges of every face
 * around it, so a cut goes through a point the drawing has, not one read by eye.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { browser } from "./browser.mjs";
import { data, iconOf } from "./build.mjs";
import { axesOf, facing, walk } from "./geometry.mjs";

const argv = process.argv.slice(2);
const nearAt = argv.includes("--near") ? argv[argv.indexOf("--near") + 1]?.split(",").map(Number) : null;
const [id, variant = "rounded-left"] = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--near");
if (!id || (nearAt && (nearAt.length !== 2 || nearAt.some(Number.isNaN)))) { console.error("usage: node inspect.mjs <icon-id> [variant] [--near x,y]"); process.exit(2); }
const icon = await iconOf(id, variant);
const vb = /viewBox="([^"]+)"/.exec(icon.svg)[1].split(/[\s,]+/).map(Number);
const scale = Math.min(220 / vb[3], 300 / vb[2]); // the kernel's default placement
const st = (x, y) => [200 + (x - vb[0] - vb[2] / 2) * scale, 166 + (y - vb[1] - vb[3] / 2) * scale];

const shapes = [...icon.svg.matchAll(/<(path|circle|ellipse|rect)\b[^>]*>/g)];
console.log(`${icon.id} · ${icon.variant} · "${icon.title}" · ${shapes.length} paths · viewBox ${vb.join(" ")}`);
console.log("idx  facing  box (stage units)              centre");
const rows = [];
shapes.forEach((m, k) => {
  const d = /\bd="([^"]+)"/.exec(m[0])?.[1];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, face = m[1];
  if (d) {
    const w = walk(d);
    for (const [x, y] of w.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    face = facing(w);
  } else {
    const a = (n) => parseFloat(new RegExp(`\\b${n}="([^"]+)"`).exec(m[0])?.[1] ?? "0");
    const cx = a("cx") || a("x"), cy = a("cy") || a("y"), rx = a("rx") || a("r") || a("width") / 2, ry = a("ry") || a("r") || a("height") / 2;
    [x0, y0, x1, y1] = [cx - rx, cy - ry, cx + rx, cy + ry];
  }
  const [a0, b0] = st(x0, y0), [a1, b1] = st(x1, y1);
  rows.push({ k, face, box: [a0, b0, a1, b1] });
  const f = (n) => String(Math.round(n)).padStart(4);
  console.log(`${String(k).padStart(3)}  ${face.padEnd(7)} ${f(a0)},${f(b0)} → ${f(a1)},${f(b1)}   ${f((a0 + a1) / 2)},${f((b0 + b1) / 2)}`);
  /* an inner outline is an opening (a screen's window, a ring's bore), not a part: an agent who misses it moves the
     opening's wall and nothing visible happens */
  if (d && (d.match(/[Mm]/g) || []).length > 1) console.log(`       opening: this face has ${(d.match(/[Mm]/g) || []).length - 1} inner outline(s), a window or bore; free it with icon.hole(${k}) before moving it`);
  /* a straight-edged face lists its corners, which are where a cut goes */
  if (d && /^[\sMLHVZmlhvz\d.,eE+-]*$/.test(d)) {
    const w = walk(d);
    const corners = w.pts.filter((p, j, a) => j === 0 || Math.hypot(p[0] - a[j - 1][0], p[1] - a[j - 1][1]) > 0.5);
    if (corners.length <= 16) console.log(`       corners ${corners.map(([x, y]) => st(x, y).map((n) => Math.round(n)).join(",")).join("  ")}`);
  } else if (d) {
    /* a face with curves has no corners, but its curves meet at points (a scalloped awning's tips): the agent who cut the
       storefront had only a picture to read them off (F6) */
    const pts = walk(d).pts.filter((p, j, a) => j === 0 || Math.hypot(p[0] - a[j - 1][0], p[1] - a[j - 1][1]) > 0.5);
    if (pts.length <= 24) console.log(`       points ${pts.map(([x, y]) => st(x, y).map((n) => Math.round(n)).join(",")).join("  ")}   (where its curves and edges meet)`);
    else console.log(`       ${pts.length} points: read the ones you need with --near x,y`);
  }
});

/* --near: every outline point and the nearest point of every straight edge within 12 units, to a tenth, nearest first */
if (nearAt) {
  const hits = [];
  shapes.forEach((m, k) => {
    const d = /\bd="([^"]+)"/.exec(m[0])?.[1];
    if (!d) return;
    const w = walk(d);
    for (const [x, y] of w.pts) hits.push({ k, what: "point", p: st(x, y) });
    for (const [x0, y0, x1, y1] of w.segs) {
      const a = st(x0, y0), b = st(x1, y1), dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
      if (L2 < 1) continue;
      const t = Math.max(0, Math.min(1, ((nearAt[0] - a[0]) * dx + (nearAt[1] - a[1]) * dy) / L2));
      if (t > 0.02 && t < 0.98) hits.push({ k, what: `on the edge ${a.map(Math.round).join(",")} → ${b.map(Math.round).join(",")}`, p: [a[0] + dx * t, a[1] + dy * t] });
    }
  });
  const dist = (h) => Math.hypot(h.p[0] - nearAt[0], h.p[1] - nearAt[1]);
  const seen = new Set();
  const list = hits.filter((h) => dist(h) <= 12).sort((a, b) => dist(a) - dist(b)).filter((h) => { const key = `${h.k}|${h.p.map((n) => n.toFixed(1))}`; return !seen.has(key) && seen.add(key); }).slice(0, 12);
  console.log(`near ${nearAt.join(",")}${list.length ? "" : "   nothing within 12 units"}`);
  for (const h of list) console.log(`  face ${String(h.k).padStart(2)}  ${h.p.map((n) => n.toFixed(1)).join(",").padEnd(12)} ${dist(h).toFixed(1).padStart(4)} away  ${h.what}`);
  if (list.length) console.log("  cut through one of these points (through icon.pt if you moved the icon): a seam on an edge the drawing has never shows at rest");
}

/* the axes the kernel will measure (geometry.mjs, the same code), so a wrong one is seen before a figure moves along it */
{
  const ax = axesOf(icon.svg);
  const f = (w) => w.map((n) => n.toFixed(2)).join(", ");
  /* u and v are unit screen directions: a move of 1 along u is 1 stage unit down-right */
  console.log(!ax
    ? "axes   none: no straight edges, so the kernel uses true isometric, u 0.87, 0.50  v -0.87, 0.50. Keep it; do not derive axes from an ellipse's shape"
    : ax.half
      ? `axes   u ${f(ax.u)}   v ${f(ax.v)}   (${ax.half} measured from the only straight edges; the other is true isometric. Move along ${ax.half} freely; check any move on the other axis against the corners)`
      : `axes   u ${f(ax.u)}   v ${f(ax.v)}   (measured; check them against the corners above)`);
}

/* what the sweep of every icon in every view (scripts/sweep.mjs → data/sweep.json) knows about this one */
{
  let sw = null;
  try { sw = JSON.parse(await data("sweep.json"))[icon.id]; } catch {} // installed: fetched with the icons
  const here = sw?.[icon.variant];
  const NOTE = {
    axes: "one or both axes could not be measured from straight edges (the axes line says which): move freely on a measured axis, and check any move on the other against the corners",
    tiny: `${here?.tiny} faces are under 6 units: unreadable at 240px; move them with their neighbours, never alone`,
    dense: `${here?.faces} faces: group them into a few parts; animating each is noise`,
    dots: `${here?.dots} zero-size faces: put each in the part it sits on, so it moves with it; never a part of their own`,
  };
  for (const f of here?.flags ?? []) console.log(`sweep  ${NOTE[f]}`);
  const better = sw && Object.entries(sw).filter(([v, x]) => v !== icon.variant && !x.flags.length).map(([v]) => v);
  if (here?.flags.length && better?.length) console.log(`sweep  clean views of this icon: ${better.join(", ")}`);
}

const hue = (k) => `hsl(${(k * 137.5) % 360} 70% 50%)`;
let n = 0;
const tinted = icon.svg.replace(/<(path|circle|ellipse|rect)\b/g, (m) => `${m} fill="${hue(n)}" fill-opacity="0.18" stroke="${hue(n++)}" stroke-width="1" vector-effect="non-scaling-stroke"`);
const labels = rows.map(({ k, box }) => {
  const [x, y] = [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2];
  return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" fill="${hue(k)}" text-anchor="middle" dominant-baseline="middle" style="font:700 9px ui-monospace,monospace;paint-order:stroke;stroke:#fff;stroke-width:3px">${k}</text>`;
}).join("");
const g = `<g transform="translate(${200 - (vb[0] + vb[2] / 2) * scale} ${166 - (vb[1] + vb[3] / 2) * scale}) scale(${scale})">${tinted.replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g>`;
/* a grid in stage units, so a point read off the picture is a point to pass to icon.pt */
let grid = "";
for (let x = 0; x <= 400; x += 20) grid += `<line x1="${x}" y1="0" x2="${x}" y2="320" stroke="${x % 100 ? "#f2f2f2" : "#d8d8d8"}" stroke-width="0.5"/>`;
for (let y = 0; y <= 320; y += 20) grid += `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="${y % 100 ? "#f2f2f2" : "#d8d8d8"}" stroke-width="0.5"/>`;
for (let x = 0; x < 400; x += 50) grid += `<text x="${x + 1}" y="7" fill="#999" style="font:5px ui-monospace,monospace">${x}</text>`;
for (let y = 50; y < 320; y += 50) grid += `<text x="1" y="${y - 1}" fill="#999" style="font:5px ui-monospace,monospace">${y}</text>`;
const html = `<!doctype html><meta charset="utf-8"><title>${icon.id} parts</title><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#fff">
<svg viewBox="0 0 400 320" style="width:min(100vw,960px);border:1px solid #eee">${grid}${g}${labels}</svg>`;
const file = resolve(`isoform-${icon.id}-parts.html`);
writeFileSync(file, html);
/* the picture to look at: an agent's browser often cannot open a file: page, and the page is long to read as text */
const b = await browser("inspect");
if (b) {
  const p = await b.newPage({ viewport: { width: 960, height: 768 } });
  await p.goto(pathToFileURL(file).href);
  const png = file.replace(/\.html$/, ".png");
  await p.locator("svg").screenshot({ path: png });
  await b.close();
  console.log(`${png}   (look at this picture; do not read the .html)`);
} else console.log(`${file}   (open it in a browser; do not read it as text)`);
