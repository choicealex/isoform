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
/* a whole word counts most, the start of a word less; "lock" inside "clock" or "car" inside "card" only when nothing else matches */
const score = (inside) => index.map((x) => {
  const toks = `${x.id} ${x.title}`.toLowerCase().split(/[^a-z0-9]+/);
  let s = 0;
  for (const w of words) s += toks.includes(w) ? 1 : toks.some((t) => t.startsWith(w) || (w.length > 3 && w.startsWith(t) && t.length > 3)) ? 0.6 : inside && toks.some((t) => t.includes(w)) ? 0.3 : 0;
  return { x, s };
}).filter((r) => r.s > 0).sort((a, b) => b.s - a.s || a.x.id.length - b.x.id.length);
let scored = score(false);
if (!scored.length) {
  scored = score(true);
  if (scored.length) console.log(`no icon has the word "${words.join(" ")}"; these only contain it inside a word:`);
}
if (!scored.length) { console.log(`no match: Isocons may not have this object. Try what it is made of or does (padlock → lock, key), or --all`); process.exit(1); }
for (const { x } of scored.slice(0, 20)) console.log(`${x.id} · ${x.title} · ${x.categoryName}`);
