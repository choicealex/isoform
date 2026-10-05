#!/usr/bin/env node
/**
 * Finds Isocons icons by words in their id or title: `node find.mjs <words…>`.
 * Prints the best matches as `id · title · category`, most words matched first.
 * With --all it lists the whole set, grouped by category.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { REMOTE } from "./build.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const dir = [process.env.ISOFORM_ICONS, here("../../data")].filter(Boolean).find((d) => existsSync(join(d, "index.json")));
const index = dir
  ? JSON.parse(readFileSync(join(dir, "index.json"), "utf8"))
  : await fetch(`${REMOTE}/index.json`).then((r) => r.json());

const args = process.argv.slice(2);
if (!args.length) { console.error("usage: node find.mjs <words…> | --all"); process.exit(2); }
if (args[0] === "--all") {
  const by = Map.groupBy(index, (x) => x.categoryName);
  for (const [cat, list] of by) console.log(`\n${cat} (${list.length})\n${list.map((x) => x.id).join("  ")}`);
  process.exit(0);
}
const words = args.join(" ").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
const scored = index.map((x) => {
  const hay = `${x.id} ${x.title}`.toLowerCase();
  const hits = words.filter((w) => hay.includes(w)).length;
  const exact = words.some((w) => x.id === w || x.id.split("-").includes(w)) ? 0.5 : 0;
  return { x, s: hits + exact };
}).filter((r) => r.s > 0).sort((a, b) => b.s - a.s || a.x.id.length - b.x.id.length);
if (!scored.length) { console.log("no match: try a broader word, or --all"); process.exit(1); }
for (const { x } of scored.slice(0, 20)) console.log(`${x.id} · ${x.title} · ${x.categoryName}`);
