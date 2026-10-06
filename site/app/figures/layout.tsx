import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "Showcase", template: "%s · Isoform" } };

export default function FiguresLayout({ children }: LayoutProps<"/figures">) {
  return children;
}
