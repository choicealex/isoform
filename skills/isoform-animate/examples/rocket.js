/*
 * Rocket. It draws itself in, then runs a flight: the engine lights, the flame draws on,
 * the rocket lifts off its pad, hovers, comes back down, settles and cuts out.
 * Bring the pointer near and you hold the throttle: the nearer, the harder it
 * burns. In a product: a launch, a deploy, a send.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, climb) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* paint order as Isocons drew it: hull, then the window on it, then the fins */
  const hull = ic.part("hull", [0, 1, 2]);
  const win = ic.part("window", [3]);
  const finR = ic.part("fin-right", [4, 5]);
  const finL = ic.part("fin-left", [6, 7]);
  const all = [hull, win, finR, finL];
  win.hi(true);

  /* the burn, in the figure's own hairline: the flame's edge and its hot core, inside the hull's paint so the fins
     stay in front of it */
  const flame = hull.trace();
  const core = hull.trace({ tone: "hi" });

  const flight = story(stage, {
    rest: { thrust: 0, lift: 0, ink: 1 },
    poster: { thrust: 1, lift: 0.7, ink: 1 },
    intro: { dur: 2200, from: { ink: 0 } }, // it draws itself in, once, the first time it is seen
    beats: [
      { dur: 600 },
      { dur: 700, to: { thrust: 0.45 }, ease: "out" },          // ignition
      { dur: 1000, to: { thrust: 1, lift: 1 } },                 // liftoff
      { dur: 1300 },                                              // hover
      { dur: 1100, to: { lift: 0, thrust: 0.5 } },               // descent
      { dur: 350, to: { lift: [-0.05, 0] }, ease: "out" },       // touchdown, a small settle
      { dur: 450, to: { thrust: 0 }, ease: "out" },              // cut-off
      { dur: 900 },
    ],
  });

  const hand = spring(0, SPRING.hand);
  let max = climb, label = "";
  const nozzle = [206, 236], ground = 244;

  const fx = gl(stage, {
    layer: "under",
    uniforms: { u_noz: "vec2", u_lift: "float", u_t: "float", u_ground: "float" },
    frag: `
      vec4 effect(vec2 p) {
        if (u_t < 0.02) return vec4(0.0);
        vec2 n = u_noz - vec2(0.0, u_lift);
        float y = p.y - n.y, len = 14.0 + 46.0 * u_t;
        float s = clamp(y / len, 0.0, 1.0);
        float w = mix(3.0, 7.0 + 6.0 * u_t, sqrt(s)) + (noise(vec2(p.x * 0.2, y * 0.15 - u_time * 9.0)) - 0.5) * 2.0 * s;
        float dx = abs(p.x - n.x);
        float plume = (1.0 - smoothstep(w * 0.6, w, dx)) * step(0.0, y) * (1.0 - smoothstep(len * 0.6, len, y));
        float core = (1.0 - smoothstep(0.0, w * 0.3, dx)) * step(0.0, y) * (1.0 - smoothstep(0.0, len * 0.45, y));
        vec2 g = vec2((p.x - n.x) / (40.0 + 60.0 * u_t), (p.y - u_ground) / 7.0);
        float dust = smoothstep(1.0, 0.2, length(g)) * smoothstep(0.35, 0.7, fbm(vec2(p.x * 0.05 + sign(p.x - n.x) * u_time, p.y * 0.1)))
                   * smoothstep(0.25, 0.8, u_t);
        // the one colour of its own the effect may carry is the phenomenon's (rule 12): burning propellant
        vec3 flame = vec3(1.0, 0.55, 0.2);
        vec3 hot = mix(vec3(1.0, 0.8, 0.5), vec3(1.0, 0.97, 0.92), u_dark);
        vec3 col = mix(flame, hot, clamp(core, 0.0, 1.0));
        float a = clamp(plume * 0.55 + core * 0.7, 0.0, 1.0) * smoothstep(0.0, 0.3, u_t);
        float da = dust * 0.35 * (1.0 - a);
        return vec4(col * a + u_line * da, a + da);
      }`,
  });
  if (fx.on) { fx.set("u_noz", nozzle); fx.set("u_ground", ground); }

  const loop = register(stage, (dt, now) => {
    const a = flight.step(dt), b = stepS(hand, dt);
    const v = flight.values(flight.held ? { thrust: hand.x, lift: smooth(0.5, 1, hand.x) } : {});
    ic.ink(v.ink);
    const t = v.thrust, lift = v.lift * max;
    const shake = t > 0.05 && !IF.reducedMotion() ? Math.sin(now * 0.07) * 0.18 * t : 0; // a burning engine hums
    for (const p of all) p.move(0, 0, lift).tilt(shake, nozzle);
    const shown = v.ink < 1 ? "drawing" : t < 0.03 ? "rest" : lift > 0.5 ? "liftoff" : "ignition";
    if (shown !== label) { read.textContent = shown; label = shown; }
    drawBurn(t, lift, now);
    if (fx.on) { fx.set("u_lift", lift); fx.set("u_t", t); fx.draw(now); }
    return a || b || t > 0.03;
  });

  function drawBurn(t, lift, now) {
    if (t < 0.03) { flame.draw([]); core.draw([]); return; }
    const n = [nozzle[0], nozzle[1] - lift];
    const flick = 1 + 0.07 * Math.sin(now * 0.031) * Math.sin(now * 0.017);
    const len = (14 + 46 * t) * flick, wide = 6 + 5 * t;
    const side = (k, scale, l) => Array.from({ length: 13 }, (_, i) => {
      const s = i / 12, w = (2.5 + wide * Math.sqrt(s)) * (1 - s ** 2.5) * scale;
      return [n[0] + k * w, n[1] + s * l];
    });
    /* the flame draws on as it lights: its outline is the ignition */
    flame.draw([side(-1, 1, len).concat(side(1, 1, len).reverse())], smooth(0, 0.35, t));
    core.draw([side(-1, 0.38, len * 0.45).concat(side(1, 0.38, len * 0.45).reverse())], smooth(0.15, 0.5, t));
  }

  /* hover takes over: nearness to the rocket's rest centre is the throttle (rule 01) */
  const c = [hull.rest.cx, hull.rest.cy];
  const leave = () => { flight.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(30, 170, Math.hypot(pt[0] - c[0], pt[1] - c[1]));
      if (near <= 0) { leave(); return; }
      if (!flight.held) { hand.x = flight.values().thrust; flight.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 30); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "rocket",
  icon: "rocket",
  variant: "rounded-left",
  means: "A rocket flies a loop: it lights, lifts off, hovers and lands. Bring the pointer near to hold the throttle.",
  effect: "an exhaust plume of burning propellant under the traced flame, throwing dust along the ground",
  rules: [1, 5, 8, 11],
  range: [4, 10, 18],
  mount,
});
