"use client";

/*
 * The icon-specimen parts: what a type specimen shows for a typeface (metrics, glyph overview, weights, sizes), shown
 * for an animated isometric icon (construction grid, the set, its frames over time, its six views, its sizes).
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { Figure } from "@/components/Figure";
import { FIGURES, figureByName } from "@/lib/iso";
import { LABEL, figNo } from "@/lib/spec";

/** The isometric construction grid: a triangular dot lattice with faint 30° rules, filling its parent. */
export function Lattice({ step = 28, lines = true, id }: { step?: number; lines?: boolean; id: string }) {
  const w = step * Math.sqrt(3), h = step;
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
          {lines && (
            <path d={`M0 ${h} L${w} 0 M0 0 L${w} ${h} M0 ${h / 2} L${w / 2} 0 M${w / 2} ${h} L${w} ${h / 2} M0 ${h / 2} L${w / 2} ${h} M${w / 2} 0 L${w} ${h / 2}`} stroke="var(--rule)" strokeWidth="0.6" fill="none" opacity="0.7" />
          )}
          <circle cx="0" cy="0" r="1" fill="var(--faint)" />
          <circle cx={w} cy="0" r="1" fill="var(--faint)" />
          <circle cx="0" cy={h} r="1" fill="var(--faint)" />
          <circle cx={w} cy={h} r="1" fill="var(--faint)" />
          <circle cx={w / 2} cy={h / 2} r="1" fill="var(--faint)" />
        </pattern>
        <radialGradient id={`${id}-fade`}>
          <stop offset="35%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} mask={`url(#${id}-mask)`} />
    </svg>
  );
}

/** The axis marker of the construction grid: u down-right, v down-left, up. */
/** The icon as Isocons draws it from the left, the top and the right (same edges as the figure); the one the figure
    animates is marked. For the hero's corner: what the icon is, before it moves. */
