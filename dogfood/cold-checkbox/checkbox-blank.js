/*
 * Empty checkbox, waiting to be ticked. It draws itself in, then it is pressed: the box dips a few units onto its
 * seat and settles, and a contact line is struck on the ground. Bring the
 * pointer near and the box is pressed under it. In a product: an unticked option on a sign-up form.
 */
const { icon, spring, stepS, register, pointer, disposer, trace, story, clamp, smooth, lerp, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* inspect.mjs, rounded-left: 0 the front rim with the window as an opening, 1 and 2 the window's walls, 3 the
     outer side. The rim faces down-left, so its plane is u and up */
  /* the window is a see-through opening: freeing it with hole() would paint it as a solid face, so the box moves whole */
  const box = ic.part("box", [0, 1, 2, 3]);
  box.hi(true);
  const centre = [181, 175];

  /* the contact line: along v from the frame's lowest corner, on the ground, struck when it is pressed */
  const foot = [232, 272], len = 46;
  const seat = trace(svg, { tone: "hi", under: true });
  const seatLine = [foot, [foot[0] + ic.v[0] * len, foot[1] + ic.v[1] * len]];

  const life = story(stage, {
    rest: { press: 0, ink: 1 },
    poster: { press: 1, ink: 1 },
    intro: { dur: 3000, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 900 },
      { dur: 380, to: { press: [1.08, 1] }, ease: "out" }, // pressed, a hair past, and it settles
      { dur: 1200 },
      { dur: 900, to: { press: 0 } },                      // it comes back up, softer
      { dur: 900 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const loop = register(stage, (dt) => {
    const a = life.step(dt), b = stepS(hand, dt);
    const v = life.values(life.held ? { press: hand.x } : {});
    ic.ink(v.ink);
    box.move(0, 0, -max * v.press);
    seat.draw(seatLine, smooth(0.86, 0.97, v.ink) * clamp(v.press, 0, 1));
    const shown = v.ink < 1 ? "drawing" : v.press < 0.02 ? "rest" : `press ${Math.round(v.press * 100) / 100 >= 0.95 ? "seated" : "…"}`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  const leave = () => { life.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(20, 150, Math.hypot(pt[0] - centre[0], pt[1] - centre[1]));
      if (near <= 0) { leave(); return; }
      if (!life.held) { hand.x = life.values().press; life.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 4, 16); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "checkbox-blank",
  icon: "checkbox-blank",
  variant: "rounded-left",
  means: "An empty checkbox is pressed onto its seat: the box dips onto its seat, settles and comes back, still empty.",
  rules: [5, 8, 9],
  range: [6, 10, 15],
  mount,
});
