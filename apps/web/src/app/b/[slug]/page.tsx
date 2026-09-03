'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SEED_BUSINESSES, SEED_POSTS, SEED_REVIEWS } from '@adsspot/api';
import { Card, Button, TrustedBadge, TierBadge } from '@adsspot/ui';
import {
  MapPin,
  MessageCircle,
  Clock,
  Crown,
  Heart,
  Star,
  ArrowLeft,
  QrCode,
  Sparkles,
  Store,
  Phone,
} from 'lucide-react';

export default function EliteMicrositePage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || '';
  const slug = decodeURIComponent(rawSlug).trim();

  // Find initial business in SEED_BUSINESSES if available
  const initialSeedBiz =
    SEED_BUSINESSES.find(
      (b) =>
        b.slug.toLowerCase() === slug.toLowerCase() ||
        b.id.toLowerCase() === slug.toLowerCase() ||
        b.name.toLowerCase() === slug.toLowerCase()
    ) || null;

  const [biz, setBiz] = useState<any>(initialSeedBiz);
  const [loading, setLoading] = useState(!initialSeedBiz);
  const [bizPosts, setBizPosts] = useState<any[]>(
    initialSeedBiz ? SEED_POSTS.filter((p) => p.business_id === initialSeedBiz.id) : []
  );
  const [bizReviews, setBizReviews] = useState<any[]>(
    initialSeedBiz ? SEED_REVIEWS.filter((r) => r.business_id === initialSeedBiz.id) : []
  );

  useEffect(() => {
    async function loadBusinessData() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/business/get-by-slug?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.business) {
            setBiz(data.business);

            // Load posts for this business
            try {
              const postsRes = await fetch('/api/posts');
              if (postsRes.ok) {
                const postsData = await postsRes.json();
                if (postsData.success && Array.isArray(postsData.posts)) {
                  const matching = postsData.posts.filter((p: any) => p.business_id === data.business.id);
                  if (matching.length > 0) {
                    setBizPosts(matching);
                  } else {
                    setBizPosts(SEED_POSTS.filter((p) => p.business_id === data.business.id));
                  }
                }
              }
            } catch {}

            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('[MicrositePage] API fetch error:', err);
      }

      // If not in DB, fallback to seed or first matching
      if (!initialSeedBiz) {
        const fallback =
          SEED_BUSINESSES.find(
            (b) =>
              b.slug.toLowerCase().includes(slug.toLowerCase()) ||
              b.name.toLowerCase().includes(slug.toLowerCase())
          ) || SEED_BUSINESSES[0]!;
        setBiz(fallback);
        setBizPosts(SEED_POSTS.filter((p) => p.business_id === fallback.id));
        setBizReviews(SEED_REVIEWS.filter((r) => r.business_id === fallback.id));
      }
      setLoading(false);
    }

    loadBusinessData();
  }, [slug]);

  if (loading && !biz) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] dark:bg-[#0B0E14] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#4787F2]/10 flex items-center justify-center text-[#4787F2] animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-xs font-bold text-neutral-500">Loading Elite Business Microsite...</p>
      </div>
    );
  }

  if (!biz) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] dark:bg-[#0B0E14] flex flex-col items-center justify-center p-4 text-center space-y-4">
        <Store className="w-12 h-12 text-neutral-400" />
        <h2 className="text-xl font-black text-[#17181C] dark:text-white">Business Not Found</h2>
        <p className="text-xs text-neutral-500">The requested merchant microsite could not be located.</p>
        <Link href="/feed">
          <Button variant="primary" size="sm">Back to Feed</Button>
        </Link>
      </div>
    );
  }

  const cleanPhone = (biz.phone || '').replace(/[^0-9]/g, '');
  const cleanWhatsapp = (biz.whatsapp || biz.phone || '').replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-[#F4F6FB] dark:bg-[#0B0E14] pb-24 transition-colors">
      {/* 1. HERO COVER BANNER */}
      <div className="relative h-64 sm:h-80 bg-neutral-900 overflow-hidden">
        <img
          src={biz.cover_url || 'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=1200'}
          alt={biz.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17181C] via-transparent to-black/40" />

        {/* Top Back Nav */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <Link href="/feed">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Feed
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="bg-[#981837] text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> Elite Verified Microsite
            </span>
          </div>
        </div>

        {/* Floating Profile Info in Hero */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white z-10">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1.5 shadow-2xl border-2 border-white flex-shrink-0">
              <img
                src={biz.logo_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150'}
                alt={biz.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{biz.name}</h1>
                <TierBadge tier={biz.tier || 'elite'} size="sm" />
                {biz.trusted && <TrustedBadge size="sm" />}
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#4787F2]" /> {biz.address} {biz.pincode ? `(Pincode ${biz.pincode})` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {cleanPhone && (
              <a
                href={`tel:${cleanPhone}`}
                className="px-4 py-2 bg-[#4787F2] text-white font-bold text-xs rounded-full shadow-lg hover:brightness-110 flex items-center gap-1.5 transition-all"
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
            )}
            {cleanWhatsapp && (
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=Hi%20${encodeURIComponent(biz.name)},%20I%20saw%20your%20business%20on%20Adsspot.`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#25D366] text-white font-bold text-xs rounded-full shadow-lg hover:brightness-110 flex items-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            )}
            <Link href={`/card/${biz.slug || biz.id}`}>
              <Button variant="secondary" size="sm" leftIcon={<QrCode className="w-4 h-4" />}>
                Digital Card
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MICROSITE CONTENT CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        {/* About & Operating Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card padding="lg" className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-[#17181C] dark:text-white">About Our Establishment</h2>
            <p className="text-sm text-[#4A5260] dark:text-neutral-300 leading-relaxed">
              {biz.description || 'Verified business on Adsspot offering premium local products & services.'}
            </p>

            <div className="pt-4 border-t border-[#E3E8EF] dark:border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[11px] text-[#687182] dark:text-neutral-400 font-semibold block">CATEGORY</span>
                <span className="text-xs font-bold text-[#17181C] dark:text-white capitalize">{biz.category_id || 'Retail'}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#687182] dark:text-neutral-400 font-semibold block">CONTACT</span>
                <span className="text-xs font-bold text-[#17181C] dark:text-white">{biz.phone || 'Available on WhatsApp'}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#687182] dark:text-neutral-400 font-semibold block">TIER</span>
                <span className="text-xs font-bold text-[#981837] uppercase">{biz.tier || 'Elite'} Partner</span>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="space-y-4">
            <h3 className="text-sm font-bold text-[#17181C] dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#4787F2]" /> Store Operating Hours
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F4F6FB] dark:border-white/5">
                <span className="text-[#687182] dark:text-neutral-400">Monday - Saturday:</span>
                <span className="font-bold text-[#17181C] dark:text-white">10:30 AM – 9:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F4F6FB] dark:border-white/5">
                <span className="text-[#687182] dark:text-neutral-400">Sunday:</span>
                <span className="font-bold text-[#17181C] dark:text-white">11:00 AM – 7:00 PM</span>
              </div>
              <div className="flex justify-between py-1 text-[#35AB4E] font-bold">
                <span>Current Status:</span>
                <span>Open Now</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Showcase Gallery / Posts */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#17181C] dark:text-white">Featured Catalog &amp; Collections</h2>
          {bizPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bizPosts.map((post) => (
                <Card key={post.id} padding="none" className="overflow-hidden">
                  <img
                    src={Array.isArray(post.image_urls) ? post.image_urls[0] : post.image_urls || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500'}
                    alt="Catalog item"
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <p className="text-xs text-[#17181C] dark:text-white font-medium line-clamp-2">{post.caption || post.title}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#E3E8EF] dark:border-white/10 text-xs text-[#687182]">
                      <span className="flex items-center gap-1 font-bold text-[#17181C] dark:text-white">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> {post.likes_count || 12}
                      </span>
                      {cleanWhatsapp && (
                        <a
                          href={`https://wa.me/${cleanWhatsapp}?text=Hi%20${encodeURIComponent(biz.name)},%20I%20am%20interested%20in%20this%20product:%20${encodeURIComponent(post.caption || post.title || 'Catalog item')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#4787F2] font-bold text-[11px] hover:underline"
                        >
                          Enquire on WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-white/5 border border-[#E3E8EF] dark:border-white/10 text-xs text-neutral-500">
              New catalog photos and festival collection arrivals will be published here soon.
            </div>
          )}
        </div>

        {/* Customer Reviews */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#17181C] dark:text-white">Verified Neighborhood Reviews</h2>
          {bizReviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bizReviews.map((rev) => (
                <Card key={rev.id} padding="md" className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#687182] dark:text-neutral-400">
                      {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <p className="text-xs text-[#4A5260] dark:text-neutral-300 font-medium">{rev.comment}</p>
                  {rev.reply && (
                    <div className="mt-2 pl-3 border-l-2 border-[#4787F2] bg-[#EDF4FF]/50 dark:bg-[#4787F2]/10 p-2 rounded text-[11px]">
                      <span className="font-bold text-[#4787F2] block">Owner Response:</span>
                      <p className="text-[#17181C] dark:text-white">{rev.reply}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-2xl bg-white dark:bg-white/5 border border-[#E3E8EF] dark:border-white/10 text-xs text-neutral-500">
              ⭐ 5.0 Rating • No customer reviews posted yet. Be the first verified customer to leave a review!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
