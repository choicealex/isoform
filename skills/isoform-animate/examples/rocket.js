/*
 * Rocket. Over it, the pointer's height is the throttle: the rocket lifts off
 * its pad and hovers on its plume, which kicks dust out along the ground. The
 * read-out is the thrust.
 */
const { icon, spring, stepS, register, pointer, disposer, gl, clamp, smooth } = IF;

function mount({ stage, svg, read, src }, climb) {
  const bag = disposer();
  const ic = icon(svg, src, { cx: 200, cy: 150, h: 196 });

  /* the window is drawn on the body, so the body paints where its first face did and the window after it */
  const finL = ic.part("fin-left", [0, 7, 8]);
  const body = ic.part("body", [1, 3, 4, 9], { paint: "first" });
  const win = ic.part("window", [2]);
  const finR = ic.part("fin-right", [5, 6]);
  const all = [finL, body, win, finR];
  win.hi(true); // rest: the eye starts at the window

  const thrust = spring(0);
  let max = climb;
  const nozzle = ic.pt(202, 232);
  const ground = Math.max(finL.rest.y1, finR.rest.y1);

  const fx = gl(stage, {
    layer: "under",
    uniforms: { u_noz: "vec2", u_lift: "float", u_thrust: "float", u_ground: "float" },
    frag: `
      vec4 effect(vec2 p) {
        if (u_thrust < 0.02) return vec4(0.0);
        vec2 n = u_noz - vec2(0.0, u_lift);
        float len = (u_ground - n.y) + 10.0 + u_thrust * 30.0;
        float y = p.y - n.y;                      // distance down the plume
        float s = clamp(y / len, 0.0, 1.0);
        float half_w = mix(8.0, 20.0 + u_thrust * 14.0, pow(s, 0.7));
        float turb = (fbm(vec2(p.x * 0.06, y * 0.05 - u_time * 6.0)) - 0.5) * 8.0 * s;
        float dx = abs(p.x - n.x + turb);
        float body = (1.0 - smoothstep(half_w * 0.55, half_w, dx)) * step(0.0, y) * (1.0 - smoothstep(len * 0.75, len, y));
        // shock diamonds: the bright knots a hot exhaust shows just under the nozzle
        float knots = pow(0.5 + 0.5 * cos(y * 0.32), 6.0) * step(0.0, y) * (1.0 - smoothstep(0.0, 70.0, y)) * (1.0 - smoothstep(2.0, 7.0, dx));
        float core = (1.0 - smoothstep(0.0, half_w * 0.35, dx)) * (1.0 - smoothstep(0.0, len * 0.6, y)) * step(0.0, y);
        // dust: thrown out along the ground, both ways, more the closer the nozzle is to it
        float near = 1.0 - smoothstep(10.0, 80.0, u_ground - n.y);
        vec2 g = vec2((p.x - n.x) / (70.0 + 110.0 * u_thrust), (p.y - u_ground + 6.0) / 20.0);
        float cloud = fbm(vec2(p.x * 0.04 + sign(p.x - n.x) * u_time * 1.5, p.y * 0.08 - u_time * 0.6));
        float dust = smoothstep(1.0, 0.15, length(g)) * smoothstep(0.3, 0.7, cloud) * smoothstep(0.1, 0.6, u_thrust) * (0.4 + 0.6 * near);
        // the one colour of its own the effect may carry is the phenomenon's (rule 12): burning propellant
        vec3 flame = vec3(1.0, 0.56, 0.22);
        vec3 white = mix(vec3(1.0, 0.78, 0.45), vec3(1.0, 0.96, 0.9), u_dark); // on a white plate the core keeps some heat, or it reads hollow
        vec3 col = mix(flame, white, clamp(core + knots, 0.0, 1.0));
        float a = clamp(body * 0.7 + core * 0.8 + knots, 0.0, 1.0) * smoothstep(0.0, 0.4, u_thrust);
        vec3 smoke = mix(u_line, u_face, 0.4);
        float da = dust * 0.7;
        vec3 outc = col * a + smoke * da * (1.0 - a);
        return vec4(outc, a + da * (1.0 - a));
      }`,
  });
  if (fx.on) { fx.set("u_noz", nozzle); fx.set("u_ground", ground); }

  let shown = "";
  const loop = register(stage, (dt, now) => {
    const moving = stepS(thrust, dt);
    const t = thrust.x;
    /* it leaves the pad only past a third of the throttle, as a real one does once thrust beats weight */
    const lift = smooth(0.33, 1, t) * max;
    /* a fine shake while it burns: a rocket on its plume is never quite still (ambient, only while thrust is on) */
    const shake = t > 0.02 && !IF.reducedMotion() ? Math.sin(now * 0.09) * 0.5 * t : 0;
    for (const p of all) p.move(0, 0, lift).tilt(shake, [200, ground]);
    const label = t > 0.02 ? `thrust ${String(Math.round(t * 100)).padStart(2, "0")}%` : "rest";
    if (label !== shown) { read.textContent = label; shown = label; }
    if (fx.on) { fx.set("u_lift", lift); fx.set("u_thrust", t); fx.draw(now); }
    return moving || t > 0.02;
  });

  /* rule 01: the rocket's rest box, reaching up by the climb so the pointer keeps hold as it rises */
  const x0 = finL.rest.x0 - 20, x1 = finR.rest.x1 + 20;
  const hold = (pt) => pt[0] > x0 && pt[0] < x1 && pt[1] > body.rest.y0 - max - 40 && pt[1] < ground + 10;
  bag.add(pointer(stage, {
    move(pt) {
      if (!hold(pt)) { release(); return; }
      thrust.t = smooth(ground, body.rest.y0 - 20, pt[1]); // a position: a spring (rule 08)
      loop.wake();
    },
    leave: release,
  }));
  function release() { thrust.t = 0; loop.wake(); }

  bag.add(() => { loop.unregister(); fx.dispose(); while (svg.firstChild) svg.firstChild.remove(); });
  return { set(v) { max = clamp(v, 0, 60); loop.wake(); }, destroy: bag.dispose };
}

isoform({
  name: "rocket",
  icon: "rocket",
  variant: "sharp-left",
  means: "A rocket on its pad. The pointer's height is the throttle: past a third it lifts off and hovers on its plume.",
  effect: "an exhaust plume with shock diamonds under the nozzle, throwing dust out along the ground",
  rules: [3, 5, 8, 11],
  range: [12, 28, 46],
  mount,
});
