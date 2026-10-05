"use client";

import Link from "next/link";
import { useState } from "react";
import { Figure } from "@/components/Figure";
import { LABEL } from "@/lib/spec";

/* Overflow.design's styles over our own figures, to choose from. CSS only, plus a ground slab drawn under the stage */
const STYLES = [
  { k: "line", name: "Line", note: "Today: hairline, one blue accent", cls: "", slab: false },
  { k: "slab", name: "Line + slab", note: "Every figure on one ground plate", cls: "", slab: true },
  { k: "plain", name: "Plain", note: "Grey faces, the acting part solid", cls: "sty-plain", slab: true },
  { k: "colour", name: "Colour", note: "Warm tints, the acting part blue", cls: "sty-colour", slab: true },
  { k: "glass", name: "Glass", note: "The acting part see-through", cls: "sty-glass", slab: true },
  { k: "heavy", name: "Heavy", note: "Overflow's one heavy ink stroke", cls: "sty-heavy", slab: true },
];
const FIGS = ["water-bottle", "bolt", "shopping-cart", "car"];

/* a rounded isometric plate with thickness, under the figure (stage units: 400 × 320) */
function Slab({ colour }: { colour: boolean }) {
  const cx = 200, cy = 236, a = 146, b = 73, t = 9;
  const top = `M${cx} ${cy - b} L${cx + a} ${cy} L${cx} ${cy + b} L${cx - a} ${cy} Z`;
  const side = `M${cx - a} ${cy} L${cx - a} ${cy + t} L${cx} ${cy + b + t} L${cx + a} ${cy + t} L${cx + a} ${cy} L${cx} ${cy + b} Z`;
  const ink = colour ? "#2b2b30" : "var(--iso-edge)";
  return (
    <svg viewBox="0 0 400 320" className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
      <path d={side} fill={colour ? "#a9c4b4" : "var(--iso-face)"} stroke={ink} strokeWidth="1" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={top} fill={colour ? "#c9dccf" : "var(--iso-face)"} stroke={ink} strokeWidth="1" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Styles() {
  const [light, setLight] = useState(true);
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ground text-ink" data-theme-lab={light ? "light" : "dark"} style={light ? ({ "--ground": "#fafafa", "--ink": "#171717", "--muted": "#6f6f6f", "--rule": "#e5e5e5", "--iso-plate": "#ffffff", "--iso-face": "#ffffff", "--iso-edge": "#8e8e97", "--iso-lo": "#a9a9b1", "--iso-hi": "#229eff" } as React.CSSProperties) : undefined}>
      <div className="flex items-center gap-4 border-b border-rule px-6 py-4">
        <Link href="/lab" className="font-mono text-[12px] text-muted">← Lab</Link>
        <h1 className="text-[18px] font-medium">Styles, after overflow.design</h1>
        <button type="button" onClick={() => setLight((l) => !l)} className="ml-auto rounded-full border border-rule px-3 py-1 font-mono text-[11px] uppercase">{light ? "Dark" : "Light"}</button>
      </div>
      <div className="grid grid-cols-[repeat(6,minmax(220px,1fr))] overflow-x-auto">
        {STYLES.map((s) => (
          <div key={s.k} className="border-r border-rule">
            <div className="sticky top-0 z-10 h-[76px] border-b border-rule bg-ground px-4 py-3">
              <p className="text-[15px] font-medium">{s.name}</p>
              <p className={`${LABEL} mt-0.5 normal-case`}>{s.note}</p>
            </div>
            {FIGS.map((n) => (
              <div key={n} className={`relative border-b border-rule ${s.cls}`}>
                {s.slab && <Slab colour={s.k === "colour"} />}
                <Figure name={n} quiet className="w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
