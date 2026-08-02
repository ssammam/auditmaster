import { Quote } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const testimonials = [
  {
    quote:
      'REVEL rebuilt our entire funnel in six weeks. We went from guessing to knowing — and revenue followed.',
    name: 'Maya Torres',
    role: 'CMO, NovaFit',
  },
  {
    quote:
      "The rare agency that acts like a partner. Their creative doesn't just look premium, it converts like crazy.",
    name: 'Daniel Okafor',
    role: 'Founder, Atlas & Co',
  },
  {
    quote:
      'Our organic traffic tripled and our brand finally feels like us. Best marketing investment we have made.',
    name: 'Priya Raman',
    role: 'VP Growth, Pulseboard',
  },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-14 md:mb-20">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-primary">Client love</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-balance md:text-6xl">
            Word travels fast.
          </h2>
        </Reveal>

        <ul className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal
              as="li"
              key={t.name}
              delay={i * 150}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-8"
            >
              <div>
                <Quote className="size-7 text-primary" aria-hidden="true" />
                <blockquote className="mt-5 text-lg leading-relaxed text-pretty">
                  {`"${t.quote}"`}
                </blockquote>
              </div>
              <footer className="mt-8">
                <p className="font-display font-bold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </footer>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
