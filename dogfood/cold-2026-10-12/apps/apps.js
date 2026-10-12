/*
 * Apps. Nine drums in a grid, drawn in. Then they launch in turn, reading order: each slides out of the grid along its
 * own axis toward the viewer, like a drawer, and stays out; all nine hold, then slide home together. Bring the pointer
 * near and the drums nearest it draw out, the nearest first. In a product: a suite of apps, each one opening.
 * No effect: an abstract symbol has no material to light (concepts.md), the gesture carries it.
 */
const { icon, spring, stepS, register, pointer, disposer, story, clamp, smooth, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* inspect.mjs, rounded-left: faces 0-8 are the drums' end caps, 9-17 their bodies (cap k belongs to body 9+k). The
     drums are extruded along v and the grid runs along u and up, so a drum slides out along v and meets no neighbour.
     Reading order, top row first, left to right on screen */
  const order = [8, 7, 6, 3, 4, 5, 2, 1, 0];
  const drums = order.map((k) => ic.part(`drum${k}`, [k, 9 + k]));
  const mid = 4; // the middle drum (cap 4) is where the eye starts
  drums[mid].hi(true);
  const N = drums.length;

  const ch = (i) => `d${i}`;
  const rest = { ink: 1 }, out = { ink: 1 }, wave = [];
  for (let i = 0; i < N; i++) { rest[ch(i)] = 0; out[ch(i)] = i < 5 ? 1 : 0; }
  const beats = [{ dur: 900 }];
  for (let i = 0; i < N; i++) beats.push({ dur: 380, to: { [ch(i)]: [1.06, 1] }, ease: "out" });
  beats.push({ dur: 1100 });
  beats.push({ dur: 900, to: Object.fromEntries(Array.from({ length: N }, (_, i) => [ch(i), 0])) });
  beats.push({ dur: 700 });

  const life = story(stage, {
    rest, poster: out,
    intro: { dur: 3200, from: { ink: 0 }, ease: "linear" },
    beats,
  });
  const hands = drums.map(() => spring(0, SPRING.hand));
  let max = reach, label = "", lit = mid;

  const loop = register(stage, (dt) => {
    const a = life.step(dt);
    let b = false;
    for (const h of hands) b = stepS(h, dt) || b;
    const live = {};
    if (life.held) hands.forEach((h, i) => { live[ch(i)] = h.x; });
    const v = life.values(live);
    ic.ink(v.ink);
    let moving = -1, best = 1, count = 0;
    for (let i = 0; i < N; i++) {
      const c = v[ch(i)];
      drums[i].move(0, c * max, 0); // out of the grid along v, toward the viewer
      if (c > 0.3) count++;
      const m = Math.abs(c - 0.5);
      if (c > 0.02 && c < 0.98 && m < best) { best = m; moving = i; }
    }
    const want = moving < 0 ? mid : moving;
    if (want !== lit) { drums[lit].hi(false); drums[want].hi(true); lit = want; }
    const shown = v.ink < 1 ? "drawing" : count === 0 && moving < 0 ? "rest" : `out ${count}`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  const leave = () => { life.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      /* nearness to each drum's REST centre (rule 01); the nearest is first to answer (rule 02) */
      const near = drums.map((d) => 1 - smooth(20, 120, Math.hypot(pt[0] - d.rest.cx, pt[1] - d.rest.cy)));
      const top = Math.max(...near);
      if (top <= 0) { leave(); return; }
      if (!life.held) { const v = life.values(); hands.forEach((h, i) => { h.x = v[ch(i)]; }); life.hold(true); }
      near.forEach((n, i) => { hands[i].t = n; });
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 26); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "apps",
  icon: "apps",
  variant: "rounded-left",
  means: "Nine apps launch in turn: each drum slides out of the grid like a drawer, all hold open, then slide home.",
  rules: [1, 2, 5, 8],
  range: [8, 12, 20],
  mount,
});
