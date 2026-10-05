/* plain helpers of the Specimen system, safe on the server and the client */
import { FIGURES } from "./iso";

export const LABEL = "font-mono text-[11px] uppercase tracking-[0.06em] text-muted";

/* Fig. 01 … in catalogue order */
export const figNo = (name: string) => `Fig. ${String(FIGURES.findIndex((f) => f.name === name) + 1).padStart(2, "0")}`;

/* the ruled cell grid behind a block: 12 columns wide, rows of `row` px */
export const ruled = (row = 120) => ({
  backgroundImage: "linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px)",
  backgroundSize: `calc(100% / 12) ${row}px`,
});
