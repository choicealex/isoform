"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EXAMPLE_NOTE, type FigureMeta } from "@/lib/iso";
import { CopyButton } from "./Copy";
import { Figure, type FigureControls } from "./Figure";

const SPEEDS = [0.5, 1, 2];

/** One figure, opened: large, with its controls, how to get it, and its credit. It has its own URL. */
export function Drawer({ f }: { f: FigureMeta }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [intensity, setIntensity] = useState(0.5);
  const [speed, setSpeed] = useState(1);
  const [gl, setGl] = useState(false);
  const [tab, setTab] = useState<"prompt" | "html" | "embed">("prompt");
  const fig = useRef<FigureControls>(null);
  const html = `/iso/html/isoform-${f.name}.html`;

  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true));
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", key);
    return () => { cancelAnimationFrame(id); window.removeEventListener("keydown", key); };
  });
  const close = () => { setOpen(false); setTimeout(() => router.push("/figures", { scroll: false }), 260); };

  const code = {
    prompt: f.prompt ?? EXAMPLE_NOTE,
    html: `isoform-${f.name}.html   (${f.lines} lines of figure + the engine, one file)`,
    embed: `<iframe src="isoform-${f.name}.html" title="${f.title}" style="border:0;width:100%;aspect-ratio:5/4"></iframe>`,
  }[tab];

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={f.title}>
      <button type="button" aria-label="Close" onClick={close} className={`absolute inset-0 bg-ink/10 backdrop-blur-[2px] transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col overflow-y-auto border-l border-rule bg-surface transition-transform duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <p className="font-mono text-[11px] text-faint">{f.category}</p>
          <button type="button" onClick={close} aria-label="Close" className="grid size-8 place-items-center rounded-full text-muted hover:bg-rule/60 hover:text-ink">
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" /></svg>
          </button>
        </div>

        <div className="plus-grid mx-5 overflow-hidden rounded-2xl border border-rule">
          <Figure ref={fig} name={f.name} intensity={intensity} speed={speed} gl={gl} className="w-full" />
        </div>

        <div className="grid gap-5 px-5 py-5">
          <div>
            <h2 className="text-xl font-medium tracking-[-0.02em]">{f.title}</h2>
            <p className="mt-1.5 text-sm text-pretty text-muted">{f.means}</p>
            {f.effect && <p className="mt-1.5 text-sm text-pretty text-faint">Effect: {f.effect}</p>}
            <p className="mt-3 inline-block rounded-full bg-ground px-2.5 py-1 font-mono text-[11px] text-muted">In a product: {f.job}</p>
          </div>

          <label className="grid gap-1.5">
            <span className="flex justify-between font-mono text-[11px] text-faint uppercase tracking-wider">
              Intensity <output className="text-ink tabular-nums">{intensity.toFixed(2)}</output>
            </span>
            <input type="range" min={0} max={1} step={0.01} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="hairline w-full" />
          </label>

          <div className="flex items-center gap-2">
            <div className="flex flex-1 gap-1 rounded-full bg-ground p-1">
              {SPEEDS.map((s) => (
                <button key={s} type="button" onClick={() => setSpeed(s)} aria-pressed={speed === s} className="flex-1 rounded-full py-1 font-mono text-xs text-muted aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-sm">
                  {s}×
                </button>
              ))}
            </div>
            <button type="button" onClick={() => fig.current?.replay()} className="rounded-full border border-rule px-3.5 py-1.5 text-sm hover:border-ink">Replay</button>
            {f.effect && (
              <button type="button" onClick={() => setGl((g) => !g)} aria-pressed={gl} className="rounded-full border border-rule px-3.5 py-1.5 text-sm text-muted hover:border-ink aria-pressed:border-accent aria-pressed:text-ink">
                Effect
              </button>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-rule">
            <div className="flex items-center gap-1 border-b border-rule bg-ground px-2 py-1.5">
              {(["prompt", "html", "embed"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setTab(t)} aria-pressed={tab === t} className="rounded-full px-2.5 py-1 font-mono text-[11px] text-faint aria-pressed:bg-surface aria-pressed:text-ink">
                  {{ prompt: "Prompt", html: "HTML", embed: "Embed" }[t]}
                </button>
              ))}
              <span className="ml-auto" />
              {tab === "html" ? (
                <a href={html} download className="rounded-full px-2.5 py-1 text-xs hover:bg-rule/70">Download</a>
              ) : null}
              <CopyButton text={tab === "html" ? () => fetch(html).then((r) => r.text()) : code} label={`Copy ${tab}`} />
            </div>
            <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-muted">{code}</pre>
          </div>

          <p className="text-xs text-pretty text-faint">
            Icon “{f.title}” ({f.variant}) from{" "}
            <a className="underline underline-offset-2 hover:text-ink" href="https://isocons.app">Isocons</a>, licensed{" "}
            <a className="underline underline-offset-2 hover:text-ink" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Split into parts and animated. The
            credit travels inside the HTML file. <Link href="/skill" className="text-muted hover:text-ink">Make your own →</Link>
          </p>
        </div>
      </aside>
    </div>
  );
}
