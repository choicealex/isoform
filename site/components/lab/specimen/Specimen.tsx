"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Figure } from "@/components/Figure";
import { FIGURES, figureByName } from "@/lib/iso";

/* Specimen: the site as a technical sheet (after vercel.com/font): ruled columns, crosshairs, a figure inspector
   with metric lines, a loupe on the detail that matters, the catalogue as ruled cells. Dark by default. */
const DARK = {
  "--bg": "#0a0a0a", "--ink": "#ededed", "--mute": "#8f8f8f", "--rule": "#1f1f1f", "--tag": "#ededed", "--tagInk": "#0a0a0a",
  "--iso-plate": "#0a0a0a", "--iso-face": "#0a0a0a", "--iso-edge": "#a1a1a1", "--iso-lo": "#2e2e2e", "--iso-hi": "#4da3ff",
} as CSSProperties;
const LIGHT = {
  "--bg": "#fafafa", "--ink": "#171717", "--mute": "#6f6f6f", "--rule": "#ebebeb", "--tag": "#171717", "--tagInk": "#fafafa",
  "--iso-plate": "#fafafa", "--iso-face": "#ffffff", "--iso-edge": "#8e8e97", "--iso-lo": "#d7d7dc", "--iso-hi": "#229eff",
} as CSSProperties;

const label = "font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--mute)]";

function Cross({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 22 22" className={`absolute size-[22px] ${className}`} aria-hidden="true">
      <path d="M11 0v22M0 11h22" stroke="var(--mute)" strokeWidth="1" />
    </svg>
  );
}

