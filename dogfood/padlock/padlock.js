/*
 * Key, unlocking. It draws itself in, then the key slides home into its plug, a trace of
 * the lock's cylinder; the plug turns (a mark sweeps round its rim), turns back, and the
 * key withdraws. Bring the pointer near and you turn it by hand: the nearer, the
 * further. In a product: access granted.
 */
const { icon, spring, stepS, register, pointer, disposer, trace, story, clamp, smooth, rad, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src, { cx: 170, cy: 150, h: 200 });
  const key = ic.part("key", [0, 1, 2, 3]);
  key.hi(true);

  /* the lock's plug: a circle on the plane the blade enters (spanned by v and up), a hair beyond the blade's end */
  const end = ic.pt(296, 248);
  const C = [end[0] + ic.iso(14, 0, 0)[0], end[1] + ic.iso(14, 0, 0)[1]];
  const R = 32;
  const ringPt = (a, r = R) => { const d = ic.iso(0, r * Math.cos(a), r * Math.sin(a)); return [C[0] + d[0], C[1] + d[1]]; };
  const ring = trace(svg, { tone: "edge", under: true });
  ring.draw([Array.from({ length: 49 }, (_, i) => ringPt((i / 48) * Math.PI * 2))]);
  /* the turn is told on the lock, not by the key: flat faces turned about the blade would stop being a solid (rule 09).
     A mark on the plug's rim sweeps round from A0; the key itself only slides */
  const A0 = -Math.PI / 2 + 0.6; // the first clear point of the rim below the blade
  const arc = trace(svg, { tone: "edge" }); // how far the plug has turned, along the rim
  const mark = trace(svg, { tone: "edge" }); // the plug's mark, across the rim

  const unlock = story(stage, {
    rest: { slide: 0, turn: 0, ink: 1 },
    poster: { slide: 1, turn: 1, ink: 1 },
    intro: { dur: 5400, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 600 },
      { dur: 900, to: { slide: 1 } },                 // the key goes home
      { dur: 400 },
      { dur: 1100, to: { turn: [1.05, 1] }, ease: "out" }, // the plug turns, a hair past, and settles at the stop
      { dur: 900 },                                   // unlocked
      { dur: 800, to: { turn: 0 } },                  // back
      { dur: 800, to: { slide: 0 } },                 // out
      { dur: 700 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const loop = register(stage, (dt) => {
    const a = unlock.step(dt), b = stepS(hand, dt);
    const v = unlock.values(unlock.held ? { ink: 1, slide: smooth(0, 0.5, hand.x), turn: smooth(0.5, 1, hand.x) } : {});
    ic.ink(v.ink);
    const s = clamp(v.slide, 0, 1.1) * 12, deg = clamp(v.turn, 0, 1.1) * max;
    key.move(s, 0, 0);
    const reveal = smooth(0.86, 0.97, v.ink);
    ring.draw([Array.from({ length: 49 }, (_, i) => ringPt((i / 48) * Math.PI * 2))], reveal);
    const sweep = rad(deg);
    arc.draw(sweep > 0.02 ? [Array.from({ length: 17 }, (_, i) => ringPt(A0 - (i / 16) * sweep, R + 5))] : []);
    mark.draw([[ringPt(A0 - sweep, R - 5), ringPt(A0 - sweep, R + 5)]], reveal);
    const shown = v.ink < 1 ? "drawing" : deg < 0.3 && s < 0.3 ? "rest" : deg < 0.3 ? `in ${Math.round(s)}` : `turn ${Math.round(deg)}°`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  const leave = () => { unlock.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(20, 140, Math.hypot(pt[0] - key.rest.cx, pt[1] - key.rest.cy));
      if (near <= 0) { leave(); return; }
      if (!unlock.held) { const w = unlock.values(); hand.x = 0.5 * w.slide + 0.5 * w.turn; unlock.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));
  bag.add(() => { loop.unregister(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 90); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "padlock",
  icon: "key",
  variant: "rounded-left",
  means: "A key slides into its lock, turns the plug to the stop with a click, and withdraws. Come near to turn it yourself.",
  rules: [1, 3, 5, 6],
  range: [45, 70, 90],
  mount,
});
