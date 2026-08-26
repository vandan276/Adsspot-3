'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { SEED_BUSINESSES } from '@adsspot/api';
import { Card, Button, TrustedBadge } from '@adsspot/ui';
import {
  MapPin,
  Map as MapIcon,
  Sparkles,
  Search,
  Briefcase,
  Building2,
  Stethoscope,
  Plane,
  Sparkle,
  Sun,
  HeartHandshake,
  GraduationCap,
  Truck,
  Wrench,
  Dumbbell,
  Users,
  Banknote,
  Home,
  Bed,
  ChevronDown,
  UtensilsCrossed,
  Shirt,
  Smartphone,
  Gem,
  Car,
} from 'lucide-react';

// Icon and styling mapping for exact category grid representation
const CATEGORY_GRID_ITEMS = [
  { id: 'cat-biz', name: 'My Business', icon: Briefcase, color: '#2B70C9', bg: '#EDF4FF' },
  { id: 'cat-b2b', name: 'B2b', icon: Building2, color: '#E14D2A', bg: '#FFF1EE', badge: '1Cr+' },
  { id: 'cat-doc', name: 'Doctors', icon: Stethoscope, color: '#00A86B', bg: '#EBF9F3' },
  { id: 'cat-travel', name: 'Travel', icon: Plane, color: '#3A86FF', bg: '#EFF5FF' },
  { id: 'cat-beauty', name: 'Beauty', icon: Sparkle, color: '#B5179E', bg: '#FDF0F8' },
  { id: 'cat-astro', name: 'Ask Astro', icon: Sun, color: '#D97706', bg: '#FFFBEB', badge: 'Beta' },
  { id: 'cat-wedding', name: 'Wedding Planning', icon: HeartHandshake, color: '#8338EC', bg: '#F5EEFD' },
  { id: 'cat-edu', name: 'Education', icon: GraduationCap, color: '#059669', bg: '#ECFDF5' },
  { id: 'cat-packers', name: 'Packers & Movers', icon: Truck, color: '#EA580C', bg: '#FFF7ED' },
  { id: 'cat-repairs', name: 'Repairs & Services', icon: Wrench, color: '#4B5563', bg: '#F3F4F6' },
  { id: 'cat-gym', name: 'Gym', icon: Dumbbell, color: '#4F46E5', bg: '#EEF2FF' },
  { id: 'cat-jobs', name: 'Jobs', icon: Users, color: '#0D9488', bg: '#F0FDFA' },
  { id: 'cat-loans', name: 'Loans', icon: Banknote, color: '#16A34A', bg: '#F0FDF4' },
  { id: 'cat-realestate', name: 'Real Estate', icon: Home, color: '#E11D48', bg: '#FFF1F2' },
  { id: 'cat-hostel', name: 'PG/Hostel', icon: Bed, color: '#6366F1', bg: '#EEF2FF' },
  { id: 'cat-1', name: 'Food & Dining', icon: UtensilsCrossed, color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'cat-2', name: 'Fashion & Apparel', icon: Shirt, color: '#EC4899', bg: '#FCE7F3' },
  { id: 'cat-3', name: 'Electronics', icon: Smartphone, color: '#0284C7', bg: '#E0F2FE' },
  { id: 'cat-7', name: 'Jewellery', icon: Gem, color: '#EAB308', bg: '#FEF9C3' },
  { id: 'cat-8', name: 'Automobile', icon: Car, color: '#64748B', bg: '#F1F5F9' },
];

// Dynamically load Mapbox Real-time map with ssr: false for instant WebGL canvas hydration
const RealtimeExploreMap = dynamic(
  () => import('../../components/RealtimeExploreMap').then((m) => m.RealtimeExploreMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[250px] sm:h-[360px] rounded-3xl bg-[#17181C] border border-[#E3E8EF] flex flex-col items-center justify-center text-white shadow-xl">
        <div className="w-10 h-10 rounded-full border-4 border-[#4787F2] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-bold text-neutral-300">Loading Real-Time Mapbox &amp; Satellite Map...</p>
      </div>
    ),
  }
);

