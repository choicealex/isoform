import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "Figures", template: "%s · Isoform" } };

export default function FiguresLayout({ children }: LayoutProps<"/figures">) {
  return children;
}
