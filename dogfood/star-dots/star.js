/*
 * Star, branded. A star block (the favourite) lifts, drops onto its plate with a short overshoot, and the
 * strike sends a ring across the plate while the metal takes heat, glows, then cools and the ring retracts.
 * Bring the pointer near and it lifts a few units off the plate. In a product: a favourite saved, a rating set.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, trace, story, clamp, smooth, lerp, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src); // default placement: inspect.mjs's points are this figure's points
  const star = ic.part("star", [0, 1, 2, 3, 4, 5, 6, 7]); // 5-7 are zero-size dots: in the part so they travel with it
  star.hi(true);

  /* the ring the strike sends across the plate: on the ground, so along u and v, drawn under the star */
  const ring = trace(svg, { tone: "hi", under: true });
  const ground = [205, 232];
  const circle = (r) => Array.from({ length: 49 }, (_, i) => {
    const t = (i / 48) * Math.PI * 2, [dx, dy] = ic.iso(Math.cos(t) * r, Math.sin(t) * r, 0);
    return [ground[0] + dx, ground[1] + dy];
  });

  const brand = story(stage, {
    rest: { lift: 0, ring: 0, gone: 0, heat: 0, ink: 1 },
    poster: { lift: 0, ring: 0.5, gone: 0, heat: 0.85, ink: 1 }, // just after the strike, the metal glowing
    intro: { dur: 4800, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 600 },
      { dur: 800, to: { lift: 1 } },                                  // it rises off the plate
      { dur: 380, to: { lift: [-0.08, 0] }, ease: "out" },            // it drops and lands, a hair past
      { dur: 1100, to: { ring: 1, heat: 1 }, ease: "out" },           // the ring spreads, the metal heats
      { dur: 900 },                                                    // hold hot
      { dur: 1500, to: { heat: 0, gone: 1 } },                        // it cools, the ring retracts
      { dur: 100, to: { ring: 0, gone: 0 }, ease: "linear" },
      { dur: 500 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const fx = gl(stage, {
    layer: "over",
    uniforms: { u_heat: "float", u_c: "vec2" },
    frag: `
      vec4 effect(vec2 p) {
        if (u_heat < 0.01) return vec4(0.0);
        float m = mask(p);
        float below = clamp((p.y - (u_c.y - 110.0)) / 220.0, 0.0, 1.0);     // the strike end is hottest
        float turb = fbm(p * 0.045 + vec2(0.0, -u_time * 0.5));               // heat shimmer drifting up
        float body = m * u_heat * (0.3 + 0.55 * below + 0.4 * turb);
        float r = length(p - u_c);
        float halo = (1.0 - m) * u_heat * exp(-r * r / 9000.0) * 0.22;
        float a = clamp(body + halo, 0.0, 0.92);
        // the one colour of its own (rule 12): hot metal, orange to yellow-white at the core
        vec3 orange = mix(vec3(0.85, 0.32, 0.04), vec3(1.0, 0.45, 0.08), u_dark);
        vec3 core = mix(vec3(0.95, 0.6, 0.15), vec3(1.0, 0.85, 0.5), u_dark);
        vec3 col = mix(orange, core, clamp(body * 1.4, 0.0, 1.0));
        a += (hash(p + fract(u_time)) - 0.5) / 255.0;
        return vec4(col * a, a);
      }`,
  });

  const loop = register(stage, (dt, now) => {
    const a = brand.step(dt), b = stepS(hand, dt);
    const v = brand.values(brand.held ? { lift: hand.x, heat: hand.x * 0.7 } : {});
    ic.ink(v.ink);
    const lift = v.lift * max;
    star.move(0, 0, lift);
    const draw = smooth(0.86, 0.97, v.ink);
    const r1 = lerp(34, 92, v.ring), r2 = lerp(20, 60, smooth(0.2, 1, v.ring));
    ring.draw(v.ring > 0.02 && v.gone < 1 ? [circle(r1), circle(r2)] : [], (1 - v.gone) * draw);
    const shown = v.ink < 1 ? "drawing" : lift > 0.5 ? `lift ${Math.round(lift)}` : v.heat > 0.5 ? "hot" : v.heat > 0.05 ? "cooling" : v.ring > 0.02 ? "strike" : "rest";
    if (shown !== label) { read.textContent = shown; label = shown; }
    if (fx.on) {
      if (v.heat > 0.01) fx.mask([star]);
      fx.set("u_heat", v.heat); fx.set("u_c", [star.rest.cx, star.rest.cy - lift]); fx.draw(now);
    }
    return a || b || v.heat > 0.01;
  });

  /* hover takes over: nearness to the star's rest centre lifts it off the plate (rule 01) */
  const leave = () => { brand.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(20, 150, Math.hypot(pt[0] - star.rest.cx, pt[1] - star.rest.cy));
      if (near <= 0) { leave(); return; }
      if (!brand.held) { hand.x = brand.values().lift; brand.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 26); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "star",
  icon: "star",
  variant: "rounded-left",
  means: "A star block drops onto its plate and is struck hot: a ring crosses the plate, the metal glows, then cools.",
  effect: "the heat of hot metal glowing orange in the star, hottest at the struck end, with a faint halo past its edge",
  rules: [1, 3, 5, 11, 12],
  range: [8, 14, 22],
  mount,
});
