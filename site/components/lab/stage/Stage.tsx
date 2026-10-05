"use client";

import { type CSSProperties, useEffect, useState } from "react";
import { Figure } from "@/components/Figure";
import { FIGURES } from "@/lib/iso";

const EASE = "cubic-bezier(.4,0,.2,1)";
const DARK = { "--iso-plate": "#0b0d10", "--iso-face": "#0b0d10", "--iso-edge": "#aeb2ba", "--iso-lo": "#2a2e35", "--iso-hi": "#4da3ff", "--iso-stroke": "0.9" } as CSSProperties;
const LIGHT = { "--iso-plate": "#ffffff", "--iso-face": "#ffffff", "--iso-edge": "#8e8e97", "--iso-lo": "#d7d7dc", "--iso-hi": "#229eff", "--iso-stroke": "0.9" } as CSSProperties;

const CSS = `
.sg{font-family:var(--font-geist-sans),system-ui,sans-serif;-webkit-font-smoothing:antialiased;background:#0b0d10;color:#e8eaed}
.sg-mono{font-family:var(--font-geist-mono),ui-monospace,monospace}
@keyframes sgIn{from{opacity:0;transform:scale(.985)}to{opacity:1;transform:none}}
.sg-swap{animation:sgIn .35s ${EASE} both}
.sg-rail button{height:34px;padding:0 16px;border-radius:9999px;border:0;background:transparent;color:#8b9099;font:500 13px var(--font-geist-sans),system-ui;cursor:pointer;white-space:nowrap;transition:all .2s ${EASE}}
.sg-rail button:hover{color:#e8eaed}
.sg-rail button[aria-pressed=true]{background:#e8eaed;color:#0b0d10}
.sg-tile{background:#fff;border-radius:18px;padding:28px 20px 22px;cursor:pointer;border:0;text-align:left;transition:transform .3s ${EASE},box-shadow .3s ${EASE};box-shadow:0 0 0 1px #e6e4dd}
.sg-tile:hover{transform:translateY(-4px);box-shadow:0 0 0 1px #d6d3ca,0 18px 40px -22px #0003}
.sg-tile[aria-pressed=true]{box-shadow:0 0 0 2px #229eff}
.sg-chip{display:inline-block;font:500 11px var(--font-geist-mono),monospace;letter-spacing:.04em;padding:3px 10px;border-radius:9999px;background:#eceae3;color:#5b5b63}
.sg-btn{display:inline-flex;align-items:center;height:38px;padding:0 18px;border-radius:9999px;border:0;font:500 14px var(--font-geist-sans),system-ui;cursor:pointer;text-decoration:none;transition:all .2s ${EASE}}
`;

function Hero() {
  const [i, setI] = useState(0);
  const f = FIGURES[i];
  return (
    <section style={{ position: "relative", height: "100vh", minHeight: 760, overflow: "hidden", ...DARK }}>
      {/* isometric dotted floor */}
      <div aria-hidden="true" style={{ position: "absolute", left: "50%", bottom: "14%", width: 1500, height: 560, transform: "translateX(-50%)", perspective: 900 }}>
        <div style={{ position: "absolute", inset: 0, transform: "rotateX(60deg) rotateZ(45deg) scale(1.1)", backgroundImage: "radial-gradient(circle,#4b5360 1.3px,transparent 1.6px)", backgroundSize: "36px 36px", maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%,#000 0%,transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%,#000 0%,transparent 70%)", opacity: 1 }} />
      </div>
      <div style={{ position: "absolute", left: "50%", top: 44, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 28, fontSize: 13, color: "#8b9099" }}>
        <span style={{ color: "#e8eaed", fontWeight: 600, fontSize: 15 }}>Isoform</span>
        <span>Figures</span><span>Skill</span><span>Docs</span>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "46%", width: 680, maxWidth: "92vw", transform: "translate(-50%,-52%)", filter: "drop-shadow(0 0 40px #229eff1f)" }}>
        <div key={f.name} className="sg-swap">
          <Figure name={f.name} quiet className="w-full" />
        </div>
      </div>
      <div className="sg-rail sg-mono" style={{ position: "absolute", left: "50%", bottom: 118, transform: "translateX(-50%)", display: "flex", gap: 2, padding: 4, borderRadius: 9999, background: "#14171c", boxShadow: "0 0 0 1px #23272e", maxWidth: "94vw", overflowX: "auto" }}>
        {FIGURES.map((x, n) => (
          <button key={x.name} type="button" aria-pressed={n === i} onClick={() => setI(n)}>{x.name}</button>
        ))}
      </div>
      <div style={{ position: "absolute", left: 48, bottom: 40 }}>
        <h1 style={{ margin: 0, fontSize: 38, lineHeight: "42px", fontWeight: 600, letterSpacing: "-.02em", maxWidth: 520 }}>
          Draw an icon.
          <br />
          <span style={{ color: "#6b7078" }}>It draws itself back.</span>
        </h1>
      </div>
      <div className="sg-mono" style={{ position: "absolute", right: 48, bottom: 44, fontSize: 12, color: "#6b7078", textAlign: "right" }}>
        <div style={{ color: "#8b9099" }}>{f.title}</div>
        <div>$ npx skills add choicealex/isoform</div>
      </div>
    </section>
  );
}