export function ThreeViews({ icon, variant, className = "" }: { icon: string; variant: string; className?: string }) {
  const edge = variant.split("-")[0];
  const sides = ["left", "top", "right"] as const;
  return (
    <div role="img" className={`pointer-events-none absolute flex items-end gap-3 ${className}`} aria-label={`${icon}, as Isocons draws it from the left, top and right`}>
      {sides.map((s) => {
        const on = variant === `${edge}-${s}`;
        return (
          <div key={s} className="flex flex-col items-center gap-1.5">
            {/* biome-ignore lint/performance/noImgElement: three small static Isocons SVGs */}
            <img src={`/iso/icons/${icon}/${edge}-${s}.svg`} alt="" className={`iso-thumb h-9 w-auto sm:h-11 ${on ? "opacity-95" : "opacity-55"}`} />
            <span className={`font-mono text-[9px] tracking-[0.08em] uppercase ${on ? "text-accent" : "text-faint"}`}>{s}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Axes({ className = "" }: { className?: string }) {
  const a = (deg: number, r = 26) => [32 + r * Math.cos((deg * Math.PI) / 180), 34 + r * Math.sin((deg * Math.PI) / 180)];
  const [u, v, up] = [a(30), a(150), a(-90)];
  return (
    <svg viewBox="0 0 64 70" className={`pointer-events-none absolute size-16 ${className}`} aria-hidden="true">
      {[[u, "u"], [v, "v"], [up, "up"]].map(([p, k]) => (
        <g key={k as string}>
          <line x1="32" y1="34" x2={(p as number[])[0]} y2={(p as number[])[1]} stroke={k === "up" ? "var(--accent)" : "var(--muted)"} strokeWidth="1" />
          <circle cx={(p as number[])[0]} cy={(p as number[])[1]} r="1.6" fill={k === "up" ? "var(--accent)" : "var(--muted)"} />
          <text x={(p as number[])[0] + (k === "v" ? -3 : 3)} y={(p as number[])[1] + (k === "up" ? -3 : 9)} textAnchor={k === "v" ? "end" : "start"} fill="var(--muted)" style={{ font: "10px var(--font-geist-mono)" }}>{k as string}</text>
        </g>
      ))}
      <circle cx="32" cy="34" r="2" fill="var(--ink)" />
    </svg>
  );
}

/** The set at a glance, like a font's glyph overview: every figure small, in ruled cells. */
export function SetOverview() {
  return (
    <div className="grid grid-cols-4 border-y border-rule sm:grid-cols-7">
      {FIGURES.map((f, i) => (
        <Link key={f.name} href={`/figures/${f.name}`} className={`group relative block border-rule p-2 transition-colors hover:bg-[color-mix(in_srgb,var(--ink)_4%,transparent)] ${i < FIGURES.length - 1 ? "border-r" : ""}`}>
          <Figure name={f.name} quiet className="w-full" />
          <span className={`${LABEL} absolute top-2 left-2.5 normal-case`}>{String(i + 1).padStart(2, "0")}</span>
          <span className={`${LABEL} absolute bottom-2 left-2.5 opacity-0 transition-opacity group-hover:opacity-100`}>{f.name}</span>
        </Link>
      ))}
    </div>
  );
}

/* the beats a reader can see, as fractions of the story loop */
const FRAMES = [0, 0.2, 0.4, 0.6, 0.8];

/** One story, as frames held at moments of the loop (the look's ?t=), each stamped with its time. Key it by name. */
export function Filmstrip({ name }: { name: string }) {
  const [total, setTotal] = useState(0);
  const f = figureByName(name);
  return (
    <div>
      {/* a hidden probe reads the story's length off its stage, then the frames mount at real moments */}
      {!total && (
        <div className="pointer-events-none absolute size-px overflow-hidden opacity-0">
          <Figure name={name} quiet onStage={(s) => setTotal(Number(s.dataset.storyTotal) || 4000)} className="w-[200px]" />
        </div>
      )}
      <div className="grid grid-cols-2 border-y border-rule sm:grid-cols-5">
        {FRAMES.map((p, i) => {
          const t = Math.round(total * p);
          return (
            <div key={p} className={`relative border-rule p-3 ${i < FRAMES.length - 1 ? "sm:border-r" : ""} ${i % 2 === 0 ? "max-sm:border-r" : ""} max-sm:border-b`}>
              {total ? <Figure name={name} t={t} quiet className="w-full" /> : <div className="aspect-[5/4]" />}
              <span className={`${LABEL} absolute top-2.5 left-3 normal-case`}>{(t / 1000).toFixed(1)}s</span>
              <span className={`${LABEL} absolute top-2.5 right-3`}>{["rest", "act", "act", "hold", "return"][i]}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 px-4 py-3 font-mono text-[12px] text-muted sm:px-8">
        <span className="h-px flex-1 bg-rule" />
        {f?.title} · one loop of {(total / 1000).toFixed(1)}s, then it starts again
        <span className="h-px flex-1 bg-rule" />
      </div>
    </div>
  );
}

const VIEWS = [
  ["rounded-left", "Rounded · left"], ["rounded-top", "Rounded · top"], ["rounded-right", "Rounded · right"],
  ["sharp-left", "Sharp · left"], ["sharp-top", "Sharp · top"], ["sharp-right", "Sharp · right"],
] as const;

/** The icon's six Isocons views, as drawn (the variants of a glyph); the one the figure animates is marked. */
export function Views({ name }: { name: string }) {
  const f = figureByName(name);
  const [svgs, setSvgs] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!f) return;
    let live = true;
    Promise.all(VIEWS.map(([v]) => fetch(`/iso/icons/${f.icon}/${v}.svg`).then((r) => r.text()).then((t) => [v, t] as const))).then((all) => {
      if (live) setSvgs(Object.fromEntries(all));
    });
    return () => { live = false; };
  }, [f]);
  if (!f) return null;
  return (
    <div className="grid grid-cols-2 border-y border-rule sm:grid-cols-3 lg:grid-cols-6">
      {VIEWS.map(([v, label], i) => (
        <div key={v} className={`relative border-rule px-6 pt-10 pb-12 ${i < VIEWS.length - 1 ? "lg:border-r" : ""} max-lg:border-b ${i % 3 < 2 ? "sm:max-lg:border-r" : ""} ${i % 2 === 0 ? "max-sm:border-r" : ""}`}>
          <div
            className="iso-view mx-auto aspect-square w-full max-w-[150px] [&_svg]:size-full"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: the icon's own SVG file from this site, as drawn
            dangerouslySetInnerHTML={{ __html: svgs[v] ?? "" }}
          />
          <span className={`${LABEL} absolute bottom-3 left-4`}>{label}</span>
          {v === f.variant && <span className="absolute top-3 right-3 rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] text-[#05121f] uppercase">animated</span>}
        </div>
      ))}
    </div>
  );
}

const SIZES = [320, 200, 120, 72];

/** The same figure at the sizes it is used at, playing in each, the way a specimen shows point sizes. */
export function Sizes({ name }: { name: string }) {
  return (
    <div className="flex flex-wrap items-end gap-x-10 gap-y-8 border-y border-rule px-4 py-10 sm:px-8">
      {SIZES.map((w) => (
        <div key={w} style={{ width: w }} className="shrink-0">
          <Figure name={name} quiet className="w-full" />
          <p className={`${LABEL} mt-2 border-t border-rule pt-2`}>{w}px{w === 240 ? " · the floor" : ""}</p>
        </div>
      ))}
      <p className="max-w-[16rem] self-center text-[14px] text-pretty text-muted">
        Every figure is checked at 240px wide. Below that the story still plays; the detail is the first thing to go.
      </p>
    </div>
  );
}

export { figNo };
