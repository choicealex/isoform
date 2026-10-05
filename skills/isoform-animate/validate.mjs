#!/usr/bin/env node
/**
 * Checks a page made by build.mjs: `node validate.mjs isoform-<name>.html`.
 * Prints what to fix and exits 1, or prints `ok` and exits 0. It reads text,
 * so it catches what is mechanical; the look (look.md) catches the rest.
 * Each line it prints starts with the check's name:
 *
 *   bench     the page is bench.html and kernel.js untouched, with only the icon and the figure in their slots
 *   parse     the figure is valid JavaScript
 *   text      no words inside the drawing (rule 10)
 *   paint     no colour, fill, stroke width, opacity, filter or style of its own on the drawing (rules 04, 09)
 *   faces     no face rewritten: no setAttribute("d"), no scale (rule 09)
 *   outside   nothing loaded or reached outside the file
 *   clock     no timers, frames or animations of its own; it joins IF.register (rule 07)
 *   tween     every tset is given its four values, the delay last
 *   hit       input only through IF.pointer; nothing measured on screen (rule 01)
 *   readout   it writes read.textContent
 *   handle    mount returns { set, destroy }
 *   declare   the file ends with isoform({ name, icon, variant, means, rules, range, mount }), effect when it uses gl
 *   physics   the effect sentence names a physical thing, not a decoration; an effect has traces under it (rule 11)
 *   length    at most 180 lines
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { assemble } from "./build.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const LIMIT = 180;

/** Source without comments and, when `strings` is false, with string contents emptied, so prose is never read as code. */
export function bare(src, strings = true) {
  let out = "", i = 0;
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (c === "/" && d === "/") { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (c === "/" && d === "*") { const e = src.indexOf("*/", i + 2); i = e < 0 ? src.length : e + 2; out += " "; continue; }
    if (c === '"' || c === "'" || c === "`") {
      const q = c; let j = i + 1;
      while (j < src.length && src[j] !== q) j += src[j] === "\\" ? 2 : 1;
      out += strings ? src.slice(i, j + 1) : q + q;
      i = j + 1; continue;
    }
    out += c; i++;
  }
  return out;
}

