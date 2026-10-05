/*
 * Car. It draws itself in, then switches its headlights on: the beams reach out
 * low, lift to high beam, and go out. Bring the pointer near the lamps and you
 * hold the beam: the nearer, the further it reaches. In a product: a
 * "drive mode" / dark-mode switch, the lights on.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, trace, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* paint order as Isocons drew it: body, the two lamps on it, the windshield, the roof's side */
  const body = ic.part("body", [0]);
  const lamps = ic.part("lamps", [2, 3]);
  const glass = ic.part("glass", [1, 4]);
  const side = ic.part("side", [5]);
  lamps.hi(true); // the eye starts at the lamps

  /* lamp centres, read off inspect.mjs: left (148, 164), right (215, 202) */
  const lampPts = [[148, 164], [215, 202]];
  /* each beam is a cone of light leaving the whole lamp: a circle of the lamp's radius on the front face (the lamps
     measure r 12.5), carried out along the front normal (v), dipping a little toward the road and spreading as it
     goes. Drawn as its two silhouette edges, lamp rim to far rim, and the far rim in the quietest tone: light has no
     hard end */
  const edges = trace(svg, { tone: "hi" });
  const mouth = trace(svg, { tone: "lo" });
  const R0 = 12, DIP = 0.12, SPREAD = 0.2;
  const ring = (c, L, r) => Array.from({ length: 49 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2, o = ic.iso(r * Math.cos(a), L, -L * DIP + r * Math.sin(a));
    return [c[0] + o[0], c[1] + o[1]];
  });
  const cone = (c, L) => {
    const near = ring(c, 0, R0), far = ring(c, L, R0 + L * SPREAD);
    /* the silhouette: the pair of matching rim points furthest out either side of the axis on screen */
    const ax = ic.iso(0, 1, -DIP), n = Math.hypot(ax[0], ax[1]), side = (q) => ((q[0] - c[0]) * -ax[1] + (q[1] - c[1]) * ax[0]) / n;
    let lo = 0, hi = 0;
    far.forEach((q, i) => { if (side(q) < side(far[lo])) lo = i; if (side(q) > side(far[hi])) hi = i; });
    return { sides: [[near[lo], far[lo]], [near[hi], far[hi]]], end: far };
  };

  const lights = story(stage, {
    rest: { beam: 0, ink: 1 },
    poster: { beam: 1, ink: 1 },
    intro: { dur: 4500, from: { ink: 0 }, ease: "linear" }, // it draws itself in, once, the first time it is seen
    beats: [
      { dur: 900 },
      { dur: 800, to: { beam: 0.55 }, ease: "out" },   // low beam
      { dur: 1000 },
      { dur: 700, to: { beam: 1 } },                    // high beam
      { dur: 1300 },
      { dur: 700, to: { beam: 0 }, ease: "out" },      // out
      { dur: 800 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const fx = gl(stage, {
    layer: "over",
    uniforms: { u_a: "vec2", u_b: "vec2", u_d: "vec2", u_n: "float" },
    frag: `
      // the light of the lamps along the traced beams, thinning with distance
      vec4 effect(vec2 p) {
        if (u_n < 0.02) return vec4(0.0);
        float a = 0.0;
        for (int i = 0; i < 2; i++) {
          vec2 c = i == 0 ? u_a : u_b;
          vec2 d = u_d;
          float s = clamp(dot(p - c, d) / dot(d, d), 0.0, 1.0);
          float dist = seg(p, c, c + d);
          a += exp(-dist / (4.0 + 22.0 * s)) * (1.0 - 0.75 * s) * 0.4; // as wide as the traced cone
        }
        a = clamp(a, 0.0, 0.7) * smoothstep(0.0, 0.3, u_n) * (0.92 + 0.08 * noise(p * 0.05 + u_time));
        // the one colour of its own the effect may carry is the phenomenon's (rule 12): the warm white of a lamp
        vec3 light = mix(vec3(1.0, 0.86, 0.55), vec3(1.0, 0.93, 0.78), u_dark);
        return vec4(light * a, a);
      }`,
  });
  if (fx.on) { fx.set("u_a", lampPts[0]); fx.set("u_b", lampPts[1]); }

  const loop = register(stage, (dt, now) => {
    const a = lights.step(dt), b = stepS(hand, dt);
    const v = lights.values(lights.held ? { beam: hand.x } : {});
    ic.ink(v.ink);
    const L = v.beam * max;
    if (v.beam < 0.02) { edges.draw([]); mouth.draw([]); }
    else {
      const cs = lampPts.map((c) => cone(c, L));
      edges.draw(cs.flatMap((k) => k.sides));
      mouth.draw(cs.map((k) => k.end));
    }
    const shown = v.ink < 1 ? "drawing" : v.beam < 0.02 ? "rest" : v.beam < 0.8 ? "low beam" : "high beam";
    if (shown !== label) { read.textContent = shown; label = shown; }
    if (fx.on) {
      const o = ic.iso(0, L, -L * DIP);
      fx.set("u_d", o); fx.set("u_n", v.beam); fx.draw(now);
    }
    return a || b || (fx.on && v.beam > 0.02);
  });

  /* hover takes over: nearness to the lamps' rest position sets the beam (rule 01) */
  const mid = [(lampPts[0][0] + lampPts[1][0]) / 2, (lampPts[0][1] + lampPts[1][1]) / 2];
  const leave = () => { lights.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(25, 150, Math.hypot(pt[0] - mid[0], pt[1] - mid[1]));
      if (near <= 0) { leave(); return; }
      if (!lights.held) { hand.x = lights.values().beam; lights.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 100); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "car",
  icon: "directions-car",
  variant: "rounded-left",
  means: "A car switches its headlights on: low beam, high beam, out. Bring the pointer near the lamps to hold the beam.",
  effect: "the warm light of the headlamps along the traced beams, thinning with distance",
  rules: [1, 3, 4, 11],
  range: [45, 70, 95],
  mount,
});
