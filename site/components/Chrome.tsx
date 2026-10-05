import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/figures", label: "Figures" },
  { href: "/skill", label: "Skill" },
  { href: "/docs", label: "Docs" },
  { href: "/inspo", label: "Inspo" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-rule/70 bg-ground/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
          <Mark />
          Isoform
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm text-muted">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hidden rounded-full px-3 py-1.5 transition-colors hover:text-ink sm:block">
              {n.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-2 text-sm text-muted sm:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="rounded-full px-3 py-1 hover:text-ink">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

/* an isometric cube in one hairline, its top in the accent */
function Mark() {
  return (
    <svg viewBox="0 0 20 20" className="size-5" fill="none" strokeWidth="1" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 2.5 16.5 6.25 10 10 3.5 6.25Z" stroke="var(--accent)" />
      <path d="M3.5 6.25v7.5L10 17.5V10M16.5 6.25v7.5L10 17.5" stroke="currentColor" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-muted sm:grid-cols-[1fr_auto] sm:px-6">
        <p className="max-w-xl text-pretty">
          Icons from{" "}
          <a href="https://isocons.app" className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
            Isocons
          </a>{" "}
          by <a href="https://x.com/leyeConnect" className="hover:text-ink">@leyeConnect</a> and{" "}
          <a href="https://x.com/meandchimso" className="hover:text-ink">@meandchimso</a>, licensed{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
            CC BY 4.0
          </a>
          , split into parts and animated. Isocons does not endorse Isoform. Structure after Hairline by Lucas Marques (MIT).
        </p>
        <div className="flex gap-4">
          <Link href="/docs" className="hover:text-ink">Docs</Link>
          <a href="/llms.txt" className="hover:text-ink">llms.txt</a>
        </div>
      </div>
      <p aria-hidden="true" className="pointer-events-none -mb-[0.22em] select-none px-4 text-[clamp(5rem,18vw,15rem)] font-semibold leading-none tracking-[-0.05em] text-rule/60 sm:px-6">
        Isoform
      </p>
    </footer>
  );
}
