"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/Copy";
import icons from "@/lib/icons.json";
import { LABEL } from "@/lib/spec";

type Icon = (typeof icons)[number];
const CATS = [...new Set(icons.map((i) => i.category))];
const NOTE: Record<string, string> = {
  axes: "axes guessed",
  tiny: "tiny detail",
  dense: "many faces",
  dots: "dot faces",
};
const PAGE = 120;

/** Every Isocons icon, each with the prompt that animates it and what the sweep found about its default view. */
export function Icons() {
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [n, setN] = useState(PAGE);
  const shown = useMemo(() => {
    const w = q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    return icons.filter((i) => (!cat || i.category === cat) && w.every((x) => `${i.id} ${i.title}`.toLowerCase().includes(x)));
  }, [cat, q]);

  return (
    <div>
      <div className="sticky top-[68px] z-20 flex flex-wrap items-center gap-2 border-y border-rule bg-ground px-4 py-2.5 sm:px-8">
        {[null, ...CATS].map((c) => (
          <button key={c ?? "all"} type="button" onClick={() => { setCat(c); setN(PAGE); }} aria-pressed={cat === c} className="rounded-full border border-rule px-3 py-1 font-mono text-[11px] tracking-[0.04em] text-muted uppercase aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-ground">
            {c ?? "All"} <span className="opacity-60">{c ? icons.filter((i) => i.category === c).length : icons.length}</span>
          </button>
        ))}
        <input value={q} onChange={(e) => { setQ(e.target.value); setN(PAGE); }} placeholder="Search 1,007 icons" aria-label="Search icons" className="ml-auto w-full rounded-full border border-rule bg-transparent px-4 py-1.5 text-[14px] outline-none placeholder:text-faint focus:border-ink sm:w-64" />
      </div>
      <p className={`${LABEL} px-4 py-3 normal-case sm:px-8`}>{shown.length} icons · each one is a prompt away · default view rounded-left</p>
      <div className="grid grid-cols-2 gap-px border-y border-rule bg-rule sm:grid-cols-4 lg:grid-cols-6">
        {shown.slice(0, n).map((i) => <Cell key={i.id} i={i} />)}
        {shown.length === 0 && <p className="col-span-full bg-ground px-8 py-24 text-center text-muted">No icon matches “{q}”.</p>}
      </div>
      {n < shown.length && (
        <div className="flex justify-center py-8">
          <button type="button" onClick={() => setN((x) => x + PAGE * 2)} className="rounded-full border border-rule px-5 py-2 text-[14px] hover:border-ink">
            Show more ({shown.length - n} left)
          </button>
        </div>
      )}
    </div>
  );
}

function Cell({ i }: { i: Icon }) {
  const prompt = `/isoform-animate ${i.id}`;
  return (
    <div className="group relative flex flex-col bg-ground p-3">
      {/* biome-ignore lint/performance/noImgElement: 1,007 small static SVGs, lazy; next/image adds nothing here */}
      <img src={`/iso/all/${i.id}.svg`} alt={i.title} loading="lazy" className="iso-thumb mx-auto my-3 h-20 w-auto opacity-80" />
      <p className="truncate font-mono text-[11px]">{i.id}</p>
      <div className="mt-1 flex min-h-5 flex-wrap gap-1">
        {i.figures.map((f) => (
          <Link key={f} href={`/figures/${f}`} className="rounded-full bg-accent px-1.5 font-mono text-[10px] text-[#05121f]">{f}</Link>
        ))}
        {i.flags.map((f) => (
          <span key={f} title={i.clean.length ? `clean views: ${i.clean.join(", ")}` : undefined} className="rounded-full border border-rule px-1.5 font-mono text-[10px] text-muted">{NOTE[f] ?? f}</span>
        ))}
      </div>
      <div className="absolute top-2 right-2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <CopyButton text={prompt} glyph="/" label={`Copy the prompt: ${prompt}`} />
      </div>
    </div>
  );
}
