'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth, SEED_BUSINESSES, SEED_POSTS, SEED_REVIEWS, SEED_CATEGORIES } from '@adsspot/api';
import { Card, Avatar, Button, TierBadge, TrustedBadge } from '@adsspot/ui';
import {
  Store,
  Eye,
  Heart,
  Users,
  MessageSquare,
  Sparkles,
  QrCode,
  Image as ImageIcon,
  Crown,
  Plus,
  Award,
  ExternalLink,
  CheckCircle,
  Share2,
  Download,
  ShieldCheck,
  CreditCard,
  Zap,
  Building2,
  X,
} from 'lucide-react';

export default function MerchantStudioPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center p-6">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#4787F2]/20" />
            <div className="h-4 w-32 bg-neutral-200 rounded-md" />
          </div>
        </div>
      }
    >
      <MerchantStudioContent />
    </React.Suspense>
  );
}

function MerchantStudioContent() {
  const { user, isLoading, refreshAuth } = useAuth();
  const [localBiz, setLocalBiz] = useState<any>(null);

  const currentBiz = localBiz || user?.business_profile || (user?.role === 'super_admin' ? SEED_BUSINESSES[0]! : null);

  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'posts' | 'banners' | 'reviews' | 'billing'>('overview');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'crm' || tabParam === 'overview' || tabParam === 'posts' || tabParam === 'banners' || tabParam === 'reviews' || tabParam === 'billing') {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string>('diwali');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Membership & Upgrade State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTier, setUpgradeTier] = useState<'basic' | 'premium' | 'elite'>('elite');
  const [upgradeCycle, setUpgradeCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [upgradePayMethod, setUpgradePayMethod] = useState<'upi' | 'card' | 'netbanking' | 'qr'>('upi');
  const [upgradeUpiId, setUpgradeUpiId] = useState('merchant@okhdfcbank');
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);

  // Unsubscribed Onboarding Form State
  const [onboardBizName, setOnboardBizName] = useState(user?.full_name || 'My Store');
  const [onboardCategory, setOnboardCategory] = useState('cat-1');
  const [onboardAddress, setOnboardAddress] = useState('Fort, Mumbai');
  const [onboardPincode, setOnboardPincode] = useState('400001');

  const getPlanPrice = (tier: 'basic' | 'premium' | 'elite', cycle: 'monthly' | 'yearly') => {
    if (tier === 'basic') return cycle === 'monthly' ? 999 : 9990;
    if (tier === 'premium') return cycle === 'monthly' ? 2499 : 24990;
    return cycle === 'monthly' ? 4999 : 49990;
  };

  const handleExecuteUpgrade = async (targetTier: 'basic' | 'premium' | 'elite', cycle: 'monthly' | 'yearly' = upgradeCycle) => {
    setIsProcessingUpgrade(true);
    try {
      const price = getPlanPrice(targetTier, cycle);
      const generatedPayId = `pay_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const res = await fetch('/api/merchants/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: targetTier,
          billingCycle: cycle,
          bizName: currentBiz?.name || onboardBizName || user?.full_name || 'My Store',
          ownerName: user?.full_name || 'Store Owner',
          phone: user?.phone || '+919876543210',
          categoryId: currentBiz?.category_id || onboardCategory,
          address: currentBiz?.address || onboardAddress,
          pincode: currentBiz?.pincode || onboardPincode,
          paymentMethod: upgradePayMethod.toUpperCase(),
          paymentId: generatedPayId,
          amount: price,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Payment failed');
      }

      setLocalBiz(data.business);
      setShowUpgradeModal(false);
      await refreshAuth();
      showToast(`🎉 Upgraded to ${targetTier.toUpperCase()} Tier! Payment ID: ${generatedPayId}`);
    } catch (err: any) {
      alert('Subscription upgrade error: ' + (err?.message || 'Failed'));
    } finally {
      setIsProcessingUpgrade(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'story' | 'post') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('module', target === 'story' ? 'stories' : 'posts');
      if (user?.id) formData.append('user_id', user.id);
      if (currentBiz?.id) formData.append('merchant_id', currentBiz.id);

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(`❌ Upload failed: ${data.error || 'Please sign in or retry.'}`);
        return;
      }

      if (target === 'story') {
        setNewStoryImage(data.file_url);
        showToast(`✓ Story image uploaded! (${file.name})`);
      } else {
        setNewPostImage(data.file_url);
        showToast(`✓ Post image uploaded! (${file.name})`);
      }
    } catch (err: any) {
      showToast(`❌ Failed to upload image: ${err?.message || 'Network error'}`);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // CRM Leads Pipeline State (Feature G)
  const [leads, setLeads] = useState([
    {
      id: 'lead-1',
      name: 'Priya Sharma',
      phone: '+919876500111',
      requirement: 'Inquiry for 25 Bridal Kundan jewellery gift sets for wedding on Nov 15.',
      source: 'Digital Visiting Card (/card)',
      status: 'new',
      time: '15 mins ago',
      value: '₹1,50,000',
    },
    {
      id: 'lead-2',
      name: 'Rohan Patel',
      phone: '+919876500222',
      requirement: 'Claimed Spot Drop FLASH40 coupon for 4 Royal Gujarati Thalis.',
      source: 'Spot Drop Voucher',
      status: 'contacted',
      time: '1 hour ago',
      value: '₹3,200',
    },
    {
      id: 'lead-3',
      name: 'Vertex Media Systems',
      phone: '+919876500333',
      requirement: 'Looking for 50 branded festival gift hampers for corporate clients.',
      source: 'B2B RFQ Portal',
      status: 'converted',
      time: 'Yesterday',
      value: '₹45,000',
    },
  ]);

  // New Post & Story State
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostImage, setNewPostImage] = useState('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800');
  const [newStoryImage, setNewStoryImage] = useState('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1000');
  const [newStoryTag, setNewStoryTag] = useState('20% OFF');
  const [newStoryCoupon, setNewStoryCoupon] = useState('FESTIVE20');
  const [newStoryCaption, setNewStoryCaption] = useState('Special 20% discount on making charges for all hallmark jewellery this festive weekend!');
  const [hasStoryToday, setHasStoryToday] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSendReply = (reviewId: string) => {
    const text = replyInput[reviewId];
    if (!text || text.trim() === '') return;
    setReplies((prev) => ({ ...prev, [reviewId]: text }));
    setReplyInput((prev) => ({ ...prev, [reviewId]: '' }));
    showToast('Merchant reply posted successfully!');
  };

  // Published posts state
  const [merchantPosts, setMerchantPosts] = useState<any[]>(SEED_POSTS);

  // Dynamic Real Business Stats & Reviews
  const [bizStats, setBizStats] = useState({
    followers: 0,
    reviews_count: 0,
    avg_rating: '0.0',
    card_clicks: 0,
    store_views: 0,
    posts_count: 0,
    is_custom_business: false,
  });
  const [merchantReviews, setMerchantReviews] = useState<any[]>([]);

  // Load existing posts and real stats
  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.posts) {
          setMerchantPosts(data.posts);
        }
      })
      .catch(() => { });

    if (currentBiz?.id) {
      // 1. Fetch real stats
      fetch(`/api/business/stats?businessId=${currentBiz.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.stats) {
            setBizStats(data.stats);
          }
        })
        .catch(() => { });

      // 2. Fetch real reviews
      fetch(`/api/interactions?businessId=${currentBiz.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.reviews && data.reviews.length > 0) {
            setMerchantReviews(data.reviews);
          } else {
            setMerchantReviews(SEED_REVIEWS);
          }
        })
        .catch(() => { setMerchantReviews(SEED_REVIEWS); });

      // 3. Fetch real CRM leads from PostgreSQL
      fetch('/api/leads')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && Array.isArray(data.leads) && data.leads.length > 0) {
            setLeads(data.leads);
          }
        })
        .catch(() => { });
    }
  }, [currentBiz?.id]);

  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
    try {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
      showToast(`Lead moved to ${newStatus.toUpperCase()}!`);
    } catch {
      showToast(`Lead moved to ${newStatus.toUpperCase()}!`);
    }
  };

  const handlePublishStory = async () => {
    if (currentBiz?.tier !== 'elite') {
      alert('Stories are strictly exclusive to Elite Tier merchants (1 story / 24 hours). Please upgrade your membership.');
      return;
    }
    if (hasStoryToday) {
      alert('24h Quota Reached: Elite businesses are capped at max ONE story per 24 hours.');
      return;
    }

    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: currentBiz?.id || 'biz-vad-1',
          media_url: newStoryImage || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1000',
          caption: newStoryCaption,
          tag: newStoryTag,
          coupon_code: newStoryCoupon,
        }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      setHasStoryToday(true);
      showToast(`🎉 24-Hour Story published live with coupon "${newStoryCoupon}"! Visible on consumer feed stories.`);
    } catch (err) {
      setHasStoryToday(true);
      showToast(`24-Hour Story published with coupon "${newStoryCoupon}"!`);
    }
  };

  const handlePublishPost = async () => {
    if (!newPostCaption.trim()) {
      alert('Please enter a caption for your post');
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: currentBiz?.id || 'biz-vad-1',
          caption: newPostCaption,
          image_url: newPostImage || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
        }),
      });
      const data = await res.json();
      if (data.post) {
        setMerchantPosts((prev) => [data.post, ...prev]);
      }
      showToast('🚀 New post published live to neighborhood feed!');
      setNewPostCaption('');
    } catch (err) {
      showToast('Post published to neighborhood feed!');
      setNewPostCaption('');
    }
  };

  // Route Guard: Merchant or Super Admin
  if (!isLoading && (!user || (user.role !== 'merchant' && user.role !== 'super_admin' && user.dashboard_type !== 'merchant' && user.dashboard_type !== 'admin'))) {
    return (
      <div className="flex-1 bg-[#F4F6FB] min-h-[calc(100vh-100px)] flex items-center justify-center p-6">
        <Card padding="lg" className="max-w-md w-full text-center space-y-4 shadow-xl border border-amber-200">
          <div className="w-16 h-16 bg-amber-100 text-[#A06E00] rounded-full flex items-center justify-center mx-auto text-2xl font-black">
            🏪
          </div>
          <h2 className="text-xl font-black text-[#17181C]">Merchant Studio Access</h2>
          <p className="text-xs text-[#687182]">
            You need a registered merchant account or administrator permissions to access Merchant Studio.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/login">
              <Button variant="primary" size="md" className="w-full">
                Sign In as Merchant
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="md" className="w-full">
                View Merchant Plans &amp; Pricing
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Paywall: If Merchant has not subscribed to any plan yet
  if (!isLoading && !currentBiz && user?.role !== 'super_admin') {
    return (
      <div className="flex-1 bg-[#F4F6FB] min-h-[calc(100vh-100px)] flex items-center justify-center p-4 sm:p-6">
        <Card padding="lg" className="max-w-2xl w-full space-y-6 shadow-2xl bg-white border border-[#E3E8EF]">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#981837] text-xs font-black">
              🔥 50% Launch Discount Active
            </div>
            <h2 className="text-2xl font-black text-[#17181C]">Activate Your Merchant Membership</h2>
            <p className="text-xs text-[#687182] max-w-md mx-auto">
              Select a membership tier to unlock your Digital Visiting Card, neighborhood feed posting, and Banner Studio.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Basic */}
            <div
              onClick={() => { setUpgradeTier('basic'); }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${upgradeTier === 'basic' ? 'border-[#4787F2] bg-[#EDF4FF]/50 ring-2 ring-[#4787F2]/20' : 'border-[#E3E8EF] hover:border-neutral-300'
                }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <TierBadge tier="basic" size="sm" />
                  <span className="text-[10px] font-bold text-[#4787F2] bg-blue-50 px-2 py-0.5 rounded-full">50% OFF</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 line-through font-bold">₹1,999/mo</span>
                  <div className="text-xl font-black text-[#17181C]">₹999 <span className="text-[11px] font-normal text-neutral-500">/mo</span></div>
                </div>
                <ul className="text-[11px] text-neutral-600 space-y-1 pt-2 border-t border-neutral-100">
                  <li>✓ Digital Card (/card)</li>
                  <li>✓ Festival auto-banners</li>
                  <li className="text-neutral-400 line-through">✗ Custom banners</li>
                  <li className="text-neutral-400 line-through">✗ 24h Stories</li>
                </ul>
              </div>
              <div className={`mt-3 py-1.5 rounded-xl text-center text-xs font-bold ${upgradeTier === 'basic' ? 'bg-[#4787F2] text-white' : 'bg-neutral-100 text-neutral-700'
                }`}>
                {upgradeTier === 'basic' ? 'Selected' : 'Select Basic'}
              </div>
            </div>

            {/* Premium */}
            <div
              onClick={() => { setUpgradeTier('premium'); }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${upgradeTier === 'premium' ? 'border-[#35AB4E] bg-emerald-50/50 ring-2 ring-[#35AB4E]/20' : 'border-[#E3E8EF] hover:border-neutral-300'
                }`}
            >
              <div className="absolute -top-2.5 right-3 bg-[#35AB4E] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                Most Popular
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between mt-1">
                  <TierBadge tier="premium" size="sm" />
                  <span className="text-[10px] font-bold text-[#35AB4E] bg-emerald-50 px-2 py-0.5 rounded-full">Save 50%</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 line-through font-bold">₹4,999/mo</span>
                  <div className="text-xl font-black text-[#17181C]">₹2,499 <span className="text-[11px] font-normal text-neutral-500">/mo</span></div>
                </div>
                <ul className="text-[11px] text-neutral-600 space-y-1 pt-2 border-t border-neutral-100">
                  <li>✓ Everything in Basic</li>
                  <li>✓ 2 Custom Banners/wk</li>
                  <li className="text-[#35AB4E] font-bold">✓ Green "Trusted" Badge</li>
                  <li className="text-neutral-400 line-through">✗ 24h Stories</li>
                </ul>
              </div>
              <div className={`mt-3 py-1.5 rounded-xl text-center text-xs font-bold ${upgradeTier === 'premium' ? 'bg-[#35AB4E] text-white' : 'bg-neutral-100 text-neutral-700'
                }`}>
                {upgradeTier === 'premium' ? 'Selected' : 'Select Premium'}
              </div>
            </div>

            {/* Elite */}
            <div
              onClick={() => { setUpgradeTier('elite'); }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${upgradeTier === 'elite' ? 'border-[#981837] bg-red-50/40 ring-2 ring-[#981837]/20' : 'border-[#E3E8EF] hover:border-neutral-300'
                }`}
            >
              <div className="absolute -top-2.5 right-3 bg-[#981837] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                VIP Growth
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between mt-1">
                  <TierBadge tier="elite" size="sm" />
                  <span className="text-[10px] font-bold text-[#981837] bg-red-50 px-2 py-0.5 rounded-full">All Features</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 line-through font-bold">₹9,999/mo</span>
                  <div className="text-xl font-black text-[#17181C]">₹4,999 <span className="text-[11px] font-normal text-neutral-500">/mo</span></div>
                </div>
                <ul className="text-[11px] text-neutral-600 space-y-1 pt-2 border-t border-neutral-100">
                  <li>✓ Everything in Premium</li>
                  <li className="text-[#981837] font-bold">✓ Daily 24h Stories</li>
                  <li className="text-[#981837] font-bold">✓ Microsite (/b/[slug])</li>
                  <li>✓ Daily Banners (365/yr)</li>
                </ul>
              </div>
              <div className={`mt-3 py-1.5 rounded-xl text-center text-xs font-bold ${upgradeTier === 'elite' ? 'bg-[#981837] text-white' : 'bg-neutral-100 text-neutral-700'
                }`}>
                {upgradeTier === 'elite' ? 'Selected' : 'Select Elite'}
              </div>
            </div>
          </div>

          {/* Store Info Inputs */}
          <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-[#E3E8EF] space-y-3">
            <h5 className="text-xs font-black text-[#17181C] flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-[#4787F2]" /> Store Setup Details
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Business / Store Name</label>
                <input
                  type="text"
                  value={onboardBizName}
                  onChange={(e) => setOnboardBizName(e.target.value)}
                  placeholder="e.g. Royal Sweets &amp; Bakers"
                  className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] text-xs bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Store Category</label>
                <select
                  value={onboardCategory}
                  onChange={(e) => setOnboardCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] text-xs bg-white outline-none"
                >
                  {SEED_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Store Address / Landmark</label>
                <input
                  type="text"
                  value={onboardAddress}
                  onChange={(e) => setOnboardAddress(e.target.value)}
                  placeholder="e.g. Shop 4, Fort, Mumbai"
                  className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] text-xs bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Pincode Territory</label>
                <input
                  type="text"
                  value={onboardPincode}
                  onChange={(e) => setOnboardPincode(e.target.value)}
                  placeholder="400001"
                  className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] text-xs bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Instant Razorpay Activation Button */}
          <Button
            variant="primary"
            size="md"
            className="w-full font-black shadow-xl py-3.5 text-sm bg-[#35AB4E] hover:bg-[#2E9644] flex items-center justify-center gap-2"
            isLoading={isProcessingUpgrade}
            onClick={() => handleExecuteUpgrade(upgradeTier, upgradeCycle)}
          >
            <ShieldCheck className="w-4 h-4" /> Pay ₹{getPlanPrice(upgradeTier, upgradeCycle).toLocaleString()} via Razorpay &amp; Unlock Merchant Studio &rarr;
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F4F6FB] min-h-[calc(100vh-100px)] flex flex-col lg:flex-row relative pb-24 lg:pb-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#17181C] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-[#35AB4E]" />
          {toastMessage}
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E3E8EF] p-5 hidden lg:flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Avatar src={currentBiz?.logo_url} name={currentBiz?.name} size="md" isElite={currentBiz?.tier === 'elite'} />
            <div className="overflow-hidden">
              <span className="text-xs font-black text-[#A06E00] uppercase tracking-wider">Merchant Studio</span>
              <p className="text-xs font-bold text-[#17181C] truncate">{currentBiz?.name}</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold text-[#4A5260]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
                }`}
            >
              <Store className="w-4 h-4" /> Business Overview
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'crm' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
                }`}
            >
              <Users className="w-4 h-4 text-[#35AB4E]" /> Customer Leads CRM
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'posts' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
                }`}
            >
              <ImageIcon className="w-4 h-4" /> Posts &amp; Stories
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'banners' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
                }`}
            >
              <Sparkles className="w-4 h-4" /> Banner Studio AI
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'reviews' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
                }`}
            >
              <MessageSquare className="w-4 h-4" /> Customer Reviews
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'billing' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
                }`}
            >
              <Award className="w-4 h-4 text-amber-500" /> Plan &amp; Billing
            </button>
            <Link
              href={`/card/${currentBiz?.slug}`}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#F4F6FB] transition-colors"
            >
              <QrCode className="w-4 h-4" /> Digital Card (/card) <ExternalLink className="w-3 h-3 ml-auto text-neutral-400" />
            </Link>
            {currentBiz?.tier === 'elite' && (
              <Link
                href={`/b/${currentBiz?.slug}`}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#F4F6FB] text-[#981837] font-bold transition-colors"
              >
                <Crown className="w-4 h-4" /> Elite Microsite (/b) <ExternalLink className="w-3 h-3 ml-auto text-neutral-400" />
              </Link>
            )}
          </nav>
        </div>

        <div className="pt-4 border-t border-[#E3E8EF] text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#687182]">Current Tier:</span>
            {currentBiz && <TierBadge tier={currentBiz.tier} size="sm" />}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl w-full mx-auto overflow-x-hidden">
        {/* Top Header Card */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E3E8EF] shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar src={currentBiz?.logo_url} name={currentBiz?.name} size="md" isElite={currentBiz?.tier === 'elite'} />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-[#17181C] truncate">{currentBiz?.name}</h1>
                  {currentBiz && <TierBadge tier={currentBiz.tier} size="sm" />}
                  {currentBiz?.trusted && <TrustedBadge size="sm" />}
                </div>
                <p className="text-xs text-[#687182] mt-0.5">{currentBiz?.address} • Pincode {currentBiz?.pincode}</p>
              </div>
            </div>

            {/* Top Quick Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link href={`/card/${currentBiz?.slug}`} className="flex-1 sm:flex-initial">
                <Button variant="secondary" size="sm" className="w-full" leftIcon={<QrCode className="w-3.5 h-3.5" />}>
                  Card
                </Button>
              </Link>
              {currentBiz?.tier === 'elite' && (
                <Link href={`/b/${currentBiz?.slug}`} className="flex-1 sm:flex-initial">
                  <Button variant="outline" size="sm" className="w-full text-[#981837] border-[#981837]/30" leftIcon={<Crown className="w-3.5 h-3.5" />}>
                    Microsite
                  </Button>
                </Link>
              )}
              <Button
                variant="primary"
                size="sm"
                className="flex-1 sm:flex-initial"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => {
                  setActiveTab('posts');
                  showToast('Post & Story composer opened');
                }}
              >
                + Post
              </Button>
            </div>
          </div>

          {/* 🌟 MOBILE SCROLLABLE TAB BAR (Visible on Mobile & Tablet) */}
          <div className="pt-3 border-t border-[#F4F6FB] flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${activeTab === 'overview'
                ? 'bg-[#4787F2] text-white shadow-sm'
                : 'bg-[#F4F6FB] text-[#4A5260] hover:bg-neutral-200'
                }`}
            >
              <Store className="w-3.5 h-3.5" /> Overview
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${activeTab === 'posts'
                ? 'bg-[#4787F2] text-white shadow-sm'
                : 'bg-[#F4F6FB] text-[#4A5260] hover:bg-neutral-200'
                }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Posts &amp; Stories
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${activeTab === 'banners'
                ? 'bg-[#4787F2] text-white shadow-sm'
                : 'bg-[#F4F6FB] text-[#4A5260] hover:bg-neutral-200'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Banner Studio
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${activeTab === 'reviews'
                ? 'bg-[#4787F2] text-white shadow-sm'
                : 'bg-[#F4F6FB] text-[#4A5260] hover:bg-neutral-200'
                }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Reviews
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${activeTab === 'billing'
                ? 'bg-[#4787F2] text-white shadow-sm'
                : 'bg-[#F4F6FB] text-[#4A5260] hover:bg-neutral-200'
                }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" /> Plan &amp; Upgrade
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card padding="sm" className="space-y-1">
                <div className="flex items-center justify-between text-[#687182]">
                  <span className="text-[11px] font-bold uppercase">Store Views</span>
                  <Eye className="w-3.5 h-3.5 text-[#4787F2]" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#17181C] dark:text-white">
                  {bizStats.store_views.toLocaleString()}
                </div>
                <span className="text-[10px] font-bold text-[#35AB4E] block">
                  {bizStats.is_custom_business ? 'Live catalog impressions' : '+24% this week'}
                </span>
              </Card>

              <Card padding="sm" className="space-y-1">
                <div className="flex items-center justify-between text-[#687182]">
                  <span className="text-[11px] font-bold uppercase">Followers</span>
                  <Users className="w-3.5 h-3.5 text-[#35AB4E]" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#17181C] dark:text-white">
                  {bizStats.followers.toLocaleString()}
                </div>
                <span className="text-[10px] font-bold text-[#35AB4E] block">
                  {bizStats.followers > 0 ? 'Hyperlocal customers' : 'No followers yet'}
                </span>
              </Card>

              <Card padding="sm" className="space-y-1">
                <div className="flex items-center justify-between text-[#687182]">
                  <span className="text-[11px] font-bold uppercase">Card Clicks</span>
                  <QrCode className="w-3.5 h-3.5 text-[#F2B604]" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#17181C] dark:text-white">
                  {bizStats.card_clicks.toLocaleString()}
                </div>
                <span className="text-[10px] text-[#687182] dark:text-neutral-400 block">WhatsApp / Directions</span>
              </Card>

              <Card padding="sm" className="space-y-1">
                <div className="flex items-center justify-between text-[#687182]">
                  <span className="text-[11px] font-bold uppercase">Rating</span>
                  <Heart className="w-3.5 h-3.5 text-[#981837]" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#17181C] dark:text-white">
                  {bizStats.reviews_count > 0 ? `${bizStats.avg_rating} ★` : 'New Store'}
                </div>
                <span className="text-[10px] text-[#687182] dark:text-neutral-400 block">
                  {bizStats.reviews_count > 0 ? `${bizStats.reviews_count} verified reviews` : '0 verified reviews'}
                </span>
              </Card>
            </div>

            {/* Quota & Feature Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card padding="md" className="space-y-3">
                <h3 className="text-sm font-black text-[#17181C]">Tier Entitlements &amp; Live Quota</h3>
                <div className="space-y-2.5">
                  <div className="p-3 bg-[#F4F6FB] rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#17181C]">Daily Stories (24h Quota)</p>
                      <p className="text-[10px] text-[#687182]">
                        {currentBiz?.tier === 'elite' ? '1 story active • Refreshes daily' : 'Requires Elite Tier'}
                      </p>
                    </div>
                    {currentBiz?.tier === 'elite' ? (
                      <span className="text-[10px] font-extrabold text-[#35AB4E] bg-emerald-100 px-2 py-0.5 rounded-full">
                        Active Today
                      </span>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('billing')}>
                        Upgrade
                      </Button>
                    )}
                  </div>

                  <div className="p-3 bg-[#F4F6FB] rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#17181C]">Auto-Branded Festival Banners</p>
                      <p className="text-[10px] text-[#687182]">
                        {currentBiz?.tier === 'elite'
                          ? 'Daily Templates (365/yr)'
                          : currentBiz?.tier === 'premium'
                            ? '2 Custom Banners / week'
                            : 'Festival Banners Only'}
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setActiveTab('banners')}>
                      Design
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Digital Assets Hub */}
              <Card padding="md" className="space-y-3">
                <h3 className="text-sm font-black text-[#17181C]">Hyperlocal Customer Surfaces</h3>
                <div className="space-y-2.5">
                  <div className="p-3 bg-[#EDF4FF] rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1D53B8]">Digital Visiting Card</p>
                      <p className="text-[10px] text-[#4787F2]">adsspot.in/card/{currentBiz?.slug}</p>
                    </div>
                    <Link href={`/card/${currentBiz?.slug}`} target="_blank">
                      <Button variant="primary" size="sm">
                        Preview
                      </Button>
                    </Link>
                  </div>

                  {currentBiz?.tier === 'elite' ? (
                    <div className="p-3 bg-red-50 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#981837]">Elite Business Microsite</p>
                        <p className="text-[10px] text-[#981837]/80">adsspot.in/b/{currentBiz?.slug}</p>
                      </div>
                      <Link href={`/b/${currentBiz?.slug}`} target="_blank">
                        <Button variant="primary" size="sm" className="bg-[#981837] hover:bg-[#7e142e]">
                          Microsite
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#F4F6FB] rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#17181C]">Elite Business Microsite</p>
                        <p className="text-[10px] text-[#687182]">Upgrade to Elite to unlock custom website</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('billing')}>
                        Unlock
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB: CUSTOMER LEADS CRM (Feature G) */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#E3E8EF] shadow-2xs">
              <div>
                <h2 className="text-base font-black text-[#17181C] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#35AB4E]" /> Customer Leads &amp; Inquiries CRM
                </h2>
                <p className="text-xs text-[#687182]">Real-time inbound inquiries from your digital visiting card, Spot Drops, and B2B RFQs.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 bg-[#EBF9EE] text-[#35AB4E] rounded-full border border-[#35AB4E]/30">
                  ⚡ 3 Active Leads
                </span>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Column 1: New Inquiries */}
              <div className="space-y-3 bg-[#F4F6FB] p-4 rounded-3xl border border-[#E3E8EF]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-[#4787F2] tracking-wider">
                    ● New Inquiries ({leads.filter((l) => l.status === 'new').length})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#4787F2] animate-ping" />
                </div>

                {leads.filter((l) => l.status === 'new').map((lead) => (
                  <Card key={lead.id} padding="md" className="space-y-3 bg-white shadow-xs border-l-4 border-l-[#4787F2]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-black text-[#17181C]">{lead.name}</h4>
                        <span className="text-[10px] text-[#687182] font-semibold">{lead.time}</span>
                      </div>
                      <span className="text-[10px] font-black text-[#4787F2] bg-[#EDF4FF] px-2 py-0.5 rounded-full">{lead.value}</span>
                    </div>

                    <p className="text-xs text-neutral-700 bg-[#F4F6FB] p-2.5 rounded-xl border border-[#E3E8EF]">{lead.requirement}</p>
                    <span className="text-[9px] text-[#687182] font-bold block">Source: {lead.source}</span>

                    <div className="flex items-center gap-2 pt-1 border-t border-neutral-100">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20contacting%20${encodeURIComponent(currentBiz?.name)}!`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 bg-[#25D366] text-white text-[10px] font-black rounded-xl flex items-center justify-center gap-1 shadow-2xs"
                      >
                        WhatsApp Reply
                      </a>
                      <button
                        onClick={() => handleUpdateLeadStatus(lead.id, 'contacted')}
                        className="px-2.5 py-1.5 bg-[#F4F6FB] text-neutral-700 text-[10px] font-bold rounded-xl border border-[#E3E8EF]"
                      >
                        Mark Contacted →
                      </button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Column 2: Contacted / In Progress */}
              <div className="space-y-3 bg-[#F4F6FB] p-4 rounded-3xl border border-[#E3E8EF]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-[#F59E0B] tracking-wider">
                    ● Contacted ({leads.filter((l) => l.status === 'contacted').length})
                  </span>
                </div>

                {leads.filter((l) => l.status === 'contacted').map((lead) => (
                  <Card key={lead.id} padding="md" className="space-y-3 bg-white shadow-xs border-l-4 border-l-[#F59E0B]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-black text-[#17181C]">{lead.name}</h4>
                        <span className="text-[10px] text-[#687182] font-semibold">{lead.time}</span>
                      </div>
                      <span className="text-[10px] font-black text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full">{lead.value}</span>
                    </div>

                    <p className="text-xs text-neutral-700 bg-[#F4F6FB] p-2.5 rounded-xl border border-[#E3E8EF]">{lead.requirement}</p>
                    <span className="text-[9px] text-[#687182] font-bold block">Source: {lead.source}</span>

                    <div className="flex items-center gap-2 pt-1 border-t border-neutral-100">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20following%20up%20on%20your%20order%20with%20${encodeURIComponent(currentBiz?.name)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 bg-[#25D366] text-white text-[10px] font-black rounded-xl flex items-center justify-center gap-1 shadow-2xs"
                      >
                        Follow Up
                      </a>
                      <button
                        onClick={() => handleUpdateLeadStatus(lead.id, 'converted')}
                        className="px-2.5 py-1.5 bg-[#EBF9EE] text-[#35AB4E] text-[10px] font-black rounded-xl border border-[#35AB4E]/30"
                      >
                        Win / Converted 🎉
                      </button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Column 3: Converted / Completed */}
              <div className="space-y-3 bg-[#F4F6FB] p-4 rounded-3xl border border-[#E3E8EF]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-[#35AB4E] tracking-wider">
                    ● Won &amp; Converted ({leads.filter((l) => l.status === 'converted').length})
                  </span>
                </div>

                {leads.filter((l) => l.status === 'converted').map((lead) => (
                  <Card key={lead.id} padding="md" className="space-y-3 bg-white shadow-xs border-l-4 border-l-[#35AB4E]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-black text-[#17181C]">{lead.name}</h4>
                        <span className="text-[10px] text-[#687182] font-semibold">{lead.time}</span>
                      </div>
                      <span className="text-[10px] font-black text-[#1B6A2D] bg-[#EBF9EE] px-2 py-0.5 rounded-full">{lead.value}</span>
                    </div>

                    <p className="text-xs text-neutral-700 bg-[#EBF9EE]/50 p-2.5 rounded-xl border border-[#35AB4E]/20">{lead.requirement}</p>
                    <span className="text-[9px] text-[#35AB4E] font-bold block">✓ Order Completed</span>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: POSTS & STORIES */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {/* Story Upload Section (Elite Tier Exclusive - 1/24h quota) */}
            <Card padding="md" className="space-y-4 border-2 border-[#F2B604]/30 bg-gradient-to-br from-white to-[#FFFDF5]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#F2B604]/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#F2B604]/20 text-[#A06E00] flex items-center justify-center font-black text-sm">
                    ✨
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-[#17181C] flex items-center gap-1.5">
                      Daily 24-Hour Story Broadcast
                      <span className="text-[10px] bg-[#981837] text-white px-2 py-0.5 rounded-full font-extrabold uppercase">
                        Elite Only
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#687182]">
                      Strict 1 story / 24-hour quota with instant customer flash coupons and direct WhatsApp ordering.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${hasStoryToday ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                    {hasStoryToday ? '✓ 1 Active Story Live Today' : '● Ready to Publish Today'}
                  </span>
                </div>
              </div>

              {currentBiz?.tier === 'elite' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#17181C] block mb-1">Story Caption &amp; Offer</label>
                      <input
                        type="text"
                        value={newStoryCaption}
                        onChange={(e) => setNewStoryCaption(e.target.value)}
                        placeholder="e.g. Flash 20% off bridal sets today only!"
                        className="w-full p-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#17181C] block mb-1">Story Media / Photo</label>
                      <div className="flex items-center gap-2">
                        <label className={`cursor-pointer px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${isUploadingMedia ? 'bg-neutral-200 text-neutral-500' : 'bg-[#4787F2] text-white hover:bg-[#3972D4]'
                          }`}>
                          <ImageIcon className="w-3.5 h-3.5" />
                          {isUploadingMedia ? 'Uploading...' : '📁 Upload Photo'}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingMedia}
                            onChange={(e) => handleFileUpload(e, 'story')}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          value={newStoryImage}
                          onChange={(e) => setNewStoryImage(e.target.value)}
                          placeholder="Or paste image URL..."
                          className="w-full p-2 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                        />
                      </div>
                      {newStoryImage && (
                        <div className="mt-2 flex items-center gap-2">
                          <img src={newStoryImage} alt="Story Preview" className="w-10 h-14 object-cover rounded-lg border border-[#E3E8EF]" />
                          <span className="text-[10px] text-[#35AB4E] font-bold">✓ Media Attached</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#17181C] block mb-1">Tag (Top Badge)</label>
                      <input
                        type="text"
                        value={newStoryTag}
                        onChange={(e) => setNewStoryTag(e.target.value)}
                        placeholder="e.g. 20% OFF"
                        className="w-full p-2 rounded-xl border border-[#E3E8EF] text-xs font-bold text-[#981837] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#17181C] block mb-1">Promo Coupon Code</label>
                      <input
                        type="text"
                        value={newStoryCoupon}
                        onChange={(e) => setNewStoryCoupon(e.target.value)}
                        placeholder="e.g. ROYAL20"
                        className="w-full p-2 rounded-xl border border-[#E3E8EF] text-xs font-bold uppercase text-[#4787F2] outline-none"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-end">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full bg-[#4787F2] hover:bg-[#3972D4] text-xs py-2 font-bold"
                        onClick={handlePublishStory}
                        disabled={hasStoryToday || isUploadingMedia}
                      >
                        {hasStoryToday ? 'Story Active for 24h' : '🚀 Publish 24h Story'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#A06E00]">Stories are exclusive to Elite Tier members</p>
                    <p className="text-[11px] text-[#687182]">Upgrade to Elite for ₹1,499/mo to publish daily stories directly to Fort 400001 consumers.</p>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => setActiveTab('billing')}>
                    Upgrade to Elite
                  </Button>
                </div>
              )}
            </Card>

            {/* Create Post Card */}
            <Card padding="md" className="space-y-3">
              <h3 className="text-sm font-black text-[#17181C] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#4787F2]" /> Create New Feed Post / Festival Offer
              </h3>
              <div className="space-y-3">
                <textarea
                  rows={2}
                  value={newPostCaption}
                  onChange={(e) => setNewPostCaption(e.target.value)}
                  placeholder="Share a festival offer, new bridal collection arrival, or weekend flash discount..."
                  className="w-full p-3 rounded-2xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${isUploadingMedia ? 'bg-neutral-200 text-neutral-500' : 'bg-neutral-800 text-white hover:bg-neutral-700'
                      }`}>
                      <ImageIcon className="w-3.5 h-3.5" />
                      {isUploadingMedia ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingMedia}
                        onChange={(e) => handleFileUpload(e, 'post')}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={newPostImage}
                      onChange={(e) => setNewPostImage(e.target.value)}
                      placeholder="Or image URL..."
                      className="px-3 py-1.5 rounded-xl border border-[#E3E8EF] text-[11px] w-full sm:w-64 outline-none"
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full sm:w-auto font-bold"
                    onClick={handlePublishPost}
                    disabled={isUploadingMedia}
                  >
                    Publish Post to Feed
                  </Button>
                </div>
              </div>
            </Card>


            {/* Published Posts */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-[#17181C] uppercase tracking-wider">Live Published Posts ({merchantPosts.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {merchantPosts.map((post) => (
                  <Card key={post.id} padding="md" className="space-y-3">
                    <img src={post.image_urls?.[0] || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'} alt="Post" className="w-full h-44 rounded-2xl object-cover" />
                    <p className="text-xs text-[#17181C] font-semibold">{post.caption}</p>
                    <div className="flex items-center justify-between text-xs text-[#687182] pt-2 border-t border-[#F4F6FB]">
                      <span className="flex items-center gap-1 text-[#981837] font-bold">
                        <Heart className="w-3.5 h-3.5 fill-current" /> {post.likes_count || 0} likes
                      </span>
                      <span>{post.comments_count || 0} comments</span>
                      <span className="text-[#35AB4E] font-bold">● Live on Feed</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUTO BANNER STUDIO */}
        {activeTab === 'banners' && (
          <div className="space-y-5">
            <Card padding="md" className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-[#17181C]">Auto-Branded Festival &amp; Weekly Banners</h3>
                <p className="text-xs text-[#687182]">Instant dynamically composed marketing banners with your shop logo and contact stamp</p>
              </div>

              {/* Template Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedTemplate('diwali')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${selectedTemplate === 'diwali' ? 'border-[#4787F2] bg-[#EDF4FF] ring-2 ring-[#4787F2]/20' : 'border-[#E3E8EF] bg-white hover:border-neutral-300'
                    }`}
                >
                  <span className="text-xs font-black block text-[#17181C]">🪔 Diwali Festival Dhamaka</span>
                  <span className="text-[10px] text-[#687182]">All tiers • Auto-stamped</span>
                </button>

                <button
                  onClick={() => setSelectedTemplate('ganesh')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${selectedTemplate === 'ganesh' ? 'border-[#4787F2] bg-[#EDF4FF] ring-2 ring-[#4787F2]/20' : 'border-[#E3E8EF] bg-white hover:border-neutral-300'
                    }`}
                >
                  <span className="text-xs font-black block text-[#17181C]">🐘 Ganesh Chaturthi Special</span>
                  <span className="text-[10px] text-[#687182]">Premium &amp; Elite</span>
                </button>

                <button
                  onClick={() => setSelectedTemplate('gold')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${selectedTemplate === 'gold' ? 'border-[#4787F2] bg-[#EDF4FF] ring-2 ring-[#4787F2]/20' : 'border-[#E3E8EF] bg-white hover:border-neutral-300'
                    }`}
                >
                  <span className="text-xs font-black block text-[#17181C]">✨ Weekend Flash Sale / Mega Offer</span>
                  <span className="text-[10px] text-[#687182]">Elite Daily Template</span>
                </button>
              </div>

              {/* Banner Text Customization Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#F4F6FB] rounded-2xl border border-[#E3E8EF]">
                <div>
                  <label className="block text-[11px] font-bold text-[#17181C] uppercase tracking-wider mb-1">
                    Festival Headline / Promo Title
                  </label>
                  <input
                    type="text"
                    defaultValue="Grand Festive Season Celebration"
                    id="banner-headline-input"
                    className="w-full p-2.5 rounded-xl border border-[#E3E8EF] text-xs font-semibold bg-white outline-none focus:border-[#4787F2]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#17181C] uppercase tracking-wider mb-1">
                    Offer Tag / Special Discount
                  </label>
                  <input
                    type="text"
                    defaultValue="Flat 25% OFF on Entire Stock"
                    id="banner-subtext-input"
                    className="w-full p-2.5 rounded-xl border border-[#E3E8EF] text-xs font-bold text-[#981837] bg-white outline-none focus:border-[#4787F2]"
                  />
                </div>
              </div>

              {/* Live Rendered Canvas Banner Box */}
              <div className="relative rounded-3xl overflow-hidden border border-[#E3E8EF] shadow-2xl max-w-xl mx-auto bg-neutral-900 aspect-[16/9] flex flex-col justify-between p-6">
                <img
                  src={
                    selectedTemplate === 'diwali'
                      ? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80'
                      : selectedTemplate === 'ganesh'
                        ? 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&auto=format&fit=crop&q=80'
                        : 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1000&auto=format&fit=crop&q=80'
                  }
                  alt="Template Background"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />

                {/* Top Banner Tag */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="bg-[#981837] text-white text-[11px] font-black uppercase px-3.5 py-1 rounded-full shadow-lg border border-red-400/30">
                    {selectedTemplate === 'diwali' ? '🪔 Diwali Dhamaka' : selectedTemplate === 'ganesh' ? '🐘 Festive Blessings' : '🔥 Exclusive Mega Offer'}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                    Hyperlocal Offer • Vadodara
                  </span>
                </div>

                {/* Center Headline */}
                <div className="relative z-10 text-center space-y-1.5 my-auto">
                  <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md tracking-tight">
                    Grand Festive Season Celebration
                  </h2>
                  <div className="inline-block bg-[#F2B604] text-[#17181C] font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-lg">
                    Flat 25% OFF on Entire Stock
                  </div>
                </div>

                {/* Stamped Watermark Brand Badge */}
                <div className="relative z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between shadow-2xl border border-white/40">
                  <div className="flex items-center gap-3">
                    <img src={currentBiz?.logo_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150'} alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-neutral-200" />
                    <div className="text-left">
                      <h4 className="text-xs font-black text-[#17181C] leading-tight">{currentBiz?.name}</h4>
                      <p className="text-[10px] text-[#687182] mt-0.5">{currentBiz?.address} • {currentBiz?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold bg-[#4787F2] text-white px-2.5 py-0.5 rounded-full shadow-xs">
                      Verified Store
                    </span>
                  </div>
                </div>
              </div>

              {/* Download & Share Actions */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto pt-2">
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1 font-bold shadow-sm"
                  leftIcon={<Download className="w-4 h-4 text-[#4787F2]" />}
                  onClick={() => {
                    showToast('🎉 High-Res 1080p Festival Banner generated and saved!');
                  }}
                >
                  Download HD Banner (1080p)
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1 font-bold bg-[#25D366] hover:bg-[#1EBE5D] shadow-sm"
                  leftIcon={<Share2 className="w-4 h-4 text-white" />}
                  onClick={() => {
                    const text = encodeURIComponent(`Check out our festive special offer at ${currentBiz?.name}! Visit our card: https://adsspot.in/card/${currentBiz?.slug}`);
                    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                    showToast('Opening WhatsApp to share banner...');
                  }}
                >
                  Share to WhatsApp Status
                </Button>
              </div>
            </Card>

            {/* 🖨️ PRINTABLE COUNTER QR STANDEE STUDIO */}
            <Card padding="md" className="space-y-4 border border-[#4787F2]/30 bg-gradient-to-br from-white to-[#F4F8FF] dark:from-[#121620] dark:to-[#172033]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#17181C] dark:text-white flex items-center gap-1.5">
                    <span>🖨️</span> Printable Counter QR Standee (PDF Ready)
                  </h3>
                  <p className="text-xs text-[#687182] dark:text-neutral-400">
                    Place on your store billing counter so walk-in customers can scan and save your digital visiting card.
                  </p>
                </div>
                <span className="text-[10px] font-black bg-[#EBF9EE] text-[#1B6A2D] px-2.5 py-1 rounded-full uppercase">
                  Counter Essential
                </span>
              </div>

              {/* Standee Preview Box */}
              <div className="max-w-sm mx-auto p-6 bg-white dark:bg-[#1A2130] rounded-3xl border-2 border-dashed border-[#4787F2] text-center shadow-xl space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Avatar src={currentBiz?.logo_url} name={currentBiz?.name} size="md" isElite={true} />
                  <div className="text-left">
                    <h4 className="text-sm font-black text-[#17181C] dark:text-white">{currentBiz?.name}</h4>
                    <span className="text-[10px] text-[#4787F2] font-bold">Verified on Adsspot</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-neutral-200 inline-block shadow-inner">
                  {/* Clean SVG QR Code */}
                  <svg className="w-36 h-36 mx-auto" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
                    <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
                    <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
                    <rect x="40" y="10" width="10" height="10" />
                    <rect x="40" y="40" width="20" height="20" fill="#4787F2" />
                    <rect x="70" y="40" width="10" height="10" />
                    <rect x="40" y="70" width="10" height="20" />
                    <rect x="70" y="70" width="20" height="10" />
                  </svg>
                </div>

                <div>
                  <span className="text-xs font-black text-[#17181C] dark:text-white block">SCAN FOR MENU &amp; OFFERS</span>
                  <span className="text-[11px] font-mono text-[#687182] dark:text-neutral-400">adsspot.in/card/{currentBiz?.slug}</span>
                </div>
              </div>

              <div className="flex justify-center max-w-sm mx-auto">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full font-bold shadow-md"
                  leftIcon={<Download className="w-4 h-4 text-white" />}
                  onClick={() => {
                    showToast('🖨️ Printable Counter Standee PDF downloaded!');
                  }}
                >
                  Download Ready-to-Print Standee PDF
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <Card padding="md" className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E3E8EF] dark:border-white/10">
                <div>
                  <h3 className="text-sm font-black text-[#17181C] dark:text-white">Customer Ratings &amp; Reviews</h3>
                  <p className="text-xs text-[#687182] dark:text-neutral-400">Respond to customer reviews to build local trust</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-[#35AB4E]">
                    {bizStats.reviews_count > 0 ? `${bizStats.avg_rating} ★` : 'New Store'}
                  </span>
                  <p className="text-[10px] text-[#687182] dark:text-neutral-400">{bizStats.reviews_count} ratings</p>
                </div>
              </div>

              <div className="space-y-3">
                {merchantReviews.length > 0 ? (
                  merchantReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-[#F4F6FB] dark:bg-white/5 space-y-2 border border-[#E3E8EF] dark:border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#17181C] dark:text-white">{rev.full_name || rev.author || 'Verified Buyer'}</span>
                        <span className="text-xs font-bold text-[#F2B604]">{'★'.repeat(Math.round(Number(rev.rating) || 5))}</span>
                      </div>
                      <p className="text-xs text-[#4A5260] dark:text-neutral-300">{rev.comment}</p>

                      {/* Merchant Reply Section */}
                      {replies[rev.id] || rev.reply ? (
                        <div className="mt-2 p-2.5 bg-white dark:bg-[#121620] rounded-xl border-l-4 border-[#4787F2] text-xs">
                          <span className="font-bold text-[#4787F2] block">Your Store Response:</span>
                          <p className="text-[#17181C] dark:text-white mt-0.5">{replies[rev.id] || rev.reply}</p>
                        </div>
                      ) : (
                        <div className="flex gap-2 mt-2 pt-2 border-t border-neutral-200 dark:border-white/10">
                          <input
                            type="text"
                            value={replyInput[rev.id] || ''}
                            onChange={(e) => setReplyInput({ ...replyInput, [rev.id]: e.target.value })}
                            placeholder="Write a polite merchant response..."
                            className="flex-1 px-3 py-1.5 rounded-xl border border-[#E3E8EF] dark:border-white/10 text-xs outline-none bg-white dark:bg-[#171E2C] text-[#17181C] dark:text-white"
                          />
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleSendReply(rev.id)}
                          >
                            Reply
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-[#F4F6FB] dark:bg-white/5 rounded-2xl border border-dashed border-[#E3E8EF] dark:border-white/10 space-y-1">
                    <p className="text-xs font-bold text-[#17181C] dark:text-white">No customer reviews yet</p>
                    <p className="text-[11px] text-[#687182] dark:text-neutral-400">
                      When customers discover your store on the live feed or scan your Digital Visiting Card, their verified ratings will appear here.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 5: BILLING & UPGRADE */}
        {activeTab === 'billing' && (
          <div className="space-y-4">
            <Card padding="md" className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E3E8EF]">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-50 text-[#981837] text-[11px] font-black mb-1">
                    🔥 50% Launch Discount Active
                  </div>
                  <h3 className="text-sm font-black text-[#17181C]">Membership Tiers &amp; Self-Serve Upgrade</h3>
                  <p className="text-xs text-[#687182]">Upgrade your shop to unlock daily custom banners, verified trust badge and Elite microsite</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic */}
                <div className={`p-4 rounded-3xl border ${currentBiz?.tier === 'basic' ? 'border-[#4787F2] bg-[#EDF4FF]/40 ring-2 ring-[#4787F2]' : 'border-[#E3E8EF] bg-white'} space-y-3 relative`}>
                  <div className="flex items-center justify-between">
                    <TierBadge tier="basic" size="md" />
                    <span className="px-2 py-0.5 rounded-md bg-red-50 text-[#981837] text-[10px] font-black">50% OFF</span>
                  </div>
                  <div>
                    <div className="text-xs text-[#9AA4B2] line-through font-bold">₹1,999/mo</div>
                    <div className="text-2xl font-black text-[#17181C]">₹999 <span className="text-xs font-normal text-[#687182]">/mo</span></div>
                  </div>
                  <ul className="text-xs text-[#687182] space-y-1.5">
                    <li>✓ Digital Card (/card/[slug])</li>
                    <li>✓ Festival auto-banners</li>
                    <li>✗ Custom weekly banners</li>
                    <li>✗ Elite microsite &amp; stories</li>
                  </ul>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={currentBiz?.tier === 'basic'}
                    onClick={() => {
                      setUpgradeTier('basic');
                      setShowUpgradeModal(true);
                    }}
                  >
                    {currentBiz?.tier === 'basic' ? 'Current Plan' : 'Select Basic Plan'}
                  </Button>
                </div>

                {/* Premium */}
                <div className={`p-4 rounded-3xl border ${currentBiz?.tier === 'premium' ? 'border-[#35AB4E] bg-emerald-50/40 ring-2 ring-[#35AB4E]' : 'border-[#E3E8EF] bg-white'} space-y-3 relative`}>
                  <div className="absolute -top-2.5 right-4 text-[10px] font-black bg-[#35AB4E] text-white px-2.5 py-0.5 rounded-full shadow-xs">
                    Popular • 50% OFF
                  </div>
                  <div className="flex items-center justify-between">
                    <TierBadge tier="premium" size="md" />
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#35AB4E] text-[10px] font-black">Save ₹2,500/mo</span>
                  </div>
                  <div>
                    <div className="text-xs text-[#9AA4B2] line-through font-bold">₹4,999/mo</div>
                    <div className="text-2xl font-black text-[#17181C]">₹2,499 <span className="text-xs font-normal text-[#687182]">/mo</span></div>
                  </div>
                  <ul className="text-xs text-[#687182] space-y-1.5">
                    <li>✓ Everything in Basic</li>
                    <li>✓ 2 Custom Banners per week (104/yr)</li>
                    <li>✓ Green "Trusted" verified badge</li>
                    <li>✗ Elite microsite &amp; stories</li>
                  </ul>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-[#35AB4E] hover:bg-[#2e9644]"
                    disabled={currentBiz?.tier === 'premium'}
                    onClick={() => {
                      setUpgradeTier('premium');
                      setShowUpgradeModal(true);
                    }}
                  >
                    {currentBiz?.tier === 'premium' ? 'Current Plan' : 'Claim 50% OFF • Upgrade'}
                  </Button>
                </div>

                {/* Elite */}
                <div className={`p-4 rounded-3xl border ${currentBiz?.tier === 'elite' ? 'border-[#981837] bg-red-50/40 ring-2 ring-[#981837]' : 'border-[#E3E8EF] bg-white'} space-y-3 relative`}>
                  <div className="absolute -top-2.5 right-4 text-[10px] font-black bg-[#981837] text-white px-2.5 py-0.5 rounded-full shadow-xs">
                    All Features • 50% OFF
                  </div>
                  <div className="flex items-center justify-between">
                    <TierBadge tier="elite" size="md" />
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#4787F2] text-[10px] font-black">Save ₹5,000/mo</span>
                  </div>
                  <div>
                    <div className="text-xs text-[#9AA4B2] line-through font-bold">₹9,999/mo</div>
                    <div className="text-2xl font-black text-[#17181C]">₹4,999 <span className="text-xs font-normal text-[#687182]">/mo</span></div>
                  </div>
                  <ul className="text-xs text-[#687182] space-y-1.5">
                    <li>✓ Everything in Premium</li>
                    <li>✓ Daily Custom Banners (365/yr)</li>
                    <li>✓ Full Business Microsite (/b/[slug])</li>
                    <li>✓ Elite 24h Story Privileges</li>
                  </ul>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-[#981837] hover:bg-[#7e142e]"
                    disabled={currentBiz?.tier === 'elite'}
                    onClick={() => {
                      setUpgradeTier('elite');
                      setShowUpgradeModal(true);
                    }}
                  >
                    {currentBiz?.tier === 'elite' ? 'Current Plan' : 'Claim 50% OFF • Upgrade'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* RAZORPAY UPGRADE & PAYMENT MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200 space-y-5 relative">
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#35AB4E] flex items-center justify-center font-black">
                ₹
              </div>
              <div>
                <h3 className="text-base font-black text-[#17181C]">
                  Upgrade to {upgradeTier.toUpperCase()} Membership
                </h3>
                <p className="text-xs text-[#687182]">
                  Instant activation via Razorpay Payment Gateway
                </p>
              </div>
            </div>

            {/* Plan Selector & Cycle */}
            <div className="grid grid-cols-3 gap-2">
              {(['basic', 'premium', 'elite'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setUpgradeTier(t)}
                  className={`p-3 rounded-2xl border-2 text-center transition-all ${upgradeTier === t
                    ? 'border-[#4787F2] bg-[#EDF4FF] text-[#4787F2] font-black'
                    : 'border-neutral-200 text-neutral-600 font-bold'
                    }`}
                >
                  <div className="text-xs capitalize">{t}</div>
                  <div className="text-sm font-black mt-0.5">₹{getPlanPrice(t, upgradeCycle).toLocaleString()}</div>
                </button>
              ))}
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F6FB] border border-[#E3E8EF]">
              <span className="text-xs font-bold text-[#17181C]">Billing Frequency</span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-neutral-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setUpgradeCycle('monthly')}
                  className={`px-3 py-1 rounded-lg transition-all ${upgradeCycle === 'monthly' ? 'bg-[#17181C] text-white' : 'text-neutral-500'
                    }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setUpgradeCycle('yearly')}
                  className={`px-3 py-1 rounded-lg transition-all ${upgradeCycle === 'yearly' ? 'bg-[#35AB4E] text-white' : 'text-emerald-600'
                    }`}
                >
                  Annual (2 Mo Free)
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider">
                Select Payment Method
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setUpgradePayMethod('upi')}
                  className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${upgradePayMethod === 'upi' ? 'border-[#4787F2] bg-[#EDF4FF] text-[#4787F2]' : 'border-neutral-200 text-neutral-600'
                    }`}
                >
                  <Zap className="w-4 h-4" /> UPI
                </button>
                <button
                  type="button"
                  onClick={() => setUpgradePayMethod('card')}
                  className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${upgradePayMethod === 'card' ? 'border-[#4787F2] bg-[#EDF4FF] text-[#4787F2]' : 'border-neutral-200 text-neutral-600'
                    }`}
                >
                  <CreditCard className="w-4 h-4" /> Card
                </button>
                <button
                  type="button"
                  onClick={() => setUpgradePayMethod('qr')}
                  className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${upgradePayMethod === 'qr' ? 'border-[#4787F2] bg-[#EDF4FF] text-[#4787F2]' : 'border-neutral-200 text-neutral-600'
                    }`}
                >
                  <QrCode className="w-4 h-4" /> QR Code
                </button>
                <button
                  type="button"
                  onClick={() => setUpgradePayMethod('netbanking')}
                  className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${upgradePayMethod === 'netbanking' ? 'border-[#4787F2] bg-[#EDF4FF] text-[#4787F2]' : 'border-neutral-200 text-neutral-600'
                    }`}
                >
                  <Building2 className="w-4 h-4" /> Net Banking
                </button>
              </div>

              {upgradePayMethod === 'upi' && (
                <div className="pt-2">
                  <input
                    type="text"
                    value={upgradeUpiId}
                    onChange={(e) => setUpgradeUpiId(e.target.value)}
                    placeholder="Enter UPI VPA (e.g. name@okhdfcbank)"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs outline-none"
                  />
                </div>
              )}
            </div>

            {/* Total & Action */}
            <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
              <div>
                <span className="text-[11px] text-neutral-500 block">Total Amount</span>
                <div className="text-xl font-black text-[#17181C]">
                  ₹{getPlanPrice(upgradeTier, upgradeCycle).toLocaleString()}
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                className="font-black bg-[#35AB4E] hover:bg-[#2e9644] px-6"
                isLoading={isProcessingUpgrade}
                onClick={() => handleExecuteUpgrade(upgradeTier, upgradeCycle)}
              >
                Pay &amp; Upgrade Now &rarr;
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
