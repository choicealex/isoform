#!/usr/bin/env node
/**
 * Sweeps every Isocons icon in every view through the skill's own geometry: `node scripts/sweep.mjs`.
 * Writes data/sweep.json (per icon, per view: what the skill will meet) and prints a summary.
 *
 * Per view: faces, dot faces (zero size: rounded drawings carry a few), tiny faces (smaller than 6 stage units at the
 * default placement: about 3.6px at the 240px floor, unreadable), whether the kernel can measure the axes, and the
 * placed width. Flags: `axes` (not measured: the figure must pass {u, v}), `tiny` (4+ tiny faces: too much detail to
 * animate part by part at small sizes), `dense` (30+ faces), `dots` (3+ zero-size faces to leave out of parts).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { axesOf, walk } from "../skills/isoform-animate/geometry.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const index = JSON.parse(readFileSync(join(root, "data/index.json"), "utf8"));
const VIEWS = ["rounded-left", "rounded-top", "rounded-right", "sharp-left", "sharp-top", "sharp-right"];

const out = {};
const tally = { views: 0, axes: 0, tiny: 0, dense: 0, dots: 0, clean: 0 };
const byCat = {};
for (const icon of index) {
  out[icon.id] = {};
  for (const v of VIEWS) {
    let svg;
    try { svg = readFileSync(join(root, "data/icons", icon.id, `${v}.svg`), "utf8"); } catch { continue; }
    const vb = /viewBox="([^"]+)"/.exec(svg)[1].split(/[\s,]+/).map(Number);
    const scale = Math.min(220 / vb[3], 300 / vb[2]);
    let faces = 0, dots = 0, tiny = 0;
    for (const m of svg.matchAll(/<(path|circle|ellipse|rect)\b[^>]*>/g)) {
      faces++;
      const d = /\bd="([^"]+)"/.exec(m[0])?.[1];
      let w = 0, h = 0;
      if (d) {
        const pts = walk(d).pts;
        if (pts.length) {
          const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
          w = (Math.max(...xs) - Math.min(...xs)) * scale; h = (Math.max(...ys) - Math.min(...ys)) * scale;
        }
      } else {
        const a = (n) => parseFloat(new RegExp(`\\b${n}="([^"]+)"`).exec(m[0])?.[1] ?? "0");
        w = (a("width") || 2 * (a("rx") || a("r"))) * scale; h = (a("height") || 2 * (a("ry") || a("r"))) * scale;
      }
      if (Math.max(w, h) < 0.6) dots++;
      else if (Math.max(w, h) < 6) tiny++;
    }
    const axes = axesOf(svg);
    const flags = [];
    if (!axes) flags.push("axes");
    if (tiny >= 4) flags.push("tiny");
    if (faces >= 30) flags.push("dense");
    if (dots >= 3) flags.push("dots");
    out[icon.id][v] = { faces, dots, tiny, width: Math.round(vb[2] * scale), ...(axes ? { u: axes.u.map((n) => +n.toFixed(2)), v: axes.v.map((n) => +n.toFixed(2)) } : {}), flags };
    tally.views++;
    for (const f of flags) tally[f]++;
    if (!flags.length) tally.clean++;
    if (!byCat[icon.categoryName]) byCat[icon.categoryName] = { views: 0, clean: 0, axes: 0, tiny: 0, dense: 0 };
    const c = byCat[icon.categoryName];
    c.views++; if (!flags.length) c.clean++; for (const f of flags) if (f in c) c[f]++;
  }
}
writeFileSync(join(root, "data/sweep.json"), `${JSON.stringify(out)}\n`);
const pct = (n, d) => `${((100 * n) / d).toFixed(1)}%`;
console.log(`sweep     ${index.length} icons, ${tally.views} views → data/sweep.json`);
console.log(`clean     ${tally.clean} (${pct(tally.clean, tally.views)})`);
for (const f of ["axes", "tiny", "dense", "dots"]) console.log(`${f.padEnd(9)} ${tally[f]} (${pct(tally[f], tally.views)})`);
console.log("\nby category (views · clean · axes · tiny · dense)");
for (const [c, t] of Object.entries(byCat)) console.log(`${c.padEnd(22)} ${String(t.views).padStart(5)} · ${pct(t.clean, t.views).padStart(6)} · ${String(t.axes).padStart(4)} · ${String(t.tiny).padStart(4)} · ${String(t.dense).padStart(4)}`);
const byView = Object.fromEntries(VIEWS.map((v) => [v, Object.values(out).filter((x) => x[v]?.flags.includes("axes")).length]));
console.log("\naxes not measured, by view:", JSON.stringify(byView));
