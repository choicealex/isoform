import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { CopyButton } from "@/components/Copy";
import { FIGURES } from "@/lib/iso";

export const metadata: Metadata = { title: "Docs", description: "Install, the figure file, page options, theme tokens and the engine's API." };

const TOC = [
  { id: "start", t: "Getting started" },
  { id: "file", t: "The figure file" },
  { id: "options", t: "Page options" },
  { id: "intensity", t: "Intensity per figure" },
  { id: "tokens", t: "Theme tokens" },
  { id: "api", t: "Engine API" },
  { id: "a11y", t: "Accessibility" },
  { id: "licence", t: "Licence and credit" },
];

const DECL = [
  ["name", "the figure's id; the file is isoform-<name>.html"],
  ["icon · variant", "the Isocons id and one of six variants (rounded-left by default); the build inlines that SVG"],
  ["means", "one sentence, at most 140 characters: what the figure shows. It is also the drawing's accessible name"],
  ["effect", "one sentence naming the physical thing the WebGL layer adds under the traces; omitted when there is none"],
  ["rules", "the numbers of the twelve rules it leans on most"],
  ["range", "the one number the slider drives, at intensity 0, 0.5 and 1"],
  ["mount", "mount({ stage, svg, read, src }, value) → { set(value), destroy }"],
];

const PARAMS = [
  ["?intensity=0…1", "the slider; 0.5 by default"],
  ["?theme=light|dark", "force a theme; otherwise the page follows the system"],
  ["?gl=1", "turn the effect layer on (it is off by default)"],
  ["?t=ms", "hold the story at one moment; negative values are moments of the draw-in"],
  ["?at=x,y", "hold the pointer at a stage point (400 × 320), for pictures"],
  ["?w=240", "the page's width, for a thumbnail"],
  ["?palette=isocons", "Isocons' own blue for every line, as on isocons.app"],
];

const TOKENS = [
  ["--iso-hi", "#229eff", "the acting part and its traces: the one accent"],
  ["--iso-edge", "#8e8e97", "outlines and traces"],
  ["--iso-lo", "#d7d7dc", "inner edges, the quietest line"],
  ["--iso-face", "#ffffff", "face fill, and solid traces"],
  ["--iso-plate", "#ffffff", "the stage behind the drawing"],
  ["--iso-stroke", "0.9", "line width in screen px, for every line"],
];

