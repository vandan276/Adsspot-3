'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SEED_BUSINESSES, SEED_CATEGORIES } from '@adsspot/api';
import { Button, Avatar, TrustedBadge, TierBadge, Logo, AnimatedLogoMark, AdsspotBrandLine } from '@adsspot/ui';

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
  Zap,
  Clock,
  ChevronRight,
  Download,
  CheckCircle2,
} from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState('Vadodara');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [onlyHighRated, setOnlyHighRated] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedBusinessDetail, setSelectedBusinessDetail] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    // 📱 Mobile Redirect: On mobile screens (<768px), redirect directly to /feed for authentic app UX
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      router.replace('/feed');
    }
  }, [router]);

  const filteredBusinesses = (SEED_BUSINESSES || []).filter((b) => {
    if (!b) return false;
    const name = (b.name || '').toLowerCase();
    const desc = (b.description || '').toLowerCase();
    const addr = (b.address || '').toLowerCase();
    const q = searchQuery.trim().toLowerCase();
    const matchesCat = selectedCategory === 'all' || b.category_id === selectedCategory;
    const matchesSearch =
      q === '' ||
      name.includes(q) ||
      desc.includes(q) ||
      addr.includes(q);
    const matchesRating = !onlyHighRated || ((b.stats?.avg_rating || 0) >= 4.5);
    const matchesVerified = !onlyVerified || Boolean(b.trusted);
    const matchesOpen = !onlyOpenNow || b.status === 'active';
    return matchesCat && matchesSearch && matchesRating && matchesVerified && matchesOpen;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusinessDetail) return;
    
    fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'review',
        userId: 'usr-consumer-1',
        businessId: selectedBusinessDetail.id,
        rating: reviewRating,
        content: reviewComment,
      }),
    }).catch(() => {});

    showToast('⭐ Thank you! Your review has been published.');
    setReviewComment('');
    setSelectedBusinessDetail(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6FB] dark:bg-[#0B0E14] min-h-screen relative transition-colors">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#17181C] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700 animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#F2B604]" />
          {toastMessage}
        </div>
      )}

      {/* 🌟 BUSINESS DETAIL & REVIEW MODAL DRAWER */}
      {selectedBusinessDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="ios-glass-card bg-white dark:bg-[#121620] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#E3E8EF] dark:border-white/10 max-h-[90vh] flex flex-col animate-scale-up">
            {/* Header Image */}
            <div className="relative h-44 bg-neutral-900 shrink-0">
              <img
                src={selectedBusinessDetail.cover_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'}
                alt={selectedBusinessDetail.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedBusinessDetail(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <Avatar src={selectedBusinessDetail.logo_url} name={selectedBusinessDetail.name} size="md" isElite={selectedBusinessDetail.tier === 'elite'} />
                <div className="text-white drop-shadow-md">
                  <h3 className="text-base font-black leading-tight flex items-center gap-1.5">
                    <span>{selectedBusinessDetail.name}</span>
                    {selectedBusinessDetail.trusted && <TrustedBadge size="sm" />}
                  </h3>
                  <span className="text-[11px] text-neutral-200">{selectedBusinessDetail.address}</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Quick Actions Grid */}
              <div className="grid grid-cols-4 gap-2">
                <a
                  href={`tel:${selectedBusinessDetail.phone}`}
                  className="py-2.5 px-2 rounded-2xl bg-[#EDF4FF] dark:bg-[#4787F2]/15 text-[#4787F2] flex flex-col items-center justify-center gap-1 text-[11px] font-bold hover:bg-[#D9E8FF] transition-all"
                >
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a
                  href={`https://wa.me/${(selectedBusinessDetail.whatsapp || selectedBusinessDetail.phone || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedBusinessDetail.name || 'Store')},%20I%20saw%20your%20store%20on%20Adsspot.`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-2 rounded-2xl bg-[#EBF9EE] dark:bg-[#13301D] text-[#35AB4E] dark:text-[#4ade80] flex flex-col items-center justify-center gap-1 text-[11px] font-bold hover:bg-[#d9f5de] transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedBusinessDetail.lat},${selectedBusinessDetail.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-2 rounded-2xl bg-[#FFF8E6] dark:bg-[#2A2008] text-[#A06E00] dark:text-[#FDE047] flex flex-col items-center justify-center gap-1 text-[11px] font-bold hover:bg-[#feeebb] transition-all"
                >
                  <MapPin className="w-4 h-4" /> Directions
                </a>
                <Link
                  href={`/card/${selectedBusinessDetail.slug}`}
                  className="py-2.5 px-2 rounded-2xl bg-[#F4F6FB] dark:bg-white/10 text-[#17181C] dark:text-white flex flex-col items-center justify-center gap-1 text-[11px] font-bold hover:bg-[#E3E8EF] transition-all"
                >
                  <QrCode className="w-4 h-4" /> Card
                </Link>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#17181C] dark:text-white uppercase tracking-wider mb-1">About Store</h4>
                <p className="text-xs text-[#4A5260] dark:text-neutral-300 leading-relaxed">
                  {selectedBusinessDetail.description}
                </p>
              </div>

              {/* Working Hours */}
              <div className="p-3 bg-[#F4F6FB] dark:bg-white/5 rounded-2xl flex items-center justify-between text-xs">
                <span className="font-bold text-[#17181C] dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#35AB4E]" /> Operating Hours:
                </span>
                <span className="text-[#35AB4E] dark:text-[#4ade80] font-black">Open 10:00 AM – 10:30 PM</span>
              </div>

              {/* Write Review Form */}
              <form onSubmit={handleSubmitReview} className="pt-2 border-t border-[#E3E8EF] dark:border-white/10 space-y-2.5">
                <h4 className="text-xs font-bold text-[#17181C] dark:text-white uppercase tracking-wider">Leave a Star Review</h4>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-xl transition-transform hover:scale-125 ${
                        star <= reviewRating ? 'text-amber-400' : 'text-neutral-300 dark:text-neutral-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 ml-2">{reviewRating} out of 5 Stars</span>
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience (quality, service, recommendations)..."
                  rows={2}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#E3E8EF] dark:border-white/15 bg-white dark:bg-[#1A2130] text-[#17181C] dark:text-white outline-none focus:border-[#4787F2]"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-[#4787F2] hover:bg-[#3373E0] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                >
                  Publish Verified Review
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 1. MODERN CONSUMER HERO & SEARCH SECTION */}
      <section className="bg-white dark:bg-[#0B0E14] border-b border-[#E3E8EF] dark:border-white/10 pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Prominent Brand Showcase */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="p-3 sm:p-4 rounded-3xl bg-gradient-to-b from-[#EDF4FF] to-white dark:from-[#172033] dark:to-[#121620] border border-[#4787F2]/20 shadow-lg shadow-[#4787F2]/10 mb-4 transform hover:scale-105 transition-transform flex flex-col items-center gap-2">
              <Logo size={78} withText={true} animated={true} />
              <AdsspotBrandLine width={220} className="mt-1" />
            </div>
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDF4FF] dark:bg-[#4787F2]/15 border border-[#4787F2]/20">
              <span className="w-2 h-2 rounded-full bg-[#4787F2] animate-ping" />
              <span className="text-xs font-bold text-[#1D53B8] dark:text-[#93C5FD]">
                India's Hyperlocal Neighborhood Discovery Platform
              </span>
            </div>
          </div>

          {/* Clean, High-Contrast Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#17181C] dark:text-white tracking-tight leading-[1.08] max-w-4xl mx-auto mb-4">
            Discover the best of your neighborhood in real time.
          </h1>

          <p className="text-base sm:text-lg text-[#4A5260] dark:text-neutral-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            Explore verified local boutiques, authentic Gujarati sweets, daily festival banners, and trending offers right in your pincode.
          </p>

          {/* Interactive Search Bar — iOS Glass Capsule */}
          <div className="max-w-3xl mx-auto ios-glass-card rounded-2xl p-2.5 flex flex-col sm:flex-row items-center gap-2 mb-6 border border-white/80 dark:border-white/10 shadow-[0_15px_35px_-5px_rgba(71,135,242,0.12)]">
            {/* Location Selector */}
            <div className="flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-[#E3E8EF] dark:border-white/10 w-full sm:w-auto flex-shrink-0 text-left">
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
                className="bg-transparent text-sm font-bold text-[#17181C] dark:text-white outline-none cursor-pointer"
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
              <Search className="w-4 h-4 text-[#687182] dark:text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewellery, sweets, cafes, salons, electronics..."
                className="w-full bg-transparent text-sm text-[#17181C] dark:text-white placeholder-[#687182] dark:placeholder-neutral-500 outline-none font-medium py-1.5"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs text-neutral-400 hover:text-neutral-600">✕</button>
              )}
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

          {/* Real-time Quick Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
            <button
              onClick={() => setOnlyOpenNow(!onlyOpenNow)}
              className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                onlyOpenNow
                  ? 'bg-[#35AB4E] text-white border-[#35AB4E] shadow-xs'
                  : 'bg-white dark:bg-[#121620] text-neutral-700 dark:text-neutral-300 border-[#E3E8EF] dark:border-white/10 hover:border-[#35AB4E]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Open Now</span>
            </button>
            <button
              onClick={() => setOnlyHighRated(!onlyHighRated)}
              className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                onlyHighRated
                  ? 'bg-amber-400 text-black border-amber-400 shadow-xs'
                  : 'bg-white dark:bg-[#121620] text-neutral-700 dark:text-neutral-300 border-[#E3E8EF] dark:border-white/10 hover:border-amber-400'
              }`}
            >
              <span>★ 4.5+ Rating</span>
            </button>
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                onlyVerified
                  ? 'bg-[#4787F2] text-white border-[#4787F2] shadow-xs'
                  : 'bg-white dark:bg-[#121620] text-neutral-700 dark:text-neutral-300 border-[#E3E8EF] dark:border-white/10 hover:border-[#4787F2]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Trusted</span>
            </button>
            <Link
              href="/b2b"
              className="px-3 py-1.5 rounded-full bg-[#FFF1EE] dark:bg-[#2A1016] text-[#E14D2A] dark:text-rose-400 border border-[#E14D2A]/30 flex items-center gap-1 hover:bg-[#FFE4DE] transition-all"
            >
              <span>B2B Factory Direct</span>
              <span className="bg-[#E14D2A] text-white text-[8px] px-1 rounded-full">1Cr+</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#17181C] dark:text-white">Explore Popular Categories</h2>
            <p className="text-sm text-[#687182] dark:text-neutral-400 mt-0.5">Top-rated shops and local service providers in your neighborhood</p>
          </div>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#4787F2] text-white border-[#4787F2]'
                : 'bg-white dark:bg-[#121620] text-[#4A5260] dark:text-neutral-300 border-[#E3E8EF] dark:border-white/10 hover:border-[#4787F2]'
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
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl text-center transition-all ios-glass-card ${
                  isSelected
                    ? 'border-[#4787F2] ring-2 ring-[#4787F2]/20 shadow-md scale-105'
                    : 'hover:-translate-y-1'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5 font-bold transition-all shadow-xs ${
                    isSelected ? 'bg-[#4787F2] text-white' : 'bg-[#EDF4FF] dark:bg-[#4787F2]/20 text-[#4787F2]'
                  }`}
                >
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#17181C] dark:text-white leading-tight">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. TRENDING NEARBY BUSINESSES SHOWCASE (With Real Actions: Call, WhatsApp, Directions, Card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#35AB4E] dark:text-[#4ade80] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Showing {filteredBusinesses.length} Verified Spots in {selectedCity}
            </div>
            <h2 className="text-2xl font-bold text-[#17181C] dark:text-white">Featured Local Merchants</h2>
          </div>
          <Link href="/explore">
            <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
              Open Split Map View
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBusinesses.map((biz) => {
            return (
              <div
                key={biz.id}
                className="ios-glass-card rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group"
              >
                <div onClick={() => setSelectedBusinessDetail(biz)} className="cursor-pointer">
                  {/* Business Cover Photo */}
                  <div className="relative h-48 bg-neutral-200 dark:bg-neutral-900 overflow-hidden">
                    <img
                      src={biz.cover_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'}
                      alt={biz.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <TierBadge tier={biz.tier} size="sm" />
                      {biz.trusted && <TrustedBadge size="sm" />}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#17181C] dark:text-white shadow-sm flex items-center gap-1 border border-white/60 dark:border-white/10">
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
                        <h3 className="text-base font-bold text-[#17181C] dark:text-white truncate group-hover:text-[#4787F2] transition-colors">
                          {biz.name}
                        </h3>
                        <p className="text-xs text-[#687182] dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#4787F2] flex-shrink-0" />
                          <span className="truncate">{biz.address}</span>
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#4A5260] dark:text-neutral-300 line-clamp-2 leading-relaxed mb-4">
                      {biz.description}
                    </p>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-[#F4F6FB] dark:bg-white/5 border border-[#E3E8EF] dark:border-white/10 mb-4">
                      <span className="font-semibold text-[#17181C] dark:text-white flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {biz.stats?.avg_rating || '4.9'} ({biz.stats?.reviews_count || '120'} reviews)
                      </span>
                      <span className="text-[#4787F2] font-semibold">📍 0.4 km away</span>
                    </div>
                  </div>
                </div>

                {/* Real-World 4 Action Buttons: Call, WhatsApp, Directions, Card */}
                <div className="p-4 pt-0 grid grid-cols-4 gap-1.5">
                  <a
                    href={`tel:${biz.phone}`}
                    className="flex items-center justify-center gap-1 py-2 px-1 rounded-xl border border-[#E3E8EF] dark:border-white/10 text-xs font-bold text-[#17181C] dark:text-white hover:bg-[#F4F6FB] dark:hover:bg-white/10 transition-colors text-center"
                    title="Direct Phone Call"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#4787F2]" />
                    <span className="hidden sm:inline">Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${(biz.whatsapp || biz.phone || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(biz.name || 'Store')},%20I%20saw%20your%20store%20on%20Adsspot.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 py-2 px-1 rounded-xl border border-[#35AB4E] bg-[#EBF9EE] dark:bg-[#13301D] text-xs font-bold text-[#1B6A2D] dark:text-[#4ade80] hover:bg-[#d9f5de] transition-colors text-center"
                    title="Chat on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#35AB4E]" />
                    <span className="hidden sm:inline">Chat</span>
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${biz.lat},${biz.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 py-2 px-1 rounded-xl border border-[#F2B604]/40 bg-[#FFF8E6] dark:bg-[#2A2008] text-xs font-bold text-[#A06E00] dark:text-[#FDE047] hover:bg-[#feeebb] transition-colors text-center"
                    title="Google Maps Directions"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">GPS</span>
                  </a>
                  <Link
                    href={`/card/${biz.slug}`}
                    className="flex items-center justify-center gap-1 py-2 px-1 rounded-xl bg-[#4787F2] text-xs font-bold text-white hover:bg-[#3373E0] transition-colors text-center shadow-xs"
                    title="Digital Visiting Card"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Card</span>
                  </Link>
                </div>
              </div>
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

      {/* 5. APP DOWNLOAD CTA SECTION — Pure 3D Liquid Glass Card on Clean Canvas */}
      <section id="mobile-app" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative">
        {/* Authentic 3D Liquid Glass Pill Container Directly on Clean Canvas */}
        <div className="pure-liquid-glass-card p-8 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
          {/* Notification Badge Bubble (Matching "12" Red Bubble in Reference) */}
          <div className="absolute -top-2 -right-2 sm:top-6 sm:right-8 liquid-glass-badge w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shadow-xl z-20">
            NEW
          </div>

          <div className="max-w-xl z-10 space-y-6">
            <div className="flex items-center gap-3">
              <Logo size={46} withText={true} />
            </div>

            {/* Liquid Glass Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full pure-liquid-glass text-[#17181C] text-xs font-black shadow-xs">
              <Smartphone className="w-3.5 h-3.5 text-[#4787F2]" />
              <span>Free Mobile App for iOS &amp; Android</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#17181C] tracking-tight leading-[1.08] font-['Plus_Jakarta_Sans',sans-serif]">
              Take Adsspot with you everywhere you go.
            </h2>

            <p className="text-sm sm:text-base text-[#4A5260] leading-relaxed font-semibold">
              Explore live shop maps with category sheets, watch Elite 24-hour stories, manage your hyperlocal wallet, and book local event tickets with QR codes.
            </p>

            {/* Pure Liquid Glass Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/download"
                className="pure-liquid-glass inline-flex items-center gap-3 text-[#17181C] px-8 py-3.5 text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-md bg-white/70 hover:bg-white/90"
              >
                <Download className="w-4 h-4 text-[#4787F2] stroke-[2.5]" />
                <span>Download for iOS</span>
              </Link>
              <Link
                href="/download"
                className="pure-liquid-glass inline-flex items-center gap-3 text-[#17181C] px-8 py-3.5 text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-md bg-white/40 hover:bg-white/60"
              >
                <Download className="w-4 h-4 text-[#35AB4E] stroke-[2.5]" />
                <span>Download for Android</span>
              </Link>
            </div>
          </div>

          {/* Liquid Glass QR Code Capsule with Curved Specular Border */}
          <div className="w-full lg:w-auto flex-shrink-0 flex items-center justify-center z-10">
            <div className="pure-liquid-glass-card p-7 flex flex-col items-center gap-4 max-w-[290px] text-center shadow-xl relative overflow-hidden bg-white/50">
              <div className="relative w-44 h-44 bg-white/95 rounded-[22px] p-2.5 flex items-center justify-center shadow-md border border-white">
                <QrCode className="w-40 h-40 text-[#17181C]" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-11 h-11 rounded-2xl bg-white shadow-xl flex items-center justify-center p-1 border border-neutral-200">
                    <AnimatedLogoMark size={30} loop={true} />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm font-black text-[#17181C] block tracking-tight">Scan to Install Mobile App</span>
                <span className="text-xs text-[#687182] mt-1 block font-semibold">Available on App Store &amp; Google Play</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT MEMBERSHIP TIERS WITH 50% LAUNCH DISCOUNT */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 w-full scroll-mt-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#981837]/10 via-[#F2B604]/20 to-[#35AB4E]/10 border border-[#F2B604]/40 text-[#981837] text-xs font-black mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B604] animate-spin" />
            <span>🔥 SPECIAL LAUNCH OFFER • FLAT 50% DISCOUNT</span>
            <span className="px-2 py-0.5 rounded-full bg-[#981837] text-white text-[10px] uppercase tracking-wider font-extrabold">Save 50%</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#17181C] tracking-tight">
            Double the Reach at <span className="bg-gradient-to-r from-[#4787F2] via-[#35AB4E] to-[#981837] bg-clip-text text-transparent">50% Off</span>
          </h2>
          <p className="text-sm sm:text-base text-[#687182] mt-3 max-w-2xl mx-auto">
            Limited-time introductory pricing for local retail, dining, and service merchants. Lock in your 50% discount for life with zero lock-in contracts.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-[#EDF2F7] border border-[#E3E8EF] shadow-inner">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#17181C] shadow-md ring-1 ring-black/5'
                  : 'text-[#687182] hover:text-[#17181C]'
              }`}
            >
              Monthly Billing <span className="ml-1 text-[#35AB4E] font-black">(50% OFF)</span>
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-white text-[#17181C] shadow-md ring-1 ring-black/5'
                  : 'text-[#687182] hover:text-[#17181C]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#35AB4E] to-[#4787F2] text-white text-[10px] font-black">
                +2 Mos FREE
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* 1. BASIC TIER */}
          <div className="ios-glass-card rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border border-[#E3E8EF] bg-white/95 relative group">
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-full bg-red-50 text-[#981837] border border-red-200 text-[10px] font-black uppercase tracking-wider">
                50% OFF
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-black text-[#17181C]">Basic</span>
                <TierBadge tier="basic" size="sm" />
              </div>

              {/* Price Container */}
              <div className="mb-4 pb-4 border-b border-[#F4F6FB]">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-[#9AA4B2] line-through">
                    {billingCycle === 'monthly' ? '₹1,999' : '₹23,988'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#EBF9EE] text-[#35AB4E] text-[11px] font-black">
                    Save {billingCycle === 'monthly' ? '₹1,000/mo' : '₹14,000/yr'}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black text-[#17181C] tracking-tight">
                    {billingCycle === 'monthly' ? '₹999' : '₹833'}
                  </span>
                  <span className="text-xs font-semibold text-[#687182]">
                    / month {billingCycle === 'yearly' && '(billed ₹9,990/yr)'}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-[#35AB4E] mt-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Special 50% Launch Price
                </p>
              </div>

              <p className="text-xs text-[#687182] mb-6 leading-relaxed">
                For neighborhood retail shops and home businesses entering digital discovery.
              </p>

              <ul className="space-y-3 mb-8 text-xs text-[#4A5260]">
                <li className="flex items-center gap-2.5 font-semibold text-[#17181C]">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Hyperlocal map &amp; feed listing
                </li>
                <li className="flex items-center gap-2.5 font-semibold text-[#17181C]">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Digital visiting card (<code className="text-[11px] font-mono text-[#4787F2]">/card/[slug]</code>)
                </li>
                <li className="flex items-center gap-2.5 font-semibold text-[#17181C]">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Auto-branded Festival Banners (Logo &amp; Phone)
                </li>
                <li className="flex items-center gap-2.5 text-[#9AA4B2] line-through">
                  Custom weekly/daily banners
                </li>
                <li className="flex items-center gap-2.5 text-[#9AA4B2] line-through">
                  Green &quot;Trusted&quot; verified badge
                </li>
                <li className="flex items-center gap-2.5 text-[#9AA4B2] line-through">
                  Story privileges &amp; Microsite
                </li>
              </ul>
            </div>

            <Link href="/login" className="block">
              <Button variant="secondary" size="md" className="w-full font-black py-3 rounded-2xl shadow-sm hover:shadow group-hover:bg-[#17181C] group-hover:text-white transition-all">
                Claim 50% OFF • Get Basic
              </Button>
            </Link>
          </div>

          {/* 2. PREMIUM TIER (MOST POPULAR) */}
          <div className="ios-glass-card rounded-3xl p-7 flex flex-col justify-between relative ring-2 ring-[#35AB4E] shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/95 scale-102 z-10">
            {/* Top Ribbon */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#35AB4E] to-[#2E9644] text-white text-[11px] font-black uppercase tracking-wider px-5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F2B604]" /> MOST POPULAR • 50% OFF
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-[#17181C]">Premium</span>
                  <TierBadge tier="premium" size="sm" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#EBF9EE] text-[#1B6A2D] border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                  50% OFF
                </span>
              </div>

              {/* Price Container */}
              <div className="mb-4 pb-4 border-b border-[#F4F6FB]">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-[#9AA4B2] line-through">
                    {billingCycle === 'monthly' ? '₹4,999' : '₹59,988'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#EBF9EE] text-[#35AB4E] text-[11px] font-black">
                    Save {billingCycle === 'monthly' ? '₹2,500/mo' : '₹35,000/yr'}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black text-[#17181C] tracking-tight">
                    {billingCycle === 'monthly' ? '₹2,499' : '₹2,083'}
                  </span>
                  <span className="text-xs font-semibold text-[#687182]">
                    / month {billingCycle === 'yearly' && '(billed ₹24,990/yr)'}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-[#35AB4E] mt-1.5 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#F2B604] fill-[#F2B604]" /> Recommended for Established Retail Stores
                </p>
              </div>

              <p className="text-xs text-[#687182] mb-6 leading-relaxed">
                For established shops seeking local authority, weekly dynamic banners &amp; verified trust.
              </p>

              <ul className="space-y-3 mb-8 text-xs text-[#4A5260]">
                <li className="flex items-center gap-2.5 font-bold text-[#17181C]">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Everything in Basic
                </li>
                <li className="flex items-center gap-2.5 font-bold text-[#35AB4E]">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Green &quot;Trusted&quot; verified badge &amp; Spot Ring
                </li>
                <li className="flex items-center gap-2.5 font-semibold text-[#17181C]">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> 2 custom branded banners / week (104/yr)
                </li>
                <li className="flex items-center gap-2.5 font-semibold text-[#17181C]">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Customer photo review approvals &amp; moderation
                </li>
                <li className="flex items-center gap-2.5 font-semibold text-[#17181C]">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E] flex-shrink-0" /> Priority search &amp; feed ranking in your pincode
                </li>
                <li className="flex items-center gap-2.5 text-[#9AA4B2] line-through">
                  Daily banners &amp; Microsite
                </li>
              </ul>
            </div>

            <Link href="/login" className="block">
              <Button variant="primary" size="md" className="w-full font-black py-3 rounded-2xl bg-[#35AB4E] hover:bg-[#2E9644] text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all">
                Claim 50% OFF • Upgrade to Premium
              </Button>
            </Link>
          </div>

          {/* 3. ELITE TIER */}
          <div className="ios-glass-card rounded-3xl p-7 flex flex-col justify-between relative ring-2 ring-[#4787F2] shadow-2xl transition-all duration-300 hover:-translate-y-1.5 bg-white/95 group">
            {/* Top Ribbon */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#4787F2] to-[#3668C4] text-white text-[11px] font-black uppercase tracking-wider px-5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-[#F2B604]" /> COMPLETE DIGITAL ECOSYSTEM
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-[#17181C]">Elite</span>
                  <TierBadge tier="elite" size="sm" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#4787F2] border border-blue-200 text-[10px] font-black uppercase tracking-wider">
                  50% OFF
                </span>
              </div>

              {/* Price Container */}
              <div className="mb-4 pb-4 border-b border-[#F4F6FB]">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-[#9AA4B2] line-through">
                    {billingCycle === 'monthly' ? '₹9,999' : '₹1,19,988'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#EDF4FF] text-[#4787F2] text-[11px] font-black">
                    Save {billingCycle === 'monthly' ? '₹5,000/mo' : '₹70,000/yr'}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black text-[#17181C] tracking-tight">
                    {billingCycle === 'monthly' ? '₹4,999' : '₹4,166'}
                  </span>
                  <span className="text-xs font-semibold text-[#687182]">
                    / month {billingCycle === 'yearly' && '(billed ₹49,990/yr)'}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-[#4787F2] mt-1.5 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#F2B604]" /> Maximum Footfall &amp; Digital Authority
                </p>
              </div>

              <p className="text-xs text-[#687182] mb-6 leading-relaxed">
                Complete omnichannel digital identity for high-growth businesses and flagship retailers.
              </p>

              <ul className="space-y-3 mb-8 text-xs text-[#4A5260]">
                <li className="flex items-center gap-2.5 font-bold text-[#17181C]">
                  <CheckCircle2 className="w-4 h-4 text-[#4787F2] flex-shrink-0" /> Everything in Premium
                </li>
                <li className="flex items-center gap-2.5 font-bold text-[#4787F2]">
                  <CheckCircle2 className="w-4 h-4 text-[#4787F2] flex-shrink-0" /> Daily custom banners (365/yr branded with logo)
                </li>
                <li className="flex items-center gap-2.5 font-bold text-[#4787F2]">
                  <CheckCircle2 className="w-4 h-4 text-[#4787F2] flex-shrink-0" /> Standalone Microsite (<code className="text-[11px] font-mono text-[#4787F2]">/b/[slug]</code>)
                </li>
                <li className="flex items-center gap-2.5 font-bold text-[#4787F2]">
                  <CheckCircle2 className="w-4 h-4 text-[#4787F2] flex-shrink-0" /> 24h Story publishing privileges (Elite exclusive)
                </li>
                <li className="flex items-center gap-2.5 font-semibold text-[#17181C]">
                  <CheckCircle2 className="w-4 h-4 text-[#4787F2] flex-shrink-0" /> Event ticketing &amp; Spot Drop flash deals engine
                </li>
                <li className="flex items-center gap-2.5 font-semibold text-[#17181C]">
                  <CheckCircle2 className="w-4 h-4 text-[#4787F2] flex-shrink-0" /> Dedicated Account Manager &amp; priority phone support
                </li>
              </ul>
            </div>

            <Link href="/login" className="block">
              <Button variant="primary" size="md" className="w-full font-black py-3 rounded-2xl bg-gradient-to-r from-[#4787F2] to-[#3668C4] hover:from-[#3668C4] hover:to-[#2B54A3] text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                Claim 50% OFF • Get Elite Membership
              </Button>
            </Link>
          </div>
        </div>

        {/* Reassurance Guarantee Footer */}
        <div className="mt-12 p-5 rounded-2xl bg-white border border-[#E3E8EF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#4A5260] shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#35AB4E] flex-shrink-0" />
            <span><strong className="text-[#17181C]">100% Risk-Free:</strong> No long-term lock-in contracts. Cancel or upgrade tiers anytime from your Merchant Studio.</span>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0 text-[11px] text-[#687182]">
            <span>✓ Instant WhatsApp Activation</span>
            <span>✓ GST Invoicing Ready</span>
            <span>✓ Field Manager Assistance</span>
          </div>
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
