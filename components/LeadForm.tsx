'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

const API = 'http://localhost:5000'

export default function LeadForm({ auditId, brandName, visitorId, onSubmit }: any) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) { setError('Name and phone are required.'); return }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audit_id: auditId, ...form }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      onSubmit(data)
    } catch (err) {
      onSubmit({})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-card to-background border border-primary/20 rounded-[2rem] p-8 md:p-12 max-w-2xl mx-auto shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors pointer-events-none" />
      <div className="relative z-10">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4 animate-bounce">💎</div>
          <h2 className="text-3xl font-display font-bold mb-3 tracking-tighter">Get Your Free Growth Plan</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            Our consultants will review your audit for <strong className="text-primary">{brandName}</strong> and create a personalised strategy — at zero cost.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Your Name *</label>
              <input
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                placeholder="Priya Sharma"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">WhatsApp Number *</label>
              <input
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
              placeholder="priya@brand.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Anything specific?</label>
            <textarea
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground min-h-[100px]"
              placeholder="We want more Instagram leads, better Google rankings..."
              value={form.message}
              onChange={e => set('message', e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-display font-bold text-lg py-4 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {loading ? '⏳ Submitting...' : '🚀 Get My Free Growth Plan'}
          </button>

          <p className="text-center text-xs text-muted-foreground font-medium flex items-center justify-center gap-1 mt-4">
            <CheckCircle2 className="size-3 text-primary" /> Zero spam. No credit card. Your data stays private.
          </p>
        </form>
      </div>
    </div>
  )
}