export function check(html) {
  const errs = [];
  const say = (name, msg) => errs.push(`${name.padEnd(8)}  ${msg}`);
  const figure = /<script type="module" id="if-figure">\n?([\s\S]*?)\n?<\/script>/.exec(html)?.[1];
  const data = /const ISOFORM_ICON = (\{[\s\S]*?\});\n?<\/script>/.exec(html)?.[1];
  if (figure == null || !data) { say("bench", "this is not a page made by build.mjs: run node build.mjs <name>.js"); return errs; }

  let icon;
  try { icon = JSON.parse(data.replace(/<\\\//g, "</")); } catch { say("bench", "the icon slot does not hold the icon build.mjs put there"); }
  if (icon && assemble(figure, icon) !== html.replace(/\r\n/g, "\n")) {
    say("bench", "the page differs from bench.html + kernel.js outside the figure: never edit them; rebuild with build.mjs");
  }

  const dir = mkdtempSync(join(tmpdir(), "isoform-"));
  try {
    const f = join(dir, "figure.mjs");
    writeFileSync(f, figure);
    const r = spawnSync(process.execPath, ["--check", f], { encoding: "utf8" });
    if (r.status !== 0) say("parse", (r.stderr.split("\n").find((l) => /Error/.test(l)) ?? "syntax error").trim());
  } finally { rmSync(dir, { recursive: true, force: true }); }

  const code = bare(figure, false);   // strings emptied: what the figure does
  const glsl = [...figure.matchAll(/frag:\s*`([\s\S]*?)`/g)].map((m) => m[1]).join("\n");
  const js = code;

  if (/\bcreateElement(NS)?\s*\(\s*["'`][^"'`]*text|<text\b|\.innerHTML\b|\.outerHTML\b|insertAdjacent/.test(bare(figure)) || /\btextContent\b/.test(js.replace(/\bread\.textContent\b/g, ""))) {
    say("text", "words in the drawing: names go to read.textContent and nowhere else (rule 10)");
  }
  if (/setAttribute\s*\(\s*["'`](stroke|fill|opacity|filter|style|stroke-width|class|transform)["'`]/.test(bare(figure)) || /\.style\b|classList\.(add|toggle|remove)\s*\(\s*["'`](?!hi|dim)/.test(bare(figure))) {
    say("paint", "the figure styles the drawing itself: use part.hi / part.dim, move / tilt (rules 04, 09)");
  }
  if (/setAttribute\s*\(\s*["'`]d["'`]/.test(bare(figure)) || /\bscale\s*\(/.test(js)) {
    say("faces", "a face is rewritten or scaled: group, move, cut along an axis, never redraw (rule 09)");
  }
  if (/\bfetch\s*\(|\bimport\s*\(|\bimport\s+[\w{*]|XMLHttpRequest|new\s+(Image|Worker|WebSocket)|https?:\/\//.test(bare(figure))) {
    say("outside", "the figure reaches outside the file: everything it needs is IF and the icon");
  }
  if (/\b(setTimeout|setInterval|requestAnimationFrame|queueMicrotask|\.animate\s*\(|beginElement)\b/.test(js) || /@keyframes|<animate/.test(bare(figure))) {
    say("clock", "a clock of its own: all motion goes through IF.register (rule 07)");
  }
  if (!/\bregister\s*\(/.test(js)) say("clock", "the figure never joins the loop: IF.register(stage, tick)");
  for (const m of js.matchAll(/\btset\s*\(([^;]*?)\)\s*[;,\n]/g)) {
    if (m[1].split(",").length < 4) say("tween", `tset(${m[1].trim()}) needs (tween, to, now, delay)`);
  }
  if (/getBoundingClientRect|elementFromPoint|elementsFromPoint|:hover|addEventListener|onpointer|onmouse|ontouch/.test(js)) {
    say("hit", "input or measuring outside IF.pointer: test the rest shape with icon.hit or part.rest (rule 01)");
  }
  if (!/\bread\.textContent\s*=/.test(js)) say("readout", "the figure never writes read.textContent: say what is under the pointer, and rest");
  const handles = [...js.matchAll(/\breturn\s*\{/g)].map((m) => js.slice(m.index, m.index + 240));
  if (!handles.some((h) => /\bset\s*[(:,]/.test(h) && /\bdestroy\b/.test(h))) {
    say("handle", "mount must return { set, destroy }");
  }

  const call = [...figure.matchAll(/\bisoform\s*\(\s*\{/g)].at(-1);
  const tail = call ? figure.slice(call.index) : "";
  if (!call || /[^\s;]/.test(bare(tail.slice(tail.lastIndexOf(")") + 1)))) say("declare", "the file must end with isoform({ … })");
  for (const k of ["name", "icon", "variant", "means", "rules", "range", "mount"]) {
    if (call && !new RegExp(`\\b${k}\\s*[:,}]`).test(tail)) say("declare", `isoform({ … }) has no ${k}`);
  }
  const means = /\bmeans:\s*["'`]([^"'`]*)["'`]/.exec(tail)?.[1] ?? "";
  if (means.length > 140) say("declare", `means is ${means.length} characters; at most 140`);
  const range = /\brange:\s*\[([^\]]*)\]/.exec(tail)?.[1]?.split(",").map(Number);
  if (range && (range.length !== 3 || range.some(isNaN) || !((range[0] < range[1] && range[1] < range[2]) || (range[0] > range[1] && range[1] > range[2])))) {
    say("declare", "range is three numbers that move one way: the value at intensity 0, 0.5 and 1");
  }

  const usesGl = /\bgl\s*\(/.test(js);
  const effect = /\beffect:\s*["'`]([^"'`]*)["'`]/.exec(tail)?.[1] ?? "";
  if (usesGl && !effect) say("declare", "the figure draws an effect but declares none: effect: \"what the real object does\"");
  if (effect && /^\s*(a |an |the )?(soft |subtle |ambient )?(glow|sparkle|shimmer|particles|confetti|sparkles|halo|bloom)\b/i.test(effect)) {
    say("physics", `"${effect}" is a decoration: name what the real object does (rule 11)`);
  }
  if (usesGl && !/\.on\b/.test(js)) say("physics", "the figure never reads fx.on: it must work with effects off (rule 11)");
  if (usesGl && !/\btrace\s*\(/.test(js)) say("physics", "the effect has no trace: draw what happens in hairline first, the effect only adds material under it (rule 11)");
  if (glsl && /vec3\s*\(\s*(0?\.\d+|1\.0|1)\s*,/.test(glsl) && !/rule 12|one colour|physical colour/i.test(figure)) {
    say("physics", "the effect carries a colour of its own without saying why: palette uniforms, or one physical colour with a comment (rule 12)");
  }

  const lines = figure.split("\n").length;
  if (lines > LIMIT) say("length", `${lines} lines; at most ${LIMIT}: a longer figure is usually two ideas`);
  return errs;
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(here("./validate.mjs"))) {
  const file = process.argv[2];
  if (!file) { console.error("usage: node validate.mjs isoform-<name>.html"); process.exit(2); }
  const errs = check(readFileSync(file, "utf8"));
  if (errs.length) { for (const e of errs) console.log(e); process.exit(1); }
  console.log("ok");
}
