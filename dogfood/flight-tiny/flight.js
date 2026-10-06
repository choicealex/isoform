/*
 * Flight. It draws itself in, then flies a takeoff: the engines spool, the plane climbs
 * nose-up, a contrail draws on behind it and hangs in the air, then it settles back and
 * the trail retracts. Bring the pointer near and you hold the throttle.
 * In a product: a departure, a booked trip.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, story, trace, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, climb) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* contiguous runs in Isocons' paint order, so every part keeps its place */
  const body = ic.part("body", [0, 1, 2]);
  const nose = ic.part("nose", [3]);
  const tailL = ic.part("tail", [4, 5]);
  const hull = ic.part("hull", [6, 7, 8]);
  const wing = ic.part("wing", [9]);
  const bits = ic.part("bits", [10, 11]);
  const all = [body, nose, tailL, hull, wing, bits];
  nose.hi(true);

  /* the contrail: the air's own line behind the plane, under the icon, two engines wide */
  const trailA = trace(svg, { under: true });
  const trailB = trace(svg, { under: true, tone: "lo" });
  const exhaust = trace(svg, { tone: "hi" });

  const flight = story(stage, {
    rest: { thrust: 0, lift: 0, trail: 0, ink: 1 },
    poster: { thrust: 1, lift: 0.8, trail: 0.7, ink: 1 },
    intro: { dur: 6000, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 500 },
      { dur: 700, to: { thrust: 0.5 }, ease: "out" },            // spool up
      { dur: 1300, to: { thrust: 1, lift: 1, trail: 0.6 } },      // climb, trail draws on
      { dur: 1200, to: { trail: 1 } },                            // cruise
      { dur: 1100, to: { lift: 0, thrust: 0.4, trail: 0.2 } },    // back down, trail retracts
      { dur: 350, to: { lift: [-0.05, 0], trail: 0 }, ease: "out" },
      { dur: 450, to: { thrust: 0 }, ease: "out" },
      { dur: 900 },
    ],
  });

  const hand = spring(0, SPRING.hand);
  let max = climb, label = "";
  const tail = [ic.pt(214, 264)[0], ic.pt(214, 264)[1]];
  
  const fx = gl(stage, {
    layer: "under",
    uniforms: { u_tail: "vec2", u_lift: "float", u_t: "float", u_trail: "float" },
    frag: `
      vec4 effect(vec2 p) {
        if (u_t < 0.02) return vec4(0.0);
        vec2 n = u_tail - vec2(0.0, u_lift);
        float y = p.y - n.y, dx = p.x - n.x;
        float len = 10.0 + 70.0 * u_trail;
        float tur = fbm(vec2(p.x * 0.09, p.y * 0.07 - u_time * 2.0));
        float w = (7.0 + 0.14 * y) * (0.8 + 0.5 * tur);
        float colm = (1.0 - smoothstep(w * 0.4, w, abs(dx))) * smoothstep(-2.0, 2.0, y) * (1.0 - smoothstep(len * 0.6, len, y));
        // hot exhaust at the nozzle: burning kerosene, its own colour (rule 12)
        float hotr = exp(-(dx * dx) / 30.0 - max(y, 0.0) * max(y, 0.0) / (80.0 + 300.0 * u_t)) * smoothstep(-2.0, 1.0, y);
        vec3 hot = mix(vec3(1.0, 0.45, 0.1), vec3(1.0, 0.92, 0.78), hotr);
        vec3 vap = mix(vec3(0.75, 0.82, 0.92), vec3(0.62, 0.72, 0.86), 1.0 - u_dark);
        float va = colm * 0.95 * smoothstep(0.1, 0.6, u_trail + u_t * 0.3);
        float ha = clamp(hotr * 1.2, 0.0, 1.0) * u_t;
        return vec4(vap * va * (1.0 - ha) + hot * ha, clamp(va + ha, 0.0, 1.0));
      }`,
  });
  if (fx.on) fx.set("u_tail", tail);

  const loop = register(stage, (dt, now) => {
    const a = flight.step(dt), b = stepS(hand, dt);
    const v = flight.values(flight.held ? { thrust: hand.x, lift: smooth(0.5, 1, hand.x), trail: smooth(0.4, 1, hand.x) } : {});
    ic.ink(v.ink);
    const t = v.thrust, lift = v.lift * max;
    for (const p of all) p.move(0, 0, lift).tilt(-2.5 * v.lift, tail);
    const shown = v.ink < 1 ? "drawing" : t < 0.03 ? "rest" : lift > 0.5 ? "climb" : "spool";
    if (shown !== label) { read.textContent = shown; label = shown; }
    drawTrail(t, lift, v.trail, v.ink);
    if (fx.on) { fx.set("u_lift", lift); fx.set("u_t", t); fx.set("u_trail", v.trail); fx.draw(now); }
    return a || b || t > 0.03;
  });

  function drawTrail(t, lift, trailV, ink) {
    const n = [tail[0], tail[1] - lift];
    const len = 6 + 52 * trailV;
    if (trailV < 0.02) { trailA.draw([]); trailB.draw([]); } else {
      trailA.draw([[[n[0] - 4, n[1] + 2], [n[0] - 4, n[1] + 2 + len]]], smooth(0.86, 0.97, ink) * Math.min(1, trailV * 1.5));
      trailB.draw([[[n[0] + 5, n[1] + 2], [n[0] + 5, n[1] + 2 + len * 0.8]]], smooth(0.86, 0.97, ink) * Math.min(1, trailV * 1.5));
    }
    exhaust.draw(t < 0.03 ? [] : [[[n[0], n[1] + 1], [n[0], n[1] + 3 + 10 * t]]], smooth(0.1, 0.5, t));
  }

  const c = [body.rest.cx, body.rest.cy];
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
  name: "flight",
  icon: "flight",
  variant: "rounded-left",
  means: "A plane spools its engines, climbs and draws a contrail, then settles. Bring the pointer near to hold the throttle.",
  effect: "hot exhaust at the tail and a soft vapour contrail condensing in the air behind it",
  rules: [1, 5, 8, 11],
  range: [4, 12, 22],
  mount,
});
