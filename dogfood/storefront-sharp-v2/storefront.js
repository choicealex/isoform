/*
 * Storefront. It draws itself in, then opens for the day: the awning is pushed out over the pavement,
 * its shade line drawn on the wall under it, it holds, and rolls back. Bring the pointer near the awning and
 * you pull it out further. In a product: "open your store".
 */
const { icon, spring, stepS, register, pointer, disposer, trace, story, clamp, smooth, SPRING, after } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src); // default placement: inspect.mjs's points are this figure's points

  /* the awning is the top band of the front wall plus the canopy faces; cut the wall along u under the scallops */
  const cutAt = [231, 192];
  const [band, wall] = ic.cut(3, cutAt, "u");
  /* what the canopy was covering: copies of its faces left at rest, under it, so moving it opens no hole (rule 06) */
  const awning = ic.part("awning", [band, 0, 1, 4, 5, 6]);
  const lower = ic.part("wall", [wall, 2]);
  awning.hi(true);

  const shade = trace(svg, { tone: "hi" });
  /* the shade line: the awning's lower edge as the cut line, run along u across the wall */
  const ux = ic.u[0], uy = ic.u[1];

  const open = story(stage, {
    rest: { out: 0, ink: 1, shade: 0 },
    poster: { out: 1, ink: 1, shade: 1 },
    intro: { dur: 5400, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 700 },
      { dur: 1100, to: { out: 1 } },
      { dur: 700, to: { shade: 1 } },
      { dur: 1500 },
      { dur: 600, to: { shade: 0 } },
      { dur: 900, to: { out: 0 } },
      { dur: 800 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const loop = register(stage, (dt) => {
    const a = open.step(dt), b = stepS(hand, dt);
    const v = open.values(open.held ? { out: hand.x, shade: hand.x } : {});
    ic.ink(v.ink);
    const d = v.out * max;
    awning.move(0, d, 0);
    const [sx, sy] = ic.iso(0, d, 0);
    const p = (k) => [cutAt[0] + ux * k, cutAt[1] + uy * k + sy + 8]; // on the wall, just under the awning's edge
    shade.draw(v.shade > 0.01 ? [[p(-100), p(-6)]] : [], smooth(0.86, 0.97, v.ink) * v.shade);
    const shown = v.ink < 1 ? "drawing" : d < 0.3 ? "rest" : `out ${Math.round(d)}`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  const leave = () => { open.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(10, 110, Math.hypot(pt[0] - awning.rest.cx, pt[1] - awning.rest.cy));
      if (near <= 0) { leave(); return; }
      if (!open.held) { hand.x = open.values().out; open.hold(true); }
      hand.t = clamp(0.3 + near * 0.7, 0, 1);
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 24); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "storefront",
  icon: "storefront",
  variant: "sharp-left",
  means: "A shop opens for the day: its awning is pushed out over the pavement, a shade line falls on the wall, then it rolls back.",
  rules: [1, 3, 6],
  range: [6, 10, 16],
  mount,
});
