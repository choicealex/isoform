"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Key } from "./spec/Parts";
import { ThemeToggle } from "./ThemeToggle";

/* numbered sections, after Commit Mono's header; the active one is inverted, after vercel.com/font's switcher */
const NAV = [
  { href: "/figures", label: "Figures", n: "01" },
  { href: "/skill", label: "Skill", n: "02" },
  { href: "/docs", label: "Docs", n: "03" },
  { href: "/inspo", label: "Inspo", n: "04" },
];

export function Header() {
  const path = usePathname();
  if (path.startsWith("/lab")) return null;
  return (
    <header className="sticky top-0 z-30 bg-ground">
      <div className="relative flex h-[68px] items-center px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-[15px] font-medium tracking-[-0.01em]">
          <Mark />
          Isoform
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-0.5 rounded-full border border-rule p-1 text-[14px] md:flex">
          {NAV.map((n) => {
            const on = path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={`flex items-baseline gap-1.5 rounded-full px-3.5 py-1.5 transition-colors ${on ? "bg-ink text-ground" : "text-muted hover:text-ink"}`}>
                <span className={`font-mono text-[10px] ${on ? "text-ground/60" : "text-faint"}`}>{n.n}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link href="/skill" className="rounded-full bg-accent px-4 py-2 text-[14px] font-medium text-[#05121f] transition-transform hover:-translate-y-px">
            Get the skill
          </Link>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-b border-rule px-3 pb-2 text-[14px] md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={`shrink-0 rounded-full px-3 py-1 ${path.startsWith(n.href) ? "bg-ink text-ground" : "text-muted"}`}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

/* an isometric cube: its top filled in ink, its sides in one hairline */
function Mark() {
  return (
    <svg viewBox="0 0 20 20" className="size-[22px]" fill="none" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 2.5 16.5 6.25 10 10 3.5 6.25Z" fill="currentColor" />
      <path d="M3.5 6.25v7.5L10 17.5V10M16.5 6.25v7.5L10 17.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function Footer() {
  const path = usePathname();
  if (path.startsWith("/lab")) return null;
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-rule">
      {/* every control has a key, after Commit Mono's footer */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-rule px-4 py-3 text-[12px] text-muted sm:px-8">
        <span className="flex items-center gap-1.5"><Key>←</Key><Key>→</Key> figure</span>
        <span className="flex items-center gap-1.5"><Key>Space</Key> replay</span>
        <span className="flex items-center gap-1.5"><Key>M</Key> light / dark</span>
        <a href="/llms.txt" className="ml-auto font-mono hover:text-ink">llms.txt</a>
      </div>
      <div className="grid gap-6 px-4 py-10 text-[14px] text-muted sm:grid-cols-3 sm:px-8">
        <p className="text-pretty sm:col-span-2">
          Icons from{" "}
          <a href="https://isocons.app" className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">Isocons</a> by{" "}
          <a href="https://x.com/leyeConnect" className="hover:text-ink">@leyeConnect</a> and{" "}
          <a href="https://x.com/meandchimso" className="hover:text-ink">@meandchimso</a>, licensed{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">CC BY 4.0</a>
          , split into parts and animated. Isocons does not endorse Isoform.
        </p>
        <p className="font-mono text-[12px] sm:text-right">v0.1 · local preview</p>
      </div>
      <p aria-hidden="true" className="pointer-events-none -mb-[0.2em] select-none px-2 text-[clamp(6rem,21vw,19rem)] leading-none font-semibold tracking-[-0.065em] text-[color-mix(in_srgb,var(--ink)_6%,transparent)]">
        Isoform.
      </p>
    </footer>
  );
}
