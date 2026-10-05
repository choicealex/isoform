"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, FIGURES, type FigureMeta } from "@/lib/iso";
import { CopyButton } from "./Copy";
import { Figure } from "./Figure";

/** The catalogue: a rail of Isocons categories with counts, and a grid where every figure plays. */
export function Catalogue() {
  const [cat, setCat] = useState<string | null>(null);
  const shown = cat ? FIGURES.filter((f) => f.category === cat) : FIGURES;
  const count = (c: string) => FIGURES.filter((f) => f.category === c).length;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 pt-10 sm:px-6 md:grid-cols-[200px_1fr]">
      <aside className="md:sticky md:top-24 md:self-start">
        <h1 className="mb-1 text-2xl font-medium tracking-[-0.03em]">Figures</h1>
        <p className="mb-6 text-sm text-muted">Each made by the skill from one prompt.</p>
        <nav className="flex gap-1 overflow-x-auto pb-1 text-sm md:flex-col md:overflow-visible">
          <RailItem label="All" n={FIGURES.length} on={cat === null} pick={() => setCat(null)} />
          {CATEGORIES.map((c) => (
            <RailItem key={c} label={c} n={count(c)} on={cat === c} pick={() => setCat(c)} />
          ))}
        </nav>
      </aside>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((f) => (
          <Card key={f.name} f={f} />
        ))}
      </div>
    </div>
  );
}

function RailItem({ label, n, on, pick }: { label: string; n: number; on: boolean; pick: () => void }) {
  return (
    <button
      type="button"
      onClick={pick}
      aria-pressed={on}
      className="flex shrink-0 items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-muted transition-colors hover:text-ink aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-[0_0_0_1px_var(--rule)]"
    >
      {label}
      <span className="font-mono text-[11px] text-faint tabular-nums">{n}</span>
    </button>
  );
}

/* hover swaps the caption for round actions: copy the page, copy the prompt, open */
function Card({ f }: { f: FigureMeta }) {
  const html = `/iso/html/isoform-${f.name}.html`;
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-rule bg-surface transition-colors hover:border-faint/60">
      <Link href={`/figures/${f.name}`} scroll={false} className="block" aria-label={`Open ${f.title}`}>
        <div className="plus-grid">
          <Figure name={f.name} quiet className="w-full" />
        </div>
      </Link>
      <div className="relative h-[58px] border-t border-rule px-4">
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 transition-all duration-200 group-hover:-translate-y-[70%] group-hover:opacity-0 group-focus-within:opacity-0">
          <p className="text-sm font-medium">{f.title}</p>
          <p className="truncate text-xs text-muted">{f.job}</p>
        </div>
        <div className="absolute inset-x-4 top-1/2 flex translate-y-[-20%] items-center gap-1 opacity-0 transition-all duration-200 group-hover:-translate-y-1/2 group-hover:opacity-100 group-focus-within:-translate-y-1/2 group-focus-within:opacity-100">
          <span className="mr-auto truncate font-mono text-[11px] text-faint">{f.name}</span>
          <CopyButton text={() => fetch(html).then((r) => r.text())} label={`Copy ${f.title} as one HTML file`} />
          <CopyButton text={f.prompt} label="Copy the prompt that made it" glyph="/" />
          <Link href={`/figures/${f.name}`} scroll={false} aria-label={`Open ${f.title}`} className="grid size-7 place-items-center rounded-full bg-ink text-ground">
            <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
