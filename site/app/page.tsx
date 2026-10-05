import Link from "next/link";
import { CopyButton } from "@/components/Copy";
import { Figure } from "@/components/Figure";
import { Inspector } from "@/components/spec/Inspector";
import { Bracket, Cross, Loupe } from "@/components/spec/Parts";
import { LABEL, figNo, ruled } from "@/lib/spec";
import { Tester } from "@/components/spec/Tester";
import { Wall } from "@/components/spec/Wall";
import { FIGURES } from "@/lib/iso";

const INSTALL = "npx skills add choicealex/isoform";

/* what each specimen is about, and where on its stage the loupe looks */
const SPECIMENS: { name: string; at: [number, number]; what: string }[] = [
  { name: "bolt", at: [0.47, 0.42], what: "Current arcs across the gap" },
  { name: "padlock", at: [0.73, 0.73], what: "The plug turns; a mark sweeps the rim" },
  { name: "car", at: [0.3, 0.62], what: "A cone of light leaves the lamp" },
];

const lines = Math.round(FIGURES.reduce((n, f) => n + f.lines, 0) / FIGURES.length);
const STATS = [
  ["Figures", String(FIGURES.length), "made and looked at"],
  ["Isocons", "1,007", "icons to draw from"],
  ["Rules", "12", "every figure keeps"],
  ["Lines", String(lines), "per figure, on average"],
];

function Section({ n, title, note, children }: { n: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mt-28">
      <div className="flex items-end justify-between gap-6 px-4 pb-6 sm:px-8">
        <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none font-medium tracking-[-0.035em]">
          <span className="mr-3 align-top font-mono text-[12px] tracking-normal text-muted">{n}</span>
          {title}<span className="text-accent">.</span>
        </h2>
        {note && <p className="hidden max-w-sm text-right text-[15px] text-pretty text-muted md:block">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <>
      {/* the wordmark and one figure on a ruled cell grid, crosshairs at the corners (vercel.com/font) */}
      <section className="relative mx-4 mt-4 border border-rule sm:mx-8" style={ruled(120)}>
        <Cross className="-top-[11px] -left-[11px]" />
        <Cross className="-right-[11px] -bottom-[11px]" />
        <div className="grid min-h-[min(720px,82vh)] items-center gap-y-6 py-10 lg:grid-cols-12">
          <div className="pl-3 lg:col-span-7">
            <h1 className="text-[clamp(5rem,15vw,15.5rem)] leading-[0.8] font-semibold tracking-[-0.065em]">
              Isoform<span className="text-accent">.</span>
            </h1>
            <p className="mt-8 max-w-[30rem] pl-2 text-[clamp(1.05rem,1.4vw,1.25rem)] leading-snug text-pretty text-muted">
              Isometric icons that <span className="text-ink">draw themselves</span>, then act out what the object does. An agent skill; one HTML file per figure.
            </p>
          </div>
          <div className="px-6 lg:col-span-5 lg:pr-[6%] lg:pl-0">
            <Bracket caption={`${figNo("rocket")} — Rocket, launch`}>
              <Figure name="rocket" quiet className="w-full" />
            </Bracket>
          </div>
        </div>
      </section>

      {/* the install line, with a version note (JetBrains, Inter) */}
      <div className="mx-4 flex flex-wrap items-center gap-x-6 gap-y-3 border-x border-b border-rule px-4 py-4 sm:mx-8 sm:px-6">
        <div className="flex items-center gap-2 rounded-full border border-rule py-1 pr-1 pl-4">
          <code className="font-mono text-[13px]"><span className="text-faint select-none">$ </span>{INSTALL}</code>
          <CopyButton text={INSTALL} label="Copy the install command" />
        </div>
        <Link href="/figures" className="rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-ground">Browse the figures →</Link>
        <p className="ml-auto font-mono text-[12px] text-muted">v0.1 · {FIGURES.length} figures · icons CC BY 4.0</p>
      </div>

      {/* numbered ruled bento (JetBrains Mono) */}
      <div className="mx-4 grid grid-cols-2 border-x border-b border-rule sm:mx-8 lg:grid-cols-4">
        {STATS.map(([k, v, sub], i) => (
          <div key={k} className={`px-5 py-8 sm:px-7 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} ${i === 1 ? "lg:border-r" : ""} border-rule`}>
            <p className="font-mono text-[12px] text-muted">{i + 1}.</p>
            <p className="mt-6 text-[clamp(3rem,6vw,5.5rem)] leading-none font-medium tracking-[-0.05em] tabular-nums">{v}</p>
            <p className="mt-3 text-[15px]">{k} <span className="text-muted">{sub}</span></p>
          </div>
        ))}
      </div>

      <Section n="01" title="What each one does" note="A loupe on the moment each figure is about. Everything here is live: the drawings and the loupes play together.">
        <div className="mx-4 grid border border-rule sm:mx-8 md:grid-cols-3">
          {SPECIMENS.map((s, i) => (
            <div key={s.name} className={`relative px-6 pt-14 pb-10 ${i < 2 ? "border-rule max-md:border-b md:border-r" : ""}`}>
              <div className="pointer-events-none absolute inset-x-0 top-[34%] border-t border-dashed border-rule" />
              <div className="pointer-events-none absolute inset-x-0 top-[66%] border-t border-dashed border-rule" />
              <div className="relative">
                <Figure name={s.name} quiet className="w-full" />
                <Loupe name={s.name} at={s.at} />
              </div>
              <p className="mt-8 text-center font-mono text-[12px]">{figNo(s.name)} — {FIGURES.find((f) => f.name === s.name)?.title}</p>
              <p className={`${LABEL} mt-1 text-center`}>{s.what}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section n="02" title="Try one" note="Turn it up, slow it down, switch the effect on. The same three controls every figure takes.">
        <Tester />
      </Section>

      <Section n="03" title="The wall" note="Every figure, playing. Hover for the file and the prompt; open one to inspect it.">
        <Wall />
      </Section>

      <Section n="04" title="Inspect" note="One figure on its lines, solid or in parts, next to all the others. Use ← → to step through.">
        <Inspector name="bolt" />
      </Section>
    </>
  );
}
