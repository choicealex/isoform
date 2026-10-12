/*
 * Token. It draws itself in, then the token is metered out: the chip lifts clear of its seat, holds
 * a beat, and drops back with a hair of overshoot. Bring the pointer near the chip and it rises
 * toward you, the nearer the higher. In a product: one unit of usage counted, billed per token.
 */
const { icon, spring, stepS, register, pointer, disposer, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* inspect.mjs rounded-left: 1, 3, 7 are the chip (front, top, right side); everything else is the housing it sits in.
     Lifting it straight up leaves no hole (look.mjs checked); sliding it along u did. */
  const chip = ic.part("chip", [1, 3, 7]);
  ic.part("housing", [0, 8, 4, 9, 5, 6, 2, 10, 11]);
  chip.hi(true); // the eye starts at the chip

  const life = story(stage, {
    rest: { lift: 0, ink: 1 },
    poster: { lift: 1, ink: 1 },
    intro: { dur: 2400, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 800 },
      { dur: 900, to: { lift: 1 } },                          // metered out of its seat
      { dur: 1000 },
      { dur: 450, to: { lift: [-0.04, 0] }, ease: "out" },   // counted: it drops home, a hair past
      { dur: 1000 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";
  const seat = chip.rest;

  const loop = register(stage, (dt) => {
    const a = life.step(dt), b = stepS(hand, dt);
    const v = life.values(life.held ? { lift: hand.x } : {});
    ic.ink(v.ink);
    const g = v.lift * max;
    chip.move(0, 0, g);
    const shown = v.ink < 1 ? "drawing" : Math.abs(g) < 0.3 ? "rest" : `lift ${Math.round(g)}`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  /* nearness to the chip's rest centre lifts it (rule 01: the rest shape, never where it is drawn) */
  const leave = () => { life.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(20, 140, Math.hypot(pt[0] - seat.cx, pt[1] - seat.cy));
      if (near <= 0) { leave(); return; }
      if (!life.held) { hand.x = life.values().lift; life.hold(true); }
      hand.t = near * 0.6;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 22); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "token",
  icon: "token",
  variant: "rounded-left",
  means: "One token is counted: the chip lifts out of its seat, holds, and drops home. Come near and it rises to meet you.",
  rules: [1, 5, 8, 9],
  range: [8, 14, 22],
  mount,
});
