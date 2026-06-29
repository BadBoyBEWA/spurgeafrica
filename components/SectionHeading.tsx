export function SectionHeading({
  kicker,
  title,
  copy
}: {
  kicker: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="font-display text-xs uppercase tracking-[.28em] text-gold">{kicker}</p>
      <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{title}</h2>
      {copy && <p className="mt-4 text-sm leading-7 text-muted sm:text-base">{copy}</p>}
    </div>
  );
}
