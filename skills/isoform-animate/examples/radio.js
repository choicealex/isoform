/*
 * Radio button, partly chosen. It draws itself in, then it is pressed: the dial swells in its own plane and settles,
 * then the half-moon in it makes a full turn, like a dial being set, and lands where it was drawn. Bring the pointer
 * near and the dial swells under it and the half-moon turns toward it. In a product: an option being chosen.
 */
const { icon, spring, stepS, register, pointer, disposer, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* inspect.mjs, rounded-left: 0 the dial's front, with the half-moon as an opening in it; 1 the dial's side; 2 the
     half-moon's recess. The dial faces down-left (its side band runs along v), so its plane is u and up */
  const [cutout] = ic.hole(0);
  const dial = ic.part("dial", [0, 1], { paint: "first" });
  const moon = ic.part("moon", [cutout, 2]);
  moon.hi(true); // the eye starts at the half-moon
  /* the half-moon's straight edge runs through the dial's centre, read off the parts picture */
  const centre = [180, 176];

  const life = story(stage, {
    rest: { swell: 0, turn: 0, ink: 1 },
    poster: { swell: 0, turn: 0.3, ink: 1 },
    intro: { dur: 3000, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 900 },
      { dur: 450, to: { swell: [1, -0.15, 0] }, ease: "out" }, // pressed: it swells and settles, a hair under
      { dur: 300 },
      { dur: 1500, to: { turn: 1 } },                           // the half-moon turns once round
      { dur: 1200 },
      { dur: 1, to: { turn: 0 } },                              // a full turn is where it started
      { dur: 700 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "";

  const loop = register(stage, (dt) => {
    const a = life.step(dt), b = stepS(hand, dt);
    const v = life.values(life.held ? { swell: hand.x, turn: hand.x * 0.5 } : {});
    ic.ink(v.ink);
    /* a uniform swell within the dial's plane is a true 3D swell, so it is honest for the solid (rule 09) */
    const s = 1 + (max - 1) * v.swell;
    dial.stretch(s, s, "u-up", centre);
    moon.stretch(s, s, "u-up", centre).turn(-360 * v.turn, "u-up", centre);
    const deg = Math.round(((v.turn * 360) % 360 + 360) % 360);
    const shown = v.ink < 1 ? "drawing" : v.swell < 0.02 && deg === 0 ? "rest" : deg ? `turn ${deg}°` : "pressed";
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  const leave = () => { life.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(30, 170, Math.hypot(pt[0] - centre[0], pt[1] - centre[1]));
      if (near <= 0) { leave(); return; }
      if (!life.held) { hand.x = life.values().swell; life.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 1, 1.25); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "radio",
  icon: "radio-button-partial",
  variant: "rounded-left",
  means: "An option is chosen: the dial swells and settles, then its half-moon turns once round like a dial being set.",
  rules: [5, 8, 9],
  range: [1.05, 1.1, 1.16],
  mount,
});
