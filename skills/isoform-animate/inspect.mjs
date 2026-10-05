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
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { browser } from "./browser.mjs";
import { iconOf } from "./build.mjs";

const [id, variant = "rounded-left"] = process.argv.slice(2);
if (!id) { console.error("usage: node inspect.mjs <icon-id> [variant]"); process.exit(2); }
const icon = await iconOf(id, variant);
const vb = /viewBox="([^"]+)"/.exec(icon.svg)[1].split(/[\s,]+/).map(Number);
const scale = Math.min(220 / vb[3], 300 / vb[2]); // the kernel's default placement
const st = (x, y) => [200 + (x - vb[0] - vb[2] / 2) * scale, 166 + (y - vb[1] - vb[3] / 2) * scale];

/** Every on-curve point and every straight segment of a path. */
function walk(d) {
  const tok = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/g) || [];
  const pts = [], segs = [];
  let i = 0, cmd = "", x = 0, y = 0, sx = 0, sy = 0, curved = 0;
  const n = () => parseFloat(tok[i++]);
  const ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7 };
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
    const C = cmd.toUpperCase(), rel = cmd !== C;
    if (C === "Z") { segs.push([x, y, sx, sy]); x = sx; y = sy; continue; }
    if (!ARGS[C] || i + ARGS[C] > tok.length) break;
    const ox = rel ? x : 0, oy = rel ? y : 0;
    let nx = x, ny = y;
    if (C === "M") { nx = n() + ox; ny = n() + oy; sx = nx; sy = ny; cmd = rel ? "l" : "L"; }
    else if (C === "L" || C === "T") { nx = n() + ox; ny = n() + oy; segs.push([x, y, nx, ny]); }
    else if (C === "H") { nx = n() + ox; segs.push([x, y, nx, ny]); }
    else if (C === "V") { ny = n() + oy; segs.push([x, y, nx, ny]); }
    else { i += ARGS[C] - 2; nx = n() + ox; ny = n() + oy; curved++; }
    x = nx; y = ny; pts.push([x, y]);
  }
  return { pts, segs, curved };
}

/** Which way a face looks, from its edges: verticals with one diagonal are a side, two diagonals are a top. */
function facing({ segs, curved }) {
  let up = 0, dr = 0, dl = 0;
  for (const [x0, y0, x1, y1] of segs) {
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
    if (len < 0.5) continue;
    if (Math.abs(dx) < 0.2 * len) up += len;
    else if (dx * dy > 0) dr += len; // runs down-right
    else dl += len;
  }
  const total = up + dr + dl;
  if (curved > segs.length) return "curved";
  if (!total) return "dot";
  if (up < 0.15 * total) return "top";
  return dr > dl ? "left" : "right"; // a face whose long edges run down-right faces left, toward the viewer's left
}

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
  /* a straight-edged face lists its corners, which are where a cut goes */
  if (d && /^[\sMLHVZmlhvz\d.,eE+-]*$/.test(d)) {
    const w = walk(d);
    const corners = w.pts.filter((p, j, a) => j === 0 || Math.hypot(p[0] - a[j - 1][0], p[1] - a[j - 1][1]) > 0.5);
    if (corners.length <= 16) console.log(`       corners ${corners.map(([x, y]) => st(x, y).map((n) => Math.round(n)).join(",")).join("  ")}`);
  }
});

/* the axes the kernel will measure, the same way (the two strongest non-vertical edge directions), so a wrong one is
   seen before a figure moves along it. Isocons' top and right views are not all one projection */
{
  const bins = new Float64Array(180);
  for (const m of shapes) {
    const d = /\bd="([^"]+)"/.exec(m[0])?.[1];
    if (!d) continue;
    for (const [x0, y0, x1, y1] of walk(d).segs) {
      const len = Math.hypot(x1 - x0, y1 - y0);
      if (len < 1) continue;
      const a = ((Math.round((Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI) % 180) + 180) % 180;
      if (a > 80 && a < 100) continue;
      bins[a] += len;
    }
  }
  const peak = (skip) => { let best = -1, at = 0; for (let a = 0; a < 180; a++) { if (skip != null && Math.min(Math.abs(a - skip), 180 - Math.abs(a - skip)) < 20) continue; const w = bins[a] + bins[(a + 1) % 180] + bins[(a + 179) % 180]; if (w > best) { best = w; at = a; } } return at; };
  const a1 = peak(), a2 = peak(a1);
  const vec = (a) => [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)];
  const down = (w) => (w[1] < 0 ? [-w[0], -w[1]] : w);
  let u = down(vec(a1)), v = down(vec(a2));
  if (Math.sign(u[0]) === Math.sign(v[0]) && Math.min(Math.abs(u[1]), Math.abs(v[1])) < 0.15) { if (Math.abs(u[1]) < Math.abs(v[1])) u = [-u[0], -u[1]]; else v = [-v[0], -v[1]]; }
  if (u[0] < v[0]) [u, v] = [v, u];
  const ok = u[0] > 0 && v[0] < 0;
  const f = (w) => w.map((n) => n.toFixed(2)).join(", ");
  console.log(ok ? `axes   u ${f(u)}   v ${f(v)}   (measured; check them against the corners above)`
    : "axes   NOT measured: the kernel falls back to true isometric. Read two edge directions off the corners and pass icon(svg, src, { u: [x, y], v: [x, y] })");
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
