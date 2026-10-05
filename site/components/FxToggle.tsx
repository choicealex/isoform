"use client";

import { useEffect, useState } from "react";

/*
 * Effects on or off for every figure on the site (on by default, the owner's call). The choice lives on
 * <html data-fx="off">, is remembered, and is announced with isoform:fx so figures remount with or without their
 * WebGL layer. E flips it, as M flips the theme.
 */
/* the saved choice is the truth: React's hydration resets <html>'s attributes to the server's, so data-fx (set before
   paint by lib/prefs.ts) is re-applied from storage once mounted */
const read = () => { try { return localStorage.getItem("isoform-fx") !== "off"; } catch { return true; } };
const apply = (on: boolean) => { if (on) delete document.documentElement.dataset.fx; else document.documentElement.dataset.fx = "off"; };

/** whether the reader has effects on; figures pass it into their gl prop */
export function useFx() {
  const [on, setOn] = useState(read); // first render already knows, so no effect layer opens and closes on load
  useEffect(() => {
    apply(read());
    setOn(read());
    const sync = () => setOn(read());
    window.addEventListener("isoform:fx", sync);
    return () => window.removeEventListener("isoform:fx", sync);
  }, []);
  return on;
}

export function FxToggle() {
  const on = useFx();
  const flip = () => {
    const next = !read();
    try { localStorage.setItem("isoform-fx", next ? "on" : "off"); } catch {}
    apply(next);
    window.dispatchEvent(new Event("isoform:fx"));
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key.toLowerCase() === "e" && !e.metaKey && !e.ctrlKey && !t.closest("input, textarea, [contenteditable]")) flip();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  return (
    <button
      type="button"
      onClick={flip}
      aria-pressed={on}
      aria-label={on ? "Turn effects off" : "Turn effects on"}
      title="Effects (E)"
      className="flex h-8 items-center gap-1.5 rounded-full px-2.5 font-mono text-[11px] text-muted uppercase transition-colors hover:bg-rule/60 hover:text-ink aria-pressed:text-ink"
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 1.8c.4 2 1.8 3.2 3.4 3.9-1.6.7-3 1.9-3.4 3.9-.4-2-1.8-3.2-3.4-3.9C6.2 5 7.6 3.8 8 1.8Z" fill={on ? "var(--accent)" : "none"} stroke={on ? "var(--accent)" : "currentColor"} />
        <path d="M12.5 10.2c.2.9.8 1.5 1.6 1.8-.8.3-1.4.9-1.6 1.8-.2-.9-.8-1.5-1.6-1.8.8-.3 1.4-.9 1.6-1.8Z" />
      </svg>
      FX {on ? "on" : "off"}
    </button>
  );
}
