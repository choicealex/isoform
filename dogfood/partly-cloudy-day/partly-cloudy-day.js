/*
 * Partly cloudy day. It draws itself in, then the sun shines: light breaks out past its rim.
 * A cloud drifts across the disc and the light is cut off, ray by ray, nearest the cloud first;
 * it drifts clear and the light comes back. Bring the pointer near the sun and you pull the
 * cloud over it. In a product: a forecast, a status that is mostly fine.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, trace, story, clamp, smooth, lerp, SPRING } = IF;

function mount({ stage, svg, read, src }, travel) {
  const bag = disposer();
  const ic = icon(svg, src); // default placement: inspect.mjs's points are this figure's points

  const sun = ic.part("sun", [8]);
  /* each ray slides out along its own edge as the light goes out: [part, a, b, c] direction per unit, in the order the sweep reaches them */
  const rays = [[[1, 9], [-1, 0, 0], "ul"], [[10, 11], [0, 0, 1], "top"], [[2, 7], [0, -1, 0], "r"], [[13, 6], [1, 0, 0], "lr"], [[0, 5], [0, 0, -1], "bot"]]
    .map(([f, d]) => ({ p: ic.part("ray" + f[0], f), d }));
  const cloud = ic.part("cloud", [3, 4, 12, 14, 15]);
  sun.hi(true); // the eye starts at the sun

  /* the light, in the figure's hairline: short strokes just past the sun's rim, in the gaps between its rays */
  const beams = trace(svg, { tone: "hi" }); // the corona: an arc just past the rim between two rays
  const c = [203, 166], ax = [55, 62];
  const gaps = [[-105, 0.05], [-58, 0.15], [0, 0.35], [48, 0.45]]; // angle, how soon the cloud puts it out
  const stroke = (deg, k0, k1) => {
    const t = (deg * Math.PI) / 180;
    return [[c[0] + k0 * ax[0] * Math.cos(t), c[1] + k0 * ax[1] * Math.sin(t)], [c[0] + k1 * ax[0] * Math.cos(t), c[1] + k1 * ax[1] * Math.sin(t)]];
  };

  const day = story(stage, {
    rest: { shine: 0, cover: 0, ink: 1 },
    poster: { shine: 1, cover: 0.4, ink: 1 },
    intro: { dur: 5400, from: { ink: 0 }, ease: "linear" }, // it draws itself in, once, the first time it is seen
    beats: [
      { dur: 600 },
      { dur: 900, to: { shine: 1 } },                        // the light breaks out
      { dur: 800 },
      { dur: 1900, to: { cover: 0.6 } },                       // the cloud drifts across the sun
      { dur: 900 },                                           // overcast
      { dur: 1500, to: { cover: 0 } },                       // it drifts clear, softer
      { dur: 700 },
      { dur: 700, to: { shine: 0 } },
      { dur: 500 },
    ],
  });

  const hand = spring(0, SPRING.hand);
  let max = travel, label = "", wasLit = true;

  const fx = gl(stage, {
    layer: "under",
    uniforms: { u_cl: "vec2", u_shine: "float", u_cover: "float" },
    frag: `
      // sunlight round the disc's rim, shaded where the cloud stands between
      vec4 effect(vec2 p) {
        if (u_shine < 0.02) return vec4(0.0);
        float r = length((p - vec2(203.0, 166.0)) / vec2(55.0, 62.0));
        float halo = smoothstep(1.0, 1.12, r) * exp(-(r - 1.0) * 4.5);
        float shade = 1.0 - smoothstep(0.6, 1.05, length((p - u_cl) / vec2(64.0, 58.0)));
        float a = halo * 0.55 * u_shine * (1.0 - 0.92 * shade) * (1.0 - 0.7 * u_cover);
        // the one colour of its own the effect may carry is the phenomenon's (rule 12): sunlight
        vec3 light = mix(vec3(0.95, 0.66, 0.15), vec3(1.0, 0.82, 0.4), u_dark);
        return vec4(light * a, a);
      }`,
  });

  const loop = register(stage, (dt, now) => {
    const a = day.step(dt), b = stepS(hand, dt);
    const v = day.values(day.held ? { cover: hand.x, shine: 1 } : {});
    ic.ink(v.ink);
    const k = v.cover * max;
    cloud.move(0, -k, k * 0.15);
    rays.forEach((r, i) => { const e = 9 * clamp(v.shine * 1.6 - i * 0.12, 0, 1) * (1 - smooth(0.05 + i * 0.1, 0.3 + i * 0.1, v.cover)); r.p.move(r.d[0] * e, r.d[1] * e, r.d[2] * e); });
    const dr = smooth(0.86, 0.97, v.ink);
    beams.draw([]); void (gaps.map(([deg, at]) => stroke(deg, 1.12, 1.12 + 0.42 * clamp(v.shine * (1 - smooth(at, at + 0.2, v.cover)), 0, 1))), dr);
    const shown = v.ink < 1 ? "drawing" : v.cover > 0.5 ? "overcast" : v.cover > 0.05 ? "drifting" : v.shine > 0.05 ? "sunny" : "rest";
    if (shown !== label) { read.textContent = shown; label = shown; }
    if (fx.on) { fx.set("u_cl", [146 + 0.866 * k, 176 - 0.5 * k - k * 0.15]); fx.set("u_shine", v.shine); fx.set("u_cover", v.cover); fx.draw(now); }
    return a || b;
  });

  /* hover: nearness to the sun's rest centre pulls the cloud over it (rule 01) */
  const leave = () => { day.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(20, 150, Math.hypot(pt[0] - c[0], pt[1] - c[1]));
      if (near <= 0) { leave(); return; }
      if (!day.held) { hand.x = day.values().cover; day.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 48); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "partly-cloudy-day",
  icon: "partly-cloudy-day",
  variant: "rounded-left",
  means: "The sun shines, a cloud drifts across it and the light is cut off ray by ray. Bring the pointer near to pull the cloud over.",
  effect: "sunlight round the sun's rim under the traced strokes, shaded where the cloud stands between",
  rules: [1, 4, 5, 11],
  range: [20, 34, 46],
  mount,
});
