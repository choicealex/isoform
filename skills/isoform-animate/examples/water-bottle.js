/*
 * Water bottle. It draws itself in, then refills: the cap comes off and is set aside, a
 * stream pours in and the level rises, the cap goes back on, a shake sloshes
 * the water, then it tips and pours out back down to where it began. Hover
 * takes the bottle: its side of the bottle rocks it, and the water stays
 * level. In a product: a fill, a quota, a balance.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, story, clamp, smooth, rad, lerp, SPRING } = IF;

function mount({ stage, svg, read, src }, lean) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* the cap's left side and the bottle's left side are one face: cut it at the cap's lower corner */
  const [capSide, bodySide] = ic.cut(0, [198, 111], "u");
  const body = ic.part("body", [bodySide, 2, 3, 4, 5, 6]);
  const cap = ic.part("cap", [capSide, 1]);
  cap.hi(true); // the eye starts at the cap

  /* in the figure's own hairline: the water's surface, kept inside the body. The water going in and out is told by the
     level alone (owner's call: no stream lines), so pour and spill only time the read-out */
  const water = body.trace({ clip: true });

  const refill = story(stage, {
    /* pour and spill run 0 → 1 → 2: the stream's head draws on to 1, then its tail follows it off at 2 */
    rest: { fill: 0.35, cap: 0, rock: 0, pour: 0, spill: 0, ink: 1 },
    poster: { fill: 0.6, cap: 1, rock: 0, pour: 1, spill: 0, ink: 1 },
    intro: { dur: 6600, from: { ink: 0 }, ease: "linear" }, // it draws itself in, once, the first time it is seen
    beats: [
      { dur: 500 },
      { dur: 450, to: { cap: 1 }, ease: "out" },                             // the cap comes off, set aside
      { dur: 1700, to: { fill: 0.62, pour: [1, 1, 1, 2] } },                 // a stream pours in, the level rises
      { dur: 450, to: { cap: [-0.05, 0] }, ease: "out" },                    // the cap goes back on, pressed home
      { dur: 1300, to: { rock: [0.8, -0.55, 0.3, 0] } },                     // a shake: the water sloshes
      { dur: 600 },
      { dur: 400, to: { cap: 1 }, ease: "out" },
      { dur: 1500, to: { rock: -1.5, fill: 0.35, spill: [1, 1, 1, 2] } },    // it tips and pours out
      { dur: 700, to: { rock: 0, pour: 0, spill: 0 } },
      { dur: 450, to: { cap: [-0.05, 0] }, ease: "out" },
      { dur: 800 },
    ],
  });

  const pivot = [214, 268]; // the base's front corner, which it rocks on
  const hand = spring(0, SPRING.hand);
  /* water rings, a hand does not: a float spring, underdamped, for the slosh (rule 08) */
  const slosh = spring(0, { k: 55, c: 2.6, eps: 0.0004 });
  let max = lean, label = "", lastDeg = 0;
  const su = ic.u[1] / ic.u[0], sv = ic.v[1] / ic.v[0];
  const turn = (p, deg) => {
    const t = rad(deg), x = p[0] - pivot[0], y = p[1] - pivot[1];
    return [pivot[0] + x * Math.cos(t) - y * Math.sin(t), pivot[1] + x * Math.sin(t) + y * Math.cos(t)];
  };

  const fx = gl(stage, {
    layer: "over",
    uniforms: { u_e: "vec2", u_su: "float", u_sv: "float", u_slosh: "float" },
    frag: `
      // the body of water under the traced line: level in the world, along u on the left face and v on the right
      vec4 effect(vec2 p) {
        float inside = mask(p);
        if (inside < 0.01) return vec4(0.0);
        float dx = p.x - u_e.x;
        float surf = u_e.y + dx * (dx < 0.0 ? u_su : u_sv) + dx * u_slosh + sin(dx * 0.12 + u_time * 5.0) * 7.2 * abs(u_slosh);
        float below = smoothstep(-0.5, 0.5, p.y - surf);
        float a = below * mix(0.08, 0.2, clamp((p.y - surf) / 80.0, 0.0, 1.0));
        return vec4(u_hi * a, a) * inside;
      }`,
  });
  if (fx.on) { fx.set("u_su", su); fx.set("u_sv", sv); }

  const loop = register(stage, (dt, now) => {
    const a = refill.step(dt), b = stepS(hand, dt);
    const v = refill.values(refill.held ? { rock: hand.x } : {});
    ic.ink(v.ink);
    const deg = v.rock * max;
    slosh.v += (deg - lastDeg) * 0.2; // a change in the rocking is a push on the water
    lastDeg = deg;
    const c = stepS(slosh, dt);
    /* the cap lifts and is set aside along -u, off the mouth, so the stream has somewhere to go */
    cap.move(-44 * Math.max(0, v.cap), 0, 10 * v.cap).tilt(deg, pivot);
    body.tilt(deg, pivot);

    /* the surface keeps its height where it meets the turned front edge, and stays level in the world */
    const e = turn([217, lerp(258, 176, v.fill)], deg);
    const sl = clamp(slosh.x, -0.4, 0.4), time = now / 1000, line = [];
    for (let px = body.rest.x0 - 30; px <= body.rest.x1 + 30; px += 2) {
      const dx = px - e[0];
      line.push([px, e[1] + dx * (dx < 0 ? su : sv) + dx * sl + Math.sin(dx * 0.12 + time * 5) * 7.2 * Math.abs(sl)]);
    }
    water.draw(line, smooth(0.86, 0.97, v.ink)); // the last stroke of the drawing, as the fills come in
    water.tone(v.pour > 0.1 || v.spill > 0.1 || Math.abs(sl) > 0.01 || refill.held ? "hi" : "edge");


    const shown = refill.held ? (Math.abs(deg) < 0.5 ? "level" : `tip ${deg > 0 ? "+" : "−"}${Math.round(Math.abs(deg))}°`)
      : v.ink < 1 ? "drawing" : v.pour > 0.1 && v.pour < 1.9 ? `fill ${Math.round(v.fill * 100)}%` : v.spill > 0.1 && v.spill < 1.9 ? "pour" : Math.abs(sl) > 0.02 ? "slosh"
      : v.cap > 0.05 ? "open" : Math.abs(v.fill - 0.35) < 0.01 ? "rest" : "sealed";
    if (shown !== label) { read.textContent = shown; label = shown; }
    if (fx.on) { fx.set("u_e", e); fx.set("u_slosh", sl); fx.mask([body]); fx.draw(now); }
    return a || b || c;
  });

  /* hover takes the bottle: its side of the bottle's rest centre sets the rock (rule 01) */
  const r = body.rest;
  const over = (pt) => pt[0] > r.x0 - 30 && pt[0] < r.x1 + 30 && pt[1] > cap.rest.y0 - 20 && pt[1] < r.y1 + 10;
  const leave = () => { refill.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      if (!over(pt)) { leave(); return; }
      if (!refill.held) { hand.x = refill.values().rock; refill.hold(true); }
      hand.t = clamp((pt[0] - r.cx) / ((r.x1 - r.x0) / 2 + 30), -1, 1);
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 14); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "water-bottle",
  icon: "water-bottle",
  variant: "rounded-left",
  means: "A bottle refills on its own: cap off, water in, cap on, a shake, a pour. Hover to take it and rock it.",
  effect: "the body of water under the traced line, level in the world, sloshing as the bottle moves",
  rules: [1, 5, 8, 11],
  range: [3, 6, 10],
  mount,
});
