/*
 * ABC, sorted. The blocks start out of order (C, A, B) and sort themselves: C steps out
 * behind the row, slides past B and A, A and B shuffle along, C steps back in. A hold,
 * then they shuffle back. Bring the pointer near: the nearer, the further the sort has run.
 * In a product: ordering, "Sort A to Z".
 */
const { icon, spring, stepS, register, pointer, disposer, trace, story, clamp, smooth, lerp, SPRING, after } = IF;

function mount({ stage, svg, read, src }, lane) {
  const bag = disposer();
  const ic = icon(svg, src);
  const A = ic.part("A", [2, 3, 4, 15, 16]);
  const B = ic.part("B", [7, 8, 10, 11, 12, 13, 14]);
  const C = ic.part("C", [0, 1, 5, 6, 9]);
  C.hi(true); // the eye starts on the block that travels
  after(B, A); // B is nearer than A along u whenever they meet, so B always paints over A

  const SLOT = 85; // centre to centre along u, in stage units
  const uu = ic.u, vv = ic.v;
  /* where each block's track runs: the middle of its front foot, set a little forward */
  const foot = { A: [104, 169], B: [178, 211], C: [252, 253] }, S = 6;
  const track = trace(svg, { tone: "hi", under: true });
  const wake = (name, from, to, b) => {
    const f = foot[name], q = (p) => [f[0] + uu[0] * p + vv[0] * (b + S), f[1] + uu[1] * p + vv[1] * (b + S)];
    return Math.abs(from - to) < 1 ? [] : [q(from), q(to)];
  };

  const sort = story(stage, {
    rest: { s: 1, ink: 1 },
    poster: { s: 0.5, ink: 1 }, // mid-sort: C is out behind the row, B passing it
    intro: { dur: 4200, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 900 },
      { dur: 1500, to: { s: 0 } },   // they shuffle out of order
      { dur: 700 },
      { dur: 2200, to: { s: 1 } },   // and sort themselves
      { dur: 1500 },
    ],
  });
  const hand = spring(1, SPRING.hand);
  let reach = lane, label = "", front = true;

  const loop = register(stage, (dt) => {
    const a = sort.step(dt), b = stepS(hand, dt);
    const v = sort.values(sort.held ? { s: hand.x } : {});
    ic.ink(v.ink);
    const s = clamp(v.s, 0, 1), e = smooth(0.25, 0.75, s);
    const step = smooth(0, 0.3, s) * (1 - smooth(0.7, 1, s)) * reach; // C steps out behind the row and back in
    const pa = SLOT * (1 - e), pb = SLOT + SLOT * (1 - e), pc = 2 * SLOT * e;
    A.move(pa, 0, 0); B.move(pb - SLOT, 0, 0); C.move(pc - 2 * SLOT, -step, 0);
    /* C is behind both while it passes; it paints over B only once it has cleared it along u */
    const nowFront = e > 0.97;
    if (nowFront !== front) { if (nowFront) after(C, B); else { after(A, C); after(B, A); } front = nowFront; }
    const tail = smooth(0.8, 1, s);
    track.draw([
      wake("A", lerp(SLOT, 0, tail), pa, 0),
      wake("B", lerp(SLOT, 0, tail), pb - SLOT, 0),
      wake("C", lerp(-2 * SLOT, 0, tail), pc - 2 * SLOT, -step),
    ].filter((l) => l.length));
    const shown = v.ink < 1 ? "drawing" : s > 0.995 ? "rest" : s < 0.005 ? "C A B" : `sort ${s < 0.5 ? "C A B" : "A B C"}`.slice(0, 8);
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  const leave = () => { sort.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(10, 110, ic.near(pt).d);
      if (near <= 0) { leave(); return; }
      if (!sort.held) { hand.x = sort.values().s; sort.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));
  bag.add(() => { loop.unregister(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { reach = clamp(v, 40, 90); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "abc",
  icon: "abc",
  variant: "rounded-left",
  means: "Three letter blocks sort themselves: C steps out behind the row, slides past, and A B C settle in order.",
  rules: [1, 2, 3, 5],
  range: [56, 64, 80],
  mount,
});
