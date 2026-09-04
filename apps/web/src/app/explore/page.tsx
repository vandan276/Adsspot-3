'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getAllBusinesses } from '@adsspot/api';
import { Business } from '@adsspot/types';
import { ApkDownloadPromptModal } from '../../components/ApkDownloadPromptModal';
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
  const [businessesList, setBusinessesList] = useState<Business[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'split' | 'map'>('split');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationName, setLocationName] = useState('Vadodara, Gujarat');
  const [isStandaloneApp, setIsStandaloneApp] = useState(false);
  const [merchants, setMerchants] = useState<any[]>([]);

  useEffect(() => {
    async function loadBusinesses() {
      const data = await getAllBusinesses();
      setBusinessesList(data);
    }
    loadBusinesses();

    // Fetch live merchants from PostgreSQL DB
    fetch('/api/merchants')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.merchants && Array.isArray(data.merchants)) {
          setMerchants(data.merchants);
        }
      })
      .catch(() => { });

    // Detect if already running in standalone PWA / APK
    const isStandalone =
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        // @ts-expect-error navigator.standalone is iOS Safari specific
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://'));

    setIsStandaloneApp(Boolean(isStandalone));

    const updateLoc = () => {
      try {
        const storedLoc = localStorage.getItem('adsspot_user_location');
        if (storedLoc) {
          const loc = JSON.parse(storedLoc);
          setLocationName(`${loc.city} (${loc.pincode}) — ${loc.area}`);
        }
      } catch { }
    };
    updateLoc();
    window.addEventListener('adsspot_location_changed', updateLoc);
    return () => window.removeEventListener('adsspot_location_changed', updateLoc);
  }, []);

  const displayList = merchants.length > 0 ? merchants : businessesList;
  const filtered = displayList.filter((b) => {
    const matchesCat = selectedCat === 'all' || b.category_id === selectedCat;
    const matchesSearch =
      searchQuery.trim() === '' ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.address || '').toLowerCase().includes(searchQuery.toLowerCase());
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
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === 'split' ? 'bg-[#4787F2] text-white shadow-xs' : 'text-[#687182] hover:text-[#17181C]'
              }`}
          >
            <MapIcon className="w-3.5 h-3.5" /> Map + List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === 'map' ? 'bg-[#4787F2] text-white shadow-xs' : 'text-[#687182] hover:text-[#17181C]'
              }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Full Map
          </button>
        </div>
      </div>

      {/* 2. 🔍 SEARCH BAR ABOVE MAP & RADIUS FILTER (Feature C) */}
      <div className="space-y-2">
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

        {/* Live Proximity Radius Chips with Dynamic ETA indicators */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-bold text-[#687182] px-1">Radius:</span>
          {['1 km (🚶 5 min)', '3 km (🚗 8 min)', '5 km (🚗 15 min)', 'Whole City'].map((rad, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all active:scale-95 ${idx === 1
                  ? 'bg-[#17181C] text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-[#E3E8EF] hover:border-neutral-300'
                }`}
            >
              {rad}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 🗺️ REAL-TIME INTERACTIVE MAP */}
      <div className="relative">
        <RealtimeExploreMap
          businesses={filtered}
          selectedCategory={selectedCat}
          isFullScreen={viewMode === 'map'}
        />

        {/* Floating App Access Gate Overlay — ONLY shown on standard Web Browsers, completely hidden in APK */}
        {!isStandaloneApp && (
          <div className="absolute bottom-4 left-4 right-4 z-[500] bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#4787F2]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EDF4FF] text-[#4787F2] flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#17181C] leading-tight">Live GPS Navigation &amp; Pincode Filters</h4>
                <p className="text-[10px] text-[#687182] font-semibold">Install the official Adsspot App for real-time 3D shop map</p>
              </div>
            </div>
            <Link
              href="/download"
              className="w-full sm:w-auto px-4 py-2 bg-[#4787F2] hover:bg-[#3972D4] text-white rounded-full text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open in App</span>
            </Link>
          </div>
        )}
      </div>

      {/* App Download Modal (Only active for Web Browser visitors, suppressed in APK) */}
      {!isStandaloneApp && (
        <ApkDownloadPromptModal
          forceOpen={true}
          title="Get the Adsspot App"
          subtitle="Live GPS Map & Local Directory"
          preventDismiss={false}
        />
      )}

      {/* 4. 🛍️ BLINKIT-STYLE QUICK CATEGORY TILES */}
      <div className="ios-glass-card rounded-3xl p-4 sm:p-5 border border-[#E3E8EF] dark:border-white/10 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-black text-[#17181C] dark:text-white uppercase tracking-wider">
              Quick Categories
            </h2>
            <span className="text-[10px] bg-[#EDF4FF] dark:bg-[#4787F2]/20 text-[#4787F2] font-bold px-2 py-0.5 rounded-full">
              Hyperlocal ⚡
            </span>
          </div>
          {selectedCat !== 'all' && (
            <button
              onClick={() => setSelectedCat('all')}
              className="text-[11px] font-bold text-[#4787F2] hover:underline cursor-pointer"
            >
              Show All
            </button>
          )}
        </div>

        {/* 4x4 Grid with custom colorful icons & pill badges */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-y-4 gap-x-2">
          {visibleCategoryItems.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCat === cat.id;

            if (cat.id === 'cat-b2b') {
              return (
                <Link
                  key={cat.id}
                  href="/b2b"
                  className="flex flex-col items-center gap-1.5 p-1 rounded-2xl transition-all group relative active:scale-95 hover:bg-neutral-50 dark:hover:bg-white/5"
                >
                  {cat.badge && (
                    <span className="absolute -top-1.5 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full border shadow-2xs bg-orange-50 text-orange-600 border-orange-200">
                      {cat.badge}
                    </span>
                  )}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs"
                    style={{ backgroundColor: cat.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <span className="text-[11px] text-center leading-tight tracking-tight max-w-[70px] font-bold text-[#17181C] dark:text-neutral-200 group-hover:text-[#E14D2A]">
                    {cat.name}
                  </span>
                </Link>
              );
            }

            if (cat.id === 'cat-biz') {
              return (
                <Link
                  key={cat.id}
                  href="/merchant"
                  className="flex flex-col items-center gap-1.5 p-1 rounded-2xl transition-all group relative active:scale-95 hover:bg-neutral-50 dark:hover:bg-white/5"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs"
                    style={{ backgroundColor: cat.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <span className="text-[11px] text-center leading-tight tracking-tight max-w-[70px] font-bold text-[#17181C] dark:text-neutral-200 group-hover:text-[#2B70C9]">
                    {cat.name}
                  </span>
                </Link>
              );
            }

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(isSelected ? 'all' : cat.id)}
                className={`flex flex-col items-center gap-1.5 p-1 rounded-2xl transition-all group relative active:scale-95 cursor-pointer ${
                  isSelected ? 'ring-2 ring-[#4787F2] bg-[#EDF4FF]/50 dark:bg-[#4787F2]/10' : 'hover:bg-neutral-50 dark:hover:bg-white/5'
                }`}
              >
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

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs"
                  style={{ backgroundColor: cat.bg }}
                >
                  <Icon className="w-6 h-6" style={{ color: cat.color }} />
                </div>

                <span className="text-[11px] text-center leading-tight tracking-tight max-w-[70px] font-bold text-[#17181C] dark:text-neutral-200 group-hover:text-[#4787F2]">
                  {cat.name}
                </span>
              </button>
            );
          })}

          {/* Show More -> Links to All Categories Full Page */}
          <Link
            href="/categories"
            className="flex flex-col items-center gap-1.5 p-1 rounded-2xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-all group active:scale-95"
          >
            <div className="w-12 h-12 rounded-full bg-[#4787F2] text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm">
              <ChevronDown className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[11px] text-center font-bold text-[#17181C] dark:text-neutral-200 group-hover:text-[#4787F2] leading-tight tracking-tight">
              All 14+
            </span>
          </Link>
        </div>
      </div>

      {/* 5. 🗺️ AIRBNB-STYLE INTERACTIVE BOTTOM SHEET / STORE LISTING */}
      {viewMode === 'split' && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-[#17181C] dark:text-white uppercase tracking-wider">
                Spots in {(locationName || 'Vadodara').split('(')[0]?.trim() || 'Vadodara'} ({filtered.length})
              </h3>
              <span className="text-[9px] bg-[#35AB4E]/10 text-[#35AB4E] border border-[#35AB4E]/30 px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#35AB4E] animate-pulse" />
                Live Verified
              </span>
            </div>
            <span className="text-[11px] text-[#687182] dark:text-neutral-400 font-semibold">Tap card to inspect</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filtered.map((biz, idx) => {
              const slug = biz.slug || biz.id;
              const isElite = biz.tier === 'elite';
              const destination = isElite ? `/b/${slug}` : `/card/${slug}`;

              return (
                <div
                  key={biz.id}
                  className="bg-white dark:bg-[#151922] rounded-3xl p-3.5 border border-[#E3E8EF] dark:border-white/10 hover:border-[#4787F2] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                  onClick={() => window.location.href = destination}
                >
                  {/* Subtle Spot-Ring Glow for Elite Merchants */}
                  {isElite && (
                    <div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4787F2] via-[#35AB4E] via-[#F2B604] to-[#981837]"
                    />
                  )}

                  <div className="flex items-start gap-3">
                    {/* Store Logo Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={biz.logo_url || biz.cover_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150'}
                        alt={biz.name}
                        className="w-16 h-16 rounded-2xl object-cover bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-white/10 group-hover:scale-105 transition-transform"
                      />
                      {isElite && (
                        <span className="absolute -top-1.5 -right-1.5 bg-[#8338EC] text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                          ELITE
                        </span>
                      )}
                    </div>

                    {/* Store Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-sm text-[#17181C] dark:text-white truncate group-hover:text-[#4787F2] transition-colors leading-tight">
                          {biz.name}
                        </h4>
                        {biz.trusted && (
                          <span className="text-[10px] text-[#35AB4E] font-bold bg-[#EBF9EE] dark:bg-[#35AB4E]/20 px-1.5 rounded-full shrink-0">
                            ✓
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#687182] dark:text-neutral-400 truncate mt-0.5">
                        {biz.description || 'Verified local merchant offering quality services.'}
                      </p>

                      {/* Social Trust & GPS Distance Meter */}
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[10px] font-bold">
                        <span className="text-[#4787F2] flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{biz.address ? biz.address.split(',')[0] : 'Hyperlocal'}</span>
                        </span>
                        <span className="text-neutral-300 dark:text-neutral-700">•</span>
                        <span className="text-[#35AB4E]">
                          👥 {18 + (idx * 7) % 40} locals visited today
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Tap Quick Action Tray */}
                  <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-white/10 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5 flex-1">
                      <a
                        href={`https://wa.me/${(biz.phone || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(biz.name)},%20I%20found%20you%20on%20Adsspot.`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-bold flex items-center gap-1 transition-transform active:scale-95 shadow-2xs"
                      >
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${biz.phone}`}
                        className="p-1.5 px-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-[#17181C] dark:text-white text-[11px] font-bold transition-colors"
                        title="Call Store"
                      >
                        📞 Call
                      </a>
                    </div>

                    <Link
                      href={destination}
                      className="py-1.5 px-3 rounded-xl bg-[#17181C] dark:bg-white dark:text-[#17181C] text-white text-[11px] font-extrabold hover:bg-[#4787F2] dark:hover:bg-[#4787F2] dark:hover:text-white transition-all active:scale-95 shadow-xs flex items-center gap-1"
                    >
                      <span>Digital Card</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
