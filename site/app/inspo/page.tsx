import type { Metadata } from "next";
import { Figure } from "@/components/Figure";

export const metadata: Metadata = { title: "Inspo", description: "How Isoform was made, including the pushback." };

/* the making of, in order, as it happened. Quotes are the owner's own words from the sessions. */
const STEPS = [
  {
    t: "The brief",
    b: "Hairline showed that a line figure can answer a hand. Isocons has a thousand isometric icons and no motion. The ask: make them move, and if there is an effect, make it something the real object would do. A bolt arcs, a bottle fills. No sparkles.",
    fig: "bolt",
  },
  {
    t: "Not there yet",
    b: "The first figures moved too much and their lines were two widths: the outline was drawn as a thick stroke under the faces. It became a thin copy on top, masked to the shape, so every line in a figure is the same weight.",
    quote: "not there yet",
  },
  {
    t: "Illustrations, not icons",
    b: "On a real page these sit in heroes and feature cards, not in toolbars. So each one plays a short story on its own, and hover only takes over. The accent became Isocons' blue.",
    fig: "rocket",
  },
  {
    t: "No dashed lines",
    b: "Streams and dust were dashed. They read as construction lines and went. Things that happen now draw on as solid lines, or are left to the object: the bottle's pour is told by its water level alone. Every figure draws itself in, one pen, at a hand's pace.",
    fig: "water-bottle",
  },
  {
    t: "Four strangers",
    b: "Four fresh agents ran the skill with only its own files. Two hit the same bug: with the pointer held from the start, the drawing froze before it was drawn, and the checks still passed. Fixed in the engine and in the checks; the parts picture and the icon search came out of the same round.",
    fig: "shopping-cart",
  },
  {
    t: "Dots and planks",
    b: "Review caught what the checks could not. The key turned by tilting the whole drawing, which bent every edge. Now it slides square and the lock's rim shows the turn. The beams became cones, and the cart's scuffs became a box that drops in.",
    quote: "the key has a moving dots and the lines dont look straight",
    fig: "padlock",
  },
  {
    t: "What I'd keep",
    b: "A second round of strangers got the mechanics right every time and the taste right one time in three. A script can tell you the figure works. Only looking tells you it reads. That is why every figure here was looked at by a person before it went up.",
    fig: "car",
  },
];

export default function InspoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <section className="pt-14 pb-12">
        <p className="mb-4 font-mono text-xs text-accent">The making of</p>
        <h1 className="text-[clamp(2.2rem,4.6vw,3.4rem)] leading-[1.04] font-medium tracking-[-0.035em] text-balance">
          Seven steps, and the <span className="font-serif font-normal text-accent">pushback</span> that shaped them
        </h1>
      </section>
      <ol className="relative grid gap-12 border-l border-rule pl-8">
        {STEPS.map((s, i) => (
          <li key={s.t} className="relative">
            <span className="absolute top-1 -left-[41px] grid size-5 place-items-center rounded-full border border-rule bg-ground font-mono text-[10px] text-faint">{i + 1}</span>
            <h2 className="text-xl font-medium tracking-[-0.02em]">{s.t}</h2>
            <p className="mt-2 max-w-2xl text-pretty text-muted">{s.b}</p>
            {s.quote && <p className="mt-3 border-l-2 border-accent pl-3 font-serif text-lg text-ink">“{s.quote}”</p>}
            {s.fig && (
              <div className="plus-grid mt-5 max-w-md overflow-hidden rounded-2xl border border-rule">
                <Figure name={s.fig} quiet className="w-full" />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
