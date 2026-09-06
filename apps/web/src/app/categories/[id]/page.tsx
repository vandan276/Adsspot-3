'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { SEED_CATEGORIES, getAllBusinesses } from '@adsspot/api';
import { StorySpotRing, TrustedBadge } from '@adsspot/ui';
import {
  ArrowLeft,
  Search,
  MapPin,
  Phone,
  Sparkles,
  ExternalLink,
  Crown,
  ShieldCheck,
} from 'lucide-react';

const WhatsAppIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryParam = String(params.id || '');

  const [category, setCategory] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'elite' | 'premium' | 'trusted'>('all');

  useEffect(() => {
    const normalizedParam = categoryParam.toLowerCase().trim();
    const catMatch = SEED_CATEGORIES.find(
      (c) =>
        c.id.toLowerCase() === normalizedParam ||
        c.slug.toLowerCase() === normalizedParam ||
        c.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === normalizedParam ||
        c.name.toLowerCase() === normalizedParam.replace(/-/g, ' ')
    ) || {
      id: categoryParam,
      name: categoryParam.replace(/^(cat-|category-)/i, '').replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      slug: categoryParam,
    };
    setCategory(catMatch);

    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch('/api/merchants');
        const data = await res.json();
        let list: any[] = [];

        if (data && data.merchants && Array.isArray(data.merchants)) {
          list = data.merchants;
        }

        if (list.length === 0) {
          list = await getAllBusinesses();
        }

        const catTargetIds = new Set([
          catMatch.id.toLowerCase(),
          catMatch.slug.toLowerCase(),
          categoryParam.toLowerCase(),
          categoryParam.toLowerCase().replace(/^(cat-|category-)/i, ''),
        ]);

        const filtered = list.filter((b) => {
          if (!b) return false;
          if (categoryParam === 'all') return true;

          const bCatId = (b.category_id || b.categoryId || '').toString().toLowerCase();
          const bCatSlug = (b.category?.slug || '').toLowerCase();
          const bCatName = (b.category_name || b.category?.name || '').toLowerCase();
          const catNameLower = (catMatch.name || '').toLowerCase();

          return (
            catTargetIds.has(bCatId) ||
            catTargetIds.has(bCatSlug) ||
            bCatId === catMatch.id.toLowerCase() ||
            (bCatName && catNameLower && (bCatName.includes(catNameLower) || catNameLower.includes(bCatName))) ||
            (bCatId && normalizedParam && bCatId.replace(/[^a-z0-9]/g, '') === normalizedParam.replace(/[^a-z0-9]/g, ''))
          );
        });

        setBusinesses(filtered);
      } catch (err) {
        console.error('Failed to load category merchants:', err);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [categoryParam]);

  const filteredMerchants = businesses.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      (b.description || '').toLowerCase().includes(q) ||
      (b.address || '').toLowerCase().includes(q) ||
      (b.pincode || '').includes(q);

    const matchesTier =
      tierFilter === 'all' ||
      (tierFilter === 'elite' && b.tier === 'elite') ||
      (tierFilter === 'premium' && (b.tier === 'premium' || b.tier === 'elite')) ||
      (tierFilter === 'trusted' && b.trusted);

    return matchesSearch && matchesTier;
  });

  const sponsoredAds = businesses.filter((b) => b.tier === 'elite' || b.trusted).slice(0, 2);

  return (
    <div className="flex-1 bg-[#F4F6FB] min-h-screen pb-24">

      {/* Category Header */}
      <div className="bg-white border-b border-[#E3E8EF] sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-[#F4F6FB] hover:bg-[#E2E8F0] flex items-center justify-center text-[#17181C] transition-colors cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-[#17181C] tracking-tight">
                  {category?.name || 'Category Overview'}
                </h1>
                <span className="text-[10px] font-extrabold bg-[#EDF4FF] text-[#4787F2] px-2 py-0.5 rounded-full border border-[#4787F2]/20">
                  {businesses.length} {businesses.length === 1 ? 'Store' : 'Stores'}
                </span>
              </div>
              <p className="text-xs text-[#687182] hidden sm:block">
                Discover trusted hyperlocal shops, doctors &amp; service providers in {category?.name}.
              </p>
            </div>
          </div>

          <Link
            href="/onboard"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#4787F2] hover:bg-[#3373E0] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>List Your Business</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* =========================================================================
            1. TOP SPONSORED ADS BANNER SPACE (Compact Reserved Space for Category Ads)
            ========================================================================= */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#17181C] via-[#232B40] to-[#17181C] text-white p-3.5 sm:p-4 shadow-md border border-white/10">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F2B604] text-[#17181C] text-[9px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> SPONSORED AD BANNER
              </span>
              <span className="text-[11px] text-neutral-300 font-medium hidden sm:inline">
                Promoted {category?.name || 'Category'} Partners
              </span>
            </div>

            <Link
              href="/onboard"
              className="text-[10px] font-extrabold text-[#4787F2] hover:underline flex items-center gap-1 bg-[#4787F2]/10 px-2.5 py-1 rounded-full border border-[#4787F2]/30"
            >
              <span>Advertise Your Store Here</span>
              <span>→</span>
            </Link>
          </div>

          {/* Sleek Horizontal Sponsored Ad Banner Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(sponsoredAds.length > 0 ? sponsoredAds : [
              {
                id: 'sp-1',
                name: 'Kundan Jewellers & Gold',
                slug: 'kundan-jewellers',
                tier: 'elite',
                trusted: true,
                address: 'Alkapuri Main Rd, Vadodara',
                cover_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
                logo_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&auto=format&fit=crop&q=80',
              },
              {
                id: 'sp-2',
                name: 'Royal Heritage Thali & Dining',
                slug: 'royal-heritage-thali',
                tier: 'elite',
                trusted: true,
                address: 'Race Course Circle, Vadodara',
                cover_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
                logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
              },
            ]).map((ad, idx) => (
              <div
                key={ad.id || idx}
                className="relative rounded-xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#4787F2]/60 transition-all p-2.5 flex gap-3 items-center group cursor-pointer"
                onClick={() => router.push(ad.tier === 'elite' ? `/b/${ad.slug || 'store-1'}` : `/card/${ad.slug || 'store-1'}`)}
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                  <img
                    src={ad.logo_url || ad.cover_url}
                    alt={ad.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-0.5 left-0.5 bg-[#4787F2] text-white text-[8px] font-black px-1 rounded">
                    AD
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <h3 className="text-xs font-extrabold text-white truncate group-hover:text-[#4787F2] transition-colors">
                      {ad.name}
                    </h3>
                    <TrustedBadge size="sm" />
                  </div>
                  <p className="text-[10px] text-neutral-300 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-[#F2B604] shrink-0" />
                    <span>{ad.address}</span>
                  </p>
                  <span className="inline-block text-[9px] font-extrabold text-[#35AB4E] bg-[#35AB4E]/20 px-2 py-0.2 rounded-full border border-[#35AB4E]/30">
                    Featured Partner
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            2. SEARCH & TIER FILTER CONTROLS
            ========================================================================= */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E3E8EF] space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search input within category */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${category?.name || 'category'}...`}
                className="w-full bg-[#F4F6FB] border border-[#E3E8EF] rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-[#17181C] placeholder:text-neutral-400 outline-none focus:border-[#4787F2] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold hover:text-neutral-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setTierFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  tierFilter === 'all'
                    ? 'bg-[#17181C] text-white shadow-xs'
                    : 'bg-[#F4F6FB] text-[#687182] hover:bg-[#E2E8F0]'
                }`}
              >
                All Stores ({businesses.length})
              </button>

              <button
                onClick={() => setTierFilter('trusted')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                  tierFilter === 'trusted'
                    ? 'bg-[#35AB4E] text-white shadow-xs'
                    : 'bg-[#F4F6FB] text-[#35AB4E] hover:bg-[#EBF9F3]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Trusted</span>
              </button>

              <button
                onClick={() => setTierFilter('elite')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                  tierFilter === 'elite'
                    ? 'bg-[#8338EC] text-white shadow-xs'
                    : 'bg-[#F4F6FB] text-[#8338EC] hover:bg-[#F5EEFD]'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Elite Tier</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. MERCHANTS / USERS LIST GRID
            ========================================================================= */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 space-y-3 animate-pulse border border-[#E3E8EF]">
                <div className="h-32 bg-neutral-200 rounded-xl" />
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                <div className="h-3 bg-neutral-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredMerchants.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#E3E8EF] space-y-4 max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-[#EDF4FF] text-[#4787F2] flex items-center justify-center mx-auto text-2xl">
              🏪
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#17181C]">No Stores in {category?.name || 'Category'} Yet</h3>
              <p className="text-xs text-[#687182] mt-1">
                Be the first store owner to list your business under {category?.name}!
              </p>
            </div>
            <Link
              href="/onboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#4787F2] hover:bg-[#3373E0] text-white text-xs font-extrabold transition-all shadow-md active:scale-95"
            >
              <span>Register Business Now</span>
              <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMerchants.map((biz) => {
              const slug = biz.slug || biz.id;
              const isElite = biz.tier === 'elite';
              const isPremium = biz.tier === 'premium';
              const isTrusted = biz.trusted !== false;
              const destinationUrl = isElite ? `/b/${slug}` : `/card/${slug}`;

              return (
                <div
                  key={biz.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E3E8EF] hover:border-[#4787F2] hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  {/* Clickable Header & Cover to open Business Page */}
                  <div
                    className="cursor-pointer"
                    onClick={() => router.push(destinationUrl)}
                  >
                    {/* Cover Image & Badges */}
                    <div className="relative h-36 bg-neutral-100 overflow-hidden">
                      <img
                        src={biz.cover_url || biz.logo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80'}
                        alt={biz.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Tier Badge */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        {isElite && (
                          <span className="bg-[#8338EC] text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Crown className="w-3 h-3" /> ELITE
                          </span>
                        )}
                        {isPremium && (
                          <span className="bg-[#F2B604] text-[#17181C] text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            ★ PREMIUM
                          </span>
                        )}
                      </div>

                      {/* Distance / Location Tag */}
                      <span className="absolute bottom-2 left-2.5 text-white text-[10px] font-bold flex items-center gap-1 drop-shadow-md">
                        <MapPin className="w-3 h-3 text-[#F2B604]" />
                        <span>{biz.pincode || 'Vadodara'}</span>
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-3.5 space-y-2">
                      <div className="flex items-start gap-2.5">
                        <div className="shrink-0 -mt-7 relative">
                          <StorySpotRing
                            size={44}
                            imageSrc={biz.logo_url || biz.cover_url}
                            alt={biz.name}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <h3 className="text-sm font-extrabold text-[#17181C] truncate leading-tight group-hover:text-[#4787F2] transition-colors">
                              {biz.name}
                            </h3>
                            {isTrusted && <TrustedBadge size="sm" />}
                          </div>
                          <p className="text-[11px] text-[#687182] truncate mt-0.5">
                            {biz.address || 'Hyperlocal Verified Merchant'}
                          </p>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#4A5260] line-clamp-2 leading-relaxed">
                        {biz.description || 'Verified local business offering premium products & services with direct WhatsApp order support.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="p-3.5 pt-0 border-t border-[#E3E8EF] mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${(biz.whatsapp || biz.phone || '').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-2xs active:scale-95"
                      >
                        <WhatsAppIcon size={14} />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${biz.phone || '+919876543210'}`}
                        className="py-1.5 px-3 rounded-xl bg-[#EDF4FF] hover:bg-[#DDE9FF] text-[#4787F2] text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                        title="Call Store"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/card/${slug}`}
                        className="flex-1 py-1.5 px-2.5 rounded-xl border border-[#E3E8EF] hover:border-[#4787F2] hover:bg-[#F4F6FB] text-[#17181C] text-[11px] font-bold text-center transition-all flex items-center justify-center gap-1"
                      >
                        <span>Visiting Card</span>
                        <ExternalLink className="w-3 h-3 text-[#687182]" />
                      </Link>

                      {isElite && (
                        <Link
                          href={`/b/${slug}`}
                          className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#8338EC] hover:bg-[#722ED1] text-white text-[11px] font-bold text-center transition-all flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <span>Microsite</span>
                          <Crown className="w-3 h-3 text-[#F2B604]" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
