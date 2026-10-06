import type { Metadata } from "next";
import { CopyButton } from "@/components/Copy";
import { Figure } from "@/components/Figure";
import { Bracket } from "@/components/spec/Parts";
import { LABEL, figNo } from "@/lib/spec";
import { EXAMPLE_NOTE, OBJECTS, UI } from "@/lib/iso";

export const metadata: Metadata = { title: "Skill", description: "Install the isoform-animate skill and ask your agent for a figure." };

const STEPS = [
  { t: "Find the icon", b: "It searches the 1,007 Isocons by word, then prints every face of the one it picked and draws a numbered parts picture on a grid, so it can tell the lid from the body before it cuts anything." },
  { t: "Offer a concept", b: "Two or three one-line stories: what the real object does, what hover changes, what gets traced. It waits for you to pick. Nobody around? It takes the most physical one and says so." },
  { t: "Write one file", b: "The figure is a single script on a fixed engine. The agent groups faces into parts, writes the story in beats, and never edits the engine or the page around it." },
  { t: "Look at it", b: "A script validates the file and photographs it at rest, answering, small, in both themes, with the effect on and at moments of its story. Then twelve yes-or-no questions, answered from the pictures." },
  { t: "Hand it over", b: "One HTML file with the engine and the icon inside it, and the Isocons credit with them. Plus the metaphor in a line, the rules it leans on, and anything it could not check." },
  { t: "Adjust", b: "Ask for a change and it edits only the figure, then looks again. The tenth version is held to the same bar as the first." },
];

/* real follow-ups from making these figures, paraphrased from the owner's review */
const THEN: Record<string, string> = {
  "water-bottle": "No dashed lines for the pour; let the water level tell it.",
  "shopping-cart": "The dust reads as stray marks. Drop something into it instead.",
  car: "The beams look like planks. Make them cones of light.",
};

const INSTALL = "npx skills add choicealex/isoform";

export default function SkillPage() {
  return (
    <>
      <div className="grid gap-8 px-4 pt-14 pb-10 sm:px-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <h1 className="text-[clamp(3rem,8vw,7rem)] leading-[0.85] font-semibold tracking-[-0.06em]">
          The skill<span className="text-accent">.</span>
        </h1>
        <div className="grid gap-4">
          <p className="text-[17px] text-pretty text-muted">
            Ask for an object; get back a drawing that does something. It works in any agent that reads skills. Name an icon, or describe an idea and let it find one.
          </p>
          <ol className="grid gap-2 font-mono text-[13px]">
            <li className="flex items-center gap-3 rounded-full border border-rule py-1 pr-1 pl-4">
              <span className="text-muted">#1</span>
              <code className="truncate">{INSTALL}</code>
              <CopyButton text={INSTALL} className="ml-auto" />
            </li>
            <li className="flex items-center gap-3 rounded-full border border-rule px-4 py-2.5">
              <span className="text-muted">#2</span>
              <code>/isoform-animate a lighthouse</code>
            </li>
          </ol>
        </div>
      </div>

      {/* six steps as a numbered ruled bento (JetBrains Mono) */}
      <ol className="grid gap-px border-y border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.t} className="bg-ground px-6 py-8 sm:px-8">
            <p className="font-mono text-[12px] text-muted">{i + 1}.</p>
            <h2 className="mt-8 text-[24px] font-medium tracking-[-0.02em]">{s.t}</h2>
            <p className="mt-3 text-[15px] text-pretty text-muted">{s.b}</p>
          </li>
        ))}
      </ol>

      <div className="flex items-end justify-between gap-6 px-4 pt-24 pb-6 sm:px-8">
        <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none font-medium tracking-[-0.035em]">
          What came back<span className="text-accent">.</span>
        </h2>
        <p className="hidden max-w-sm text-right text-[15px] text-pretty text-muted md:block">
          The skill&apos;s three examples, then figures agents made from one prompt, with what was asked next. The {UI.length} interface icons are on the Figures page.
        </p>
      </div>
      <div className="grid gap-px border-y border-rule bg-rule md:grid-cols-2">
        {OBJECTS.map((f) => (
          <div key={f.name} className="grid bg-ground sm:grid-cols-[1fr_1.15fr]">
            <div className="flex flex-col gap-3 p-6">
              <p className={LABEL}>{figNo(f.name)} · {f.title}</p>
              {f.prompt ? (
                <code className="self-start rounded-full border border-rule px-3 py-1.5 font-mono text-[12px]">{f.prompt}</code>
              ) : (
                <p className="text-[14px] text-pretty text-muted">{EXAMPLE_NOTE}</p>
              )}
              {THEN[f.name] && (
                <p className="text-[14px] text-pretty">
                  <span className="mr-1.5 font-mono text-[11px] text-muted uppercase">Then asked</span>
                  {THEN[f.name]}
                </p>
              )}
              <p className="mt-auto text-[13px] text-pretty text-muted">{f.means}</p>
            </div>
            <div className="p-4">
              <Bracket>
                <Figure name={f.name} quiet className="w-full" />
              </Bracket>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
