'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Copy } from 'lucide-react'

const DEMO_AUDITS = [
  { id: '1', slug: 'demo', score: 58, summary: 'A comprehensive audit analyzing performance metrics.', created_at: new Date().toISOString(), brands: { business_name: 'Navrathan Sons', instagram_username: 'navrathansonsjewellers' } },
  { id: '2', slug: 'khimji-jewellers', score: 72, summary: 'Strong local presence but needs work on Instagram strategy.', created_at: new Date(Date.now() - 3600000).toISOString(), brands: { business_name: 'Khimji Jewellers', instagram_username: 'khimjijewels' } },
]

function scoreColor(s: number) {
  if (s >= 80) return 'text-[#d2ff00] border-[#d2ff00] bg-[#d2ff00]/10'
  if (s >= 60) return 'text-zinc-300 border-zinc-500 bg-zinc-800'
  return 'text-zinc-500 border-zinc-700 bg-zinc-900'
}

const containerVariants: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }

const API = 'http://localhost:5055/api'

export default function AuditsPage() {
  const [audits, setAudits] = useState(DEMO_AUDITS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/audits`)
      .then(r => r.json())
      .then(d => { if (d.data?.length) setAudits(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 pt-4">
        <div className="h-10 bg-secondary rounded-xl w-64 mb-10"></div>
        {[1,2].map(i => <div key={i} className="h-32 bg-secondary rounded-2xl w-full"></div>)}
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <h2 className="font-display text-4xl font-bold text-foreground mb-2 tracking-tighter">Audit Reports</h2>
        <p className="text-muted-foreground">{audits.length} automated audits generated.</p>
      </motion.div>

      <motion.div variants={containerVariants} className="flex flex-col gap-5">
        {audits.map((audit) => (
          <motion.div variants={itemVariants} key={audit.id} className="bg-card p-6 md:p-8 rounded-[2rem] border border-border flex flex-col md:flex-row gap-6 md:gap-8 items-center transition-all hover:border-primary/30">
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-4xl font-display font-bold ${scoreColor(audit.score)}`}>
                {audit.score}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-3">Score</span>
            </div>

            <div className="flex-1 min-w-0 w-full text-center md:text-left">
              <h3 className="font-display font-bold text-2xl text-foreground truncate">{audit.brands?.business_name}</h3>
              <p className="text-primary font-medium mb-3">@{audit.brands?.instagram_username}</p>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{audit.summary}</p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3 shrink-0 w-full md:w-auto">
              <a href={`/audit/${audit.slug}`} className="flex items-center justify-center w-full md:w-auto gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
                <ExternalLink className="size-4" /> View Report
              </a>
              <button className="flex items-center justify-center w-full md:w-auto gap-2 border border-border bg-secondary text-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:border-primary/50 transition-colors">
                <Copy className="size-4" /> Copy Link
              </button>
              <span className="text-xs font-medium text-muted-foreground mt-2">{new Date(audit.created_at).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
