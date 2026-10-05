"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy", glyph, className = "" }: { text: string | (() => Promise<string>); label?: string; glyph?: string; className?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(typeof text === "string" ? text : await text());
      setDone(true);
      setTimeout(() => setDone(false), 1400);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={done ? "Copied" : label}
      className={`grid size-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-rule/70 hover:text-ink ${className}`}
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {done ? <path d="m3.5 8.5 3 3 6-7" /> : glyph ? <text x="8" y="11.5" textAnchor="middle" fill="currentColor" stroke="none" style={{ font: "500 10px var(--font-geist-mono)" }}>{glyph}</text> : <><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" /><path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" /></>}
      </svg>
    </button>
  );
}

const METHODS = [
  { id: "skills", label: "skills", cmd: "npx skills add choicealex/isoform" },
  { id: "use", label: "then ask", cmd: "/isoform-animate a lighthouse" },
];

/** The install line: how to add the skill, and what to type once it is added. */
export function InstallPill() {
  const [m, setM] = useState(METHODS[0]);
  return (
    <div className="inline-flex max-w-full flex-col rounded-2xl border border-rule bg-surface p-1 text-sm">
      <div className="flex gap-1 px-1 pt-0.5">
        {METHODS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setM(x)}
            aria-pressed={m.id === x.id}
            className="rounded-full px-2.5 py-1 font-mono text-[11px] text-faint transition-colors aria-pressed:bg-ground aria-pressed:text-ink"
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 py-1 pr-1 pl-3">
        <code className="truncate font-mono text-[13px]">
          <span className="text-faint select-none">$ </span>
          {m.cmd}
        </code>
        <CopyButton text={m.cmd} label="Copy command" />
      </div>
    </div>
  );
}
