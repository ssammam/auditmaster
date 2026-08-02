'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Mail, Phone } from 'lucide-react'

const DEMO_LEADS = [
  { id: '1', name: 'Priya Mehta', phone: '+91 98765 43210', email: 'priya@example.com', message: 'We want more Instagram leads', status: 'new', created_at: new Date().toISOString(), audit_reports: { score: 58, brands: { business_name: 'Navrathan Sons' } } },
  { id: '2', name: 'Ravi Kumar', phone: '+91 87654 32109', email: 'ravi@khimji.com', message: 'Improve our Google rankings', status: 'contacted', created_at: new Date(Date.now() - 3600000).toISOString(), audit_reports: { score: 72, brands: { business_name: 'Khimji Jewellers' } } },
]

const STATUSES = ['new', 'contacted', 'proposal_sent', 'converted', 'lost']

function StatusBadge({ status }: { status: string }) {
  if (status === 'new') return <span className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{status}</span>
  if (status === 'converted') return <span className="bg-primary/10 border border-primary/30 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{status}</span>
  return <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{status}</span>
}

const containerVariants: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }

const API = 'http://localhost:5055/api'

export default function LeadsPage() {
  const [leads, setLeads] = useState(DEMO_LEADS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/leads`)
      .then(r => r.json())
      .then(d => { if (d.data?.length) setLeads(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id: string, status: string) => {
    setLeads(l => l.map(lead => lead.id === id ? { ...lead, status } : lead))
    try {
      await fetch(`${API}/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
    } catch {}
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 pt-4">
        <div className="h-10 bg-secondary rounded-xl w-64 mb-10"></div>
        {[1,2].map(i => <div key={i} className="h-40 bg-secondary rounded-2xl w-full"></div>)}
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <h2 className="font-display text-4xl font-bold text-foreground mb-2 tracking-tighter">Leads</h2>
        <p className="text-muted-foreground">{leads.length} leads captured from audit pages.</p>
      </motion.div>

      <motion.div variants={containerVariants} className="flex flex-col gap-5">
        {leads.map((lead) => (
          <motion.div variants={itemVariants} key={lead.id} className="bg-card p-6 md:p-8 rounded-[2rem] border border-border grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-6 md:gap-10 items-start">
            
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-display font-bold text-xl text-foreground">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-foreground truncate">{lead.name}</h3>
                  <div className="text-primary font-medium text-sm flex items-center gap-1"><Phone className="size-3" /> {lead.phone}</div>
                </div>
              </div>
              {lead.email && <div className="text-sm text-muted-foreground flex items-center gap-2 mb-2"><Mail className="size-4" /> {lead.email}</div>}
              {lead.message && (
                <div className="mt-4 bg-secondary/50 p-4 rounded-xl border border-border text-sm text-muted-foreground italic">
                  "{lead.message}"
                </div>
              )}
            </div>

            <div className="bg-secondary/20 p-5 rounded-2xl border border-border h-full flex flex-col justify-center">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Source Audit</div>
              <div className="font-display font-bold text-lg text-foreground mb-1">{lead.audit_reports?.brands?.business_name}</div>
              <div className="text-sm text-muted-foreground mb-4">Score: <span className="text-primary font-bold">{lead.audit_reports?.score}/100</span></div>
              <div className="text-xs text-muted-foreground font-medium">{new Date(lead.created_at).toLocaleString()}</div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4 h-full justify-between">
              <div className="flex items-center gap-3">
                <StatusBadge status={lead.status} />
                <select
                  value={lead.status}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                  className="bg-secondary border border-border text-foreground px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary cursor-pointer"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <button className="flex items-center gap-2 bg-[#25D366] text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#20b858] transition-colors mt-auto w-full md:w-auto justify-center">
                <MessageCircle className="size-4" /> WhatsApp
              </button>
            </div>

          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
