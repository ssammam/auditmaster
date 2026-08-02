'use client';

import { useState, useEffect } from 'react';
import { Store, Star, ExternalLink, AtSign, Sparkles } from 'lucide-react';

type VIPBrand = {
  id: string;
  instagram_id: string;
  brand_name: string;
  status: string;
  created_at: string;
};

export default function VIPBrands() {
  const [brands, setBrands] = useState<VIPBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch('http://localhost:5055/api/vip');
      const data = await res.json();
      if (data.success) {
        // Filter to only show successfully enriched brands
        const enrichedBrands = data.data.filter((b: VIPBrand) => b.status === 'enriched');
        setBrands(enrichedBrands);
      }
    } catch (error) {
      console.error("Failed to fetch VIP brands", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            <Store className="text-amber-400 size-10" />
            VIP Brands
          </h1>
          <p className="text-white/40 mt-3 text-sm tracking-widest uppercase">
            Exclusive Client Roster
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-amber-500/60 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20 text-sm font-semibold">
          <Star className="size-4" />
          {brands.length} Premium Brands
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-white/[0.02] border border-white/[0.05] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : brands.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-16 text-center flex flex-col items-center justify-center">
          <Sparkles className="size-12 text-amber-500/30 mb-4" />
          <h3 className="text-xl font-semibold text-white/80">No VIP Brands Yet</h3>
          <p className="text-white/40 mt-2 max-w-md">
            Go to the VIP Pipeline to upload and enrich Instagram targets. Once enriched, they will appear here as premium brand profiles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <div 
              key={brand.id}
              className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
            >
              {/* Premium Background Glow Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
              
              <div className="flex-1 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-black border border-amber-500/30 flex items-center justify-center mb-6">
                  <span className="text-amber-400 font-display font-bold text-xl">
                    {brand.brand_name ? brand.brand_name.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1 truncate">
                  {brand.brand_name || 'Unknown Brand'}
                </h3>
                
                <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
                  <AtSign className="size-3.5" />
                  <span>@{brand.instagram_id}</span>
                </div>
              </div>
              
              <div className="pt-5 border-t border-white/[0.05] relative z-10 flex justify-between items-center">
                <span className="text-xs text-white/30 tracking-wider uppercase">
                  Added {new Date(brand.created_at).toLocaleDateString()}
                </span>
                
                <button className="text-amber-500 hover:text-amber-400 p-2 rounded-full hover:bg-amber-500/10 transition-colors">
                  <ExternalLink className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
