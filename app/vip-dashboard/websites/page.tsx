'use client';

import { useState } from 'react';
import { Globe, Monitor, Smartphone, Sparkles, Layers, Code2, Plus, ExternalLink } from 'lucide-react';

const PREMIUM_ARCHITECTURES = [
  {
    id: 'arch-01',
    name: 'Immersive WebGL Commerce',
    type: 'E-Commerce',
    tech: 'Next.js + Three.js + Shopify Plus',
    price_tier: 'Tier 1 ($25k+)',
    status: 'Ready to Deploy',
    thumbnail: 'bg-gradient-to-br from-purple-900 to-black',
  },
  {
    id: 'arch-02',
    name: 'Cinematic Brand Editorial',
    type: 'Portfolio / Brand',
    tech: 'Next.js + GSAP ScrollTrigger',
    price_tier: 'Tier 2 ($15k+)',
    status: 'Ready to Deploy',
    thumbnail: 'bg-gradient-to-bl from-amber-900 to-black',
  },
  {
    id: 'arch-03',
    name: 'High-Ticket Funnel Engine',
    type: 'Lead Generation',
    tech: 'React + Framer Motion + CRM Sync',
    price_tier: 'Tier 3 ($10k+)',
    status: 'Ready to Deploy',
    thumbnail: 'bg-gradient-to-tr from-emerald-900 to-black',
  }
];

const ACTIVE_BUILDS = [
  { brand: 'Aura Fine Jewelry', architecture: 'Immersive WebGL Commerce', progress: 65, deadline: 'Oct 15' },
  { brand: 'Vogue Aesthetics', architecture: 'Cinematic Brand Editorial', progress: 30, deadline: 'Nov 02' }
];

export default function VIPWebsites() {
  const [activeTab, setActiveTab] = useState('architectures');

  return (
    <div className="font-sans animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            <Globe className="text-amber-400 size-10" />
            Premium Websites
          </h1>
          <p className="text-white/40 mt-3 text-sm tracking-widest uppercase">
            Bespoke Digital Environments & Active Builds
          </p>
        </div>
        
        <button className="flex items-center gap-2 bg-amber-500 text-black px-6 py-3 rounded-full font-bold hover:bg-amber-400 transition-colors">
          <Plus className="size-5" />
          Draft New Proposal
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.05] mb-8">
        <button 
          onClick={() => setActiveTab('architectures')}
          className={`px-6 py-4 text-sm font-semibold tracking-wide uppercase transition-colors relative ${activeTab === 'architectures' ? 'text-amber-400' : 'text-white/40 hover:text-white/80'}`}
        >
          Base Architectures
          {activeTab === 'architectures' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />}
        </button>
        <button 
          onClick={() => setActiveTab('builds')}
          className={`px-6 py-4 text-sm font-semibold tracking-wide uppercase transition-colors relative ${activeTab === 'builds' ? 'text-amber-400' : 'text-white/40 hover:text-white/80'}`}
        >
          Active VIP Builds
          {activeTab === 'builds' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />}
        </button>
      </div>

      {activeTab === 'architectures' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PREMIUM_ARCHITECTURES.map((arch) => (
            <div key={arch.id} className="group bg-white/[0.02] border border-white/[0.05] hover:border-amber-500/30 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.15)] flex flex-col">
              
              {/* Visual Thumbnail */}
              <div className={`h-48 ${arch.thumbnail} relative overflow-hidden p-6 flex flex-col justify-between border-b border-white/5`}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIvPjwvc3ZnPg==')] opacity-[0.15] mix-blend-overlay" />
                
                <div className="flex justify-between items-start relative z-10">
                  <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] uppercase tracking-widest text-white/80 border border-white/10">
                    {arch.type}
                  </span>
                  <div className="flex gap-2 text-white/50">
                    <Monitor className="size-4" />
                    <Smartphone className="size-4" />
                  </div>
                </div>
                
                <h3 className="relative z-10 text-2xl font-display font-bold text-white leading-tight">
                  {arch.name}
                </h3>
              </div>

              {/* Details */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-start gap-3">
                    <Layers className="size-4 text-amber-500/70 mt-1 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-0.5">Stack</p>
                      <p className="text-sm text-white/80">{arch.tech}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Code2 className="size-4 text-amber-500/70 mt-1 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-0.5">Pricing Model</p>
                      <p className="text-sm font-semibold text-amber-400">{arch.price_tier}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                  <button className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-semibold transition-colors">
                    Preview Demo
                  </button>
                  <button className="flex-1 py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    <Sparkles className="size-4" /> Pitch
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {activeTab === 'builds' && (
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-black/20">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Monitor className="size-5 text-amber-400" />
              Production Pipeline
            </h3>
          </div>
          <div className="p-0">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-black/40 text-white/40 uppercase tracking-wider text-[10px] border-b border-white/[0.05]">
                <tr>
                  <th className="px-8 py-4 font-medium">VIP Client</th>
                  <th className="px-8 py-4 font-medium">Architecture Framework</th>
                  <th className="px-8 py-4 font-medium w-1/3">Build Progress</th>
                  <th className="px-8 py-4 font-medium">Target Launch</th>
                  <th className="px-8 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {ACTIVE_BUILDS.map((build, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6 font-semibold text-white">{build.brand}</td>
                    <td className="px-8 py-6 text-white/60">{build.architecture}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${build.progress}%` }} />
                        </div>
                        <span className="text-xs text-amber-400 font-mono">{build.progress}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-white/60">{build.deadline}</td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-amber-500 hover:text-amber-400 p-2 rounded-lg hover:bg-amber-500/10 transition-colors">
                        <ExternalLink className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
