/*
 * House, sharp edges, seen from the top. It draws itself in, then the lights come on: warm light spills out of the
 * doorway and fans across the ground in front of it, holds, and goes out. Bring the pointer near the doorway and you
 * hold the light: the nearer, the further it spills. In a product: "welcome home", a home button, a house warmed.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, trace, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* inspect.mjs, sharp-top: 0 the right wing's front, 1 the doorway's left jamb, 2 the left wing's front, 3 the right
     wing's side, 4 the roof, 5 the doorway's back wall. The doorway is a slot 47 wide and 80 deep in the front wall */
  const house = ic.part("house", [0, 2, 3, 4]);
  const door = ic.part("door", [1, 5], { paint: "first" });
  door.hi(true); // the eye starts at the doorway

  /* the doorway's mouth on the ground: the jambs' feet, read off the parts picture (default placement) */
  const L0 = ic.pt(121, 214), R0 = ic.pt(161, 237);
  const mouth = [(L0[0] + R0[0]) / 2, (L0[1] + R0[1]) / 2];
  const SPREAD = 0.32; // the fan widens this much either side per unit it travels out
  const at = (p, a, b) => { const o = ic.iso(a, b, 0); return [p[0] + o[0], p[1] + o[1]]; };

  /* the light on the ground, in line: its two edges from the jambs, and its far edge in the quietest tone (light has
     no hard end). They lie on the ground, behind the house */
  const edges = trace(svg, { tone: "hi", under: true });
  const rim = trace(svg, { tone: "lo", under: true });

  const lights = story(stage, {
    rest: { light: 0, ink: 1 },
    poster: { light: 1, ink: 1 },
    intro: { dur: 3600, from: { ink: 0 }, ease: "linear" }, // it draws itself in, once, the first time it is seen
    beats: [
      { dur: 1000 },
      { dur: 500, to: { light: [0.45, 0.3] }, ease: "out" }, // the switch: a bulb catching
      { dur: 900, to: { light: 1 } },                           // the light settles and spills out
      { dur: 2000 },
      { dur: 900, to: { light: 0 }, ease: "out" },              // out
      { dur: 900 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const fx = gl(stage, {
    layer: "over",
    uniforms: { u_m: "vec2", u_U: "vec2", u_V: "vec2", u_n: "float", u_L: "float", u_h: "float", u_s: "float", u_D: "float", u_H: "float" },
    frag: `
      vec4 effect(vec2 p) {
        if (u_n < 0.02) return vec4(0.0);
        /* the ground ahead of the doorway, in the house's own coordinates: x across the doorway, d out of it */
        vec2 g = p - u_m;
        float det = u_U.x * u_V.y - u_U.y * u_V.x;
        float x = (g.x * u_V.y - g.y * u_V.x) / det, d = (u_U.x * g.y - u_U.y * g.x) / det;
        float w = u_h + u_s * max(d, 0.0);
        float across = 1.0 - smoothstep(w * 0.7, w * 1.2, abs(x));             // soft sides that spill past the trace
        float ahead = smoothstep(-1.0, 3.0, d) * (1.0 - smoothstep(u_L * 0.65, u_L * 1.15, d));
        float fall = exp(-max(d, 0.0) / (u_L * 0.55 + 1.0));                     // light thins as it spreads
        float haze = 0.75 + 0.5 * fbm(vec2(x * 0.05 + u_time * 0.15, d * 0.05 - u_time * 0.08));
        float pool = across * ahead * fall * haze;
        float sill = exp(-d * d / 40.0) * (1.0 - smoothstep(u_h * 0.8, u_h * 1.1, abs(x))) * step(0.0, d);
        /* the doorway's own floor, where the light comes from. The view looks along (1, 1, 1) in (u, v, up), so a
           floor point is hidden by the right wing when its sight line reaches the wing (u_h - x) before it clears the
           wing's front (-d) or its top (u_H): the light stops exactly at the wing's edge, never on its face */
        float inside = step(d, 0.0) * smoothstep(-u_D - 0.5, -u_D + 0.5, d) * smoothstep(-0.5, 0.5, x + u_h)
          * smoothstep(-0.5, 0.5, (u_h - x) - min(-d, u_H));
        float floor_ = inside * (0.6 + 0.3 * exp(d / 40.0)) * haze;
        /* the doorway's own walls, lit from inside: brightest low and near the mouth */
        float jamb = mask(p) * (0.35 + 0.65 * exp(-dot(g, g) / 2600.0));
        float a = clamp(pool * 0.85 + sill * 0.6 + floor_ * 0.75 + jamb * 0.7, 0.0, 0.9) * smoothstep(0.0, 0.3, u_n);
        // the one colour of its own the effect may carry is the phenomenon's (rule 12): a home's warm lamplight; on a
        // white plate it keeps more of its amber, or it reads as a hole
        vec3 warm = mix(vec3(1.0, 0.66, 0.24), vec3(1.0, 0.74, 0.38), u_dark);
        vec3 hot = mix(vec3(1.0, 0.82, 0.5), vec3(1.0, 0.95, 0.85), u_dark);
        vec3 col = mix(warm, hot, clamp(sill + floor_ * 0.6 + jamb * 0.5, 0.0, 1.0));
        a += (hash(p + fract(u_time)) - 0.5) / 255.0;                             // dither, so the falloff never bands
        return vec4(col * a, a);
      }`,
  });
  if (fx.on) {
    fx.set("u_m", mouth); fx.set("u_U", ic.u); fx.set("u_V", ic.v); fx.set("u_s", SPREAD);
    fx.set("u_h", Math.hypot(R0[0] - L0[0], R0[1] - L0[1]) / 2 / Math.hypot(...ic.iso(1, 0, 0)));
    /* the doorway's depth (mouth to back wall, along the floor) and the walls' height, in the same units */
    const back = ic.pt(190, 171);
    fx.set("u_D", Math.hypot(back[0] - L0[0], back[1] - L0[1]) / Math.hypot(...ic.iso(0, 1, 0)));
    fx.set("u_H", Math.hypot(...ic.iso(0, 0, 48)) / Math.hypot(...ic.iso(0, 0, 1)) * (ic.pt(221, 271)[1] - ic.pt(221, 223)[1]) / 48);
    fx.mask([door]);
  }

  const loop = register(stage, (dt, now) => {
    const a = lights.step(dt), b = stepS(hand, dt);
    const v = lights.values(lights.held ? { light: hand.x } : {});
    ic.ink(v.ink);
    const L = v.light * max;
    if (v.light < 0.02) { edges.draw([]); rim.draw([]); }
    else {
      const l = at(L0, -SPREAD * L, L), r = at(R0, SPREAD * L, L);
      edges.draw([[L0, l], [R0, r]]);
      rim.draw([l, r]);
    }
    const shown = v.ink < 1 ? "drawing" : v.light < 0.02 ? "rest" : `spill ${Math.round(L)}`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    if (fx.on) { fx.set("u_n", v.light); fx.set("u_L", L); fx.draw(now); }
    return a || b || (fx.on && v.light > 0.02);
  });

  /* hover takes over: nearness to the doorway's mouth (its rest position, rule 01) sets the light */
  const leave = () => { lights.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(20, 140, Math.hypot(pt[0] - mouth[0], pt[1] - mouth[1]));
      if (near <= 0) { leave(); return; }
      if (!lights.held) { hand.x = lights.values().light; lights.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 90); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "house",
  icon: "house",
  variant: "sharp-top",
  means: "A house, seen from the top: the lights come on and spill out of the doorway. Bring the pointer near to hold the light.",
  effect: "warm lamplight lights the doorway's walls and pools on the ground in front of it, fanning out and thinning",
  rules: [1, 3, 4, 11],
  range: [30, 55, 80],
  mount,
});
