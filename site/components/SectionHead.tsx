export function SectionHead({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <div className="mb-8 grid gap-3 md:grid-cols-[1fr_1fr] md:items-end">
      <div>
        <p className="mb-2 font-mono text-[11px] text-accent uppercase tracking-wider">{kicker}</p>
        <h2 className="text-3xl font-medium tracking-[-0.03em] text-balance">{title}</h2>
      </div>
      <p className="max-w-md text-pretty text-muted md:justify-self-end">{body}</p>
    </div>
  );
}
