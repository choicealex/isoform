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
    uniforms: { u_a: "vec2", u_b: "vec2", u_d: "vec2", u_w: "vec2", u_n: "float", u_pool: "vec2", u_U: "vec2", u_V: "vec2", u_L: "float" },
    frag: `
      // one beam: brightest at the glass, falling off with distance, soft-edged, dust drifting through it
      float beam(vec2 p, vec2 c) {
        float s = dot(p - c, u_d) / dot(u_d, u_d);
        float r = length(p - c - u_d * s);
        float w = mix(u_w.x, u_w.y, clamp(s, 0.0, 1.2));
        float body = 1.0 - smoothstep(w * 0.45, w * 1.25, r);               // soft walls that spill a little past the trace
        float fall = 1.0 / (1.0 + 1.8 * max(s, 0.0));                        // light thins as it spreads
        float reach = smoothstep(-0.12, 0.08, s) * (1.0 - smoothstep(0.8, 1.35, s));
        float axis = exp(-r * r / (w * w * 0.12)) * (1.0 - smoothstep(0.0, 0.7, s)); // the hot shaft along the axis
        return (body * fall + axis * 0.6) * reach;
      }
      vec4 effect(vec2 p) {
        if (u_n < 0.02) return vec4(0.0);
        float on = smoothstep(0.0, 0.25, u_n), hb = smoothstep(0.55, 1.0, u_n);
        float haze = 0.65 + 0.7 * fbm(vec2(p.x * 0.045 + u_time * 0.25, p.y * 0.06 - u_time * 0.12));
        float cones = (beam(p, u_a) + beam(p, u_b)) * haze * (0.75 + 0.35 * hb);
        /* the pool on the road ahead, in ground coordinates (u across, v ahead) */
        vec2 g = p - u_pool;
        float det = u_U.x * u_V.y - u_U.y * u_V.x;
        vec2 uv = vec2(g.x * u_V.y - g.y * u_V.x, u_U.x * g.y - u_U.y * g.x) / det;
        vec2 e = uv / vec2(48.0 + 10.0 * hb, 14.0 + 0.3 * u_L);
        float pool = exp(-dot(e, e) * 1.8) * (0.8 + 0.4 * fbm(uv * 0.08)) * 0.38;
        /* the glass itself: lit from inside the lamp face, white-hot at its centre */
        float ka = length(p - u_a), kb = length(p - u_b);
        float glass = mask(p) * (0.55 + 0.45 * exp(-min(ka, kb) * min(ka, kb) / 60.0));
        float hot = exp(-ka * ka / 18.0) + exp(-kb * kb / 18.0);
        float bloom = exp(-ka * ka / 260.0) + exp(-kb * kb / 260.0);
        float light = clamp(cones * 0.8 + pool * (1.0 - cones * 0.5) + bloom * 0.3, 0.0, 0.82) * on;
        float core = clamp(glass + hot, 0.0, 1.0) * on;
        // the one colour of its own the effect may carry is the phenomenon's (rule 12): a halogen lamp's warm white;
        // on a white plate the light keeps more of its amber, or it reads as a hole
        vec3 warm = mix(vec3(1.0, 0.68, 0.22), vec3(1.0, 0.72, 0.34), u_dark);
        vec3 white = mix(vec3(1.0, 0.86, 0.55), vec3(1.0, 0.97, 0.9), u_dark);
        float a = clamp(light + core * (1.0 - light), 0.0, 0.92);
        vec3 col = mix(warm, white, clamp(core + cones * 0.25, 0.0, 1.0));
        a += (hash(p + fract(u_time)) - 0.5) / 255.0;                          // dither, so the falloff never bands
        return vec4(col * a, a);
      }`,
  });
  if (fx.on) { fx.set("u_a", lampPts[0]); fx.set("u_b", lampPts[1]); fx.set("u_U", ic.u); fx.set("u_V", ic.v); fx.mask([lamps]); }

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
      const o = ic.iso(0, L, -L * DIP), w = ic.iso(R0, 0, 0), far = Math.hypot(...w) * (R0 + L * SPREAD) / R0;
      /* the pool lies on the road under the far half of the beams: the lamps sit 40 above it */
      const m = ic.iso(0, L * 0.75, -40);
      fx.set("u_d", o); fx.set("u_w", [Math.hypot(...w), far]); fx.set("u_n", v.beam); fx.set("u_L", L);
      fx.set("u_pool", [(lampPts[0][0] + lampPts[1][0]) / 2 + m[0], (lampPts[0][1] + lampPts[1][1]) / 2 + m[1]]); fx.draw(now);
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
  effect: "the lamp glass glows white-hot and throws warm cones of light, dust drifting through them, onto a pool on the road",
  rules: [1, 3, 4, 11],
  range: [45, 70, 95],
  mount,
});
