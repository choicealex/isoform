"use client";

import { useState } from "react";
import { Figure } from "@/components/Figure";
import { figureByName } from "@/lib/iso";
import { LABEL, figNo } from "@/lib/spec";

/* the hero icon from each side Isocons draws it, and the figure that plays it from there */
const SIDES = [
  ["left", "rocket"],
  ["top", "rocket-top"],
  ["right", "rocket-right"],
] as const;

/**
 * The hero's figure, with a direction switch in its corner (left, top, right): choosing one plays the figure made from
 * the drawing Isocons makes of the rocket from that side.
 */
export function HeroPlate() {
  const [side, setSide] = useState<(typeof SIDES)[number][0]>("left");
  const name = SIDES.find(([s]) => s === side)?.[1] ?? "rocket";
  const f = figureByName(name);
  const base = figureByName("rocket");
  return (
    <>
      <p className={`${LABEL} absolute top-5 left-12 normal-case`}>{figNo("rocket")} — {base?.title}</p>
      <p className={`${LABEL} absolute top-5 right-6`}>{f?.icon} · {f?.variant}</p>
      <p className={`${LABEL} absolute right-12 bottom-5 normal-case`}>{f?.lines} lines · plays on its own, hover or tap takes over</p>
      {/* the direction switch, in words as Isocons' own controls; above the stage, which covers the plate */}
      <fieldset className="absolute bottom-14 left-4 z-10 flex gap-0.5 rounded-full border border-rule bg-ground/80 p-0.5 backdrop-blur-sm sm:bottom-4 sm:left-5">
        <legend className="sr-only">Direction</legend>
        {SIDES.map(([s]) => (
          <button key={s} type="button" onClick={() => setSide(s)} aria-pressed={s === side} aria-label={`The rocket from the ${s}`} className="rounded-full px-3 py-1 font-mono text-[11px] tracking-[0.06em] text-muted uppercase transition-colors hover:text-ink aria-pressed:bg-ink aria-pressed:text-ground">
            {s}
          </button>
        ))}
      </fieldset>
      <div className="relative mx-auto flex h-full max-w-[640px] items-center px-8 py-16">
        <Figure key={name} name={name} quiet gl className="w-full" />
      </div>
    </>
  );
}
