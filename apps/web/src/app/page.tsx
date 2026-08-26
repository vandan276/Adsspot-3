'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SEED_BUSINESSES, SEED_CATEGORIES } from '@adsspot/api';
import { Button, Card, Avatar, TrustedBadge, TierBadge, Logo, AnimatedLogoMark } from '@adsspot/ui';
import { WebSplashScreen } from '../components/WebSplashScreen';

import {
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  Crown,
  ArrowRight,
  Users,
  Smartphone,
  Star,
  MessageCircle,
  Phone,
  QrCode,
  Store,
  Award,
  Zap,
  Clock,
  ChevronRight,
  Download,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  useEffect(() => {
    // Show splash screen on first visit in the session
    const hasSeenSplash = sessionStorage.getItem('adsspot_has_seen_splash');
    if (!hasSeenSplash) {
      setShowSplash(true);
      sessionStorage.setItem('adsspot_has_seen_splash', 'true');
    }

    const handleTrigger = () => setShowSplash(true);
    window.addEventListener('adsspot:trigger-splash', handleTrigger);
    return () => window.removeEventListener('adsspot:trigger-splash', handleTrigger);
  }, []);

  const filteredBusinesses = SEED_BUSINESSES.filter((b) => {
    const matchesCat = selectedCategory === 'all' || b.category_id === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6FB] min-h-screen relative">
      {showSplash && <WebSplashScreen onFinish={() => setShowSplash(false)} />}

      {/* 1. MODERN CONSUMER HERO SECTION */}

      <section className="bg-white border-b border-[#E3E8EF] pt-14 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Prominent Animated Brand Logo Showcase */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="p-3 sm:p-4 rounded-3xl bg-gradient-to-b from-[#EDF4FF] to-white border border-[#4787F2]/20 shadow-lg shadow-[#4787F2]/10 mb-4 transform hover:scale-105 transition-transform">
              <Logo size={78} withText={true} animated={true} />
            </div>
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDF4FF] border border-[#4787F2]/20">
              <span className="w-2 h-2 rounded-full bg-[#4787F2] animate-ping" />
              <span className="text-xs font-bold text-[#1D53B8]">
                India's Hyperlocal Neighborhood Discovery Platform
              </span>
            </div>
          </div>

          {/* Clean, High-Contrast Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#17181C] tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6">
            Discover the best of your neighborhood in real time.
          </h1>

          <p className="text-lg sm:text-xl text-[#4A5260] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Explore verified local boutiques, authentic sweets, daily festival banners, and trending offers right in your pincode.
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border-2 border-[#4787F2]/30 shadow-lg p-2 flex flex-col sm:flex-row items-center gap-2 mb-8">
            {/* Location Selector */}
            <div className="flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-[#E3E8EF] w-full sm:w-auto flex-shrink-0 text-left">
              <MapPin className="w-4 h-4 text-[#4787F2]" />
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  if (e.target.value === 'Vadodara') {
                    localStorage.setItem('adsspot_user_location', JSON.stringify({
                      city: 'Vadodara',
                      pincode: '390007',
                      area: 'Alkapuri & Old Padra Road',
                      lat: 22.3106,
                      lng: 73.1678
                    }));
                    window.dispatchEvent(new Event('adsspot_location_changed'));
                  }
                }}
                aria-label="Select City"
                className="bg-transparent text-sm font-bold text-[#17181C] outline-none cursor-pointer"
              >
                <option value="Vadodara">Alkapuri, Vadodara 390007</option>
                <option value="Mumbai">Fort, Mumbai 400001</option>
                <option value="Ahmedabad">Navrangpura, Ahmedabad 380009</option>
                <option value="Bengaluru">Indiranagar, Bengaluru 560038</option>
                <option value="Delhi">Connaught Place, Delhi 110001</option>
              </select>
            </div>

            {/* Keyword Input */}
            <div className="flex items-center gap-2 px-3 flex-1 w-full">
              <Search className="w-4 h-4 text-[#687182]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewellery, sweets, cafes, salons, electronics..."
                className="w-full bg-transparent text-sm text-[#17181C] placeholder-[#687182] outline-none font-medium py-1.5"
              />
            </div>

            {/* Action CTA */}
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto px-6 font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Nearby
            </Button>
          </div>

          {/* Social Proof & Quick Download Pill */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#687182] font-semibold">
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-[#17181C] font-bold">4.9 / 5</span>
              <span>from 42,000+ local shoppers</span>
            </div>
            <span className="hidden sm:inline text-[#CDD5DF]">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#35AB4E]" />
              <span className="text-[#17181C] font-bold">100% Verified</span>
              <span>Local Shop Listings</span>
            </div>
            <span className="hidden sm:inline text-[#CDD5DF]">•</span>
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#4787F2]" />
              <span>Available on Android &amp; iOS</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#17181C]">Explore Popular Categories</h2>
            <p className="text-sm text-[#687182] mt-0.5">Top-rated shops and local service providers in your neighborhood</p>
          </div>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#17181C] text-white border-[#17181C]'
                : 'bg-white text-[#4A5260] border-[#E3E8EF] hover:border-[#4787F2]'
            }`}
          >
            All Categories ({SEED_CATEGORIES.length})
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {SEED_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl text-center transition-all bg-white border ${
                  isSelected
                    ? 'border-[#4787F2] ring-2 ring-[#4787F2]/20 shadow-sm'
                    : 'border-[#E3E8EF] hover:border-[#4787F2]/40 hover:-translate-y-0.5'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 font-bold ${
                    isSelected ? 'bg-[#4787F2] text-white' : 'bg-[#F4F6FB] text-[#4787F2]'
                  }`}
                >
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#17181C] leading-tight">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. TRENDING NEARBY BUSINESSES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#35AB4E] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Trending in {selectedCity}
            </div>
            <h2 className="text-2xl font-bold text-[#17181C]">Featured Local Merchants</h2>
          </div>
          <Link href="/login">
            <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
              View Live Map &amp; Feed
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBusinesses.map((biz) => {
            return (
              <Card key={biz.id} padding="none" hoverable className="overflow-hidden flex flex-col justify-between">
                <div>
                  {/* Business Cover Photo */}
                  <div className="relative h-48 bg-neutral-200">
                    <img
                      src={biz.cover_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'}
                      alt={biz.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <TierBadge tier={biz.tier} size="sm" />
                      {biz.trusted && <TrustedBadge size="sm" />}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-[#17181C] shadow-sm flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#35AB4E]" /> Open Now
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar
                        src={biz.logo_url}
                        name={biz.name}
                        size="md"
                        isElite={biz.tier === 'elite'}
                      />
                      <div className="overflow-hidden">
                        <h3 className="text-base font-bold text-[#17181C] truncate">{biz.name}</h3>
                        <p className="text-xs text-[#687182] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#4787F2] flex-shrink-0" />
                          <span className="truncate">{biz.address}</span>
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#4A5260] line-clamp-2 leading-relaxed mb-4">
                      {biz.description}
                    </p>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between text-xs py-2.5 px-3 rounded-lg bg-[#F4F6FB] border border-[#E3E8EF] mb-4">
                      <span className="font-semibold text-[#17181C] flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {biz.stats?.avg_rating} ({biz.stats?.reviews_count} reviews)
                      </span>
                      <span className="text-[#687182] font-medium">0.4 km away</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 pt-0 grid grid-cols-3 gap-2">
                  <a
                    href={`tel:${biz.phone}`}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-full border border-[#E3E8EF] text-xs font-bold text-[#17181C] hover:bg-[#F4F6FB] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#4787F2]" /> Call
                  </a>
                  <a
                    href={`https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-full border border-[#35AB4E] bg-[#EBF9EE] text-xs font-bold text-[#1B6A2D] hover:bg-[#d9f5de] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#35AB4E]" /> WhatsApp
                  </a>
                  <Link
                    href={`/card/${biz.slug}`}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-full bg-[#4787F2] text-xs font-bold text-white hover:bg-[#3373E0] transition-colors"
                  >
                    Card &rarr;
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4. WHY END-USERS & MERCHANTS LOVE ADSSPOT */}
      <section className="bg-white border-y border-[#E3E8EF] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDF4FF] text-[#1D53B8] text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5 text-[#4787F2]" /> Built for Local Living
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17181C] tracking-tight">
              Everything you need to discover and support local shops
            </h2>
            <p className="text-base text-[#687182] mt-3">
              No sponsored junk, no fake reviews. Pure hyperlocal authenticity in your palm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#EDF4FF] text-[#4787F2] flex items-center justify-center font-bold mb-4">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#17181C] mb-2">Live Neighborhood Feed</h3>
              <p className="text-sm text-[#687182] leading-relaxed">
                Stay updated with daily stories, newly arrived stock, and festival discounts from shops walking distance from your doorstep.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#EBF9EE] text-[#35AB4E] flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#17181C] mb-2">Verified "Trusted" Badge</h3>
              <p className="text-sm text-[#687182] leading-relaxed">
                Our local Sales Managers physically visit every shop to verify hallmark certifications, hygiene standards, and genuine billing.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#FFF8E6] text-[#A06E00] flex items-center justify-center font-bold mb-4">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#17181C] mb-2">1-Tap Digital Cards</h3>
              <p className="text-sm text-[#687182] leading-relaxed">
                Access instantly shareable visiting cards (<code className="text-[#17181C] font-mono text-xs">/card/[slug]</code>) with direct WhatsApp, Call, and Directions.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#FBECEF] text-[#981837] flex items-center justify-center font-bold mb-4">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#17181C] mb-2">Elite Business Microsites</h3>
              <p className="text-sm text-[#687182] leading-relaxed">
                Premium local brands receive dedicated standalone web microsites (<code className="text-[#17181C] font-mono text-xs">/b/[slug]</code>) with complete photo catalogs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. APP DOWNLOAD CTA SECTION */}
      <section id="mobile-app" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="bg-[#17181C] text-white rounded-3xl p-8 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Brand Glow */}
          <div 
            className="absolute -right-20 -top-20 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(71, 135, 242, 0.18) 0%, rgba(53, 171, 78, 0.1) 50%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          <div className="max-w-xl z-10">
            <div className="flex items-center gap-3 mb-6">
              <Logo size={44} withText={true} />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold mb-4 backdrop-blur-md border border-white/10">
              <Smartphone className="w-3.5 h-3.5 text-[#4787F2]" /> Free Mobile App for iOS &amp; Android
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 font-['Plus_Jakarta_Sans',sans-serif]">
              Take Adsspot with you everywhere you go.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 mb-8 leading-relaxed">
              Explore live shop maps with category sheets, watch Elite 24-hour stories, manage your hyperlocal wallet, and book local event tickets with QR codes.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/download"
                className="inline-flex items-center gap-3 bg-white text-[#17181C] px-6 py-3.5 rounded-full font-extrabold text-sm hover:bg-neutral-100 transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4 text-[#4787F2]" /> Download for iOS
              </Link>
              <Link
                href="/download"
                className="inline-flex items-center gap-3 bg-neutral-800/90 text-white px-6 py-3.5 rounded-full font-extrabold text-sm hover:bg-neutral-700 transition-all border border-neutral-700 shadow-lg hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4 text-[#35AB4E]" /> Download for Android
              </Link>
            </div>
          </div>

          {/* Clean App Preview Graphic with Center Animated Logo Spot */}
          <div className="w-full lg:w-auto flex-shrink-0 flex items-center justify-center z-10">
            <div className="bg-neutral-900/90 border border-neutral-800 p-7 rounded-3xl flex flex-col items-center gap-4 max-w-[280px] text-center shadow-2xl backdrop-blur-xl">
              <div className="relative w-40 h-40 bg-white rounded-2xl p-2.5 flex items-center justify-center shadow-inner">
                <QrCode className="w-36 h-36 text-[#17181C]" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center p-0.5 border border-neutral-200">
                    <AnimatedLogoMark size={28} loop={true} />
                  </div>
                </div>
              </div>
              <div>
                <span className="text-sm font-extrabold text-white block">Scan to Install Mobile App</span>
                <span className="text-xs text-neutral-400 mt-0.5 block">Available on App Store &amp; Google Play</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT MEMBERSHIP TIERS (Clean Modern Cards — No Cheesy Gradients) */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF8E6] text-[#A06E00] text-xs font-bold mb-3">
            <Award className="w-3.5 h-3.5" /> For Local Business Owners
          </div>
          <h2 className="text-3xl font-extrabold text-[#17181C] tracking-tight">
            Simple, Transparent Membership Plans
          </h2>
          <p className="text-base text-[#687182] mt-2">
            No long-term contracts. Transparent pricing with instant WhatsApp onboarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Basic Tier */}
          <Card padding="lg" className="flex flex-col justify-between border border-[#E3E8EF] shadow-card bg-white">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-[#17181C]">Basic</span>
                <TierBadge tier="basic" />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-black text-[#17181C]">₹999</span>
                <span className="text-sm text-[#687182]"> / month</span>
              </div>
              <p className="text-xs text-[#687182] mb-6">
                For neighborhood retail shops and home businesses entering digital discovery.
              </p>
              <ul className="space-y-3 mb-8 text-xs text-[#4A5260]">
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Hyperlocal map &amp; feed listing
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Digital visiting card (<code className="text-[11px] font-mono">/card/[slug]</code>)
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Auto-branded Festival Banners
                </li>
                <li className="flex items-center gap-2 text-[#9AA4B2] line-through">
                  Custom weekly/daily banners
                </li>
                <li className="flex items-center gap-2 text-[#9AA4B2] line-through">
                  Green "Trusted" verified badge
                </li>
                <li className="flex items-center gap-2 text-[#9AA4B2] line-through">
                  Story privileges &amp; Microsite
                </li>
              </ul>
            </div>
            <Link href="/login">
              <Button variant="secondary" size="md" className="w-full font-bold">
                Get Basic Listing
              </Button>
            </Link>
          </Card>

          {/* Premium Tier */}
          <Card padding="lg" className="flex flex-col justify-between border-2 border-[#4787F2] shadow-xl relative bg-white">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#4787F2] text-white text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-sm">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-[#17181C]">Premium</span>
                <TierBadge tier="premium" />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-black text-[#17181C]">₹2,499</span>
                <span className="text-sm text-[#687182]"> / month</span>
              </div>
              <p className="text-xs text-[#687182] mb-6">
                For established outlets seeking verified credibility and consistent marketing.
              </p>
              <ul className="space-y-3 mb-8 text-xs text-[#17181C]">
                <li className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Everything in Basic included
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> 2 Custom Banners every week
                </li>
                <li className="flex items-center gap-2 font-bold text-[#1B6A2D]">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Green "Trusted" verified badge
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Priority search ranking in pincode
                </li>
                <li className="flex items-center gap-2 text-[#9AA4B2] line-through font-normal">
                  Daily banners &amp; Microsite
                </li>
                <li className="flex items-center gap-2 text-[#9AA4B2] line-through font-normal">
                  Story publishing privileges
                </li>
              </ul>
            </div>
            <Link href="/login">
              <Button variant="primary" size="md" className="w-full font-bold">
                Upgrade to Premium
              </Button>
            </Link>
          </Card>

          {/* Elite Tier */}
          <Card padding="lg" className="flex flex-col justify-between border border-[#981837]/30 shadow-card bg-white">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-[#17181C]">Elite</span>
                <TierBadge tier="elite" />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-black text-[#17181C]">₹4,999</span>
                <span className="text-sm text-[#687182]"> / month</span>
              </div>
              <p className="text-xs text-[#687182] mb-6">
                For flagship boutiques, jewellers, and prominent multi-store brands.
              </p>
              <ul className="space-y-3 mb-8 text-xs text-[#17181C]">
                <li className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Everything in Premium included
                </li>
                <li className="flex items-center gap-2 font-bold text-[#981837]">
                  <CheckCircle2 className="w-4 h-4 text-[#981837] flex-shrink-0" /> Daily Custom Banners
                </li>
                <li className="flex items-center gap-2 font-bold text-[#981837]">
                  <CheckCircle2 className="w-4 h-4 text-[#981837] flex-shrink-0" /> Full Dedicated Microsite (<code className="text-[11px] font-mono">/b/[slug]</code>)
                </li>
                <li className="flex items-center gap-2 font-bold text-[#4787F2]">
                  <CheckCircle2 className="w-4 h-4 text-[#4787F2] flex-shrink-0" /> Elite-only Stories (max 1/day)
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Signature Spot Ring profile border
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Top category spotlight placement
                </li>
              </ul>
            </div>
            <Link href="/login">
              <Button variant="crimson" size="md" className="w-full font-bold">
                Get Elite Presence
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* 7. PLATFORM ECOSYSTEM & PORTALS */}
      <section id="roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        <div className="bg-white rounded-3xl border border-[#E3E8EF] p-8 sm:p-10 shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E3E8EF]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF4FF] text-[#1D53B8] text-xs font-bold mb-2">
                <Users className="w-3.5 h-3.5 text-[#4787F2]" /> Unified Platform Ecosystem
              </div>
              <h2 className="text-2xl font-black text-[#17181C]">Built for Every Stakeholder</h2>
              <p className="text-xs text-[#687182] mt-0.5">
                From local shoppers to merchants and field sales networks across India.
              </p>
            </div>
            <Link href="/login">
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Sign In to Your Account
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-8">
            <div className="p-5 rounded-2xl border border-[#E3E8EF] bg-[#F4F6FB]/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#4787F2] flex items-center justify-center font-bold">
                🛍️
              </div>
              <h3 className="text-sm font-bold text-[#17181C]">Local Consumers</h3>
              <p className="text-xs text-[#687182] leading-relaxed">
                Discover trending neighborhood shops, claim 24-hour festival spotlight deals, and pay with UPI wallet.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#E3E8EF] bg-[#F4F6FB]/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#F2B604] flex items-center justify-center font-bold">
                🏬
              </div>
              <h3 className="text-sm font-bold text-[#17181C]">Verified Merchants</h3>
              <p className="text-xs text-[#687182] leading-relaxed">
                Manage business microsites, publish daily branded banners, and engage local shoppers directly via WhatsApp.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#E3E8EF] bg-[#F4F6FB]/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#35AB4E] flex items-center justify-center font-bold">
                🚀
              </div>
              <h3 className="text-sm font-bold text-[#17181C]">Sales Managers (SM)</h3>
              <p className="text-xs text-[#687182] leading-relaxed">
                Field app with GPS check-in, pincode lead pipelines, owner instant onboarding, and daily target rings.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#E3E8EF] bg-[#F4F6FB]/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#981837] flex items-center justify-center font-bold">
                📊
              </div>
              <h3 className="text-sm font-bold text-[#17181C]">RO, ZO &amp; Admin</h3>
              <p className="text-xs text-[#687182] leading-relaxed">
                City-wide hierarchy oversight, commission management, content moderation, and real-time revenue analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PROFESSIONAL CLEAN FOOTER */}
      <footer className="bg-[#17181C] text-white pt-14 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-neutral-800">
          <div>
            <div className="mb-4">
              <Logo size="lg" withText={true} dark={true} />
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Hyperlocal discovery and marketing platform connecting local consumers, shops, and field sales teams across India.
            </p>
            <p className="text-xs text-neutral-400">© 2026 Adsspot India. All rights reserved.</p>
          </div>


          <div>
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-4">Active Cities</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">Mumbai (South, West, Central)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Delhi NCR (Central, South, East)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bengaluru (Indiranagar, Koramangala)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ahmedabad (Navrangpura, Bodakdev)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-4">For Businesses</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link href="/login" className="hover:text-white transition-colors">List Your Business</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing &amp; Plans</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Merchant Portal</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sales Manager Check-in</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-4">Platform &amp; Legal</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Merchant Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security &amp; RLS Policies</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <span>Unified Backend • Supabase PostgreSQL • Razorpay • Turborepo Strict TS</span>
          <span className="text-neutral-400">Made with ❤️ for Indian Hyperlocal Commerce</span>
        </div>
      </footer>
    </div>
  );
}
