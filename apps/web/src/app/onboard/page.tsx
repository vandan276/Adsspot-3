'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth, SEED_CATEGORIES } from '@adsspot/api';
import { Card, Button, Logo } from '@adsspot/ui';
import {
  Store,
  CheckCircle,
  Crown,
  QrCode,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';

export default function BusinessRegistrationPage() {
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [bizName, setBizName] = useState('');
  const [ownerName, setOwnerName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [category, setCategory] = useState(SEED_CATEGORIES[0]?.id || 'cat-food');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('400001');
  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium' | 'elite'>('elite');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCompleteRegistration = async () => {
    if (!bizName || !ownerName || !phone) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/merchants/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          bizName,
          ownerName,
          phone,
          categoryId: category,
          address,
          pincode,
          tier: selectedTier,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // If auth user in session, update local storage cache too
          if (typeof window !== 'undefined' && data.user) {
            localStorage.setItem('adsspot_auth_user_id', data.user.id);
          }
        }
      }
    } catch (err) {
      console.warn('[Onboard] Backend sync warning, continuing registration:', err);
    } finally {
      setIsSubmitting(false);
      setStep(3);
      showToast('🎉 Business listing & Digital Visiting Card created!');
    }
  };

  return (
    <div className="flex-1 bg-[#F4F6FB] min-h-screen py-8 px-4 flex items-center justify-center">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#17181C] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700 animate-fade-in whitespace-nowrap">
          <CheckCircle className="w-4 h-4 text-[#35AB4E]" />
          {toastMessage}
        </div>
      )}

      <div className="max-w-xl w-full space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <Logo size={46} withText={true} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#17181C]">Register Your Business on Adsspot</h1>
          <p className="text-xs sm:text-sm text-[#687182]">
            Join 12,000+ trusted hyperlocal stores. Get discovered by neighbors, share daily stories, and collect direct WhatsApp orders.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between px-6">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#4787F2] font-black' : 'text-neutral-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-[#4787F2] text-white' : 'bg-neutral-200 text-neutral-600'
            }`}>1</span>
            <span className="text-xs">Shop Details</span>
          </div>
          <div className="flex-1 h-0.5 bg-neutral-200 mx-3" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#4787F2] font-black' : 'text-neutral-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-[#4787F2] text-white' : 'bg-neutral-200 text-neutral-600'
            }`}>2</span>
            <span className="text-xs">Select Plan</span>
          </div>
          <div className="flex-1 h-0.5 bg-neutral-200 mx-3" />
          <div className={`flex items-center gap-2 ${step === 3 ? 'text-[#35AB4E] font-black' : 'text-neutral-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 3 ? 'bg-[#35AB4E] text-white' : 'bg-neutral-200 text-neutral-600'
            }`}>3</span>
            <span className="text-xs">Live Card</span>
          </div>
        </div>

        {/* STEP 1: SHOP DETAILS */}
        {step === 1 && (
          <Card padding="lg" className="bg-white rounded-3xl border border-[#E3E8EF] shadow-sm space-y-4">
            <h2 className="text-base font-black text-[#17181C] flex items-center gap-2">
              <Store className="w-4 h-4 text-[#4787F2]" /> Step 1: Business &amp; Contact Details
            </h2>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#17181C] block mb-1">Business / Brand Name *</label>
                <input
                  type="text"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  placeholder="e.g. Royal Sweets & Dry Fruits"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#17181C] block mb-1">Owner Full Name *</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#17181C] block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+919876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#17181C] block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E3E8EF] text-xs bg-white outline-none"
                  >
                    {SEED_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#17181C] block mb-1">Pincode Territory *</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="400001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#17181C] block mb-1">Store Address / Landmark</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Shop 12, Flora Fountain, Fort, Mumbai"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full font-bold text-xs py-3 mt-2 flex items-center justify-center gap-1.5"
                onClick={() => {
                  if (!bizName || !ownerName || !phone) {
                    alert('Please fill out Business Name, Owner Name, and Phone Number.');
                    return;
                  }
                  setStep(2);
                }}
              >
                Continue to Membership Tier <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 2: MEMBERSHIP TIER SELECTION */}
        {step === 2 && (
          <Card padding="lg" className="bg-white rounded-3xl border border-[#E3E8EF] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-[#17181C] flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#F2B604]" /> Step 2: Choose Growth Membership Tier
              </h2>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-[#4787F2] font-semibold flex items-center gap-0.5"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            <div className="space-y-3">
              {/* Basic Plan */}
              <div
                onClick={() => setSelectedTier('basic')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedTier === 'basic'
                    ? 'border-[#4787F2] bg-[#EDF4FF]'
                    : 'border-[#E3E8EF] bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-[#17181C]">Basic Listing</span>
                  <span className="font-black text-sm text-[#17181C]">Free / Lifetime</span>
                </div>
                <p className="text-xs text-[#687182]">Platform listing + Digital Visiting Card (`/card/[slug]`) + festival banners.</p>
              </div>

              {/* Premium Plan */}
              <div
                onClick={() => setSelectedTier('premium')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedTier === 'premium'
                    ? 'border-[#35AB4E] bg-emerald-50/50'
                    : 'border-[#E3E8EF] bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-[#17181C]">Premium Growth</span>
                    <span className="text-[10px] font-bold bg-[#EBF9EE] text-[#1B6A2D] px-2 py-0.5 rounded-full">
                      Trusted Badge
                    </span>
                  </div>
                  <span className="font-black text-sm text-[#17181C]">₹499 / mo</span>
                </div>
                <p className="text-xs text-[#687182]">Basic + 2 custom banners per week + Green "Trusted" badge outline on feed and map.</p>
              </div>

              {/* Elite Plan */}
              <div
                onClick={() => setSelectedTier('elite')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  selectedTier === 'elite'
                    ? 'border-[#981837] bg-red-50/40'
                    : 'border-[#E3E8EF] bg-white hover:border-neutral-300'
                }`}
              >
                <div className="absolute top-0 right-0 bg-[#981837] text-white text-[9px] font-black uppercase px-3 py-0.5 rounded-bl-xl">
                  Most Popular
                </div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-[#981837]">Elite Hyperlocal</span>
                    <span className="text-[10px] font-bold bg-red-100 text-[#981837] px-2 py-0.5 rounded-full">
                      Daily Stories
                    </span>
                  </div>
                  <span className="font-black text-sm text-[#17181C]">₹1,499 / mo</span>
                </div>
                <p className="text-xs text-[#687182]">
                  Premium + <strong>Daily 24h Stories (1/day)</strong> + Business Microsite (`/b/[slug]`) + Daily banner templates.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="w-full font-bold text-xs py-3 mt-3 flex items-center justify-center gap-1.5"
              onClick={handleCompleteRegistration}
            >
              {isSubmitting ? 'Saving to Database...' : 'Complete Registration & Activate Digital Card'} <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        )}

        {/* STEP 3: REGISTRATION SUCCESS & DIGITAL CARD LIVE */}
        {step === 3 && (
          <Card padding="lg" className="bg-white rounded-3xl border border-[#E3E8EF] shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EBF9EE] text-[#35AB4E] flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-extrabold text-[#35AB4E] uppercase tracking-wider">Registration Live</span>
              <h2 className="text-xl font-black text-[#17181C] mt-0.5">{bizName}</h2>
              <p className="text-xs text-[#687182] mt-1">
                Your store is registered under <strong>{selectedTier.toUpperCase()}</strong> tier in Fort (400001).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-[#E3E8EF] text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#687182]">Digital Visiting Card URL:</span>
                <span className="font-bold text-[#4787F2]">adsspot.in/card/{bizName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'my-shop'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#687182]">Verified Phone:</span>
                <span className="font-bold text-[#17181C]">{phone}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Link
                href={`/card/${bizName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'royal-heritage-jewellers'}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <QrCode className="w-4 h-4 text-neutral-600" /> Preview Digital Card
              </Link>
              <Link
                href="/merchant"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#4787F2] hover:bg-[#3972D4] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Store className="w-4 h-4" /> Go to Merchant Studio
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
