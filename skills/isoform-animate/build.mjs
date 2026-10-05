#!/usr/bin/env node
/**
 * Puts a figure on the bench: `node build.mjs <figure.js> [out.html]` writes one
 * self-contained page: bench.html with the icon, kernel.js and the figure in its
 * three slots and nothing else changed. Without a path the page is
 * isoform-<name>.html in the working directory.
 *
 * The icon is the one the figure declares (`icon` and `variant` in its
 * isoform({ … }) call). It is read from the first of: $ISOFORM_ICONS, the
 * repository's data/ folder beside this skill, or the published copy on GitHub.
 */
import { existsSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
export const REMOTE = "https://raw.githubusercontent.com/choicealex/isoform/main/data";

/** The figure's declaration: the last isoform({ … }) call, so a key of the same name earlier in the figure is not taken for it. */
export function declared(figure) {
  const call = [...figure.matchAll(/\bisoform\s*\(\s*\{/g)].at(-1);
  if (!call) return {};
  const tail = figure.slice(call.index);
  const key = (k) => new RegExp(`\\b${k}:\\s*["'\`]([^"'\`]+)["'\`]`).exec(tail)?.[1] ?? null;
  return { name: key("name"), icon: key("icon"), variant: key("variant") };
}

function local() {
  const dirs = [process.env.ISOFORM_ICONS, here("../../data")].filter(Boolean);
  return dirs.find((d) => existsSync(join(d, "index.json"))) ?? null;
}

/** The icon's markup and title. */
export async function iconOf(id, variant = "rounded-left") {
  const dir = local();
  let index, svg;
  if (dir) {
    index = JSON.parse(readFileSync(join(dir, "index.json"), "utf8"));
    const file = join(dir, "icons", id, `${variant}.svg`);
    svg = existsSync(file) ? readFileSync(file, "utf8") : null;
  } else {
    const get = async (p) => { const r = await fetch(`${REMOTE}/${p}`); if (!r.ok) throw new Error(`${r.status} ${REMOTE}/${p}`); return r.text(); };
    index = JSON.parse(await get("index.json"));
    svg = await get(`icons/${id}/${variant}.svg`).catch(() => null);
  }
  const meta = index.find((x) => x.id === id);
  if (!meta) throw new Error(`no icon "${id}": search data/index.json, or run node find.mjs <words>`);
  if (!svg) throw new Error(`icon "${id}" has no variant "${variant}"; it has ${meta.variants.join(", ")}`);
  return { id, variant, title: meta.title, category: meta.categoryName, svg: svg.trim() };
}

/** The page for a figure and its icon. Replacements are functions so `$&` in any of the three is pasted as it is. */
export function assemble(figure, icon) {
  const kernel = readFileSync(here("./kernel.js"), "utf8").replace(/\r\n/g, "\n").trimEnd();
  const data = `const ISOFORM_ICON = ${JSON.stringify(icon).replace(/<\//g, "<\\/")};`;
  return readFileSync(here("./bench.html"), "utf8").replace(/\r\n/g, "\n")
    .replace("/*ICON*/", () => data)
    .replace("/*KERNEL*/", () => `\n${kernel}\n`)
    .replace("/*FIGURE*/", () => `\n${figure.replace(/\r\n/g, "\n").trim()}\n`);
}

export async function build(src, out) {
  const figure = readFileSync(src, "utf8");
  const d = declared(figure);
  if (!d.icon) throw new Error(`${src}: the isoform({ … }) call names no icon`);
  const icon = await iconOf(d.icon, d.variant ?? "rounded-left");
  const file = resolve(out ?? `isoform-${d.name ?? "figure"}.html`);
  writeFileSync(file, assemble(figure, icon));
  return file;
}

/* The skill is often installed as a symlink, so the path Node was given is resolved before it is compared. */
if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(here("./build.mjs"))) {
  const [src, out] = process.argv.slice(2);
  if (!src) { console.error("usage: node build.mjs <figure.js> [out.html]"); process.exit(2); }
  build(src, out).then((f) => console.log(f), (e) => { console.error(e.message); process.exit(1); });
}
