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
      .catch(() => {});

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
      } catch {}
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
              className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all active:scale-95 ${
                idx === 1
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

            if (cat.id === 'cat-b2b') {
              return (
                <Link
                  key={cat.id}
                  href="/b2b"
                  className="flex flex-col items-center gap-1.5 p-1 rounded-2xl transition-all group relative active:scale-95 hover:bg-neutral-50"
                >
                  {/* Top Badge (1Cr+) */}
                  {cat.badge && (
                    <span className="absolute -top-1.5 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full border shadow-2xs bg-orange-50 text-orange-600 border-orange-200">
                      {cat.badge}
                    </span>
                  )}
                  {/* Icon Container */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs"
                    style={{ backgroundColor: cat.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  {/* Label */}
                  <span className="text-[11px] text-center leading-tight tracking-tight max-w-[70px] font-bold text-[#17181C] group-hover:text-[#E14D2A]">
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
                  className="flex flex-col items-center gap-1.5 p-1 rounded-2xl transition-all group relative active:scale-95 hover:bg-neutral-50"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs"
                    style={{ backgroundColor: cat.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <span className="text-[11px] text-center leading-tight tracking-tight max-w-[70px] font-bold text-[#17181C] group-hover:text-[#2B70C9]">
                    {cat.name}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="flex flex-col items-center gap-1.5 p-1 rounded-2xl transition-all group relative active:scale-95 hover:bg-neutral-50"
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
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs"
                  style={{ backgroundColor: cat.bg }}
                >
                  <Icon className="w-6 h-6" style={{ color: cat.color }} />
                </div>

                {/* Label */}
                <span className="text-[11px] text-center leading-tight tracking-tight max-w-[70px] font-bold text-[#17181C] group-hover:text-[#4787F2]">
                  {cat.name}
                </span>
              </Link>
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

      {/* 5. 🏢 ZOMATO-STYLE VERIFIED BUSINESS CARDS (Shown in Split Mode) */}
      {viewMode === 'split' && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-[#17181C] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Verified Stores Near You</span>
              <span className="bg-[#EDF4FF] dark:bg-[#4787F2]/20 text-[#4787F2] text-[10px] px-2 py-0.5 rounded-full font-bold">
                {filtered.length}
              </span>
            </h3>
            <span className="text-[11px] text-[#687182] dark:text-neutral-400 font-medium">Tap to open visiting card</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((biz) => {
              const slug = biz.slug || biz.id;
              const isElite = biz.tier === 'elite';
              const isPremium = biz.tier === 'premium';
              const destination = isElite ? `/b/${slug}` : `/card/${slug}`;

              return (
                <div
                  key={biz.id}
                  className="bg-white dark:bg-[#161B26] rounded-3xl overflow-hidden border border-[#E3E8EF] dark:border-white/10 hover:border-[#4787F2] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer"
                  onClick={() => window.location.href = destination}
                >
                  {/* Hero Image Section with Zomato Overlays */}
                  <div className="relative h-44 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <img
                      src={biz.cover_url || biz.logo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80'}
                      alt={biz.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Top Tier & Verification Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {isElite && (
                        <span className="bg-[#8338EC] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          👑 ELITE
                        </span>
                      )}
                      {isPremium && (
                        <span className="bg-[#F2B604] text-[#17181C] text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          ★ PREMIUM
                        </span>
                      )}
                      {biz.trusted && (
                        <span className="bg-[#35AB4E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                          ✓ Trusted
                        </span>
                      )}
                    </div>

                    {/* Zomato-Style Rating Tag (Top Right) */}
                    <div className="absolute top-3 right-3 bg-[#24963F] text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-lg flex items-center gap-1">
                      <span>4.8</span>
                      <span className="text-[10px]">★</span>
                    </div>

                    {/* Bottom Info Strip Over Image */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold drop-shadow-md">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F2B604]" />
                        <span className="truncate max-w-[200px]">{biz.pincode ? `Pincode ${biz.pincode}` : 'Hyperlocal'}</span>
                      </span>
                      <span className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-neutral-200">
                        15-20 min
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-sm text-[#17181C] dark:text-white truncate group-hover:text-[#4787F2] transition-colors leading-tight">
                          {biz.name}
                        </h4>
                        <p className="text-[11px] text-[#687182] dark:text-neutral-400 truncate mt-0.5">
                          {biz.address || 'Vadodara, Gujarat'}
                        </p>
                      </div>
                    </div>

                    {/* Zomato-Style Offer Ribbon */}
                    <div className="py-1 px-2.5 rounded-xl bg-[#EDF4FF] dark:bg-[#4787F2]/15 border border-[#4787F2]/20 text-[#4787F2] text-[10px] font-bold flex items-center gap-1.5 truncate">
                      <Sparkles className="w-3 h-3 text-[#F2B604] shrink-0" />
                      <span className="truncate">Flat ₹50 Instant Cashback with Adsspot UPI</span>
                    </div>
                  </div>

                  {/* Action Buttons Tray */}
                  <div className="p-3 pt-0 border-t border-[#E3E8EF]/60 dark:border-white/10 mt-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={`https://wa.me/${(biz.phone || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(biz.name)},%20I%20found%20you%20on%20Adsspot.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 px-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-2xs"
                    >
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${biz.phone}`}
                      className="py-1.5 px-3 rounded-xl bg-[#F4F6FB] dark:bg-neutral-800 hover:bg-neutral-200 text-[#17181C] dark:text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      title="Call Store"
                    >
                      📞
                    </a>

                    <Link
                      href={destination}
                      className="py-1.5 px-3 rounded-xl bg-[#4787F2] hover:bg-[#3373E0] text-white text-xs font-bold text-center transition-transform active:scale-95 shadow-2xs"
                    >
                      View
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
