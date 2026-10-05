/*
 * IF: everything a figure may call. Read this index; the code under it is the
 * engine, and a figure should not need to read it.
 *
 * The stage is a 400 × 320 viewBox. An Isocons icon is placed in it with
 * IF.icon, which keeps the icon's own drawing: every face is one closed path,
 * filled with the face colour and painted in the icon's order. A figure never
 * redraws a face. It groups faces into parts and moves the parts.
 *
 * Isocons draws on its own axes, not the 2:1 camera: IF.icon measures them
 * from the icon's edges. icon.u runs down-right, icon.v down-left, up is
 * screen up. A move of (a, b, c) is a along u, b along v and c up, in stage
 * units, so a part slides along its own edges.
 *
 * The icon
 *   icon(svg, src, {cx, cy, h})        places the icon's markup src in the stage, centred on (cx, cy), h units tall;
 *                                      returns {g, paths, u, v, scale, iso, cut, face, part, hit, near}
 *   icon.pt(x, y)                      a point as inspect.mjs prints it (default placement) -> this placement. Pass every
 *                                      point you read off inspect through it, unless you kept the default placement
 *   icon.cut(i, [x, y], axis)          cuts face i (an index or a path) along a line through the stage point, running along
 *                                      "u", "v" or "up"; returns [above, below] (left, right for "up"), in i's place in the paint
 *                                      order. Indices never shift: afterwards i means the first piece. Isocons draws coplanar faces as ONE path: a part that comes away needs a cut first
 *   icon.face(i, a, b, c, before)      a copy of face i moved by (a, b, c), painted just before `before` (a part or a path):
 *                                      the surface a moving part was hiding, so the drawing never shows a hole (rule 06)
 *   icon.facet([[x, y], …], before)    a new face from stage corners: the broken surface a cut exposes. It can join a part
 *   icon.part(name, [faces], {paint})  faces (indices or paths) become one part: {name, g, paths, rest, move, tilt, hi, dim}
 *                                      the part paints where its last face did ({paint: "first"}: its first)
 *   part.rest                          {cx, cy, x0, y0, x1, y1}: its box at rest, in stage units, measured once
 *   part.move(a, b, c)                 places the part at that offset from rest; the same offset again does nothing
 *   part.tilt(deg, [px, py])           a small screen-plane turn about a stage point, for a wobble or a hinge; keep it under 15°
 *   part.hi(on)  part.dim(on)          the bright stroke, the dim stroke: the whole palette
 *   icon.hit(point)                    the part whose REST shape holds the stage point, topmost first, or null (rule 01)
 *   icon.near(point)                   {part, d}: the part whose rest centre is nearest, and how far, in stage units
 *   icon.iso(a, b, c)                  [dx, dy]: the screen offset of a world move, for placing an effect
 *   after(a, b)                        paints part a just after part b, for a part that comes forward
 * Maths
 *   clamp(v, a, b)  lerp(a, b, t)  smooth(e0, e1, x)  rad(deg)  r2(n)
 * The continuous clock: one spring per moving number
 *   spring(x, opts)                    at rest on x; write .t to retarget; opts {k, c, m, eps}, default k 100, c 18, m 1
 *   stepS(sp, dt)                      advances by dt seconds; returns whether it is still moving
 * The discrete clock: a 700ms tween on (.32, .72, 0, 1)
 *   tween(v, dur)  tset(tw, to, now, delay)  tval(tw, now)  tdone(tw, now)
 *   reducedMotion()                    true when the reader asked for less motion; springs and tweens land at once
 * Life
 *   register(stage, tick)              joins the one frame loop; tick(dt seconds, now ms) returns true while anything moves;
 *                                      gives {wake, unregister}. The loop sleeps offscreen and when every tick returns false
 *   pointer(stage, {move, down, leave}) points in stage units; returns its disposer
 *   disposer()                         {add, on, dispose}: collects tear-down, so destroy is bag.dispose
 * The effect layer: WebGL, opt-in, one per figure at most
 *   gl(stage, {layer, frag, uniforms}) layer "under" (behind the faces: plumes, dust, arcs in the open) or "over" (on top,
 *                                      masked to parts: liquid behind glass, heat in metal); uniforms {name: "float"|"vec2"|"vec3"}
 *                                      returns {on, set(name, value), mask(parts), draw(now), dispose}
 *                                      on is false when the reader turned effects off or WebGL is missing: the figure must still work
 *   frag                               GLSL defining  vec4 effect(vec2 p)  : p is the stage point, y down; return premultiplied rgba
 *                                      given: u_time (s), u_ptr (stage point, or -1), u_dark (0|1), u_line, u_hi, u_face, u_plate (rgb),
 *                                      mask(p) (1 inside the masked parts), hash(p), noise(p), fbm(p), seg(p, a, b) (distance to a segment)
 *
 * Classes on a path: none (face fill, line stroke) · hi (bright stroke) · dim (dim stroke). A figure sets no colour of its own.
 */
