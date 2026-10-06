"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Figure, type FigureControls } from "@/components/Figure";
import { FIGURES } from "@/lib/iso";

const ACCENT = "#229eff";
const INSTALL = "npx skills add choicealex/isoform";
const EASE = "cubic-bezier(.4,0,.2,1)";

const VARS = {
  "--iso-plate": "#0b0b0b",
  "--iso-face": "#0b0b0b",
  "--iso-edge": "#9a9aa3",
  "--iso-lo": "#2c2c33",
  "--iso-hi": "#4da3ff",
  "--iso-stroke": "0.9",
} as CSSProperties;

const CSS = `
.st{--ease:${EASE};--accent:${ACCENT};background:#000;color:#e5e7eb;font-family:var(--font-geist-sans),system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.st *{box-sizing:border-box}
.st button,.st input{font:inherit;color:inherit}
.st-mono{font-family:var(--font-geist-mono),ui-monospace,monospace}
.st-plus{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34'%3E%3Cpath d='M17 13.5v7M13.5 17h7' stroke='rgba(148,163,184,0.16)' stroke-width='1'/%3E%3C/svg%3E");mask-image:var(--plus-mask,radial-gradient(ellipse 70% 60% at center,#000 22%,transparent 72%));-webkit-mask-image:var(--plus-mask,radial-gradient(ellipse 70% 60% at center,#000 22%,transparent 72%))}
@keyframes stBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.st-bob{animation:stBob var(--bob,6s) ease-in-out var(--bob-delay,0s) infinite}
@keyframes stIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.st-in{opacity:0;animation:stIn .55s var(--ease) forwards;animation-delay:var(--d,0s)}
.st-pill{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 20px;border-radius:9999px;font-size:14px;font-weight:500;background:#161616;color:#e5e7eb;border:0;cursor:pointer;transition:background-color .15s var(--ease),color .15s var(--ease);text-decoration:none}
.st-pill:hover{background:#1d1d1d}
.st-pill:disabled{opacity:.5;pointer-events:none}
.st-pill.pri{background:var(--accent);color:#fff;font-weight:600}
.st-pill.pri:hover{background:#1a86dc}
.st-navlink{padding:6px 14px;border-radius:9999px;font-size:14px;font-weight:500;color:#b0b3b8;text-decoration:none;transition:all .15s var(--ease)}
.st-navlink:hover{background:#161616;color:#e5e7eb}
.st h2{font-size:36px;line-height:40px;font-weight:600;letter-spacing:-.9px;color:#e5e7eb;margin:0}
.st h2 i{color:var(--accent);font-style:normal}
.st-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;border-radius:9999px;outline:none;cursor:pointer;background:linear-gradient(to right,var(--accent) var(--p),#1f2933 var(--p))}
.st-slider::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:9999px;background:var(--accent);border:3px solid #000;box-shadow:0 0 0 1px var(--accent),0 6px 16px -4px #229eff66;transition:transform .15s var(--ease),box-shadow .15s var(--ease)}
.st-slider:hover::-webkit-slider-thumb{transform:scale(1.15)}
.st-slider:active::-webkit-slider-thumb{box-shadow:0 0 0 1px var(--accent),0 0 0 6px #229eff40;transform:scale(1.05)}
.st-card{position:relative;background:#0b0b0b;border-radius:10px;transition:background-color .3s var(--ease);cursor:pointer;outline:none}
.st-card:hover,.st-card:focus-visible,.st-card[aria-pressed=true]{background:#161616}
.st-card:focus-visible{box-shadow:0 0 0 2px #229eff99}
.st-card .lbl{transition:opacity .15s var(--ease)}
.st-card:hover .lbl{opacity:0}
.st-card .acts{opacity:0;transform:scale(.97);transition:opacity .2s var(--ease),transform .2s var(--ease)}
.st-card:hover .acts,.st-card:focus-visible .acts{opacity:1;transform:none}
.st-side{display:flex;align-items:center;gap:10px;height:36px;padding:0 12px;border-radius:9999px;font-size:13px;font-weight:500;color:#b0b3b8;background:none;border:0;cursor:pointer;width:100%;text-align:left;transition:all .15s var(--ease)}
.st-side:hover{background:#0b0b0b;color:#e5e7eb}
.st-side[aria-pressed=true]{background:#161616;color:#e5e7eb}
.st-chip{font-size:10px;line-height:14px;font-weight:500;padding:1px 6px;border-radius:9999px;background:rgba(255,255,255,.06);color:#7c7c7c;font-variant-numeric:tabular-nums}
.st-side[aria-pressed=true] .st-chip{background:#229eff26;color:var(--accent)}
.st-rail{font-size:10px;line-height:15px;font-weight:600;letter-spacing:1.4px;text-transform:uppercase;color:#7c7c7c;padding:0 12px;margin:0 0 8px}
.st-seg{display:inline-flex;padding:4px;border-radius:9999px;background:#161616;width:100%}
.st-seg button{flex:1;height:32px;border:0;border-radius:9999px;background:none;font-size:14px;font-weight:500;color:#7c7c7c;cursor:pointer;transition:all .15s var(--ease)}
.st-seg button[aria-pressed=true]{background:rgba(255,255,255,.1);color:#e5e7eb}
.st-icobtn{display:grid;place-items:center;width:28px;height:28px;border-radius:9999px;border:0;background:none;color:#b0b3b8;cursor:pointer;transition:all .15s var(--ease)}
.st-icobtn:hover{background:rgba(255,255,255,.15);color:#fff}
@media (max-width:900px){.st h2{font-size:30px;line-height:34px}}
@media (prefers-reduced-motion:reduce){.st-bob,.st-in{animation:none;opacity:1}}
`;

