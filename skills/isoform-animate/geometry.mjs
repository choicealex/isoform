/*
 * Geometry of an Isocons drawing, read as text (no browser): its paths' points and segments, which way a face looks,
 * and the ground axes the kernel will measure. Shared by inspect.mjs and the sweep, so they never disagree.
 */
/** Every on-curve point and every straight segment of a path. */
export function walk(d) {
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
export function facing({ segs, curved }) {
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


/** The icon's two ground axes as the kernel measures them: the two strongest non-vertical edge directions, u running
    down-right and v down-left; a level axis is turned round so they point to opposite sides. null when not measured. */
export function axesOf(svg) {
  const bins = new Float64Array(180);
  for (const m of svg.matchAll(/<(path|circle|ellipse|rect)\b[^>]*>/g)) {
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
  /* u among the down-right directions, v among the down-left, each preferring the near-30° slopes of an isometric
     drawing: a symbol's own strokes (a chevron's 60° arms, a bolt's zigzag) are often stronger than the ground edges,
     and taking the two strongest overall picked two down-right lines. Strong evidence out of band still wins */
  /* in the isometric band, or level (a top view's edge); anything else is a symbol's own stroke, never an axis: a 45°
       arm out-voted the true edges on ~200 drawings (stat-1, arrows, chevrons). An axis with no evidence in band is left
       unmeasured, and only it falls back */
    const prior = (a, lo, hi) => (a >= lo && a <= hi ? 1 : a <= 4 || a >= 176 ? 0.35 : 0);
  const peakIn = (from, to, lo, hi) => {
    let best = -1, at = from;
    for (let a = from; a <= to; a++) {
      const k = ((a % 180) + 180) % 180;
      const w = (bins[k] + bins[(k + 1) % 180] + bins[(k + 179) % 180]) * prior(k, lo, hi);
      if (w > best) { best = w; at = k; }
    }
    return best > 0 ? at : null;
  };
  /* a level edge (within 4° of horizontal) may serve either axis, but not both */
  const a1 = peakIn(-4, 80, 12, 40);
  const level = a1 != null && (a1 <= 4 || a1 >= 176);
  const a2 = peakIn(100, level ? 175 : 184, 140, 168);
  if (a1 == null && a2 == null) return null;
  /* orient by side, not by "down": u points right, v points left (a level edge may tilt a hair either way). A drawing
     with one straight direction (a disc's side band, a row of dots) gives that axis; only the other falls back to
     true isometric, which is 3-8° closer than guessing both (radio-button-checked: v measures 153°, the fallback is 150°) */
  const vec = (a) => [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)];
  let u = a1 == null ? [0.866, 0.5] : vec(a1), v = a2 == null ? [-0.866, 0.5] : vec(a2);
  const half = a1 == null ? "v" : a2 == null ? "u" : null;
  if (u[0] < 0) u = [-u[0], -u[1]];
  if (v[0] > 0) v = [-v[0], -v[1]];
  return u[0] > 0 && v[0] < 0 ? { u, v, half } : null;
}