var IF = (() => {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const W = 400, H = 320;

  /* maths */
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  const rad = (d) => (d * Math.PI) / 180;
  const r2 = (n) => Math.round(n * 100) / 100;

  /* motion preference */
  let reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reducedMotion = () => reduced;
  if (typeof matchMedia === "function") {
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener?.("change", (e) => { reduced = e.matches; });
  }

  /* springs: the continuous clock */
  function spring(x, o = {}) { return { x, v: 0, t: x, k: o.k ?? 100, c: o.c ?? 18, m: o.m ?? 1, eps: o.eps ?? 0.001 }; }
  function stepS(s, dt) {
    if (reduced) { s.x = s.t; s.v = 0; return false; }
    let left = Math.min(dt, 0.064);
    while (left > 0) {
      const h = Math.min(left, 1 / 120);
      const a = (-s.k * (s.x - s.t) - s.c * s.v) / s.m;
      s.v += a * h; s.x += s.v * h; left -= h;
    }
    if (Math.abs(s.x - s.t) < s.eps && Math.abs(s.v) < s.eps) { s.x = s.t; s.v = 0; return false; }
    return true;
  }

  /* tweens: the discrete clock */
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t;
    const sy = (t) => ((ay * t + by) * t + cy) * t;
    const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (p) => {
      let t = p;
      for (let i = 0; i < 6; i++) { const d = dx(t); if (Math.abs(d) < 1e-6) break; t -= (sx(t) - p) / d; }
      return sy(clamp(t, 0, 1));
    };
  }
  const EASE = bezier(0.32, 0.72, 0, 1);
  function tween(v, dur = 700) { return { from: v, to: v, start: 0, dur }; }
  function tset(tw, to, now, delay = 0) {
    if (tw.to === to) return;
    tw.from = tval(tw, now); tw.to = to; tw.start = now + delay;
  }
  function tval(tw, now) {
    if (reduced) return tw.to;
    const p = clamp((now - tw.start) / tw.dur, 0, 1);
    return p <= 0 ? tw.from : lerp(tw.from, tw.to, EASE(p));
  }
  const tdone = (tw, now) => reduced || now >= tw.start + tw.dur;

  /* tear-down */
  function disposer() {
    const fns = [];
    return {
      add(fn) { fns.push(fn); return fn; },
      on(el, type, fn, opts) { el.addEventListener(type, fn, opts); fns.push(() => el.removeEventListener(type, fn, opts)); },
      dispose() { while (fns.length) { try { fns.pop()(); } catch (e) { console.error(e); } } },
    };
  }

  /* the one frame loop */
  const entries = new Set();
  let raf = 0, last = 0;
  function frame(now) {
    raf = 0;
    const dt = last ? (now - last) / 1000 : 1 / 60;
    last = now;
    let more = false;
    for (const e of entries) {
      if (!e.visible || !e.awake) continue;
      let again = false;
      try { again = e.tick(dt, now); } catch (err) { console.error(err); }
      e.awake = !!again;
      more = more || e.awake;
    }
    if (more) raf = requestAnimationFrame(frame); else last = 0;
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  function register(stage, tick) {
    const e = { tick, awake: true, visible: true };
    entries.add(e);
    let io = null;
    if (typeof IntersectionObserver === "function") {
      io = new IntersectionObserver((list) => { e.visible = list[list.length - 1].isIntersecting; if (e.visible) kick(); });
      io.observe(stage);
    }
    /* a new theme changes the effect's colours, so every figure draws once more */
    const theme = () => { e.awake = true; kick(); };
    stage.addEventListener("isoform:theme", theme);
    kick();
    return {
      wake() { e.awake = true; kick(); },
      unregister() { entries.delete(e); io?.disconnect(); stage.removeEventListener("isoform:theme", theme); },
    };
  }

  /* pointer, in stage units */
  function pointer(stage, h) {
    const svg = stage.querySelector("svg");
    const at = (ev) => {
      const r = svg.getBoundingClientRect();
      return [((ev.clientX - r.left) / r.width) * W, ((ev.clientY - r.top) / r.height) * H];
    };
    const bag = disposer();
    bag.on(stage, "pointermove", (ev) => h.move?.(at(ev)));
    bag.on(stage, "pointerdown", (ev) => (h.down ?? h.move)?.(at(ev)));
    bag.on(stage, "pointerleave", () => h.leave?.());
    /* the bench's ?at= and the look script drive the figure through this, never through the DOM */
    bag.on(stage, "isoform:at", (ev) => (ev.detail ? h.move?.(ev.detail) : h.leave?.()));
    return bag.dispose;
  }

  /* path geometry: absolute and relative M L H V C S Q T A Z, segments only for the axes */
  function segments(d) {
    const tok = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/g) || [];
    const out = [];
    let i = 0, cmd = "", x = 0, y = 0, sx = 0, sy = 0;
    const n = () => parseFloat(tok[i++]);
    const ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
    while (i < tok.length) {
      if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
      const C = cmd.toUpperCase(), rel = cmd !== C;
      if (C === "Z") { out.push([x, y, sx, sy]); x = sx; y = sy; cmd = ""; continue; }
      if (!ARGS[C] || i + ARGS[C] > tok.length) break;
      const ox = rel ? x : 0, oy = rel ? y : 0;
      let nx = x, ny = y;
      if (C === "M") { nx = n() + ox; ny = n() + oy; sx = nx; sy = ny; x = nx; y = ny; cmd = rel ? "l" : "L"; continue; }
      if (C === "L" || C === "T") { nx = n() + ox; ny = n() + oy; }
      else if (C === "H") nx = n() + ox;
      else if (C === "V") ny = n() + oy;
      else if (C === "C") { i += 4; nx = n() + ox; ny = n() + oy; out.push(null); }
      else if (C === "S" || C === "Q") { i += 2; nx = n() + ox; ny = n() + oy; out.push(null); }
      else if (C === "A") { i += 5; nx = n() + ox; ny = n() + oy; out.push(null); }
      if (C === "L" || C === "H" || C === "V" || C === "T") out.push([x, y, nx, ny]);
      x = nx; y = ny;
    }
    return out.filter(Boolean);
  }

  /* the icon's two ground axes: the two strongest edge directions that are not vertical */
  function axes(paths) {
    const bins = new Float64Array(180);
    for (const p of paths) {
      for (const [x0, y0, x1, y1] of segments(p.getAttribute("d") || "")) {
        const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
        if (len < 1) continue;
        let a = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
        a = ((a % 180) + 180) % 180;
        if (a > 80 && a < 100) continue; // verticals
        bins[a] += len;
      }
    }
    const peak = (skip) => {
      let best = -1, at = 0;
      for (let a = 0; a < 180; a++) {
        if (skip != null && Math.min(Math.abs(a - skip), 180 - Math.abs(a - skip)) < 20) continue;
        const w = bins[a] + bins[(a + 1) % 180] + bins[(a + 179) % 180];
        if (w > best) { best = w; at = a; }
      }
      return at;
    };
    const a1 = peak(), a2 = peak(a1);
    const vec = (a) => [Math.cos(rad(a)), Math.sin(rad(a))];
    let u = vec(a1), v = vec(a2);
    /* u runs down-right, v down-left */
    const down = (w) => (w[1] < 0 ? [-w[0], -w[1]] : w);
    u = down(u); v = down(v);
    if (u[0] < v[0]) [u, v] = [v, u];
    if (!(u[0] > 0) || !(v[0] < 0)) { u = [0.866, 0.5]; v = [-0.866, 0.5]; } // a flat icon: fall back to true isometric
    return { u, v };
  }

  function mk(tag, attrs, parent) {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }

  /* placing an Isocons icon */
  function icon(svg, src, o = {}) {
    const doc = new DOMParser().parseFromString(src, "image/svg+xml");
    const root = doc.documentElement;
    const vb = (root.getAttribute("viewBox") || "0 0 100 100").split(/[\s,]+/).map(Number);
    const h = o.h ?? 220, cx = o.cx ?? 200, cy = o.cy ?? 166;
    const scale = h / vb[3];
    const g = mk("g", { class: "icon" }, svg);
    g.setAttribute("transform", `translate(${r2(cx - (vb[0] + vb[2] / 2) * scale)} ${r2(cy - (vb[1] + vb[3] / 2) * scale)}) scale(${r2(scale * 1000) / 1000})`);
    const ghosts = mk("g", { class: "ghost", "aria-hidden": "true" }, g);
    const paths = [];
    for (const el of [...root.children]) {
      if (el.tagName === "defs" || el.tagName === "mask") continue;
      const p = document.importNode(el, true);
      p.removeAttribute("stroke"); p.removeAttribute("fill");
      for (const c of p.querySelectorAll("*")) { c.removeAttribute("stroke"); c.removeAttribute("fill"); }
      g.appendChild(p);
      paths.push(p);
    }
    const ax = axes(paths.flatMap((p) => (p.tagName === "path" ? [p] : [...p.querySelectorAll("path")])));
    const toStage = (x, y) => [cx + (x - vb[0] - vb[2] / 2) * scale, cy + (y - vb[1] - vb[3] / 2) * scale];
    const toIcon = (x, y) => [(x - cx) / scale + vb[0] + vb[2] / 2, (y - cy) / scale + vb[1] + vb[3] / 2];
    /* inspect.mjs prints stage points at the default placement (200, 166, h 220): pt moves one to this placement */
    const s0 = 220 / vb[3];
    const pt = (x, y) => toStage((x - 200) / s0 + vb[0] + vb[2] / 2, (y - 166) / s0 + vb[1] + vb[3] / 2);
    const parts = [];
    const ghostOf = new Map();
    /* every face, cut pieces included; paths[i] keeps meaning the i-th face of the icon (after a cut, its first piece) */
    const faces = new Set(paths);
    const order = (a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    paths.forEach((p) => { const c = p.cloneNode(true); c.removeAttribute("class"); ghosts.appendChild(c); ghostOf.set(p, c); });

    const api = {
      g, paths, u: ax.u, v: ax.v, scale, parts,
      iso: (a = 0, b = 0, c = 0) => [a * ax.u[0] + b * ax.v[0], a * ax.u[1] + b * ax.v[1] - c],
      toStage, toIcon, pt,
      part(name, members, o = {}) {
        const own = members.map((m) => (typeof m === "number" ? paths[m] : m));
        own.forEach((p, k) => {
          if (!p || !faces.has(p)) throw new Error(`part ${name}: member ${members[k]} is not a face of the icon`);
          for (const q of parts) if (q.paths.includes(p)) throw new Error(`part ${name}: face ${members[k]} is already in ${q.name}`);
        });
        own.sort(order);
        const pg = mk("g", { "data-part": name });
        /* the part paints where its last face did, unless it says first: a part on top keeps covering what it covered */
        const anchor = o.paint === "first" ? own[0] : own[own.length - 1];
        anchor.before(pg);
        for (const p of own) pg.appendChild(p);
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const p of own) {
          const b = ghostOf.get(p).getBBox();
          x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
        }
        const [sx0, sy0] = toStage(x0, y0), [sx1, sy1] = toStage(x1, y1);
        const rest = { x0: sx0, y0: sy0, x1: sx1, y1: sy1, cx: (sx0 + sx1) / 2, cy: (sy0 + sy1) / 2 };
        let last = "", off = [0, 0], turn = "";
        const apply = () => {
          const t = `translate(${r2(off[0] / scale)} ${r2(off[1] / scale)})${turn}`;
          if (t !== last) { pg.setAttribute("transform", t); last = t; }
        };
        const part = {
          name, g: pg, paths: own, rest,
          move(a = 0, b = 0, c = 0) { off = api.iso(a, b, c); apply(); return part; },
          tilt(deg, at = [rest.cx, rest.cy]) {
            const [ix, iy] = toIcon(at[0], at[1]);
            turn = Math.abs(deg) < 0.01 ? "" : ` rotate(${r2(deg)} ${r2(ix)} ${r2(iy)})`;
            apply(); return part;
          },
          hi(on) { for (const p of own) p.classList.toggle("hi", !!on); return part; },
          dim(on) { for (const p of own) p.classList.toggle("dim", !!on); return part; },
        };
        parts.push(part);
        return part;
      },
      /* rule 01: the pointer is tested against the rest shape, which never moves */
      hit(pt) {
        const [ix, iy] = toIcon(pt[0], pt[1]);
        const probe = svg.createSVGPoint ? svg.createSVGPoint() : new DOMPoint();
        probe.x = ix; probe.y = iy;
        for (let k = parts.length - 1; k >= 0; k--) {
          for (let j = parts[k].paths.length - 1; j >= 0; j--) {
            const gh = ghostOf.get(parts[k].paths[j]);
            const shapes = gh.isPointInFill ? [gh] : [...gh.querySelectorAll("path,circle,ellipse,rect,polygon")];
            for (const s of shapes) if (s.isPointInFill?.(probe)) return parts[k];
          }
        }
        return null;
      },
      /*
       * Cuts face `which` (an index or a path) along a line through the stage point `at`, running along `axis`
       * ("u", "v" or "up"). The face is replaced, in its place in the paint order, by two faces; returns
       * [first, second], first being the one above the line (left of it for "up"). Isocons draws faces that lie in
       * one plane as one path, so a part that comes away usually needs one cut first.
       */
      cut(which, at, axis = "u") {
        const el = typeof which === "number" ? paths[which] : which;
        if (!el || el.tagName !== "path") throw new Error(`cut: ${which} is not a path`);
        const d = el.getAttribute("d");
        let poly;
        if (/^[\sMLHVZmlhvz\d.,eE+-]*$/.test(d)) {
          poly = [];
          for (const [x0, y0] of segments(d)) poly.push([x0, y0]);
        } else {
          const len = el.getTotalLength(), n = clamp(Math.ceil(len / 0.75), 24, 600);
          poly = Array.from({ length: n }, (_, k) => { const p = el.getPointAtLength((k / n) * len); return [p.x, p.y]; });
        }
        const [ix, iy] = toIcon(at[0], at[1]);
        const dir = axis === "up" ? [0, -1] : axis === "v" ? ax.v : ax.u;
        const side = (p) => dir[0] * (p[1] - iy) - dir[1] * (p[0] - ix);
        /* which sign is "above" (or "left" for a vertical line) */
        const s0 = axis === "up" ? Math.sign(side([ix - 10, iy])) : Math.sign(side([ix, iy - 10]));
        const clip = (keep) => {
          const out = [];
          for (let k = 0; k < poly.length; k++) {
            const a = poly[k], b = poly[(k + 1) % poly.length];
            const sa = side(a) * s0, sb = side(b) * s0;
            const ina = keep > 0 ? sa >= 0 : sa <= 0, inb = keep > 0 ? sb >= 0 : sb <= 0;
            if (ina) out.push(a);
            if (ina !== inb) { const t = sa / (sa - sb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
          }
          return out;
        };
        const toD = (pts) => `M${pts.map((p) => `${Math.round(p[0] * 1000) / 1000} ${Math.round(p[1] * 1000) / 1000}`).join("L")}Z`;
        const pieces = [clip(1), clip(-1)].map((pts) => {
          const p = mk("path", { d: pts.length > 2 ? toD(pts) : "M0 0Z" });
          if (el.getAttribute("class")) p.setAttribute("class", el.getAttribute("class"));
          return p;
        });
        el.replaceWith(pieces[0], pieces[1]);
        const k = paths.indexOf(el);
        if (k >= 0) paths[k] = pieces[0];
        faces.delete(el); faces.add(pieces[0]); faces.add(pieces[1]);
        const old = ghostOf.get(el);
        const gs = pieces.map((p) => { const c = p.cloneNode(true); c.removeAttribute("class"); return c; });
        old.replaceWith(gs[0], gs[1]);
        ghostOf.set(pieces[0], gs[0]); ghostOf.set(pieces[1], gs[1]);
        return pieces;
      },
      /*
       * A copy of face `which`, moved by (a, b, c) and painted just before `before` (a part or a path): the face a
       * part was hiding. A cap that lifts leaves the neck's top behind it: face(capTop, 0, 0, -capHeight, cap).
       */
      face(which, a, b, c, before) {
        const el = typeof which === "number" ? paths[which] : which;
        const [dx, dy] = api.iso(a, b, c);
        const p = el.cloneNode(true);
        p.removeAttribute("class");
        p.setAttribute("transform", `translate(${r2(dx / scale)} ${r2(dy / scale)})`);
        const at = before?.g ?? before ?? null;
        if (at) at.before(p); else g.appendChild(p);
        return p;
      },
      /*
       * A new face from stage points (corners in order), painted just before `before` (a part or a path), or last.
       * It is a face like any other, so it can join a part: the broken surface a cut exposes, the floor of a gap.
       */
      facet(points, before) {
        const d = `M${points.map(([x, y]) => toIcon(x, y).map((n) => Math.round(n * 1000) / 1000).join(" ")).join("L")}Z`;
        const p = mk("path", { d });
        const at = before?.g ?? before ?? null;
        if (at) at.before(p); else g.appendChild(p);
        faces.add(p);
        const c = p.cloneNode(true); ghosts.appendChild(c); ghostOf.set(p, c);
        return p;
      },
      near(pt) {
        let best = null, d = Infinity;
        for (const p of parts) { const e = Math.hypot(pt[0] - p.rest.cx, pt[1] - p.rest.cy); if (e < d) { d = e; best = p; } }
        return { part: best, d };
      },
    };
    return api;
  }

  function after(a, b) { b.g.after(a.g); }

  /* palette, read from the page's custom properties */
  function rgb(css) {
    const c = document.createElement("canvas").getContext("2d");
    c.fillStyle = "#000"; c.fillStyle = css.trim() || "#000";
    const h = c.fillStyle;
    if (h[0] === "#") return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    const m = h.match(/[\d.]+/g) || [0, 0, 0];
    return m.slice(0, 3).map((x) => +x / 255);
  }
  function palette(stage) {
    const s = getComputedStyle(stage);
    const v = (n) => rgb(s.getPropertyValue(n));
    const plate = v("--iso-plate");
    return { line: v("--iso-line"), hi: v("--iso-hi"), face: v("--iso-face"), plate, dark: plate[0] + plate[1] + plate[2] < 1.2 ? 1 : 0 };
  }

  /* the effect layer */
  const PRELUDE = `precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_ptr; uniform float u_dark;
uniform vec3 u_line; uniform vec3 u_hi; uniform vec3 u_face; uniform vec3 u_plate;
uniform sampler2D u_mask; uniform float u_hasMask;
float mask(vec2 p){ return u_hasMask > 0.5 ? texture2D(u_mask, vec2(p.x / 400.0, p.y / 320.0)).a : 1.0; }
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
`;
  const MAIN = `
void main(){ vec2 f = gl_FragCoord.xy / u_res; gl_FragColor = effect(vec2(f.x * 400.0, (1.0 - f.y) * 320.0)); }`;

  function gl(stage, o) {
    const canvas = stage.querySelector(`canvas.${o.layer === "over" ? "over" : "under"}`);
    const off = { on: false, set() {}, mask() {}, draw() {}, dispose() {} };
    if (!canvas || stage.dataset.gl === "off") return off;
    const c = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!c) return off;
    const sh = (type, src) => {
      const s = c.createShader(type); c.shaderSource(s, src); c.compileShader(s);
      if (!c.getShaderParameter(s, c.COMPILE_STATUS)) throw new Error(`effect shader: ${c.getShaderInfoLog(s)}`);
      return s;
    };
    const decl = Object.entries(o.uniforms || {}).map(([n, t]) => `uniform ${t} ${n};`).join("\n");
    const prog = c.createProgram();
    c.attachShader(prog, sh(c.VERTEX_SHADER, "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }"));
    c.attachShader(prog, sh(c.FRAGMENT_SHADER, `${PRELUDE}${decl}\n${o.frag}\n${MAIN}`));
    c.linkProgram(prog);
    if (!c.getProgramParameter(prog, c.LINK_STATUS)) throw new Error(`effect program: ${c.getProgramInfoLog(prog)}`);
    c.useProgram(prog);
    const buf = c.createBuffer();
    c.bindBuffer(c.ARRAY_BUFFER, buf);
    c.bufferData(c.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), c.STATIC_DRAW);
    const loc = c.getAttribLocation(prog, "a");
    c.enableVertexAttribArray(loc);
    c.vertexAttribPointer(loc, 2, c.FLOAT, false, 0, 0);
    const U = (n) => c.getUniformLocation(prog, n);
    const vals = new Map();
    let pal = palette(stage), t0 = performance.now(), ptr = [-1, -1], hasMask = 0;
    const tex = c.createTexture();
    c.bindTexture(c.TEXTURE_2D, tex);
    c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.LINEAR);
    c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.CLAMP_TO_EDGE);
    c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.CLAMP_TO_EDGE);
    c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, 1, 1, 0, c.RGBA, c.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    const mcan = document.createElement("canvas");
    mcan.width = 400; mcan.height = 320;
    const bag = disposer();
    const size = () => {
      const r = canvas.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    };
    if (typeof ResizeObserver === "function") { const ro = new ResizeObserver(size); ro.observe(canvas); bag.add(() => ro.disconnect()); }
    bag.on(stage, "isoform:theme", () => { pal = palette(stage); });
    bag.on(stage, "pointermove", (ev) => {
      const r = canvas.getBoundingClientRect();
      ptr = [((ev.clientX - r.left) / r.width) * W, ((ev.clientY - r.top) / r.height) * H];
    });
    bag.on(stage, "pointerleave", () => { ptr = [-1, -1]; });
    bag.on(stage, "isoform:at", (ev) => { ptr = ev.detail ?? [-1, -1]; });
    size();
    const layer = {
      on: true,
      set(n, v) { vals.set(n, v); },
      /* the parts' current shapes, as the mask the shader reads through mask(p) */
      mask(parts) {
        const m = mcan.getContext("2d");
        m.setTransform(1, 0, 0, 1, 0, 0);
        m.clearRect(0, 0, 400, 320);
        m.fillStyle = "#fff";
        for (const part of parts) {
          for (const p of part.paths) {
            const shapes = p.tagName === "path" ? [p] : [...p.querySelectorAll("path")];
            for (const s of shapes) {
              const k = stage.querySelector("svg").getScreenCTM().inverse().multiply(s.getScreenCTM());
              m.setTransform(k.a, k.b, k.c, k.d, k.e, k.f);
              m.fill(new Path2D(s.getAttribute("d")));
            }
          }
        }
        c.bindTexture(c.TEXTURE_2D, tex);
        c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, c.RGBA, c.UNSIGNED_BYTE, mcan);
        hasMask = 1;
      },
      draw(now = performance.now()) {
        size();
        c.viewport(0, 0, canvas.width, canvas.height);
        c.clearColor(0, 0, 0, 0);
        c.clear(c.COLOR_BUFFER_BIT);
        c.uniform2f(U("u_res"), canvas.width, canvas.height);
        c.uniform1f(U("u_time"), reduced ? 0 : (now - t0) / 1000);
        c.uniform2f(U("u_ptr"), ptr[0], ptr[1]);
        c.uniform1f(U("u_dark"), pal.dark);
        c.uniform3fv(U("u_line"), pal.line); c.uniform3fv(U("u_hi"), pal.hi);
        c.uniform3fv(U("u_face"), pal.face); c.uniform3fv(U("u_plate"), pal.plate);
        c.uniform1f(U("u_hasMask"), hasMask);
        c.uniform1i(U("u_mask"), 0);
        for (const [n, v] of vals) {
          const l = U(n);
          if (typeof v === "number") c.uniform1f(l, v);
          else if (v.length === 2) c.uniform2fv(l, v);
          else c.uniform3fv(l, v);
        }
        c.drawArrays(c.TRIANGLE_STRIP, 0, 4);
      },
      dispose() {
        bag.dispose();
        c.clearColor(0, 0, 0, 0); c.clear(c.COLOR_BUFFER_BIT);
        c.deleteProgram(prog); c.deleteBuffer(buf); c.deleteTexture(tex);
      },
    };
    return layer;
  }

  return {
    clamp, lerp, smooth, rad, r2,
    spring, stepS, tween, tset, tval, tdone, bezier, EASE, reducedMotion,
    disposer, register, pointer,
    icon, after, mk, segments, axes,
    gl, palette,
  };
})();
