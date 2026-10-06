"use client";

import Link from "next/link";
import { useState } from "react";
import { CopyButton } from "@/components/Copy";
import { Figure } from "@/components/Figure";
import { FIGURES } from "@/lib/iso";
import { LABEL, figNo } from "@/lib/spec";
import { LOOK, type Look, LookControls, lookProps } from "./Look";

/* every fourth tile is inverted (light on the dark page), for rhythm, after Dinamo and the lab's Wall */
const inverted = (i: number) => i % 4 === 2;

/**
 * The wall: edge-to-edge ruled tiles, each playing its figure. Meta top right, name bottom left (Fontshare); hover
 * brings up the actions. `filters`: show the group pills and search (the /figures page). `group`: only one group.
 */
const GROUPS = [[null, "All"], ["object", "Objects"], ["ui", "Interface"]] as const;
export function Wall({ filters = false, group }: { filters?: boolean; group?: "object" | "ui" }) {
  const [cat, setCat] = useState<string | null>(group ?? null);
  const [q, setQ] = useState("");
  const [look, setLook] = useState<Look>(LOOK);
  const lp = lookProps(look);
  const shown = FIGURES.filter((f) => (!cat || f.group === cat) && (!q || `${f.name} ${f.title} ${f.job} ${f.means}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <div>
      {filters && (
        <div className="sticky top-[68px] z-20 flex flex-wrap items-center gap-2 border-y border-rule bg-ground px-4 py-2.5 sm:px-8">
          {GROUPS.map(([c, label]) => (
            <button key={label} type="button" onClick={() => setCat(c)} aria-pressed={cat === c} className="rounded-full border border-rule px-3 py-1 font-mono text-[11px] tracking-[0.04em] text-muted uppercase aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-ground">
              {label} <span className="opacity-60">{c ? FIGURES.filter((f) => f.group === c).length : FIGURES.length}</span>
            </button>
          ))}
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search figures" aria-label="Search figures" className="ml-auto w-full rounded-full border border-rule bg-transparent px-4 py-1.5 text-[14px] outline-none placeholder:text-faint focus:border-ink sm:w-60" />
          <div className="w-full border-t border-rule pt-2.5">
            <LookControls look={look} set={setLook} compact />
          </div>
        </div>
      )}
      <div className={`grid grid-cols-1 gap-px border-b border-rule bg-rule sm:grid-cols-2 xl:grid-cols-3 ${lp.className}`} style={lp.style}>
        {shown.map((f, i) => {
          const inv = inverted(i);
          return (
            <div key={f.name} className={`group relative ${inv ? "tile-inv" : "bg-ground"}`}>
              <Link href={`/figures/${f.name}`} className="block px-[12%] pt-14 pb-16" aria-label={`Inspect ${f.title}`}>
                <Figure name={f.name} quiet gl={!!f.effect} className="w-full transition-transform duration-500 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.03]" />
              </Link>
              <span className={`${LABEL} pointer-events-none absolute top-4 left-5 normal-case`}>{figNo(f.name)}</span>
              <span className={`${LABEL} pointer-events-none absolute top-4 right-5`}>{f.category} · {f.lines} lines</span>
              <div className="pointer-events-none absolute inset-x-5 bottom-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[15px] font-medium">{f.title}</p>
                  <p className="text-[13px] text-muted">{f.job}</p>
                </div>
                <div className="pointer-events-auto flex translate-y-1 items-center gap-1 opacity-0 transition-all duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
                  <CopyButton text={() => fetch(`/iso/html/isoform-${f.name}.html`).then((r) => r.text())} label={`Copy ${f.title} as one HTML file`} />
                  {f.prompt && <CopyButton text={f.prompt} glyph="/" label="Copy the prompt that made it" />}
                  <Link href={`/figures/${f.name}`} className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] text-ground uppercase">
                    Inspect
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        {shown.length === 0 && <p className="col-span-full bg-ground px-8 py-24 text-center text-muted">No figure matches “{q}”.</p>}
        {/* the next figure is yours: fills the row, and stages the install once more (Future Fonts' card on a wall) */}
        {!cat && !q && (
          <div className="flex flex-col justify-between gap-10 bg-ground p-8 sm:col-span-1 xl:col-span-2">
            <p className={LABEL}>Fig. {String(FIGURES.length + 1).padStart(2, "0")} · yours</p>
            <div>
              <p className="max-w-md text-[clamp(1.6rem,2.6vw,2.3rem)] leading-tight font-medium tracking-[-0.03em] text-balance">
                Pick any of the 1,007 Isocons. Your agent draws the next one<span className="text-accent">.</span>
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-rule py-1 pr-1 pl-4">
                  <code className="font-mono text-[13px]"><span className="text-faint select-none">$ </span>/isoform-animate a lighthouse</code>
                  <CopyButton text="/isoform-animate a lighthouse" label="Copy the prompt" />
                </div>
                <Link href="/skill" className="rounded-full bg-accent px-4 py-2 text-[14px] font-medium text-[#05121f]">Get the skill</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
