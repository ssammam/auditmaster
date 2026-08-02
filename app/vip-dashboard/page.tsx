'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Upload, Search, Mail, Phone, Crown, Send, Loader2, ExternalLink, AtSign, Filter, Play, Square, RotateCcw, Activity } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

type VIPCandidate = {
  id: string;
  instagram_id: string;
  brand_name: string;
  email: string;
  phone: string;
  report_number: string;
  status: string;
  audit_data?: {
    engine_source?: 'GEMINI_AI' | 'BACKUP_ENGINE';
  };
};

export default function VIPPipeline() {
  const [candidates, setCandidates] = useState<VIPCandidate[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'enriched' | 'enriched-az' | 'failed' | 'insta' | 'email' | 'phone'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 50;

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };
  
  // Queue Control State
  const [isQueueRunning, setIsQueueRunning] = useState(false);
  const [isQueueActionLoading, setIsQueueActionLoading] = useState(false);

  // Open Mode State
  const [showOpenMode, setShowOpenMode] = useState(true);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);

  let filteredCandidates = candidates.filter(vip => {
    const hasValue = (val: string | null) => val && val !== 'Not Found' && val !== 'Pending AI' && val !== '-';
    if (filter === 'enriched') return vip.status === 'enriched';
    if (filter === 'enriched-az') return vip.status === 'enriched';
    if (filter === 'failed') return vip.status === 'failed';
    if (filter === 'insta') return hasValue(vip.instagram_id);
    if (filter === 'email') return hasValue(vip.email);
    if (filter === 'phone') return hasValue(vip.phone);
    return true;
  });

  if (filter === 'enriched-az') {
    filteredCandidates = [...filteredCandidates].sort((a, b) => 
      (a.brand_name || '').localeCompare(b.brand_name || '')
    );
  }

  const totalPages = Math.ceil(filteredCandidates.length / PAGE_SIZE);
  const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setLiveLogs([`[${new Date().toLocaleTimeString()}] 🚀 OPEN MODE INITIALIZED - Live audit activity streaming active.`]);
    fetchVIPs().catch(() => {});
    fetchQueueStatus().catch(() => {});
    fetchOpenMode().catch(() => {});

    // Poll for updates every 15 seconds
    const interval = setInterval(() => {
      fetchVIPs().catch(() => {});
      fetchQueueStatus().catch(() => {});
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Update live logs when candidates or queue state changes
  useEffect(() => {
    if (!candidates.length) return;
    const processingItem = candidates.find(c => c.status === 'processing');
    const recentEnriched = candidates.find(c => c.status === 'enriched');
    const time = new Date().toLocaleTimeString();

    if (processingItem) {
      const msg = `[${time}] 🔍 OPEN MODE: Auditing brand "@${processingItem.instagram_id || processingItem.brand_name}" -> Extracting 20 negative points (GMB + Insta + Web)...`;
      setLiveLogs(prev => prev[0] === msg ? prev : [msg, ...prev.slice(0, 15)]);
    } else if (isQueueRunning) {
      const msg = `[${time}] ⚡ OPEN MODE: Queue active. Enriched total: ${candidates.filter(c => c.status === 'enriched').length} / ${candidates.length} leads.`;
      setLiveLogs(prev => prev[0] === msg ? prev : [msg, ...prev.slice(0, 15)]);
    }
  }, [candidates, isQueueRunning]);

  const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      return `http://${host}:5055`;
    }
    return 'http://localhost:5055';
  };

  const fetchOpenMode = async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/vip/open-mode`);
      const data = await res.json();
      if (data.success) {
        setShowOpenMode(data.openMode);
      }
    } catch (error) {
      // Quietly log error without breaking UI
    }
  };

  const fetchQueueStatus = async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/vip/queue-status`);
      const data = await res.json();
      if (data.success) {
        setIsQueueRunning(data.isRunning);
      }
    } catch (error) {
      // Quietly log error without breaking UI
    }
  };

  const handleStartQueue = async () => {
    setIsQueueActionLoading(true);
    try {
      await fetch(`${getApiBaseUrl()}/api/vip/start-queue`, { method: 'POST' });
      setIsQueueRunning(true);
      setLiveLogs(prev => [`[${new Date().toLocaleTimeString()}] ▶️ START COMMAND: Report Generation Queue started.`, ...prev]);
      fetchVIPs();
    } catch (error) {
      console.error("Failed to start queue", error);
    } finally {
      setIsQueueActionLoading(false);
    }
  };

  const handleStopQueue = async () => {
    setIsQueueActionLoading(true);
    try {
      await fetch(`${getApiBaseUrl()}/api/vip/stop-queue`, { method: 'POST' });
      setIsQueueRunning(false);
      setLiveLogs(prev => [`[${new Date().toLocaleTimeString()}] ⏹️ STOP COMMAND: Queue generation paused by user.`, ...prev]);
      fetchVIPs();
    } catch (error) {
      console.error("Failed to stop queue", error);
    } finally {
      setIsQueueActionLoading(false);
    }
  };

  const handleToggleOpenMode = async () => {
    const nextState = !showOpenMode;
    setShowOpenMode(nextState);
    try {
      await fetch(`${getApiBaseUrl()}/api/vip/open-mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openMode: nextState })
      });
      setLiveLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ${nextState ? '🌐 OPEN MODE ON: Visual browser active for 1 worker.' : '🕶️ OPEN MODE OFF: All browsers running silently in background.'}`,
        ...prev
      ]);
    } catch (error) {
      console.error("Failed to update open mode", error);
    }
  };

  const handleResetAll = async () => {
    if (!confirm("Are you sure you want to reset all reports back to Pending? This will require starting the generation worker again.")) return;
    setIsQueueActionLoading(true);
    try {
      await fetch(`${getApiBaseUrl()}/api/vip/reprocess-all`, { method: 'POST' });
      setIsQueueRunning(false);
      setLiveLogs(prev => [`[${new Date().toLocaleTimeString()}] 🔄 RESET COMMAND: All leads reset to Pending.`, ...prev]);
      fetchVIPs();
    } catch (error) {
      console.error("Failed to reset queue", error);
    } finally {
      setIsQueueActionLoading(false);
    }
  };

  const handleRetryFailed = async () => {
    if (!confirm("Are you sure you want to retry all failed reports? This will move them back to Pending.")) return;
    setIsQueueActionLoading(true);
    try {
      await fetch(`${getApiBaseUrl()}/api/vip/retry-failed`, { method: 'POST' });
      setIsQueueRunning(false);
      setLiveLogs(prev => [`[${new Date().toLocaleTimeString()}] 🔄 RETRY COMMAND: Failed leads reset to Pending.`, ...prev]);
      fetchVIPs();
    } catch (error) {
      console.error("Failed to retry failed queue", error);
    } finally {
      setIsQueueActionLoading(false);
    }
  };

  const fetchVIPs = async () => {
    try {
      // 1. Query Supabase Cloud DB first (table: vip_leads)
      if (supabase) {
        const { data: dbData } = await supabase.from('vip_leads').select('*');
        if (dbData && dbData.length > 0) {
          console.log(`[VIP Dashboard] Loaded ${dbData.length} candidates from Supabase DB.`);
          setCandidates(dbData);
          setIsLoading(false);
          return;
        }
      }

      // 2. Try Local Backend API
      const url = `${getApiBaseUrl()}/api/vip`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setCandidates(data.data);
        setIsLoading(false);
        return;
      }
      throw new Error('Backend offline');
    } catch (error) {
      console.warn('[VIP Dashboard] API unreachable. Loading local master dataset fallback.');
      try {
        const localMaster = require('../../FRESH_MASTER_DATABASE.json');
        if (Array.isArray(localMaster)) {
          console.log(`[VIP Dashboard] Successfully loaded exact ${localMaster.length} profiles from master dataset.`);
          setCandidates(localMaster);
        }
      } catch (e) {
        console.error('Failed to load local dataset fallback:', e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isLocalHost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const handleUpload = async () => {
    if (!isLocalHost) {
      alert("🔒 Action Locked: Profile enrichment & background scrapers can only be run from your local workspace system.");
      return;
    }
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    const ids = inputText.split(/[\n,]/).map(id => id.trim()).filter(id => id);
    
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/vip/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidates: ids.map(id => ({ instagram_id: id })) })
      });
      
      const data = await res.json();
      if (data.success) {
        setInputText('');
        fetchVIPs(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to upload VIPs", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMail = async (vip: any) => {
    if (!isLocalHost) {
      alert("🔒 Action Locked: Email outreach can ONLY be sent from your Local Workspace system (localhost).");
      return;
    }
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/vip/send-outreach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_ids: [vip.id] })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to send outreach');
    }
  };

  const handleBulkOutreach = async () => {
    const enrichedIds = filteredCandidates.filter(c => c.status === 'enriched').map(c => c.id);
    if (!enrichedIds.length) return alert('No enriched leads to contact.');
    if (!confirm(`Queue ${enrichedIds.length} leads for DMs & Emails in the background?`)) return;

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/vip/send-outreach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_ids: enrichedIds })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to bulk send outreach');
    }
  };

  const pendingCount = candidates.filter(c => c.status === 'pending').length;
  const processingCount = candidates.filter(c => c.status === 'processing').length;
  const enrichedCount = candidates.filter(c => c.status === 'enriched').length;
  const failedCount = candidates.filter(c => c.status === 'failed').length;

  return (
    <div className="font-sans animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            VIP Pipeline
          </h1>
          <p className="text-white/40 mt-3 text-sm tracking-widest uppercase">
            Premium Enrichment & Outreach Hub
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] p-2.5 rounded-2xl backdrop-blur-xl">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-mono">
            Pending: <strong className="text-white">{pendingCount}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-mono">
            Processing: <strong className="text-white">{processingCount}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-mono">
            Enriched: <strong className="text-white">{enrichedCount}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono">
            Failed: <strong className="text-white">{failedCount}</strong>
          </div>
        </div>
      </div>

      {/* Queue Controller Bar */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-black to-white/[0.02] border border-amber-500/20 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_50px_-15px_rgba(251,191,36,0.1)]">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${isQueueRunning ? 'bg-emerald-400 animate-ping' : 'bg-white/20'}`} />
          <div>
            <div className="flex items-center gap-2 font-semibold text-white">
              <Activity className="size-4 text-amber-400" />
              Report Generation Engine: 
              <span className={isQueueRunning ? 'text-emerald-400 font-bold' : 'text-white/40'}>
                {isQueueRunning ? 'RUNNING (Generating AI Audits)' : 'STOPPED'}
              </span>
            </div>
            <p className="text-xs text-white/50 mt-1">
              {isQueueRunning 
                ? 'Processing VIP candidates sequentially with Gemini AI engine.' 
                : pendingCount > 0 
                  ? 'Worker is paused. Click "Start Generating Reports" to resume processing.' 
                  : 'Worker idle. All pending VIP candidates have been processed.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {isQueueRunning ? (
            <button
              onClick={handleStopQueue}
              disabled={isQueueActionLoading}
              className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Square className="size-4 fill-red-400" />
              Stop Generation
            </button>
          ) : (
            <button
              onClick={handleStartQueue}
              disabled={isQueueActionLoading || pendingCount === 0}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 text-black font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(251,191,36,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isQueueActionLoading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4 fill-black" />}
              Start Generating Reports
            </button>
          )}

          <button
            onClick={() => setShowOpenMode(!showOpenMode)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              showOpenMode 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            <Activity className="size-4 text-emerald-400 animate-pulse" />
            {showOpenMode ? 'Open Mode: ON' : 'Open Mode: OFF'}
          </button>

          <button
            onClick={handleRetryFailed}
            disabled={isQueueActionLoading || failedCount === 0}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/80 hover:text-red-400 font-medium text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RotateCcw className="size-3.5" />
            Retry Failed
          </button>

          <button
            onClick={handleResetAll}
            disabled={isQueueActionLoading}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-medium text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RotateCcw className="size-3.5" />
            Reset All to Pending
          </button>

          <button
            onClick={handleBulkOutreach}
            disabled={isQueueActionLoading || enrichedCount === 0}
            className="px-4 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Send className="size-4" />
            Bulk Send Outreach (DMs/Emails)
          </button>
        </div>
      </div>

      {/* Open Mode Live Activity Console Terminal */}
      {showOpenMode && (
        <div className="mb-8 rounded-2xl bg-black/90 border border-emerald-500/30 overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)] font-mono text-xs animate-in fade-in duration-300">
          <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold tracking-wider uppercase text-[11px]">
                LIVE OPEN MODE MONITOR — Audit Activity Console
              </span>
            </div>
            <span className="text-emerald-500/60 text-[10px]">Auto-streaming live</span>
          </div>

          <div className="p-4 max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-emerald-500/20">
            {liveLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 text-emerald-300/90 leading-relaxed hover:bg-emerald-500/5 p-1 rounded transition-colors">
                <span className="text-emerald-500/50 select-none">&gt;</span>
                <span suppressHydrationWarning>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 backdrop-blur-xl h-full flex flex-col shadow-[0_0_40px_-10px_rgba(251,191,36,0.05)]">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Upload className="size-5 text-amber-400" />
              Upload VIP Targets
            </h3>
            <p className="text-sm text-white/50 mb-6">
              Paste Instagram IDs (comma or newline separated). The system will securely enrich these profiles using enterprise APIs.
            </p>
            
            <textarea
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 resize-none flex-grow transition-all"
              placeholder="@brand1&#10;@brand2"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            
            <button
              onClick={handleUpload}
              disabled={isProcessing || !inputText.trim()}
              className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin size-5" />
                  Enriching Data...
                </>
              ) : (
                <>
                  <Sparkles className="size-5" />
                  Enrich Candidates
                </>
              )}
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="lg:col-span-2">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden backdrop-blur-xl h-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-black/20">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Search className="size-5 text-amber-400" />
                Enriched Database
              </h3>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex bg-black/40 p-1 rounded-xl border border-white/5">
                  <button onClick={() => handleFilterChange('all')} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>All</button>
                  <button onClick={() => handleFilterChange('enriched-az')} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${filter === 'enriched-az' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:text-white'}`}>Enriched (A-Z)</button>
                  <button onClick={() => handleFilterChange('failed')} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'failed' ? 'bg-red-500/20 text-red-400' : 'text-white/40 hover:text-white'}`}>Failed</button>
                  <button onClick={() => handleFilterChange('insta')} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${filter === 'insta' ? 'bg-pink-500/20 text-pink-400' : 'text-white/40 hover:text-white'}`}><AtSign className="size-3" /> Insta DM</button>
                  <button onClick={() => handleFilterChange('email')} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${filter === 'email' ? 'bg-blue-500/20 text-blue-400' : 'text-white/40 hover:text-white'}`}><Mail className="size-3" /> Email</button>
                  <button onClick={() => handleFilterChange('phone')} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${filter === 'phone' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:text-white'}`}><Phone className="size-3" /> WhatsApp/Phone</button>
                </div>
                <span className="text-xs bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/20 font-medium shadow-sm">
                  {filteredCandidates.length} Profiles
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 flex justify-center text-white/40">Loading database...</div>
              ) : filteredCandidates.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center text-white/40 text-center">
                  <Filter className="size-10 text-white/10 mb-3" />
                  <p>No VIP candidates found for this filter.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-black/40 text-white/40 uppercase tracking-wider text-xs border-b border-white/[0.05]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Brand / ID</th>
                      <th className="px-6 py-4 font-medium">Contact</th>
                      <th className="px-6 py-4 font-medium">Report No.</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {paginatedCandidates.map((vip, idx) => (
                      <tr key={`${vip.id || 'vip'}-${idx}`} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-5">
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span>{vip.brand_name || 'Processing...'}</span>
                            {vip.status === 'enriched' && (
                              vip.audit_data?.engine_source === 'BACKUP_ENGINE' ? (
                                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-mono font-bold">
                                  ⚡ BACKUP
                                </span>
                              ) : (
                                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono font-bold">
                                  🤖 GEMINI AI
                                </span>
                              )
                            )}
                          </div>
                          <div className="text-white/40 text-xs mt-1">@{vip.instagram_id}</div>
                        </td>
                        <td className="px-6 py-5">
                          {(vip.email || vip.phone) ? (
                            <div className="flex flex-col gap-1.5">
                              {vip.email && vip.email !== 'Not Found' && vip.email.split(/[,;\n]/).map(e => e.trim()).filter(Boolean).map((em, idx) => (
                                <span key={`email-${idx}`} className="flex items-center gap-2 text-white/70">
                                  <Mail className="size-3 text-amber-400/70 shrink-0" /> <span className="truncate">{em}</span>
                                </span>
                              ))}
                              {vip.phone && vip.phone !== 'Not Found' && vip.phone.split(/[,;\n]/).map(p => p.trim()).filter(Boolean).map((ph, idx) => (
                                <span key={`phone-${idx}`} className="flex items-center gap-2 text-white/70">
                                  <Phone className="size-3 text-emerald-400/70 shrink-0" /> <span className="truncate">{ph}</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-white/20 italic">Enriching...</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <code className="text-xs text-amber-300/70 bg-amber-900/20 px-2 py-1 rounded">
                            {vip.report_number || '---'}
                          </code>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 text-xs rounded-full border ${
                            vip.status === 'enriched' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-white/5 text-white/40 border-white/10'
                          }`}>
                            {vip.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right flex justify-end gap-2">
                          {vip.status === 'enriched' && (
                            <Link 
                              href={`/vip/${(vip.brand_name || 'brand').toLowerCase().replace(/[^a-z0-9]/g, '')}kriya_audit`}
                              target="_blank"
                              className="inline-flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-4 py-2 rounded-lg text-amber-400 transition-colors"
                            >
                              <ExternalLink className="size-4" />
                              View Report
                            </Link>
                          )}
                          {isLocalHost ? (
                            <button 
                              disabled={vip.status !== 'enriched'}
                              onClick={() => handleSendMail(vip)}
                              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Send className="size-4" />
                              Send Pitch
                            </button>
                          ) : (
                            <button
                              disabled
                              title="Send Pitch execution is restricted to your Local System workspace only."
                              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-white/30 cursor-not-allowed opacity-50 select-none"
                            >
                              <span className="text-xs">🔒</span>
                              Send Pitch
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-white/[0.05] bg-black/20 flex items-center justify-between gap-4 font-mono text-xs text-white/50">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium disabled:opacity-30 disabled:hover:bg-white/5 transition-all select-none"
                >
                  &larr; Previous
                </button>
                <span>
                  Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium disabled:opacity-30 disabled:hover:bg-white/5 transition-all select-none"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
