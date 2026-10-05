import Link from "next/link";

export const metadata = { title: "Design lab" };

/* four directions for the redesign, each a live mockup with the real figures (owner picks one) */
const DIRECTIONS = [
  { href: "/lab/studio", name: "Studio", line: "Closest to animateicons.in: black, centred two-tone hero over a field of figures; app-shell catalogue; control-packed side sheet." },
  { href: "/lab/stage", name: "Stage", line: "One figure fills the screen on a dotted floor; a pill rail swaps it; small headline; light index of tall tiles below." },
  { href: "/lab/drafting", name: "Drafting table", line: "Warm paper desk: ink outlines, hard-shadow buttons, a live control rail that re-tints every figure, canvases with selection handles." },
  { href: "/lab/specimen", name: "Specimen", line: "After vercel.com/font: a technical sheet. Ruled columns and crosshairs, a huge wordmark, live loupes on the detail each figure is about, a figure inspector with metric lines and the catalogue as ruled cells." },
  { href: "/lab/wall", name: "Wall", line: "No hero: an edge-to-edge wall of tall tiles that play, a few inverted dark ones, the install command as the first double tile." },
];

export default function Lab() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-medium tracking-tight">Design lab</h1>
      <p className="mt-2 text-muted">Five directions, each a working mockup with the real figures. Open each, then pick one.</p>
      <ul className="mt-8 grid gap-3">
        {DIRECTIONS.map((d) => (
          <li key={d.href}>
            <Link href={d.href} className="block rounded-2xl border border-rule bg-surface p-5 hover:border-ink">
              <p className="font-medium">{d.name} →</p>
              <p className="mt-1 text-sm text-muted">{d.line}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
