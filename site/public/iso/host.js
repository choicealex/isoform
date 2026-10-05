/*
 * The site's stand-in for the skill's bench page: many figures on one page, each in its own stage.
 * Loaded once, after kernel.js. Figures are the skill's own files, loaded as modules; each ends in
 * isoform({ name, … }), which lands here and is kept by name.
 *
 *   IsoHost.mount(stage, name, { src, intensity, speed, gl, t }) → Promise<{ decl, set(intensity), replay(), destroy() }>
 *
 * The stage is any element; the host fills it with the figure's svg and its read-out. Options map onto
 * the stage's data attributes the kernel already reads: data-gl, data-t, data-speed.
 */
(() => {
  const decls = new Map(), waiting = new Map(), loading = new Set();
  window.isoform = (d) => {
    decls.set(d.name, d);
    for (const res of waiting.get(d.name) ?? []) res(d);
    waiting.delete(d.name);
  };
  const load = (name) => {
    if (decls.has(name)) return Promise.resolve(decls.get(name));
    const p = new Promise((res) => waiting.set(name, [...(waiting.get(name) ?? []), res]));
    if (!loading.has(name)) {
      loading.add(name);
      const s = Object.assign(document.createElement("script"), { type: "module", src: `/iso/figures/${name}.js` });
      document.head.appendChild(s);
    }
    return p;
  };
  /* the slider's 0…1 onto the figure's own three-point range, as the bench does */
  const value = (range, t) => {
    const [a, b, c] = range;
    return t <= 0.5 ? a + (b - a) * (t / 0.5) : b + (c - b) * ((t - 0.5) / 0.5);
  };
  const NS = "http://www.w3.org/2000/svg";

  async function mount(stage, name, o = {}) {
    const decl = await load(name);
    let handle = null, intensity = o.intensity ?? 0.5;
    stage.classList.add("iso-stage");
    stage.dataset.gl = o.gl ? "on" : "off";
    if (o.speed) stage.dataset.speed = String(o.speed);
    if (o.t != null) stage.dataset.t = String(o.t); else delete stage.dataset.t;
    const fresh = () => {
      handle?.destroy();
      for (const el of stage.querySelectorAll(":scope > svg, :scope > canvas, :scope > output.iso-read")) el.remove();
      const svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 400 320");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", decl.means);
      const read = Object.assign(document.createElement("output"), { className: "iso-read", textContent: "rest" });
      read.setAttribute("aria-live", "polite");
      /* the effect layer draws into these two, as on the skill's own page: under the drawing, then over it */
      const under = Object.assign(document.createElement("canvas"), { className: "under" });
      const over = Object.assign(document.createElement("canvas"), { className: "over" });
      under.setAttribute("aria-hidden", "true"); over.setAttribute("aria-hidden", "true");
      stage.append(under, svg, over, read);
      handle = decl.mount({ stage, svg, read, src: o.src }, value(decl.range, intensity));
    };
    fresh();
    return {
      decl,
      set(t) { intensity = t; handle?.set(value(decl.range, t)); },
      speed(x) { stage.dataset.speed = String(x); },
      replay: fresh,
      destroy() { handle?.destroy(); handle = null; for (const el of stage.querySelectorAll(":scope > svg, :scope > canvas, :scope > output.iso-read")) el.remove(); },
    };
  }
  /* themes change the effect's colours: tell every stage so it draws once more */
  const theme = () => { for (const s of document.querySelectorAll(".iso-stage")) s.dispatchEvent(new Event("isoform:theme")); };
  window.IsoHost = { mount, load, value, theme };
  window.dispatchEvent(new Event("isohost:ready"));
})();
