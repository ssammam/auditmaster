'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Search, Shield, ArrowRight, Lock, Crown } from 'lucide-react';

export default function Home() {
  const [reportId, setReportId] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportId.trim()) return;
    router.push(`/vip/${reportId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-[#030306] text-white font-sans selection:bg-amber-500/30 flex flex-col justify-between overflow-x-hidden">
      
      {/* Top Bar */}
      <header className="px-6 md:px-12 py-6 flex justify-between items-center border-b border-white/[0.05]">
        <div className="font-display text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Sparkles className="size-4 text-amber-400" />
          </div>
          Vrewkriya Audit Portal
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:border-amber-500/30 text-xs font-semibold uppercase tracking-wider text-amber-400 hover:bg-amber-500/10 transition-all"
        >
          <Lock className="size-3.5" /> Admin Login
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-8">
            <Shield className="size-4 text-amber-400" />
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">Digital Intelligence Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight tracking-tight mb-6">
            Lookup Your Brand&apos;s <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">Digital Audit Report</span>
          </h1>

          <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Enter your unique Report ID below to view your personalized brand standing and digital architecture audit.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/30" />
              <input
                type="text"
                placeholder="Enter Report ID (e.g. 101)"
                value={reportId}
                onChange={(e) => setReportId(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all"
            >
              View Report
              <ArrowRight className="size-4" />
            </button>
          </form>

          {/* VIP Pipeline Link */}
          <div className="mt-12">
            <Link
              href="/vip-dashboard"
              className="inline-flex items-center gap-2 text-xs font-mono text-white/40 hover:text-amber-400 transition-colors"
            >
              <Crown className="size-3.5 text-amber-400" /> Go to VIP Pipeline Dashboard &rarr;
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/[0.05] text-center text-xs text-white/30">
        &copy; {new Date().getFullYear()} Vrewkriya. All rights reserved.
      </footer>
    </div>
  );
}
