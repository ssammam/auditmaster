'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type RevealProps = {
  children: ReactNode
  direction?: 'up' | 'left' | 'right' | 'scale'
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'span' | 'article' | 'li'
}

export function Reveal({ children, direction = 'up', delay = 0, className, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let x = 0
    let y = 0
    let scale = 1

    if (direction === 'up') y = 100
    if (direction === 'left') x = -100
    if (direction === 'right') x = 100
    if (direction === 'scale') scale = 0.8

    // Set initial state
    gsap.set(el, { opacity: 0, x, y, scale })

    // Create GSAP animation
    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.2,
        delay: delay / 1000,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%", // Starts animating when the element enters the bottom 15% of viewport
          toggleActions: "play none none none"
        }
      })
    })

    return () => {
      ctx.revert() // Clean up GSAP instances
    }
  }, [direction, delay])

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn(className, "will-change-transform")}
    >
      {children}
    </Tag>
  )
}
