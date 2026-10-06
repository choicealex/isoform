/*
 * Storefront. It draws itself in, then opens for the day: the awning is drawn out on its arms over the
 * pavement, holds, and folds back in. Bring the pointer near the awning and you draw it further out.
 * In a product: "open your store".
 */
const { icon, after, spring, stepS, register, pointer, disposer, gl, trace, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src); // default placement: inspect.mjs's points are this figure's points

  /* face 3 is the whole front, awning band and wall in one path: cut it along u under the awning's scallops */
  const cutAt = [227, 194];
  const [band, wall] = ic.cut(3, cutAt, "u");
  const awning = ic.part("awning", [band, 4, 1, 0]);
  ic.face(band, 0, 0, 0, awning); // the wall the awning was hiding (rule 06)
  const shop = ic.part("shop", [wall, 2, 6]);
  const roof = ic.part("roof", [5]);
  after(awning, shop); // the awning comes forward of the wall
  awning.hi(true);

  const tr = trace(svg, { tone: "hi" });
  const slope = ic.u[1] / ic.u[0];
  const lineY = (x) => cutAt[1] + slope * (x - cutAt[0]);

  const open = story(stage, {
    rest: { out: 0, ink: 1 },
    poster: { out: 1, ink: 1 },
    intro: { dur: 5400, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 700 },
      { dur: 1100, to: { out: 1 } },
      { dur: 1700 },
      { dur: 900, to: { out: 0 } },
      { dur: 1200 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const loop = register(stage, (dt) => {
    const a = open.step(dt), b = stepS(hand, dt);
    const v = open.values(open.held ? { out: hand.x } : {});
    ic.ink(v.ink);
    const g = v.out * max;
    awning.move(0, g, 0);
    const [dx, dy] = ic.iso(0, g, 0);
    const lines = [];
    if (g > 0.5) for (const x of [140, 205]) {
      const top = [x, lineY(x) - 22];
      lines.push([top, [x + dx, lineY(x) + dy]]);
    }
    tr.draw(lines, smooth(0.86, 0.97, v.ink));
    const shown = v.ink < 1 ? "drawing" : g < 0.3 ? "rest" : `awning +${Math.round(g)}`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  const leave = () => { open.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(10, 110, Math.hypot(pt[0] - 182, pt[1] - 150));
      if (near <= 0) { leave(); return; }
      if (!open.held) { hand.x = open.values().out; open.hold(true); }
      hand.t = near;
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
  means: "A shopfront opens for the day: the awning is drawn out on its arms over the pavement, holds, folds back.",
  rules: [1, 3, 6, 11],
  range: [6, 12, 20],
  mount,
});
