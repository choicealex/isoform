"use client";

import { useMemo, useState } from "react";
import { Figure } from "@/components/Figure";
import { CopyButton } from "@/components/Copy";
import { CATEGORIES, FIGURES } from "@/lib/iso";

const CMD = "npx skills add choicealex/isoform";
const LIGHT = { "--iso-plate": "#ffffff", "--iso-face": "#ffffff", "--iso-edge": "#8e8e97", "--iso-lo": "#d7d7dc", "--iso-hi": "#229eff" } as React.CSSProperties;
const DARK = { "--iso-plate": "#101214", "--iso-face": "#101214", "--iso-edge": "#9a9aa3", "--iso-lo": "#2c2c33", "--iso-hi": "#4da3ff" } as React.CSSProperties;
const DARK_AT = new Set([2, 5]);

export function Wall() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const shown = useMemo(
    () => FIGURES.map((f, i) => ({ f, i })).filter(({ f }) => (cat === "all" || f.category === cat) && `${f.name} ${f.title} ${f.means}`.toLowerCase().includes(q.toLowerCase())),
    [q, cat],
  );
  const current = open ? FIGURES.find((f) => f.name === open) : null;
  const currentDark = current ? DARK_AT.has(FIGURES.indexOf(current)) : false;

  const copy = async (name: string) => {
    try { await navigator.clipboard.writeText(`${name}.html`); } catch {}
    setCopied(name);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#ededeb] text-[#101214]">
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-black/10 bg-[#ededeb]/90 px-4 py-2.5 backdrop-blur">
        <span className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase">Isoform</span>
        <span className="hidden text-sm opacity-60 md:inline">Icons that act out what they are.</span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="flex gap-1">
            {["all", ...CATEGORIES].map((c) => (
              <button key={c} type="button" onClick={() => setCat(c)} aria-pressed={cat === c} className="rounded-full px-3 py-1 font-mono text-[11px] tracking-wider uppercase transition-colors hover:bg-black/10 aria-pressed:bg-[#101214] aria-pressed:text-white">{c}</button>
            ))}
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search figures" className="w-44 rounded-full bg-white px-3.5 py-1.5 text-sm outline-none placeholder:opacity-40 focus:ring-2 focus:ring-[#229eff]" />
        </div>
      </header>

      <div className="grid gap-1 [grid-auto-rows:480px] [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]">
        {!q && cat === "all" && (
          <div style={LIGHT} className="relative flex flex-col justify-between overflow-hidden bg-white sm:col-span-2">
            <div className="z-10 m-5 max-w-[26rem] self-start overflow-hidden rounded-xl bg-[#101214] font-mono text-[13px] text-white shadow-lg">
              <div className="flex gap-1.5 border-b border-white/10 px-3 py-2"><i className="size-2.5 rounded-full bg-white/20" /><i className="size-2.5 rounded-full bg-white/20" /><i className="size-2.5 rounded-full bg-white/20" /></div>
              <div className="space-y-1.5 p-4">
                <p><span className="opacity-40">$ </span>{CMD}</p>
                <p className="opacity-50">added skill isoform</p>
                <p><span className="opacity-40">&gt; </span>/isoform-animate a lighthouse</p>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[11px] opacity-70"><span>one HTML file out</span><CopyButton text={CMD} label="Copy command" className="!text-white hover:!bg-white/15" /></div>
            </div>
            <div className="pointer-events-none absolute right-0 bottom-0 w-[min(520px,70%)]"><Figure name="padlock" quiet className="w-full" /></div>
            <span className="absolute bottom-4 left-4 font-mono text-[11px] tracking-[0.12em] uppercase opacity-70">Install the skill</span>
          </div>
        )}
        {shown.map(({ f, i }) => {
          const dark = DARK_AT.has(i);
          return (
            <div key={f.name} style={dark ? DARK : LIGHT}
              className={`group relative cursor-pointer overflow-hidden ${dark ? "bg-[#101214] text-white" : "bg-white"}`}>
              <button type="button" aria-label={`Open ${f.title}`} onClick={() => setOpen(f.name)} className="absolute inset-0 z-0" />
              <div className="pointer-events-none absolute inset-0 grid place-items-center transition-transform duration-500 ease-out group-hover:scale-[1.07]">
                <Figure name={f.name} quiet className="w-[min(420px,92%)]" />
              </div>
              <span className="absolute bottom-4 left-4 font-mono text-[11px] tracking-[0.12em] uppercase opacity-70">{f.title}</span>
              <button type="button" onClick={() => copy(f.name)} className={`z-10 absolute right-3 bottom-3 rounded-full px-3 py-1.5 font-mono text-[11px] opacity-0 transition-opacity group-hover:opacity-100 ${dark ? "bg-white text-[#101214]" : "bg-[#101214] text-white"}`}>
                {copied === f.name ? "copied" : "copy file"}
              </button>
            </div>
          );
        })}
        {shown.length === 0 && <p className="col-span-full p-8 font-mono text-sm opacity-60">Nothing matches.</p>}
      </div>
      <div style={currentDark ? DARK : LIGHT} className={`fixed inset-0 z-30 grid place-items-center transition-all duration-500 ${currentDark ? "bg-[#101214] text-white" : "bg-white"} ${current ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        {current && (
          <>
            <Figure name={current.name} quiet className="w-[min(86vw,150vh)]" />
            <div className="absolute bottom-6 left-6 max-w-md">
              <p className="font-mono text-[11px] tracking-[0.12em] uppercase opacity-60">{current.category}</p>
              <p className="mt-1 text-2xl font-medium">{current.title}</p>
              <p className="mt-1 text-sm opacity-70">{current.means}</p>
            </div>
            <button type="button" onClick={() => setOpen(null)} className="absolute top-4 right-4 rounded-full border border-current/30 px-4 py-1.5 font-mono text-[11px] tracking-wider uppercase">Close</button>
          </>
        )}
      </div>
    </div>
  );
}
