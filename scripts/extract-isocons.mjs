#!/usr/bin/env node
/**
 * Pulls the Isocons set (isocons.app, CC BY 4.0) out of the site's page bundle
 * into plain SVG: `node scripts/extract-isocons.mjs <page-chunk.js> [outDir]`.
 *
 * The site ships every icon as inline JSX inside one Next.js chunk
 * (/_next/static/chunks/app/(main)/page-*.js). Each icon is an object literal
 *   {id, title, category, categoryName, sides:{edge:{sharp:{left,top,right}, rounded:{…}}}}
 * whose six variants are `(0,e.jsx)("svg", {...})` calls.
 *
 * The bundle is read as data and never executed: a small parser accepts only
 * the literal subset the icons use (objects, arrays, strings, numbers, !0/!1,
 * and jsx calls) and skips any icon that holds anything else.
 *
 * Writes <outDir>/icons/<id>/<edge>-<side>.svg and <outDir>/index.json.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [src, outDir = "data"] = process.argv.slice(2);
if (!src) {
  console.error("usage: node scripts/extract-isocons.mjs <page-chunk.js> [outDir]");
  process.exit(2);
}
const js = readFileSync(src, "utf8");

/** A recursive-descent reader over js from i. Returns [value, nextIndex]; throws on anything outside the subset. */
function parse(s, i) {
  const ws = () => { while (/\s/.test(s[i])) i++; };
  const expect = (t) => {
    ws();
    if (!s.startsWith(t, i)) throw new Error(`expected ${t} at ${i}: ${s.slice(i, i + 30)}`);
    i += t.length;
  };
  function str() {
    const q = s[i++];
    let out = "";
    while (s[i] !== q) {
      if (s[i] === "\\") {
        const c = s[i + 1];
        if (c === "u") { out += String.fromCharCode(parseInt(s.slice(i + 2, i + 6), 16)); i += 6; continue; }
        if (c === "x") { out += String.fromCharCode(parseInt(s.slice(i + 2, i + 4), 16)); i += 4; continue; }
        out += { n: "\n", t: "\t", r: "\r" }[c] ?? c; i += 2; continue;
      }
      out += s[i++];
    }
    i++;
    return out;
  }
  function value() {
    ws();
    const c = s[i];
    if (c === '"' || c === "'") return str();
    if (c === "{") {
      i++; const o = {};
      for (;;) {
        ws();
        if (s[i] === "}") { i++; return o; }
        let key;
        if (s[i] === '"' || s[i] === "'") key = str();
        else { const m = /^[A-Za-z_$][\w$]*/.exec(s.slice(i, i + 64)); if (!m) throw new Error(`bad key at ${i}`); key = m[0]; i += key.length; }
        expect(":");
        o[key] = value();
        ws();
        if (s[i] === ",") i++;
      }
    }
    if (c === "[") {
      i++; const a = [];
      for (;;) {
        ws();
        if (s[i] === "]") { i++; return a; }
        a.push(value());
        ws();
        if (s[i] === ",") i++;
      }
    }
    if (s.startsWith("!0", i)) { i += 2; return true; }
    if (s.startsWith("!1", i)) { i += 2; return false; }
    if (s.startsWith("void 0", i)) { i += 6; return undefined; }
    const jsx = /^\(0,[A-Za-z_$][\w$]*\.jsxs?\)\(/.exec(s.slice(i, i + 40));
    if (jsx) {
      i += jsx[0].length;
      const tag = value();
      if (typeof tag !== "string") throw new Error(`component tag at ${i}`);
      expect(",");
      const props = value();
      ws();
      if (s[i] === ",") { i++; value(); } // a key argument, unused
      expect(")");
      return { tag, props };
    }
    const num = /^-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(s.slice(i, i + 40));
    if (num) { i += num[0].length; return Number(num[0]); }
    throw new Error(`unsupported at ${i}: ${s.slice(i, i + 30)}`);
  }
  const v = value();
  return [v, i];
}

/* SVG attributes that keep their camelCase; every other camelCase React prop is kebab in markup. */
const CAMEL = new Set(["viewBox", "maskUnits", "maskContentUnits", "gradientUnits", "gradientTransform", "patternUnits", "patternTransform", "preserveAspectRatio", "clipPathUnits"]);
const kebab = (k) => (CAMEL.has(k) ? k : k === "className" ? "class" : k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`));
const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function serialise(n) {
  if (n == null || n === false || n === true) return "";
  if (typeof n === "string" || typeof n === "number") return esc(n);
  if (Array.isArray(n)) return n.map(serialise).join("");
  const { children, style, ...rest } = n.props;
  let attrs = Object.entries(rest)
    .filter(([, v]) => v != null && typeof v !== "object")
    .map(([k, v]) => ` ${kebab(k)}="${esc(v)}"`)
    .join("");
  if (style && typeof style === "object") {
    attrs += ` style="${esc(Object.entries(style).map(([k, v]) => `${kebab(k)}:${v}`).join(";"))}"`;
  }
  const inner = serialise(children);
  return inner ? `<${n.tag}${attrs}>${inner}</${n.tag}>` : `<${n.tag}${attrs}/>`;
}

const START = /\{id:"([^"]+)",title:"[^"]*",category:"/g;
const index = [];
const seen = new Set();
let failed = 0;
for (const m of js.matchAll(START)) {
  let icon;
  try {
    [icon] = parse(js, m.index);
  } catch (err) {
    failed++;
    console.error(`skip ${m[1]}: ${err.message}`);
    continue;
  }
  if (!icon.sides?.edge) continue;
  /* a few ids are not slugs ("swap verical", "E911-emergency"): the folder name is the slug, sourceId keeps the original */
  let id = icon.id.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const base = id;
  for (let k = 2; seen.has(id); k++) id = `${base}-${k}`; // the set repeats a few ids (two "pinch")
  seen.add(id);
  const dir = join(outDir, "icons", id);
  mkdirSync(dir, { recursive: true });
  const variants = [];
  for (const [edge, sides] of Object.entries(icon.sides.edge)) {
    for (const [side, svg] of Object.entries(sides ?? {})) {
      if (!svg?.tag) continue;
      writeFileSync(join(dir, `${edge}-${side}.svg`), serialise(svg));
      variants.push(`${edge}-${side}`);
    }
  }
  index.push({ id, ...(id === icon.id ? {} : { sourceId: icon.id }), title: icon.title, category: icon.category, categoryName: icon.categoryName, variants });
}

writeFileSync(join(outDir, "index.json"), `[\n${index.map((x) => JSON.stringify(x)).join(",\n")}\n]\n`);
const files = index.reduce((n, x) => n + x.variants.length, 0);
console.log(`${index.length} icons, ${files} svg files, ${failed} failed -> ${outDir}`);
