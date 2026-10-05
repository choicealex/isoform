/*
 * Cart: push (restored, owner's pick: the first version, its drawn dust and subtle grit). Shopping cart. It draws
 * itself in, then is pushed: it rolls a few units along its own
 * wheel line, wheels kicking up a scuff of dust behind, coasts to a stop, rocks onto its
 * rear wheels, and rolls home. Bring the pointer near and you push it: the nearer, the
 * farther it rolls. In a product: a purchase on its way, a basket in motion.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, trace, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* paint order as Isocons drew it: both wheels' end faces first, then body, handle; the wheels go under the body */
  const wheels = ic.part("wheels", [0, 6, 7, 8, 9], { paint: "first" });
  const body = ic.part("body", [1, 2, 3, 5]);
  const grip = ic.part("handle", [4]);
  const all = [wheels, body, grip];
  grip.hi(true); // the eye starts at the handle, where the hand pushes

  /* the ground contacts, read off the parts picture */
  const feet = [[164, 238], [228, 271]];
  const back = ic.iso(-1, 0, 0); // one unit of rolling backward, on screen: where the dust trails
  const bl = Math.hypot(back[0], back[1]);
  const dir = [back[0] / bl, back[1] / bl];

  const dust = trace(svg, { tone: "edge", under: true }); // scuff lines on the ground behind the wheels

  const roll = story(stage, {
    rest: { roll: 0, dust: 0, ink: 1 },
    poster: { roll: 0.7, dust: 1, ink: 1 },
    intro: { dur: 4800, from: { ink: 0 }, ease: "linear" }, // it draws itself in, once, the first time it is seen
    beats: [
      { dur: 700 },
      { dur: 1300, to: { roll: 1, dust: [1, 1, 0.9] } },   // pushed off, kicking dust up behind
      { dur: 500, to: { dust: 0 }, ease: "out" },       // stopped, the dust settles
      { dur: 400 },
      { dur: 1500, to: { roll: 0, dust: -0.5 } },          // rolls home, softer, scuffing the other way
      { dur: 400, to: { dust: 0 }, ease: "out" },
      { dur: 900 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const fx = gl(stage, {
    layer: "under",
    uniforms: { u_a: "vec2", u_b: "vec2", u_dir: "vec2", u_k: "float" },
    frag: `
      // the scuff the wheels kick up behind them: grit along the ground, in the figure's own line colour
      vec4 effect(vec2 p) {
        if (u_k < 0.03) return vec4(0.0);
        float d = 0.0;
        for (int i = 0; i < 2; i++) {
          vec2 c = i == 0 ? u_a : u_b;
          vec2 q = p - c - u_dir * (8.0 + 14.0 * u_k);
          vec2 g = vec2(dot(q, u_dir) / (16.0 + 22.0 * u_k), (q.x * -u_dir.y + q.y * u_dir.x) / 5.0);
          d += smoothstep(1.0, 0.1, length(g)) * smoothstep(0.35, 0.75, fbm(p * 0.09 - u_dir * u_time * 1.5));
        }
        float a = clamp(d, 0.0, 1.0) * 0.35 * smoothstep(0.03, 0.4, u_k);
        return vec4(u_line * a, a);
      }`,
  });
  if (fx.on) { fx.set("u_a", feet[0]); fx.set("u_b", feet[1]); fx.set("u_dir", dir); }

  const loop = register(stage, (dt, now) => {
    const a = roll.step(dt), b = stepS(hand, dt);
    const v = roll.values(roll.held ? { roll: hand.x, dust: smooth(0.3, 1, hand.x), ink: 1 } : {});
    ic.ink(v.ink);
    const x = v.roll * max;
    const sp = Math.abs(v.dust), rock = clamp(v.dust * -2.5, -3, 3); // the cart tips back as it pulls away
    for (const p of all) p.move(x, 0, 0).tilt(rock, [feet[1][0] + ic.iso(x, 0, 0)[0], feet[1][1]]);
    /* scuff lines behind each wheel, solid, drawing on and retracting with the speed */
    const lead = ic.iso(x, 0, 0), sgn = Math.sign(v.dust) || 1;
    dust.draw(sp < 0.03 ? [] : feet.flatMap(([fx0, fy0]) => [0, 1].map((r) => {
      const o = 6 + r * 5, l = 8 + 12 * sp;
      const s = [fx0 + lead[0] + dir[0] * o * sgn, fy0 + lead[1] + dir[1] * o * sgn + 1 + r * 2];
      return [s, [s[0] + dir[0] * l * sgn, s[1] + dir[1] * l * sgn]];
    })), smooth(0.03, 0.4, sp));
    const shown = v.ink < 1 ? "drawing" : Math.abs(x) < 0.3 && sp < 0.03 ? "rest" : `roll ${Math.round(x)}`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    if (fx.on) { fx.set("u_k", sp); fx.set("u_dir", [dir[0] * sgn, dir[1] * sgn]); fx.draw(now); }
    return a || b || sp > 0.03;
  });

  /* hover takes over: nearness to the cart's rest centre is the push (rule 01) */
  const c = [body.rest.cx, body.rest.cy];
  const leave = () => { roll.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(25, 150, Math.hypot(pt[0] - c[0], pt[1] - c[1]));
      if (near <= 0) { leave(); return; }
      if (!roll.held) { hand.x = roll.values().roll; roll.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 30); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "cart-push",
  icon: "shopping-cart",
  variant: "rounded-left",
  means: "A shopping cart is pushed off: it rolls along its wheels, scuffing dust, stops, and rolls home. Come near to push it.",
  effect: "grit scuffed up behind the wheels on the ground as the cart rolls",
  rules: [1, 3, 11],
  range: [8, 14, 22],
  mount,
});
