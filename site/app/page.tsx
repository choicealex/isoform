import Link from "next/link";
import { CopyButton } from "@/components/Copy";
import { Figure } from "@/components/Figure";
import { Axes, Lattice, SetOverview } from "@/components/spec/Icon";
import { Inspector } from "@/components/spec/Inspector";
import { Cross } from "@/components/spec/Parts";
import { Sheet } from "@/components/spec/Sheet";
import { Wall } from "@/components/spec/Wall";
import { FIGURES } from "@/lib/iso";
import { LABEL, figNo } from "@/lib/spec";

const INSTALL = "npx skills add choicealex/isoform";

/* the specimen's title block, as a type specimen opens: what, which volume, whose drawings */
const STRIP = ["Isoform", "Isometric icon specimen", `Vol. 01 · ${FIGURES.length} figures`, "Drawings: Isocons, CC BY 4.0", "MMXXVI"];

function Section({ n, title, note, children }: { n: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mt-24">
      <div className="grid gap-3 px-4 pb-7 sm:px-8 md:grid-cols-[1fr_auto] md:items-end">
        <h2 className="text-[clamp(2rem,3.6vw,3rem)] leading-[0.95] font-medium tracking-[-0.04em]">
          <span className="mr-4 align-top font-mono text-[12px] tracking-normal text-muted">{n}</span>
          {title}
          <span className="text-accent">.</span>
        </h2>
        {note && <p className="max-w-sm text-[15px] text-pretty text-muted md:text-right">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  const hero = "rocket";
  const f = FIGURES.find((x) => x.name === hero);
  return (
    <>
      {/* title block */}
      <div className="grid grid-cols-2 border-y border-rule sm:grid-cols-5">
        {STRIP.map((s, i) => (
          <p key={s} className={`${LABEL} truncate border-rule px-4 py-2.5 sm:px-8 ${i < STRIP.length - 1 ? "sm:border-r" : ""} ${i > 1 ? "max-sm:hidden" : ""} ${i === 0 ? "text-ink" : ""}`}>{s}</p>
        ))}
      </div>

      <section className="grid border-b border-rule lg:grid-cols-12">
        {/* left: the word, the claim, the way in */}
        <div className="flex flex-col justify-between gap-12 border-rule px-4 pt-12 pb-10 sm:px-8 lg:col-span-5 lg:border-r">
          <div>
            <h1 className="text-[clamp(4.5rem,10vw,9.5rem)] leading-[0.82] font-semibold tracking-[-0.065em]">
              Isoform<span className="text-accent">.</span>
            </h1>
            <p className="mt-8 max-w-[26rem] text-[clamp(1.25rem,1.7vw,1.6rem)] leading-[1.2] font-medium tracking-[-0.02em] text-balance">
              Isometric icons that draw themselves, then do what the object does.
            </p>
            <p className="mt-4 max-w-[26rem] text-[15px] text-pretty text-muted">
              An agent skill. Name one of the 1,007 Isocons; it is taken apart along its own edges and handed back as one HTML file that plays.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="flex items-center gap-2 rounded-full border border-rule py-1 pr-1 pl-4">
              <code className="truncate font-mono text-[13px]"><span className="text-faint select-none">$ </span>{INSTALL}</code>
              <CopyButton text={INSTALL} label="Copy the install command" className="ml-auto" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/figures" className="rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-ground">Browse the figures</Link>
              <Link href="/skill" className="text-[14px] text-muted hover:text-ink">How it works →</Link>
            </div>
          </div>
        </div>

        {/* right: the plate. One figure on the isometric construction grid, labelled at its corners */}
        <div className="relative min-h-[560px] border-rule max-lg:border-t lg:col-span-7">
          <Lattice id="hero-lattice" />
          <Cross className="top-3 left-3" />
          <Cross className="right-3 bottom-3" />
          <p className={`${LABEL} absolute top-5 left-12 normal-case`}>{figNo(hero)} — {f?.title}</p>
          <p className={`${LABEL} absolute top-5 right-6`}>{f?.icon} · {f?.variant}</p>
          <p className={`${LABEL} absolute right-12 bottom-5 normal-case`}>{f?.lines} lines · plays on its own, hover takes over</p>
          <Axes className="bottom-4 left-5" />
          <div className="relative mx-auto flex h-full max-w-[640px] items-center px-8 py-16">
            <Figure name={hero} quiet className="w-full" />
          </div>
        </div>
      </section>

      <Section n="01" title="The set" note="Every figure, small. Each is an Isocons icon, taken apart and made to act.">
        <SetOverview />
      </Section>

      <Section n="02" title="Specimen sheet" note="One figure in full: its story as frames, the six ways Isocons draws it, the sizes it reads at.">
        <Sheet />
      </Section>

      <Section n="03" title="The wall" note="Every figure, playing. Hover for the file and the prompt; open one to inspect it.">
        <Wall />
      </Section>

      <Section n="04" title="Inspect" note="One figure on its construction grid, solid or in parts, with its controls and its code.">
        <Inspector name="padlock" />
      </Section>
    </>
  );
}
