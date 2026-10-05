"use client";

import { useEffect, useState } from "react";

/* Dark is the default; the choice is remembered. The figures' effects pick up the new colours on isoform:theme. */
export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => { setDark(document.documentElement.dataset.theme !== "light"); }, []);
  /* M flips it from anywhere but a text field */
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key.toLowerCase() === "m" && !e.metaKey && !e.ctrlKey && !t.closest("input, textarea, [contenteditable]")) flip();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  const flip = () => {
    const next = document.documentElement.dataset.theme === "light";
    setDark(next);
    if (next) delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = "light";
    try { localStorage.setItem("isoform-theme-v2", next ? "dark" : "light"); } catch {}
    window.IsoHost?.theme();
  };
  return (
    <button
      type="button"
      onClick={flip}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-rule/60 hover:text-ink"
    >
      <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        {dark ? (
          <path d="M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5Z" strokeLinejoin="round" />
        ) : (
          <>
            <circle cx="8" cy="8" r="3" />
            <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" strokeLinecap="round" />
          </>
        )}
      </svg>
    </button>
  );
}

/* set before paint, so a light reader never sees a dark flash */
export const themeScript = `try{if(localStorage.getItem("isoform-theme-v2")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;
