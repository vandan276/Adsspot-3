'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { SEED_BUSINESSES, SEED_CATEGORIES } from '@adsspot/api';
import { Card, Button, TrustedBadge } from '@adsspot/ui';
import { MapPin, Map as MapIcon, Sparkles } from 'lucide-react';

// Dynamically load Mapbox Real-time map with ssr: false for instant WebGL canvas hydration
const RealtimeExploreMap = dynamic(
  () => import('../../components/RealtimeExploreMap').then((m) => m.RealtimeExploreMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[65vh] min-h-[420px] rounded-3xl bg-[#17181C] border border-[#E3E8EF] flex flex-col items-center justify-center text-white shadow-xl">
        <div className="w-12 h-12 rounded-full border-4 border-[#4787F2] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-bold text-neutral-300">Loading Real-Time Mapbox &amp; Satellite Map...</p>
        <span className="text-[10px] text-neutral-500 mt-1">Plotting Fort, Mumbai Verified Spot Coordinates</span>
      </div>
    ),
  }
);

export default function ExplorePage() {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'split' | 'map'>('split');
  const [locationName, setLocationName] = useState('Vadodara, Gujarat');

  useEffect(() => {
    const updateLoc = () => {
      try {
        const storedLoc = localStorage.getItem('adsspot_user_location');
        if (storedLoc) {
          const loc = JSON.parse(storedLoc);
          setLocationName(`${loc.city} (${loc.pincode}) — ${loc.area}`);
        }
      } catch {}
    };
    updateLoc();
    window.addEventListener('adsspot_location_changed', updateLoc);
    return () => window.removeEventListener('adsspot_location_changed', updateLoc);
  }, []);

  const filtered = SEED_BUSINESSES.filter((b) => {
    return selectedCat === 'all' || b.category_id === selectedCat;
  });

  return (
    <div className="flex-1 bg-[#F4F6FB] pb-24 max-w-4xl mx-auto w-full min-h-screen p-4 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#17181C] tracking-tight">Real-Time Hyperlocal Map</h1>
          <p className="text-xs text-[#687182] flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-[#4787F2]" />
            <span>Showing verified spots around <strong className="text-[#17181C]">{locationName}</strong></span>
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="bg-white p-1 rounded-full border border-[#E3E8EF] shadow-sm flex items-center shrink-0 self-start">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'split' ? 'bg-[#4787F2] text-white shadow-sm' : 'text-[#687182] hover:text-[#17181C]'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" /> Map + List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'map' ? 'bg-[#4787F2] text-white shadow-sm' : 'text-[#687182] hover:text-[#17181C]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Full Map
          </button>
        </div>
      </div>

      {/* 1. REAL-TIME INTERACTIVE MAP */}
      <RealtimeExploreMap businesses={filtered} selectedCategory={selectedCat} />

      {/* 2. CATEGORY FILTER CHIPS */}
      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              selectedCat === 'all'
                ? 'bg-[#4787F2] text-white shadow-sm'
                : 'bg-white text-[#4A5260] border border-[#E3E8EF] hover:bg-neutral-50'
            }`}
          >
            All Categories ({SEED_BUSINESSES.length})
          </button>
          {SEED_CATEGORIES.map((cat) => {
            const count = SEED_BUSINESSES.filter((b) => b.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  selectedCat === cat.id
                    ? 'bg-[#4787F2] text-white shadow-sm'
                    : 'bg-white text-[#4A5260] border border-[#E3E8EF] hover:bg-neutral-50'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. BUSINESS DIRECTORY LIST (Shown in Split Mode) */}
      {viewMode === 'split' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-[#17181C] uppercase tracking-wider">
              Verified Spots Nearby ({filtered.length})
            </h3>
            <span className="text-[11px] text-[#687182]">Tap card for live directions &amp; offers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((biz) => (
              <Card key={biz.id} padding="md" className="flex gap-3.5 items-center shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={biz.logo_url || ''}
                  alt={biz.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-neutral-100 shrink-0 border border-neutral-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-[#17181C] truncate">{biz.name}</h4>
                    {biz.trusted && <TrustedBadge size="sm" />}
                  </div>
                  <p className="text-[11px] text-[#687182] truncate mt-0.5">{biz.description}</p>
                  <span className="text-[10px] text-[#4787F2] font-semibold flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {biz.address}
                  </span>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  <Link href={`/card/${biz.slug}`}>
                    <Button variant="primary" size="sm">
                      Card
                    </Button>
                  </Link>
                  {biz.tier === 'elite' && (
                    <Link href={`/b/${biz.slug}`}>
                      <Button variant="outline" size="sm">
                        Site
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
