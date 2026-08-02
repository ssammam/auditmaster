import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const projects = [
  {
    title: 'NovaFit',
    category: 'App Launch Campaign',
    result: '+312% installs in 90 days',
    image: '/images/work-nova.png',
    alt: 'NovaFit fitness app displayed on a smartphone with lime green dark UI',
  },
  {
    title: 'Atlas & Co',
    category: 'Brand Identity & DTC Strategy',
    result: '4.2x return on ad spend',
    image: '/images/work-atlas.png',
    alt: 'Atlas & Co skincare bottles with bold typographic packaging',
  },
  {
    title: 'Pulseboard',
    category: 'SEO, Content & Web',
    result: '#1 for 40+ target keywords',
    image: '/images/work-pulse.png',
    alt: 'Pulseboard analytics dashboard with green data visualizations on a laptop',
  },
]

export function Work() {
  return (
    <section id="work" className="border-t border-border py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-14 md:mb-20">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-primary">Selected work</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-balance md:text-6xl">
            Proof, not promises.
          </h2>
        </Reveal>

        <div className="flex flex-col gap-16 md:gap-24">
          {projects.map((project, i) => (
            <Reveal
              key={project.title}
              direction={i % 2 === 0 ? 'left' : 'right'}
              as="article"
              className="group grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl border border-border ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {project.category}
                </p>
                <h3 className="mt-3 font-display text-3xl font-bold md:text-5xl">{project.title}</h3>
                <p className="mt-5 inline-block rounded-full bg-primary/10 px-4 py-2 font-display text-lg font-bold text-primary">
                  {project.result}
                </p>
                <div className="mt-7">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    View case study
                    <ArrowUpRight className="size-4" />
                    <span className="sr-only">for {project.title}</span>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
