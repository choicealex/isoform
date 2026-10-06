/*
 * Office building: the lights come on. At the start of a working day the windows light floor by floor
 * from the ground up, each sash easing out of its recess a hair as its lamp comes on, hold, then the day
 * ends and the lights go out from the top down. Hover: the nearer the hand, the more floors are lit.
 * In a product: a "your company" page, a team is online, the office is open.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, story, trace, clamp, smooth, lerp, SPRING } = IF;

function mount({ stage, svg, read, src }, pop) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* each window is two reveal faces; floor 1 is the ground floor, two windows to a floor */
  const WIN = [[[2, 3], [9, 10]], [[16, 15], [11, 31]], [[4, 5], [24, 30]], [[13, 12], [14, 23]]];
  const floors = WIN.map((f, k) => f.map((fs, j) => {
    const w = ic.part(`w${k}${j}`, fs);
    fs.forEach((i) => ic.face(i, 0, 0, 0, w)); // the recess the sash leaves: its own faces, kept at rest behind it (rule 06)
    return w;
  }));
  const all = floors.flat();
  const lit = (k, up) => smooth(k, k + 0.55, up); // floor k (0-based) lights as the front reaches it

  const day = story(stage, {
    rest: { up: 0, ink: 1 },
    poster: { up: 2.6, ink: 1 },
    intro: { dur: 6600, from: { ink: 0 }, ease: "linear" },
    beats: [
      { dur: 700 },
      { dur: 2800, to: { up: 4 } },  // the working day starts: floor by floor from the ground up
      { dur: 1500 },                 // hold, every floor lit
      { dur: 2200, to: { up: 0 } },  // lights out, top down: softer than arriving, no overshoot
      { dur: 800 },
    ],
  });

  /* in the figure's own hairline: the line of light along each lit floor's sill, drawn on across the tower wall */
  const sill = trace(svg, { tone: "edge" }), su = ic.u[1] / ic.u[0];
  const hand = spring(0, SPRING.hand);
  let max = pop, label = "", shown = -1;

  /* the one colour of its own (rule 12): lamplight through glass, warm amber. Level lines on this wall run along u */
  const fx = gl(stage, {
    layer: "over",
    uniforms: { u_su: "float", u_l1: "float", u_l2: "float", u_l3: "float", u_l4: "float" },
    frag: `
      float lamp(vec2 p) {
        float idx = floor((119.5 - (p.y - u_su * p.x)) / 29.0 + 0.5);
        return idx < 0.5 ? u_l1 : idx < 1.5 ? u_l2 : idx < 2.5 ? u_l3 : u_l4;
      }
      vec4 effect(vec2 p) {
        float core = mask(p) * lamp(p);
        float halo = 0.0;
        for (int i = 0; i < 24; i++) {
          int ring = i / 6;
          float a = float(i) * 1.047 + float(ring) * 0.5, r = 5.0 + 7.0 * float(ring) + float(ring * ring);
          vec2 q = p + vec2(cos(a), sin(a)) * r;
          halo += mask(q) * lamp(q) * (0.075 - 0.014 * float(ring));
        }
        // the desk lamps shimmer a little, each floor on its own clock
        float fl = 0.93 + 0.07 * noise(vec2(floor(p.y / 29.0) * 3.1, u_time * 2.0));
        vec3 warm = vec3(1.0, 0.62, 0.16), hot = mix(vec3(1.0, 0.8, 0.38), vec3(1.0, 0.9, 0.6), u_dark);
        float a = clamp(core * 0.92 * fl + halo * (1.0 - core) * 0.55, 0.0, 1.0);
        vec3 col = mix(warm, hot, core * 0.7);
        return vec4(col * a, a);
      }`,
  });
  if (fx.on) fx.set("u_su", ic.u[1] / ic.u[0]);

  const loop = register(stage, (dt, now) => {
    const a = day.step(dt), b = stepS(hand, dt);
    const v = day.values(day.held ? { up: hand.x * 4 } : {});
    ic.ink(v.ink);
    /* sashes ease out of their recesses along v as their floor lights */
    floors.forEach((f, k) => f.forEach((w) => w.move(0, max * lit(k, v.up), 0)));
    /* the bright stroke sits on the floor the light front is reaching */
    const front = clamp(Math.ceil(v.up - 0.001) - 1, 0, 3);
    if (front !== shown) { floors.forEach((f, k) => f.forEach((w) => w.hi(k === front))); shown = front; }
    const text = v.ink < 1 ? "drawing" : v.up < 0.02 ? "rest" : v.up > 3.98 ? "open" : `floor ${Math.ceil(v.up)}`;
    if (text !== label) { read.textContent = text; label = text; }
    sill.draw(WIN.map((_, k) => { const x1 = lerp(127, 183, lit(k, v.up)), y = (x) => 135 - 29 * k + su * x; return lit(k, v.up) > 0.02 ? [[127, y(127)], [x1, y(x1)]] : null; }).filter(Boolean), smooth(0.86, 0.97, v.ink));
    if (fx.on) {
      [1, 2, 3, 4].forEach((n) => fx.set(`u_l${n}`, lit(n - 1, v.up)));
      fx.mask(all); fx.draw(now);
    }
    return a || b;
  });

  /* nearness to the building, tested against its rest box (rule 01) */
  const near = (pt) => pt[0] > 100 && pt[0] < 300 && pt[1] > 50 && pt[1] < 290;
  const leave = () => { day.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      if (!near(pt)) { leave(); return; }
      if (!day.held) { hand.x = day.values().up / 4; day.hold(true); }
      hand.t = 1 - smooth(30, 150, Math.hypot(pt[0] - 200, pt[1] - 166));
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 8); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "domain",
  icon: "domain",
  variant: "rounded-left",
  means: "An office building: the lights come on floor by floor, hold, then go out from the top. Hover brings more floors on.",
  effect: "warm lamplight in the lit windows with a soft halo spilling onto the wall, each floor shimmering on its own clock",
  rules: [1, 5, 8, 11],
  range: [2, 4, 7],
  mount,
});
