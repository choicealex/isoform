/*
 * Credit card. It draws itself in, then is swiped: the card runs along its stripe past a fixed reader head, the
 * stretch of stripe that has passed the head is traced and the head's pickup glows where it crosses the stripe,
 * then the card slides home. Bring the pointer near the stripe and you swipe it by hand. In a product: a payment read.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, trace, story, clamp, smooth, lerp, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src); // default placement: inspect.mjs's points are this figure's points

  /* paint order as drawn: top face (0), the stripe's end wall (1) and floor (2), then the slab's side wall (3).
     The body paints at its FIRST face so the stripe stays on top of it. */
  const body = ic.part("body", [0, 3], { paint: "first" });
  const stripe = ic.part("stripe", [1, 2]);
  stripe.hi(true); // the eye starts on the stripe: it is what the reader reads
  const all = [body, stripe];

  /* the stripe's centre line (u), and the head: fixed in the world, across the stripe (v), 30% along it */
  const s0 = [167, 103], s1 = [283.5, 170.5];
  const H = [lerp(s0[0], s1[0], 0.3), lerp(s0[1], s1[1], 0.3)];
  const w = 24; // half the head's length along v: a little wider than the stripe
  const headA = [H[0] - ic.v[0] * w, H[1] - ic.v[1] * w], headB = [H[0] + ic.v[0] * w, H[1] + ic.v[1] * w];
  const head = trace(svg, { tone: "edge" });
  const read_ = trace(svg, { tone: "hi" });

  const swipe = story(stage, {
    rest: { slide: 0, head: 0, ink: 1 },
    poster: { slide: 0.6, head: 1, ink: 1 },
    intro: { dur: 4800, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 600 },
      { dur: 500, to: { head: 1 } },                       // the reader head draws on
      { dur: 1500, to: { slide: 1 } },                     // the swipe: the card runs through
      { dur: 700 },                                         // read
      { dur: 1000, to: { slide: 0 } },                     // slides home, softer
      { dur: 500, to: { head: 0 } },
      { dur: 700 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const fx = gl(stage, {
    layer: "over",
    uniforms: { u_h: "vec2", u_a: "vec2", u_k: "float", u_u: "vec2" },
    frag: `
      vec4 effect(vec2 p) {
        if (u_k < 0.02) return vec4(0.0);
        float d = seg(p, u_a, u_h);                       // the stretch already read
        float dh = length(p - u_h);
        float flick = 0.85 + 0.15 * noise(vec2(u_time * 40.0, p.x * 0.05));
        float core = exp(-dh * dh / 30.0) * flick;
        float trail = exp(-d * d / 6.0) * 0.5;
        float halo = exp(-dh / 14.0) * 0.35;
        float a = clamp(core + trail + halo * (0.4 + 0.6 * mask(p)), 0.0, 0.9) * u_k * (0.4 + 0.6 * mask(p));
        // the pickup's one colour (rule 12): the cool blue-white of a read signal; on a white plate it keeps some blue
        vec3 blue = mix(vec3(0.16, 0.42, 1.0), vec3(0.3, 0.55, 1.0), u_dark);
        vec3 white = mix(vec3(0.55, 0.75, 1.0), vec3(0.94, 0.97, 1.0), u_dark);
        vec3 col = mix(blue, white, clamp(core, 0.0, 1.0));
        a += (hash(p + fract(u_time)) - 0.5) / 255.0;
        return vec4(col * a, a);
      }`,
  });

  const loop = register(stage, (dt, now) => {
    const a = swipe.step(dt), b = stepS(hand, dt);
    const v = swipe.values(swipe.held ? { slide: hand.x, head: smooth(0, 0.25, hand.x) } : {});
    ic.ink(v.ink);
    const s = v.slide * max;
    for (const p of all) p.move(-s, 0, 0); // the whole card slides back along u, through the head
    const reveal = smooth(0.86, 0.97, v.ink);
    head.draw(v.head > 0.01 ? [headA, headB] : [], v.head * reveal);
    const tail = [H[0] - ic.u[0] * s, H[1] - ic.u[1] * s]; // the read stretch: from where the head met the stripe to the head
    read_.draw(s > 0.5 && v.head > 0.5 ? [tail, H] : [], reveal);
    const shown = v.ink < 1 ? "drawing" : s < 0.3 ? "rest" : `swipe ${Math.round(s)}`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    if (fx.on) {
      fx.mask([stripe]);
      fx.set("u_h", H); fx.set("u_a", tail); fx.set("u_u", [ic.u[0], ic.u[1]]);
      fx.set("u_k", s > 0.5 ? v.head : 0); fx.draw(now);
    }
    return a || b || (fx.on && s > 0.5);
  });

  /* hover takes over: nearness to the stripe's rest centre swipes the card (rule 01) */
  const mid = [(s0[0] + s1[0]) / 2, (s0[1] + s1[1]) / 2];
  const leave = () => { swipe.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(14, 120, Math.hypot(pt[0] - mid[0], pt[1] - mid[1]));
      if (near <= 0) { leave(); return; }
      if (!swipe.held) { hand.x = swipe.values().slide; swipe.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 28); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "card",
  icon: "credit-card",
  variant: "rounded-top",
  means: "A card is swiped: it runs along its stripe past a fixed reader head, which reads the stripe; hold the stripe to swipe by hand.",
  effect: "the reader head's pickup glowing where it meets the magnetic stripe, and a lit trail along the stretch already read",
  rules: [1, 3, 6, 11],
  range: [10, 18, 28],
  mount,
});
