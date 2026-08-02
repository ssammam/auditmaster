'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell } from 'recharts'
import { CheckCircle2, AlertTriangle, TrendingUp, Search, Smartphone, Shield, Zap, Globe, Mail, X, Sparkles, ArrowRight } from 'lucide-react'

/* ── Typewriter Effect ── */
function Typewriter({ text, speed = 40, className = '', delay = 0 }: { text: string; speed?: number; className?: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (isInView && !started) {
      const timer = setTimeout(() => setStarted(true), delay)
      return () => clearTimeout(timer)
    }
  }, [isInView, delay, started])

  useEffect(() => {
    if (!started) return
    if (displayed.length < text.length) {
      const timer = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed)
      return () => clearTimeout(timer)
    }
  }, [displayed, text, speed, started])

  return (
    <span ref={ref} className={className}>
      {displayed}
      {displayed.length < text.length && <span className="animate-pulse">|</span>}
    </span>
  )
}

/* ── Scroll Reveal Wrapper ── */
function ScrollReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Scroll-triggered CTA Popup ── */
function ScrollCTAPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent > 45) setShow(true)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dismissed])

  const handleDismiss = () => { setDismissed(true); setShow(false) }

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-sm sm:w-full"
        >
          <div className="relative rounded-3xl overflow-hidden border border-primary/30 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(210,255,0,0.08)]">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f0a] via-[#0d1210] to-[#05070A]" />
            <motion.div
              animate={{ background: [
                'radial-gradient(circle at 20% 30%, rgba(210,255,0,0.08) 0%, transparent 60%)',
                'radial-gradient(circle at 80% 70%, rgba(210,255,0,0.06) 0%, transparent 60%)',
                'radial-gradient(circle at 50% 50%, rgba(210,255,0,0.08) 0%, transparent 60%)',
              ]}}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-0"
            />

            {/* Close button */}
            <button onClick={handleDismiss} className="absolute top-3 right-3 z-20 size-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
              <X className="size-3.5" />
            </button>

            <div className="relative z-10 p-6">
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="size-5 text-primary" />
                </motion.div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Free Audit Available</span>
              </div>
              
              <h4 className="text-white text-lg font-bold font-display mb-2">
                Want a free audit for <em className="text-primary">your</em> brand?
              </h4>
              <p className="text-white/40 text-sm leading-relaxed mb-5">
                Get a comprehensive AI-powered digital analysis of your brand — completely free. No strings attached.
              </p>
              
              <motion.a
                href="https://www.vrewkriya.com/#contact"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-emerald-400 text-black font-bold text-sm hover:shadow-[0_0_30px_rgba(210,255,0,0.25)] transition-shadow"
              >
                Contact Vrewkriya
                <ArrowRight className="size-4" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
import ScoreRing from '../../../components/ScoreRing'
import FindingCard from '../../../components/FindingCard'
import LeadForm from '../../../components/LeadForm'
import { DEMO_AUDIT } from '../../../data/demoAudit'

const API = 'http://localhost:5055/api'
const FREE_FINDINGS = 3

const getCategoryScores = (findings: any[]) => {
  const categories: Record<string, any> = {
    'Social': { total: 0, count: 0 },
    'Website': { total: 0, count: 0 },
    'SEO': { total: 0, count: 0 },
    'Local': { total: 0, count: 0 },
    'Trust': { total: 0, count: 0 },
    'Performance': { total: 0, count: 0 },
  }
  const scoreMap: Record<string, number> = { 'Excellent': 100, 'Good': 80, 'Average': 60, 'Needs Improvement': 40, 'Poor': 20 }
  findings.forEach(f => {
    const cat = f.category
    if (categories[cat]) {
      categories[cat].total += scoreMap[f.status] || 50
      categories[cat].count += 1
    } else if (['Branding', 'Content'].includes(cat)) {
      categories['Social'].total += scoreMap[f.status] || 50
      categories['Social'].count += 1
    }
  })
  return Object.keys(categories).map(key => ({
    subject: key,
    A: categories[key].count > 0 ? Math.round(categories[key].total / categories[key].count) : 50,
    fullMark: 100
  }))
}

const getImpactData = (findings: any[]) => {
  const counts = { High: 0, Medium: 0, Low: 0 }
  findings.forEach(f => { if (counts[f.impact as keyof typeof counts] !== undefined) counts[f.impact as keyof typeof counts]++ })
  return [
    { name: 'Critical (High Impact)', value: counts.High, color: '#E8504A' },
    { name: 'Warnings (Medium Impact)', value: counts.Medium, color: '#E8C14A' },
    { name: 'Notices (Low Impact)', value: counts.Low, color: '#4AE888' },
  ]
}

export default function AuditPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [audit, setAudit] = useState<any>(null)
  const [brand, setBrand] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [unlocked, setUnlocked] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [visitorId, setVisitorId] = useState<string | null>(null)
  
  const trackSent = useRef(false)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (slug === 'demo') {
      setAudit(DEMO_AUDIT)
      setBrand(DEMO_AUDIT.brands)
      setLoading(false)
      return
    }
    fetch(`${API}/audits/slug/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setAudit(data)
        setBrand(data.brands)
      })
      .catch(() => {
        setAudit(DEMO_AUDIT)
        setBrand(DEMO_AUDIT.brands)
      })
      .finally(() => setLoading(false))
  }, [slug])

  const handleUnlock = useCallback(() => {
    setUnlocked(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [])

  const categoryData = useMemo(() => audit ? getCategoryScores(audit.findings || audit.findings_json || []) : [], [audit])
  const impactData = useMemo(() => audit ? getImpactData(audit.findings || audit.findings_json || []) : [], [audit])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-primary font-bold uppercase tracking-widest text-sm animate-pulse">Analyzing Digital Footprint...</p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative z-10 max-w-lg w-full flex flex-col items-center">
          <div className="size-20 bg-primary rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(210,255,0,0.4)]">
            <CheckCircle2 className="size-10 text-background" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-4 tracking-tighter">Report Unlocked</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Our lead consultant has been notified. We are preparing your tailored action plan for <strong className="text-foreground">{brand?.business_name}</strong>.
          </p>
          
          <div className="bg-card w-full text-left border border-border rounded-2xl p-8">
            <h3 className="flex items-center gap-2 border-b border-border pb-4 mb-6 text-xl font-bold font-display">
              What happens next?
            </h3>
            <ul className="flex flex-col gap-6">
              <li className="flex gap-4 items-start">
                <div className="bg-secondary p-3 rounded-xl text-xl">📞</div>
                <div>
                  <strong className="block text-foreground mb-1">Consultation Call</strong>
                  <span className="text-muted-foreground text-sm">We will reach out via WhatsApp or Phone within 24 hours.</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="bg-secondary p-3 rounded-xl text-xl">🎯</div>
                <div>
                  <strong className="block text-foreground mb-1">Strategy Roadmap</strong>
                  <span className="text-muted-foreground text-sm">We'll discuss the top 3 highest impact fixes to implement immediately.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const findings = audit?.findings || audit?.findings_json || []
  const sortedFindings = [...findings].sort((a, b) => {
    const weights: Record<string, number> = { High: 3, Medium: 2, Low: 1 }
    return (weights[b.impact] || 0) - (weights[a.impact] || 0)
  })

  const visibleFindings = unlocked ? sortedFindings : sortedFindings.slice(0, FREE_FINDINGS)
  const blurredFindings = unlocked ? [] : sortedFindings.slice(FREE_FINDINGS, FREE_FINDINGS + 4)
  const hiddenCount = Math.max(0, findings.length - FREE_FINDINGS - blurredFindings.length)
  
  const score = audit?.score || 0
  const scoreColor = score >= 80 ? '#4AE888' : score >= 60 ? '#E8C14A' : score >= 40 ? '#E8824A' : '#E8504A'
  const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Average' : score >= 40 ? 'Needs Work' : 'Critical'

  return (
    <div className="min-h-screen pb-20 bg-[#05070A] font-sans">
      
      {/* ── Scroll CTA Popup ── */}
      <ScrollCTAPopup />

      {/* ── Premium Hero ── */}
      <div className="relative pt-24 pb-16 px-6 text-center border-b border-border overflow-hidden bg-[radial-gradient(ellipse_at_top,_#1A1F35_0%,_#05070A_100%)]">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full"
          >
            <Shield className="size-4 text-primary" />
            <span className="text-primary text-xs font-bold tracking-[0.15em] uppercase">Comprehensive Digital Audit</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-5xl md:text-6xl font-display font-bold leading-[1.1] mb-4 tracking-tighter break-words"
          >
            <Typewriter text="Performance Analysis for" speed={35} delay={600} /><br />
            <span className="text-primary italic">{brand?.business_name || 'Your Brand'}</span>
          </motion.h1>

          {/* Brand Website URL Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <a
              href={
                brand?.website_url || brand?.website
                  ? (brand.website_url || brand.website).startsWith('http')
                    ? (brand.website_url || brand.website)
                    : `https://${brand.website_url || brand.website}`
                  : `https://www.${(brand?.business_name || 'brand').toLowerCase().replace(/\s+/g, '')}.com`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 text-primary text-xs sm:text-sm font-mono tracking-wide transition-all hover:scale-105 shadow-md"
            >
              <Globe className="size-3.5" />
              <span>
                {brand?.website_url || brand?.website || `www.${(brand?.business_name || 'brand').toLowerCase().replace(/\s+/g, '')}.com`}
              </span>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 sm:mb-16"
          >
            We&apos;ve scanned millions of data points across your website, social media, and local search presence. Here is your competitive benchmark.
          </motion.p>

          <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center shadow-2xl">
            <div className="flex-1 min-w-[250px] flex flex-col items-center md:border-r border-border">
              <ScoreRing score={score} color={scoreColor} label={scoreLabel} />
            </div>

            <div className="flex-[2] grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full text-left">
              <div className="bg-black/30 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                <div className="text-muted-foreground text-[10px] sm:text-xs uppercase font-bold mb-1.5 sm:mb-2 flex items-center gap-1.5"><TrendingUp className="size-3.5 text-primary"/> Total Issues</div>
                <div className="text-2xl sm:text-3xl font-black text-white">{findings.length}</div>
              </div>
              <div className="bg-black/30 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                <div className="text-muted-foreground text-[10px] sm:text-xs uppercase font-bold mb-1.5 sm:mb-2 flex items-center gap-1.5"><AlertTriangle className="size-3.5 text-red-500"/> Critical</div>
                <div className="text-2xl sm:text-3xl font-black text-red-500">{impactData.find((d: any) => d.name.includes('Critical'))?.value || 0}</div>
              </div>
              <div className="bg-black/30 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                <div className="text-muted-foreground text-[10px] sm:text-xs uppercase font-bold mb-1.5 sm:mb-2 flex items-center gap-1.5"><Search className="size-3.5 text-blue-400"/> SEO Score</div>
                <div className="text-2xl sm:text-3xl font-black text-white">{categoryData.find((c: any) => c.subject === 'SEO')?.A || 0}%</div>
              </div>
              <div className="bg-black/30 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                <div className="text-muted-foreground text-[10px] sm:text-xs uppercase font-bold mb-1.5 sm:mb-2 flex items-center gap-1.5"><Smartphone className="size-3.5 text-purple-400"/> Social</div>
                <div className="text-2xl sm:text-3xl font-black text-white">{categoryData.find((c: any) => c.subject === 'Social')?.A || 0}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Visualizations ── */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid md:grid-cols-2 gap-6">
          <ScrollReveal>
          <div className="bg-card/80 backdrop-blur-md rounded-3xl border border-border p-6 shadow-xl">
            <h3 className="text-center text-muted-foreground font-bold mb-6">Category Performance Matrix</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={categoryData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="#d2ff00" fill="#d2ff00" fillOpacity={0.4} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0E1420', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
          <div className="bg-card/80 backdrop-blur-md rounded-3xl border border-border p-6 shadow-xl">
            <h3 className="text-center text-muted-foreground font-bold mb-6">Issue Impact Breakdown</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} width={120} />
                  <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0E1420', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {impactData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ── Executive Summary ── */}
      <ScrollReveal className="max-w-5xl mx-auto px-6 mt-12">
        <div className="bg-card rounded-3xl border border-border border-l-4 border-l-primary p-8 md:p-10 shadow-lg">
          <h3 className="text-foreground text-xl font-display font-bold mb-4 flex items-center gap-2">
            <Zap className="size-5 text-primary" /> Executive Summary
          </h3>
          <p className="text-foreground/90 leading-relaxed text-lg">
            <Typewriter text={audit?.summary || ''} speed={15} delay={200} />
          </p>
        </div>
      </ScrollReveal>

      {/* ── Findings ── */}
      <div className="max-w-4xl mx-auto px-6 mt-20">
        <ScrollReveal>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-4xl font-display font-bold tracking-tighter mb-2">
              <Typewriter text="Detailed Audit Findings" speed={30} delay={100} />
            </h2>
            <p className="text-muted-foreground">Prioritized list of technical and strategic issues.</p>
          </div>
          <div className="bg-secondary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {findings.length} Total Opportunities
          </div>
        </div>
        </ScrollReveal>

        <div className="flex flex-col gap-5">
          {visibleFindings.map((f: any, i: number) => (
            <FindingCard key={f.id} finding={f} index={i} />
          ))}
        </div>

        {/* Blurred preview / Paywall */}
        {!unlocked && blurredFindings.length > 0 && (
          <div className="relative mt-5">
            <div className="pointer-events-none opacity-40 select-none">
              {blurredFindings.map((f: any, i: number) => (
                <div key={f.id} className="mb-5">
                  <FindingCard finding={f} index={FREE_FINDINGS + i} isPremium />
                </div>
              ))}
            </div>
            
            <div className="absolute inset-0 -top-8 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-[#05070A]/80 to-[#05070A] z-10">
              <div className="bg-card border border-primary/20 rounded-3xl p-8 md:p-12 text-center max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(210,255,0,0.1)]">
                <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="size-8 text-primary" />
                </div>
                <h3 className="text-foreground text-2xl font-bold font-display mb-4">
                  Unlock {hiddenCount + blurredFindings.length} Additional Premium Insights
                </h3>
                <p className="mb-8 text-muted-foreground leading-relaxed">
                  You are missing critical issues in your conversion funnel. Enter your details below to instantly unlock the full, unrestricted technical report.
                </p>
                <button onClick={handleUnlock} className="w-full bg-primary text-primary-foreground font-bold text-lg py-4 rounded-xl hover:bg-primary/90 transition-colors">
                  🔓 Unlock Full Audit — 100% Free
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Lead Form ── */}
      <div ref={formRef} className="max-w-4xl mx-auto px-6 mt-24">
        {(unlocked || findings.length === 0) && !submitted && (
          <LeadForm
            auditId={audit?.id || 'demo'}
            brandName={brand?.business_name}
            visitorId={visitorId}
            onSubmit={() => setSubmitted(true)}
          />
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="mt-32 relative overflow-hidden">
        {/* Gradient top border */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        
        {/* Subtle gradient background */}
        <div className="bg-gradient-to-b from-[#0a0f0a] to-[#050505] pt-16 pb-8 relative">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-stretch mb-12">
              {/* Art Piece Box 1: About Us */}
              <div className="relative group p-6 sm:p-8 rounded-3xl bg-[#0c120e]/80 border border-emerald-500/30 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(16,185,129,0.12)] overflow-hidden transition-all duration-500 hover:border-emerald-500/50 flex flex-col justify-between">
                {/* Background ambient light */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                    <Sparkles className="size-3.5" /> About Us
                  </div>
                  <div className="text-3xl font-bold font-display mb-3 text-white tracking-tight">
                    VREWKRIYA
                  </div>
                  <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                    Vrewkriya is a premium digital intelligence and growth agency. We leverage advanced AI models to help luxury and modern brands uncover hidden revenue bottlenecks and dominate their digital presence.
                  </p>
                </div>
              </div>

              {/* Art Piece Box 2: Connect With Us */}
              <div className="relative group p-6 sm:p-8 rounded-3xl bg-[#0c120e]/80 border border-emerald-500/30 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(16,185,129,0.12)] overflow-hidden transition-all duration-500 hover:border-emerald-500/50 flex flex-col justify-between">
                {/* Background ambient light */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                    <Globe className="size-3.5" /> Official Channels
                  </div>
                  <div className="text-3xl font-bold font-display mb-3 text-white tracking-tight">
                    CONNECT WITH US
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    Reach out directly or explore our official brand channels across web and social platforms.
                  </p>
                </div>

                <div className="relative z-10 pt-4">
                  <div className="grid grid-cols-4 gap-3 sm:gap-4">
                    {/* Website */}
                    <a href="https://vrewkriya.com" target="_blank" rel="noopener noreferrer" className="group/icon relative h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 flex flex-col items-center justify-center text-emerald-400 hover:from-emerald-500/40 hover:to-teal-600/40 hover:border-emerald-400/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-105 transition-all duration-300">
                      <Globe className="size-5" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300/80 mt-1">Web</span>
                    </a>
                    {/* Instagram */}
                    <a href="https://instagram.com/vrewkriya" target="_blank" rel="noopener noreferrer" className="group/icon relative h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-orange-500/20 border border-pink-500/30 flex flex-col items-center justify-center text-pink-400 hover:from-pink-500/40 hover:via-purple-500/40 hover:to-orange-500/40 hover:border-pink-400/50 hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] hover:scale-105 transition-all duration-300">
                      <InstagramIcon className="size-5" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-pink-300/80 mt-1">Insta</span>
                    </a>
                    {/* Facebook */}
                    <a href="https://www.facebook.com/profile.php?id=61583731659968" target="_blank" rel="noopener noreferrer" className="group/icon relative h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-700/20 border border-blue-500/30 flex flex-col items-center justify-center text-blue-400 hover:from-blue-500/40 hover:to-blue-700/40 hover:border-blue-400/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:scale-105 transition-all duration-300">
                      <FacebookIcon className="size-5" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-blue-300/80 mt-1">FB</span>
                    </a>
                    {/* Email */}
                    <a href="mailto:kiran@vrewkriya.com" className="group/icon relative h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex flex-col items-center justify-center text-amber-400 hover:from-amber-500/40 hover:to-orange-600/40 hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:scale-105 transition-all duration-300">
                      <Mail className="size-5" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300/80 mt-1">Email</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
              <p>© {new Date().getFullYear()} Vrewkriya. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
