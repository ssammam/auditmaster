'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingBag, ChevronRight, Menu, ArrowRight, AtSign, Hash, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function VIPDynamicDemo() {
  const params = useParams();
  const reportId = params.report_id as string;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`http://localhost:5055/api/vip/report/${reportId}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [reportId]);

  if (loading) {
    return <div className="min-h-screen bg-black" />;
  }

  if (!data) {
    return <div className="min-h-screen bg-black text-white p-12">Demo Expired or Not Found</div>;
  }

  const brandName = data.brand_name || 'Premium Brand';

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-white/20 overflow-x-hidden">
      
      {/* Dynamic Kriya AI Demo Banner */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-black text-xs font-bold tracking-[0.2em] uppercase py-2 px-6 flex justify-between items-center">
        <span>Automatically Generated Architecture Demo</span>
        <Link href={`/vip/${reportId}`} className="hover:underline flex items-center gap-1">
          Return to Report <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* Demo Nav */}
      <nav className="fixed top-8 left-0 right-0 z-50 px-6 md:px-12 py-6 flex justify-between items-center mix-blend-difference">
        <div className="font-display text-2xl font-bold tracking-widest uppercase">
          {brandName}
        </div>
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-medium">
          <button className="hover:opacity-50 transition-opacity">Collections</button>
          <button className="hover:opacity-50 transition-opacity">Heritage</button>
          <button className="hover:opacity-50 transition-opacity">Journal</button>
        </div>
        <div className="flex items-center gap-6">
          <ShoppingBag className="size-5" />
          <Menu className="size-6 md:hidden" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Placeholder for WebGL / High-end Imagery */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#030303] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=3000&auto=format&fit=crop" 
            alt="Premium Background" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow" 
            style={{ animationDuration: '10s' }}
          />
        </div>

        <div className="relative z-10 text-center px-6 mt-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <p className="text-xs tracking-[0.4em] uppercase mb-6 text-white/70">
            A new era of elegance
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-medium tracking-tight uppercase leading-[0.9]">
            The <br className="md:hidden" /> {brandName} <br /> Collection
          </h1>
          <button className="mt-12 px-8 py-4 border border-white/30 rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500">
            Explore Now
          </button>
        </div>
      </section>

      {/* Dynamic Products / Features Grid */}
      <section className="py-32 px-6 md:px-12 bg-[#030303]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tight max-w-lg">
              Crafted for<br/>The Extraordinary
            </h2>
            <button className="flex items-center gap-2 text-sm uppercase tracking-widest mt-6 md:mt-0 hover:opacity-50 transition-opacity border-b border-white pb-1">
              View Lookbook <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group relative aspect-[4/5] bg-white/5 overflow-hidden rounded-sm">
              <img src="https://images.unsplash.com/photo-1599643478514-4a1101859c76?q=80&w=1500&auto=format&fit=crop" alt="Editorial 1" className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xs uppercase tracking-[0.2em] mb-2">Signature Series</p>
                <h3 className="text-2xl font-display">The Timeless Edit</h3>
              </div>
            </div>
            <div className="group relative aspect-[4/5] bg-white/5 overflow-hidden rounded-sm md:mt-24">
              <img src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1500&auto=format&fit=crop" alt="Editorial 2" className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xs uppercase tracking-[0.2em] mb-2">New Arrivals</p>
                <h3 className="text-2xl font-display">Modern Heritage</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Footer targeting their social */}
      <footer className="bg-black py-24 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-display uppercase tracking-widest mb-6">{brandName}</h2>
            <p className="text-white/40 max-w-sm mb-8">
              Automatically generated high-conversion architecture. Designed to fix the UX flaws highlighted in the VIP audit.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-6">Connect</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href={`https://instagram.com/${data.instagram_id}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                  <AtSign className="size-4" /> @{data.instagram_id}
                </a>
              </li>
              <li className="flex items-center gap-2"><Hash className="size-4" /> Twitter</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-6">Location</h4>
            <p className="text-sm text-white/80 flex items-start gap-2">
              <MapPin className="size-4 mt-0.5 shrink-0" />
              {data.audit_data?.contact?.address || 'Mayfair, London'}
            </p>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
