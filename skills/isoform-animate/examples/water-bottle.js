/*
 * Water bottle. Over the bottle, the pointer's side rocks it a few degrees on
 * its front corner; the water inside stays level, sloshes when the rocking
 * changes, and settles. In a product: a level that holds while what it
 * measures moves — a fill, a quota, a balance.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, clamp, rad } = IF;

function mount({ stage, svg, read, src }, lean) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* the cap's left side and the bottle's left side are one face: cut it at the cap's lower corner */
  const [capSide, bodySide] = ic.cut(0, [198, 111], "u");
  const body = ic.part("body", [bodySide, 2, 3, 4, 5, 6]);
  const cap = ic.part("cap", [capSide, 1]);
  cap.hi(true); // rest: the eye starts at the cap
  /* the water line, in the figure's own hairline, kept inside the body; it is the figure with or without the effect */
  const water = body.trace({ clip: true });

  const pivot = [214, 268]; // the base's front corner, which it rocks on
  const tip = spring(0);
  /* water rings, a hand does not: an underdamped spring for the slosh (rule 08) */
  const slosh = spring(0, { k: 55, c: 2.6, eps: 0.0004 });
  let max = lean, label = "", lastTip = 0;
  const level = [220, 190]; // where the surface meets the front edge at rest

  const fx = gl(stage, {
    layer: "over",
    uniforms: { u_e: "vec2", u_su: "float", u_sv: "float", u_slosh: "float" },
    frag: `
      vec4 effect(vec2 p) {
        float inside = mask(p);
        if (inside < 0.01) return vec4(0.0);
        // level in the world: along u on the left face, along v on the right, whatever the bottle does
        float dx = p.x - u_e.x;
        float surf = u_e.y + dx * (dx < 0.0 ? u_su : u_sv) + dx * u_slosh
                   + sin(dx * 0.12 + u_time * 5.0) * 1.2 * abs(u_slosh) * 6.0;
        // the body of water under the traced line: the effect adds the material, the line stays the trace's
        float below = smoothstep(-0.5, 0.5, p.y - surf);
        float depth = clamp((p.y - surf) / 80.0, 0.0, 1.0);
        float a = below * mix(0.06, 0.16, depth);
        return vec4(u_line * a, a) * inside;
      }`,
  });
  if (fx.on) { fx.set("u_su", ic.u[1] / ic.u[0]); fx.set("u_sv", ic.v[1] / ic.v[0]); }

  const loop = register(stage, (dt, now) => {
    const a = stepS(tip, dt);
    const deg = tip.x * max;
    /* a change in the rocking is a push on the water */
    slosh.v += (deg - lastTip) * 0.2;
    lastTip = deg;
    const b = stepS(slosh, dt);
    cap.tilt(deg, pivot);
    body.tilt(deg, pivot);
    const whole = Math.round(Math.abs(deg));
    const shown = Math.abs(tip.x) < 0.01 ? "rest" : whole === 0 ? "level" : `tip ${deg > 0 ? "+" : "−"}${whole}°`;
    if (shown !== label) { read.textContent = shown; label = shown; }
    /* the surface keeps its height where it meets the turned front edge, and stays level in the world */
    const t = rad(deg), x = level[0] - pivot[0], y = level[1] - pivot[1];
    const e = [pivot[0] + x * Math.cos(t) - y * Math.sin(t), pivot[1] + x * Math.sin(t) + y * Math.cos(t)];
    const sl = clamp(slosh.x, -0.4, 0.4), su = ic.u[1] / ic.u[0], sv = ic.v[1] / ic.v[0], time = now / 1000;
    const line = [];
    for (let px = body.rest.x0 - 20; px <= body.rest.x1 + 20; px += 2) {
      const dx = px - e[0];
      line.push([px, e[1] + dx * (dx < 0 ? su : sv) + dx * sl + Math.sin(dx * 0.12 + time * 5) * 7.2 * Math.abs(sl)]);
    }
    water.draw(line);
    water.tone(Math.abs(sl) > 0.01 || Math.abs(tip.t) > 0 ? "hi" : "edge");
    if (fx.on) {
      fx.set("u_e", e);
      fx.set("u_slosh", sl);
      fx.mask([body]);
      fx.draw(now);
    }
    return a || b;
  });

  /* rule 01: the bottle's rest box, widened a little; the pointer's side of its centre sets the rock */
  const r = body.rest;
  const over = (pt) => pt[0] > r.x0 - 30 && pt[0] < r.x1 + 30 && pt[1] > cap.rest.y0 - 20 && pt[1] < r.y1 + 10;
  bag.add(pointer(stage, {
    move(pt) {
      tip.t = over(pt) ? clamp((pt[0] - r.cx) / ((r.x1 - r.x0) / 2 + 30), -1, 1) : 0;
      cap.hi(!over(pt)); // the bright moves to the water line while the pointer holds the bottle (rule 04)
      loop.wake();
    },
    leave() { tip.t = 0; cap.hi(true); loop.wake(); },
  }));

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 14); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "water-bottle",
  icon: "water-bottle",
  variant: "rounded-left",
  means: "A bottle of water. The pointer rocks it on its corner; the water stays level, sloshes, and settles.",
  effect: "the body of water under the line: it stays level as the bottle rocks, sloshing and ringing down",
  rules: [1, 5, 8, 11],
  range: [3, 6, 10],
  mount,
});
