'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SEED_BUSINESSES } from '@adsspot/api';
import { Card, Avatar, TierBadge, TrustedBadge } from '@adsspot/ui';
import {
  Phone,
  MessageCircle,
  Navigation,
  Share2,
  ChevronLeft,
  MapPin,
} from 'lucide-react';

export default function DigitalCardPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params?.slug[0] : '';
  const biz = SEED_BUSINESSES.find((b) => b.slug === slug) || SEED_BUSINESSES[0]!;

  return (
    <div className="flex-1 bg-[#F4F6FB] min-h-[calc(100vh-100px)] py-10 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#687182] hover:text-[#4787F2] mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Discover
        </Link>

        {/* Digital Visiting Card */}
        <Card padding="none" className="overflow-hidden shadow-xl border border-[#E3E8EF] bg-white">
          {/* Cover Header */}
          <div className="relative h-44 bg-neutral-200">
            <img
              src={biz.cover_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'}
              alt={biz.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <TierBadge tier={biz.tier} size="sm" />
              {biz.trusted && <TrustedBadge size="sm" />}
            </div>
          </div>

          {/* Business Profile Content */}
          <div className="p-6 text-center -mt-12 relative z-10">
            <div className="inline-block p-1 bg-white rounded-2xl shadow-md mb-3">
              <Avatar
                src={biz.logo_url}
                name={biz.name}
                size="xl"
                isElite={biz.tier === 'elite'}
              />
            </div>

            <h1 className="text-xl font-extrabold text-[#17181C]">{biz.name}</h1>
            <p className="text-xs text-[#687182] flex items-center justify-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#4787F2]" /> {biz.address}
            </p>

            <div className="flex items-center justify-center gap-2 mt-3 mb-6">
              <span className="text-xs font-bold text-[#17181C] bg-[#F4F6FB] px-2.5 py-1 rounded-full border border-[#E3E8EF]">
                ⭐ {biz.stats?.avg_rating || '4.9'} ({biz.stats?.reviews_count || 128} reviews)
              </span>
              <span className="text-xs font-bold text-[#1B6A2D] bg-[#EBF9EE] px-2.5 py-1 rounded-full">
                Open Now
              </span>
            </div>

            <p className="text-xs text-[#4A5260] leading-relaxed mb-6">
              {biz.description}
            </p>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <a
                href={`tel:${biz.phone}`}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#4787F2] text-white text-xs font-bold shadow-sm hover:bg-[#3373E0] transition-colors"
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
              <a
                href={`https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#35AB4E] text-white text-xs font-bold shadow-sm hover:bg-[#2A9641] transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>

            {/* Directions & Save Contact */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => alert(`Directions to: ${biz.address}`)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#E3E8EF] text-xs font-bold text-[#17181C] hover:bg-[#F4F6FB] transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#4787F2]" /> Directions
              </button>
              <button
                onClick={() => alert('Contact saved to your phonebook!')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#E3E8EF] text-xs font-bold text-[#17181C] hover:bg-[#F4F6FB] transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-[#687182]" /> Share Card
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
