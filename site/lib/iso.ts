/* The skill's engine and the site's host, loaded once per page as plain scripts (public/iso/), in order. */
import figures from "./figures.json";

export type FigureMeta = (typeof figures)[number];
/* every figure the site can play; FIGURES are the ones it lists (the hero's other rocket directions are not) */
export const ALL_FIGURES: FigureMeta[] = figures;
export const FIGURES: FigureMeta[] = figures.filter((f) => f.listed);
export const figureByName = (name: string) => ALL_FIGURES.find((f) => f.name === name);
/* the skill's own examples have no prompt: they were written with it, not by it */
export const EXAMPLE_NOTE = "Written by hand alongside the skill: one of the three examples its agent reads before it builds.";
export const CATEGORIES = [...new Set(FIGURES.map((f) => f.category))];

export type IsoHandle = {
  decl: { name: string; means: string; effect?: string; range: number[] };
  set(intensity: number): void;
  speed(x: number): void;
  strength(level: "subtle" | "bold"): void;
  replay(): void;
  destroy(): void;
};
type IsoHost = {
  mount(stage: HTMLElement, name: string, o: { src: string; intensity?: number; speed?: number; gl?: boolean | "subtle" | "bold"; t?: number }): Promise<IsoHandle>;
  theme(): void;
};
declare global {
  interface Window { IsoHost?: IsoHost }
}

let ready: Promise<IsoHost> | null = null;
const script = (src: string) =>
  new Promise<void>((res, rej) => {
    const s = Object.assign(document.createElement("script"), { src, async: false });
    s.onload = () => res();
    s.onerror = () => rej(new Error(`could not load ${src}`));
    document.head.appendChild(s);
  });

export function iso(): Promise<IsoHost> {
  if (window.IsoHost) return Promise.resolve(window.IsoHost);
  ready ??= script("/iso/kernel.js").then(() => script("/iso/host.js")).then(() => window.IsoHost as IsoHost);
  return ready;
}
