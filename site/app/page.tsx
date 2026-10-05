import Link from "next/link";
import { InstallPill } from "@/components/Copy";
import { Figure } from "@/components/Figure";
import { Playground } from "@/components/Playground";
import { SectionHead } from "@/components/SectionHead";
import { FIGURES } from "@/lib/iso";

/* how a figure sits in a real interface: four small mock surfaces, each with the job the figure does there */
const IN_USE = [
  { name: "shopping-cart", where: "Toast", title: "Added to your order", body: "1 item · Ships Thursday" },
  { name: "padlock", where: "Sign-in", title: "You're in", body: "Two-step check passed on this device." },
  { name: "rocket", where: "Deploy", title: "Going live", body: "Build 214 is rolling out to every region." },
  { name: "bolt", where: "Integrations", title: "Connected", body: "Events from your store now arrive live." },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:pt-20">
        <div>
          <p className="mb-5 font-mono text-xs text-faint">An agent skill · {FIGURES.length} figures so far · 1,007 icons to draw from</p>
          <h1 className="text-[clamp(2.4rem,5.4vw,4.1rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance">
            Isometric icons that <span className="font-serif font-normal tracking-[-0.01em] text-accent">draw</span> themselves
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-pretty text-muted">
            Give your agent an Isocons icon. Isoform takes it apart along its own edges and hands back a small line drawing that
            plays what the real object does. It ships as one HTML file with nothing to install.
          </p>
          <div className="mt-8 flex flex-col items-start gap-4">
            <InstallPill />
            <div className="flex gap-5 text-sm">
              <Link href="/figures" className="font-medium underline decoration-rule underline-offset-4 hover:decoration-ink">Browse the figures</Link>
              <Link href="/skill" className="text-muted hover:text-ink">How the skill works →</Link>
            </div>
          </div>
        </div>
        <div className="plus-grid overflow-hidden rounded-[28px] border border-rule">
          <Figure name="water-bottle" quiet className="w-full" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHead kicker="Try one" title="Turn it up, slow it down" body="Every figure takes one number for how far it goes, and plays at any speed. The effect, where there is one, adds the material under the lines." />
        <Playground />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHead kicker="In a product" title="Small jobs, done in a line" body="An empty state, a confirmation, a status that is still happening. Each figure says one thing, so it can sit where a sentence would." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {IN_USE.map((u) => (
            <div key={u.name} className="flex flex-col overflow-hidden rounded-3xl border border-rule bg-surface">
              <p className="px-4 pt-4 font-mono text-[11px] text-faint uppercase tracking-wider">{u.where}</p>
              <Figure name={u.name} quiet className="mx-auto w-[86%]" />
              <div className="border-t border-rule px-4 py-3.5">
                <p className="text-sm font-medium">{u.title}</p>
                <p className="mt-0.5 text-[13px] text-muted">{u.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
