import { Megaphone, PenTool, BarChart3, Globe, Sparkles, Search } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const services = [
  {
    icon: Megaphone,
    title: 'Paid Media & Campaigns',
    description:
      'Full-funnel paid campaigns across social, search, and programmatic — engineered for ROAS, not vanity metrics.',
  },
  {
    icon: PenTool,
    title: 'Brand & Identity',
    description:
      'Naming, visual identity, and voice systems that give your brand a point of view people remember.',
  },
  {
    icon: Search,
    title: 'SEO & Content',
    description:
      'Search strategies and editorial content that compound over time and own the conversations that matter.',
  },
  {
    icon: Globe,
    title: 'Web & Digital Experience',
    description:
      'High-converting websites and digital products designed to feel as good as they perform.',
  },
  {
    icon: Sparkles,
    title: 'Social & Creative',
    description:
      'Scroll-stopping creative and social storytelling that builds community, not just impressions.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Growth',
    description:
      'Measurement frameworks and CRO programs that turn data into decisions — and decisions into growth.',
  },
]

export function Services() {
  return (
    <section id="services" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-primary">What we do</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-balance md:text-6xl">
              Services built
              <br />
              for growth.
            </h2>
          </Reveal>
          <Reveal delay={150} className="max-w-sm">
            <p className="leading-relaxed text-muted-foreground text-pretty">
              Six disciplines, one team. Every service is designed to work alone — and hit harder together.
            </p>
          </Reveal>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal as="li" key={service.title} delay={(i % 3) * 120} className="group bg-background p-8 transition-colors hover:bg-card md:p-10">
              <service.icon className="size-8 text-primary" aria-hidden="true" />
              <h3 className="mt-6 font-display text-xl font-bold">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
              <p className="mt-6 font-display text-5xl font-bold text-secondary transition-colors group-hover:text-primary/20">
                {String(i + 1).padStart(2, '0')}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
