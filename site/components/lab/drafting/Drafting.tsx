"use client";

import { useState } from "react";
import { Figure } from "@/components/Figure";
import { CopyButton } from "@/components/Copy";
import { FIGURES } from "@/lib/iso";

const INK = "#1c1b19";
const SWATCHES = ["#229eff", "#ff5a36", "#13a35e", "#8a5cf6", "#e8a400", "#1c1b19"];
const hard = { boxShadow: `3px 3px 0 ${INK}`, border: `1px solid ${INK}` } as const;
const CMD = "npx skills add choicealex/isoform";

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex justify-between font-mono text-[11px] tracking-wider uppercase">
        <span>{label}</span>
        <span>{value.toFixed(2)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" style={{ accentColor: INK }} />
    </label>
  );
}

function Canvas({ name, title, means, category, intensity, n }: { name: string; title: string; means: string; category: string; intensity: number; n: number }) {
  return (
    <div className="group relative border-r border-b p-10 sm:p-14" style={{ borderColor: INK, backgroundImage: "radial-gradient(#1c1b1930 1px, transparent 1px)", backgroundSize: "16px 16px" }}>
      <div className="relative">
        <span className="absolute -top-7 left-0 z-10 translate-y-1 bg-[#229eff] px-2 py-0.5 font-mono text-[11px] text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">{name}</span>
        <div className="relative outline outline-1 outline-transparent transition-[outline-color] group-hover:outline-[#229eff]">
          {["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"].map((p) => (
            <i key={p} className={`absolute ${p} z-10 size-2 border border-[#229eff] bg-white opacity-0 transition-opacity group-hover:opacity-100`} />
          ))}
          <Figure key={n} name={name} quiet intensity={intensity} className="w-full" />
        </div>
      </div>
      <div className="mt-6 flex items-baseline justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-draft)] text-xl font-medium">{title}</p>
          <p className="mt-0.5 text-sm opacity-70">{means}</p>
        </div>
        <span className="font-mono text-[11px] tracking-wider uppercase opacity-60">{category}</span>
      </div>
    </div>
  );
}

export function Drafting({ className }: { className: string }) {
  const [stroke, setStroke] = useState(0.9);
  const [accent, setAccent] = useState(SWATCHES[0]);
  const [intensity, setIntensity] = useState(0.5);
  const [n, setN] = useState(0);
  const vars = { "--iso-plate": "transparent", "--iso-face": "#efeae2", "--iso-edge": INK, "--iso-lo": "#1c1b1966", "--iso-hi": accent, "--iso-stroke": stroke } as React.CSSProperties;

  return (
    <div className={`${className} fixed inset-0 z-50 overflow-y-auto bg-[#efeae2] text-[#1c1b19]`} style={vars}>
      <header className="flex h-12 items-center justify-between border-b px-5" style={{ borderColor: INK }}>
        <span className="font-[family-name:var(--font-draft)] text-lg font-semibold">isoform</span>
        <nav className="flex gap-6 font-mono text-xs uppercase tracking-wider">
          <a href="/figures">Figures</a><a href="/skill">Skill</a><a href="/docs">Docs</a>
        </nav>
      </header>
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col gap-7 self-start border-r p-5 lg:flex" style={{ borderColor: INK }}>
          <p className="font-mono text-[11px] tracking-wider uppercase opacity-60">Control rail / live</p>
          <Slider label="Stroke" value={stroke} min={0.5} max={2} step={0.05} onChange={setStroke} />
          <div>
            <p className="mb-2 font-mono text-[11px] tracking-wider uppercase">Accent</p>
            <div className="flex gap-2">
              {SWATCHES.map((c) => (
                <button key={c} type="button" aria-label={c} onClick={() => setAccent(c)} className="size-7" style={{ background: c, border: `1px solid ${INK}`, outline: accent === c ? `2px solid ${INK}` : "none", outlineOffset: 2 }} />
              ))}
            </div>
          </div>
          <Slider label="Intensity" value={intensity} min={0} max={1} step={0.05} onChange={setIntensity} />
          <button type="button" onClick={() => setN((x) => x + 1)} className="bg-[#efeae2] px-4 py-2.5 font-mono text-xs tracking-wider uppercase transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none" style={hard}>
            Replay all
          </button>
          <p className="mt-auto text-xs leading-relaxed opacity-60">Every drawing on this page reads these four values. Nothing is saved; reload to reset.</p>
        </aside>
        <main className="min-w-0 flex-1">
          <section className="relative grid min-h-[620px] items-center overflow-hidden border-b px-8 sm:px-14" style={{ borderColor: INK }}>
            <div className="relative z-10 max-w-[560px] py-20">
              <p className="mb-5 font-mono text-xs tracking-wider uppercase opacity-60">An agent skill / {FIGURES.length} figures</p>
              <h1 className="font-[family-name:var(--font-draft)] text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.98] font-medium tracking-[-0.04em]">Icons that draw themselves, line by line.</h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed opacity-75">Hand your agent an isometric icon. It comes back as a small drawing that acts out what the object does.</p>
              <div className="mt-9 inline-flex items-center gap-3 bg-[#efeae2] py-2 pr-2 pl-4" style={hard}>
                <code className="font-mono text-sm"><span className="opacity-50">$ </span>{CMD}</code>
                <CopyButton text={CMD} label="Copy command" className="!text-[#1c1b19] hover:!bg-[#1c1b1920]" />
              </div>
            </div>
            <div className="pointer-events-none absolute top-1/2 right-0 hidden w-[min(62vw,860px)] translate-x-[28%] -translate-y-1/2 -rotate-3 md:block">
              <Figure key={`hero${n}`} name="rocket" quiet intensity={intensity} className="w-full" />
            </div>
          </section>
          <section className="grid grid-cols-1 border-l-0 xl:grid-cols-2">
            {FIGURES.map((f) => (
              <Canvas key={f.name} name={f.name} title={f.title} means={f.means} category={f.category} intensity={intensity} n={n} />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
