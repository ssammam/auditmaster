import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

export function CtaFooter() {
  return (
    <footer id="contact" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <Reveal>
          <p className="mb-6 text-xs font-medium uppercase tracking-widest text-primary">
            Ready when you are
          </p>
        </Reveal>
        <Reveal delay={150}>
          <h2 className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-balance md:text-7xl lg:text-8xl">
            {"Let's make"}
            <br />
            something <span className="text-primary">loud.</span>
          </h2>
        </Reveal>
        <Reveal delay={300} className="mt-10">
          <a
            href="mailto:hello@revel.agency"
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 font-display text-lg font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            hello@revel.agency
            <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </Reveal>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-display text-lg font-bold">
            REVEL<span className="text-primary">®</span>
          </p>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a href="#services" className="transition-colors hover:text-foreground">
              Services
            </a>
            <a href="#work" className="transition-colors hover:text-foreground">
              Work
            </a>
            <a href="#about" className="transition-colors hover:text-foreground">
              Agency
            </a>
            <a href="mailto:hello@revel.agency" className="transition-colors hover:text-foreground">
              Contact
            </a>
          </nav>
          <p className="text-sm text-muted-foreground">© 2026 REVEL Agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
