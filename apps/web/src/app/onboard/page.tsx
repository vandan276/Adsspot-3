'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, SEED_CATEGORIES } from '@adsspot/api';
import { Card, Button, Logo, TierBadge } from '@adsspot/ui';
import {
  Store,
  CheckCircle,
  Crown,
  ChevronLeft,
  Clock,
  Sparkles,
  Search,
  Plus,
  X,
  Upload,
  ShieldCheck,
  Check,
  User as UserIcon,
} from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface TimeSlot {
  id: string;
  opensAt: string;
  closesAt: string;
}

export default function BusinessRegistrationWizard() {
  const { user, refreshAuth } = useAuth();
  const router = useRouter();

  // Wizard Step State (1 to 6)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // STEP 1 — Business Details
  const [bizName, setBizName] = useState('');
  const [pincode, setPincode] = useState('390007');
  const [plotNo, setPlotNo] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [streetRoad, setStreetRoad] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('Alkapuri');
  const [city, setCity] = useState('Vadodara');
  const [state, setState] = useState('Gujarat');

  // STEP 2 — Contact Details
  const [title, setTitle] = useState<'Mr' | 'Mrs' | 'Ms' | 'Dr'>('Mr');
  const [ownerName, setOwnerName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [secondaryPhones, setSecondaryPhones] = useState<string[]>([]);
  const [newSecPhoneInput, setNewSecPhoneInput] = useState('');
  const [showAddSecPhone, setShowAddSecPhone] = useState(false);

  const [whatsapp, setWhatsapp] = useState(user?.phone || '');
  const [sameWhatsapp, setSameWhatsapp] = useState(true);
  const [secondaryWhatsapps, setSecondaryWhatsapps] = useState<string[]>([]);
  const [newSecWaInput, setNewSecWaInput] = useState('');
  const [showAddSecWa, setShowAddSecWa] = useState(false);

  const [landline, setLandline] = useState('');

  const [email, setEmail] = useState(user?.email || '');
  const [secondaryEmails, setSecondaryEmails] = useState<string[]>([]);
  const [newSecEmailInput, setNewSecEmailInput] = useState('');
  const [showAddSecEmail, setShowAddSecEmail] = useState(false);

  // STEP 3 — Business Timings
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: 'slot-1', opensAt: '09:00 AM', closesAt: '08:00 PM' }
  ]);

  // STEP 4 — Business Category
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [dbCategories, setDbCategories] = useState<any[]>(SEED_CATEGORIES);
  const [isSearchingCategories, setIsSearchingCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([
    SEED_CATEGORIES[0] || { id: 'cat-1', name: 'Food & Dining', slug: 'food-dining', icon: 'Utensils' }
  ]);

  // STEP 5 — Add Photos
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // STEP 6 — Plan Selection
  const [selectedPlanTier, setSelectedPlanTier] = useState<'free' | 'basic' | 'premium' | 'elite'>('free');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Draft Recovery on Mount
  useEffect(() => {
    if (user?.id || user?.phone) {
      fetch(`/api/merchants/onboard?userId=${user?.id || ''}&phone=${encodeURIComponent(user?.phone || '')}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.draft) {
            const d = data.draft;
            if (d.name) setBizName(d.name);
            if (d.pincode) setPincode(d.pincode);
            if (d.plot_no) setPlotNo(d.plot_no);
            if (d.building_name) setBuildingName(d.building_name);
            if (d.street_road) setStreetRoad(d.street_road);
            if (d.landmark) setLandmark(d.landmark);
            if (d.area) setArea(d.area);
            if (d.city) setCity(d.city);
            if (d.state) setState(d.state);

            if (d.title) setTitle(d.title);
            if (d.phone) setPhone(d.phone);
            if (d.whatsapp) setWhatsapp(d.whatsapp);
            if (d.secondary_phone) setSecondaryPhones([d.secondary_phone]);
            if (d.secondary_whatsapp) setSecondaryWhatsapps([d.secondary_whatsapp]);
            if (d.landline) setLandline(d.landline);
            if (d.email) setEmail(d.email);
            if (d.secondary_email) setSecondaryEmails([d.secondary_email]);

            if (d.photos && Array.isArray(d.photos)) {
              setUploadedPhotos(d.photos);
            } else if (d.cover_url) {
              setUploadedPhotos([d.cover_url]);
            }

            if (d.onboard_step && d.onboard_step >= 1 && d.onboard_step <= 6) {
              setStep(d.onboard_step as any);
            }
          }
        })
        .catch(() => {});
    }
  }, [user?.id, user?.phone]);

  // Category DB Search Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearchingCategories(true);
      fetch(`/api/categories?q=${encodeURIComponent(categorySearchQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.categories) {
            setDbCategories(data.categories);
          }
        })
        .catch(() => {})
        .finally(() => setIsSearchingCategories(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [categorySearchQuery]);

  // Sync WhatsApp number when primary phone changes if "Same As Mobile" is checked
  const handlePrimaryPhoneChange = (val: string) => {
    setPhone(val);
    if (sameWhatsapp) {
      setWhatsapp(val);
    }
  };

  // Step 1 Submit Action
  const handleSaveStep1 = async () => {
    if (!bizName.trim()) {
      alert('Please enter your Business Name.');
      return;
    }
    if (!pincode.trim()) {
      alert('Please enter your Pincode.');
      return;
    }
    if (!city.trim() || !state.trim()) {
      alert('Please enter City and State.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveDraftToBackend(1);
      setStep(2);
      showToast('✓ Step 1 Business Details saved to draft!');
    } catch (err: any) {
      console.warn('Draft save notice:', err);
      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2 Submit Action
  const handleSaveStep2 = async () => {
    if (!ownerName.trim()) {
      alert('Please enter Contact Person name.');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter primary Mobile Number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveDraftToBackend(2);
      setStep(3);
      showToast('✓ Step 2 Contact Details saved to draft!');
    } catch (err: any) {
      console.warn('Draft save notice:', err);
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3 Submit Action
  const handleSaveStep3 = async () => {
    if (selectedDays.length === 0) {
      alert('Please select at least one operating day for your business.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveDraftToBackend(3);
      setStep(4);
      showToast('✓ Step 3 Business Timings saved to draft!');
    } catch (err: any) {
      console.warn('Draft save notice:', err);
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 4 Submit Action
  const handleSaveStep4 = async () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category for your business.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveDraftToBackend(4);
      setStep(5);
      showToast('✓ Step 4 Categories saved to draft!');
    } catch (err: any) {
      console.warn('Draft save notice:', err);
      setStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 5 Submit Action
  const handleSaveStep5 = async () => {
    setIsSubmitting(true);
    try {
      await saveDraftToBackend(5);
      setStep(6);
      showToast('✓ Step 5 Photos saved to draft!');
    } catch (err: any) {
      console.warn('Draft save notice:', err);
      setStep(6);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save Draft Helper
  const saveDraftToBackend = async (currentStep: number) => {
    const formattedTimings = `${selectedDays.join(', ')} | ${timeSlots.map((s) => `${s.opensAt} - ${s.closesAt}`).join(', ')}`;
    await fetch('/api/merchants/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user?.id,
        isDraft: true,
        onboardStep: currentStep,
        bizName,
        pincode,
        plotNo,
        buildingName,
        streetRoad,
        landmark,
        area,
        city,
        state,
        title,
        ownerName,
        phone,
        secondaryPhone: secondaryPhones[0] || null,
        whatsapp: sameWhatsapp ? phone : whatsapp,
        secondaryWhatsapp: secondaryWhatsapps[0] || null,
        landline,
        email,
        secondaryEmail: secondaryEmails[0] || null,
        openingHours: formattedTimings,
        timings: { days: selectedDays, slots: timeSlots },
        categoryId: selectedCategories[0]?.id || 'cat-1',
        categoryIds: selectedCategories.map((c) => c.id),
        photos: uploadedPhotos,
        tier: selectedPlanTier === 'free' ? 'basic' : selectedPlanTier,
      }),
    });
  };

  // Step 6 Final Completion Action
  const handleFinalCompleteOnboarding = async () => {
    setIsSubmitting(true);
    const formattedTimings = `${selectedDays.join(', ')} | ${timeSlots.map((s) => `${s.opensAt} - ${s.closesAt}`).join(', ')}`;
    const effectiveTier = selectedPlanTier === 'free' ? 'basic' : selectedPlanTier;

    try {
      const res = await fetch('/api/merchants/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          isDraft: false, // Convert role from consumer to merchant in PostgreSQL
          onboardStep: 6,
          bizName: bizName || 'My Local Business',
          pincode,
          plotNo,
          buildingName,
          streetRoad,
          landmark,
          area,
          city,
          state,
          title,
          ownerName: ownerName || user?.full_name || 'Business Owner',
          phone,
          secondaryPhone: secondaryPhones[0] || null,
          whatsapp: sameWhatsapp ? phone : whatsapp,
          secondaryWhatsapp: secondaryWhatsapps[0] || null,
          landline,
          email,
          secondaryEmail: secondaryEmails[0] || null,
          openingHours: formattedTimings,
          timings: { days: selectedDays, slots: timeSlots },
          categoryId: selectedCategories[0]?.id || 'cat-1',
          categoryIds: selectedCategories.map((c) => c.id),
          photos: uploadedPhotos,
          coverUrl: uploadedPhotos[0] || undefined,
          tier: effectiveTier,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete registration');
      }

      await refreshAuth();
      showToast('🎉 Merchant account & business listing active!');
      setTimeout(() => {
        router.push('/merchant');
      }, 1000);
    } catch (err: any) {
      alert('Registration Notice: ' + (err?.message || 'Completed! Redirecting to Merchant Studio...'));
      await refreshAuth();
      router.push('/merchant');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Photo Upload Handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;

        // Instant client-side base64 preview for immediate feedback
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const previewUrl = loadEvt.target?.result as string;
          if (previewUrl) {
            setUploadedPhotos((prev) => {
              if (prev.includes(previewUrl)) return prev;
              return [...prev, previewUrl];
            });
          }
        };
        reader.readAsDataURL(file);

        // Upload to /api/media/upload
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('user_id', user?.id || 'usr-onboard-guest');
          formData.append('module', 'business_photos');

          const res = await fetch('/api/media/upload', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();
          if (data.success && data.file_url) {
            setUploadedPhotos((prev) => {
              // Replace preview or append real server/S3 URL
              const filtered = prev.filter((p) => !p.startsWith('data:'));
              return [...filtered, data.file_url];
            });
          }
        } catch (uploadErr) {
          console.warn('Network upload notice:', uploadErr);
        }
      }
      showToast('✓ Photo uploaded successfully!');
    } catch (err) {
      console.warn('Photo processing notice:', err);
    } finally {
      setIsUploadingPhoto(false);
      // Reset input value so user can upload the same file again if needed
      e.target.value = '';
    }
  };

  // Add Category Handler
  const handleAddCategory = (cat: any) => {
    if (!selectedCategories.some((c) => c.id === cat.id)) {
      setSelectedCategories((prev) => [...prev, cat]);
    }
  };

  // Remove Category Handler
  const handleRemoveCategory = (catId: string) => {
    if (selectedCategories.length <= 1) {
      alert('At least one primary business category must remain selected.');
      return;
    }
    setSelectedCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  return (
    <div className="flex-1 bg-[#F4F6FB] dark:bg-[#0B0E14] min-h-screen py-6 sm:py-10 pb-32 px-3 sm:px-6 flex items-center justify-center transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#17181C] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700 animate-fade-in whitespace-nowrap">
          <CheckCircle className="w-4 h-4 text-[#35AB4E]" />
          {toastMessage}
        </div>
      )}

      <div className="max-w-2xl w-full space-y-5">
        {/* Top Header */}
        <div className="text-center space-y-1.5">
          <Link href="/" className="inline-block">
            <Logo size={42} withText={true} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#17181C] dark:text-white">List Your Business on Adsspot</h1>
          <p className="text-xs sm:text-sm text-[#687182] dark:text-neutral-400 max-w-md mx-auto">
            Get your store discovered by thousands of local neighbors &amp; start receiving direct customer leads.
          </p>
        </div>

        {/* 6-Step Stepper Progress Bar */}
        <Card padding="sm" className="shadow-xs bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#687182] dark:text-neutral-400 mb-2 px-1">
            <span className="text-[#4787F2] font-black">Step {step} of 6</span>
            <span className="text-[#17181C] dark:text-white">
              {step === 1 && '1. Business Details'}
              {step === 2 && '2. Contact Details'}
              {step === 3 && '3. Business Timings'}
              {step === 4 && '4. Business Category'}
              {step === 5 && '5. Add Photos'}
              {step === 6 && '6. Select Membership'}
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s < step
                    ? 'bg-[#35AB4E]'
                    : s === step
                    ? 'bg-[#4787F2] ring-2 ring-[#4787F2]/30 animate-pulse'
                    : 'bg-neutral-200 dark:bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </Card>

        {/* Back Navigation Bar (Steps 2 to 6) */}
        {step > 1 && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#4787F2] hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Step {step - 1}</span>
            </button>
            <span className="text-[10px] text-neutral-400">All entered inputs are saved</span>
          </div>
        )}

        {/* =========================================================================
            STEP 1 — BUSINESS DETAILS
            ========================================================================= */}
        {step === 1 && (
          <Card padding="lg" className="shadow-md bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10 space-y-4">
            <div className="border-b border-[#F4F6FB] dark:border-white/10 pb-3">
              <h2 className="text-base font-black text-[#17181C] dark:text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-[#4787F2]" /> Step 1: Business Details
              </h2>
              <p className="text-xs text-[#687182] dark:text-neutral-400">
                Enter your store or business address as customers will find it locally.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {/* Business Name */}
              <div>
                <label className="block font-extrabold text-[#17181C] dark:text-neutral-200 mb-1">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kundan Jewellers / Mandap Thali"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-semibold focus:outline-none focus:border-[#4787F2]"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block font-extrabold text-[#17181C] dark:text-neutral-200 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 390007"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-semibold focus:outline-none focus:border-[#4787F2]"
                />
              </div>

              {/* Plot / Building / Shop No */}
              <div>
                <label className="block font-bold text-[#4A5260] dark:text-neutral-300 mb-1">
                  Plot No. / Building No. / Wing / Shop No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shop No. 12, G-Floor"
                  value={plotNo}
                  onChange={(e) => setPlotNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-semibold focus:outline-none focus:border-[#4787F2]"
                />
              </div>

              {/* Building Name / Market / Colony */}
              <div>
                <label className="block font-bold text-[#4A5260] dark:text-neutral-300 mb-1">
                  Building Name / Market / Colony / Society
                </label>
                <input
                  type="text"
                  placeholder="e.g. Surya Complex / Commerce House"
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-semibold focus:outline-none focus:border-[#4787F2]"
                />
              </div>

              {/* Street / Road */}
              <div>
                <label className="block font-bold text-[#4A5260] dark:text-neutral-300 mb-1">
                  Street / Road
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alkapuri Main Road / R.C. Dutt Road"
                  value={streetRoad}
                  onChange={(e) => setStreetRoad(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-semibold focus:outline-none focus:border-[#4787F2]"
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="block font-bold text-[#4A5260] dark:text-neutral-300 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near HDFC Bank Circle"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-semibold focus:outline-none focus:border-[#4787F2]"
                />
              </div>

              {/* Grid: Area, City, State */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#4A5260] dark:text-neutral-300 mb-1">Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Alkapuri"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-semibold focus:outline-none focus:border-[#4787F2]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4A5260] dark:text-neutral-300 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vadodara"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-semibold focus:outline-none focus:border-[#4787F2]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4A5260] dark:text-neutral-300 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gujarat"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-semibold focus:outline-none focus:border-[#4787F2]"
                  />
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full font-black py-3 bg-[#4787F2] hover:bg-[#3972D4] text-white shadow-md rounded-xl mt-4"
              isLoading={isSubmitting}
              onClick={handleSaveStep1}
            >
              Save and Continue &rarr;
            </Button>
          </Card>
        )}

        {/* =========================================================================
            STEP 2 — CONTACT DETAILS
            ========================================================================= */}
        {step === 2 && (
          <Card padding="lg" className="shadow-md bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10 space-y-4">
            <div className="border-b border-[#F4F6FB] dark:border-white/10 pb-3">
              <h2 className="text-base font-black text-[#17181C] dark:text-white flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[#4787F2]" /> Step 2: Contact Details
              </h2>
              <p className="text-xs text-[#687182] dark:text-neutral-400">
                How should customers and buyers contact your business?
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Title & Contact Person */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block font-bold text-[#4A5260] dark:text-neutral-300 mb-1">Title</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value as any)}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-bold focus:outline-none"
                  >
                    <option value="Mr">Mr.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Dr">Dr.</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <label className="block font-extrabold text-[#17181C] dark:text-neutral-200 mb-1">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Owner or Manager Name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-semibold focus:outline-none focus:border-[#4787F2]"
                  />
                </div>
              </div>

              {/* Primary Mobile Number */}
              <div>
                <label className="block font-extrabold text-[#17181C] dark:text-neutral-200 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => handlePrimaryPhoneChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-semibold focus:outline-none focus:border-[#4787F2]"
                />
              </div>

              {/* Secondary Mobile Numbers */}
              {secondaryPhones.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={p}
                    className="flex-1 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setSecondaryPhones(secondaryPhones.filter((_, i) => i !== idx))}
                    className="text-red-500 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {showAddSecPhone ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter secondary mobile"
                    value={newSecPhoneInput}
                    onChange={(e) => setNewSecPhoneInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSecPhoneInput.trim()) {
                        setSecondaryPhones([...secondaryPhones, newSecPhoneInput.trim()]);
                        setNewSecPhoneInput('');
                        setShowAddSecPhone(false);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-[#4787F2] text-white font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddSecPhone(true)}
                  className="text-xs font-bold text-[#4787F2] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Mobile Number
                </button>
              )}

              {/* WhatsApp Section */}
              <div className="p-3.5 rounded-2xl bg-[#F4F6FB] dark:bg-white/5 space-y-2 border border-[#E3E8EF] dark:border-white/10">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-[#17181C] dark:text-neutral-200">
                    WhatsApp Number
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#35AB4E]">
                    <input
                      type="checkbox"
                      checked={sameWhatsapp}
                      onChange={(e) => {
                        setSameWhatsapp(e.target.checked);
                        if (e.target.checked) setWhatsapp(phone);
                      }}
                      className="rounded text-[#35AB4E] focus:ring-0"
                    />
                    <span>Same As Mobile Number</span>
                  </label>
                </div>

                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={whatsapp}
                  disabled={sameWhatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 font-semibold focus:outline-none ${
                    sameWhatsapp ? 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-500' : 'bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white'
                  }`}
                />
                {/* Secondary WhatsApp Numbers */}
                {secondaryWhatsapps.map((w, idx) => (
                  <div key={idx} className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      readOnly
                      value={w}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setSecondaryWhatsapps(secondaryWhatsapps.filter((_, i) => i !== idx))}
                      className="text-red-500 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {showAddSecWa ? (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Enter secondary WhatsApp"
                      value={newSecWaInput}
                      onChange={(e) => setNewSecWaInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSecWaInput.trim()) {
                          setSecondaryWhatsapps([...secondaryWhatsapps, newSecWaInput.trim()]);
                          setNewSecWaInput('');
                          setShowAddSecWa(false);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#35AB4E] text-white font-bold text-xs"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddSecWa(true)}
                    className="text-xs font-bold text-[#35AB4E] hover:underline flex items-center gap-1 pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add WhatsApp Number
                  </button>
                )}
              </div>

              {/* Landline */}
              <div>
                <label className="block font-bold text-[#4A5260] dark:text-neutral-300 mb-1">
                  Add Landline Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0265 2345678"
                  value={landline}
                  onChange={(e) => setLandline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-semibold focus:outline-none focus:border-[#4787F2]"
                />
              </div>

              {/* Primary Email */}
              <div>
                <label className="block font-bold text-[#4A5260] dark:text-neutral-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="merchant@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-semibold focus:outline-none focus:border-[#4787F2]"
                />

                {/* Secondary Emails */}
                {secondaryEmails.map((em, idx) => (
                  <div key={idx} className="flex items-center gap-2 pt-1.5">
                    <input
                      type="text"
                      readOnly
                      value={em}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setSecondaryEmails(secondaryEmails.filter((_, i) => i !== idx))}
                      className="text-red-500 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {showAddSecEmail ? (
                  <div className="flex gap-2 pt-1.5">
                    <input
                      type="email"
                      placeholder="Enter secondary email"
                      value={newSecEmailInput}
                      onChange={(e) => setNewSecEmailInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSecEmailInput.trim()) {
                          setSecondaryEmails([...secondaryEmails, newSecEmailInput.trim()]);
                          setNewSecEmailInput('');
                          setShowAddSecEmail(false);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#4787F2] text-white font-bold text-xs"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddSecEmail(true)}
                    className="text-xs font-bold text-[#4787F2] hover:underline flex items-center gap-1 pt-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Email
                  </button>
                )}
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full font-black py-3 bg-[#4787F2] hover:bg-[#3972D4] text-white shadow-md rounded-xl mt-4"
              isLoading={isSubmitting}
              onClick={handleSaveStep2}
            >
              Save and Continue &rarr;
            </Button>
          </Card>
        )}

        {/* =========================================================================
            STEP 3 — BUSINESS TIMINGS
            ========================================================================= */}
        {step === 3 && (
          <Card padding="lg" className="shadow-md bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10 space-y-4">
            <div className="border-b border-[#F4F6FB] dark:border-white/10 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-[#17181C] dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#4787F2]" /> Step 3: Business Timings
                </h2>
                <p className="text-xs text-[#687182] dark:text-neutral-400">
                  Select operating days and custom time slots.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (selectedDays.length === DAYS_OF_WEEK.length) {
                    setSelectedDays([]);
                  } else {
                    setSelectedDays([...DAYS_OF_WEEK]);
                  }
                }}
                className="px-3 py-1 rounded-full bg-[#EDF4FF] dark:bg-[#4787F2]/20 text-[#4787F2] text-xs font-black hover:bg-[#D9E8FF]"
              >
                {selectedDays.length === DAYS_OF_WEEK.length ? 'Deselect All' : 'Select All Days'}
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Operating Days Pills */}
              <div>
                <label className="block font-extrabold text-[#17181C] dark:text-neutral-200 mb-2">
                  Select Operating Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedDays(selectedDays.filter((d) => d !== day));
                          } else {
                            setSelectedDays([...selectedDays, day]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-[#17181C] dark:bg-[#4787F2] text-white border-transparent shadow-xs'
                            : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="space-y-3 pt-2">
                <label className="block font-extrabold text-[#17181C] dark:text-neutral-200">
                  Time Slots
                </label>

                {timeSlots.map((slot, index) => (
                  <div key={slot.id} className="p-3.5 rounded-2xl bg-[#F4F6FB] dark:bg-white/5 border border-[#E3E8EF] dark:border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#4787F2] text-xs">Slot #{index + 1}</span>
                      {timeSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setTimeSlots(timeSlots.filter((s) => s.id !== slot.id))}
                          className="text-red-500 text-xs font-bold hover:underline"
                        >
                          Remove Slot
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#4A5260] dark:text-neutral-300 mb-1">Opens At</label>
                        <input
                          type="text"
                          value={slot.opensAt}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTimeSlots(timeSlots.map((s) => (s.id === slot.id ? { ...s, opensAt: val } : s)));
                          }}
                          placeholder="e.g. 09:00 AM"
                          className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4A5260] dark:text-neutral-300 mb-1">Closes At</label>
                        <input
                          type="text"
                          value={slot.closesAt}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTimeSlots(timeSlots.map((s) => (s.id === slot.id ? { ...s, closesAt: val } : s)));
                          }}
                          placeholder="e.g. 08:00 PM"
                          className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setTimeSlots([
                      ...timeSlots,
                      { id: `slot-${Date.now()}`, opensAt: '02:00 PM', closesAt: '09:00 PM' },
                    ])
                  }
                  className="text-xs font-bold text-[#4787F2] hover:underline flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Time Slot
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full font-black py-3 bg-[#4787F2] hover:bg-[#3972D4] text-white shadow-md rounded-xl mt-4"
              isLoading={isSubmitting}
              onClick={handleSaveStep3}
            >
              Save and Continue &rarr;
            </Button>
          </Card>
        )}

        {/* =========================================================================
            STEP 4 — BUSINESS CATEGORY
            ========================================================================= */}
        {step === 4 && (
          <Card padding="lg" className="shadow-md bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10 space-y-4">
            <div className="border-b border-[#F4F6FB] dark:border-white/10 pb-3">
              <h2 className="text-base font-black text-[#17181C] dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#4787F2]" /> Step 4: Business Category
              </h2>
              <p className="text-xs text-[#687182] dark:text-neutral-400">
                Search and select database categories that best represent your services.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Category Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#687182] absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search categories (e.g. Food, Doctor, Gym, Apparel)..."
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3E8EF] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#17181C] dark:text-white font-semibold focus:outline-none focus:border-[#4787F2]"
                />
                {isSearchingCategories && (
                  <span className="text-[10px] text-[#4787F2] absolute right-3 top-3 font-bold">Searching DB...</span>
                )}
              </div>

              {/* Selected Categories (Removable Chips with ×) */}
              <div>
                <label className="block font-extrabold text-[#17181C] dark:text-neutral-200 mb-1.5">
                  Selected Categories ({selectedCategories.length})
                </label>
                <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-[#EDF4FF]/50 dark:bg-[#4787F2]/10 border border-[#4787F2]/20 min-h-[50px] items-center">
                  {selectedCategories.map((cat) => (
                    <span
                      key={cat.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4787F2] text-white text-xs font-black shadow-2xs"
                    >
                      <span>{cat.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(cat.id)}
                        className="hover:bg-white/20 p-0.5 rounded-full"
                        title="Remove Category"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested / Matching Categories (with + button) */}
              <div>
                <label className="block font-extrabold text-[#17181C] dark:text-neutral-200 mb-1.5">
                  Suggested / Database Categories
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                  {dbCategories.map((cat) => {
                    const isAlreadySelected = selectedCategories.some((c) => c.id === cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        disabled={isAlreadySelected}
                        onClick={() => handleAddCategory(cat)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          isAlreadySelected
                            ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 border-transparent cursor-not-allowed'
                            : 'bg-white dark:bg-neutral-800 text-[#17181C] dark:text-white border-[#E3E8EF] dark:border-neutral-700 hover:border-[#4787F2] hover:text-[#4787F2]'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {!isAlreadySelected && <Plus className="w-3.5 h-3.5 text-[#35AB4E]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full font-black py-3 bg-[#4787F2] hover:bg-[#3972D4] text-white shadow-md rounded-xl mt-4"
              isLoading={isSubmitting}
              onClick={handleSaveStep4}
            >
              Save and Continue &rarr;
            </Button>
          </Card>
        )}

        {/* =========================================================================
            STEP 5 — ADD PHOTOS
            ========================================================================= */}
        {step === 5 && (
          <Card padding="lg" className="shadow-md bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10 space-y-4">
            <div className="border-b border-[#F4F6FB] dark:border-white/10 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-[#17181C] dark:text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#4787F2]" /> Step 5: Add Photos
                </h2>
                <p className="text-xs text-[#687182] dark:text-neutral-400">
                  Upload storefront, interior, or menu photos for your listing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep(6)}
                className="text-xs font-extrabold text-[#687182] hover:text-[#17181C] underline"
              >
                Skip this step
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* File Upload Trigger Dropzone */}
              <label className="border-2 border-dashed border-[#4787F2]/40 dark:border-[#4787F2]/30 bg-[#EDF4FF]/40 dark:bg-[#4787F2]/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#EDF4FF]/80 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-[#4787F2]/10 text-[#4787F2] flex items-center justify-center mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="font-extrabold text-[#17181C] dark:text-white text-sm">
                  {isUploadingPhoto ? 'Uploading Photo...' : 'Click to Upload Store Photos'}
                </span>
                <span className="text-[11px] text-[#687182] dark:text-neutral-400 mt-0.5">
                  Supports JPEG, PNG, WebP (Multiple Selection Supported)
                </span>
              </label>

              {/* Uploaded Photos Grid */}
              {uploadedPhotos.length > 0 && (
                <div>
                  <label className="block font-extrabold text-[#17181C] dark:text-neutral-200 mb-2">
                    Uploaded Gallery ({uploadedPhotos.length} Photos)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {uploadedPhotos.map((url, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden group aspect-square bg-neutral-100 border border-[#E3E8EF]">
                        <img src={url} alt={`Store photo ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                          title="Remove Photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full font-black py-3 bg-[#4787F2] hover:bg-[#3972D4] text-white shadow-md rounded-xl mt-4"
              isLoading={isSubmitting}
              onClick={handleSaveStep5}
            >
              Save and Continue &rarr;
            </Button>
          </Card>
        )}

        {/* =========================================================================
            STEP 6 — MEMBERSHIP / PLAN SELECTION
            ========================================================================= */}
        {step === 6 && (
          <Card padding="lg" className="shadow-md bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10 space-y-5">
            <div className="border-b border-[#F4F6FB] dark:border-white/10 pb-3">
              <h2 className="text-base font-black text-[#17181C] dark:text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#F2B604]" /> Step 6: Select Membership / Plan
              </h2>
              <p className="text-xs text-[#687182] dark:text-neutral-400">
                Choose your store tier. You can convert to a Merchant account for FREE or pick a growth plan.
              </p>
            </div>

            <div className="space-y-3.5">
              {/* 🌟 NEW 1ST OPTION: Make Merchant Account — FREE (AT TOP) */}
              <div
                onClick={() => setSelectedPlanTier('free')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  selectedPlanTier === 'free'
                    ? 'border-[#35AB4E] bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-[#35AB4E]/20'
                    : 'border-[#E3E8EF] dark:border-neutral-800 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#35AB4E] text-white text-[10px] font-black uppercase tracking-wider">
                        NEW OPTION
                      </span>
                      <h3 className="text-base font-black text-[#17181C] dark:text-white">Make Merchant Account — FREE</h3>
                    </div>
                    <p className="text-xs text-[#687182] dark:text-neutral-300">
                      Convert your account to a verified Merchant account for FREE. Includes verified store listing &amp; Digital Visiting Card.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl font-black text-[#35AB4E]">FREE</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-between text-xs font-bold text-[#1B6A2D] dark:text-emerald-400">
                  <span>✓ Standard Store Listing + Digital Visiting Card</span>
                  {selectedPlanTier === 'free' && <Check className="w-5 h-5 text-[#35AB4E]" />}
                </div>
              </div>

              {/* 2. Basic Listing */}
              <div
                onClick={() => setSelectedPlanTier('basic')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedPlanTier === 'basic'
                    ? 'border-[#4787F2] bg-[#EDF4FF]/50 dark:bg-[#4787F2]/10 ring-2 ring-[#4787F2]/20'
                    : 'border-[#E3E8EF] dark:border-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TierBadge tier="basic" size="sm" />
                    <h4 className="text-sm font-extrabold text-[#17181C] dark:text-white">Basic Listing</h4>
                  </div>
                  <span className="text-sm font-black text-[#17181C] dark:text-white">₹999 /yr</span>
                </div>
                <p className="text-xs text-[#687182] dark:text-neutral-400 mt-1">
                  Includes platform listing, digital card `/card/[slug]`, and auto festival banners.
                </p>
              </div>

              {/* 3. Premium Growth */}
              <div
                onClick={() => setSelectedPlanTier('premium')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedPlanTier === 'premium'
                    ? 'border-[#4787F2] bg-[#EDF4FF]/50 dark:bg-[#4787F2]/10 ring-2 ring-[#4787F2]/20'
                    : 'border-[#E3E8EF] dark:border-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TierBadge tier="premium" size="sm" />
                    <h4 className="text-sm font-extrabold text-[#17181C] dark:text-white">Premium Growth</h4>
                  </div>
                  <span className="text-sm font-black text-[#4787F2]">₹499 /month</span>
                </div>
                <p className="text-xs text-[#687182] dark:text-neutral-400 mt-1">
                  Basic + 2 custom weekly banners + green Trusted badge.
                </p>
              </div>

              {/* 4. Elite Hyperlocal */}
              <div
                onClick={() => setSelectedPlanTier('elite')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedPlanTier === 'elite'
                    ? 'border-[#F2B604] bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-[#F2B604]/20'
                    : 'border-[#E3E8EF] dark:border-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TierBadge tier="elite" size="sm" />
                    <h4 className="text-sm font-extrabold text-[#17181C] dark:text-white">Elite Hyperlocal</h4>
                  </div>
                  <span className="text-sm font-black text-[#A06E00] dark:text-[#F2B604]">₹1,499 /month</span>
                </div>
                <p className="text-xs text-[#687182] dark:text-neutral-400 mt-1">
                  Premium + daily banners + 24h stories + business microsite `/b/[slug]`.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full font-black py-3.5 bg-[#35AB4E] hover:bg-[#2E9644] text-white shadow-lg rounded-xl text-sm flex items-center justify-center gap-2 mt-4"
              isLoading={isSubmitting}
              onClick={handleFinalCompleteOnboarding}
            >
              <ShieldCheck className="w-5 h-5" /> Complete Registration &amp; Open Merchant Studio &rarr;
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
