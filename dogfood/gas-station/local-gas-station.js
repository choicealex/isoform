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
    rest: { fill: 0.12, kick: 0, ink: 1 },
    poster: { fill: 0.78, kick: 0.6, ink: 1 },
    intro: { dur: 4200, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 600 },
      { dur: 2400, to: { fill: 0.82 } },                       // the pump runs, fuel rises in the glass
      { dur: 1400, to: { kick: [1, -0.7, 0.4, 0] } },          // the nozzle clicks off: the surface slops
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
    uniforms: { u_e: "vec2", u_su: "float", u_slosh: "float" },
    frag: `
      // the body of fuel under the traced surface, inside the glass only
      vec4 effect(vec2 p) {
        float inside = mask(p);
        if (inside < 0.01) return vec4(0.0);
        float dx = p.x - u_e.x;
        float surf = u_e.y + dx * u_su + dx * u_slosh + sin(dx * 0.2 + u_time * 5.0) * 3.0 * abs(u_slosh);
        float below = smoothstep(-0.5, 0.5, p.y - surf);
        float a = below * mix(0.22, 0.45, clamp((p.y - surf) / 30.0, 0.0, 1.0));
        // the one colour of its own (rule 12): petrol's pale amber
        vec3 amber = mix(vec3(0.85, 0.55, 0.08), vec3(0.98, 0.76, 0.3), u_dark);
        return vec4(amber * a, a) * inside;
      }`,
  });
  if (fx.on) { fx.set("u_su", su); }

  const loop = register(stage, (dt, now) => {
    const a = sale.step(dt), b = stepS(hand, dt);
    const v = sale.values(sale.held ? { fill: hand.x } : {});
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
    if (fx.on) { fx.set("u_e", L.e); fx.set("u_slosh", sl); fx.mask([glass]); fx.draw(now); }
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
  effect: "the body of fuel under the traced surface, sloshing inside the glass",
  rules: [1, 5, 8, 11],
  range: [0.45, 0.7, 1],
  mount,
});
