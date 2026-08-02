'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, AlertTriangle, Send, Mail } from 'lucide-react'

const API = 'http://localhost:5055/api'

const DEMO_QUEUE = [
  { id: '1', business_name: 'Navrathan Sons', instagram_username: 'navrathansonsjewellers', city: 'Bangalore', status: 'audit_done', audit_id: 'demo', audit_url: '/audit/demo', audit_reports: [{ id: 'demo', slug: 'demo', score: 58 }] },
  { id: '2', business_name: 'Khimji Jewellers', instagram_username: 'khimjijewels', city: 'Mumbai', status: 'audit_done', audit_id: '2', audit_reports: [{ id: '2', slug: 'khimji-jewellers', score: 72 }] },
]

const containerVariants: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }

export default function DMQueuePage() {
  const [queue, setQueue] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState<string | null>(null)
  const [result, setResult] = useState<Record<string, any>>({})
  const [emailInput, setEmailInput] = useState<Record<string, string>>({})
  const [queueStatus, setQueueStatus] = useState<any>(null)
  const [bulkSending, setBulkSending] = useState(false)

  const fetchQueue = () => {
    fetch(`${API}/dm/queue`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setQueue(d.length ? d : DEMO_QUEUE) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const fetchStatus = () => {
    fetch(`${API}/dm/queue-status`)
      .then(r => r.json())
      .then(d => setQueueStatus(d))
      .catch(() => {})
  }

  useEffect(() => {
    fetchQueue()
    fetchStatus()
    const interval = setInterval(() => {
      fetchStatus()
      fetchQueue()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleBulkSend = async () => {
    const readyBrands = queue.filter(b => b.status !== 'dm_sent' && b.status !== 'queued' && b.audit_reports?.length > 0)
    if (readyBrands.length === 0) return alert('No brands ready for bulk sending.')
    
    setBulkSending(true)
    try {
      await fetch(`${API}/dm/bulk-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_ids: readyBrands.map(b => b.id) }),
      })
      alert(`Sent ${readyBrands.length} brands to the background Outreach Engine!`)
      fetchQueue()
    } catch (err: any) {
      alert(err.message)
    }
    setBulkSending(false)
  }

  const handleSend = async (brand: any) => {
    const auditId = brand.audit_id || brand.audit_reports?.[0]?.id
    if (!auditId) return alert('No audit generated for this brand yet.')

    setSending(brand.id)
    try {
      const res = await fetch(`${API}/dm/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_id: brand.id, audit_id: auditId }),
      })
      const data = await res.json()
      setResult(r => ({ ...r, [brand.id]: data }))
      setQueue(q => q.map(b => b.id === brand.id ? { ...b, status: 'dm_sent' } : b))
    } catch (err: any) {
      setResult(r => ({ ...r, [brand.id]: { error: err.message } }))
    }
    setSending(null)
  }

  const handleSendEmail = async (brand: any) => {
    const auditId = brand.audit_id || brand.audit_reports?.[0]?.id
    if (!auditId) return alert('No audit generated for this brand yet.')
    
    const email = emailInput[brand.id] || brand.email
    if (!email) return alert('Please enter an email address first.')

    setSending(brand.id + '_email')
    try {
      const res = await fetch(`${API}/dm/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_id: brand.id, audit_id: auditId, email }),
      })
      const data = await res.json()
      setResult(r => ({ ...r, [brand.id]: data }))
      setQueue(q => q.map(b => b.id === brand.id ? { ...b, status: 'dm_sent', email } : b))
    } catch (err: any) {
      setResult(r => ({ ...r, [brand.id]: { error: err.message } }))
    }
    setSending(null)
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 pt-4">
        <div className="h-10 bg-secondary rounded-xl w-64 mb-10"></div>
        <div className="h-24 bg-secondary rounded-[2rem] w-full mb-6"></div>
        {[1,2,3].map(i => <div key={i} className="h-32 bg-secondary rounded-2xl w-full"></div>)}
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl font-bold text-foreground mb-2 tracking-tighter">Outreach Automation Engine</h2>
          <p className="text-muted-foreground">{queue.length} brands ready to receive their audit link.</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={handleBulkSend}
            disabled={bulkSending || queue.length === 0}
            className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {bulkSending ? '⏳ Queuing...' : <><Send className="size-4"/> Bulk Send DMs & Emails</>}
          </button>
        </div>
      </motion.div>

      {queueStatus && (
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="text-sm font-bold text-muted-foreground mb-1">DMs Processing</div>
            <div className="text-3xl font-display font-bold text-primary">{queueStatus.dm.processing}</div>
          </div>
          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="text-sm font-bold text-muted-foreground mb-1">DMs Pending</div>
            <div className="text-3xl font-display font-bold text-foreground">{queueStatus.dm.pending}</div>
          </div>
          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="text-sm font-bold text-muted-foreground mb-1">Emails Processing</div>
            <div className="text-3xl font-display font-bold text-primary">{queueStatus.email.processing}</div>
          </div>
          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="text-sm font-bold text-muted-foreground mb-1">Emails Pending</div>
            <div className="text-3xl font-display font-bold text-foreground">{queueStatus.email.pending}</div>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-[2rem] flex items-start gap-4">
        <AlertTriangle className="size-6 text-blue-400 shrink-0 mt-1" />
        <div>
          <h3 className="font-display font-bold text-lg text-blue-400 mb-1">Background Headless Mode Active</h3>
          <p className="text-sm text-blue-400/80 leading-relaxed">
            DMs are processed sequentially via a fully headless Puppeteer instance in the background to protect your Instagram account.
            Emails are processed in parallel batches of 5. You can safely close this tab while the queue runs.
          </p>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} className="flex flex-col gap-4">
        {queue.map((brand) => {
          const audit = brand.audit_reports?.[0]
          const r = result[brand.id]
          
          return (
            <motion.div variants={itemVariants} key={brand.id} className="bg-card p-6 md:p-8 rounded-[2rem] border border-border flex flex-col md:flex-row items-center gap-6 md:gap-10">
              
              <div className="flex-1 min-w-0 w-full">
                <h3 className="font-display font-bold text-2xl text-foreground mb-1">{brand.business_name}</h3>
                <div className="text-primary font-medium mb-3">@{brand.instagram_username}</div>
                
                {audit && (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-secondary px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground uppercase tracking-widest border border-border">Score: {audit.score}/100</span>
                    {brand.city && <span className="bg-secondary px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground uppercase tracking-widest border border-border">📍 {brand.city}</span>}
                  </div>
                )}

                {r && (
                  <div className={`mt-4 p-4 rounded-xl text-sm font-medium border ${r.error ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-green-500/10 text-green-400 border-green-500/30'}`}>
                    {r.error ? `❌ ${r.error}` : r.mode === 'puppeteer_headless' ? `✅ ${r.message}` : `✅ Sent successfully!`}
                  </div>
                )}
                
                {brand.status === 'queued' && (
                  <div className="mt-4 p-4 rounded-xl text-sm font-medium border bg-blue-500/10 text-blue-400 border-blue-500/30">
                    ⏳ In Background Queue...
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 w-full md:w-[320px] shrink-0">
                <div className="flex items-center gap-2">
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                    value={emailInput[brand.id] !== undefined ? emailInput[brand.id] : (brand.email || '')}
                    onChange={e => setEmailInput(prev => ({ ...prev, [brand.id]: e.target.value }))}
                  />
                  <button
                    onClick={() => handleSendEmail(brand)}
                    disabled={sending === brand.id + '_email' || brand.status === 'dm_sent'}
                    className="flex items-center gap-2 bg-secondary text-primary border border-primary/30 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/20 transition-colors shrink-0"
                  >
                    {sending === brand.id + '_email' ? '⏳' : <><Mail className="size-4"/> Email</>}
                  </button>
                </div>
                
                <button
                  onClick={() => handleSend(brand)}
                  disabled={sending === brand.id || brand.status === 'dm_sent' || brand.status === 'queued'}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending === brand.id ? '⏳ Queuing...' : brand.status === 'dm_sent' ? '✅ Contacted' : brand.status === 'queued' ? '⏳ Queued' : <><Send className="size-4"/> Send DM</>}
                </button>
              </div>

            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
