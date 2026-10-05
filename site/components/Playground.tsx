"use client";

import { useRef, useState } from "react";
import { FIGURES } from "@/lib/iso";
import { CopyButton } from "./Copy";
import { Figure, type FigureControls } from "./Figure";

const SPEEDS = [0.5, 1, 2];

/** One figure, large, with every control the figure takes: pick, intensity, speed, effect, replay. */
export function Playground() {
  const [name, setName] = useState(FIGURES[0].name);
  const [intensity, setIntensity] = useState(0.5);
  const [speed, setSpeed] = useState(1);
  const [gl, setGl] = useState(false);
  const fig = useRef<FigureControls>(null);
  const meta = FIGURES.find((f) => f.name === name) ?? FIGURES[0];
  const html = `/iso/html/isoform-${meta.name}.html`;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="plus-grid overflow-hidden rounded-3xl border border-rule">
        <Figure ref={fig} name={name} intensity={intensity} speed={speed} gl={gl} className="w-full" />
      </div>

      <div className="flex flex-col gap-5 rounded-3xl border border-rule bg-surface p-5">
        <div>
          <p className="mb-2 font-mono text-[11px] text-faint uppercase tracking-wider">Figure</p>
          <div className="flex flex-wrap gap-1.5">
            {FIGURES.map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => { setName(f.name); setGl(false); }}
                aria-pressed={f.name === name}
                className="rounded-full border border-rule px-3 py-1 text-xs text-muted transition-colors hover:text-ink aria-pressed:border-ink aria-pressed:text-ink"
              >
                {f.title}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-pretty text-muted">{meta.means}</p>

        <label className="grid gap-2">
          <span className="flex justify-between font-mono text-[11px] text-faint uppercase tracking-wider">
            Intensity <output className="text-ink tabular-nums">{intensity.toFixed(2)}</output>
          </span>
          <input type="range" min={0} max={1} step={0.01} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="hairline w-full" />
        </label>

        <div className="grid gap-2">
          <span className="font-mono text-[11px] text-faint uppercase tracking-wider">Speed</span>
          <div className="flex gap-1 rounded-full bg-ground p-1">
            {SPEEDS.map((s) => (
              <button key={s} type="button" onClick={() => setSpeed(s)} aria-pressed={speed === s} className="flex-1 rounded-full py-1 font-mono text-xs text-muted aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-sm">
                {s}×
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => fig.current?.replay()} className="flex-1 rounded-full border border-rule py-2 text-sm hover:border-ink">
            Replay
          </button>
          {meta.effect && (
            <button type="button" onClick={() => setGl((g) => !g)} aria-pressed={gl} className="flex-1 rounded-full border border-rule py-2 text-sm text-muted hover:border-ink aria-pressed:border-accent aria-pressed:text-ink">
              Effect {gl ? "on" : "off"}
            </button>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2 rounded-2xl bg-ground py-1.5 pr-1.5 pl-3">
          <code className="truncate font-mono text-xs text-muted">isoform-{meta.name}.html</code>
          <a href={html} download className="ml-auto rounded-full px-2.5 py-1 text-xs hover:bg-rule/70">Download</a>
          <CopyButton text={() => fetch(html).then((r) => r.text())} label="Copy the page" />
        </div>
      </div>
    </div>
  );
}
