/*
 * Bolt. It draws itself in, then charges: the halves part at the seam, current arcs
 * across the gap for a moment, and they snap shut. Bring the pointer near the
 * seam and you hold it open: the nearer, the wider. In a product: a
 * connection, live.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, trace, story, clamp, smooth, lerp, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src); // the default placement, so inspect.mjs's points are this figure's points

  /* the front is one curved face: break it along u at the step's inner corner */
  const seam = [201, 168];
  const [front, foot] = ic.cut(2, seam, "u");
  /* the surface the break exposes: its front edge is the cut itself, run back along u to where the cut leaves the
     face, then pushed back along v by the bolt's thickness */
  const back = ic.iso(0, -46, 0), run = (seam[0] - 140) / ic.u[0];
  const left = [seam[0] - ic.u[0] * run, seam[1] - ic.u[1] * run];
  const broken = ic.facet([left, seam, [seam[0] + back[0], seam[1] + back[1]], [left[0] + back[0], left[1] + back[1]]], foot);
  const low = ic.part("low", [foot, broken, 0, 1]);
  const high = ic.part("high", [front, 3, 4]);
  high.hi(true); // the eye starts at the upper half

  /* the arcs, in the figure's own hairline: up to three, re-struck nine times a second while the gap is open */
  const arcs = trace(svg, { tone: "hi" });
  const rnd = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
  const strike = (hop, n, g) => Array.from({ length: n }, (_, i) => {
    const t = 0.15 + 0.7 * rnd(hop, i * 7.3);
    const base = [lerp(left[0], seam[0], t), lerp(left[1], seam[1], t) + g * 0.25];
    return Array.from({ length: 9 }, (_, k) => {
      const s = k / 8, amp = (1.2 + g * 0.18) * Math.sin(s * Math.PI);
      return [base[0] + (rnd(hop + k, i) - 0.5) * 2 * amp, base[1] - s * g * 1.25];
    });
  });
  let hopDrawn = -1;

  const charge = story(stage, {
    rest: { gap: 0, ink: 1 },
    poster: { gap: 1, ink: 1 },
    intro: { dur: 5400, from: { ink: 0 }, ease: "linear" }, // it draws itself in, once, the first time it is seen
    beats: [
      { dur: 700 },
      { dur: 450, to: { gap: 1 }, ease: "out" },              // the halves part
      { dur: 1400 },                                           // current arcs across
      { dur: 320, to: { gap: [-0.06, 0] }, ease: "out" },     // they snap shut, a hair past, and settle
      { dur: 1300 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const fx = gl(stage, {
    layer: "over",
    uniforms: { u_gap: "float", u_k: "vec2", u_x: "vec3", u_y: "vec3", u_o0: "vec3", u_o1: "vec3", u_o2: "vec3", u_o3: "vec3",
      u_o4: "vec3", u_o5: "vec3", u_o6: "vec3", u_u: "vec2" },
    frag: `
      // the traced arcs' own kinks (u_o*, 7 per arc), so the hot core sits exactly on the hairline
      float kink(int j) {
        vec3 v = j < 3 ? u_o0 : j < 6 ? u_o1 : j < 9 ? u_o2 : j < 12 ? u_o3 : j < 15 ? u_o4 : j < 18 ? u_o5 : u_o6;
        int r = j - 3 * (j / 3);
        return r == 0 ? v.x : r == 1 ? v.y : v.z;
      }
      vec4 effect(vec2 p) {
        if (u_gap < 1.5) return vec4(0.0);
        float on = smoothstep(1.5, 7.0, u_gap);
        float flash = exp(-u_k.y * 6.0) * (0.5 + 0.5 * hash(vec2(u_k.x, 3.0))); // each strike flares, then sags
        float flick = 0.8 + 0.2 * noise(vec2(u_time * 60.0, 1.0));
        float d = 1e3, face = 0.0, air = 0.0;
        for (int i = 0; i < 3; i++) {
          float bx = i == 0 ? u_x.x : i == 1 ? u_x.y : u_x.z, by = i == 0 ? u_y.x : i == 1 ? u_y.y : u_y.z;
          if (bx < 0.0) break;                                              // fewer arcs struck this hop
          vec2 q = vec2(bx, by);
          for (int k = 1; k <= 8; k++) {
            vec2 r = vec2(bx + (k == 8 ? 0.0 : kink(i * 7 + k - 1)), by - float(k) / 8.0 * u_gap);
            d = min(d, seg(p, q, r));
            q = r;
          }
          vec2 e = p - vec2(bx, by - u_gap * 0.5), n = vec2(-u_u.y, u_u.x);
          float along = dot(e, u_u) / (26.0 + 12.0 * flash), across = dot(e, n) / (0.5 * u_gap + 10.0 + 6.0 * flash);
          face += exp(-along * along - across * across);                    // light thrown on both faces, along the break
          air += exp(-along * along * 2.0 - across * across * 4.0);
        }
        float core = exp(-d * d / 1.3);
        float glow = exp(-d / (3.0 + 2.0 * flash)) * 0.6 + exp(-d * d / 150.0) * 0.25;
        float lit = mask(p) * min(face, 1.0) * (0.45 + 0.5 * flash);
        air = (1.0 - mask(p)) * min(air, 1.0) * (0.12 + 0.3 * flash); // the ionised air in the gap
        float hot = core * (0.8 + 0.3 * flash) * flick;
        float a = clamp(hot + (glow + lit * 0.7 + air) * (1.0 - hot), 0.0, 0.95) * on;
        // the one colour of its own the effect may carry is the phenomenon's (rule 12): an arc's blue-white light;
        // on a white plate the core keeps some blue, or it reads as a hole
        vec3 blue = mix(vec3(0.16, 0.42, 1.0), vec3(0.3, 0.55, 1.0), u_dark);
        vec3 white = mix(vec3(0.55, 0.75, 1.0), vec3(0.94, 0.97, 1.0), u_dark);
        vec3 col = mix(blue, white, clamp(hot * 1.2 + flash * 0.15, 0.0, 1.0));
        a += (hash(p + fract(u_time)) - 0.5) / 255.0;                     // dither, so the falloff never bands
        return vec4(col * a, a);
      }`,
  });

  const loop = register(stage, (dt, now) => {
    const a = charge.step(dt), b = stepS(hand, dt);
    const v = charge.values(charge.held ? { gap: hand.x } : {});
    ic.ink(v.ink);
    const g = v.gap * max;
    high.move(0, 0, g);
    low.move(0, 0, -g * 0.25); // the lower half gives a little too: they push apart, not one lifts off
    const n = g < 1.5 ? 0 : Math.min(3, 1 + Math.floor(g / 5));
    const hop = Math.floor(now / 111);
    const struck = n ? strike(hop, n, g) : [];
    if (n === 0) { arcs.draw([]); hopDrawn = -1; } else if (hop !== hopDrawn || a || b) { arcs.draw(struck); hopDrawn = hop; }
    const shown = v.ink < 1 ? "drawing" : g < 0.3 ? "rest" : n ? `arc ×${n}` : "charged";
    if (shown !== label) { read.textContent = shown; label = shown; }
    if (fx.on) {
      if (n) fx.mask([low, high]); // the faces either side of the gap, where they are now: the arcs light them
      const at = (i, k) => struck[i] ? struck[i][k] : [-1, 0];
      const o = Array.from({ length: 21 }, (_, j) => { const i = Math.floor(j / 7); return struck[i] ? struck[i][j % 7 + 1][0] - struck[i][0][0] : 0; });
      fx.set("u_x", [0, 1, 2].map((i) => at(i, 0)[0])); fx.set("u_y", [0, 1, 2].map((i) => at(i, 0)[1]));
      for (let j = 0; j < 7; j++) fx.set(`u_o${j}`, o.slice(j * 3, j * 3 + 3));
      fx.set("u_u", [ic.u[0] / Math.hypot(...ic.u), ic.u[1] / Math.hypot(...ic.u)]); fx.set("u_gap", g * 1.25); fx.set("u_k", [hop % 997, (now % 111) / 111]); fx.draw(now);
    }
    return a || b || n > 0;
  });

  /* hover takes over: nearness to the seam's rest position opens the gap (rule 01) */
  const leave = () => { charge.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(18, 130, Math.hypot(pt[0] - seam[0], pt[1] - seam[1]));
      if (near <= 0) { leave(); return; }
      if (!charge.held) { hand.x = charge.values().gap; charge.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 24); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "bolt",
  icon: "bolt",
  variant: "rounded-left",
  means: "A bolt in two halves charges: they part, current arcs across, they snap shut. Hold the seam to keep it open.",
  effect: "blue-white current arcs across the gap, flashing at each re-strike and lighting the two broken faces either side",
  rules: [1, 3, 6, 11],
  range: [8, 14, 22],
  mount,
});
