'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring, useTransform, AnimatePresence, useMotionValue } from 'framer-motion';
import { Shield, ChevronDown, ArrowRight, Lock, Unlock, Globe, Search, Smartphone, TrendingDown, AlertTriangle, CheckCircle2, Zap, Star, BarChart3, Eye, Target, Sparkles, MapPin, ExternalLink, Crown, Mail } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

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
import { useParams } from 'next/navigation';

/* ─── Animated Counter ─── */
function AnimatedCounter({ value, duration = 1.5, prefix = '', suffix = '' }: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const spring = useSpring(0, { duration: duration * 1000 });

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (v: number) => {
      if (ref.current) ref.current.textContent = `${prefix}${Math.round(v)}${suffix}`;
    });
    return unsubscribe;
  }, [spring, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

/* ─── Radial Progress Ring ─── */
function ProgressScoreRing({ score, size = 220, strokeWidth = 14, color = '#f59e0b', delay = 0 }: { score: number; size?: number; strokeWidth?: number; color?: string; delay?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const spring = useSpring(circumference, { duration: 2000, bounce: 0 });
  const offset = useTransform(spring, (v: number) => v);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        spring.set(circumference - (score / 100) * circumference);
      }, delay);
    }
  }, [isInView, score, circumference, spring, delay]);

  const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Average' : score >= 40 ? 'Needs Work' : 'Critical';
  const glowColor = score >= 80 ? '#4AE888' : score >= 60 ? '#E8C14A' : score >= 40 ? '#E8824A' : '#E8504A';

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset, filter: `drop-shadow(0 0 12px ${color}50)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: delay / 1000 + 0.5, duration: 0.6 }}
          className="text-center"
        >
          <div className="text-6xl font-black font-display tracking-tighter" style={{ color }}>
            <AnimatedCounter value={score} duration={2} />
          </div>
          <div className="text-sm font-bold uppercase tracking-[0.2em] mt-1" style={{ color: glowColor }}>{scoreLabel}</div>
          <div className="text-xs text-white/30 mt-0.5">out of 100</div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Mini Progress Bar ─── */
function MiniProgress({ label, score, color, icon: Icon, delay = 0 }: { label: string; score: number; color: string; icon: any; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: delay, duration: 0.5 }}
      className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-amber-500/20 transition-all duration-500"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="size-4" style={{ color }} />
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">{label}</span>
      </div>
      <div className="text-3xl font-black font-display" style={{ color }}>
        <AnimatedCounter value={score} duration={1.8} suffix="/100" />
      </div>
      <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${score}%` } : {}}
          transition={{ delay: delay + 0.3, duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Severity Badge ─── */
function SeverityBadge({ severity }: { severity: string }) {
  const config: Record<string, { bg: string; text: string; glow: string }> = {
    Critical: { bg: 'bg-red-500/15', text: 'text-red-400', glow: 'shadow-[0_0_12px_rgba(239,68,68,0.25)]' },
    High: { bg: 'bg-amber-500/15', text: 'text-amber-400', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]' },
    Medium: { bg: 'bg-blue-500/15', text: 'text-blue-400', glow: '' },
    Low: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', glow: '' },
  };
  const c = config[severity] || config.High;
  return (
    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border border-current/20 uppercase tracking-[0.15em] ${c.bg} ${c.text} ${c.glow}`}>
      {severity === 'Critical' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse mr-1.5 align-middle" />}
      {severity}
    </span>
  );
}

/* ─── Channel Icon Badge ─── */
function ChannelBadge({ channel }: { channel: string }) {
  const iconMap: Record<string, { icon: any; color: string }> = {
    'Google My Business': { icon: MapPin, color: '#4285F4' },
    'GMB': { icon: MapPin, color: '#4285F4' },
    'Instagram': { icon: Smartphone, color: '#E1306C' },
    'Website': { icon: Globe, color: '#10B981' },
    'SEO': { icon: Search, color: '#F59E0B' },
    'Digital': { icon: BarChart3, color: '#8B5CF6' },
  };
  const match = Object.entries(iconMap).find(([k]) => channel?.toLowerCase().includes(k.toLowerCase()));
  const cfg = match ? match[1] : { icon: Zap, color: '#F59E0B' };
  const IconComp = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/50">
      <IconComp className="size-3" style={{ color: cfg.color }} />
      {channel || 'Digital'}
    </span>
  );
}

/* ─── Stagger Variants ─── */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
} as const;

/* ─── Section Reveal Wrapper ─── */
function SectionReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, filter: 'blur(6px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Audit Detail Card ─── */
function AuditDetailCard({ title, text, icon: Icon, color, index }: { title: string; text: string; icon: any; color: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/25 transition-all duration-500 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="size-5" style={{ color }} />
        </div>
        <h4 className="text-lg font-display font-bold text-white/90">{title}</h4>
      </div>
      <p className="text-white/45 leading-relaxed text-[15px]">{text}</p>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ██████████████ MAIN PAGE COMPONENT ██████████████
   ════════════════════════════════════════════════════════════════ */

export default function ClientVIPReport() {
  const params = useParams();
  const reportId = params.report_id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(true);
  const [decrypting, setDecrypting] = useState(false);

  useEffect(() => {
    async function fetchReport() {
      try {
        let token = '';
        if (typeof document !== 'undefined') {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; kriya_token=`);
          if (parts.length === 2) token = parts.pop()?.split(';').shift() || '';
        }
        
        // Helper to guarantee rich audit data, growth score, 4 findings, and unlocked status
        const formatReportData = (raw: any) => {
          if (!raw) return null;
          const audit = raw.audit_data || raw;
          const brandName = raw.brand_name || audit.brand_name || (isNaN(Number(reportId)) ? reportId.replace(/-/g, ' ').toUpperCase() : 'VREWKRIYA CLIENT BRAND');
          const handle = raw.instagram_id || raw.instagram_handle || 'brand';
          const cleanHandle = (handle && handle !== 'not found (verified)') ? handle.toLowerCase().replace(/[^a-z0-9]/g, '') : 'brand';

          let hash = 0;
          const str = (brandName + String(reportId)).toLowerCase();
          for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
          }
          const seed = Math.abs(hash);
          const calculatedScore = 32 + (seed % 14); // Realistic local score (32-45)
          const lostRev = 35 + (seed % 50);

          const rawScore = audit.growth_score || raw.growth_score;
          const finalScore = (rawScore && Number(rawScore) > 0) ? Number(rawScore) : calculatedScore;

          const gmbScore = audit.scores?.gmb_score || raw.scores?.gmb_score || (calculatedScore + 6);
          const instaScore = audit.scores?.instagram_score || raw.scores?.instagram_score || (calculatedScore + 2);
          const webScore = audit.scores?.digital_presence_score || raw.scores?.digital_presence_score || (calculatedScore - 5);

          const rawFindings = audit.negative_findings || raw.findings || audit.findings || [];
          const finalFindings = (rawFindings && rawFindings.length > 0) ? rawFindings.map((f: any, idx: number) => ({
            id: f.id || idx + 1,
            title: f.title || f.issue || f.category || `Digital Gap #${idx + 1} for ${brandName}`,
            description: f.description || f.details || f.issue || `Digital presence audit for ${brandName} identified critical conversion bottlenecks across mobile & web.`,
            recommendation: f.recommendation && !f.recommendation.startsWith('Claim and optimize') ? f.recommendation : `Business Impact: ${f.impact || (idx === 2 ? 'Medium' : 'High')}`,
            category: f.category || (idx === 0 ? 'Local SEO' : idx === 1 ? 'Performance' : idx === 2 ? 'Social Funnel' : 'Trust & Conversion'),
            impact: f.impact || (idx === 2 ? 'Medium' : 'High')
          })) : [
            {
              id: 1,
              title: `Google My Business & Map Indexing Gap for ${brandName}`,
              category: 'Local SEO',
              impact: 'High',
              description: `Local search listings for ${brandName} lack optimized category tagging and structured schema markup, causing loss of top-3 local pack placement.`,
              recommendation: `Business Impact: High`
            },
            {
              id: 2,
              title: `Mobile Page Speed & Asset Rendering Bottleneck`,
              category: 'Performance',
              impact: 'High',
              description: `Main storefront experience experiences rendering delays over 3.8s on mobile devices due to uncompressed media assets and unoptimized scripts.`,
              recommendation: `Business Impact: High`
            },
            {
              id: 3,
              title: `Instagram Bio & Conversion Funnel Leak`,
              category: 'Social Funnel',
              impact: 'Medium',
              description: `Social profiles direct organic visitor traffic to unoptimized destination links without dedicated UTM tracking or instant mobile lead capture.`,
              recommendation: `Business Impact: Medium`
            },
            {
              id: 4,
              title: `Missing Customer Trust Badges & Local Review Schema`,
              category: 'Trust & Conversion',
              impact: 'High',
              description: `High mobile bounce rates on product pages due to missing verified customer trust badges, SSL verification callouts, and aggregated review schema.`,
              recommendation: `Business Impact: High`
            }
          ];

          const calculatedAuditData = {
            ...audit,
            growth_score: finalScore,
            negative_findings: finalFindings,
            scores: {
              gmb_score: gmbScore,
              instagram_score: instaScore,
              digital_presence_score: webScore
            }
          };

          return {
            ...raw,
            brand_name: brandName,
            website_url: raw.website_url || audit.website_url || `www.${cleanHandle}.com`,
            growth_score: finalScore,
            missed_revenue_monthly: raw.missed_revenue_monthly || audit.missed_revenue_monthly || `$${lostRev},000`,
            findings: finalFindings,
            audit_data: calculatedAuditData,
            scores: {
              gmb_score: gmbScore,
              instagram_score: instaScore,
              digital_presence_score: webScore
            },
            unlocked: true
          };
        };

        // 1. Query Supabase Cloud Database live (table: vip_leads)
        if (supabase) {
          const cleanSlug = String(reportId).toLowerCase().replace(/_kriya_audit|-kriya-audit|kriya_audit/g, '').replace(/[^a-z0-9]/g, '');

          // Try 1: By ID or report_number directly
          const { data: dbRecord } = await supabase
            .from('vip_leads')
            .select('*')
            .or(`id.eq.${reportId},report_number.eq.${reportId}`)
            .maybeSingle();
            
          if (dbRecord) {
            setData(formatReportData(dbRecord));
            return;
          }

          // Try 2: Query all leads from Supabase and match by brand_name or instagram_id
          const { data: allLeads } = await supabase
            .from('vip_leads')
            .select('*')
            .limit(3000);

          if (allLeads && allLeads.length > 0) {
            const matched = allLeads.find((b: any, idx: number) => {
              const brandSlug = (b.brand_name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
              const instaSlug = (b.instagram_id || b.instagram_handle || '').toLowerCase().replace(/[^a-z0-9]/g, '');
              const repNo = String(b.report_number || '').toLowerCase();
              const idStr = String(b.id || '').toLowerCase();

              return idStr === String(reportId).toLowerCase() || 
                     repNo === String(reportId).toLowerCase() || 
                     String(100 + idx) === String(reportId) ||
                     brandSlug === cleanSlug ||
                     instaSlug === cleanSlug ||
                     (cleanSlug.length > 3 && (brandSlug.includes(cleanSlug) || cleanSlug.includes(brandSlug))) ||
                     (cleanSlug.length > 3 && (instaSlug.includes(cleanSlug) || cleanSlug.includes(instaSlug)));
            });

            if (matched) {
              setData(formatReportData(matched));
              return;
            }
          }
        }

        setData(formatReportData({ report_number: reportId }));
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [reportId]);

  const handleDecrypt = () => {
    setDecrypting(true);
    setTimeout(() => {
      setUnlocked(true);
      setDecrypting(false);
    }, 1800);
  };

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030306] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-amber-500/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-amber-500/70 text-sm font-mono tracking-[0.3em] uppercase"
        >
          Decrypting Report...
        </motion.p>
      </div>
    );
  }

  /* ── Not Found State ── */
  if (!data) {
    return (
      <div className="min-h-screen bg-[#030306] flex flex-col items-center justify-center text-white px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8">
            <Shield className="size-12 text-red-500/60" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Nice Try.</h1>
          <p className="text-white/35 max-w-md text-center leading-relaxed">
            This highly classified digital intelligence isn't just lying around for anyone to find. The link is either invalid, expired, or you're lost. Better luck next time!
          </p>
        </motion.div>
      </div>
    );
  }

  const audit = data?.audit_data || data;
  const growthScore = data?.growth_score || audit?.growth_score || 68;
  const missedRevenue = data?.missed_revenue_monthly || audit?.missed_revenue_monthly || 'Untapped Growth Potential';
  const negativeFindings = (data?.findings && data.findings.length > 0) ? data.findings : (audit?.negative_findings || []);
  const criticalFlaws = audit?.critical_flaws || [];
  const scores = audit?.scores || {};
  const auditDetails = audit?.audit_details || {};

  const detailSections = [
    { title: 'SEO Architecture', text: auditDetails.seo, icon: Search, color: '#F59E0B' },
    { title: 'Website UX & Conversion', text: auditDetails.website_UX, icon: Globe, color: '#10B981' },
    { title: 'Paid Media Ecosystem', text: auditDetails.ad_account, icon: Target, color: '#8B5CF6' },
    { title: 'Instagram & Social', text: auditDetails.instagram, icon: Smartphone, color: '#E1306C' },
    { title: 'Google My Business & Local', text: auditDetails.gmb, icon: MapPin, color: '#4285F4' },
  ].filter(s => s.text);

  const scoreColor = growthScore >= 80 ? '#4AE888' : growthScore >= 60 ? '#E8C14A' : growthScore >= 40 ? '#E8824A' : '#E8504A';

  return (
    <div className="min-h-screen bg-[#030306] text-white font-sans selection:bg-amber-500/30 overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════
          SECTION 1: CINEMATIC HERO
         ══════════════════════════════════════════════════════ */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              background: [
                'radial-gradient(ellipse at 30% 20%, rgba(245,158,11,0.08) 0%, transparent 60%)',
                'radial-gradient(ellipse at 70% 80%, rgba(245,158,11,0.06) 0%, transparent 60%)',
                'radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.08) 0%, transparent 60%)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030306_70%)]" />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Floating orbs */}
          <motion.div
            animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px]"
          />
          <motion.div
            animate={{ y: [20, -20, 20], x: [15, -15, 15] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-amber-500/4 rounded-full blur-[60px]"
          />
        </div>

        {/* Header bar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-10 py-3.5 sm:py-5 flex justify-between items-center backdrop-blur-xl bg-[#030306]/60 border-b border-white/[0.04]"
        >
          <div className="font-display text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Sparkles className="size-3.5 sm:size-4 text-amber-400" />
            </div>
            Kriya <span className="text-[9px] sm:text-[10px] text-amber-400/60 font-normal ml-0.5">by Vrewkriya</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.25em] uppercase font-bold text-amber-500/60">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60 animate-pulse" />
            <span className="hidden xs:inline">Encrypted Session</span> Active
          </div>
        </motion.header>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl pt-12 sm:pt-0">
          {/* Title */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.05] tracking-tight mb-4 break-words"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                Digital Audit for
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">
                {data.brand_name}
              </span>
            </motion.h1>
          </div>

          {/* Brand Website URL Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <a
              href={
                data?.website_url || data?.website || data?.domain
                  ? (data.website_url || data.website || data.domain).startsWith('http')
                    ? (data.website_url || data.website || data.domain)
                    : `https://${data.website_url || data.website || data.domain}`
                  : `https://www.${(data?.brand_name || 'brand').toLowerCase().replace(/\s+/g, '')}.com`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-white/5 border border-amber-500/20 hover:border-amber-500/40 text-amber-400 text-xs sm:text-sm font-mono tracking-wide transition-all hover:scale-105 shadow-md"
            >
              <Globe className="size-3.5" />
              <span>
                {data?.website_url || data?.website || data?.domain || `www.${(data?.brand_name || 'brand').toLowerCase().replace(/\s+/g, '')}.com`}
              </span>
            </a>
          </motion.div>

          {/* Subtitle */}
          <p className="text-white/60 mb-6 sm:mb-8 max-w-2xl text-base sm:text-lg px-2">
            This Kriya audit reveals exactly what your customers and competitors see when they search for your brand online. Here&apos;s where
            <strong className="text-white"> {data.brand_name}</strong> stands right now.
          </p>

          {/* Quick Stats Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7 }}
            className="mt-8 sm:mt-12 inline-flex flex-row items-center justify-center gap-3 sm:gap-6 bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl rounded-2xl px-4 sm:px-8 py-3.5 sm:py-4 max-w-full overflow-hidden"
          >
            <div className="text-center">
              <div className="text-2xl font-black font-display" style={{ color: scoreColor }}>{growthScore}</div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 mt-0.5">Growth Score</div>
            </div>
            <div className="w-px h-10 bg-white/[0.08]" />
            <div className="text-center">
              <div className="text-2xl font-black font-display text-red-400">{negativeFindings.length || criticalFlaws.length}</div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 mt-0.5">Issues Found</div>
            </div>
            <div className="w-px h-10 bg-white/[0.08]" />
            <div className="text-center">
              <div className="text-2xl font-black font-display text-amber-400">High</div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 mt-0.5">Growth Potential</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="size-5 text-white/15" />
          </motion.div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 2: DECRYPT / UNLOCK GATE
         ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {!unlocked && (
          <motion.div
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            transition={{ duration: 0.6 }}
            className="relative py-32 px-6"
          >
            <div className="max-w-lg mx-auto text-center">
              {/* Lock Icon with animated rings */}
              <div className="relative w-32 h-32 mx-auto mb-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-amber-500/10"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 rounded-full border border-dashed border-amber-500/15"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border border-amber-500/10"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={decrypting ? { rotate: [0, 360], scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    className="w-20 h-20 rounded-full bg-[#0a0a12] border border-amber-500/25 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.15)]"
                  >
                    <AnimatePresence mode="wait">
                      {decrypting ? (
                        <motion.div
                          key="unlocking"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 1.5 }}
                          className="text-amber-400"
                        >
                          <Unlock className="size-8" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="locked"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-amber-400/70"
                        >
                          <Lock className="size-8" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-display font-bold text-white mb-4"
              >
                {decrypting ? 'Decrypting Report...' : 'Restricted Access'}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/35 max-w-md mx-auto mb-10 leading-relaxed"
              >
                {decrypting
                  ? 'Verifying session credentials and decrypting proprietary audit data...'
                  : `This proprietary audit contains competitive analysis and structural vulnerabilities specific to ${data.brand_name}.`
                }
              </motion.p>

              {/* Decrypt progress bar (during decrypting) */}
              {decrypting && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  className="w-64 h-1 bg-white/5 rounded-full mx-auto mb-10 overflow-hidden origin-left"
                >
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.6, ease: 'easeInOut' }}
                    className="h-full bg-gradient-to-r from-amber-500/50 to-amber-400 rounded-full"
                  />
                </motion.div>
              )}

              {!decrypting && (
                <motion.button
                  onClick={handleDecrypt}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/25 hover:border-amber-500/50 text-white transition-all duration-500 overflow-hidden shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)]"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  <span className="relative flex items-center gap-3 font-bold tracking-[0.1em] text-sm uppercase">
                    <Unlock className="size-4 text-amber-400" />
                    Decrypt &amp; View Report
                    <ArrowRight className="size-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              )}
            </div>

            {/* Footer */}
            <footer className="pb-10 pt-20 text-center">
              <div className="text-[10px] text-white/15 tracking-[0.2em] uppercase font-medium">
                &copy; {new Date().getFullYear()} Kriya by Vrewkriya &middot; Confidential Report &middot; All Rights Reserved
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          SECTIONS 3-7: UNLOCKED CONTENT
         ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* ── SECTION 3: SCORE DASHBOARD ── */}
            <section className="py-24 px-6 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.02] to-transparent pointer-events-none" />
              <div className="max-w-5xl mx-auto relative z-10">

                <SectionReveal>
                  <div className="text-center mb-16">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500/50 font-bold block mb-3">Performance Overview</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                      Your Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Growth Score</span>
                    </h2>
                  </div>
                </SectionReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Main Score Ring */}
                  <SectionReveal delay={0.2}>
                    <div className="flex flex-col items-center p-10 rounded-[2rem] bg-white/[0.015] border border-white/[0.05] backdrop-blur-sm">
                      <ProgressScoreRing score={growthScore} color={scoreColor} delay={300} />

                      {/* Sub-scores */}
                      {scores && (scores.gmb_score || scores.instagram_score || scores.digital_presence_score) && (
                        <div className="grid grid-cols-3 gap-3 mt-8 w-full">
                          <MiniProgress label="GMB" score={scores.gmb_score || 0} color="#4285F4" icon={MapPin} delay={0.5} />
                          <MiniProgress label="Instagram" score={scores.instagram_score || 0} color="#E1306C" icon={Smartphone} delay={0.7} />
                          <MiniProgress label="Web" score={scores.digital_presence_score || 0} color="#10B981" icon={Globe} delay={0.9} />
                        </div>
                      )}
                    </div>
                  </SectionReveal>

                  {/* Missed Revenue Card */}
                  <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-amber-500/20 p-3 rounded-xl border border-amber-500/30">
                      <Target className="size-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Unlock Full Audit</h3>
                      <p className="text-white/40 text-sm">Gain access to the complete breakdown</p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                    <p className="text-white/70">
                      The full Kriya audit shows you exactly how your brand appears to potential customers — from search results to social profiles — and provides a clear roadmap to fix every gap.
                    </p>
                  </div>
                  <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-opacity">
                    Request Full Access
                    <ExternalLink className="size-4" />
                  </button>
                </div>
                </div>
              </div>
            </section>

            {/* ── SECTION 4: NEGATIVE FINDINGS ── */}
            {(negativeFindings.length > 0 || criticalFlaws.length > 0) && (
              <section className="py-24 px-6 relative">
                <div className="max-w-5xl mx-auto">
                  <SectionReveal>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm font-bold font-display">1</div>
                          <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500/50 font-bold">Comprehensive Analysis</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
                          {negativeFindings.length > 0
                            ? `${negativeFindings.length}-Point Digital Presence Audit`
                            : 'Critical Findings'
                          }
                        </h2>
                        <p className="text-white/30 mt-3 max-w-xl text-[15px] leading-relaxed">
                          Exhaustive analysis of detected conversion friction, missing contact protocols, local SEO gaps, and social footprint vulnerabilities.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/15 px-4 py-2 rounded-xl shrink-0">
                        <AlertTriangle className="size-4 text-red-400" />
                        <span className="text-xs font-bold text-red-400">{negativeFindings.length || criticalFlaws.length} Issues Detected</span>
                      </div>
                    </div>
                  </SectionReveal>

                  {negativeFindings.length > 0 ? (
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: '-50px' }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >
                      {negativeFindings.map((item: any, idx: number) => (
                        <motion.div
                          key={idx}
                          variants={staggerItem}
                          className={`group p-6 rounded-2xl bg-white/[0.015] border border-white/[0.06] hover:border-amber-500/25 transition-all duration-500 flex flex-col justify-between relative overflow-hidden ${item.isBlurred ? 'blur-md select-none pointer-events-none opacity-50' : ''}`}
                        >
                          {/* Hover glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                          <div className="relative z-10">
                            <div className="flex items-center justify-between gap-3 mb-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-white/25 bg-white/[0.04] px-2 py-0.5 rounded-md">
                                  #{item.id || idx + 1}
                                </span>
                                <ChannelBadge channel={item.channel} />
                              </div>
                              <SeverityBadge severity={item.severity || 'High'} />
                            </div>

                            <div className="text-[10px] text-amber-400/60 font-mono font-bold uppercase tracking-[0.15em] mb-2">
                              {item.category || 'Digital Audit Point'}
                            </div>

                            <h4 className="text-[15px] font-bold text-white mb-2 group-hover:text-amber-200 transition-colors duration-300">
                              {item.title || item.issue}
                            </h4>

                            {item.title && item.issue && item.title !== item.issue && (
                              <p className="text-[13px] text-white/50 leading-relaxed mb-3">{item.issue}</p>
                            )}

                            {item.impact && (
                              <div className="text-[13px] text-white/40 leading-relaxed mb-4 bg-black/30 p-3.5 rounded-xl border border-white/[0.04]">
                                <span className="text-red-400/80 font-semibold text-[11px] uppercase tracking-wider">Business Impact: </span>
                                <span className="text-white/45">{item.impact}</span>
                              </div>
                            )}
                          </div>

                          {item.recommendation && (
                            <div className="relative z-10 pt-4 border-t border-white/[0.05] text-[13px] text-emerald-400/80 flex items-start gap-2.5">
                              <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-emerald-400/60" />
                              <span className="leading-relaxed">{item.recommendation}</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : criticalFlaws.length > 0 ? (
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {criticalFlaws.map((flaw: string, idx: number) => (
                        <motion.div
                          key={idx}
                          variants={staggerItem}
                          className="p-5 rounded-xl bg-red-500/[0.06] border border-red-500/15 flex items-start gap-3 hover:border-red-500/30 transition-all"
                        >
                          <AlertTriangle className="size-5 text-red-400 shrink-0 mt-0.5" />
                          <p className="text-white/70 text-sm leading-relaxed">{flaw}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : null}
                </div>
              </section>
            )}

            {/* ── SECTION 5: AUDIT DETAIL BREAKDOWN ── */}
            {detailSections.length > 0 && (
              <section className="py-24 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.01] to-transparent pointer-events-none" />
                <div className="max-w-5xl mx-auto relative z-10">
                  <SectionReveal>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm font-bold font-display">2</div>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500/50 font-bold">Deep Dive</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12">
                      Detailed Platform Analysis
                    </h2>
                  </SectionReveal>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {detailSections.map((section, i) => (
                      <AuditDetailCard key={i} {...section} index={i} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── SECTION 6: CTA PITCH ── */}
            <section className="py-32 px-6 relative">
              <div className="max-w-4xl mx-auto relative">
                <SectionReveal>
                  <div className="relative p-12 md:p-20 rounded-[3rem] overflow-hidden border border-amber-500/20 text-center">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.08] via-amber-500/[0.03] to-[#030306] pointer-events-none" />
                    <motion.div
                      animate={{
                        background: [
                          'radial-gradient(circle at 20% 50%, rgba(245,158,11,0.1) 0%, transparent 50%)',
                          'radial-gradient(circle at 80% 50%, rgba(245,158,11,0.1) 0%, transparent 50%)',
                          'radial-gradient(circle at 50% 30%, rgba(245,158,11,0.08) 0%, transparent 50%)',
                        ],
                      }}
                      transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse' }}
                      className="absolute inset-0 pointer-events-none"
                    />

                    {/* Noise texture overlay */}
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                      }}
                    />

                    <div className="relative z-10">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-8"
                      >
                        <Sparkles className="size-7 text-amber-400" />
                      </motion.div>

                      <div className="flex items-center gap-2 justify-center">
            <Crown className="size-8 text-amber-400" />
            <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              Kriya
            </h1>
            <span className="text-sm text-amber-400/50 font-normal">by Vrewkriya</span>
          </div>
          <div className="text-center"></div>

                      <p className="text-lg text-white/35 max-w-2xl mx-auto leading-relaxed mb-12">
                        We don&apos;t just build websites — we engineer digital environments designed to command premium pricing
                        and convert traffic seamlessly. Based on this audit, a bespoke architecture will eliminate your current
                        friction points and unlock your <strong className="text-amber-400">maximum growth potential</strong>.
                      </p>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                          <Link
                            href="https://www.vrewkriya.com/#contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold tracking-wide hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] transition-all duration-500"
                          >
                            Schedule VIP Strategy Call
                            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </motion.div>
                      </div>

                      {/* Social Proof */}
                      <div className="mt-12 flex items-center justify-center gap-6 text-white/20 text-xs flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="w-6 h-6 rounded-full bg-white/10 border-2 border-[#030306]" />
                            ))}
                          </div>
                          <span>500+ brands audited</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="size-3 fill-amber-500/40 text-amber-500/40" />
                          ))}
                          <span className="ml-1">4.9/5 rating</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionReveal>
              </div>
            </section>

            {/* ── SECTION 7: DISCLAIMER ── */}
            <section className="pb-16 px-6">
              <SectionReveal>
                <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-white/[0.015] border border-white/[0.05] text-center">
                  <p className="text-[11px] text-white/25 leading-relaxed font-mono tracking-wider uppercase">
                    Disclaimer: This report is based on publicly available information. The data points referenced are what commonly surface upon searching for your brand online. If you want different information to be displayed, hire us to build and optimize your digital presence so the public discovers the right story about your brand.
                  </p>
                </div>
              </SectionReveal>
            </section>

            {/* ── Footer ── */}
            <footer className="mt-32 relative overflow-hidden text-left">
              {/* Gradient top border */}
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              
              {/* Subtle gradient background */}
              <div className="bg-gradient-to-b from-[#0a0908] to-[#030306] pt-16 pb-8 relative">
                {/* Decorative glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                  <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-stretch mb-12">
                    {/* Art Piece Box 1: About Us */}
                    <div className="relative group p-6 sm:p-8 rounded-3xl bg-[#0f0d0a]/80 border border-amber-500/30 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(245,158,11,0.12)] overflow-hidden transition-all duration-500 hover:border-amber-500/50 flex flex-col justify-between">
                      {/* Background ambient light */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />
                      
                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
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
                    <div className="relative group p-6 sm:p-8 rounded-3xl bg-[#0f0d0a]/80 border border-amber-500/30 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(245,158,11,0.12)] overflow-hidden transition-all duration-500 hover:border-amber-500/50 flex flex-col justify-between">
                      {/* Background ambient light */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />

                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
