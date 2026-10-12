/*
 * Delete. It draws itself in, then the X is punched out of its plate: it slides straight out of the front along its
 * own depth, holds clear of the plate, and is pressed back in. A path line draws on to show where it went. Bring the
 * pointer near the X and it stands proud of the plate, the nearer the further. In a product: a file being removed.
 */
const { icon, spring, stepS, register, pointer, disposer, trace, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src); // default placement: inspect.mjs's points are this figure's points

  /* inspect.mjs, rounded-left: 2 the plate's front, with the X as an opening in it; 3-7 the X's own walls and arms;
     0, 1, 8, 9, 10 the plate's top, side and edge. The front faces down-left, so its depth runs along v */
  const opening = ic.hole(2);
  const plate = ic.part("plate", [2, 0, 1, 8, 9, 10]);
  const mark = ic.part("mark", [...opening, 3, 4, 5, 6, 7]);
  mark.hi(true); // the eye starts at the X

  const centre = [180, 178];
  const path = trace(svg, { tone: "hi", free: true });

  const life = story(stage, {
    rest: { out: 0, ink: 1 },
    poster: { out: 0.8, ink: 1 },
    intro: { dur: 3000, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 800 },
      { dur: 800, to: { out: 1 } },                      // the X slides out of the plate
      { dur: 1400 },                                      // held clear
      { dur: 700, to: { out: [-0.06, 0] }, ease: "out" }, // pressed back in, a hair past, settled
      { dur: 1100 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const loop = register(stage, (dt) => {
    const a = life.step(dt), b = stepS(hand, dt);
    const v = life.values(life.held ? { out: hand.x } : {});
    ic.ink(v.ink);
    const d = v.out * max;
    mark.move(0, d, 0);
    /* the line the X travelled, from its seat on the plate to where it is now; it draws on as the X leaves */
    const from = ic.pt(centre[0], centre[1]);
    const to = [from[0] + ic.v[0] * max * 1.0, from[1] + ic.v[1] * max * 1.0];
    path.draw(v.out > 0.02 ? [from, to] : [], smooth(0.86, 0.97, v.ink) * clamp(v.out, 0, 1));
    const shown = v.ink < 1 ? "drawing" : d < 0.3 ? "rest" : `out ${Math.round(d)}`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  const leave = () => { life.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(14, 120, Math.hypot(pt[0] - centre[0], pt[1] - centre[1]));
      if (near <= 0) { leave(); return; }
      if (!life.held) { hand.x = life.values().out; life.hold(true); }
      hand.t = near * 0.6;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 24); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "delete",
  icon: "delete",
  variant: "rounded-left",
  means: "The X is punched out of its plate, held clear, and pressed back in: a thing removed.",
  rules: [1, 3, 5, 6],
  range: [6, 10, 16],
  mount,
});
