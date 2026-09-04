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
  User as UserIcon,
  LogIn,
  Store,
} from 'lucide-react';

export default function ConsumerProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'activity' | 'following' | 'reviews' | 'settings'>('activity');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userInteractions, setUserInteractions] = useState<{
    likes: Record<string, boolean>;
    follows: Record<string, boolean>;
    reviews: any[];
  }>({
    likes: {},
    follows: {},
    reviews: [],
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Load real interaction state from DB
  React.useEffect(() => {
    if (user?.id) {
      fetch(`/api/interactions?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setUserInteractions({
              likes: data.likes || {},
              follows: data.follows || {},
              reviews: data.reviews || [],
            });
          }
        })
        .catch(() => { });
    }
  }, [user?.id]);

  // If user is not logged in, render a clean Guest Profile state
  if (!user) {
    return (
      <div className="flex-1 bg-[#F4F6FB] dark:bg-[#0B0E14] pb-28 max-w-lg mx-auto w-full min-h-screen p-4 flex flex-col items-center justify-center text-center space-y-5 transition-colors">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10 flex items-center justify-center text-[#4787F2] shadow-md">
            <UserIcon className="w-10 h-10 stroke-[2]" />
          </div>
          <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#F2B604] text-[#17181C] shadow-xs">
            Guest
          </span>
        </div>

        <div className="space-y-1.5 max-w-xs">
          <h1 className="text-xl font-black text-[#17181C] dark:text-white">Welcome to Adsspot</h1>
          <p className="text-xs text-[#687182] dark:text-neutral-400 leading-relaxed">
            Sign in with your phone number to access your Spot Wallet, save local deals, claim exclusive coupons, and manage your store.
          </p>
        </div>

        <div className="w-full space-y-3 pt-2">
          <Link href="/login" className="block w-full">
            <Button
              variant="primary"
              size="md"
              leftIcon={<LogIn className="w-4 h-4" />}
              className="w-full font-black py-3.5 shadow-md flex items-center justify-center text-xs"
            >
              Sign In / Create Account &rarr;
            </Button>
          </Link>

          <Link href="/onboard" className="block w-full">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Store className="w-4 h-4 text-[#F2B604]" />}
              className="w-full font-bold py-3.5 bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10 text-[#17181C] dark:text-white hover:bg-neutral-50 shadow-xs flex items-center justify-center text-xs"
            >
              Register Your Business
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full pt-4 border-t border-[#E3E8EF] dark:border-white/10 text-center">
          <div className="p-2.5 rounded-2xl bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10">
            <span className="text-base block">💰</span>
            <span className="text-[10px] font-bold text-[#17181C] dark:text-white mt-1 block">Unified Wallet</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10">
            <span className="text-base block">🎁</span>
            <span className="text-[10px] font-bold text-[#17181C] dark:text-white mt-1 block">Spot Coupons</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10">
            <span className="text-base block">📍</span>
            <span className="text-[10px] font-bold text-[#17181C] dark:text-white mt-1 block">Live 3D Map</span>
          </div>
        </div>
      </div>
    );
  }

  const isMerchant = user?.role === 'merchant' || Boolean(user?.business_profile);
  const userBiz = user?.business_profile;

  const followedBizIds = Object.keys(userInteractions.follows);
  const followedBusinesses = SEED_BUSINESSES.filter(
    (b) => followedBizIds.includes(b.id) || (followedBizIds.length === 0 && (b.id === 'biz-vad-1' || b.id === 'biz-vad-2'))
  );

  return (
    <div className="flex-1 bg-[#F4F6FB] dark:bg-[#0B0E14] pb-24 max-w-2xl mx-auto w-full min-h-screen p-4 space-y-5 transition-colors">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#17181C] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700 animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#F2B604]" />
          {toastMessage}
        </div>
      )}

      {/* 1. PROFILE HEADER CARD */}
      <Card padding="md" className="shadow-sm bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatar_url || undefined} name={user?.full_name || 'Consumer'} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-[#17181C] dark:text-white">{user?.full_name || 'Aarav Sharma'}</h1>
                <span className="text-[10px] font-extrabold bg-[#EBF9EE] dark:bg-[#13301D] text-[#1B6A2D] dark:text-[#4ade80] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#35AB4E] dark:text-[#4ade80]" /> {isMerchant ? 'Verified Merchant' : 'Verified Consumer'}
                </span>
              </div>
              <p className="text-xs text-[#687182] dark:text-neutral-400 mt-0.5 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {user?.phone || '+91 98765 43210'}
              </p>
              <p className="text-[10px] text-[#4787F2] font-semibold mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {userBiz?.address || 'Alkapuri, Vadodara 390007'}
              </p>
            </div>
          </div>

          <Link href="/wallet" className="w-full sm:w-auto">
            <div className="p-2.5 rounded-xl bg-[#EDF4FF] dark:bg-[#4787F2]/15 border border-[#4787F2]/20 flex sm:flex-col justify-between sm:text-right hover:bg-[#D9E8FF] transition-colors cursor-pointer">
              <span className="text-[10px] text-[#687182] dark:text-neutral-400 font-bold uppercase">Adsspot Cash</span>
              <span className="text-sm font-black text-[#4787F2]">₹{user?.wallet?.balance ? user.wallet.balance.toFixed(2) : '1,540.00'}</span>
            </div>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F4F6FB] dark:border-white/10 text-center">
          <div className="p-2 rounded-xl bg-[#F4F6FB] dark:bg-white/5">
            <span className="text-sm font-black text-[#17181C] dark:text-white block">{followedBusinesses.length}</span>
            <span className="text-[10px] text-[#687182] dark:text-neutral-400 font-bold">Following</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F4F6FB] dark:bg-white/5">
            <span className="text-sm font-black text-[#17181C] dark:text-white block">{Object.keys(userInteractions.likes).length || 2}</span>
            <span className="text-[10px] text-[#687182] dark:text-neutral-400 font-bold">Liked Posts</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F4F6FB] dark:bg-white/5">
            <span className="text-sm font-black text-[#17181C] dark:text-white block">{userInteractions.reviews.length || 1}</span>
            <span className="text-[10px] text-[#687182] dark:text-neutral-400 font-bold">Reviews</span>
          </div>
        </div>
      </Card>

      {/* 🌟 CONDITIONAL MERCHANT HUB OR CONSUMER ONBOARDING BANNER */}
      {isMerchant ? (
        <div className="bg-gradient-to-br from-[#17181C] via-[#1D2230] to-[#121620] rounded-2xl p-4 text-white shadow-lg border border-[#4787F2]/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏪</span>
              <div>
                <span className="text-[10px] font-black uppercase text-[#4787F2] tracking-wider block">Active Merchant Account</span>
                <h3 className="text-sm font-black text-white">{userBiz?.name || 'Your Registered Store'}</h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-gradient-to-r from-[#F2B604] to-[#E69D00] text-black shadow-xs">
              {userBiz?.tier ? `${userBiz.tier} Tier` : 'Elite Tier'}
            </span>
          </div>

          <p className="text-[11px] text-neutral-300">
            Manage your daily festival banner studio, digital visiting card, and view incoming customer leads.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            <Link
              href="/merchant"
              className="py-2 px-3 rounded-xl bg-[#4787F2] hover:bg-[#3373E0] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs text-center"
            >
              <span>Merchant Studio</span>
            </Link>
            <Link
              href={`/card/${userBiz?.slug || 'mandap-gujarati-thali'}`}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1 border border-white/20 text-center"
            >
              <span>Digital Card ↗</span>
            </Link>
            <Link
              href="/merchant"
              className="col-span-2 sm:col-span-1 py-2 px-3 rounded-xl bg-[#F2B604] hover:bg-[#DEA400] text-black text-xs font-black flex items-center justify-center gap-1 text-center"
            >
              <span>Banner Studio ✨</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Register Business Onboarding CTA Banner for Consumers */
        <div className="bg-gradient-to-r from-[#17181C] to-[#2B2E38] rounded-2xl p-4 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/10">
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
      )}

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${activeTab === 'activity'
              ? 'bg-[#4787F2] text-white shadow-sm'
              : 'bg-white dark:bg-[#121620] text-[#4A5260] dark:text-neutral-300 border border-[#E3E8EF] dark:border-white/10 hover:bg-neutral-50'
            }`}
        >
          Activity &amp; Deals
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${activeTab === 'following'
              ? 'bg-[#4787F2] text-white shadow-sm'
              : 'bg-white dark:bg-[#121620] text-[#4A5260] dark:text-neutral-300 border border-[#E3E8EF] dark:border-white/10 hover:bg-neutral-50'
            }`}
        >
          Followed Stores ({followedBusinesses.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${activeTab === 'reviews'
              ? 'bg-[#4787F2] text-white shadow-sm'
              : 'bg-white dark:bg-[#121620] text-[#4A5260] dark:text-neutral-300 border border-[#E3E8EF] dark:border-white/10 hover:bg-neutral-50'
            }`}
        >
          My Reviews ({userInteractions.reviews.length || 1})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${activeTab === 'settings'
              ? 'bg-[#4787F2] text-white shadow-sm'
              : 'bg-white dark:bg-[#121620] text-[#4A5260] dark:text-neutral-300 border border-[#E3E8EF] dark:border-white/10 hover:bg-neutral-50'
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
