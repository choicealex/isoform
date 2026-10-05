"use client";

import { LABEL } from "@/lib/spec";

/*
 * The look of a figure, as Isocons and Overflow offer it: a style, a stroke width (granular, like Isocons' slider)
 * and fill on or off. Paint only: any figure takes any look, nothing remounts. The skill's page has the same
 * options as ?style= ?stroke= ?fill=0.
 */
export type Look = { style: "line" | "plain" | "colour" | "glass" | "heavy" | "isocons"; stroke: number; fill: boolean };
export const LOOK: Look = { style: "line", stroke: 0.9, fill: true };
const STYLES: Look["style"][] = ["line", "plain", "colour", "glass", "heavy", "isocons"];

/** the class and the stroke variable a wrapper needs to give its figures this look */
export const lookProps = (l: Look) => ({
  className: `${l.style === "line" ? "" : `sty-${l.style}`} ${l.fill ? "" : "sty-nofill"}`,
  style: { "--iso-stroke": String(l.stroke) } as React.CSSProperties,
});

export function LookControls({ look, set, compact }: { look: Look; set: (l: Look) => void; compact?: boolean }) {
  /* the engine sizes its outlines to the stroke: tell it after the new look has painted */
  const apply = (l: Look) => { set(l); requestAnimationFrame(() => window.dispatchEvent(new Event("isoform:style"))); };
  const pick = (style: Look["style"]) => apply({ ...look, style, stroke: style === "heavy" ? 1.6 : look.style === "heavy" ? 0.9 : look.stroke });
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${compact ? "" : "text-[14px]"}`}>
      <fieldset className="flex flex-wrap gap-1">
        <legend className="sr-only">Style</legend>
        {STYLES.map((s) => (
          <button key={s} type="button" onClick={() => pick(s)} aria-pressed={look.style === s} className="rounded-full border border-rule px-2.5 py-1 font-mono text-[11px] tracking-[0.04em] text-muted uppercase hover:text-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-ground">
            {s}
          </button>
        ))}
      </fieldset>
      <label className="flex min-w-[180px] flex-1 items-center gap-2">
        <span className={LABEL}>Stroke</span>
        <input
          type="range" min={0.5} max={4} step={0.05} value={look.stroke}
          onChange={(e) => apply({ ...look, stroke: Number(e.target.value) })}
          className="spec-range flex-1" style={{ "--p": `${((look.stroke - 0.5) / 3.5) * 100}%` } as React.CSSProperties}
        />
        <output className="w-10 text-right font-mono text-[12px] tabular-nums text-muted">{look.stroke.toFixed(2)}</output>
      </label>
      <button type="button" onClick={() => apply({ ...look, fill: !look.fill })} aria-pressed={look.fill} className="rounded-full border border-rule px-2.5 py-1 font-mono text-[11px] text-muted uppercase aria-pressed:border-ink aria-pressed:text-ink">
        Fill {look.fill ? "on" : "off"}
      </button>
    </div>
  );
}
