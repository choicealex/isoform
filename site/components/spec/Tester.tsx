"use client";

import { useRef, useState } from "react";
import { Figure, type FigureControls } from "@/components/Figure";
import { FIGURES } from "@/lib/iso";
import { figNo } from "@/lib/spec";
import { Bracket, Hairline } from "./Parts";

/** The tester (after Displaay's type tester): one figure, large, with its axes as a row of hairline sliders. */
export function Tester() {
  const [name, setName] = useState("car");
  const [intensity, setIntensity] = useState(0.5);
  const [speed, setSpeed] = useState(1);
  const [gl, setGl] = useState(true);
  const fig = useRef<FigureControls>(null);
  const f = FIGURES.find((x) => x.name === name) ?? FIGURES[0];

  return (
    <div className="border-y border-rule bg-surface">
      <div className="grid gap-x-10 gap-y-4 border-b border-rule px-4 py-5 sm:px-8 md:grid-cols-[1fr_1fr_auto]">
        <Hairline label="Intensity" value={intensity} onChange={setIntensity} />
        <Hairline label="Speed" value={speed} min={0.25} max={2} step={0.05} show={`${speed.toFixed(2)}×`} onChange={setSpeed} />
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => fig.current?.replay()} className="rounded-full border border-rule px-3.5 py-1.5 text-[14px] hover:border-ink">Replay</button>
          <button type="button" disabled={!f.effect} onClick={() => setGl((g) => !g)} aria-pressed={gl && !!f.effect} className="rounded-full border border-rule px-3.5 py-1.5 text-[14px] text-muted hover:border-ink disabled:opacity-40 aria-pressed:border-accent aria-pressed:text-ink">
            Effect
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-[860px] px-4 py-10">
        <Bracket caption={`${figNo(f.name)} — ${f.title}, ${f.job.toLowerCase()}`}>
          <Figure ref={fig} name={name} intensity={intensity} speed={speed} gl={gl && !!f.effect} className="w-full" />
        </Bracket>
      </div>
      <div className="flex flex-wrap justify-center gap-1 border-t border-rule px-4 py-3">
        {FIGURES.map((g) => (
          <button key={g.name} type="button" onClick={() => setName(g.name)} aria-pressed={g.name === name} className="rounded-full px-3 py-1 font-mono text-[11px] tracking-[0.04em] text-muted uppercase hover:text-ink aria-pressed:bg-ink aria-pressed:text-ground">
            {g.name}
          </button>
        ))}
      </div>
    </div>
  );
}
