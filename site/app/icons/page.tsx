import type { Metadata } from "next";
import { Icons } from "@/components/spec/Icons";

export const metadata: Metadata = { title: "Icons", description: "All 1,007 Isocons, each with the prompt that animates it." };

export default function IconsPage() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6 px-4 pt-14 pb-8 sm:px-8">
        <h1 className="text-[clamp(3rem,8vw,7rem)] leading-[0.85] font-semibold tracking-[-0.06em]">
          Icons<span className="text-accent">.</span>
        </h1>
        <p className="max-w-sm text-[15px] text-pretty text-muted">
          Every Isocons icon. Copy its prompt and the skill makes the figure; a few carry a note from the sweep, with the views that avoid it.
        </p>
      </div>
      <Icons />
    </>
  );
}
