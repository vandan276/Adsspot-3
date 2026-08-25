'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SEED_BUSINESSES, SEED_POSTS, SEED_REVIEWS } from '@adsspot/api';
import { Card, Button, TrustedBadge } from '@adsspot/ui';
import {
  MapPin,
  MessageCircle,
  Clock,
  Crown,
  Heart,
  Star,
  ArrowLeft,
  QrCode,
} from 'lucide-react';

export default function EliteMicrositePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const biz = SEED_BUSINESSES.find((b) => b.slug === slug) || SEED_BUSINESSES[0]!;
  const bizPosts = SEED_POSTS.filter((p) => p.business_id === biz.id);
  const bizReviews = SEED_REVIEWS.filter((r) => r.business_id === biz.id);

  return (
    <div className="min-h-screen bg-[#F4F6FB] pb-16">
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
          <Link href="/">
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
              <img src={biz.logo_url || ''} alt={biz.name} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black">{biz.name}</h1>
                {biz.trusted && <TrustedBadge size="sm" />}
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#4787F2]" /> {biz.address} (Pincode {biz.pincode})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/91${biz.phone}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#25D366] text-white font-bold text-xs rounded-full shadow-lg hover:brightness-110 flex items-center gap-1.5 transition-all"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
            <Link href={`/card/${biz.slug}`}>
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
            <h2 className="text-lg font-bold text-[#17181C]">About Our Establishment</h2>
            <p className="text-sm text-[#4A5260] leading-relaxed">{biz.description}</p>

            <div className="pt-4 border-t border-[#E3E8EF] grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[11px] text-[#687182] font-semibold block">CATEGORY</span>
                <span className="text-xs font-bold text-[#17181C] capitalize">{biz.category_id}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#687182] font-semibold block">CONTACT</span>
                <span className="text-xs font-bold text-[#17181C]">+91 {biz.phone}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#687182] font-semibold block">TIER</span>
                <span className="text-xs font-bold text-[#981837] uppercase">Elite Partner</span>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="space-y-4">
            <h3 className="text-sm font-bold text-[#17181C] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#4787F2]" /> Store Operating Hours
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F4F6FB]">
                <span className="text-[#687182]">Monday - Saturday:</span>
                <span className="font-bold text-[#17181C]">10:30 AM – 9:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F4F6FB]">
                <span className="text-[#687182]">Sunday:</span>
                <span className="font-bold text-[#17181C]">11:00 AM – 7:00 PM</span>
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
          <h2 className="text-lg font-bold text-[#17181C]">Featured Catalog &amp; Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bizPosts.map((post) => (
              <Card key={post.id} padding="none" className="overflow-hidden">
                <img src={post.image_urls[0]} alt="Catalog item" className="w-full h-56 object-cover" />
                <div className="p-4 space-y-2">
                  <p className="text-xs text-[#17181C] font-medium line-clamp-2">{post.caption}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#E3E8EF] text-xs text-[#687182]">
                    <span className="flex items-center gap-1 font-bold text-[#17181C]">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> {post.likes_count}
                    </span>
                    <span className="text-[#4787F2] font-bold text-[11px]">Enquire on WhatsApp</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#17181C]">Verified Neighborhood Reviews</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bizReviews.map((rev) => (
              <Card key={rev.id} padding="md" className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#687182]">{new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-[#4A5260] font-medium">{rev.comment}</p>
                {rev.reply && (
                  <div className="mt-2 pl-3 border-l-2 border-[#4787F2] bg-[#EDF4FF]/50 p-2 rounded text-[11px]">
                    <span className="font-bold text-[#4787F2] block">Owner Response:</span>
                    <p className="text-[#17181C]">{rev.reply}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
