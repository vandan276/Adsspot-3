'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SEED_BUSINESSES } from '@adsspot/api';
import { Card, Avatar, TierBadge, TrustedBadge } from '@adsspot/ui';
import {
  Phone,
  MessageCircle,
  Share2,
  ChevronLeft,
  MapPin,
  Download,
  Star,
  QrCode,
} from 'lucide-react';

const DEFAULT_BIZ = {
  id: '',
  owner_id: '',
  category_id: 'cat-1',
  name: 'Loading Business...',
  slug: '',
  description: '',
  address: '',
  pincode: '390007',
  lat: 22.3072,
  lng: 73.1812,
  phone: '',
  whatsapp: '',
  logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200',
  cover_url: 'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=1200',
  tier: 'basic' as const,
  trusted: true,
  status: 'active' as const,
  created_at: new Date().toISOString(),
};

export default function DigitalCardPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params?.slug[0] : '';
  
  const [biz, setBiz] = useState<any>(SEED_BUSINESSES.find((b) => b.slug === slug) || DEFAULT_BIZ);
  const [copied, setCopied] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);

  useEffect(() => {
    async function loadRealBiz() {
      if (!slug) return;
      try {
        const res = await fetch(`/api/business/get-by-slug?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.business) {
            setBiz(data.business);
          }
        }
      } catch (err) {
        console.warn('[CardPage] DB fetch error, using fallback:', err);
      }
    }
    loadRealBiz();
  }, [slug]);

  const trackLead = async (actionType: string) => {
    if (!biz.id && !biz.slug) return;
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: biz.id,
          businessSlug: biz.slug,
          requirement: `Consumer clicked ${actionType} on Digital Visiting Card (/card/${biz.slug})`,
          source: 'Digital Visiting Card (/card)',
        }),
      });
    } catch {}
  };

  // Generate & Download Authentic .VCF Virtual Contact File
  const handleSaveContact = () => {
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:${biz.name}
ORG:${biz.name}
TEL;TYPE=WORK,VOICE:${biz.phone}
TEL;TYPE=CELL,VOICE:${biz.whatsapp}
ADR;TYPE=WORK:;;${biz.address};Vadodara;Gujarat;${biz.pincode};India
URL:https://adsspot.in/card/${biz.slug}
NOTE:Verified Merchant on Adsspot (${(biz.tier || 'basic').toUpperCase()} Tier)
END:VCARD`;

    const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${biz.slug || 'business'}-contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareCard = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: biz.name,
        text: `View digital visiting card of ${biz.name} on Adsspot`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Card link copied to clipboard!');
    }
  };

  // Cover image fallback chain (Uses merchant's uploaded photos directly)
  const coverImage = biz.cover_url ||
    (Array.isArray(biz.photos) && biz.photos[0]) ||
    (Array.isArray(biz.microsite?.gallery_urls) && biz.microsite.gallery_urls[0]) ||
    biz.logo_url ||
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800';

  const avatarImage = biz.logo_url || coverImage;

  return (
    <div className="flex-1 bg-[#F4F6FB] min-h-[calc(100vh-100px)] py-8 sm:py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full space-y-4">
        {/* Navigation back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#687182] hover:text-[#4787F2] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Discover
        </Link>

        {/* Digital Visiting Card */}
        <Card padding="none" className="overflow-hidden shadow-2xl border border-[#E3E8EF] bg-white rounded-3xl transition-all">
          {/* Cover Header */}
          <div className="relative h-48 sm:h-52 bg-neutral-900">
            <img
              src={coverImage}
              alt={biz.name}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
              <TierBadge tier={biz.tier || 'basic'} size="sm" />
              {biz.trusted && <TrustedBadge size="sm" />}
            </div>
          </div>

          {/* Business Profile Content */}
          <div className="p-6 text-center -mt-16 relative z-10 space-y-4">
            {/* Overlapping Profile Avatar */}
            <div className="inline-block p-1 bg-white rounded-2xl shadow-xl ring-4 ring-white/60">
              <Avatar
                src={avatarImage}
                name={biz.name}
                size="xl"
                isElite={biz.tier === 'elite'}
              />
            </div>

            {/* Business Identity */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[#17181C] tracking-tight">{biz.name}</h1>
              <p className="text-xs text-[#687182] flex items-center justify-center gap-1 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#4787F2] shrink-0" />
                <span className="truncate">{biz.address || 'Local Business, India'}</span>
              </p>
            </div>

            {/* Status & Rating Chips */}
            <div className="flex items-center justify-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[#B45309] font-extrabold text-xs shadow-2xs">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                <span>{(biz.stats?.avg_rating || 5.0).toFixed(1)}</span>
                <span className="text-[#92400E] font-medium">({biz.stats?.reviews_count || 0} reviews)</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#1B6A2D] font-extrabold text-xs shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#35AB4E] animate-pulse" />
                <span>Open Now</span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs text-[#4A5260] leading-relaxed max-w-sm mx-auto font-medium">
              {biz.description || 'Verified business on Adsspot offering premium local products & services.'}
            </p>

            {/* ACTION BUTTON HIERARCHY */}
            <div className="space-y-2.5 pt-2">
              {/* Row 1: Primary Conversion Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${biz.phone || ''}`}
                  onClick={() => trackLead('Call Now')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#4787F2] text-white text-xs font-black shadow-md hover:bg-[#3373E0] active:scale-95 transition-all"
                >
                  <Phone className="w-4 h-4" /> Call Now
                </a>
                <a
                  href={`https://wa.me/${(biz.whatsapp || biz.phone || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(biz.name)},%20I%20am%20viewing%20your%20digital%20card%20on%20Adsspot.`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackLead('WhatsApp Direct')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366] text-white text-xs font-black shadow-md hover:bg-[#1EBE5D] active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>

              {/* Row 2: Secondary Store Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleSaveContact}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#17181C] text-white text-xs font-black shadow-sm hover:bg-neutral-800 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4 text-[#F2B604]" />
                  <span>{copied ? 'Saved! ✓' : 'Save Contact'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUpiModal(true)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FFF8E7] text-[#925F00] border border-[#F2B604]/40 text-xs font-black shadow-2xs hover:bg-[#FFF1CC] active:scale-95 transition-all"
                >
                  <QrCode className="w-4 h-4 text-[#925F00]" />
                  <span>UPI Pay QR</span>
                </button>
              </div>

              {/* Row 3: Utility & Social Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`https://search.google.com/local/writereview?placeid=${biz.slug || ''}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs font-bold text-[#B45309] hover:bg-[#FEF3C7] active:scale-95 transition-all"
                >
                  <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" /> Rate on Google
                </a>

                <button
                  type="button"
                  onClick={handleShareCard}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#E3E8EF] bg-white text-xs font-bold text-[#17181C] hover:bg-[#F4F6FB] active:scale-95 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#687182]" /> Share Card
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* UPI Payment Modal */}
        {showUpiModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 border border-[#E3E8EF] shadow-2xl text-center space-y-4 animate-scale-up">
              <div className="w-12 h-12 rounded-full bg-[#FFF8E7] text-[#925F00] flex items-center justify-center mx-auto shadow-sm">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-[#925F00] tracking-wider">Direct UPI Store Payment</span>
                <h3 className="text-base font-black text-[#17181C] mt-0.5">{biz.name}</h3>
                <p className="text-xs text-[#687182] mt-1">Scan via GPay, PhonePe, Paytm, or BHIM</p>
              </div>

              {/* QR Container */}
              <div className="p-4 bg-white border-2 border-neutral-200 rounded-2xl inline-block shadow-inner">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=merchant@adsspot&pn=${encodeURIComponent(biz.name)}&cu=INR`}
                  alt="UPI QR"
                  className="w-40 h-40 object-contain mx-auto"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowUpiModal(false)}
                className="w-full py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-200"
              >
                Close QR Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
