import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer, Header } from "@/components/Chrome";
import { fxScript, themeScript } from "@/lib/prefs";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Isoform: isometric icons that draw themselves", template: "%s · Isoform" },
  description:
    "An agent skill that takes an Isocons icon apart and makes it a small line-art illustration that draws itself in and plays what the real object does. One HTML file, nothing to install.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        {/* the reader's saved theme and effects choice, applied before paint (lib/prefs.ts); the toggles re-apply
            them after hydration, which resets <html>'s attributes */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: two fixed localStorage reads, before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript + fxScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
