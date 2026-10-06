/*
 * Toggle. It draws itself in, then the switch is thrown: the knob slides the length of its track to the
 * other end, rests there, and comes back to its seat with a hair of overshoot, leaving a line along the
 * track where it travelled. Bring the pointer near the knob and it leans toward the other end, a few units.
 * In a product: a setting that takes effect.
 */
const { icon, spring, stepS, register, pointer, disposer, trace, story, clamp, smooth, SPRING } = IF;

const TRAVEL = 104; // seat to seat along v, in stage units (the knob's centre to its mirror about the track's centre)
const HALF = 30;    // the knob's half length along v

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  /* sharp-right: the long axis of the pill runs along v, so the knob slides along v, not u */
  const ic = icon(svg, src);
  const knob = ic.part("knob", [2]);
  ic.face(2, 0, 0, 0, knob); // the socket the knob leaves: the track's face shows through its seat, so no empty outline
  knob.hi(true); // the eye starts at the knob

  const wake = trace(svg, { tone: "edge" }); // the path the knob travelled, a solid line that draws on and retracts
  const c0 = [knob.rest.cx, knob.rest.cy];

  const flip = story(stage, {
    rest: { x: 0, ink: 1 },
    poster: { x: 0.62, ink: 1 },
    intro: { dur: 2800, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 900 },
      { dur: 1100, to: { x: 1 } },                           // thrown to the other end
      { dur: 1300 },                                          // held
      { dur: 800, to: { x: [-0.03, 0] }, ease: "out" },      // back onto its seat, a hair past, and settle
      { dur: 1200 },
    ],
  });
  const hand = spring(0, SPRING.settle);
  let max = reach, label = "";

  const loop = register(stage, (dt) => {
    const a = flip.step(dt), b = stepS(hand, dt);
    const v = flip.values(flip.held ? { x: hand.x } : {});
    ic.ink(v.ink);
    const slide = v.x * TRAVEL;
    knob.move(0, slide, 0);
    const len = slide - HALF;
    if (len < 1) wake.draw([]);
    else wake.draw([c0, [c0[0] + ic.v[0] * len, c0[1] + ic.v[1] * len]], smooth(0.86, 0.97, v.ink));
    const shown = v.ink < 1 ? "drawing" : slide < 0.3 ? "rest" : v.x > 0.97 ? "off end" : `slide ${Math.round(slide)}`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  /* hover takes over: nearness to the knob's rest position leans it toward the other end (rule 01) */
  const leave = () => { flip.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(14, 120, Math.hypot(pt[0] - c0[0], pt[1] - c0[1]));
      if (near <= 0) { leave(); return; }
      if (!flip.held) { hand.x = flip.values().x; flip.hold(true); }
      hand.t = (near * max) / TRAVEL;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 40); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "toggle",
  icon: "toggle-on",
  variant: "sharp-right",
  means: "A switch is thrown: the knob slides to the other end of its track, rests, and returns to its seat.",
  rules: [1, 3, 8],
  range: [6, 12, 24],
  mount,
});
