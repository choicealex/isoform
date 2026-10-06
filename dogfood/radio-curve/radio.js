/*
 * Radio button, seated. The dot is a separate disc sitting in the ring's pocket. It draws itself in, then the dot
 * draws out toward you along the ring's axis, holds, and presses back in until it seats: a ring spreads on the
 * rim where it lands. Bring the pointer near and the dot rises a little to meet the hand. In a product: a
 * choice selected. No effect: a symbol has no material of its own to light.
 */
const { icon, spring, stepS, register, pointer, disposer, trace, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  /* Isocons' left view is not true isometric: u down-right, v (toward you) down-left, read off the extrusion edge */
  const ic = icon(svg, src, { u: [0.866, 0.5], v: [-0.94, 0.33] });

  const ring = ic.part("ring", [0, 2]);
  /* the pocket floor the dot was hiding: a copy of the dot set back along v, painted before the ring so the rim covers it */
  ic.face(1, 0, -12, 0, 0);
  const dot = ic.part("dot", [1]);
  dot.hi(true);
  ring.dim(false);

  const c = [dot.rest.cx, dot.rest.cy];
  const r = (dot.rest.x1 - dot.rest.x0) / 2 / Math.abs(ic.u[0]); // the dot's radius along its own axes
  const rim = (k) => ic.iso(0, 0, r * k); // top of the dot's rim, scaled
  /* the dot's two tangent points (its top and its bottom) on the rest box: the rails it travels on */
  const w = dot.rest.x1 - dot.rest.x0, tp = [dot.rest.x0 + 0.29 * w, dot.rest.y0], bp = [dot.rest.x0 + 0.72 * w, dot.rest.y1];
  const rails = trace(svg, { tone: "hi" });
  const seat = trace(svg, { tone: "hi" });
  const ellipse = (k) => Array.from({ length: 49 }, (_, i) => {
    const t = (i / 48) * Math.PI * 2, o = ic.iso(Math.cos(t) * r * k, 0, Math.sin(t) * r * k);
    return [c[0] + o[0], c[1] + o[1]];
  });

  const s = story(stage, {
    rest: { out: 0, ink: 1, seat: 0 },
    poster: { out: 1, ink: 1, seat: 0 },
    intro: { dur: 4200, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 700 },
      { dur: 950, to: { out: 1 } },                          // the dot draws out toward you
      { dur: 1000 },                                          // held out
      { dur: 520, to: { out: [-0.04, 0] }, ease: "out" },    // pressed home, a hair past, and seated
      { dur: 650, to: { seat: 1 }, ease: "out" },            // a ring spreads on the rim
      { dur: 900 },
      { dur: 600, to: { seat: 0 } },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const loop = register(stage, (dt) => {
    const a = s.step(dt), b = stepS(hand, dt);
    const v = s.values(s.held ? { out: hand.x } : {});
    ic.ink(v.ink);
    const g = v.out * max;
    dot.move(0, g, 0);
    const o = ic.iso(0, g, 0), ink = smooth(0.86, 0.97, v.ink);
    rails.draw(g > 1 ? [[tp, [tp[0] + o[0], tp[1] + o[1]]], [bp, [bp[0] + o[0], bp[1] + o[1]]]] : [], ink);
    seat.draw(v.seat > 0.01 ? ellipse(1.28) : [], v.seat);
    const shown = v.ink < 1 ? "drawing" : v.seat > 0.3 ? "seated" : g < 0.4 ? "rest" : `out ${Math.round(g)}`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  const leave = () => { s.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(30, 150, Math.hypot(pt[0] - c[0], pt[1] - c[1]));
      if (near <= 0) { leave(); return; }
      if (!s.held) { hand.x = s.values().out; s.hold(true); }
      hand.t = near * 0.5;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 40); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "radio",
  icon: "radio-button-checked",
  variant: "rounded-left",
  means: "A radio button's dot draws out of its ring, then presses home and seats; a ring spreads where it lands.",
  rules: [1, 3, 5, 6, 9],
  range: [14, 24, 34],
  mount,
});