const CATS = [...new Set(FIGURES.map((f) => f.category))];

function Ico({ d, s = 14 }: { d: string; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const COPY = "M5.5 5.5h7v7h-7zM10.5 5.5v-2h-7v7h2";
const ARROW = "M3 8h10M9 4l4 4-4 4";
const UPRIGHT = "M5 11l6-6M6 5h5v5";
const SEARCH = "M7 12a5 5 0 100-10 5 5 0 000 10zM14 14l-3.5-3.5";

function InstallPill({ cmd = INSTALL, width = 446 }: { cmd?: string; width?: number }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="st-pill st-mono"
      style={{ width, maxWidth: "100%", height: 40, fontSize: 14, justifyContent: "space-between", padding: "0 16px" }}
      onClick={() => {
        navigator.clipboard?.writeText(cmd).catch(() => {});
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
    >
      <span style={{ display: "flex", gap: 8, alignItems: "center", minWidth: 0 }}>
        <span style={{ color: ACCENT }}><Ico d="M8 1.5l5.5 3v7L8 14.5l-5.5-3v-7zM2.5 4.5L8 7.5l5.5-3M8 7.5v7" s={14} /></span>
        <span style={{ color: "#7c7c7c" }}>$</span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cmd}</span>
      </span>
      <span style={{ color: done ? ACCENT : "#7c7c7c" }}><Ico d={done ? "M3.5 8.5l3 3 6-7" : COPY} s={15} /></span>
    </button>
  );
}

function Header() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(0,0,0,.7)", backdropFilter: "blur(24px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontWeight: 600, color: "#fff" }}>
          <span style={{ width: 28, height: 28, borderRadius: 9999, background: "#161616", display: "grid", placeItems: "center", color: ACCENT }}>
            <svg role="img" aria-label="Isoform" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><path d="M8 2l5.5 3v6L8 14l-5.5-3V5zM2.5 5L8 8l5.5-3M8 8v6" /></svg>
          </span>
          Isoform
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a className="st-navlink" href="#catalogue">Figures</a>
          <a className="st-navlink" href="#tune">Tune</a>
          <a className="st-navlink" href="#docs">Docs</a>
          <span className="st-pill" style={{ height: 32, fontSize: 12, padding: "0 16px", gap: 8 }}>
            <Ico d={SEARCH} s={13} /> Search figures
            <span className="st-mono" style={{ background: "rgba(255,255,255,.1)", borderRadius: 9999, padding: "0 8px", lineHeight: "20px", color: "#7c7c7c" }}>⌘K</span>
          </span>
        </nav>
      </div>
    </header>
  );
}

