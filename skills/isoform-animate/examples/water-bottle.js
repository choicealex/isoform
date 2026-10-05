/*
 * Water bottle. Over the bottle the pointer's height unscrews the cap, and the
 * way the pointer moves across it sloshes the water inside. The read-out says
 * how far the cap is open.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, clamp, smooth } = IF;

function mount({ stage, svg, read, src }, lift) {
  const bag = disposer();
  const ic = icon(svg, src, { cx: 200, cy: 172, h: 214 });

  /* Isocons draws the cap's left side and the bottle's left side as one face: cut it at the cap's lower corner */
  const [capSide, bodySide] = ic.cut(0, ic.pt(199, 116), "u");
  const body = ic.part("body", [bodySide, 2, 3, 5, 6, 7, 8, 9]);
  const cap = ic.part("cap", [capSide, 1, 4]);
  /* the neck's top, which the cap hides at rest: the cap's top face, dropped by the cap's height (rule 06) */
  ic.face(1, 0, 0, -16, cap);
  cap.hi(true); // at rest the eye starts at the cap

  /* water: a spring for the cap (where), an underdamped one for the slosh, because water rings and a hand does not */
  const open = spring(0);
  const tilt = spring(0, { k: 60, c: 3.2, eps: 0.0005 });
  let max = lift, lastX = null, lastT = 0;

  const fx = gl(stage, {
    layer: "over",
    uniforms: { u_level: "float", u_edge: "vec2", u_su: "float", u_sv: "float", u_tilt: "float", u_open: "float" },
    frag: `
      vec4 effect(vec2 p) {
        float inside = mask(p);
        if (inside < 0.01) return vec4(0.0);
        // the surface is level in the world: on the left face it runs along u, on the right along v
        float dx = p.x - u_edge.x;
        float lvl = u_edge.y + dx * (dx < 0.0 ? u_su : u_sv);
        float wave = sin(dx * 0.11 + u_time * 5.0) * 1.6 * abs(u_tilt) + sin(dx * 0.23 - u_time * 3.1) * 0.6 * abs(u_tilt);
        float surf = lvl + dx * u_tilt * 0.9 + wave;
        float below = smoothstep(-0.6, 0.6, p.y - surf);
        float line = 1.0 - smoothstep(0.0, 1.4, abs(p.y - surf));
        float depth = clamp((p.y - surf) / 90.0, 0.0, 1.0);
        vec3 water = mix(u_line, u_hi, 0.35);
        // the surface is a line like the icon's own at rest; it brightens only while the water moves (rule 04: one bright place)
        float moving = smoothstep(0.03, 0.3, abs(u_tilt));
        float a = below * mix(0.10, 0.24, depth) + line * 0.85;
        vec3 col = mix(water, mix(u_line, u_hi, moving), line);
        // bubbles rise only while it sloshes: small rings, none at rest
        float stir = moving;
        vec2 q = vec2(p.x / 7.0, (p.y + u_time * 30.0) / 7.0);
        float r = length(fract(q) - 0.5) * 7.0;
        float bub = step(0.93, hash(floor(q))) * below * stir * (1.0 - smoothstep(0.5, 1.1, abs(r - 1.3)));
        a += bub * 0.6;
        return vec4(col * a, a) * inside;
      }`,
  });
  if (fx.on) {
    fx.set("u_level", 0);
    fx.set("u_edge", ic.pt(217, 196));
    fx.set("u_su", ic.u[1] / ic.u[0]);
    fx.set("u_sv", ic.v[1] / ic.v[0]);
    fx.mask([body]);
  }

  let drawn = "";
  const loop = register(stage, (dt, now) => {
    const a = stepS(open, dt), b = stepS(tilt, dt);
    const o = open.x;
    cap.move(0, 0, o * max).tilt(o * 6, [cap.rest.cx, cap.rest.y1]);
    const shown = o > 0.02 ? `open ${String(Math.round(o * 100)).padStart(2, "0")}%` : "rest";
    if (shown !== drawn) { read.textContent = shown; drawn = shown; }
    if (fx.on) { fx.set("u_tilt", clamp(tilt.x, -1, 1)); fx.set("u_open", o); fx.draw(now); }
    return a || b;
  });

  /* the grip: the bottle's rest box, widened a little and reaching up past the cap, so lifting the pointer keeps hold (rule 01) */
  const grip = (pt) => pt[0] > body.rest.x0 - 24 && pt[0] < body.rest.x1 + 24 && pt[1] > cap.rest.y0 - max - 40 && pt[1] < body.rest.y1;
  bag.add(pointer(stage, {
    move(pt) {
      if (!grip(pt)) { release(); return; }
      /* the higher the pointer over the bottle, the further the cap unscrews: a position, so a spring (rule 08) */
      open.t = smooth(body.rest.y1 - 30, cap.rest.y0 - 10, pt[1]);
      /* a sweep is an impulse into the water, which then rings back to level on its own */
      const t = performance.now();
      if (lastX != null && t > lastT) tilt.v += clamp(((pt[0] - lastX) / (t - lastT)) * 3.2, -4, 4);
      lastX = pt[0]; lastT = t;
      loop.wake();
    },
    leave: release,
  }));
  function release() { open.t = 0; lastX = null; loop.wake(); }

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return {
    set(v) { max = v; loop.wake(); },
    destroy: bag.dispose,
  };
}

isoform({
  name: "water-bottle",
  icon: "water-bottle",
  variant: "sharp-left",
  means: "A bottle of water. Raise the pointer over it to unscrew the cap; sweep across it and the water sloshes.",
  effect: "the water inside sloshes, rings and settles level, with bubbles while it moves",
  rules: [1, 5, 8, 11],
  range: [10, 24, 40],
  mount,
});
