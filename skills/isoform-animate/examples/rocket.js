/*
 * Rocket. As the pointer comes near, the engine lights: the nearer, the
 * harder it burns, and past half throttle the rocket lifts a few units off the
 * pad on its plume. In a product: a launch, a deploy, a send.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, trace, clamp, smooth } = IF;

function mount({ stage, svg, read, src }, climb) {
  const bag = disposer();
  const ic = icon(svg, src);

  /* paint order as Isocons drew it: hull, then the window on it, then the fins */
  const hull = ic.part("hull", [0, 1, 2]);
  const win = ic.part("window", [3]);
  const finR = ic.part("fin-right", [4, 5]);
  const finL = ic.part("fin-left", [6, 7]);
  const all = [hull, win, finR, finL];
  win.hi(true);
  /* the burn, in the figure's own hairline: the flame's edge and its hot core with two shock diamonds, inside the hull's
     paint so the fins stay in front of it; and the dust, dashed, running out along the ground's two axes */
  const flame = hull.trace();
  const core = hull.trace({ tone: "hi" });
  const dust = trace(svg, { dash: true, under: true });

  const thrust = spring(0);
  let max = climb, label = "";
  const nozzle = [206, 236], ground = 244;

  const fx = gl(stage, {
    layer: "under",
    uniforms: { u_noz: "vec2", u_lift: "float", u_t: "float", u_ground: "float" },
    frag: `
      vec4 effect(vec2 p) {
        if (u_t < 0.02) return vec4(0.0);
        vec2 n = u_noz - vec2(0.0, u_lift);
        float y = p.y - n.y, len = 14.0 + 46.0 * u_t;
        float s = clamp(y / len, 0.0, 1.0);
        float w = mix(3.0, 7.0 + 6.0 * u_t, sqrt(s)) + (noise(vec2(p.x * 0.2, y * 0.15 - u_time * 9.0)) - 0.5) * 2.0 * s;
        float dx = abs(p.x - n.x);
        float plume = (1.0 - smoothstep(w * 0.6, w, dx)) * step(0.0, y) * (1.0 - smoothstep(len * 0.6, len, y));
        float core = (1.0 - smoothstep(0.0, w * 0.3, dx)) * step(0.0, y) * (1.0 - smoothstep(0.0, len * 0.45, y));
        // shock diamonds: bright knots a hot exhaust shows just under the nozzle
        float knots = pow(0.5 + 0.5 * cos(y * 0.55), 8.0) * step(0.0, y) * (1.0 - smoothstep(0.0, 26.0, y)) * (1.0 - smoothstep(0.5, 2.5, dx));
        // dust thrown out along the ground, only once the plume reaches it
        vec2 g = vec2((p.x - n.x) / (40.0 + 60.0 * u_t), (p.y - u_ground) / 7.0);
        float dust = smoothstep(1.0, 0.2, length(g)) * smoothstep(0.35, 0.7, fbm(vec2(p.x * 0.05 + sign(p.x - n.x) * u_time, p.y * 0.1)))
                   * smoothstep(0.25, 0.8, u_t);
        // the one colour of its own the effect may carry is the phenomenon's (rule 12): burning propellant
        vec3 flame = vec3(1.0, 0.55, 0.2);
        vec3 hot = mix(vec3(1.0, 0.8, 0.5), vec3(1.0, 0.97, 0.92), u_dark);
        vec3 col = mix(flame, hot, clamp(core + knots, 0.0, 1.0));
        float a = clamp(plume * 0.55 + core * 0.7 + knots, 0.0, 1.0) * smoothstep(0.0, 0.3, u_t);
        float da = dust * 0.35 * (1.0 - a);
        return vec4(col * a + u_line * da, a + da);
      }`,
  });
  if (fx.on) { fx.set("u_noz", nozzle); fx.set("u_ground", ground); }

  const loop = register(stage, (dt, now) => {
    const moving = stepS(thrust, dt);
    const t = thrust.x;
    /* it leaves the pad only past half throttle, once thrust beats its weight */
    const lift = smooth(0.5, 1, t) * max;
    const shake = t > 0.05 && !IF.reducedMotion() ? Math.sin(now * 0.07) * 0.18 * t : 0; // a burning engine hums
    for (const p of all) p.move(0, 0, lift).tilt(shake, nozzle);
    const shown = t < 0.03 ? "rest" : lift > 0.5 ? "liftoff" : "ignition";
    if (shown !== label) { read.textContent = shown; label = shown; }
    drawBurn(t, lift, now);
    if (fx.on) { fx.set("u_lift", lift); fx.set("u_t", t); fx.draw(now); }
    return moving || t > 0.03;
  });

  function drawBurn(t, lift, now) {
    if (t < 0.03) { flame.draw([]); core.draw([]); dust.draw([]); return; }
    const n = [nozzle[0], nozzle[1] - lift];
    const flick = 1 + 0.07 * Math.sin(now * 0.031) * Math.sin(now * 0.017);
    const len = (14 + 46 * t) * flick, wide = 6 + 5 * t;
    const side = (k, scale, l) => Array.from({ length: 13 }, (_, i) => {
      const s = i / 12, w = (2.5 + wide * Math.sqrt(s)) * (1 - s ** 2.5) * scale;
      return [n[0] + k * w, n[1] + s * l];
    });
    const edge = side(-1, 1, len).concat(side(1, 1, len).reverse());
    const hot = side(-1, 0.38, len * 0.45).concat(side(1, 0.38, len * 0.45).reverse());
    const knot = (y, r) => [[n[0], y - r], [n[0] + r * 0.7, y], [n[0], y + r], [n[0] - r * 0.7, y], [n[0], y - r]];
    flame.draw([edge]);
    core.draw(t > 0.25 ? [hot, knot(n[1] + 7, 1.6), knot(n[1] + 14, 1.2)] : [hot]);
    /* dust only once the plume reaches the ground, thrown out along u and v, flowing outward */
    if (t < 0.35) { dust.draw([]); return; }
    const reach = 16 + 26 * t, from = 6 + (now * 0.02) % 5; // short, flowing outward
    const run = (dir) => [[ground0[0] + dir[0] * from, ground0[1] + dir[1] * from], [ground0[0] + dir[0] * reach, ground0[1] + dir[1] * reach]];
    dust.draw([run(ic.u), run(ic.v), run([-ic.u[0], -ic.u[1]]), run([-ic.v[0], -ic.v[1]])]);
  }
  const ground0 = [nozzle[0], ground];

  /* rule 01: nearness to the rocket's rest centre */
  const c = [hull.rest.cx, hull.rest.cy];
  bag.add(pointer(stage, {
    move(pt) { thrust.t = 1 - smooth(30, 170, Math.hypot(pt[0] - c[0], pt[1] - c[1])); loop.wake(); },
    leave() { thrust.t = 0; loop.wake(); },
  }));

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 30); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "rocket",
  icon: "rocket",
  variant: "rounded-left",
  means: "A rocket on its pad. As the pointer nears, the engine lights; close in, it lifts off on its plume.",
  effect: "an exhaust plume with shock diamonds under the nozzle, throwing dust along the ground",
  rules: [1, 5, 8, 11],
  range: [4, 10, 18],
  mount,
});
