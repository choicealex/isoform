"use client";

/*
 * The Specimen system's small parts: crosshairs, corner-bracket frames with a figure caption, a hairline slider,
 * key caps, mono labels. After vercel.com/font (ruled grid, crosshairs), Displaay (bracket frames, slider row),
 * Commit Mono (key caps). Colours come from the theme tokens, so they work dark and light.
 */
import type { ReactNode } from "react";

export function Cross({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 22" className={`pointer-events-none absolute z-[1] size-[22px] ${className}`} aria-hidden="true">
      <path d="M11 0v22M0 11h22" stroke="var(--muted)" strokeWidth="1" />
    </svg>
  );
}

/** A specimen frame: four corner brackets, a tick at the top, and a centred caption underneath. */
export function Bracket({ caption, children, className = "" }: { caption?: ReactNode; children: ReactNode; className?: string }) {
  const c = "absolute size-5 border-muted/70";
  return (
    <figure className={`relative ${className}`}>
      <span className={`${c} top-0 left-0 rounded-tl-[6px] border-t border-l`} />
      <span className={`${c} top-0 right-0 rounded-tr-[6px] border-t border-r`} />
      <span className={`${c} bottom-0 left-0 rounded-bl-[6px] border-b border-l`} />
      <span className={`${c} right-0 bottom-0 rounded-br-[6px] border-r border-b`} />
      <span className="absolute top-0 left-1/2 h-px w-5 -translate-x-1/2 bg-muted/70" />
      <div className="p-5">{children}</div>
      {caption && <figcaption className="pb-1 text-center font-mono text-[12px] tracking-[0.02em] text-muted">{caption}</figcaption>}
    </figure>
  );
}

/** A hairline slider: label, a 1px track with the filled part in ink, a ring thumb, the live value. */
export function Hairline({ label, value, min = 0, max = 1, step = 0.01, show, onChange }: {
  label: string; value: number; min?: number; max?: number; step?: number; show?: string; onChange: (v: number) => void;
}) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <label className="grid min-w-0 grid-cols-[auto_1fr_auto] items-center gap-3">
      <span className="text-[14px]">{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="spec-range" style={{ "--p": `${p}%` } as React.CSSProperties}
      />
      <output className="w-12 text-right font-mono text-[12px] tabular-nums text-muted">{show ?? value.toFixed(2)}</output>
    </label>
  );
}

export function Key({ children }: { children: ReactNode }) {
  return <kbd className="inline-grid h-[20px] min-w-[20px] place-items-center rounded-[4px] border border-rule px-1 font-mono text-[11px] text-muted">{children}</kbd>;
}
