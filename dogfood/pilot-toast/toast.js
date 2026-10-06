/*
 * Toast. It draws itself in, then the notification grows: the bar at the foot of the screen rises within the screen's
 * own plane, holds open as a panel, and settles back to a bar. Bring the pointer near and it opens toward you: the
 * nearer, the taller. In a product: a notification arriving, "you have a message".
 */
const { icon, spring, stepS, register, pointer, disposer, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* inspect.mjs, rounded-left: 0 the screen's front, with the bar as an opening in it; 1 the opening's inner wall; 2 the
     screen's side. The screen faces down-left, so its plane is u (across) and up. The opening becomes a face of its own */
  const [opening] = ic.hole(0);
  ic.part("screen", [0, 2], { paint: "first" });
  const bar = ic.part("bar", [opening, 1]);
  bar.hi(true); // the eye starts at the bar
  /* it grows from its foot, the opening's lower edge (measured in the screen's plane: up from -130, the screen to -15) */
  const foot = [180, 221];

  const life = story(stage, {
    rest: { open: 0, ink: 1 },
    poster: { open: 1, ink: 1 },
    intro: { dur: 3000, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 1000 },
      { dur: 700, to: { open: [1.06, 1] }, ease: "out" }, // it arrives: rises, a hair past, and settles
      { dur: 1800 },
      { dur: 600, to: { open: 0 } },                       // and goes, softer than it came
      { dur: 900 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const loop = register(stage, (dt) => {
    const a = life.step(dt), b = stepS(hand, dt);
    const v = life.values(life.held ? { open: hand.x } : {});
    ic.ink(v.ink);
    /* taller along up, a touch wider along u, all within the screen's plane */
    bar.stretch(1 + 0.06 * v.open, 1 + (max - 1) * v.open, "u-up", foot);
    const shown = v.ink < 1 ? "drawing" : v.open < 0.02 ? "rest" : `open ${Math.round(v.open * 100)}%`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  const leave = () => { life.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(30, 160, Math.hypot(pt[0] - bar.rest.cx, pt[1] - bar.rest.cy));
      if (near <= 0) { leave(); return; }
      if (!life.held) { hand.x = life.values().open; life.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 5.4); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "toast",
  icon: "toast",
  variant: "rounded-left",
  means: "A notification arrives: the bar at the foot of the screen rises into a panel, holds, and settles back.",
  rules: [3, 5, 9],
  range: [2, 3.5, 5],
  mount,
});
