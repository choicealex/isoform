"use client";

import { useEffect, useState } from "react";

/*
 * The effect strength for every figure on the site: bold (the default, the owner's call), subtle (the first, quiet
 * version: material under the lines), or off. The choice lives on <html data-fx>, is remembered, and is announced with
 * isoform:fx so figures follow. E steps through it, as M flips the theme.
 */
export type Fx = "bold" | "subtle" | "off";
const LEVELS: Fx[] = ["bold", "subtle", "off"];

/* the saved choice is the truth: React's hydration resets <html>'s attributes to the server's, so data-fx (set before
   paint by lib/prefs.ts) is re-applied from storage once mounted */
const read = (): Fx => {
  try { const f = localStorage.getItem("isoform-fx"); return f === "off" || f === "subtle" ? f : "bold"; } catch { return "bold"; }
};
const apply = (f: Fx) => { if (f === "bold") delete document.documentElement.dataset.fx; else document.documentElement.dataset.fx = f; };

/** the reader's effect strength; figures pass it into their gl prop */
export function useFx() {
  /* the first render matches the server ("bold"), or hydration fails and React rebuilds the tree; storage is read just after */
  const [fx, setFx] = useState<Fx>("bold");
  useEffect(() => {
    apply(read());
    setFx(read());
    const sync = () => setFx(read());
    window.addEventListener("isoform:fx", sync);
    return () => window.removeEventListener("isoform:fx", sync);
  }, []);
  return fx;
}

export function FxToggle() {
  const fx = useFx();
  const step = () => {
    const next = LEVELS[(LEVELS.indexOf(read()) + 1) % LEVELS.length];
    try { localStorage.setItem("isoform-fx", next); } catch {}
    apply(next);
    window.dispatchEvent(new Event("isoform:fx"));
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key.toLowerCase() === "e" && !e.metaKey && !e.ctrlKey && !t.closest("input, textarea, [contenteditable]")) step();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  return (
    <button
      type="button"
      onClick={step}
      aria-label={`Effects: ${fx}. Change`}
      title="Effects: bold, subtle, off (E)"
      className="flex h-8 items-center gap-1.5 rounded-full px-2.5 font-mono text-[11px] text-muted uppercase transition-colors hover:bg-rule/60 hover:text-ink"
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 1.8c.4 2 1.8 3.2 3.4 3.9-1.6.7-3 1.9-3.4 3.9-.4-2-1.8-3.2-3.4-3.9C6.2 5 7.6 3.8 8 1.8Z" fill={fx === "bold" ? "var(--accent)" : "none"} stroke={fx === "off" ? "currentColor" : "var(--accent)"} />
        <path d="M12.5 10.2c.2.9.8 1.5 1.6 1.8-.8.3-1.4.9-1.6 1.8-.2-.9-.8-1.5-1.6-1.8.8-.3 1.4-.9 1.6-1.8Z" />
      </svg>
      FX {fx}
    </button>
  );
}
