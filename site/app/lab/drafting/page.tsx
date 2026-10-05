import { Bricolage_Grotesque } from "next/font/google";
import { Drafting } from "@/components/lab/drafting/Drafting";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-draft", display: "swap" });

export default function Page() {
  return <Drafting className={display.variable} />;
}
