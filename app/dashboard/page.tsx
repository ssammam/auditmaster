'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Zap } from 'lucide-react'

// Dummy data
const DEMO_STATS = {
  stats: { brands_found: 1250, audits_generated: 840, dms_sent: 802, pages_opened: 415, scrolled_70: 290, forms_submitted: 142, leads_converted: 68 },
}
const DEMO_ACTIVITY = {
  recentLeads: [
    { id: 1, name: 'Priya Mehta', phone: '+91 98765 43210', created_at: new Date().toISOString(), status: 'new' },
    { id: 2, name: 'Ravi Kumar', phone: '+91 87654 32109', created_at: new Date(Date.now() - 3600000).toISOString(), status: 'contacted' },
    { id: 3, name: 'Anjali Desai', phone: '+91 76543 21098', created_at: new Date(Date.now() - 8600000).toISOString(), status: 'new' },
  ],
  recentAudits: [
    { id: 1, slug: 'navrathan-sons', score: 58, created_at: new Date().toISOString(), brands: { business_name: 'Navrathan Sons', instagram_username: 'navrathansonsjewellers' } },
    { id: 2, slug: 'khimji-jewellers', score: 72, created_at: new Date(Date.now() - 7200000).toISOString(), brands: { business_name: 'Khimji Jewellers', instagram_username: 'khimjijewels' } },
    { id: 3, slug: 'malabar-gold', score: 85, created_at: new Date(Date.now() - 14400000).toISOString(), brands: { business_name: 'Malabar Gold', instagram_username: 'malabargold' } },
  ],
}

const FUNNEL = [
  { label: 'Brands Found', key: 'brands_found' },
  { label: 'Audits Generated', key: 'audits_generated' },
  { label: 'DMs Sent', key: 'dms_sent' },
  { label: 'Pages Opened', key: 'pages_opened' },
  { label: 'Scrolled >70%', key: 'scrolled_70' },
  { label: 'Forms Submitted', key: 'forms_submitted' },
  { label: 'Converted', key: 'leads_converted' },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function scoreColor(s: number) {
  if (s >= 80) return 'text-[#d2ff00] border-[#d2ff00] bg-[#d2ff00]/10'
  if (s >= 60) return 'text-zinc-300 border-zinc-500 bg-zinc-800'
  return 'text-zinc-500 border-zinc-700 bg-zinc-900'
}

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

const API = 'http://localhost:5055/api'

export default function DashboardPage() {
  const [stats, setStats] = useState(DEMO_STATS.stats)
  const [activity, setActivity] = useState(DEMO_ACTIVITY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/dashboard/stats`).then(r => r.json()).catch(() => DEMO_STATS),
      fetch(`${API}/dashboard/activity`).then(r => r.json()).catch(() => DEMO_ACTIVITY),
    ]).then(([s, a]) => {
      if (s.stats) setStats(s.stats)
      if (a.recentLeads) setActivity(a)
      setLoading(false)
    })
  }, [])

  const max = stats.brands_found || 1

  if (loading) {
    return (
      <div className="animate-pulse space-y-8 pt-4">
        <div className="h-12 bg-secondary rounded-xl w-64"></div>
        <div className="h-6 bg-secondary rounded-xl w-96"></div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-12">
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-display font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground text-lg">Real-time metrics for the Kriya audit engine by Vrewkriya.</p>
      </motion.div>

      {/* Stat grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {FUNNEL.map((f, i) => (
          <motion.div variants={itemVariants} key={f.key} className="bg-card p-6 rounded-2xl border border-border flex flex-col items-center justify-center transition-all duration-300 hover:border-primary/50 hover:bg-secondary/50 hover:-translate-y-1 cursor-default">
            <div className="text-4xl font-display font-bold mb-3 text-foreground tracking-tighter">
              {(stats[f.key as keyof typeof stats] || 0).toLocaleString()}
            </div>
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-center">{f.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Funnel chart */}
      <motion.div variants={itemVariants} className="bg-card rounded-[2rem] p-8 md:p-10 border border-border">
        <h3 className="text-2xl font-display font-bold text-foreground mb-8 flex items-center gap-3">
          <Zap className="size-6 text-primary" /> Conversion Funnel
        </h3>
        <div className="space-y-6">
          {FUNNEL.map((f, i) => {
            const val = stats[f.key as keyof typeof stats] || 0
            const pct = Math.round((val / max) * 100)
            return (
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 group" key={f.key}>
                <div className="w-40 md:text-right text-xs text-muted-foreground font-bold uppercase tracking-widest group-hover:text-foreground transition-colors">{f.label}</div>
                <div className="flex-1 bg-secondary rounded-full h-12 overflow-hidden relative border border-border group-hover:border-primary/30 transition-colors">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, delay: i * 0.1, type: 'spring', bounce: 0.2 }}
                    className="absolute top-0 left-0 h-full flex items-center justify-end px-4 bg-primary/20 border-r border-primary/50" 
                  >
                    <span className="text-sm font-bold text-primary drop-shadow-md">{val.toLocaleString()}</span>
                  </motion.div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent audits */}
        <motion.div variants={itemVariants} className="bg-card rounded-[2rem] p-8 md:p-10 border border-border">
          <h3 className="text-2xl font-display font-bold text-foreground mb-8 flex items-center gap-3">
            <Search className="size-6 text-primary" /> Recent Audits
          </h3>
          <div className="space-y-5">
            {activity.recentAudits?.map(a => (
              <div key={a.id} className="flex items-center gap-5 pb-5 border-b border-border last:border-0 last:pb-0 group">
                <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all duration-300 group-hover:scale-110 ${scoreColor(a.score)}`}>
                  {a.score}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-foreground text-xl truncate tracking-tight">{a.brands?.business_name}</div>
                  <div className="text-sm text-muted-foreground truncate">@{a.brands?.instagram_username}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <a href={`/audit/${a.slug}`} className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-lg">View</a>
                  <div className="text-xs text-muted-foreground font-medium">{timeAgo(a.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent leads */}
        <motion.div variants={itemVariants} className="bg-card rounded-[2rem] p-8 md:p-10 border border-border">
          <h3 className="text-2xl font-display font-bold text-foreground mb-8 flex items-center gap-3">
            <MapPin className="size-6 text-primary" /> Active Leads
          </h3>
          <div className="space-y-5">
            {activity.recentLeads?.map(l => (
              <div key={l.id} className="flex items-center gap-5 pb-5 border-b border-border last:border-0 last:pb-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display font-bold text-2xl">
                  {l.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-foreground text-xl truncate tracking-tight">{l.name}</div>
                  <div className="text-sm text-muted-foreground truncate">{l.phone}</div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${l.status === 'new' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary text-muted-foreground border border-border'}`}>
                    {l.status}
                  </span>
                  <div className="text-xs text-muted-foreground font-medium mt-3">{timeAgo(l.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