/* a live loupe: the same figure, magnified, clipped to a circle over the point that matters */
function Loupe({ name, at, zoom = 2.6, size = 112 }: { name: string; at: [number, number]; zoom?: number; size?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = box.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const W = w * zoom, H = W * 0.8;
  return (
    <div
      ref={box}
      className="pointer-events-none absolute overflow-hidden rounded-full border border-[var(--mute)] bg-[var(--iso-plate)] shadow-[0_0_0_6px_var(--bg)]"
      style={{ width: size, height: size, left: `calc(${at[0] * 100}% - ${size / 2}px)`, top: `calc(${at[1] * 100}% - ${size / 2}px)` }}
    >
      {w > 0 && (
        <div className="absolute" style={{ width: W, height: H, left: size / 2 - at[0] * W, top: size / 2 - at[1] * H }}>
          <Figure name={name} quiet className="w-full" />
        </div>
      )}
    </div>
  );
}

const METRICS: [string, number, string][] = [
  ["Reach", 0.24, "at 1"],
  ["Rest", 0.5, "0"],
  ["Ground", 0.82, "-110"],
];

export function Specimen() {
  const [dark, setDark] = useState(true);
  const [pick, setPick] = useState("bolt");
  const [tab, setTab] = useState<"solid" | "parts">("solid");
  const f = figureByName(pick) ?? FIGURES[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg)] text-[var(--ink)] transition-colors" style={dark ? DARK : LIGHT}>
      {/* header: mark left, centred switcher, one pill right */}
      <header className="sticky top-0 z-10 flex h-[76px] items-center bg-[var(--bg)]/90 px-8 backdrop-blur">
        <svg viewBox="0 0 20 20" className="size-6" fill="none" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 2.5 16.5 6.25 10 10 3.5 6.25Z" fill="var(--ink)" />
          <path d="M3.5 6.25v7.5L10 17.5V10M16.5 6.25v7.5L10 17.5" stroke="var(--ink)" strokeWidth="1.2" />
        </svg>
        <nav className="absolute left-1/2 flex -translate-x-1/2 gap-1 rounded-full border border-[var(--rule)] p-1 text-[15px]">
          {["Figures", "Skill", "Docs"].map((n, i) => (
            <span key={n} className={`rounded-full px-4 py-1.5 ${i === 0 ? "bg-[var(--ink)] text-[var(--bg)]" : ""} ${n === "Docs" ? "font-mono text-[14px]" : ""}`}>{n}</span>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <button type="button" onClick={() => setDark((d) => !d)} className={`${label} rounded-full border border-[var(--rule)] px-3 py-2`}>{dark ? "Light" : "Dark"}</button>
          <span className="flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2 text-[15px] font-medium text-[var(--bg)]">
            Install
            <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><circle cx="8" cy="8" r="6.5" /><path d="M8 4.5v6M5.5 8.5 8 11l2.5-2.5" /></svg>
          </span>
        </div>
      </header>

      {/* hero: the wordmark and one figure on a ruled cell grid, crosshairs at the corners */}
      <section className="relative mx-8 mt-6 border border-[var(--rule)]" style={{ backgroundImage: "linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px)", backgroundSize: "calc(100% / 12) 120px" }}>
        <Cross className="-top-[11px] -left-[11px]" />
        <Cross className="-right-[11px] -bottom-[11px]" />
        <div className="grid h-[720px] grid-cols-12 items-center">
          <h1 className="col-span-7 pl-2 text-[clamp(7rem,15vw,15.5rem)] leading-[0.8] font-semibold tracking-[-0.065em]">
            Isoform<span className="text-[var(--iso-hi)]">.</span>
          </h1>
          <div className="relative col-span-5 -ml-[8%] mr-[2%]">
            <Figure name="rocket" quiet className="w-full" />
            <p className={`${label} absolute -bottom-6 left-0`}>rocket · Social · Isocons</p>
          </div>
        </div>
      </section>

      {/* three ruled columns from here down */}
      <div className="mx-8 grid grid-cols-3 border-x border-[var(--rule)]">
        {/* stats */}
        {[
          ["Figures", String(FIGURES.length), "M3 4h14v12H3z"],
          ["Isocons", "1,007", "M10 3 17 7v6l-7 4-7-4V7Z"],
          ["Rules", "12", "M4 5h12M4 10h12M4 15h8"],
        ].map(([k, v, d], i) => (
          <div key={k} className={`flex items-center gap-6 px-10 py-16 ${i < 2 ? "border-r border-[var(--rule)]" : ""}`}>
            <svg viewBox="0 0 20 20" className="size-7 shrink-0" fill="none" stroke="var(--ink)" strokeWidth="1.4" aria-hidden="true"><path d={d} /></svg>
            <span className="text-[30px] tracking-[-0.02em]">{k}</span>
            <span className="ml-auto text-[40px] tracking-[-0.03em] tabular-nums">{v}</span>
          </div>
        ))}

        {/* specimen: three figures on dotted ground lines, a loupe on what each one does */}
        {[
          ["bolt", [0.47, 0.42], "Arc in the gap"],
          ["house", [0.73, 0.73], "Mark on the rim"],
          ["car", [0.3, 0.62], "Cone from the lamp"],
        ].map(([name, at, what], i) => (
          <div key={name as string} className={`relative border-t border-[var(--rule)] px-6 pt-16 pb-12 ${i < 2 ? "border-r" : ""}`}>
            <div className="pointer-events-none absolute inset-x-0 top-[38%] border-t border-dashed border-[var(--rule)]" />
            <div className="pointer-events-none absolute inset-x-0 top-[72%] border-t border-dashed border-[var(--rule)]" />
            <div className="relative">
              <Figure name={name as string} quiet className="w-full" />
              <Loupe name={name as string} at={at as [number, number]} />
            </div>
            <p className="mt-6 text-center font-mono text-[13px]">{figureByName(name as string)?.title}</p>
            <p className={`${label} mt-1 text-center`}>{what as string}</p>
          </div>
        ))}

        {/* inspector: one figure with metric lines and Solid / Parts, the catalogue as ruled cells */}
        <div className="col-span-3 grid grid-cols-2 border-t border-[var(--rule)]">
          <div className="border-r border-[var(--rule)]">
            <div className="grid grid-cols-2 border-b border-[var(--rule)] text-[15px]">
              {(["solid", "parts"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setTab(t)} className={`py-4 capitalize ${tab === t ? "border-b-2 border-[var(--ink)]" : "text-[var(--mute)]"}`}>{t}</button>
              ))}
            </div>
            <div className="relative px-16 py-14">
              {METRICS.map(([k, y, v]) => (
                <div key={k} className="pointer-events-none absolute inset-x-0 flex items-center" style={{ top: `${y * 100}%` }}>
                  <span className={`${label} absolute -top-5 left-2`}>{k}</span>
                  <span className="w-full border-t border-dashed border-[var(--rule)]" />
                  <span className="absolute right-0 bg-[var(--tag)] px-1.5 font-mono text-[11px] text-[var(--tagInk)]">{v}</span>
                </div>
              ))}
              <div className={tab === "parts" ? "[&_.iso-stage_.icon_*]:!stroke-[var(--iso-hi)] [&_.iso-stage_.icon_*]:!fill-[color-mix(in_srgb,var(--iso-hi)_8%,transparent)]" : ""}>
                <Figure key={`${pick}-${tab}`} name={pick} t={tab === "parts" ? 0 : undefined} className="w-full" />
              </div>
            </div>
            <p className="border-t border-[var(--rule)] px-6 py-4 text-[15px] text-[var(--mute)]">{f.means}</p>
          </div>
          <div className="grid auto-rows-[1fr] grid-cols-3">
            {FIGURES.concat(FIGURES.slice(0, 2)).map((g, i) => (
              <button
                key={i < FIGURES.length ? g.name : `next-${g.name}`}
                type="button"
                onClick={() => setPick(g.name)}
                className={`relative border-r border-b border-[var(--rule)] p-3 text-left nth-[3n]:border-r-0 ${i >= FIGURES.length ? "opacity-25" : ""} ${g.name === pick && i < FIGURES.length ? "bg-[color-mix(in_srgb,var(--ink)_5%,transparent)]" : ""}`}
              >
                {i < FIGURES.length ? <Figure name={g.name} quiet className="w-full" /> : <div className="aspect-[5/4]" />}
                <span className={`${label} absolute bottom-2 left-3`}>{i < FIGURES.length ? g.name : "next"}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-24" />
    </div>
  );
}
