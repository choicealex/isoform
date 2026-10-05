import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Drawer } from "@/components/Drawer";
import { FIGURES, figureByName } from "@/lib/iso";

export const generateStaticParams = () => FIGURES.map((f) => ({ name: f.name }));
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/figures/[name]">): Promise<Metadata> {
  const f = figureByName((await params).name);
  return f ? { title: f.title, description: f.means ?? undefined } : {};
}

export default async function FigurePage({ params }: PageProps<"/figures/[name]">) {
  const f = figureByName((await params).name);
  if (!f) notFound();
  return <Drawer f={f} />;
}
