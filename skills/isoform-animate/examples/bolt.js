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
    intro: { dur: 3600, from: { ink: 0 } }, // it draws itself in, once, the first time it is seen
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
    uniforms: { u_a: "vec2", u_b: "vec2", u_gap: "float", u_n: "float", u_t: "vec3" },
    frag: `
      // the light of the current around the traced arcs: the figure passes where they struck (u_t)
      vec4 effect(vec2 p) {
        if (u_gap < 1.5) return vec4(0.0);
        float halo = 0.0;
        for (int i = 0; i < 3; i++) {
          float fi = float(i);
          if (fi >= u_n) break;
          float t = i == 0 ? u_t.x : i == 1 ? u_t.y : u_t.z;
          vec2 base = mix(u_a, u_b, t) + vec2(0.0, u_gap * 0.2);
          halo += exp(-seg(p, base, base - vec2(0.0, u_gap)) * 0.28) * 0.32;
        }
        float a = clamp(halo, 0.0, 0.8) * smoothstep(1.5, 4.0, u_gap) * (0.8 + 0.2 * hash(vec2(floor(u_time * 9.0), 1.0)));
        // the one colour of its own the effect may carry is the phenomenon's (rule 12): an arc's blue-white light
        vec3 light = mix(vec3(0.42, 0.6, 1.0), vec3(0.82, 0.9, 1.0), u_dark);
        return vec4(light * a, a);
      }`,
  });
  if (fx.on) { fx.set("u_a", left); fx.set("u_b", seam); }

  const loop = register(stage, (dt, now) => {
    const a = charge.step(dt), b = stepS(hand, dt);
    const v = charge.values(charge.held ? { gap: hand.x } : {});
    ic.ink(v.ink);
    const g = v.gap * max;
    high.move(0, 0, g);
    low.move(0, 0, -g * 0.25); // the lower half gives a little too: they push apart, not one lifts off
    const n = g < 1.5 ? 0 : Math.min(3, 1 + Math.floor(g / 5));
    const hop = Math.floor(now / 111);
    if (n === 0) { arcs.draw([]); hopDrawn = -1; } else if (hop !== hopDrawn || a || b) { arcs.draw(strike(hop, n, g)); hopDrawn = hop; }
    const shown = v.ink < 1 ? "drawing" : g < 0.3 ? "rest" : n ? `arc ×${n}` : "charged";
    if (shown !== label) { read.textContent = shown; label = shown; }
    if (fx.on) { fx.set("u_gap", g * 1.25); fx.set("u_n", n); fx.set("u_t", [0, 1, 2].map((i) => 0.15 + 0.7 * rnd(hop, i * 7.3))); fx.draw(now); }
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
  effect: "current arcing across the gap lights it, flickering each time the arcs re-strike",
  rules: [1, 3, 6, 11],
  range: [8, 14, 22],
  mount,
});
