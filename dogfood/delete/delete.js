/*
 * Delete. It draws itself in, then takes out the rubbish: the lid lifts clear, a sheet
 * of paper drops into the open bin, flutters over the rim and sinks behind the front, the bin
 * sags under it and the lid comes back. Bring the pointer near the bin and you hold the lid
 * open: the nearer, the wider. In a product: a delete, done.
 */
const { icon, spring, stepS, register, pointer, disposer, trace, story, clamp, smooth, lerp, SPRING } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src); // the default placement, so inspect.mjs's points are this figure's points

  /* the front is one curved face for lid and body: break it along u at the lid's underside (it shows as the step
     at the left and right edges); the right side is one face too: break it at the same line */
  const [lidFront, bodyFront] = ic.cut(2, [150, 108.5], "u");
  const lid = ic.part("lid", [lidFront, 0, 1]);
  /* the rim the lid was hiding: the body's top, from the front edge the cut left (A to B, along u) back along v by
     the body's depth; face() copies cannot join a part, so it is a facet */
  const A = [131, 98], B = [231, 155], back = ic.iso(0, -46, 0);
  const rimFace = ic.facet([A, B, [B[0] + back[0], B[1] + back[1]], [A[0] + back[0], A[1] + back[1]]], lid);
  const bin = ic.part("bin", [bodyFront, 3, 4, 5, 6, 7, 8, 9, 10]);
  const rim = ic.part("rim", [rimFace]);
  lid.hi(true); // the eye starts at the lid

  /* the sheet, in the figure's hairline, drawn inside the rim's paint so the bin's front hides it as it sinks */
  const sheet = rim.trace({ tone: "hi" });
  const P0 = [180, 118];
  const corners = (z, th) => [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]].map(([a, b]) => {
    const x = a * 14, y = b * 10;
    const o = ic.iso(x * Math.cos(th) - y * Math.sin(th), x * Math.sin(th) + y * Math.cos(th), z);
    return [P0[0] + o[0], P0[1] + o[1]];
  });

  const del = story(stage, {
    rest: { lid: 0, fall: 0, sag: 0, ink: 1 },
    poster: { lid: 1, fall: 0.6, sag: 0, ink: 1 },
    intro: { dur: 4800, from: { ink: 0 }, ease: "linear" }, // it draws itself in, once, the first time it is seen
    beats: [
      { dur: 700 },
      { dur: 600, to: { lid: 1 } },                          // the lid lifts clear
      { dur: 1100, to: { fall: 1 }, ease: "in" },            // the sheet drops in
      { dur: 300, to: { sag: [1, 0] }, ease: "out" },        // the bin takes the weight
      { dur: 250 },
      { dur: 600, to: { lid: 0 } },                          // the lid comes back
      { dur: 1, to: { fall: 0 } },                           // (the sheet is gone: next one)
      { dur: 900 },
    ],
  });
  const hand = spring(0, SPRING.hand);
  let max = reach, label = "", brightSheet = false;

  const loop = register(stage, (dt) => {
    const a = del.step(dt), b = stepS(hand, dt);
    const v = del.values(del.held ? { lid: hand.x, fall: 0 } : {});
    ic.ink(v.ink);
    const l = v.lid * max;
    lid.move(-l * 0.3, 0, l);
    for (const p of [bin, rim]) p.move(0, 0, -v.sag * 2.5);
    const falling = v.fall > 0.001 && v.fall < 0.995;
    const z = lerp(60, -45, v.fall);
    const th = 0.5 * Math.sin(v.fall * 5);
    sheet.draw(falling ? [corners(z, th)] : [], smooth(0, 0.2, v.fall));
    if (falling !== brightSheet) { brightSheet = falling; lid.hi(!falling); lid.dim(falling); }
    const shown = v.ink < 1 ? "drawing" : falling ? "dropping" : v.lid < 0.03 ? "rest" : "open";
    if (shown !== label) { read.textContent = shown; label = shown; }
    return a || b;
  });

  /* hover takes over: nearness to the lid's rest centre opens it (rule 01) */
  const c = [lid.rest.cx, lid.rest.cy];
  const leave = () => { del.hold(false); loop.wake(); };
  bag.add(pointer(stage, {
    move(pt) {
      const near = 1 - smooth(20, 120, Math.hypot(pt[0] - c[0], pt[1] - c[1]));
      if (near <= 0) { leave(); return; }
      if (!del.held) { hand.x = del.values().lid; del.hold(true); }
      hand.t = near;
      loop.wake();
    },
    leave,
  }));

  bag.add(() => { loop.unregister(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 40); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "delete",
  icon: "delete",
  variant: "rounded-left",
  means: "A bin takes out the rubbish: the lid lifts clear, a sheet drops in and sinks, the lid returns. Hold near to keep it open.",
  rules: [1, 5, 6, 11],
  range: [14, 24, 34],
  mount,
});
