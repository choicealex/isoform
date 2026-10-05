import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Inspector } from "@/components/spec/Inspector";
import { FIGURES, figureByName } from "@/lib/iso";

export const generateStaticParams = () => FIGURES.map((f) => ({ name: f.name }));
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/figures/[name]">): Promise<Metadata> {
  const f = figureByName((await params).name);
  return f ? { title: f.title, description: f.means ?? undefined } : {};
}

export default async function FigurePage({ params }: PageProps<"/figures/[name]">) {
  const { name } = await params;
  if (!figureByName(name)) notFound();
  return (
    <>
      <div className="flex items-center gap-3 px-4 pt-8 pb-5 font-mono text-[12px] text-muted sm:px-8">
        <Link href="/figures" className="hover:text-ink">← All figures</Link>
        <span className="ml-auto">Inspect · ← → to step, Space to replay</span>
      </div>
      <Inspector name={name} linked />
    </>
  );
}
