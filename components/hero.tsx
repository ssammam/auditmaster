import Image from 'next/image'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            Digital Marketing Agency
          </p>
        </Reveal>

        <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-balance md:text-7xl lg:text-8xl">
          <Reveal as="span" className="block" delay={100}>
            We make brands
          </Reveal>
          <Reveal as="span" className="block text-primary" delay={250}>
            impossible
          </Reveal>
          <Reveal as="span" className="block" delay={400}>
            to ignore.
          </Reveal>
        </h1>

        <div className="mt-10 flex flex-col gap-10 md:mt-14 md:flex-row md:items-end md:justify-between">
          <Reveal delay={550} className="max-w-md">
            <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
              REVEL is a creative digital marketing agency. We craft campaigns, brands, and
              experiences that turn attention into revenue.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
              >
                Start a Project
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                See Our Work
                <ArrowDownRight className="size-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={650} className="hidden text-right md:block">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Scroll to explore</p>
          </Reveal>
        </div>

        <Reveal direction="scale" delay={300} className="mt-14 md:mt-20">
          <div className="relative aspect-[16/8] overflow-hidden rounded-2xl border border-border">
            <Image
              src="/images/hero-visual.png"
              alt="Abstract chrome sculpture with neon green light — REVEL brand visual"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1216px"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
