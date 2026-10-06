/*
 * Rocket, seen from the top (the hero's direction switch). Lying flat, it points up-right along -v, so it does not lift:
 * it lights, flies forward along its nose with its exhaust trailing behind, holds, and eases back to where it was
 * drawn as the engine cuts out. Bring the pointer near and you hold the throttle: the nearer, the further it flies.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* inspect.mjs, rounded-top: 0 and 3 the hull (3 holds the window's opening), 4 the window, 1 5 6 the far fin, 2 7
     the near fin. Painted far fin, hull (with the flame inside it), window, near fin */
  const finFar = ic.part("fin-far", [1, 5, 6], { paint: "first" });
  const hull = ic.part("hull", [0, 3], { paint: "first" });
  const win = ic.part("window", [4]);
  const finNear = ic.part("fin-near", [2, 7]);
  const all = [finFar, hull, win, finNear];
  win.hi(true);

  /* the exhaust in the figure's own hairline, inside the hull's paint so the near fin stays in front of it */
  const flame = hull.trace();
  const core = hull.trace({ tone: "hi" });

  const flight = story(stage, {
    rest: { thrust: 0, fly: 0, ink: 1 },
    poster: { thrust: 1, fly: 0.7, ink: 1 },
    intro: { dur: 6000, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 600 },
      { dur: 700, to: { thrust: 0.45 }, ease: "out" },    // ignition
      { dur: 1000, to: { thrust: 1, fly: 1 } },            // away along its nose
      { dur: 1300 },                                        // cruise
      { dur: 1300, to: { fly: 0, thrust: 0.35 } },         // eases back, the engine low
      { dur: 450, to: { thrust: 0 }, ease: "out" },        // cut-off
      { dur: 900 },
    ],
  });

  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";
  /* the tail's farthest point along +v, measured off the drawing; the exhaust leaves from a hair inside it */
  const nozzle = [131.2, 201.4];
  const back = ic.v; // the exhaust trails along +v, behind the tail
  const side = [-back[1], back[0]];

  const fx = gl(stage, {
    layer: "under",
    uniforms: { u_noz: "vec2", u_dir: "vec2", u_t: "float" },
    frag: `
      vec4 effect(vec2 p) {
        if (u_t < 0.02) return vec4(0.0);
        vec2 d = normalize(u_dir), q = p - u_noz;
        float s = dot(q, d), r = abs(dot(q, vec2(-d.y, d.x)));
        float len = 30.0 + 110.0 * u_t;
        float tur = fbm(vec2(s * 0.08 - u_time * 6.0, r * 0.15));
        /* the plume: white-hot at the nozzle, widening and cooling along the trail */
        float w = mix(3.0, 10.0 + 8.0 * u_t, clamp(s / len, 0.0, 1.0)) * (0.85 + 0.4 * tur);
        float along = smoothstep(-2.0, 2.0, s) * (1.0 - smoothstep(len * 0.6, len, s));
        float column = (1.0 - smoothstep(w * 0.5, w, r)) * along;
        float core = (1.0 - smoothstep(0.0, w * 0.35, r)) * smoothstep(-2.0, 2.0, s) * (1.0 - smoothstep(0.0, len * 0.4, s));
        float glow = exp(-(s * s) / (900.0 + 1600.0 * u_t) - r * r / 260.0) * 0.5;
        // the one colour of its own the effect may carry is the phenomenon's (rule 12): burning propellant
        vec3 red = vec3(0.92, 0.22, 0.06), orange = vec3(1.0, 0.55, 0.12), white = vec3(1.0, 0.95, 0.82);
        vec3 col = mix(mix(red, orange, column), white, clamp(core * 1.3, 0.0, 1.0));
        float a = clamp(column + core, 0.0, 1.0) * smoothstep(0.0, 0.2, u_t);
        float ga = glow * (1.0 - a) * smoothstep(0.05, 0.5, u_t);
        return vec4(col * a + orange * ga, a + ga);
      }`,
  });
  if (fx.on) fx.set("u_dir", back);

  const loop = register(stage, (dt, now) => {
    const a = flight.step(dt), b = stepS(hand, dt);
    const v = flight.values(flight.held ? { thrust: hand.x, fly: smooth(0.3, 1, hand.x) } : {});
    ic.ink(v.ink);
    const t = v.thrust, go = v.fly * max;
    const shake = t > 0.05 && !IF.reducedMotion() ? Math.sin(now * 0.07) * 0.18 * t : 0;
    for (const p of all) p.move(0, -go, 0).tilt(shake, nozzle);
    const shown = v.ink < 1 ? "drawing" : t < 0.03 ? "rest" : go > max * 0.5 ? "flight" : "ignition";
    if (shown !== label) { read.textContent = shown; label = shown; }
    const o = ic.iso(0, -go, 0), n = [nozzle[0] + o[0], nozzle[1] + o[1]];
    drawBurn(t, n, now);
    if (fx.on) { fx.set("u_noz", n); fx.set("u_t", t); fx.draw(now); }
    return a || b || t > 0.03;
  });

  function drawBurn(t, n, now) {
    if (t < 0.03) { flame.draw([]); core.draw([]); return; }
    const flick = 1 + 0.07 * Math.sin(now * 0.031) * Math.sin(now * 0.017);
    const len = (14 + 46 * t) * flick, wide = 6 + 5 * t;
    const edge = (k, scale, l) => Array.from({ length: 13 }, (_, i) => {
      const s = i / 12, w = (2.5 + wide * Math.sqrt(s)) * (1 - s ** 2.5) * scale;
      return [n[0] + back[0] * s * l + side[0] * k * w, n[1] + back[1] * s * l + side[1] * k * w];
    });
    flame.draw([edge(-1, 1, len).concat(edge(1, 1, len).reverse())], smooth(0, 0.35, t));
    core.draw([edge(-1, 0.38, len * 0.45).concat(edge(1, 0.38, len * 0.45).reverse())], smooth(0.15, 0.5, t));
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
  return { set(v) { max = clamp(v, 0, 34); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "rocket-top",
  icon: "rocket",
  variant: "rounded-top",
  means: "A rocket, seen from the top: it lights, flies forward along its nose, cruises, and eases back as the engine cuts out.",
  effect: "a white-hot exhaust trailing behind the tail, widening and cooling along the trail, with an orange glow",
  rules: [1, 5, 8, 11],
  range: [10, 20, 30],
  mount,
});
