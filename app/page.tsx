import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { LogoMarquee } from '@/components/logo-marquee'
import { HangingServices } from '@/components/HangingServices'
import { Work } from '@/components/work'
import { Stats } from '@/components/stats'
import { Testimonials } from '@/components/testimonials'
import { CtaFooter } from '@/components/cta-footer'
import ModelSequence from '@/components/ModelSequence'
import HamsiniSequence from '@/components/HamsiniSequence'
import { SmoothScroll } from '@/components/smooth-scroll'

export default function Page() {
  return (
    <SmoothScroll>
      <SiteHeader />
      <main className="bg-background text-foreground overflow-hidden">
        <Hero />
        <LogoMarquee />
        
        {/* Vrewkriay AI Canvas Sequence */}
        <div className="relative z-20 w-full pt-10 pb-20 border-b border-border bg-background">
          <ModelSequence />
        </div>
        <Work />

        {/* Hamsini AI Sequence */}
        <div className="relative z-20 w-full border-b border-t border-border bg-background py-20">
          <HamsiniSequence />
        </div>

        <Stats />
        <Testimonials />
        <HangingServices />
      </main>
      <CtaFooter />
    </SmoothScroll>
  )
}
