'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth, SEED_CATEGORIES, createBusinessListing } from '@adsspot/api';
import { Card, Button, Logo } from '@adsspot/ui';
import {
  Store,
  CheckCircle,
  Crown,
  QrCode,
  ArrowRight,
  ChevronLeft,
  Clock,
  Instagram,
  Globe,
  Mail,
  CreditCard,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

// Dynamically import LocationPickerMap with SSR disabled to prevent Leaflet window errors
const LocationPickerMap = dynamic(
  () => import('@/components/LocationPickerMap').then((mod) => mod.LocationPickerMap),
  { ssr: false, loading: () => <div className="h-48 w-full bg-neutral-100 rounded-2xl animate-pulse flex items-center justify-center text-xs text-neutral-400 font-bold">Loading Interactive GPS Map...</div> }
);

const PRESET_LOGOS = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80',
];

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=1200&auto=format&fit=crop&q=80',
];

export default function BusinessRegistrationPage() {
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Core Business State
  const [bizName, setBizName] = useState('');
  const [ownerName, setOwnerName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [whatsapp, setWhatsapp] = useState(user?.phone || '');
  const [sameWhatsapp, setSameWhatsapp] = useState(true);
  const [category, setCategory] = useState(SEED_CATEGORIES[0]?.id || 'cat-1');
  const [description, setDescription] = useState('');
  
  // Location & Address State
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('400001');
  const [lat, setLat] = useState(18.9322); // Default Fort, Mumbai
  const [lng, setLng] = useState(72.8347);

  // Rich Business Profile Attributes
  const [openingHours, setOpeningHours] = useState('09:00 AM - 09:30 PM (All Days)');
  const [upiId, setUpiId] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [logoUrl, setLogoUrl] = useState(PRESET_LOGOS[0]);
  const [coverUrl, setCoverUrl] = useState(PRESET_COVERS[0]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium' | 'elite'>('elite');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const [createdSlug, setCreatedSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (sameWhatsapp) {
      setWhatsapp(val);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!bizName || !ownerName || !phone) {
      alert('Please fill out all required fields: Business Name, Owner Name, and Phone Number.');
      return;
    }

    setIsSubmitting(true);
    const generatedSlug = bizName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || `shop-${Date.now()}`;
    setCreatedSlug(generatedSlug);

    try {
      await createBusinessListing({
        name: bizName,
        slug: generatedSlug,
        owner_id: user?.id || 'usr-merchant-1',
        category_id: category,
        address: address || 'Vadodara, Gujarat',
        pincode: pincode || '390007',
        phone: phone,
        whatsapp: phone,
        tier: selectedTier,
      });

      const res = await fetch('/api/merchants/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          bizName,
          ownerName,
          phone,
          whatsapp: sameWhatsapp ? phone : whatsapp,
          categoryId: category,
          description,
          address,
          pincode,
          lat,
          lng,
          openingHours,
          upiId,
          email,
          website,
          instagram,
          logoUrl,
          coverUrl,
          tier: selectedTier,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
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
    <div className="flex-1 bg-[#F4F6FB] min-h-screen py-8 pb-32 px-4 flex items-center justify-center">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#17181C] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700 animate-fade-in whitespace-nowrap">
          <CheckCircle className="w-4 h-4 text-[#35AB4E]" />
          {toastMessage}
        </div>
      )}

      <div className="max-w-2xl w-full space-y-6">
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
            <span className="text-xs">Shop &amp; Location</span>
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

        {/* STEP 1: SHOP DETAILS & PRECISE LOCATION */}
        {step === 1 && (
          <Card padding="lg" className="bg-white rounded-3xl border border-[#E3E8EF] shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-black text-[#17181C] flex items-center gap-2">
                <Store className="w-4 h-4 text-[#4787F2]" /> Step 1: Business Profile &amp; Exact Location
              </h2>
              <p className="text-xs text-[#687182] mt-0.5">
                Provide accurate shop information and pinpoint your exact store coordinates for hyperlocal search.
              </p>
            </div>

            {/* SECTION A: BASIC BUSINESS INFO */}
            <div className="space-y-3.5 pt-1">
              <div>
                <label className="text-xs font-bold text-[#17181C] block mb-1">
                  Business / Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  placeholder="e.g. Royal Sweets & Dry Fruits"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2] font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#17181C] block mb-1">
                    Owner Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#17181C] block mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E3E8EF] text-xs bg-white outline-none focus:border-[#4787F2]"
                  >
                    {SEED_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#17181C] block mb-1">
                    Primary Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+919876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#17181C]">WhatsApp Order Number</label>
                    <label className="text-[10px] text-[#4787F2] font-semibold flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameWhatsapp}
                        onChange={(e) => {
                          setSameWhatsapp(e.target.checked);
                          if (e.target.checked) setWhatsapp(phone);
                        }}
                        className="rounded"
                      />
                      Same as phone
                    </label>
                  </div>
                  <input
                    type="tel"
                    value={sameWhatsapp ? phone : whatsapp}
                    disabled={sameWhatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+919876543210"
                    className={`w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none ${
                      sameWhatsapp ? 'bg-neutral-50 text-neutral-500' : 'focus:border-[#4787F2]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#17181C] block mb-1">
                  Business Description / Specialties
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Authentic handmade sweets, organic dry fruits, custom gift hampers, and fast local delivery."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2] resize-none"
                />
              </div>
            </div>

            {/* SECTION B: PRECISE LOCATION & MAP PIN */}
            <div className="pt-2 border-t border-neutral-100 space-y-3">
              <LocationPickerMap
                lat={lat}
                lng={lng}
                onLocationChange={(newLat, newLng) => {
                  setLat(newLat);
                  setLng(newLng);
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#17181C] block mb-1">
                    Store Address / Landmark <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Shop 12, Ground Floor, Flora Fountain, Fort"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#17181C] block mb-1">
                    Pincode Territory <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="400001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 block mb-0.5">Latitude (GPS)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white rounded-lg border border-neutral-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 block mb-0.5">Longitude (GPS)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={lng}
                    onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white rounded-lg border border-neutral-200 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* SECTION C: OPERATING HOURS, UPI & SOCIALS (COLLAPSIBLE / OPTIONAL) */}
            <div className="pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full py-2 px-3 rounded-xl bg-[#F4F6FB] hover:bg-[#EAEFF8] flex items-center justify-between text-xs font-bold text-[#17181C] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F2B604]" /> Additional Business Details (Hours, UPI, Social, Branding)
                </span>
                <span className="text-[11px] text-[#4787F2] font-semibold">
                  {showAdvanced ? 'Hide ▲' : 'Expand ▼'}
                </span>
              </button>

              {showAdvanced && (
                <div className="space-y-3.5 pt-3 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#17181C] block mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" /> Operating Hours
                      </label>
                      <input
                        type="text"
                        value={openingHours}
                        onChange={(e) => setOpeningHours(e.target.value)}
                        placeholder="e.g. 09:00 AM - 09:30 PM (Mon-Sat)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#17181C] block mb-1 flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-neutral-400" /> UPI ID for Direct Payment
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. storename@okhdfcbank"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#17181C] block mb-1 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-neutral-400" /> Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="store@example.com"
                        className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#17181C] block mb-1 flex items-center gap-1">
                        <Instagram className="w-3.5 h-3.5 text-neutral-400" /> Instagram Handle
                      </label>
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="@royalsweets"
                        className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#17181C] block mb-1 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-neutral-400" /> Website URL
                      </label>
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://royalsweets.in"
                        className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                      />
                    </div>
                  </div>

                  {/* Logo Selector */}
                  <div>
                    <label className="text-xs font-bold text-[#17181C] block mb-1.5 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-neutral-400" /> Choose Store Logo / Avatar
                    </label>
                    <div className="flex items-center gap-3 overflow-x-auto pb-1">
                      {PRESET_LOGOS.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setLogoUrl(img)}
                          className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                            logoUrl === img ? 'border-[#4787F2] ring-2 ring-[#4787F2]/30 scale-105' : 'border-neutral-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt={`Logo Preset ${i}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cover Banner Selector */}
                  <div>
                    <label className="text-xs font-bold text-[#17181C] block mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-neutral-400" /> Choose Storefront Banner Cover
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_COVERS.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCoverUrl(img)}
                          className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            coverUrl === img ? 'border-[#4787F2] ring-2 ring-[#4787F2]/30' : 'border-neutral-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt={`Cover Preset ${i}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full font-bold text-xs py-3 mt-4 flex items-center justify-center gap-1.5"
              onClick={() => {
                if (!bizName || !ownerName || !phone) {
                  alert('Please fill out Business Name, Owner Name, and Phone Number.');
                  return;
                }
                if (!address || !pincode) {
                  alert('Please provide your Store Address and Pincode Territory.');
                  return;
                }
                setStep(2);
              }}
            >
              Continue to Membership Tier <ArrowRight className="w-4 h-4" />
            </Button>
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
                <span className="font-bold text-[#4787F2]">adsspot.in/card/{createdSlug || 'my-shop'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#687182]">Verified Phone:</span>
                <span className="font-bold text-[#17181C]">{phone}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Link
                href={`/card/${createdSlug || 'royal-heritage-jewellers'}`}
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
