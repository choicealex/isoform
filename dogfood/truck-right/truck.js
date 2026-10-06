/*
 * Delivery run. The truck draws itself in, then makes a run: it pulls away along its own length, a mark
 * sweeps round each tyre's rim, the dust kicks up behind the rear wheel, it holds, and it backs to its bay.
 * Bring the pointer near and it is nudged forward. In a product: an order on its way.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, story, trace, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* paint order as Isocons drew it: the body (rear end + side), the wheels on it, the glass, the arch slivers */
  const body = ic.part("body", [0, 1, 2]);
  const rear = ic.part("rear-wheel", [3]);
  const front = ic.part("front-wheel", [4]);
  const glass = ic.part("glass", [5, 6, 7]);
  const arch = ic.part("arches", [8, 9]);
  const all = [body, rear, front, glass, arch];
  glass.hi(true);

  /* what happens, in line: a mark sweeping round each rim, and the dust drawn on behind the rear wheel */
  const markR = rear.trace({ tone: "hi" });
  const markF = front.trace({ tone: "hi" });
  const dust = trace(svg, { under: true });

  const run = story(stage, {
    rest: { go: 0, dust: 0, ink: 1 },
    poster: { go: 0.8, dust: 0.9, ink: 1 },
    intro: { dur: 3500, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 700 },                                              // waiting at the bay
      { dur: 1500, to: { go: 1 } },                              // pulls away
      { dur: 700, to: { dust: 1 }, ease: "out" },                // dust kicks up
      { dur: 900 },                                              // under way, held
      { dur: 700, to: { dust: 0 } },                             // dust settles
      { dur: 1400, to: { go: 0 } },                              // backs to the bay
      { dur: 800 },
    ],
  });

  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";
  const U = ic.u, V = ic.v;               // measured axes: v runs down-left, so forward is -v
  const R = 8.7;                          // a tyre's radius in stage units, measured off its box
  const wc = (p) => [p.rest.cx, p.rest.cy];
  const cr = wc(rear), cf = wc(front);

  /* the mark on a rim: the tyre is a circle in the plane of v and up */
  function rim(tr, c, off, roll, live) {
    if (!live) { tr.draw([]); return; }
    const pts = [];
    const a0 = roll * Math.PI * 2 * 1.5;
    for (let i = 0; i <= 8; i++) {
      const th = a0 + (i / 8) * 1.1;
      pts.push([c[0] + off[0] + R * Math.cos(th) * -V[0] + 0 , c[1] + off[1] - R * (Math.cos(th) * V[1] * -1 + Math.sin(th))]);
    }
    tr.draw([pts]);
  }

  const fx = gl(stage, {
    layer: "under",
    uniforms: { u_o: "vec2", u_t: "float" },
    frag: `
      vec4 effect(vec2 p) {
        if (u_t < 0.02) return vec4(0.0);
        vec2 q = p - u_o;
        float s = -q.x / 0.86;                     // distance back along the road (along -v reversed)
        float h = s * 0.52 - q.y;                  // height above the road
        float len = 20.0 + 60.0 * u_t;
        float top = 3.0 + 0.32 * s;
        float tur = fbm(vec2(s * 0.09 - u_time * 1.4, h * 0.14 + u_time * 0.5));
        float inside = smoothstep(-2.0, 5.0, s) * (1.0 - smoothstep(len * 0.6, len, s))
                     * smoothstep(-1.0, 3.0, h) * (1.0 - smoothstep(top * 0.5, top * (0.8 + 0.6 * tur), h));
        float body = inside * smoothstep(0.3, 0.7, tur + 0.35 * (1.0 - s / len)) * u_t;
        // the one colour of its own the effect carries is the phenomenon's (rule 12): dry road dust, a warm tan
        vec3 tan = mix(vec3(0.78, 0.64, 0.46), vec3(0.62, 0.50, 0.36), u_dark);
        float a = clamp(body * 0.85, 0.0, 1.0);
        return vec4(tan * a, a);
      }`,
  });

  const origin = [146, 268];
  const loop = register(stage, (dt, now) => {
    const a = run.step(dt), b = stepS(hand, dt);
    const v = run.values(run.held ? { go: hand.x, dust: smooth(0.2, 0.8, hand.x) } : {});
    ic.ink(v.ink);
    const d = v.go * max;
    const off = [-V[0] * d, -V[1] * d];            // forward is -v
    for (const p of all) p.move(0, -d, 0);
    const driving = v.go > 0.04 && v.go < 0.96;
    glass.hi(!driving); rear.hi(driving); front.hi(false);
    rim(markR, cr, off, v.go, v.go > 0.03);
    rim(markF, cf, off, v.go, v.go > 0.03);
    /* dust: solid streaks drawn on behind the rear wheel, retracting as it settles */
    const o = [origin[0] + off[0], origin[1] + off[1]];
    if (v.dust > 0.02) {
      const lines = [0, 1, 2].map((k) => {
        const s0 = 4 + k * 3, L = (14 + 16 * k) * 1;
        const base = [o[0] - V[0] * 0 + k * 4, o[1] - 3 * k];
        return [[base[0] + V[0] * s0, base[1] + V[1] * s0], [base[0] + V[0] * (s0 + L), base[1] + V[1] * (s0 + L)]];
      });
      dust.draw(lines, smooth(0, 1, v.dust));
    } else dust.draw([]);
    const shown = v.ink < 1 ? "drawing" : v.go < 0.03 ? "rest" : v.go > 0.9 ? "on its way" : "pulling out";
    if (shown !== label) { read.textContent = shown; label = shown; }
    if (fx.on) { fx.set("u_o", o); fx.set("u_t", v.dust); fx.draw(now); }
    return a || b || v.dust > 0.02;
  });

  const c = [body.rest.cx, body.rest.cy];
  const leave = () => { run.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(30, 170, Math.hypot(pt[0] - c[0], pt[1] - c[1]));
      if (near <= 0) { leave(); return; }
      if (!run.held) { hand.x = run.values().go; run.hold(true); }
      hand.t = near * 0.4;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 40); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "truck",
  icon: "local-shipping",
  variant: "rounded-right",
  means: "A delivery truck pulls away, a mark sweeping round each tyre and dust kicking up behind, then backs to its bay.",
  effect: "dry road dust kicked up behind the rear wheel, a tan cloud that billows and thins with distance",
  rules: [1, 5, 8, 11],
  range: [6, 16, 28],
  mount,
});
