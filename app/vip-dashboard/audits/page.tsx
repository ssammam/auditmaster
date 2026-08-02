'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, Lock, FileText, ChevronRight, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type VIPBrand = {
  id: string;
  instagram_id: string;
  brand_name: string;
  report_number: string;
  status: string;
  audit_data: any;
  premium_message: string;
};

export default function VIPAudits() {
  const [brands, setBrands] = useState<VIPBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unlockedReportId, setUnlockedReportId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'enriched' | 'insta'>('all');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch('http://localhost:5055/api/vip');
      const data = await res.json();
      if (data.success) {
        setBrands(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch VIP audits", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
          <ClipboardList className="text-amber-400 size-10" />
          VIP Audits
        </h1>
        <p className="text-white/40 mt-3 text-sm tracking-widest uppercase">
          Exclusive Brand Analysis & Strategy Reports
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white/[0.02] border border-white/[0.05] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : brands.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-16 text-center flex flex-col items-center justify-center">
          <FileText className="size-12 text-amber-500/30 mb-4" />
          <h3 className="text-xl font-semibold text-white/80">No Audit Reports Yet</h3>
          <p className="text-white/40 mt-2 max-w-md">
            Reports will automatically generate for brands that pass through the VIP pipeline.
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setFilterMode('all')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${filterMode === 'all' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              All Leads ({brands.length})
            </button>
            <button 
              onClick={() => setFilterMode('enriched')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${filterMode === 'enriched' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              Enriched Reports ({brands.filter(b => b.status === 'enriched').length})
            </button>
            <button 
              onClick={() => setFilterMode('insta')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${filterMode === 'insta' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              Insta DM Ready ({brands.filter(b => b.status === 'enriched' && b.instagram_id && b.instagram_id !== 'Not Found' && b.instagram_id !== 'Pending AI').length})
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {brands
              .filter(brand => {
                if (filterMode === 'all') return true;
                if (filterMode === 'enriched') return brand.status === 'enriched';
                if (filterMode === 'insta') return brand.status === 'enriched' && brand.instagram_id && brand.instagram_id !== 'Not Found' && brand.instagram_id !== 'Pending AI';
                return true;
              })
              .map((brand) => {
              const isUnlocked = unlockedReportId === brand.id;
            
            return (
              <div 
                key={brand.id}
                className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${
                  isUnlocked 
                    ? 'bg-[#0a0a0f] border border-amber-500/30 shadow-[0_0_60px_-15px_rgba(251,191,36,0.15)]' 
                    : 'bg-white/[0.02] border border-white/[0.05] hover:border-white/10'
                }`}
              >
                {/* Status Bar */}
                <div className="px-8 py-5 border-b border-white/[0.05] flex justify-between items-center bg-black/20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-black border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                      {brand.brand_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{brand.brand_name}</h3>
                      <p className="text-xs text-white/40">@{brand.instagram_id}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] tracking-widest text-amber-500/60 uppercase">Report ID</span>
                    <code className="text-xs text-white/60 font-mono">{brand.report_number}</code>
                  </div>
                </div>

                {/* Report Content Area */}
                <div className="relative p-8 min-h-[320px]">
                  
                  {/* The actual "Report" content (visible only when unlocked) */}
                  <div className={`space-y-6 transition-all duration-700 ${isUnlocked ? 'opacity-100 blur-none' : 'opacity-40 blur-[8px] select-none pointer-events-none'}`}>
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-2xl font-display font-semibold text-amber-400 flex items-center gap-2">
                        <Sparkles className="size-5" /> Executive Summary
                      </h4>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> Audit Complete
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Growth Score</p>
                        <p className="text-3xl font-display text-white">{brand.audit_data?.growth_score || '92'}<span className="text-sm text-white/30">/100</span></p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Missed Revenue</p>
                        <p className="text-3xl font-display text-amber-400">{brand.audit_data?.missed_revenue_monthly || '$45k'}<span className="text-sm text-amber-400/50">/mo</span></p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/[0.05]">
                      <h5 className="text-sm font-semibold text-white/80">Key Vulnerabilities Found</h5>
                      
                      {brand.audit_data?.audit_details?.seo && (
                        <div className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                          <p className="text-sm text-white/60 leading-relaxed"><strong className="text-white/80">SEO:</strong> {brand.audit_data.audit_details.seo}</p>
                        </div>
                      )}
                      
                      {brand.audit_data?.audit_details?.website_UX && (
                        <div className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                          <p className="text-sm text-white/60 leading-relaxed"><strong className="text-white/80">UX:</strong> {brand.audit_data.audit_details.website_UX}</p>
                        </div>
                      )}
                      
                      {brand.audit_data?.audit_details?.instagram && (
                        <div className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                          <p className="text-sm text-white/60 leading-relaxed"><strong className="text-white/80">Instagram:</strong> {brand.audit_data.audit_details.instagram}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 pt-4 border-t border-white/[0.05]">
                      <h5 className="text-sm font-semibold text-white/80">Generated VIP Pitch</h5>
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-100/70 italic">
                        "{brand.premium_message || 'Hey team, stunning aesthetic. We found a bottleneck in your funnel costing roughly $45k/mo. Mind if we send a bespoke proposal over? - Kriya by Vrewkriya'}"
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-white/[0.02]">
                        {(() => {
                          const base = brand.report_number || (brand.brand_name || 'brand').toUpperCase().replace(/[^A-Z0-9]/g, '');
                          let hash = 0;
                          for (let i = 0; i < base.toLowerCase().length; i++) {
                            hash = base.toLowerCase().charCodeAt(i) + ((hash << 5) - hash);
                            hash = hash & hash;
                          }
                          const suffix = Math.abs(hash).toString(36).substring(0, 5).padStart(5, 'a');
                          return (
                            <Link 
                              href={`/vip/${base}${suffix}`}
                              target="_blank"
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
                            >
                              <ExternalLink className="size-4" /> Open Client-Facing Report Link
                            </Link>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Lock Overlay for premium visual interaction */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-b-3xl">
                      <div className="w-16 h-16 rounded-full bg-black/60 border border-white/10 flex items-center justify-center mb-4 shadow-xl backdrop-blur-md">
                        <Lock className="size-6 text-white/60" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">Encrypted VIP Report</h4>
                      <p className="text-sm text-white/40 mb-6 text-center max-w-xs">
                        This exclusive audit contains sensitive market positioning data.
                      </p>
                      
                      <button 
                        onClick={() => setUnlockedReportId(brand.id)}
                        className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-white hover:text-amber-400 transition-all duration-300"
                      >
                        <span className="text-sm font-semibold tracking-wide">Decrypt Report</span>
                        <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {/* Close button when unlocked */}
                  {isUnlocked && (
                    <div className="absolute top-6 right-6">
                      <button 
                        onClick={() => setUnlockedReportId(null)}
                        className="text-white/40 hover:text-white text-xs tracking-widest uppercase flex items-center gap-1 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  )}
                  
                </div>
              </div>
            );
          })}
        </div>
        </>
      )}
    </div>
  );
}
