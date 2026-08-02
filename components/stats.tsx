'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/reveal'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 340, suffix: '%', label: 'Average client growth' },
  { value: 120, suffix: '+', label: 'Brands launched' },
  { value: 48, suffix: 'M', label: 'Ad spend managed ($)' },
  { value: 9, suffix: '', label: 'Industry awards' },
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obj = { val: 0 }
    
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: target,
        duration: 1.6,
        ease: "power3.out",
        onUpdate: () => setValue(Math.round(obj.val)),
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      })
    })

    return () => ctx.revert()
  }, [target])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section id="about" className="border-t border-border bg-card py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-14">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-primary">The agency</p>
          <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-balance md:text-5xl">
            A senior team of strategists, designers, and media buyers — no account manager telephone games.
          </h2>
        </Reveal>

        <dl className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 120}>
              <dd className="font-display text-5xl font-bold text-primary md:text-6xl">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-2 text-sm text-muted-foreground">{stat.label}</dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
