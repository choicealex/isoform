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
 * The hero's figure, with a direction switch in its corner: the rocket as Isocons draws it from the left, the top and
 * the right; choosing one plays the figure made from that drawing.
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
      <fieldset className="absolute bottom-14 left-4 flex items-end gap-1 sm:bottom-4 sm:left-5">
        <legend className="sr-only">Direction</legend>
        {SIDES.map(([s, n]) => {
          const on = s === side;
          return (
            <button key={s} type="button" onClick={() => setSide(s)} aria-pressed={on} aria-label={`The rocket from the ${s}`} className="flex flex-col items-center gap-1.5 rounded-lg px-1.5 pt-1.5 pb-1 transition-colors hover:bg-rule/50">
              {/* biome-ignore lint/performance/noImgElement: three small static Isocons SVGs */}
              <img src={`/iso/icons/rocket/rounded-${s}.svg`} alt="" className={`iso-thumb h-9 w-auto sm:h-11 ${on ? "opacity-95" : "opacity-45"}`} />
              <span className={`font-mono text-[9px] tracking-[0.08em] uppercase ${on ? "text-accent" : "text-faint"}`}>{s}</span>
            </button>
          );
        })}
      </fieldset>
      <div className="relative mx-auto flex h-full max-w-[640px] items-center px-8 py-16">
        <Figure key={name} name={name} quiet gl className="w-full" />
      </div>
    </>
  );
}