const H = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="scroll-mt-24 pt-12 text-2xl font-medium tracking-[-0.025em] first:pt-0">{children}</h2>
);
const Table = ({ rows, mono = 1 }: { rows: string[][]; mono?: number }) => (
  <div className="mt-4 overflow-x-auto rounded-2xl border border-rule">
    <table className="w-full text-left text-sm">
      <tbody>
        {rows.map((r) => (
          <tr key={r[0]} className="border-b border-rule last:border-0">
            {r.map((c, i) => (
              <td key={c} className={`px-4 py-2.5 align-top ${i < mono ? "font-mono text-[12.5px] whitespace-nowrap" : "text-muted"}`}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
const Code = ({ children, title }: { children: string; title?: string }) => (
  <div className="mt-4 overflow-hidden rounded-2xl border border-rule">
    <div className="flex items-center border-b border-rule bg-ground py-1 pr-1 pl-4">
      <span className="font-mono text-[11px] text-faint">{title ?? "shell"}</span>
      <CopyButton text={children} className="ml-auto" />
    </div>
    <pre className="overflow-x-auto bg-surface px-4 py-3.5 font-mono text-[12.5px] leading-relaxed">{children}</pre>
  </div>
);

export default function DocsPage() {
  const index = readFileSync(join(process.cwd(), "lib/kernel-index.txt"), "utf8");
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 sm:px-6 lg:grid-cols-[180px_minmax(0,1fr)_180px]">
      <nav className="hidden text-sm lg:sticky lg:top-24 lg:block lg:self-start">
        <p className="mb-3 font-mono text-[11px] text-faint uppercase tracking-wider">Docs</p>
        <ul className="grid gap-1.5">
          {TOC.map((x) => <li key={x.id}><a href={`#${x.id}`} className="text-muted hover:text-ink">{x.t}</a></li>)}
        </ul>
      </nav>

      <article className="max-w-[46rem] min-w-0 text-[15px] leading-relaxed">
        <h1 className="mb-3 text-4xl font-medium tracking-[-0.035em]">Docs</h1>
        <p className="mb-0 text-pretty text-muted">Everything a figure is and takes. The engine's API below is read from the engine itself, so it cannot fall behind.</p>

        <H id="start">Getting started</H>
        <p className="mt-3 text-muted">Add the skill, then ask for an icon or an idea. The agent writes one figure file and hands back one HTML page.</p>
        <Code>{"npx skills add choicealex/isoform\n\n# then, in your agent\n/isoform-animate a lighthouse"}</Code>
        <p className="mt-4 text-muted">
          The page has the engine, the icon and the figure inlined, and nothing to install. Drop it in an <code className="font-mono text-[13px]">iframe</code>, or open it.
          Inside the skill folder: <code className="font-mono text-[13px]">find.mjs</code> searches icons, <code className="font-mono text-[13px]">inspect.mjs</code> shows an icon's faces,{" "}
          <code className="font-mono text-[13px]">build.mjs</code> assembles the page, <code className="font-mono text-[13px]">look.mjs</code> photographs it and runs the checks.
        </p>

        <H id="file">The figure file</H>
        <p className="mt-3 text-muted">A figure is one script that ends by declaring itself:</p>
        <Code title="padlock.js">{"isoform({\n  name: \"padlock\",\n  icon: \"key\",\n  variant: \"rounded-left\",\n  means: \"A key slides into its lock, turns the plug to the stop with a click, and withdraws.\",\n  rules: [1, 3, 5, 6],\n  range: [45, 70, 90],\n  mount,\n});"}</Code>
        <Table rows={DECL} />

        <H id="options">Page options</H>
        <p className="mt-3 text-muted">The built page reads these from its address, so a figure can be framed, held still or photographed without touching code.</p>
        <Table rows={PARAMS} />

        <H id="intensity">Intensity per figure</H>
        <p className="mt-3 text-muted">What the slider's 0, 0.5 and 1 mean for each figure on this site, in that figure's own unit.</p>
        <Table mono={4} rows={FIGURES.map((f) => [f.name, ...f.range.map(String)])} />

        <H id="tokens">Theme tokens</H>
        <p className="mt-3 text-muted">Set them on the page to restyle every figure. The defaults are the light theme's.</p>
        <Table mono={2} rows={TOKENS} />

        <H id="api">Engine API</H>
        <p className="mt-3 text-muted">The index at the top of <code className="font-mono text-[13px]">kernel.js</code>, which is all a figure may call.</p>
        <Code title="kernel.js">{index}</Code>

        <H id="a11y">Accessibility</H>
        <ul className="mt-3 grid list-disc gap-2 pl-5 text-muted">
          <li>The drawing is an image named by its <code className="font-mono text-[13px]">means</code> sentence.</li>
          <li>The state read-out is a live region, so a change is spoken once, briefly.</li>
          <li>Under reduced motion a figure shows one poster frame, its most telling moment, and never loops.</li>
          <li>Hover only takes over; nothing is reachable by hover alone. Off screen, a figure stops drawing.</li>
        </ul>

        <H id="licence">Licence and credit</H>
        <p className="mt-3 text-pretty text-muted">
          The icons are Isocons by @leyeConnect and @meandchimso, CC BY 4.0: you may use, adapt and sell them with credit. Every built page carries that credit; keep it
          wherever a figure goes. Isocons does not endorse Isoform.
        </p>
      </article>

      <aside className="hidden text-sm lg:sticky lg:top-24 lg:block lg:self-start">
        <p className="mb-3 font-mono text-[11px] text-faint uppercase tracking-wider">For agents</p>
        <a href="/llms.txt" className="block text-muted hover:text-ink">llms.txt</a>
      </aside>
    </div>
  );
}
