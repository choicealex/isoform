import { FIGURES } from "@/lib/iso";

export const dynamic = "force-static";

/* a plain summary for agents: what Isoform is, how to use it, and every figure with its prompt */
export function GET() {
  const body = `# Isoform

> An agent skill that turns an Isocons isometric icon (isocons.app, CC BY 4.0) into a small line-art illustration: it draws itself in, plays a short story of what the real object does, and lets hover take over. Output is one self-contained HTML file.

## Use
- Install: npx skills add choicealex/isoform
- Ask: /isoform-animate <icon id or idea>
- The agent finds the icon, offers 2-3 concepts, writes one figure file on a fixed engine, photographs and checks it, and hands back isoform-<name>.html.

## Docs
- /docs: the figure file, page options (?intensity ?theme ?gl=0 ?style ?stroke ?fill=0 ?t ?at ?w), theme tokens (--iso-*), engine API, accessibility, licence
- /skill: the six steps, with every example prompt

## Figures
${FIGURES.map((f) => `- ${f.name} (Isocons "${f.title}", ${f.variant}): ${f.means} ${f.prompt ? `Prompt: ${f.prompt}` : "(one of the skill's own examples)"}`).join("\n")}

## Credit
Icons: Isocons by @leyeConnect and @meandchimso, CC BY 4.0. Keep the credit with every figure. Isocons does not endorse Isoform.
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
