"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CopyButton } from "@/components/Copy";
import { Figure, type FigureControls } from "@/components/Figure";
import { EXAMPLE_NOTE, FIGURES, figureByName } from "@/lib/iso";
import { LABEL, figNo } from "@/lib/spec";
import { Axes, Lattice } from "./Icon";
import { LOOK, type Look, LookControls, lookProps } from "./Look";
import { Hairline } from "./Parts";

/**
 * The inspector (after Inter's glyph view): one figure large on its isometric construction grid with Solid / Parts,
 * its controls and code; beside it every figure as a ruled cell, the selected one
 * inverted. `linked`: cells are links to /figures/<name> (the figure pages); otherwise they switch in place.
 */
export function Inspector({ name: start, linked = false }: { name: string; linked?: boolean }) {
  const [name, setName] = useState(start);
  const [tab, setTab] = useState<"solid" | "parts">("solid");
  const [intensity, setIntensity] = useState(0.5);
  const [speed, setSpeed] = useState(1);
  const [gl, setGl] = useState(false);
  const [code, setCode] = useState<"prompt" | "html" | "embed">("prompt");
  const [look, setLook] = useState<Look>(LOOK);
  const lp = lookProps(look);
  const fig = useRef<FigureControls>(null);
  const f = figureByName(name) ?? FIGURES[0];
  const i = FIGURES.indexOf(f);
  const html = `/iso/html/isoform-${f.name}.html`;
  useEffect(() => setName(start), [start]);

  /* ← → step through the figures, Space replays: only where the inspector is the page (it would steal scrolling) */
  useEffect(() => {
    if (!linked) return;
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (step) {
        const next = FIGURES[(i + step + FIGURES.length) % FIGURES.length].name;
        if (linked) window.history.replaceState(null, "", `/figures/${next}`);
        setName(next);
        setGl(false);
      } else if (e.key === " ") {
        e.preventDefault();
        fig.current?.replay();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [i, linked]);

  const snippet = {
    prompt: f.prompt ?? EXAMPLE_NOTE,
    html: `isoform-${f.name}.html   one file: the engine, the icon and the figure`,
    embed: `<iframe src="isoform-${f.name}.html" title="${f.title}" style="border:0;width:100%;aspect-ratio:5/4"></iframe>`,
  }[code];

  return (
    <div className={`grid border-y border-rule lg:grid-cols-2 ${lp.className}`} style={lp.style}>
      {/* left: the figure, large, on its metric lines */}
      <div className="border-rule lg:border-r">
        <div className="grid grid-cols-2 border-b border-rule text-[15px]">
          {(["solid", "parts"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`py-3.5 capitalize transition-colors ${tab === t ? "shadow-[inset_0_-2px_0_var(--ink)]" : "text-muted hover:text-ink"}`}>
              {t}
            </button>
          ))}
        </div>
        {/* the figure on its isometric construction grid, labelled at the corners like a plate */}
        <div className="relative px-6 py-14 sm:px-16">
          <Lattice id="inspector-lattice" />
          <p className={`${LABEL} absolute top-4 left-5 normal-case`}>{figNo(f.name)}</p>
          <p className={`${LABEL} absolute top-4 right-5`}>{f.icon} · {f.variant}</p>
          <p className={`${LABEL} absolute right-5 bottom-4 normal-case`}>intensity {intensity.toFixed(2)} → {Math.round((f.range[0] + (intensity <= 0.5 ? (f.range[1] - f.range[0]) * intensity * 2 : (f.range[1] - f.range[0]) + (f.range[2] - f.range[1]) * (intensity - 0.5) * 2)) * 100) / 100}</p>
          <Axes className="bottom-2 left-3" />
          <div className={`relative ${tab === "parts" ? "[&_.iso-stage_.icon_*]:!stroke-[var(--iso-hi)] [&_.iso-stage_.icon_*]:!fill-[color-mix(in_srgb,var(--iso-hi)_7%,transparent)]" : ""}`}>
            <Figure key={`${f.name}-${tab}-${gl}`} ref={fig} name={f.name} intensity={intensity} speed={speed} gl={gl} t={tab === "parts" ? 0 : undefined} className="w-full" />
          </div>
        </div>
        <div className="grid gap-4 border-t border-rule px-6 py-5 sm:px-8">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-[22px] font-medium tracking-[-0.02em]">{f.title}</h3>
            <span className="font-mono text-[12px] text-muted">{figNo(f.name)} · {f.category}</span>
          </div>
          <p className="text-[15px] text-pretty text-muted">{f.means}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Hairline label="Intensity" value={intensity} onChange={setIntensity} />
            <Hairline label="Speed" value={speed} min={0.25} max={2} step={0.05} show={`${speed.toFixed(2)}×`} onChange={setSpeed} />
          </div>
          <LookControls look={look} set={setLook} compact />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => fig.current?.replay()} className="rounded-full border border-rule px-3.5 py-1.5 text-[14px] hover:border-ink">Replay</button>
            {f.effect && (
              <button type="button" onClick={() => setGl((g) => !g)} aria-pressed={gl} className="rounded-full border border-rule px-3.5 py-1.5 text-[14px] text-muted hover:border-ink aria-pressed:border-accent aria-pressed:text-ink">
                Effect {gl ? "on" : "off"}
              </button>
            )}
            <a href={html} download className="ml-auto rounded-full border border-rule px-3.5 py-1.5 text-[14px] hover:border-ink">Download ↓</a>
          </div>
          <div className="overflow-hidden rounded-xl border border-rule">
            <div className="flex items-center gap-1 border-b border-rule px-2 py-1.5">
              {(["prompt", "html", "embed"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setCode(t)} aria-pressed={code === t} className="rounded-full px-2.5 py-1 font-mono text-[11px] text-muted aria-pressed:bg-ink aria-pressed:text-ground">
                  {{ prompt: "Prompt", html: "HTML", embed: "Embed" }[t]}
                </button>
              ))}
              <CopyButton text={code === "html" ? () => fetch(html).then((r) => r.text()) : snippet} label={`Copy ${code}`} className="ml-auto" />
            </div>
            <pre className="overflow-x-auto px-4 py-3 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-muted">{snippet}</pre>
          </div>
          <p className="text-[12px] text-pretty text-faint">
            Icon “{f.title}” ({f.variant}) from <a className="underline underline-offset-2 hover:text-ink" href="https://isocons.app">Isocons</a>, CC BY 4.0. The credit travels inside the file.
          </p>
        </div>
      </div>

      {/* right: every figure as a ruled cell; the selected one inverted */}
      <div className="grid auto-rows-min grid-cols-2 border-t border-rule sm:grid-cols-3 lg:border-t-0">
        {FIGURES.map((g) => {
          const on = g.name === f.name;
          const cell = (
            <>
              <Figure name={g.name} quiet className="w-full" />
              <span className={`${LABEL} absolute top-2 right-3 normal-case ${on ? "text-ground/60" : ""}`}>{figNo(g.name)}</span>
              <span className={`${LABEL} absolute bottom-2 left-3 ${on ? "text-ground" : ""}`}>{g.name}</span>
            </>
          );
          const cls = `relative block border-r border-b border-rule p-3 transition-colors ${on ? "bg-ink" : "hover:bg-[color-mix(in_srgb,var(--ink)_4%,transparent)]"}`;
          const inv = on ? ({ "--iso-plate": "var(--ink)", "--iso-face": "var(--ink)", "--iso-edge": "var(--ground)", "--iso-lo": "color-mix(in srgb, var(--ground) 30%, var(--ink))" } as React.CSSProperties) : undefined;
          return linked ? (
            <Link key={g.name} href={`/figures/${g.name}`} scroll={false} className={cls} style={inv} aria-current={on ? "page" : undefined}>{cell}</Link>
          ) : (
            <button key={g.name} type="button" onClick={() => { setName(g.name); setGl(false); }} className={`${cls} text-left`} style={inv} aria-pressed={on}>{cell}</button>
          );
        })}
        {/* empty cells to the end of the row: the set is still growing */}
        {Array.from({ length: (3 - (FIGURES.length % 3)) % 3 }, (_, k) => FIGURES.length + k + 1).map((n) => (
          <div key={n} className="relative hidden aspect-[5/4] border-r border-b border-rule sm:block">
            <span className={`${LABEL} absolute top-2 right-3 normal-case opacity-50`}>Fig. {String(n).padStart(2, "0")}</span>
            <span className={`${LABEL} absolute bottom-2 left-3 opacity-50`}>next</span>
          </div>
        ))}
      </div>
    </div>
  );
}
