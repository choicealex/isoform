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
    intro: { dur: 6000, from: { ink: 0 }, ease: "linear" }, // it draws itself in, once, the first time it is seen
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
  /* the hull's lowest point, measured off the drawing (getPointAtLength through the part's own transform): the flame
     starts a hair inside it so the two touch */
  const nozzle = [201.2, 237.2], ground = 282; // the ground the plume hits: where the traced flame ends, below the fins

  const fx = gl(stage, {
    layer: "under",
    uniforms: { u_noz: "vec2", u_lift: "float", u_t: "float", u_ground: "float" },
    frag: `
      vec4 effect(vec2 p) {
        if (u_t < 0.02) return vec4(0.0);
        vec2 n = u_noz - vec2(0.0, u_lift);
        float gap = max(u_ground - n.y, 4.0);          // nozzle to pad
        float dx = p.x - n.x, ax = abs(dx), y = p.y - n.y, gy = p.y - u_ground;
        float tur = fbm(vec2(p.x * 0.11, p.y * 0.1 - u_time * 6.0));
        /* the column: white-hot from the nozzle down to the pad, nothing below the pad */
        float w = mix(3.5, 8.0 + 6.0 * u_t, clamp(y / gap, 0.0, 1.0)) * (0.85 + 0.4 * tur);
        float onPad = smoothstep(gap + 3.0, gap - 1.0, y) * smoothstep(-1.0, 1.5, y);
        float column = (1.0 - smoothstep(w * 0.5, w, ax)) * onPad;
        float core = (1.0 - smoothstep(0.0, w * 0.35, ax)) * onPad;
        /* where it lands: a splash on the pad, and flame tongues racing out along it, flickering */
        float reach = 22.0 + 95.0 * u_t;
        float thin = 3.0 + 5.0 * u_t;
        float tongue = exp(-gy * gy / (thin * thin)) * (1.0 - smoothstep(reach * 0.35, reach, ax + (tur - 0.5) * 30.0))
                     * smoothstep(0.35, 0.65, fbm(vec2(ax * 0.07 - u_time * 3.0, gy * 0.3 + sign(dx) * 7.0)) + 0.25 * (1.0 - ax / reach));
        float splash = exp(-(dx * dx) / (90.0 + 400.0 * u_t) - gy * gy / (10.0 + 20.0 * u_t));
        float flame = clamp(column + tongue * 0.9 + splash * 0.8, 0.0, 1.0) * smoothstep(u_ground + 9.0, u_ground + 2.0, p.y);
        float hot = clamp(core * 1.3 + splash * 0.7 * u_t, 0.0, 1.0);
        /* light: a soft orange glow around the splash, falling off smoothly (no edges of its own) */
        vec2 lg = vec2(dx / (55.0 + 70.0 * u_t), (p.y - u_ground + 4.0) / (26.0 + 22.0 * u_t));
        float glow = exp(-dot(lg, lg) * 1.6) * 0.6 * smoothstep(0.05, 0.5, u_t);
        /* smoke: billows thrown out to both sides, rising off the pad */
        vec2 sg = vec2((ax - reach * 0.75) / (reach * 0.55), (gy + 10.0 + 8.0 * u_t) / (14.0 + 10.0 * u_t));
        float smoke = smoothstep(1.0, 0.2, length(sg)) * smoothstep(0.42, 0.72, fbm(vec2(p.x * 0.05 + sign(dx) * u_time * 0.9, p.y * 0.07 + u_time * 0.5))) * smoothstep(0.3, 0.9, u_t);
        // the one colour of its own the effect may carry is the phenomenon's (rule 12): burning propellant
        vec3 red = vec3(0.92, 0.22, 0.06), orange = vec3(1.0, 0.55, 0.12), white = vec3(1.0, 0.95, 0.82);
        vec3 col = mix(mix(red, orange, smoothstep(0.1, 0.7, flame)), white, hot);
        float a = flame * smoothstep(0.0, 0.2, u_t);
        float ga = glow * (1.0 - a);
        float sa = smoke * 0.5 * (1.0 - a - ga);
        vec3 smokeCol = mix(vec3(0.6), vec3(0.34), u_dark);
        return vec4(col * a + orange * ga + smokeCol * sa, a + ga + sa);
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
  effect: "a white-hot exhaust that hits the pad and splashes out along it as flame, lighting the ground orange while smoke rolls out",
  rules: [1, 5, 8, 11],
  range: [4, 10, 18],
  mount,
});
