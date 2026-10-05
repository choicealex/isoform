/*
 * Bolt. Over it, the pointer's height pries the bolt apart at its step; once
 * the gap opens, current arcs across it, more arcs the wider it gets. The
 * read-out is the gap.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, clamp, smooth } = IF;

function mount({ stage, svg, read, src }, reach) {
  const bag = disposer();
  const ic = icon(svg, src, { cx: 200, cy: 172, h: 200 });

  /* the front face is one path: break it along u at the step's inner corner */
  const [top3, low3] = ic.cut(3, ic.pt(198, 169), "u");
  /* the broken surface: the cut line on the front, pushed back by the bolt's thickness (the step's right edge) */
  const broken = ic.facet([ic.pt(140, 135), ic.pt(198, 169), ic.pt(239, 148), ic.pt(181, 114)], low3);
  const low = ic.part("low", [low3, broken, 1, 2]);
  const high = ic.part("high", [top3, 0, 4]);
  high.hi(true); // rest: the upper half, where the hand will take it

  const gap = spring(0);
  let max = reach;

  /* the broken edge, in stage units: from where the cut leaves the face, through the step, to the far corner */
  const edge = [ic.pt(140, 135), ic.pt(198, 169), ic.pt(239, 148)];

  const fx = gl(stage, {
    layer: "over",
    uniforms: { u_a: "vec2", u_b: "vec2", u_c: "vec2", u_gap: "float", u_n: "float" },
    frag: `
      vec2 along(float t) { return t < 0.5 ? mix(u_a, u_b, t * 2.0) : mix(u_b, u_c, t * 2.0 - 1.0); }
      vec4 effect(vec2 p) {
        if (u_gap < 4.0) return vec4(0.0);
        float hop = floor(u_time * 14.0);
        float glow = 0.0, core = 0.0;
        for (int i = 0; i < 4; i++) {
          float fi = float(i);
          if (fi >= u_n) break;
          float t = 0.08 + 0.84 * hash(vec2(hop, fi * 7.3));
          vec2 base = along(t);
          vec2 tip = base - vec2(0.0, u_gap);
          // a jagged path between the two faces, re-struck every hop
          float s = clamp((base.y - p.y) / u_gap, 0.0, 1.0);
          float jag = (fbm(vec2(s * 5.0, hop * 3.1 + fi * 11.0)) - 0.5) * (6.0 + u_gap * 0.35) * sin(s * 3.14159);
          vec2 q = vec2(base.x + jag, mix(base.y, tip.y, s));
          float d = length(p - q) + step(p.y, tip.y - 1.0) * 99.0 + step(base.y + 1.0, p.y) * 99.0;
          core += exp(-d * 1.4);
          glow += exp(-d * 0.22) * 0.18;
        }
        float flick = 0.75 + 0.25 * hash(vec2(hop, 3.0));
        vec3 col = mix(u_hi, vec3(1.0), clamp(core, 0.0, 1.0) * (1.0 - u_dark * 0.2));
        float a = clamp(core + glow, 0.0, 1.0) * flick * smoothstep(4.0, 10.0, u_gap);
        return vec4(col * a, a);
      }`,
  });
  if (fx.on) { fx.set("u_a", edge[0]); fx.set("u_b", edge[1]); fx.set("u_c", edge[2]); }

  let shown = "";
  let crackle = false;
  const loop = register(stage, (dt, now) => {
    const moving = stepS(gap, dt);
    const g = gap.x * max;
    high.move(0, 0, g);
    const label = g > 1 ? `gap ${String(Math.round(g)).padStart(2, "0")}` : "rest";
    if (label !== shown) { read.textContent = label; shown = label; }
    /* an arc lives as long as the gap is open: the only ambient motion, and only while held open */
    crackle = fx.on && g >= 4;
    if (fx.on) { fx.set("u_gap", g); fx.set("u_n", Math.min(4, 1 + Math.floor(g / 9))); fx.draw(now); }
    return moving || crackle;
  });

  /* rule 01: the hold is the rest box of both halves, which never moves, opened upward by the reach */
  const hold = (pt) => pt[0] > low.rest.x0 - 16 && pt[0] < low.rest.x1 + 16 && pt[1] > high.rest.y0 - max - 30 && pt[1] < low.rest.y1;
  bag.add(pointer(stage, {
    move(pt) {
      if (!hold(pt)) { release(); return; }
      /* higher pointer, wider gap: a position, so a spring (rule 08) */
      gap.t = smooth(edge[1][1] + 30, high.rest.y0 - 20, pt[1]);
      loop.wake();
    },
    leave: release,
  }));
  function release() { gap.t = 0; loop.wake(); }

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 60); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "bolt",
  icon: "bolt",
  variant: "sharp-left",
  means: "A lightning bolt in two halves. Lift the pointer over it to pry them apart; current arcs across the gap.",
  effect: "electric arcs strike across the gap, re-striking as they flicker, more of them as it widens",
  rules: [1, 3, 8, 11],
  range: [16, 30, 48],
  mount,
});
