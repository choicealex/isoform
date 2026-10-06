#!/usr/bin/env node
/**
 * Copies the engine and the figures into the site: `node scripts/sync-figures.mjs` (runs before dev and build).
 *
 * public/iso/kernel.js          the engine, as the skill ships it
 * public/iso/figures/<name>.js  each figure, as written by the skill
 * public/iso/html/isoform-<name>.html  each figure's standalone page (build.mjs), for copy and download
 * public/iso/icons/<id>/<view>.svg    the icon's six Isocons views, as drawn
 * lib/figures.json              what the pages need to list and mount them, icon markup included
 * lib/kernel-index.txt          the engine's API index, as written at the top of kernel.js
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assemble, declared, iconOf } from "../../skills/isoform-animate/build.mjs";
import FIGURES from "../figures.config.mjs";

const site = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = (p) => { const f = join(site, p); mkdirSync(dirname(f), { recursive: true }); return f; };

/* the declaration's plain fields, read as text: the figure is never run here */
const field = (src, k) => new RegExp(`\\b${k}:\\s*"((?:[^"\\\\]|\\\\.)*)"`).exec(src.slice(src.lastIndexOf("isoform(")))?.[1] ?? null;
const list = (src, k) => {
  const m = new RegExp(`\\b${k}:\\s*\\[([^\\]]*)\\]`).exec(src.slice(src.lastIndexOf("isoform(")));
  return m ? m[1].split(",").map((n) => Number(n.trim())).filter((n) => !Number.isNaN(n)) : [];
};

const kernel = readFileSync(join(site, "../skills/isoform-animate/kernel.js"), "utf8");
writeFileSync(out("public/iso/kernel.js"), kernel);
/* the engine's own index (the comment above var IF), for /docs: the docs never drift from the code */
const index = kernel.slice(kernel.indexOf("/*"), kernel.indexOf("var IF")).replace(/^\/\*\s*|\s*\*\/\s*$/g, "").split("\n").map((l) => l.replace(/^ \* ?/, "")).join("\n");
writeFileSync(out("lib/kernel-index.txt"), `${index.trim().replace(/^\* /, "")}\n`);
const manifest = [];
for (const f of FIGURES) {
  const src = readFileSync(join(site, f.file), "utf8");
  const { name, icon: id, variant } = declared(src);
  if (!name || !id) throw new Error(`${f.file}: no isoform({ name, icon }) declaration`);
  const icon = await iconOf(id, variant ?? "rounded-left");
  writeFileSync(out(`public/iso/figures/${name}.js`), src);
  /* all six Isocons views of the icon (sharp and rounded, left, top, right), for the specimen's views row */
  const views = ["sharp-left", "sharp-top", "sharp-right", "rounded-left", "rounded-top", "rounded-right"];
  for (const v of views) writeFileSync(out(`public/iso/icons/${id}/${v}.svg`), (await iconOf(id, v)).svg);
  writeFileSync(out(`public/iso/html/isoform-${name}.html`), assemble(src, icon));
  manifest.push({
    name, icon: id, variant: icon.variant, title: icon.title, category: icon.category,
    means: field(src, "means"), effect: field(src, "effect"), range: list(src, "range"), rules: list(src, "rules"),
    prompt: f.prompt, job: f.job, lines: src.split("\n").length, svg: icon.svg,
  });
}
writeFileSync(out("lib/figures.json"), `${JSON.stringify(manifest, null, 1)}\n`);
/* every Isocons icon in all six views, for the Icons page and the Six views section (img; the page tints it per theme),
   and the sweep's notes per view */
const icons = JSON.parse(readFileSync(join(site, "../data/index.json"), "utf8"));
let sweep = {};
try { sweep = JSON.parse(readFileSync(join(site, "../data/sweep.json"), "utf8")); } catch {}
const done = {};
/* an icon can have several figures (shopping-cart has two) */
for (const m of manifest) done[m.icon] = [...(done[m.icon] ?? []), m.name];
const VIEWS = ["rounded-left", "rounded-top", "rounded-right", "sharp-left", "sharp-top", "sharp-right"];
rmSync(out("public/iso/all"), { recursive: true, force: true });
for (const v of VIEWS) {
  mkdirSync(out(`public/iso/all/${v}`), { recursive: true });
  for (const ic of icons) {
    const f = join(site, "../data/icons", ic.id, `${v}.svg`);
    if (existsSync(f)) writeFileSync(out(`public/iso/all/${v}/${ic.id}.svg`), readFileSync(f)); // Isocons ships 6,041 of 6,042
  }
}
/* notes only for the views that have any, to keep the file small */
const notes = (id) => Object.fromEntries(Object.entries(sweep[id] ?? {}).filter(([, x]) => x.flags.length).map(([v, x]) => [v, x.flags]));
writeFileSync(out("lib/icons.json"), `${JSON.stringify(icons.map((ic) => ({ id: ic.id, title: ic.title, category: ic.categoryName, notes: notes(ic.id), missing: VIEWS.filter((v) => !existsSync(join(site, "../data/icons", ic.id, `${v}.svg`))), clean: Object.entries(sweep[ic.id] ?? {}).filter(([, x]) => !x.flags.length).map(([v]) => v), figures: done[ic.id] ?? [] })))}\n`);
console.log(`icons     ${icons.length} × 6 views → public/iso/all, lib/icons.json`);
console.log(`sync      ${manifest.length} figures → public/iso, lib/figures.json`);
