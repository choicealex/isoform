import type { Metadata } from "next";
import { InstallPill } from "@/components/Copy";
import { Figure } from "@/components/Figure";
import { SectionHead } from "@/components/SectionHead";
import { EXAMPLE_NOTE, FIGURES } from "@/lib/iso";

export const metadata: Metadata = { title: "Skill", description: "Install the isoform-animate skill and ask your agent for a figure." };

const STEPS = [
  { n: "01", t: "Find the icon", b: "It searches the 1,007 Isocons by word, then prints every face of the one it picked and draws a numbered parts picture on a grid, so it can tell the lid from the body before it cuts anything." },
  { n: "02", t: "Offer a concept", b: "Two or three one-line stories: what the real object does, what hover changes, what gets traced. It waits for you to pick. Nobody around? It takes the most physical one and says so." },
  { n: "03", t: "Write one file", b: "The figure is a single script on a fixed engine. The agent groups faces into parts, writes the story in beats, and never edits the engine or the page around it." },
  { n: "04", t: "Look at it", b: "A script validates the file and photographs it at rest, answering, small, in both themes, with the effect on and at moments of its story. Then twelve yes-or-no questions, answered from the pictures, not from the code." },
  { n: "05", t: "Hand it over", b: "One HTML file with the engine and the icon inside it, and the Isocons credit with them. Plus the metaphor in a line, the rules it leans on, and anything it could not check." },
  { n: "06", t: "Adjust", b: "Ask for a change and it edits only the figure, then looks again. The tenth version is held to the same bar as the first." },
];

/* real follow-ups from making these figures, paraphrased from the owner's review */
const THEN: Record<string, string> = {
  "water-bottle": "No dashed lines for the pour; let the water level tell it.",
  "shopping-cart": "The dust reads as stray marks. Drop something into it instead.",
  padlock: "The key has moving dots and the lines don't look straight.",
  car: "The beams look like planks. Make them cones of light.",
};

export default function SkillPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="max-w-3xl pt-14 pb-16">
        <p className="mb-4 font-mono text-xs text-accent">isoform-animate</p>
        <h1 className="text-[clamp(2.2rem,4.6vw,3.4rem)] leading-[1.04] font-medium tracking-[-0.035em] text-balance">
          Ask for an object. Get back a drawing that <span className="font-serif font-normal text-accent">does</span> something.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-pretty text-muted">
          The skill works in any agent that reads skills. Name an icon, or describe an idea and let it find one.
        </p>
        <div className="mt-8"><InstallPill /></div>
      </section>

      <section className="py-12">
        <SectionHead kicker="What it does" title="Six steps, one file" body="The agent does the steps in order and shows its work. You only answer step two." />
        <ol className="grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="bg-surface p-6">
              <p className="font-mono text-[11px] text-faint">{s.n}</p>
              <h3 className="mt-3 font-medium">{s.t}</h3>
              <p className="mt-2 text-sm text-pretty text-muted">{s.b}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="py-12">
        <SectionHead kicker="Examples" title="What came back" body="Every figure on this site: the skill's three examples, then figures agents made from one prompt, with what was asked next." />
        <div className="grid gap-4 md:grid-cols-2">
          {FIGURES.map((f) => (
            <div key={f.name} className="grid overflow-hidden rounded-3xl border border-rule bg-surface sm:grid-cols-[1fr_1.1fr]">
              <div className="flex flex-col gap-3 p-5">
                {f.prompt ? (
                  <code className="self-start rounded-full bg-ground px-3 py-1.5 font-mono text-[12px]">{f.prompt}</code>
                ) : (
                  <p className="self-start rounded-full bg-ground px-3 py-1.5 font-mono text-[11px] text-faint">the skill's example</p>
                )}
                {!f.prompt && <p className="text-sm text-pretty text-muted">{EXAMPLE_NOTE}</p>}
                {THEN[f.name] && (
                  <p className="text-sm text-pretty">
                    <span className="mr-1.5 font-mono text-[11px] text-faint">Then asked</span>{THEN[f.name]}
                  </p>
                )}
                <p className="mt-auto text-[13px] text-pretty text-muted">{f.means}</p>
              </div>
              <div className="plus-grid border-t border-rule sm:border-t-0 sm:border-l">
                <Figure name={f.name} quiet className="w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
