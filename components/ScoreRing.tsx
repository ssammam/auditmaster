'use client'

import { useEffect, useRef } from 'react'

const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ScoreRing({ score, color, label }: { score: number, color: string, label: string }) {
  const circleRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    if (!circleRef.current) return
    const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE
    circleRef.current.style.strokeDashoffset = String(offset)
  }, [score])

  return (
    <div className="text-center flex flex-col items-center">
      <svg width="200" height="200" className="-rotate-90">
        <circle
          cx="100" cy="100" r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
        />
        <circle
          ref={circleRef}
          cx="100" cy="100" r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      <div className="-mt-[140px] relative text-center pointer-events-none flex flex-col items-center">
        <div className="text-[3rem] font-black leading-none font-display tracking-tighter" style={{ color }}>{score}</div>
        <div className="text-[.85rem] font-bold uppercase tracking-widest mt-1" style={{ color }}>{label}</div>
        <div className="text-xs text-muted-foreground mt-1">out of 100</div>
      </div>
      <div className="mt-[70px]" />
    </div>
  )
}
