'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth, SEED_BUSINESSES, SEED_POSTS, SEED_REVIEWS } from '@adsspot/api';
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
} from 'lucide-react';


export default function MerchantStudioPage() {
  const { user } = useAuth();
  const currentBiz = user?.business_profile || SEED_BUSINESSES[0]!;

  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'posts' | 'banners' | 'reviews' | 'billing'>('overview');
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string>('diwali');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const handlePublishStory = () => {
    if (currentBiz?.tier !== 'elite') {
      alert('Stories are strictly exclusive to Elite Tier merchants (1 story / 24 hours). Please upgrade your membership.');
      return;
    }
    if (hasStoryToday) {
      alert('24h Quota Reached: Elite businesses are capped at max ONE story per 24 hours.');
      return;
    }
    setHasStoryToday(true);
    showToast(`24-Hour Story published with coupon "${newStoryCoupon}"!`);
  };


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
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'overview' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <Store className="w-4 h-4" /> Business Overview
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'crm' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <Users className="w-4 h-4 text-[#35AB4E]" /> Customer Leads CRM
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'posts' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Posts &amp; Stories
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'banners' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Banner Studio AI
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'reviews' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Customer Reviews
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'billing' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
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
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#4787F2] text-white shadow-sm'
                  : 'bg-[#F4F6FB] text-[#4A5260] hover:bg-neutral-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Overview
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                activeTab === 'posts'
                  ? 'bg-[#4787F2] text-white shadow-sm'
                  : 'bg-[#F4F6FB] text-[#4A5260] hover:bg-neutral-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Posts &amp; Stories
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                activeTab === 'banners'
                  ? 'bg-[#4787F2] text-white shadow-sm'
                  : 'bg-[#F4F6FB] text-[#4A5260] hover:bg-neutral-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Banner Studio
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                activeTab === 'reviews'
                  ? 'bg-[#4787F2] text-white shadow-sm'
                  : 'bg-[#F4F6FB] text-[#4A5260] hover:bg-neutral-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Reviews
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                activeTab === 'billing'
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
                <div className="text-xl sm:text-2xl font-black text-[#17181C]">12,480</div>
                <span className="text-[10px] font-bold text-[#35AB4E] block">+24% this week</span>
              </Card>

              <Card padding="sm" className="space-y-1">
                <div className="flex items-center justify-between text-[#687182]">
                  <span className="text-[11px] font-bold uppercase">Followers</span>
                  <Users className="w-3.5 h-3.5 text-[#35AB4E]" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#17181C]">1,820</div>
                <span className="text-[10px] font-bold text-[#35AB4E] block">Hyperlocal customers</span>
              </Card>

              <Card padding="sm" className="space-y-1">
                <div className="flex items-center justify-between text-[#687182]">
                  <span className="text-[11px] font-bold uppercase">Card Clicks</span>
                  <QrCode className="w-3.5 h-3.5 text-[#F2B604]" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#17181C]">4,930</div>
                <span className="text-[10px] text-[#687182] block">WhatsApp / Directions</span>
              </Card>

              <Card padding="sm" className="space-y-1">
                <div className="flex items-center justify-between text-[#687182]">
                  <span className="text-[11px] font-bold uppercase">Rating</span>
                  <Heart className="w-3.5 h-3.5 text-[#981837]" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#17181C]">4.9 ★</div>
                <span className="text-[10px] text-[#687182] block">142 verified reviews</span>
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
                        onClick={() => {
                          setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: 'contacted' } : l)));
                          showToast('Lead moved to Contacted!');
                        }}
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
                        onClick={() => {
                          setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: 'converted' } : l)));
                          showToast('Lead Marked Converted! 🎉');
                        }}
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
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    hasStoryToday ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
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
                      <label className="text-[11px] font-bold text-[#17181C] block mb-1">Story Image URL</label>
                      <input
                        type="text"
                        value={newStoryImage}
                        onChange={(e) => setNewStoryImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full p-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                      />
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
                        disabled={hasStoryToday}
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
                    <input
                      type="text"
                      value={newPostImage}
                      onChange={(e) => setNewPostImage(e.target.value)}
                      placeholder="Image URL..."
                      className="px-3 py-1.5 rounded-xl border border-[#E3E8EF] text-[11px] w-full sm:w-64 outline-none"
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      if (!newPostCaption) return alert('Please enter a caption');
                      showToast('Post published to Fort 400001 neighborhood feed!');
                      setNewPostCaption('');
                    }}
                  >
                    Publish Post to Feed
                  </Button>
                </div>
              </div>
            </Card>


            {/* Published Posts */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-[#17181C] uppercase tracking-wider">Live Published Posts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SEED_POSTS.map((post) => (
                  <Card key={post.id} padding="md" className="space-y-3">
                    <img src={post.image_urls[0]} alt="Post" className="w-full h-44 rounded-2xl object-cover" />
                    <p className="text-xs text-[#17181C] font-semibold">{post.caption}</p>
                    <div className="flex items-center justify-between text-xs text-[#687182] pt-2 border-t border-[#F4F6FB]">
                      <span className="flex items-center gap-1 text-[#981837] font-bold">
                        <Heart className="w-3.5 h-3.5 fill-current" /> {post.likes_count} likes
                      </span>
                      <span>{post.comments_count} comments</span>
                      <span className="text-[#35AB4E] font-bold">● Published</span>
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
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedTemplate === 'diwali' ? 'border-[#4787F2] bg-[#EDF4FF]' : 'border-[#E3E8EF] bg-white'
                  }`}
                >
                  <span className="text-xs font-bold block text-[#17181C]">Diwali Festival Dhamaka</span>
                  <span className="text-[10px] text-[#687182]">All tiers • Auto-stamped</span>
                </button>

                <button
                  onClick={() => setSelectedTemplate('ganesh')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedTemplate === 'ganesh' ? 'border-[#4787F2] bg-[#EDF4FF]' : 'border-[#E3E8EF] bg-white'
                  }`}
                >
                  <span className="text-xs font-bold block text-[#17181C]">Ganesh Chaturthi Special</span>
                  <span className="text-[10px] text-[#687182]">Premium &amp; Elite</span>
                </button>

                <button
                  onClick={() => setSelectedTemplate('gold')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedTemplate === 'gold' ? 'border-[#4787F2] bg-[#EDF4FF]' : 'border-[#E3E8EF] bg-white'
                  }`}
                >
                  <span className="text-xs font-bold block text-[#17181C]">Luxury Bridal Showcase</span>
                  <span className="text-[10px] text-[#687182]">Elite Daily Template</span>
                </button>
              </div>

              {/* Preview Box */}
              <div className="relative rounded-3xl overflow-hidden border border-[#E3E8EF] shadow-lg max-w-lg mx-auto bg-neutral-900">
                <img
                  src={
                    selectedTemplate === 'diwali'
                      ? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
                      : selectedTemplate === 'ganesh'
                        ? 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800'
                        : 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'
                  }
                  alt="Template"
                  className="w-full h-64 object-cover opacity-85"
                />

                {/* Stamped Watermark Brand Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between shadow-xl border border-neutral-200">
                  <div className="flex items-center gap-2.5">
                    <img src={currentBiz?.logo_url || ''} alt="Logo" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-black text-[#17181C] leading-none">{currentBiz?.name}</h4>
                      <p className="text-[10px] text-[#687182] mt-0.5">{currentBiz?.address} • {currentBiz?.phone}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold bg-[#4787F2] text-white px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
              </div>

              {/* Download & Share Actions */}
              <div className="flex gap-2 max-w-lg mx-auto">
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1 font-bold"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={() => showToast('High-res banner downloaded to device!')}
                >
                  Download HD Banner
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1 font-bold bg-[#25D366] hover:bg-[#1EBE5D]"
                  leftIcon={<Share2 className="w-4 h-4" />}
                  onClick={() => showToast('Banner ready to share on WhatsApp Business Status!')}
                >
                  Share to WhatsApp
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <Card padding="md" className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E3E8EF]">
                <div>
                  <h3 className="text-sm font-black text-[#17181C]">Customer Ratings &amp; Reviews</h3>
                  <p className="text-xs text-[#687182]">Respond to customer reviews to build local trust</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-[#35AB4E]">4.9 ★</span>
                  <p className="text-[10px] text-[#687182]">142 ratings</p>
                </div>
              </div>

              <div className="space-y-3">
                {SEED_REVIEWS.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-[#F4F6FB] space-y-2 border border-[#E3E8EF]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#17181C]">Aarav Sharma</span>
                      <span className="text-xs font-bold text-[#F2B604]">{'★'.repeat(rev.rating)}</span>
                    </div>
                    <p className="text-xs text-[#4A5260]">{rev.comment}</p>

                    {/* Merchant Reply Section */}
                    {replies[rev.id] || rev.reply ? (
                      <div className="mt-2 p-2.5 bg-white rounded-xl border-l-4 border-[#4787F2] text-xs">
                        <span className="font-bold text-[#4787F2] block">Your Store Response:</span>
                        <p className="text-[#17181C] mt-0.5">{replies[rev.id] || rev.reply}</p>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-2 pt-2 border-t border-neutral-200">
                        <input
                          type="text"
                          value={replyInput[rev.id] || ''}
                          onChange={(e) => setReplyInput({ ...replyInput, [rev.id]: e.target.value })}
                          placeholder="Write a polite merchant response..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-[#E3E8EF] text-xs outline-none bg-white"
                        />
                        <Button variant="primary" size="sm" onClick={() => handleSendReply(rev.id)}>
                          Reply
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
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
                  <h3 className="text-sm font-black text-[#17181C]">Membership Tiers &amp; Self-Serve Upgrade</h3>
                  <p className="text-xs text-[#687182]">Select a tier to unlock daily custom banners and Elite microsites</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic */}
                <div className={`p-4 rounded-3xl border ${currentBiz?.tier === 'basic' ? 'border-[#4787F2] bg-[#EDF4FF]/40 ring-2 ring-[#4787F2]' : 'border-[#E3E8EF] bg-white'} space-y-3`}>
                  <TierBadge tier="basic" size="md" />
                  <div className="text-2xl font-black text-[#17181C]">₹999 <span className="text-xs font-normal text-[#687182]">/mo</span></div>
                  <ul className="text-xs text-[#687182] space-y-1.5">
                    <li>✓ Digital Card (/card/[slug])</li>
                    <li>✓ Festival auto-banners</li>
                    <li>✗ Custom weekly banners</li>
                    <li>✗ Elite microsite &amp; stories</li>
                  </ul>
                  <Button variant="outline" size="sm" className="w-full" disabled={currentBiz?.tier === 'basic'}>
                    {currentBiz?.tier === 'basic' ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </div>

                {/* Premium */}
                <div className={`p-4 rounded-3xl border ${currentBiz?.tier === 'premium' ? 'border-[#35AB4E] bg-emerald-50/40 ring-2 ring-[#35AB4E]' : 'border-[#E3E8EF] bg-white'} space-y-3 relative`}>
                  <div className="absolute top-3 right-3 text-[10px] font-extrabold bg-[#EBF9EE] text-[#1B6A2D] px-2 py-0.5 rounded-full">
                    Popular
                  </div>
                  <TierBadge tier="premium" size="md" />
                  <div className="text-2xl font-black text-[#17181C]">₹2,499 <span className="text-xs font-normal text-[#687182]">/mo</span></div>
                  <ul className="text-xs text-[#687182] space-y-1.5">
                    <li>✓ Everything in Basic</li>
                    <li>✓ 2 Custom Banners per week</li>
                    <li>✓ Green "Trusted" verified badge</li>
                    <li>✗ Elite microsite &amp; stories</li>
                  </ul>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-[#35AB4E] hover:bg-[#2e9644]"
                    disabled={currentBiz?.tier === 'premium'}
                    onClick={() => showToast('Upgraded to Premium! Green Trusted badge enabled.')}
                  >
                    {currentBiz?.tier === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
                  </Button>
                </div>

                {/* Elite */}
                <div className={`p-4 rounded-3xl border ${currentBiz?.tier === 'elite' ? 'border-[#981837] bg-red-50/40 ring-2 ring-[#981837]' : 'border-[#E3E8EF] bg-white'} space-y-3 relative`}>
                  <div className="absolute top-3 right-3 text-[10px] font-extrabold bg-red-100 text-[#981837] px-2 py-0.5 rounded-full">
                    All Features
                  </div>
                  <TierBadge tier="elite" size="md" />
                  <div className="text-2xl font-black text-[#17181C]">₹4,999 <span className="text-xs font-normal text-[#687182]">/mo</span></div>
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
                    onClick={() => showToast('Upgraded to Elite! Microsite and 24h Stories unlocked.')}
                  >
                    {currentBiz?.tier === 'elite' ? 'Current Plan' : 'Upgrade to Elite'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