function Index({ sel, setSel }: { sel: string; setSel: (n: string) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 20 }}>
      {FIGURES.map((f) => (
        <button key={f.name} type="button" className="sg-tile" aria-pressed={sel === f.name} onClick={() => setSel(f.name)}>
          <div style={{ width: 440, maxWidth: "100%", margin: "0 auto" }}>
            <Figure name={f.name} quiet className="w-full" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: "#14161a" }}>{f.title}</span>
            <span className="sg-chip">{f.category}</span>
          </div>
          <div style={{ fontSize: 14, color: "#6b6b73", marginTop: 6, lineHeight: "20px" }}>{f.job}</div>
        </button>
      ))}
    </div>
  );
}

function BottomSheet({ name }: { name: string }) {
  const f = FIGURES.find((x) => x.name === name) ?? FIGURES[0];
  return (
    <div style={{ position: "relative", marginTop: 56, borderRadius: "24px 24px 0 0", background: "#fff", boxShadow: "0 0 0 1px #e6e4dd,0 -24px 60px -30px #0003", padding: "14px 40px 40px" }}>
      <div style={{ width: 44, height: 5, borderRadius: 9999, background: "#d9d6cd", margin: "0 auto 28px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: 48, alignItems: "center" }}>
        <div key={f.name} className="sg-swap" style={{ background: "#f7f6f2", borderRadius: 16, padding: 16 }}>
          <Figure name={f.name} quiet className="w-full" />
        </div>
        <div>
          <span className="sg-chip">{f.category}</span>
          <h3 style={{ margin: "14px 0 10px", fontSize: 34, lineHeight: "38px", fontWeight: 600, letterSpacing: "-.02em", color: "#14161a" }}>{f.title}</h3>
          <p style={{ margin: 0, fontSize: 16, lineHeight: "25px", color: "#55555d" }}>{f.means}</p>
          <div className="sg-mono" style={{ marginTop: 22, background: "#f4f3ef", borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "#3b3b42" }}>
            <span style={{ color: "#9a9aa3" }}>/</span>isoform-animate {f.title.toLowerCase()}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <a className="sg-btn" href="#top" style={{ background: "#229eff", color: "#fff" }}>Copy command</a>
            <a className="sg-btn" href="#top" style={{ background: "#eceae3", color: "#14161a" }}>Open full page</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Stage() {
  const [sel, setSel] = useState(FIGURES[0].name);
  useEffect(() => { document.getElementById("sg-root")?.scrollTo({ top: 0 }); }, []);
  return (
    <div id="sg-root" className="sg fixed inset-0 z-50 overflow-y-auto">
      <style>{CSS}</style>
      <Hero />
      <section style={{ background: "#f4f3ef", color: "#14161a", padding: "96px 48px 0", ...LIGHT }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <h2 style={{ margin: 0, fontSize: 44, lineHeight: "48px", fontWeight: 600, letterSpacing: "-.025em", maxWidth: 640 }}>
              The index<span style={{ color: "#229eff" }}>.</span> <span style={{ color: "#8e8e97" }}>Seven small stories, each one live.</span>
            </h2>
            <span className="sg-mono" style={{ fontSize: 12, color: "#8e8e97" }}>{FIGURES.length} figures</span>
          </div>
          <Index sel={sel} setSel={setSel} />
          <BottomSheet name={sel} />
        </div>
      </section>
    </div>
  );
}
