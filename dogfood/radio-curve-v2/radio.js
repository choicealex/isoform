/*
 * Radio checked, as a puck. It draws itself in, then selects: the whole ring is pressed in along its axis,
 * springs back, and a ring is struck round the bore. Bring the pointer near and you press it: the nearer, the deeper. In a form: an option chosen.
 */
const { icon, spring, stepS, register, pointer, disposer, trace, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* what the dot hides when it lifts: its own seat, drawn where it sat (rule 06) */
  const dot = ic.part("dot", [1]);
  const ring = ic.part("ring", [0, 2]);
  dot.hi(true);

  const rim = trace(svg, { tone: "hi" });
  const c = [dot.rest.cx, dot.rest.cy];
  const R = 38;
  const circle = (r) => Array.from({ length: 41 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2;
    return [c[0] + r * Math.cos(a) * ic.u[0] / Math.hypot(...ic.u), c[1] + r * (Math.cos(a) * ic.u[1] / Math.hypot(...ic.u) - Math.sin(a))];
  });

  const pick = story(stage, {
    rest: { lift: 0, seat: 0, ink: 1 },
    poster: { lift: 1, seat: 0, ink: 1 },
    intro: { dur: 4000, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 700 },
      { dur: 900, to: { lift: 1 } },
      { dur: 400 },
      { dur: 420, to: { lift: 0 }, ease: "out" },
      { dur: 600, to: { seat: 1 }, ease: "out" },
      { dur: 1200 },
      { dur: 700, to: { seat: 0 } },
      { dur: 700 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const loop = register(stage, (dt) => {
    const a = pick.step(dt), b = stepS(hand, dt);
    const v = pick.values(pick.held ? { lift: hand.x, seat: 0 } : {});
    ic.ink(v.ink);
    const l = v.lift * max;
    dot.move(0, -l, 0); ring.move(0, -l, 0); // the whole puck is pressed in along v, nothing is left behind
    const o = ic.iso(0, -l, 0);
    const s = smooth(0.0, 1, v.seat);
    rim.draw(s > 0.01 ? [circle(R + 6 * s).map((q) => [q[0] + o[0], q[1] + o[1]])] : [], smooth(0.86, 0.97, v.ink) * Math.min(1, s * 1.5));
    const shown = v.ink < 1 ? "drawing" : v.seat > 0.05 ? "selected" : l > 0.5 ? `press ${Math.round(l)}` : "rest";
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  const leave = () => { pick.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(20, 130, Math.hypot(pt[0] - c[0], pt[1] - c[1]));
      if (near <= 0) { leave(); return; }
      if (!pick.held) { hand.x = pick.values().lift; pick.hold(true); }
      hand.t = near;
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
  means: "A radio button selects: the puck is pressed in along its axis, springs back, and a ring is struck round the bore. Hover presses it.",
  rules: [1, 3, 6, 11],
  range: [10, 18, 28],
  mount,
});
