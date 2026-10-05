/*
 * Shield lock. It draws itself in, then unlatches: the shackle springs up out of
 * the lock body, its two legs drawn out of the hole, holds open, and clicks shut.
 * Bring the pointer near the lock and you ease the shackle up. In a product:
 * access, granted.
 */
const { icon, spring, stepS, register, pointer, disposer, trace, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src);
  const shackle = ic.part("shackle", [1, 2, 3]);
  shackle.hi(true);
  const lock = shackle.rest;

  const legs = trace(svg, { tone: "hi" });
  /* the shackle's feet at rest (stage points read off the look): lifted, its legs are drawn out of the body down to here */
  const [fx, fy] = ic.iso(0, 0, -9); // read off a frame lifted by 9, so drop to rest
  const feet = [[165.6, 151.6], [189.4, 165], [197.5, 160.9]].map(([x, y]) => [x + fx, y + fy]);
  let max = reach, label = "";

  const latch = story(stage, {
    rest: { lift: 0, ink: 1 },
    poster: { lift: 1, ink: 1 },
    intro: { dur: 5400, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 800 },
      { dur: 600, to: { lift: [1.12, 1] }, ease: "out" },
      { dur: 1700 },
      { dur: 380, to: { lift: [-0.05, 0] }, ease: "out" },
      { dur: 1500 },
    ],
  });
  const hand = spring(0, SPRING.hand);

  const loop = register(stage, (dt) => {
    const a = latch.step(dt), b = stepS(hand, dt);
    const v = latch.values(latch.held ? { lift: hand.x } : {});
    ic.ink(v.ink);
    const g = v.lift * max;
    shackle.move(0, 0, g);
    const [dx, dy] = ic.iso(0, 0, g);
    legs.draw(g < 0.6 ? [] : feet.map(([x, y]) => [[x, y], [x + dx, y + dy]]), smooth(0.86, 0.97, v.ink));
    const shown = v.ink < 1 ? "drawing" : g < 0.3 ? "rest" : `shackle +${Math.round(g)}`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  const leave = () => { latch.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(14, 110, Math.hypot(pt[0] - lock.cx, pt[1] - lock.cy));
      if (near <= 0) { leave(); return; }
      if (!latch.held) { hand.x = latch.values().lift; latch.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 24); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "shield-lock",
  icon: "shield-lock",
  variant: "rounded-left",
  means: "A shield with a padlock unlatches: the shackle springs up, holds, and clicks shut. Come near the lock to ease it up.",
  rules: [1, 3, 5, 8],
  range: [8, 12, 18],
  mount,
});
