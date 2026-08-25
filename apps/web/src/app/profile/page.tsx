'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth, SEED_BUSINESSES } from '@adsspot/api';
import { Card, Avatar, Button, TrustedBadge } from '@adsspot/ui';
import {
  Wallet,
  Bookmark,
  MapPin,
  Phone,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Star,
  Sparkles,
} from 'lucide-react';

export default function ConsumerProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'activity' | 'following' | 'reviews' | 'settings'>('activity');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const followedBusinesses = SEED_BUSINESSES.slice(0, 2);

  return (
    <div className="flex-1 bg-[#F4F6FB] pb-24 max-w-2xl mx-auto w-full min-h-screen p-4 space-y-5">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#17181C] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700 animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#F2B604]" />
          {toastMessage}
        </div>
      )}

      {/* 1. PROFILE HEADER CARD */}
      <Card padding="md" className="shadow-sm bg-white border border-[#E3E8EF] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatar_url || undefined} name={user?.full_name || 'Consumer'} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-[#17181C]">{user?.full_name || 'Aarav Sharma'}</h1>
                <span className="text-[10px] font-extrabold bg-[#EBF9EE] text-[#1B6A2D] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#35AB4E]" /> Verified
                </span>
              </div>
              <p className="text-xs text-[#687182] mt-0.5 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {user?.phone || '+91 98765 43210'}
              </p>
              <p className="text-[10px] text-[#4787F2] font-semibold mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Fort, Mumbai 400001
              </p>
            </div>
          </div>

          <Link href="/wallet" className="w-full sm:w-auto">
            <div className="p-2.5 rounded-xl bg-[#EDF4FF] border border-[#4787F2]/20 flex sm:flex-col justify-between sm:text-right hover:bg-[#D9E8FF] transition-colors cursor-pointer">
              <span className="text-[10px] text-[#687182] font-bold uppercase">Adsspot Cash</span>
              <span className="text-sm font-black text-[#4787F2]">₹{user?.wallet?.balance.toFixed(2) || '1,540.00'}</span>
            </div>
          </Link>
        </div>


        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F4F6FB] text-center">
          <div className="p-2 rounded-xl bg-[#F4F6FB]">
            <span className="text-sm font-black text-[#17181C] block">2</span>
            <span className="text-[10px] text-[#687182] font-bold">Following</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F4F6FB]">
            <span className="text-sm font-black text-[#17181C] block">3</span>
            <span className="text-[10px] text-[#687182] font-bold">Bookmarks</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F4F6FB]">
            <span className="text-sm font-black text-[#17181C] block">1</span>
            <span className="text-[10px] text-[#687182] font-bold">Reviews</span>
          </div>
        </div>
      </Card>

      {/* Register Business Onboarding CTA Banner */}
      <div className="bg-gradient-to-r from-[#17181C] to-[#2B2E38] rounded-2xl p-4 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F2B604]/20 text-[#F2B604] flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white">Own a Local Shop or Business?</h3>
            <p className="text-[11px] text-neutral-300">Get your free Digital Visiting Card &amp; reach 10,000+ local buyers.</p>
          </div>
        </div>
        <Link href="/onboard" className="shrink-0">
          <Button variant="primary" size="sm" className="w-full sm:w-auto text-xs font-bold bg-[#4787F2] hover:bg-[#3972D4]">
            Register Business &rarr;
          </Button>
        </Link>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">

        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
            activeTab === 'activity'
              ? 'bg-[#4787F2] text-white shadow-sm'
              : 'bg-white text-[#4A5260] border border-[#E3E8EF] hover:bg-neutral-50'
          }`}
        >
          Activity &amp; Deals
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
            activeTab === 'following'
              ? 'bg-[#4787F2] text-white shadow-sm'
              : 'bg-white text-[#4A5260] border border-[#E3E8EF] hover:bg-neutral-50'
          }`}
        >
          Followed Stores ({followedBusinesses.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
            activeTab === 'reviews'
              ? 'bg-[#4787F2] text-white shadow-sm'
              : 'bg-white text-[#4A5260] border border-[#E3E8EF] hover:bg-neutral-50'
          }`}
        >
          My Reviews (1)
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
            activeTab === 'settings'
              ? 'bg-[#4787F2] text-white shadow-sm'
              : 'bg-white text-[#4A5260] border border-[#E3E8EF] hover:bg-neutral-50'
          }`}
        >
          Settings
        </button>
      </div>

      {/* 3. TAB CONTENT */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          {/* Active Claimed Offer */}
          <Card padding="md" className="bg-gradient-to-r from-[#4787F2] to-[#3972D4] text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                Active Festival Coupon
              </span>
              <span className="text-[11px] font-bold text-white/90">Expires in 3 days</span>
            </div>
            <div>
              <h3 className="text-base font-black">20% Off at Royal Heritage Jewellers</h3>
              <p className="text-xs text-white/80 mt-0.5">Valid on certified hallmark gold making charges.</p>
            </div>
            <div className="pt-2 border-t border-white/20 flex items-center justify-between">
              <span className="text-xs font-mono font-black tracking-widest bg-white/10 px-3 py-1 rounded-xl">
                ROYAL20
              </span>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-[#4787F2] hover:bg-neutral-100 font-extrabold"
                onClick={() => showToast('Coupon code ROYAL20 copied to clipboard!')}
              >
                Copy Code
              </Button>
            </div>
          </Card>

          {/* Quick Links Menu */}
          <div className="bg-white rounded-2xl border border-[#E3E8EF] divide-y divide-[#E3E8EF] overflow-hidden shadow-sm">
            <Link href="/wallet" className="p-3.5 flex items-center justify-between hover:bg-[#F4F6FB] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EDF4FF] text-[#4787F2] flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17181C]">UPI Cash Wallet</h4>
                  <p className="text-[10px] text-[#687182]">Instant refunds &amp; fast 1-tap checkout</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </Link>

            <Link href="/saved" className="p-3.5 flex items-center justify-between hover:bg-[#F4F6FB] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EDF4FF] text-[#4787F2] flex items-center justify-center">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17181C]">Saved Stores &amp; Offers</h4>
                  <p className="text-[10px] text-[#687182]">View all bookmarked visiting cards</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </Link>

            <Link href="/explore" className="p-3.5 flex items-center justify-between hover:bg-[#F4F6FB] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EDF4FF] text-[#4787F2] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17181C]">Live Neighborhood Map</h4>
                  <p className="text-[10px] text-[#687182]">Explore GPS spot pins in Fort 400001</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </Link>
          </div>
        </div>
      )}

      {/* 4. FOLLOWING TAB */}
      {activeTab === 'following' && (
        <div className="space-y-3">
          {followedBusinesses.map((biz) => (
            <Card key={biz.id} padding="md" className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <img src={biz.logo_url || ''} alt={biz.name} className="w-12 h-12 rounded-xl object-cover border border-[#E3E8EF]" />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-[#17181C] truncate">{biz.name}</h4>
                    {biz.trusted && <TrustedBadge size="sm" />}
                  </div>
                  <p className="text-[11px] text-[#687182] truncate">{biz.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
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
      )}

      {/* 5. REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-3">
          <Card padding="md" className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={SEED_BUSINESSES[0]?.logo_url || ''}
                  alt="Royal Jewellers"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#17181C]">Royal Heritage Jewellers</h4>
                  <span className="text-[10px] text-[#687182]">Reviewed 2 weeks ago</span>
                </div>
              </div>
              <div className="flex text-[#F2B604]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xs text-[#4A5260]">
              "Exceptional bridal jewellery collection! Owner Rajesh ji personally assisted us with hallmark certification."
            </p>
            <div className="p-2.5 rounded-xl bg-[#F4F6FB] border-l-2 border-[#4787F2] text-[11px]">
              <span className="font-bold text-[#4787F2] block">Merchant Response:</span>
              <p className="text-[#17181C]">Thank you Aarav ji! We look forward to serving your family again.</p>
            </div>
          </Card>
        </div>
      )}

      {/* 6. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E3E8EF] divide-y divide-[#E3E8EF] overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#17181C]">Festival &amp; Offer Alerts</h4>
                <p className="text-[10px] text-[#687182]">Push notifications for deals in 400001</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#4787F2]" />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#17181C]">Elite Story Notifications</h4>
                <p className="text-[10px] text-[#687182]">Daily 24-hour spotlights from followed shops</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#4787F2]" />
            </div>

            <div className="p-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-[#981837] border-red-200 hover:bg-red-50 flex items-center justify-center gap-2"
                onClick={() => {
                  logout();
                  showToast('Logged out successfully.');
                }}
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