const POS: { name: string; l: number; t: number; w: number; dim: boolean; bob: number; del: number }[] = [
  { name: "rocket", l: 9, t: 40, w: 230, dim: true, bob: 6.2, del: -1.5 },
  { name: "house", l: 23, t: 70, w: 190, dim: false, bob: 5.6, del: -3.2 },
  { name: "water-bottle", l: 36, t: 32, w: 220, dim: true, bob: 7, del: -4.4 },
  { name: "car", l: 50, t: 66, w: 260, dim: false, bob: 6.5, del: -2.1 },
  { name: "bolt", l: 64, t: 30, w: 210, dim: true, bob: 5.4, del: -0.8 },
  { name: "shopping-cart", l: 78, t: 68, w: 200, dim: false, bob: 6.8, del: -3.9 },
  { name: "local-gas-station", l: 91, t: 36, w: 220, dim: true, bob: 6, del: -5 },
];

function Hero() {
  const [lit, setLit] = useState(3);
  useEffect(() => {
    const id = setInterval(() => setLit((n) => (n + 1) % POS.length), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <section style={{ position: "relative", minHeight: 860, display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 64, overflow: "hidden" }}>
      <div className="st-plus" style={{ position: "absolute", inset: "0 0 0 50%", transform: "translateX(-50%)", width: "100%", maxWidth: 1920 }} />
      <div style={{ position: "relative", marginTop: 72, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center", padding: "0 24px" }}>
        <h1 className="st-in" style={{ margin: 0, fontSize: 60, lineHeight: "66px", fontWeight: 600, letterSpacing: -1.5, color: "#e5e7eb" }}>
          Icons that <span style={{ color: ACCENT }}>draw</span> themselves
          <br />
          <span style={{ fontWeight: 500, color: "#7c7c7c" }}>one stroke at a time</span>
        </h1>
        <p className="st-in" style={{ margin: 0, maxWidth: 560, fontSize: 16, lineHeight: "26px", color: "#b0b3b8", textWrap: "balance", ["--d" as string]: ".09s" } as CSSProperties}>
          Isoform is an agent skill. Hand it an isometric icon and it returns a small line-art scene that traces in, plays its story, then answers your pointer.
        </p>
        <div className="st-in" style={{ position: "relative", paddingTop: 22, ["--d" as string]: ".18s" } as CSSProperties}>
          <div className="st-mono" style={{ position: "absolute", top: 22, left: "50%", width: 446, maxWidth: "100%", height: 40, borderRadius: 9999, background: "#111", transform: "translate(-50%,-26px) scale(.9)", transformOrigin: "50% 100%", fontSize: 13, color: "#7c7c7c", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 4 }}>
            skills
          </div>
          <div style={{ position: "relative" }}><InstallPill /></div>
        </div>
        <div className="st-in" style={{ display: "flex", gap: 12, ["--d" as string]: ".27s" } as CSSProperties}>
          <a className="st-pill pri" href="#catalogue">Browse figures <Ico d={ARROW} s={16} /></a>
          <a className="st-pill" href="#docs">Docs <Ico d={UPRIGHT} s={16} /></a>
        </div>
      </div>
      <div style={{ position: "relative", flex: 1, width: "100%", maxWidth: 1920, minHeight: 420, marginTop: 24, maskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)" }}>
        {POS.map((p, i) => {
          const on = lit === i;
          return (
            <div key={p.name} style={{ position: "absolute", left: `${p.l}%`, top: `${p.t}%`, width: p.w, transform: "translate(-50%,-50%)" }}>
              <div className="st-bob" style={{ ["--bob" as string]: `${p.bob}s`, ["--bob-delay" as string]: `${p.del}s`, opacity: on ? 1 : p.dim ? 0.38 : 0.62, filter: on ? "drop-shadow(0 0 18px #229eff55)" : "none", transition: `opacity .3s ${EASE}, filter .3s ${EASE}` } as CSSProperties}>
                <Figure name={p.name} quiet className="w-full" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Shell({ sel, setSel }: { sel: string; setSel: (n: string) => void }) {
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const list = FIGURES.filter((f) => (!cat || f.category === cat) && (f.title + f.name).toLowerCase().includes(q.toLowerCase()));
  return (
    <div id="catalogue" style={{ borderRadius: 14, background: "#000", boxShadow: "0 0 0 1px #1f2933", overflow: "hidden", display: "flex", minHeight: 640 }}>
      <aside style={{ width: 256, flexShrink: 0, borderRight: "1px solid rgba(31,41,51,.6)", padding: 24, display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Isoform</div>
        <div>
          <p className="st-rail st-mono">Navigation</p>
          {["Figures", "Skill", "Prompts"].map((n, i) => (
            <button key={n} type="button" className="st-side" aria-pressed={i === 0 && !cat}  onClick={() => setCat(null)}>{n}{i === 0 && <span className="st-chip st-mono" style={{ marginLeft: "auto" }}>{FIGURES.length}</span>}</button>
          ))}
        </div>
        <div>
          <p className="st-rail st-mono">Categories</p>
          {CATS.map((c) => (
            <button key={c} type="button" className="st-side" aria-pressed={cat === c} onClick={() => setCat(cat === c ? null : c)}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c}</span>
              <span className="st-chip st-mono" style={{ marginLeft: "auto" }}>{FIGURES.filter((f) => f.category === c).length}</span>
            </button>
          ))}
        </div>
      </aside>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ height: 56, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: "1px solid rgba(31,41,51,.6)" }}>
          <label className="st-pill" style={{ width: 288, height: 36, fontSize: 12, padding: "0 14px", cursor: "text", justifyContent: "flex-start" }}>
            <Ico d={SEARCH} s={13} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${FIGURES.length} figures...`} style={{ background: "none", border: 0, outline: 0, flex: 1, minWidth: 0, fontSize: 12 }} />
            <span className="st-mono" style={{ background: "rgba(255,255,255,.1)", borderRadius: 9999, padding: "0 8px", lineHeight: "20px", color: "#7c7c7c" }}>⌘K</span>
          </label>
          <div style={{ width: 1, height: 20, background: "#1f2933" }} />
          <InstallPill width={310} />
        </div>
        <div style={{ padding: 24, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))" }}>
          {list.map((f) => (
            <button type="button" key={f.name} className="st-card" aria-pressed={sel === f.name} onClick={() => setSel(f.name)} style={{ padding: "12px 12px 40px", border: 0, textAlign: "left", color: "inherit", display: "block", width: "100%" }}>
              <Figure name={f.name} quiet className="w-full" />
              <div className="lbl st-mono" style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontSize: 13, color: "#7c7c7c" }}>{f.name}</div>
              <div className="acts" style={{ position: "absolute", left: "50%", bottom: 10, transform: "translateX(-50%)", display: "flex", gap: 2, padding: 2, borderRadius: 9999, background: "rgba(255,255,255,.08)" }}>
                <span className="st-icobtn"><Ico d={COPY} /></span>
                <span className="st-icobtn"><Ico d="M4 3l-3 5 3 5M12 3l3 5-3 5" /></span>
                <span className="st-icobtn"><Ico d="M5 3h8v8M13 3L3 13" /></span>
              </div>
              <span className="st-icobtn" style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,.08)" }}><Ico d={UPRIGHT} /></span>
            </button>
          ))}
          {!list.length && <p className="st-mono" style={{ color: "#7c7c7c", fontSize: 13 }}>Nothing matches.</p>}
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; fmt: (n: number) => string }) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#7c7c7c", marginBottom: 12 }}>
        <span>{label}</span>
        <span className="st-mono" style={{ fontSize: 12, color: "#b0b3b8", fontVariantNumeric: "tabular-nums" }}>{fmt(value)}</span>
      </div>
      <input type="range" className="st-slider" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} style={{ ["--p" as string]: `${p}%` } as CSSProperties} />
    </div>
  );
}

function Sheet({ name }: { name: string }) {
  const f = FIGURES.find((x) => x.name === name) ?? FIGURES[0];
  const ref = useRef<FigureControls>(null);
  const [inten, setInten] = useState(0.5);
  const [speed, setSpeed] = useState(1);
  const [mode, setMode] = useState<"skill" | "ask">("skill");
  const dirty = inten !== 0.5 || speed !== 1;
  const cmd = mode === "skill" ? INSTALL : `/isoform-animate ${f.title.toLowerCase()}`;
  return (
    <div id="tune" style={{ width: 448, maxWidth: "100%", flexShrink: 0, background: "#000", borderLeft: "1px solid rgba(31,41,51,.6)", borderRadius: 14, boxShadow: "0 0 0 1px #1f2933", overflow: "hidden" }}>
      <div style={{ padding: "24px 24px 16px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 20, fontWeight: 600 }}>{f.title}</span>
          <span style={{ background: "#161616", color: "#b0b3b8", fontSize: 12, fontWeight: 500, padding: "2px 10px", borderRadius: 9999 }}>{f.category}</span>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: "21px", color: "#b0b3b8" }}>{f.means}</p>
      </div>
      <div style={{ padding: "16px 24px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ position: "relative", height: 280, background: "#0b0b0b", borderRadius: 10, overflow: "hidden", display: "grid", placeItems: "center" }}>
          <div className="st-plus" style={{ position: "absolute", inset: 0, ["--plus-mask" as string]: "radial-gradient(circle at 50% 45%,#000 8%,transparent 70%)" } as CSSProperties} />
          <div style={{ position: "relative", width: 300 }}>
            <Figure ref={ref} name={f.name} quiet intensity={inten} speed={speed} className="w-full" />
          </div>
          <span style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "#161616", color: "#7c7c7c", fontSize: 12, padding: "4px 12px", borderRadius: 9999 }}>Hover to play</span>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button type="button" className="st-pill" onClick={() => ref.current?.replay()}><Ico d="M4 3l9 5-9 5z" /> Replay</button>
          <button type="button" className="st-pill" disabled={!dirty} onClick={() => { setInten(0.5); setSpeed(1); }}>Reset</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Slider label="Intensity" value={inten} min={0} max={1} step={0.01} onChange={setInten} fmt={(n) => n.toFixed(2)} />
          <Slider label="Speed" value={speed} min={0.25} max={2} step={0.05} onChange={setSpeed} fmt={(n) => `${n.toFixed(2)}x`} />
        </div>
        <div>
          <div style={{ fontSize: 14, color: "#7c7c7c", marginBottom: 10 }}>Install</div>
          <div className="st-seg">
            <button type="button" aria-pressed={mode === "skill"} onClick={() => setMode("skill")}>Add skill</button>
            <button type="button" aria-pressed={mode === "ask"} onClick={() => setMode("ask")}>Ask for it</button>
          </div>
        </div>
        <div style={{ background: "#161616", borderRadius: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid #1f293366" }}>
            <span style={{ fontSize: 14, color: "#7c7c7c" }}>{mode === "skill" ? "Terminal" : "In your agent"}</span>
            <button type="button" className="st-pill" style={{ height: 24, fontSize: 12, padding: "0 12px", background: "#1d1d1d" }} onClick={() => navigator.clipboard?.writeText(cmd).catch(() => {})}>Copy</button>
          </div>
          <pre className="st-mono" style={{ margin: 0, padding: "12px 16px", fontSize: 12, lineHeight: "19.5px", color: "#c9d1d9", whiteSpace: "pre-wrap" }}>
            <span style={{ color: "#7c7c7c" }}>$ </span>
            <span style={{ color: "#ffa657" }}>{cmd.split(" ")[0]}</span>{" "}
            <span style={{ color: "#a5d6ff" }}>{cmd.split(" ").slice(1).join(" ")}</span>
          </pre>
        </div>
        <div style={{ background: "#161616", borderRadius: 10 }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #1f293366", fontSize: 14, color: "#7c7c7c" }}>Import and usage</div>
          <pre className="st-mono" style={{ margin: 0, padding: "12px 16px", fontSize: 12, lineHeight: "19.5px", color: "#c9d1d9", whiteSpace: "pre-wrap" }}>
            <span style={{ color: "#ff7b72" }}>import</span> {"{ "}<span style={{ color: "#d2a8ff" }}>Figure</span>{" }"} <span style={{ color: "#ff7b72" }}>from</span> <span style={{ color: "#a5d6ff" }}>"@isoform/react"</span>
            {"\n\n<"}<span style={{ color: "#d2a8ff" }}>Figure</span> <span style={{ color: "#79c0ff" }}>name</span>=<span style={{ color: "#a5d6ff" }}>"{f.name}"</span> <span style={{ color: "#79c0ff" }}>intensity</span>={"{"}<span style={{ color: "#7ee787" }}>{inten.toFixed(2)}</span>{"}"} <span style={{ color: "#79c0ff" }}>speed</span>={"{"}<span style={{ color: "#7ee787" }}>{speed.toFixed(2)}</span>{"}"} {"/>"}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function Studio() {
  const [sel, setSel] = useState("rocket");
  return (
    <div className="st fixed inset-0 z-50 overflow-y-auto" style={VARS}>
      <style>{CSS}</style>
      <Header />
      <Hero />

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
        <h2>Seven figures. <span style={{ color: "#7c7c7c" }}>Pick one and watch it work</span><i>.</i></h2>
        <p style={{ margin: "14px auto 0", maxWidth: 520, fontSize: 16, lineHeight: "24px", color: "#b0b3b8" }}>
          Every card is alive. Hover one to see what you can copy, click it to open the tuning sheet.
        </p>
        <div style={{ marginTop: 44, textAlign: "left" }}><Shell sel={sel} setSel={setSel} /></div>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
        <h2>Tune it. <span style={{ color: "#7c7c7c" }}>Then ask your agent for more</span><i>.</i></h2>
        <p style={{ margin: "14px auto 0", maxWidth: 520, fontSize: 16, lineHeight: "24px", color: "#b0b3b8" }}>
          The sheet drives the real engine. Drag a slider and the figure changes while it plays.
        </p>
        <div style={{ marginTop: 44, display: "flex", gap: 24, justifyContent: "center", alignItems: "flex-start", textAlign: "left", flexWrap: "wrap" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,220px))", gap: 12 }}>
            {FIGURES.filter((f) => f.name !== sel).slice(0, 6).map((f) => (
              <button type="button" key={f.name} className="st-card" aria-pressed={false} onClick={() => setSel(f.name)} style={{ padding: "12px 12px 40px", border: 0, textAlign: "left", color: "inherit", display: "block", width: "100%" }}>
                <Figure name={f.name} quiet className="w-full" />
                <div className="lbl st-mono" style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontSize: 13, color: "#7c7c7c" }}>{f.name}</div>
              </button>
            ))}
          </div>
          <Sheet name={sel} />
        </div>
      </section>

      <section id="docs" style={{ position: "relative", minHeight: 420, padding: "96px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ fontSize: 60, lineHeight: "66px", letterSpacing: -1.5 }}>Give your agent a pencil<i>.</i></h2>
        <p style={{ margin: "14px auto 0", maxWidth: 440, fontSize: 16, lineHeight: "24px", color: "#b0b3b8" }}>One command adds the skill. After that you only describe the thing you want drawn.</p>
        <div style={{ marginTop: 36, display: "flex", gap: 12 }}>
          <a className="st-pill pri" href="#catalogue">Browse figures <Ico d={ARROW} s={16} /></a>
          <a className="st-pill" href="#docs">Docs <Ico d={UPRIGHT} s={16} /></a>
        </div>
      </section>

      <footer style={{ overflow: "hidden", paddingBottom: 0 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 80, fontSize: 14, color: "#7c7c7c", flexWrap: "wrap", padding: "0 24px" }}>
          {["Figures", "Skill", "Source", "Isocons"].map((l) => <span key={l}>{l}</span>)}
        </div>
        <div aria-hidden="true" style={{ marginTop: 40, height: 165, padding: "0 8px", userSelect: "none", pointerEvents: "none", fontSize: "min(14vw,17rem)", lineHeight: 0.78, fontWeight: 700, letterSpacing: "-.05em", whiteSpace: "nowrap", color: "transparent", background: "linear-gradient(to bottom,rgba(229,231,235,.22),rgba(229,231,235,.02))", WebkitBackgroundClip: "text", backgroundClip: "text", textAlign: "center" }}>
          Isoform
        </div>
      </footer>
    </div>
  );
}
