/*
 * Gas pump, the old visible kind. It draws itself in, then runs a sale: the glass in
 * the pump's face fills with fuel, the nozzle clicks off and the surface slops and
 * settles, then the sale clears and the glass drains. Bring the pointer near the
 * glass and you run the pump yourself: the nearer, the fuller. In a product: a
 * running total, a balance filling.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, story, clamp, smooth, lerp, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src); // default placement: inspect.mjs's points are ours

  /* the glass is faces 1 and 2: a left-facing window whose top and bottom edges run along u */
  const glass = ic.part("glass", [1, 2]);
  glass.hi(true); // the eye starts at the glass
  const fuel = glass.trace({ clip: true });

  const su = ic.u[1] / ic.u[0];
  const r = glass.rest;
  const x0 = r.x0 - 4, x1 = r.x1 + 4;
  const botL = 136; // the glass's lower edge at its left side (inspect: face 2 corner 139,136)

  const sale = story(stage, {
    rest: { fill: 0.12, kick: 0, pump: 0, ink: 1 },
    poster: { fill: 0.78, kick: 0.6, pump: 1, ink: 1 },
    intro: { dur: 4200, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 600 },
      { dur: 2400, to: { fill: 0.82, pump: [1, 1, 1, 1, 1, 1] } }, // the pump runs, fuel rises in the glass
      { dur: 1400, to: { kick: [1, -0.7, 0.4, 0], pump: [0, 0, 0] } }, // the nozzle clicks off: the surface slops
      { dur: 700 },
      { dur: 1100, to: { fill: 0.12 } },                       // the sale clears, the glass drains
      { dur: 700 },
    ],
  });

  const hand = spring(0, SPRING.hand);
  /* fuel rings a little, a hand does not: underdamped float spring for the slop (rule 08) */
  const slosh = spring(0, { k: 55, c: 2.6, eps: 0.0004 });
  let top = reach, label = "", lastKick = 0;

  /* the surface in the world is level, so on the left face it runs along u */
  const level = (f, sl, time) => {
    const e = [r.cx, botL + su * (r.cx - 139) - f * 39 + 0];
    const line = [];
    for (let px = x0; px <= x1; px += 2) {
      const dx = px - e[0];
      line.push([px, e[1] + dx * su + dx * sl + Math.sin(dx * 0.2 + time * 5) * 3 * Math.abs(sl)]);
    }
    return { e, line };
  };

  const fx = gl(stage, {
    layer: "over",
    uniforms: { u_e: "vec2", u_su: "float", u_slosh: "float", u_fill: "float", u_run: "float" },
    frag: `
      // the body of fuel inside the glass: deep below, lit at the surface, bubbling while the pump runs
      vec4 effect(vec2 p) {
        float inside = mask(p);
        float dx = p.x - u_e.x;
        float surf = u_e.y + dx * u_su + dx * u_slosh + sin(dx * 0.2 + u_time * 5.0) * 3.0 * abs(u_slosh);
        float d = p.y - surf;                                  // depth below the traced surface
        float depth = u_fill * 39.0 + 4.0;                     // surface to the glass's floor
        float k = clamp(d / depth, 0.0, 1.0);
        // the one colour of its own (rule 12): petrol, amber, lit gold at the top and brown-dark in the deep
        vec3 deep = vec3(0.50, 0.17, 0.02), body = vec3(0.93, 0.48, 0.05), gold = vec3(1.0, 0.80, 0.26), hot = mix(vec3(1.0, 0.70, 0.10), vec3(1.0, 0.94, 0.62), u_dark);
        // on a white plate the lit band keeps its gold, or it reads as a hole
        float caus = fbm(vec2(p.x * 0.16 + u_time * 0.5, d * 0.22 - u_time * (0.4 + 1.6 * u_run)));
        vec3 col = mix(gold, body, smoothstep(0.0, 0.35, k));
        col = mix(col, deep, smoothstep(0.3, 1.0, k));
        col *= 0.82 + 0.42 * caus;                             // light swimming through the fuel
        col = mix(col, gold, exp(-d / 5.0) * smoothstep(-0.8, 0.6, d) * 0.7); // the lit layer just under the top
        /* bubbles rising from the floor while it pumps: one per column, each on its own clock */
        float cx = floor((p.x - 139.0) / 5.0), h = hash(vec2(cx, 3.1));
        float by = depth - fract(u_time * (0.5 + 0.5 * h) + h * 7.0) * (depth + 2.0);
        vec2 bq = vec2(p.x - (139.0 + (cx + 0.5) * 5.0 + sin(u_time * 4.0 + h * 9.0) * 0.8), d - by);
        float bub = smoothstep(1.7, 0.5, length(bq)) * step(0.45, h) * u_run * smoothstep(0.0, 3.0, d);
        col = mix(col, hot, bub * 0.85);
        float liquid = smoothstep(-0.6, 0.6, d) * inside;
        /* the meniscus: a bright gold band on the traced level line, softly either side of it */
        float band = exp(-d * d / 2.2) * inside;
        vec3 c = col * liquid * 0.94 + hot * band * (0.55 + 0.35 * u_run);
        float a = clamp(liquid * 0.94 + band * 0.6, 0.0, 1.0);
        /* the warm light thrown out of the window onto the pump face around it, while it runs */
        vec2 q = vec2(p.x - 159.5, p.y - 97.0 - u_su * (p.x - 139.0) - 19.5);
        float sd = length(max(abs(q) - vec2(20.5, 19.5), 0.0));
        float glow = exp(-sd / 7.0) * (1.0 - inside) * u_run * (0.25 + 0.5 * u_fill) * smoothstep(0.0, 2.0, sd)
                   * smoothstep(127.0, 135.0, p.x);           // on the face only, not past its left edge
        return vec4(c + gold * glow * 0.55, a + glow * 0.55 * (1.0 - a));
      }`,
  });
  if (fx.on) { fx.set("u_su", su); }

  const loop = register(stage, (dt, now) => {
    const a = sale.step(dt), b = stepS(hand, dt);
    const v = sale.values(sale.held ? { fill: hand.x, pump: clamp((hand.t - hand.x) * 8, 0, 1) } : {});
    ic.ink(v.ink);
    slosh.v += (v.kick - lastKick) * 0.6; // a change in the jolt is a push on the fuel
    lastKick = v.kick;
    const c = stepS(slosh, dt);
    const sl = clamp(slosh.x, -0.3, 0.3);
    const L = level(v.fill, sl, now / 1000);
    fuel.draw(L.line, smooth(0.86, 0.97, v.ink));
    fuel.tone(sale.held || Math.abs(sl) > 0.01 || (v.fill > 0.15 && v.fill < 0.8 && v.ink >= 1) ? "hi" : "edge");

    const shown = v.ink < 1 ? "drawing" : sale.held ? `fuel ${Math.round(v.fill * 100)}%`
      : Math.abs(sl) > 0.03 ? "slop" : Math.abs(v.fill - 0.12) < 0.01 ? "rest" : `fuel ${Math.round(v.fill * 100)}%`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    if (fx.on) {
      fx.set("u_e", L.e); fx.set("u_slosh", sl); fx.set("u_fill", v.fill); fx.set("u_run", v.pump); // the pump running drives the bubbles and the glow (rule 11)
      fx.mask([glass]); fx.draw(now);
    }
    return a || b || c;
  });

  /* hover runs the pump: nearness to the glass's rest centre sets the level (rule 01) */
  const leave = () => { sale.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(14, 120, Math.hypot(pt[0] - r.cx, pt[1] - r.cy));
      if (near <= 0) { leave(); return; }
      if (!sale.held) { hand.x = sale.values().fill; sale.hold(true); }
      hand.t = lerp(0.12, top, near);
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { top = clamp(v, 0.12, 1); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "local-gas-station",
  icon: "local-gas-station",
  variant: "rounded-left",
  means: "A pump runs a sale: fuel rises in its glass, the nozzle clicks off and it slops, then it drains. Hold near the glass to run it.",
  effect: "the body of amber fuel in the glass, lit at its surface, bubbling and glowing while the pump runs",
  rules: [1, 5, 8, 11],
  range: [0.45, 0.7, 1],
  mount,
});