export default function ExplorePage() {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'split' | 'map'>('split');
  const [searchQuery, setSearchQuery] = useState('');
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
    const matchesCat = selectedCat === 'all' || b.category_id === selectedCat;
    const matchesSearch =
      searchQuery.trim() === '' ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const visibleCategoryItems = CATEGORY_GRID_ITEMS.slice(0, 15);

  return (
    <div className="flex-1 bg-[#F4F6FB] pb-24 max-w-4xl mx-auto w-full min-h-screen p-4 space-y-4">
      {/* 1. Header & Location Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#17181C] tracking-tight">Real-Time Hyperlocal Map</h1>
          <p className="text-xs text-[#687182] flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-[#4787F2]" />
            <span>Showing verified spots around <strong className="text-[#17181C]">{locationName}</strong></span>
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="bg-white p-1 rounded-full border border-[#E3E8EF] shadow-xs flex items-center shrink-0 self-start">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'split' ? 'bg-[#4787F2] text-white shadow-xs' : 'text-[#687182] hover:text-[#17181C]'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" /> Map + List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'map' ? 'bg-[#4787F2] text-white shadow-xs' : 'text-[#687182] hover:text-[#17181C]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Full Map
          </button>
        </div>
      </div>

      {/* 2. 🔍 SEARCH BAR ABOVE MAP */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
          <Search className="w-4 h-4 text-[#4787F2]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search restaurants, doctors, shops, services in Vadodara..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-[#E3E8EF] rounded-2xl text-xs sm:text-sm font-semibold text-[#17181C] placeholder:text-neutral-400 shadow-xs outline-none focus:border-[#4787F2] focus:ring-2 focus:ring-[#4787F2]/10 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-neutral-400 hover:text-neutral-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* 3. 🗺️ REAL-TIME INTERACTIVE MAP */}
      <RealtimeExploreMap
        businesses={filtered}
        selectedCategory={selectedCat}
        isFullScreen={viewMode === 'map'}
      />

      {/* 4. 📱 AUTHENTIC CATEGORY GRID SECTION (Matching Screenshot) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E3E8EF] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-[#17181C] uppercase tracking-wider">
            Explore Categories
          </h2>
          {selectedCat !== 'all' && (
            <button
              onClick={() => setSelectedCat('all')}
              className="text-[11px] font-bold text-[#4787F2] hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* 4x4 Grid with custom colorful icons & pill badges */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-y-4 gap-x-2">
          {visibleCategoryItems.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCat === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(isSelected ? 'all' : cat.id)}
                className={`flex flex-col items-center gap-1.5 p-1 rounded-2xl transition-all group relative active:scale-95 ${
                  isSelected ? 'bg-[#EDF4FF]' : 'hover:bg-neutral-50'
                }`}
              >
                {/* Top Badge (e.g. 1Cr+, Beta) */}
                {cat.badge && (
                  <span
                    className={`absolute -top-1.5 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full border shadow-2xs ${
                      cat.badge === 'Beta'
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : 'bg-orange-50 text-orange-600 border-orange-200'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}

                {/* Icon Container */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs ${
                    isSelected ? 'ring-2 ring-[#4787F2]' : ''
                  }`}
                  style={{ backgroundColor: cat.bg }}
                >
                  <Icon className="w-6 h-6" style={{ color: cat.color }} />
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] text-center leading-tight tracking-tight max-w-[70px] ${
                    isSelected
                      ? 'font-black text-[#4787F2]'
                      : 'font-bold text-[#17181C] group-hover:text-[#4787F2]'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}

          {/* Show More -> Links to All Categories Full Page */}
          <Link
            href="/categories"
            className="flex flex-col items-center gap-1.5 p-1 rounded-2xl hover:bg-neutral-50 transition-all group active:scale-95"
          >
            <div className="w-12 h-12 rounded-full bg-[#4787F2] text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm">
              <ChevronDown className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[11px] text-center font-bold text-[#17181C] group-hover:text-[#4787F2] leading-tight tracking-tight">
              Show More
            </span>
          </Link>
        </div>
      </div>

      {/* 5. 🏢 VERIFIED BUSINESS DIRECTORY CARDS (Shown in Split Mode) */}
      {viewMode === 'split' && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-[#17181C] uppercase tracking-wider">
              Verified Spots Nearby ({filtered.length})
            </h3>
            <span className="text-[11px] text-[#687182]">Tap card for live directions &amp; offers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((biz) => (
              <Card key={biz.id} padding="md" className="flex gap-3.5 items-center shadow-xs hover:shadow-md transition-shadow">
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
