/*
 * Shopping cart. It draws itself in, then something is added: a box draws on above
 * the basket, drops in, the cart dips under its weight and rolls on a step, then rolls
 * home. Bring the pointer near and you lower the box in yourself: the nearer, the
 * deeper. In a product: added to cart.
 */
const { icon, spring, stepS, register, pointer, disposer, trace, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* paint order as Isocons drew it: both wheels' end faces first, then body, handle; the wheels go under the body */
  const wheels = ic.part("wheels", [0, 6, 7, 8, 9], { paint: "first" });
  const body = ic.part("body", [1, 2, 3, 5]);
  const grip = ic.part("handle", [4]);
  const all = [wheels, body, grip];
  grip.hi(true); // the eye starts at the handle, where the hand pushes

  /* the box: a small block drawn as its three seen faces (top, +u, +v), over the cart. Only what is above the
     basket's opening is drawn: as it falls it is cut off at the rim plane, so it sinks INTO the basket */
  const rim = [232, 136]; // the middle of the basket's opening (face 3), read off the parts picture
  const S = 9, H = 16, DROP = 70;
  const box = trace(svg, { tone: "edge", solid: true }); // it hides the far rim as it falls past
  const at = (o, x, y, z) => { const d = ic.iso(x, y, z); return [o[0] + d[0], o[1] + d[1]]; };
  /* z0: the box's base above the rim; below the rim it is inside, unseen */
  const block = (o, z0) => {
    const a = Math.max(z0, 0), b = z0 + H;
    if (b <= 0.2) return [];
    return [
      [at(o, -S, -S, b), at(o, S, -S, b), at(o, S, S, b), at(o, -S, S, b), at(o, -S, -S, b)],
      [at(o, S, -S, a), at(o, S, S, a), at(o, S, S, b), at(o, S, -S, b), at(o, S, -S, a)],
      [at(o, -S, S, a), at(o, S, S, a), at(o, S, S, b), at(o, -S, S, b), at(o, -S, S, a)],
    ];
  };

  const cart = story(stage, {
    rest: { box: 0, drop: 0, dip: 0, roll: 0, ink: 1 },
    poster: { box: 1, drop: 0.55, dip: 0, roll: 0, ink: 1 },
    intro: { dur: 4800, from: { ink: 0 }, ease: "linear" }, // it draws itself in, once, the first time it is seen
    beats: [
      { dur: 700 },
      { dur: 600, to: { box: 1 }, ease: "out" },          // a box is drawn above the basket
      { dur: 300 },
      { dur: 550, to: { drop: 1 }, ease: "in" },          // it falls in
      { dur: 500, to: { dip: [1, 0] }, ease: "out" },     // the cart dips under the weight
      { dur: 300 },
      { dur: 1200, to: { roll: 1 } },                     // and rolls on a step
      { dur: 900 },
      { dur: 1300, to: { roll: 0 } },                     // home
      { dur: 20, to: { box: 0, drop: 0 }, ease: "linear" }, // out of sight in the basket: ready for the next one
      { dur: 600 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const loop = register(stage, (dt) => {
    const a = cart.step(dt), b = stepS(hand, dt);
    const v = cart.values(cart.held ? { box: 1, drop: 0.3 + 0.62 * hand.x, dip: 0, roll: 0 } : {}) // held: the box hangs, half in at the nearest;
    ic.ink(v.ink);
    const x = v.roll * max, sink = v.dip * 2.5;
    for (const p of all) p.move(x, 0, -sink);
    const o = at(rim, x, 0, -sink);
    box.draw(v.box < 0.02 ? [] : block(o, DROP * (1 - v.drop) - (H + 2) * v.drop), v.box);
    const shown = v.ink < 1 ? "drawing" : v.box < 0.02 ? "rest" : v.drop < 0.98 ? "adding" : x > 0.5 ? `added · roll ${Math.round(x)}` : "added";
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  /* hover takes over: nearness to the basket's rest centre lowers the box in (rule 01) */
  const c = [body.rest.cx, body.rest.cy];
  const leave = () => { cart.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(25, 150, Math.hypot(pt[0] - c[0], pt[1] - c[1]));
      if (near <= 0) { leave(); return; }
      if (!cart.held) { const w = cart.values(); hand.x = w.box > 0.5 ? clamp((w.drop - 0.3) / 0.62, 0, 1) : 0; cart.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 20); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "shopping-cart",
  icon: "shopping-cart",
  variant: "rounded-left",
  means: "A box drops into a shopping cart; it dips under the weight and rolls on a step. Come near to lower the box in.",
  rules: [1, 3, 6, 11],
  range: [6, 10, 16],
  mount,
});
