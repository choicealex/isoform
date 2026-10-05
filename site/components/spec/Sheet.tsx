"use client";

import { useState } from "react";
import { FIGURES } from "@/lib/iso";
import { LABEL, figNo } from "@/lib/spec";
import { Filmstrip, Sizes, Views } from "./Icon";

/** The specimen sheet of one figure: its story as frames, its six views, its sizes. One picker drives all three. */
export function Sheet() {
  const [name, setName] = useState("bolt");
  const f = FIGURES.find((x) => x.name === name) ?? FIGURES[0];
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 border-t border-rule px-4 py-3 sm:px-8">
        <span className={`${LABEL} mr-2`}>Specimen of</span>
        {FIGURES.map((g) => (
          <button key={g.name} type="button" onClick={() => setName(g.name)} aria-pressed={g.name === name} className="rounded-full border border-rule px-3 py-1 font-mono text-[11px] tracking-[0.04em] text-muted uppercase transition-colors hover:text-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-ground">
            {g.name}
          </button>
        ))}
        <span className={`${LABEL} ml-auto hidden normal-case md:block`}>{figNo(f.name)} · {f.title} · {f.category}</span>
      </div>

      <Row k="a" title="Frames" note="One loop, held at five moments.">
        <Filmstrip key={name} name={name} />
      </Row>
      <Row k="b" title="Views" note="Isocons draws every icon six ways. The figure animates the marked one.">
        <Views name={name} />
      </Row>
      <Row k="c" title="Sizes" note="The same figure, playing at each width.">
        <Sizes name={name} />
      </Row>
    </div>
  );
}

function Row({ k, title, note, children }: { k: string; title: string; note: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-4 border-t border-rule px-4 pt-6 pb-3 sm:px-8">
        <span className="font-mono text-[11px] text-muted">{k}.</span>
        <h3 className="text-[18px] font-medium tracking-[-0.01em]">{title}</h3>
        <p className="ml-auto text-[14px] text-muted">{note}</p>
      </div>
      {children}
    </div>
  );
}
