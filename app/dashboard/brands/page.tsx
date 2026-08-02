'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Store, Search, Plus, ExternalLink, Link as LinkIcon, Send, Database, X } from 'lucide-react'

const API = 'http://localhost:5055/api'

const DEMO_BRANDS = [
  { id: '1', business_name: 'Navrathan Sons', instagram_username: 'navrathansonsjewellers', city: 'Bangalore', followers: 12400, status: 'dm_sent', website: 'navrathansonsjewellers.com', created_at: new Date().toISOString() },
  { id: '2', business_name: 'Khimji Jewellers', instagram_username: 'khimjijewels', city: 'Mumbai', followers: 8900, status: 'audit_done', website: 'khimjijewels.com', created_at: new Date(Date.now() - 3600000).toISOString() },
]

const STATUS_STYLES: Record<string, { class: string, label: string }> = {
  pending:    { class: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', label: 'Pending' },
  audit_done: { class: 'bg-[#d2ff00]/10 text-[#d2ff00] border-[#d2ff00]/30',    label: 'Audit Done' },
  dm_sent:    { class: 'bg-green-500/10 text-green-400 border-green-500/20',label: 'DM Sent' },
  dm_queued:  { class: 'bg-orange-500/10 text-orange-400 border-orange-500/20',   label: 'DM Queued' },
}

const containerVariants: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>(DEMO_BRANDS)
  const [loading, setLoading] = useState(true)
  const [showDiscover, setShowDiscover] = useState(false)
  const [discovering, setDiscovering] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [discoverCity, setDiscoverCity] = useState('')
  const [generating, setGenerating] = useState<string | null>(null)
  const [filterCity, setFilterCity] = useState('')
  const [viewingData, setViewingData] = useState<any | null>(null)

  useEffect(() => {
    const fetchBrands = () => {
      fetch(`${API}/brands?limit=1000`)
        .then(r => r.json())
        .then(d => { 
          if (d.data?.length) {
            const sorted = [...d.data].sort((a, b) => (b.followers || 0) - (a.followers || 0))
            setBrands(sorted)
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
    
    fetchBrands()
    const interval = setInterval(fetchBrands, 5000) // Auto-refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const handleDiscover = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!discoverCity) return alert('Enter a city name')
    
    setDiscovering(true)
    try {
      const res = await fetch(`${API}/brands/discover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: discoverCity, limit: 100 }),
      })
      const data = await res.json()
      if (data.data && data.data.length > 0) {
        setBrands(b => [...data.data, ...b].sort((a, b) => (b.followers || 0) - (a.followers || 0)))
        alert(data.message)
      } else {
        alert(data.message || 'No brands found')
      }
    } catch (err: any) {
      alert('Error discovering brands: ' + err.message)
    }
    setDiscovering(false)
    setShowDiscover(false)
    setDiscoverCity('')
  }

  const handleGenerateAudit = async (brand: any) => {
    setGenerating(brand.id)
    try {
      const res = await fetch(`${API}/audits/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_id: brand.id }),
      })
      const data = await res.json()
      if (data.slug) {
        window.open(`https://auditmaster-omega.vercel.app/audit/${data.slug}`, '_blank')
        setBrands(b => b.map(br => br.id === brand.id ? { ...br, status: 'audit_done' } : br))
      }
    } catch {}
    setGenerating(null)
  }

  const handleClearPending = async () => {
    setClearing(true)
    try {
      const res = await fetch(`${API}/audits/clear-pending`, { method: 'POST' })
      const data = await res.json()
      alert(data.message)
    } catch (err: any) {
      alert('Error clearing pending: ' + err.message)
    }
    setClearing(false)
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 pt-4">
        <div className="h-10 bg-secondary rounded-xl w-64 mb-10"></div>
        <div className="h-[30rem] bg-secondary rounded-[2rem] w-full"></div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl font-bold text-foreground mb-2 tracking-tighter">Brands Directory</h2>
          <p className="text-muted-foreground">{brands.length} jewellery brands in database.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Filter by location..."
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-full text-sm border border-border bg-background focus:outline-none focus:border-primary transition-colors w-full sm:w-auto"
            />
          </div>
          <button 
            onClick={() => setShowDiscover(!showDiscover)}
            disabled={discovering}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-border bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Search className="size-4" /> {discovering ? 'Scanning Google...' : 'Auto-Find Leads'}
          </button>
          <button 
            onClick={handleClearPending}
            disabled={clearing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 transition-colors"
          >
            {clearing ? '⏳ Starting...' : '⚡ Clear Pending'}
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="size-4" /> Add Brand
          </button>
        </div>
      </motion.div>

      {/* Discover Form */}
      {showDiscover && (
        <motion.div variants={itemVariants} className="bg-primary/5 border border-primary/20 p-6 rounded-2xl">
          <h3 className="font-display font-bold text-xl text-foreground mb-2 flex items-center gap-2">
            🤖 Auto-Find Jewellery Brands
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
            Enter a city. The system will search for up to 100 Instagram profiles matching "jewellery" in that city, scrape their data, and auto-generate their AI audits.
          </p>
          <form onSubmit={handleDiscover} className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full max-w-sm">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Target City</label>
              <input 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. Mumbai, Dubai, London" 
                value={discoverCity} 
                onChange={e => setDiscoverCity(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" disabled={discovering} className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors w-full sm:w-auto">
              {discovering ? '⏳ Scanning Web...' : '🚀 Start Scraping'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Table */}
      <motion.div variants={itemVariants} className="bg-card rounded-[2rem] border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Brand</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Instagram</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Followers</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {brands
                .filter(b => !filterCity || (b.city && b.city.toLowerCase().includes(filterCity.toLowerCase())))
                .map(brand => {
                const s = STATUS_STYLES[brand.status] || STATUS_STYLES.pending
                return (
                  <tr key={brand.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-display font-bold text-foreground text-lg">{brand.business_name}</div>
                      <div className="text-xs text-muted-foreground">{brand.city || 'Unknown City'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-primary font-semibold">@{brand.instagram_username}</div>
                      {brand.website && <div className="text-xs text-muted-foreground truncate max-w-[150px]">{brand.website}</div>}
                    </td>
                    <td className="px-6 py-4 text-foreground font-medium">
                      {brand.followers ? Number(brand.followers).toLocaleString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${s.class}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewingData(brand)} className="p-2 rounded-lg bg-secondary text-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="View Raw Data">
                          <Database className="size-4" />
                        </button>
                        {['audit_done', 'dm_sent', 'dm_queued'].includes(brand.status) ? (
                          <>
                            <button onClick={() => window.open(`/audit/${brand.instagram_username}`, '_blank')} className="p-2 rounded-lg bg-secondary text-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="View Audit">
                              <ExternalLink className="size-4" />
                            </button>
                            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/audit/${brand.instagram_username}`); alert('Copied!') }} className="p-2 rounded-lg bg-secondary text-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Copy Link">
                              <LinkIcon className="size-4" />
                            </button>
                            <button className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-colors" title="Send DM">
                              <Send className="size-4" />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => handleGenerateAudit(brand)}
                            disabled={generating === brand.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {generating === brand.id ? '⏳ Gen...' : '⚡ Gen Report'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Raw Data Modal */}
      {viewingData && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Database className="size-5 text-primary" /> Raw Scraped Data: @{viewingData.instagram_username}
              </h3>
              <button onClick={() => setViewingData(null)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <pre className="text-xs text-muted-foreground bg-secondary/30 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap break-words">
                {JSON.stringify(viewingData.notes ? (() => { try { return JSON.parse(viewingData.notes) } catch { return viewingData.notes } })() : viewingData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
