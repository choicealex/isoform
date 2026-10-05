import type { Metadata } from "next";
import { Catalogue } from "@/components/Catalogue";

export const metadata: Metadata = { title: { default: "Figures", template: "%s · Isoform" } };

/* the catalogue stays mounted while a figure's drawer opens and closes over it */
export default function FiguresLayout({ children }: LayoutProps<"/figures">) {
  return (
    <>
      <Catalogue />
      {children}
    </>
  );
}
