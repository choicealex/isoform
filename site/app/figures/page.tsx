import { Wall } from "@/components/spec/Wall";
import { FIGURES } from "@/lib/iso";

export default function FiguresPage() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6 px-4 pt-14 pb-8 sm:px-8">
        <h1 className="text-[clamp(3rem,8vw,7rem)] leading-[0.85] font-semibold tracking-[-0.06em]">
          Figures<span className="text-accent">.</span>
        </h1>
        <p className="max-w-sm text-[15px] text-pretty text-muted">
          {FIGURES.length} figures, each an Isocons icon taken apart and made to act. Open one to inspect it on its lines.
        </p>
      </div>
      <Wall filters />
    </>
  );
}
