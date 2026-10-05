"use client";

import { useEffect, useState } from "react";

/* Light is the default; the choice is remembered. The figures' effects pick up the new colours on isoform:theme. */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.dataset.theme === "dark"); }, []);
  const flip = () => {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem("isoform-theme", next ? "dark" : "light"); } catch {}
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

/* set before paint, so a dark reader never sees a light flash */
export const themeScript = `try{if(localStorage.getItem("isoform-theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;
