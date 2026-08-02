const brands = ['NOVAFIT', 'ATLAS & CO', 'PULSEBOARD', 'HELIOTROPE', 'KINDRED', 'ORBITAL', 'MARROW', 'FIELDNOTE']

export function LogoMarquee() {
  return (
    <section className="border-y border-border py-8" aria-label="Trusted by brands">
      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-16 pr-16">
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="font-display text-xl font-bold tracking-widest text-muted-foreground/60"
              aria-hidden={i >= brands.length}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
