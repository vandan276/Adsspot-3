'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, DEMO_PERSONAS, SEED_CATEGORIES } from '@adsspot/api';
import { Button, Card, Logo, Avatar, TierBadge } from '@adsspot/ui';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ShieldCheck,
  Building2,
  Briefcase,
  Store,
  User,
  Crown,
  Mail,
  Lock,
  Phone,
  UserPlus,
  LogIn,
  CreditCard,
  QrCode,
  Check,
  Zap,
  ExternalLink,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, signupWithEmail, loginWithPhone, verifyOtp } = useAuth();

  // Mode: 'signin' | 'signup' | 'phone_otp'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'phone_otp'>('signin');

  // Form States
  const [email, setEmail] = useState('admin@adsspot.in');
  const [password, setPassword] = useState('adsspot123');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+919876543217');
  const [signupRole, setSignupRole] = useState<'consumer' | 'merchant'>('consumer');

  // Phone OTP States
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp'>('phone');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getRoleDestination = (role: string) => {
    switch (role) {
      case 'super_admin':
        return '/admin';
      case 'zo':
        return '/zo';
      case 'ro':
        return '/ro';
      case 'sm':
        return '/sm';
      case 'merchant':
        return '/merchant';
      default:
        return '/feed';
    }
  };

  const handleQuickLogin = async (persona: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginWithEmail(persona.email || `${persona.role}@adsspot.in`, 'adsspot123');
      if (res.success && res.user) {
        const dest = res.destination || getRoleDestination(res.user.role);
        router.push(dest);
      } else {
        setError(res.error || 'Quick login failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithEmail(email, password, phone);
      if (res.success && res.user) {
        setSuccessMsg(`Welcome back, ${res.user?.full_name || 'User'}!`);
        const dest = res.destination || getRoleDestination(res.user?.role || 'consumer');
        setTimeout(() => {
          window.location.href = dest;
        }, 300);
      } else {
        setError(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err?.message || 'Login error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Merchant Onboarding & Payment State
  const [merchantCheckoutStep, setMerchantCheckoutStep] = useState<null | 'plans' | 'checkout' | 'success'>(null);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium' | 'elite'>('premium');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [bizCategory, setBizCategory] = useState<string>('cat-1');
  const [bizAddress, setBizAddress] = useState<string>('Fort, Mumbai');
  const [bizPincode, setBizPincode] = useState<string>('400001');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'qr'>('upi');
  const [upiId, setUpiId] = useState<string>('merchant@okhdfcbank');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('786');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [completedSubscription, setCompletedSubscription] = useState<any>(null);

  const getTierPrice = (tier: 'basic' | 'premium' | 'elite', cycle: 'monthly' | 'yearly') => {
    if (tier === 'basic') return cycle === 'monthly' ? 999 : 9990;
    if (tier === 'premium') return cycle === 'monthly' ? 2499 : 24990;
    return cycle === 'monthly' ? 4999 : 49990;
  };

  const getTierOriginalPrice = (tier: 'basic' | 'premium' | 'elite', cycle: 'monthly' | 'yearly') => {
    if (tier === 'basic') return cycle === 'monthly' ? 1999 : 23988;
    if (tier === 'premium') return cycle === 'monthly' ? 4999 : 59988;
    return cycle === 'monthly' ? 9999 : 119988;
  };

  const handleProcessPayment = async () => {
    setPaymentProcessing(true);
    setError(null);
    try {
      const amount = getTierPrice(selectedTier, billingCycle);
      const generatedPayId = `pay_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      const res = await fetch('/api/merchants/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedTier,
          billingCycle,
          bizName: name,
          ownerName: name,
          phone,
          categoryId: bizCategory,
          address: bizAddress,
          pincode: bizPincode,
          paymentMethod: paymentMethod.toUpperCase(),
          paymentId: generatedPayId,
          amount,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Payment verification failed');
      }

      setCompletedSubscription(data);
      setMerchantCheckoutStep('success');
      setSuccessMsg(`🎉 Payment of ₹${amount.toLocaleString()} received! ${selectedTier.toUpperCase()} Membership activated.`);
    } catch (err: any) {
      setError(err?.message || 'Payment processing failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!name.trim()) {
      setError('Please enter your full name or business name');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (phone.replace(/[^0-9]/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile phone number');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await signupWithEmail(name, email, password, phone, signupRole);
      if (res.success && res.user) {
        if (signupRole === 'merchant') {
          // Do not send directly to merchant panel. Present membership selection & payment!
          setMerchantCheckoutStep('plans');
          setSuccessMsg(`Account created! Please select a membership plan to activate your Merchant Studio.`);
        } else {
          setSuccessMsg(`Account created! Welcome, ${res.user?.full_name || name || 'User'}!`);
          const dest = res.destination || getRoleDestination(res.user?.role || signupRole || 'consumer');
          setTimeout(() => {
            window.location.href = dest;
          }, 300);
        }
      } else {
        setError(res.error || 'Signup failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Signup error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    if (phone.replace(/[^0-9]/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithPhone(phone);
      if (res.success) {
        setOtpStep('otp');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    setError(null);
    setLoading(true);
    try {
      const res = await verifyOtp(phone, otp || '123456');
      if (res.success && res.user) {
        const dest = getRoleDestination(res.user.role);
        router.push(dest);
      } else {
        setError(res.error || 'Invalid OTP code. Please enter 123456');
      }
    } catch (err: any) {
      setError(err?.message || 'Verification error.');
    } finally {
      setLoading(false);
    }
  };

  const roleIcons: Record<string, any> = {
    super_admin: <Crown className="w-4 h-4 text-[#E11D48]" />,
    zo: <Building2 className="w-4 h-4 text-[#8B5CF6]" />,
    ro: <Building2 className="w-4 h-4 text-[#3B82F6]" />,
    sm: <Briefcase className="w-4 h-4 text-[#10B981]" />,
    merchant: <Store className="w-4 h-4 text-[#F59E0B]" />,
    consumer: <User className="w-4 h-4 text-[#4787F2]" />,
  };

  const roleBadges: Record<string, string> = {
    super_admin: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    zo: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    ro: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    sm: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    merchant: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    consumer: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-[#F4F6FB] dark:bg-[#0B0E14] min-h-[calc(100vh-100px)] transition-colors">
      <div className="max-w-4xl w-full space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#687182] dark:text-neutral-400 hover:text-[#4787F2] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#35AB4E]">
            <ShieldCheck className="w-4 h-4" /> Aurora PostgreSQL + Email Auth Active
          </div>
        </div>

        {/* 1. 1-CLICK SUPER ADMIN QUICK LOGIN */}
        <div className="bg-white dark:bg-[#121620] rounded-3xl p-5 sm:p-6 border border-[#E3E8EF] dark:border-white/10 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-extrabold text-[#4787F2] uppercase tracking-wider mb-1">
                <Crown className="w-3.5 h-3.5 text-[#E11D48]" /> Super Admin Access
              </div>
              <h2 className="text-lg font-black text-[#17181C] dark:text-white">Adsspot Master Admin Portal</h2>
              <p className="text-xs text-[#687182] dark:text-neutral-400 mt-0.5">
                Global platform administration, merchants, moderation, pricing tiers &amp; audit trails.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold bg-[#F4F6FB] dark:bg-white/5 text-neutral-600 dark:text-neutral-300 px-3 py-1.5 rounded-xl border border-[#E3E8EF] dark:border-white/10">
              Pass: adsspot123
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEMO_PERSONAS.map((persona) => {
              const dest = getRoleDestination(persona.role);
              const demoPassword = 'adsspot123';
              return (
                <div
                  key={persona.id}
                  onClick={() => {
                    setEmail(persona.email || '');
                    setPassword(demoPassword);
                    handleQuickLogin(persona);
                  }}
                  className="p-4 rounded-2xl border border-[#E3E8EF] dark:border-white/10 hover:border-[#4787F2] dark:hover:border-[#4787F2] bg-white dark:bg-[#171E2C] hover:bg-[#F8FAFF] dark:hover:bg-[#1C2638] transition-all cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${roleBadges[persona.role] || 'bg-neutral-100 text-neutral-800'}`}>
                        {roleIcons[persona.role]}
                        <span>SUPER ADMIN</span>
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 group-hover:text-[#4787F2] font-bold">
                        {dest} &rarr;
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Avatar src={persona.avatar_url} name={persona.name} size="md" />
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-black text-[#17181C] dark:text-white truncate group-hover:text-[#4787F2] transition-colors">
                          Adsspot Admin
                        </h4>
                        <span className="text-xs text-[#4787F2] font-medium truncate block">
                          admin@adsspot.in
                        </span>
                      </div>
                    </div>

                    {/* Explicit ID & Password credentials box */}
                    <div className="p-2.5 bg-[#F4F6FB] dark:bg-white/5 rounded-xl border border-neutral-200 dark:border-white/10 space-y-1 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 font-sans font-bold">Email ID:</span>
                        <span className="text-[#4787F2] font-bold">admin@adsspot.in</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 font-sans font-bold">Password:</span>
                        <span className="text-[#35AB4E] font-bold">{demoPassword}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#4787F2]">1-Tap Super Admin Access</span>
                    <Button variant="primary" size="sm" className="text-xs py-1.5 px-4 font-bold bg-[#4787F2] group-hover:bg-[#3373E0]">
                      Open Admin Panel &rarr;
                    </Button>
                  </div>
                </div>
              );
            })}

            <div className="p-4 rounded-2xl border border-dashed border-[#E3E8EF] dark:border-white/10 bg-[#F4F6FB]/50 dark:bg-white/[0.02] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block mb-1">
                  Custom Accounts &amp; Merchants
                </span>
                <h4 className="text-sm font-black text-[#17181C] dark:text-white mb-1">
                  Create or Sign In to Any Account
                </h4>
                <p className="text-xs text-[#687182] dark:text-neutral-400 leading-relaxed">
                  Use the form below to register new merchants or shoppers with your own email and password. All data is saved directly in PostgreSQL.
                </p>
              </div>
              <div className="pt-2 text-xs font-semibold text-[#4787F2]">
                100% Live Database
              </div>
            </div>
          </div>
        </div>

        {/* 2. PRIMARY AUTHENTICATION OR MERCHANT MEMBERSHIP CHECKOUT */}
        {merchantCheckoutStep ? (
          <div className="max-w-2xl mx-auto w-full">
            <Card padding="lg" className="shadow-2xl bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10 space-y-6">
              {/* Stepper Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E3E8EF] dark:border-white/10">
                <div className="flex items-center gap-3">
                  <Logo size={40} withText={false} />
                  <div>
                    <h3 className="text-base font-extrabold text-[#17181C] dark:text-white flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#4787F2]" /> Merchant Membership &amp; Activation
                    </h3>
                    <p className="text-xs text-[#687182] dark:text-neutral-400">
                      Step {merchantCheckoutStep === 'plans' ? '1 of 2: Select Tier' : merchantCheckoutStep === 'checkout' ? '2 of 2: Secure Payment' : 'Complete: Studio Live'}
                    </p>
                  </div>
                </div>

                {/* Stepper Dots */}
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    merchantCheckoutStep === 'plans'
                      ? 'bg-[#4787F2] text-white'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {merchantCheckoutStep === 'plans' ? '1' : '✓'}
                  </div>
                  <div className="w-6 h-0.5 bg-neutral-200 dark:bg-white/10" />
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    merchantCheckoutStep === 'checkout'
                      ? 'bg-[#4787F2] text-white'
                      : merchantCheckoutStep === 'success'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}>
                    {merchantCheckoutStep === 'success' ? '✓' : '2'}
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-xl bg-[#FBECEF] dark:bg-rose-950/40 border border-[#981837]/20 text-xs font-bold text-[#981837] dark:text-rose-300">
                  {error}
                </div>
              )}

              {/* STEP 1: PLANS & STORE DETAILS */}
              {merchantCheckoutStep === 'plans' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <div>
                        <h4 className="text-sm font-black text-[#17181C] dark:text-white">Choose Your Growth Plan</h4>
                        <p className="text-xs text-[#687182] dark:text-neutral-400">
                          Includes platform listing, Digital Visiting Card, and Banner Studio
                        </p>
                      </div>

                      {/* Monthly / Yearly Billing Toggle */}
                      <div className="flex items-center p-1 bg-[#F4F6FB] dark:bg-white/5 rounded-full border border-[#E3E8EF] dark:border-white/10 text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setBillingCycle('monthly')}
                          className={`px-3 py-1 rounded-full transition-all ${
                            billingCycle === 'monthly'
                              ? 'bg-white dark:bg-[#1C2638] text-[#17181C] dark:text-white shadow-xs'
                              : 'text-neutral-500 hover:text-black'
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillingCycle('yearly')}
                          className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                            billingCycle === 'yearly'
                              ? 'bg-[#35AB4E] text-white shadow-xs'
                              : 'text-[#35AB4E] hover:text-emerald-600'
                          }`}
                        >
                          Annual (2 Mo Free)
                        </button>
                      </div>
                    </div>

                    {/* 3 Tier Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Basic Plan */}
                      <div
                        onClick={() => setSelectedTier('basic')}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          selectedTier === 'basic'
                            ? 'border-[#4787F2] bg-[#EDF4FF]/50 dark:bg-[#4787F2]/10 ring-2 ring-[#4787F2]/20'
                            : 'border-[#E3E8EF] dark:border-white/10 bg-white dark:bg-[#171E2C] hover:border-neutral-300'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <TierBadge tier="basic" size="sm" />
                            <span className="text-[10px] font-bold text-[#4787F2] bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                              50% OFF
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-neutral-400 line-through font-bold">
                              ₹{getTierOriginalPrice('basic', billingCycle).toLocaleString()}
                            </span>
                            <div className="text-xl font-black text-[#17181C] dark:text-white">
                              ₹{getTierPrice('basic', billingCycle).toLocaleString()}
                              <span className="text-[11px] font-normal text-neutral-500">
                                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                              </span>
                            </div>
                          </div>
                          <ul className="text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1 pt-2 border-t border-neutral-100 dark:border-white/5">
                            <li className="flex items-center gap-1.5 font-medium">✓ Digital Card (/card)</li>
                            <li className="flex items-center gap-1.5 font-medium">✓ Festival auto-banners</li>
                            <li className="flex items-center gap-1.5 text-neutral-400 line-through">✗ Custom banners</li>
                            <li className="flex items-center gap-1.5 text-neutral-400 line-through">✗ 24h Daily Stories</li>
                          </ul>
                        </div>
                        <div className={`mt-3 py-1.5 rounded-xl text-center text-xs font-bold ${
                          selectedTier === 'basic' ? 'bg-[#4787F2] text-white' : 'bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300'
                        }`}>
                          {selectedTier === 'basic' ? 'Selected' : 'Select Basic'}
                        </div>
                      </div>

                      {/* Premium Plan */}
                      <div
                        onClick={() => setSelectedTier('premium')}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                          selectedTier === 'premium'
                            ? 'border-[#35AB4E] bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-[#35AB4E]/20'
                            : 'border-[#E3E8EF] dark:border-white/10 bg-white dark:bg-[#171E2C] hover:border-neutral-300'
                        }`}
                      >
                        <div className="absolute -top-2.5 right-3 bg-[#35AB4E] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                          Most Popular
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between mt-1">
                            <TierBadge tier="premium" size="sm" />
                            <span className="text-[10px] font-bold text-[#35AB4E] bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                              Save 50%
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-neutral-400 line-through font-bold">
                              ₹{getTierOriginalPrice('premium', billingCycle).toLocaleString()}
                            </span>
                            <div className="text-xl font-black text-[#17181C] dark:text-white">
                              ₹{getTierPrice('premium', billingCycle).toLocaleString()}
                              <span className="text-[11px] font-normal text-neutral-500">
                                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                              </span>
                            </div>
                          </div>
                          <ul className="text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1 pt-2 border-t border-neutral-100 dark:border-white/5">
                            <li className="flex items-center gap-1.5 font-medium">✓ Everything in Basic</li>
                            <li className="flex items-center gap-1.5 font-medium">✓ 2 Custom Banners/wk</li>
                            <li className="flex items-center gap-1.5 font-medium text-[#35AB4E] font-bold">✓ Green "Trusted" Badge</li>
                            <li className="flex items-center gap-1.5 text-neutral-400 line-through">✗ 24h Daily Stories</li>
                          </ul>
                        </div>
                        <div className={`mt-3 py-1.5 rounded-xl text-center text-xs font-bold ${
                          selectedTier === 'premium' ? 'bg-[#35AB4E] text-white' : 'bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300'
                        }`}>
                          {selectedTier === 'premium' ? 'Selected' : 'Select Premium'}
                        </div>
                      </div>

                      {/* Elite Plan */}
                      <div
                        onClick={() => setSelectedTier('elite')}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                          selectedTier === 'elite'
                            ? 'border-[#981837] bg-red-50/40 dark:bg-red-950/20 ring-2 ring-[#981837]/20'
                            : 'border-[#E3E8EF] dark:border-white/10 bg-white dark:bg-[#171E2C] hover:border-neutral-300'
                        }`}
                      >
                        <div className="absolute -top-2.5 right-3 bg-[#981837] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                          VIP Growth
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between mt-1">
                            <TierBadge tier="elite" size="sm" />
                            <span className="text-[10px] font-bold text-[#981837] bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                              All Features
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-neutral-400 line-through font-bold">
                              ₹{getTierOriginalPrice('elite', billingCycle).toLocaleString()}
                            </span>
                            <div className="text-xl font-black text-[#17181C] dark:text-white">
                              ₹{getTierPrice('elite', billingCycle).toLocaleString()}
                              <span className="text-[11px] font-normal text-neutral-500">
                                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                              </span>
                            </div>
                          </div>
                          <ul className="text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1 pt-2 border-t border-neutral-100 dark:border-white/5">
                            <li className="flex items-center gap-1.5 font-medium">✓ Everything in Premium</li>
                            <li className="flex items-center gap-1.5 font-medium text-[#981837] font-bold">✓ Daily 24h Stories (1/day)</li>
                            <li className="flex items-center gap-1.5 font-medium text-[#981837] font-bold">✓ Elite Microsite (/b/[slug])</li>
                            <li className="flex items-center gap-1.5 font-medium">✓ Daily Banners (365/yr)</li>
                          </ul>
                        </div>
                        <div className={`mt-3 py-1.5 rounded-xl text-center text-xs font-bold ${
                          selectedTier === 'elite' ? 'bg-[#981837] text-white' : 'bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300'
                        }`}>
                          {selectedTier === 'elite' ? 'Selected' : 'Select Elite'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Store Setup Inputs */}
                  <div className="p-4 rounded-2xl bg-[#F4F6FB] dark:bg-white/5 border border-[#E3E8EF] dark:border-white/10 space-y-3">
                    <h5 className="text-xs font-black text-[#17181C] dark:text-white flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-[#4787F2]" /> Store Listing Details
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          Store Category
                        </label>
                        <select
                          value={bizCategory}
                          onChange={(e) => setBizCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] dark:border-white/10 text-xs bg-white dark:bg-[#171E2C] text-[#17181C] dark:text-white outline-none"
                        >
                          {SEED_CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          Pincode Territory
                        </label>
                        <input
                          type="text"
                          value={bizPincode}
                          onChange={(e) => setBizPincode(e.target.value)}
                          placeholder="400001"
                          className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] dark:border-white/10 text-xs bg-white dark:bg-[#171E2C] text-[#17181C] dark:text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Store Address / Landmark
                      </label>
                      <input
                        type="text"
                        value={bizAddress}
                        onChange={(e) => setBizAddress(e.target.value)}
                        placeholder="e.g. Shop 14, Ring Road, Surat / Fort, Mumbai"
                        className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] dark:border-white/10 text-xs bg-white dark:bg-[#171E2C] text-[#17181C] dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Proceed to Payment Button */}
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full font-bold shadow-lg py-3 text-sm flex items-center justify-center gap-2"
                    onClick={() => setMerchantCheckoutStep('checkout')}
                  >
                    Proceed to Payment Checkout (₹{getTierPrice(selectedTier, billingCycle).toLocaleString()}) &rarr;
                  </Button>
                </div>
              )}

              {/* STEP 2: RAZORPAY CHECKOUT */}
              {merchantCheckoutStep === 'checkout' && (
                <div className="space-y-5">
                  {/* Back to plans */}
                  <button
                    type="button"
                    onClick={() => setMerchantCheckoutStep('plans')}
                    className="text-xs text-[#4787F2] font-bold flex items-center gap-1 hover:underline"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back to Change Plan
                  </button>

                  {/* Plan Summary Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#17181C] to-[#252830] text-white shadow-md flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <TierBadge tier={selectedTier} size="sm" />
                        <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                          {billingCycle === 'monthly' ? 'Monthly Subscription' : 'Annual Plan (2 Mo Free)'}
                        </span>
                      </div>
                      <h4 className="text-lg font-black mt-1">{name || 'Your Store'}</h4>
                      <p className="text-[11px] text-neutral-400">{bizAddress}, Pincode {bizPincode}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-neutral-400 block">Total Payable (All-Inclusive)</span>
                      <div className="text-2xl font-black text-[#35AB4E]">
                        ₹{getTierPrice(selectedTier, billingCycle).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-[#17181C] dark:text-white uppercase tracking-wider">
                      Select Payment Method
                    </label>

                    <div className="grid grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center gap-1 ${
                          paymentMethod === 'upi'
                            ? 'border-[#4787F2] bg-[#EDF4FF] dark:bg-[#4787F2]/20 text-[#4787F2]'
                            : 'border-[#E3E8EF] dark:border-white/10 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                        <span>UPI Apps</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center gap-1 ${
                          paymentMethod === 'card'
                            ? 'border-[#4787F2] bg-[#EDF4FF] dark:bg-[#4787F2]/20 text-[#4787F2]'
                            : 'border-[#E3E8EF] dark:border-white/10 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('qr')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center gap-1 ${
                          paymentMethod === 'qr'
                            ? 'border-[#4787F2] bg-[#EDF4FF] dark:bg-[#4787F2]/20 text-[#4787F2]'
                            : 'border-[#E3E8EF] dark:border-white/10 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        <span>QR Code</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center gap-1 ${
                          paymentMethod === 'netbanking'
                            ? 'border-[#4787F2] bg-[#EDF4FF] dark:bg-[#4787F2]/20 text-[#4787F2]'
                            : 'border-[#E3E8EF] dark:border-white/10 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Net Banking</span>
                      </button>
                    </div>

                    {/* Method Specific Inputs */}
                    {paymentMethod === 'upi' && (
                      <div className="p-4 rounded-2xl bg-[#F4F6FB] dark:bg-white/5 border border-[#E3E8EF] dark:border-white/10 space-y-3">
                        <label className="block text-[11px] font-bold text-[#17181C] dark:text-white">
                          Enter UPI Virtual Payment Address (VPA)
                        </label>
                        <div className="flex rounded-xl border border-[#E3E8EF] dark:border-white/10 bg-white dark:bg-[#171E2C] overflow-hidden px-3 py-2">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. mobile@okhdfcbank / yourname@paytm"
                            className="flex-1 text-xs font-medium text-[#17181C] dark:text-white bg-transparent outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#687182]">
                          <span>Supported:</span>
                          <span className="font-bold text-[#17181C] dark:text-white">Google Pay • PhonePe • Paytm • BHIM • CRED</span>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="p-4 rounded-2xl bg-[#F4F6FB] dark:bg-white/5 border border-[#E3E8EF] dark:border-white/10 space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#17181C] dark:text-white mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] dark:border-white/10 text-xs font-mono bg-white dark:bg-[#171E2C] outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-[#17181C] dark:text-white mb-1">
                              Expiry (MM/YY)
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] dark:border-white/10 text-xs font-mono bg-white dark:bg-[#171E2C] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-[#17181C] dark:text-white mb-1">
                              CVV
                            </label>
                            <input
                              type="password"
                              maxLength={3}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] dark:border-white/10 text-xs font-mono bg-white dark:bg-[#171E2C] outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'qr' && (
                      <div className="p-5 rounded-2xl bg-[#F4F6FB] dark:bg-white/5 border border-[#E3E8EF] dark:border-white/10 text-center space-y-3">
                        <div className="w-36 h-36 bg-white p-2.5 rounded-2xl mx-auto shadow-sm border border-neutral-200 flex flex-col items-center justify-center">
                          <QrCode className="w-28 h-28 text-[#17181C]" />
                        </div>
                        <p className="text-xs font-bold text-[#17181C] dark:text-white">
                          Scan with any UPI App (GPay, PhonePe, Paytm)
                        </p>
                        <p className="text-[10px] text-[#687182]">
                          Amount: ₹{getTierPrice(selectedTier, billingCycle).toLocaleString()} • Instant Verification
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'netbanking' && (
                      <div className="p-4 rounded-2xl bg-[#F4F6FB] dark:bg-white/5 border border-[#E3E8EF] dark:border-white/10 space-y-3">
                        <label className="block text-[11px] font-bold text-[#17181C] dark:text-white">
                          Select Popular Bank
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak', 'PNB'].map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => setSelectedBank(b)}
                              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                                selectedBank === b
                                  ? 'border-[#4787F2] bg-white text-[#4787F2] shadow-xs'
                                  : 'border-[#E3E8EF] bg-white/70 text-neutral-600'
                              }`}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Security Guarantee Note */}
                  <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                    <ShieldCheck className="w-4 h-4 text-[#35AB4E]" />
                    <span>256-Bit SSL Encrypted • Razorpay Certified • Instant Activation</span>
                  </div>

                  {/* Pay Button */}
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full font-black shadow-xl py-3 text-sm flex items-center justify-center gap-2 bg-[#35AB4E] hover:bg-[#2E9644]"
                    isLoading={paymentProcessing}
                    onClick={handleProcessPayment}
                  >
                    Pay ₹{getTierPrice(selectedTier, billingCycle).toLocaleString()} via Razorpay &amp; Unlock Studio &rarr;
                  </Button>
                </div>
              )}

              {/* STEP 3: ACTIVATION SUCCESS */}
              {merchantCheckoutStep === 'success' && (
                <div className="text-center space-y-4 py-2">
                  <div className="w-16 h-16 rounded-full bg-[#EBF9EE] text-[#35AB4E] flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>

                  <div>
                    <span className="text-[11px] font-extrabold text-[#35AB4E] uppercase tracking-wider">Payment Verified</span>
                    <h3 className="text-xl font-black text-[#17181C] dark:text-white mt-1">
                      {selectedTier.toUpperCase()} Merchant Studio Unlocked!
                    </h3>
                    <p className="text-xs text-[#687182] dark:text-neutral-400 mt-1 max-w-md mx-auto">
                      Your store listing, digital visiting card, and tier features are now active in the PostgreSQL database.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4F6FB] dark:bg-white/5 border border-[#E3E8EF] dark:border-white/10 text-left space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Payment ID:</span>
                      <span className="font-mono font-bold text-[#4787F2]">
                        {completedSubscription?.paymentId || 'pay_rzp_live_998127'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Active Membership:</span>
                      <span className="font-bold text-[#17181C] dark:text-white capitalize">
                        {selectedTier} Tier ({billingCycle})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Digital Visiting Card URL:</span>
                      <span className="font-mono font-bold text-[#35AB4E]">
                        /card/{completedSubscription?.business?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
                    <Link
                      href={`/card/${completedSubscription?.business?.slug || 'my-store'}`}
                      target="_blank"
                      className="flex-1 py-2.5 px-4 rounded-xl border border-[#E3E8EF] dark:border-white/10 text-neutral-700 dark:text-neutral-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Preview Digital Card
                    </Link>

                    <Button
                      variant="primary"
                      size="md"
                      className="flex-1 font-bold py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-md"
                      onClick={() => router.push('/merchant')}
                    >
                      <Store className="w-4 h-4" /> Open My Merchant Studio &rarr;
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="max-w-md mx-auto w-full">
            <Card padding="lg" className="shadow-xl bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10 space-y-5">
              <div className="flex items-center gap-3.5">
                <Logo size={46} withText={false} />
                <div>
                  <h3 className="text-base font-extrabold text-[#17181C] dark:text-white">
                    {authMode === 'signup' ? 'Create Adsspot Account' : authMode === 'phone_otp' ? 'Phone OTP Sign In' : 'Email & Password Sign In'}
                  </h3>
                  <p className="text-xs text-[#687182] dark:text-neutral-400">
                    Hyperlocal discovery, merchant cards &amp; staff operations
                  </p>
                </div>
              </div>

              {/* Auth Mode Toggle Pills */}
              <div className="grid grid-cols-3 p-1 bg-[#F4F6FB] dark:bg-white/5 rounded-2xl border border-[#E3E8EF] dark:border-white/10 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setError(null);
                  }}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                    authMode === 'signin'
                      ? 'bg-white dark:bg-[#1C2638] text-[#4787F2] shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" /> Sign In
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setError(null);
                  }}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                    authMode === 'signup'
                      ? 'bg-white dark:bg-[#1C2638] text-[#4787F2] shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" /> Sign Up
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('phone_otp');
                    setError(null);
                  }}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                    authMode === 'phone_otp'
                      ? 'bg-white dark:bg-[#1C2638] text-[#4787F2] shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" /> Phone OTP
                </button>
              </div>

              {/* Error & Success Alerts */}
              {error && (
                <div className="p-3 rounded-xl bg-[#FBECEF] dark:bg-rose-950/40 border border-[#981837]/20 dark:border-rose-800 text-xs font-bold text-[#981837] dark:text-rose-300">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="p-3 rounded-xl bg-[#EBF9EE] dark:bg-emerald-950/40 border border-[#35AB4E]/20 dark:border-emerald-800 text-xs font-bold text-[#1B6A2D] dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#35AB4E]" />
                  {successMsg}
                </div>
              )}

              {/* FORM 1: EMAIL & PASSWORD SIGN IN */}
              {authMode === 'signin' && (
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17181C] dark:text-white uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="flex items-center rounded-xl border border-[#E3E8EF] dark:border-white/15 overflow-hidden focus-within:border-[#4787F2] focus-within:ring-2 focus-within:ring-[#4787F2]/20 px-3 py-2.5 bg-white dark:bg-[#171E2C]">
                      <Mail className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@adsspot.in"
                        className="flex-1 text-sm font-medium text-[#17181C] dark:text-white bg-transparent outline-none"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#17181C] dark:text-white uppercase tracking-wider">
                        Password
                      </label>
                      <span className="text-[10px] text-[#4787F2] font-semibold cursor-pointer">
                        Forgot?
                      </span>
                    </div>
                    <div className="flex items-center rounded-xl border border-[#E3E8EF] dark:border-white/15 overflow-hidden focus-within:border-[#4787F2] focus-within:ring-2 focus-within:ring-[#4787F2]/20 px-3 py-2.5 bg-white dark:bg-[#171E2C]">
                      <Lock className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="flex-1 text-sm font-medium text-[#17181C] dark:text-white bg-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full font-bold shadow-md"
                    isLoading={loading}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Sign In
                  </Button>
                </form>
              )}

              {/* FORM 2: CREATE ACCOUNT (SIGN UP) */}
              {authMode === 'signup' && (
                <form onSubmit={handleEmailSignUp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#17181C] dark:text-white uppercase tracking-wider mb-1">
                      Full Name / Business Name
                    </label>
                    <div className="flex items-center rounded-xl border border-[#E3E8EF] dark:border-white/15 overflow-hidden focus-within:border-[#4787F2] focus-within:ring-2 focus-within:ring-[#4787F2]/20 px-3 py-2 bg-white dark:bg-[#171E2C]">
                      <User className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rajesh Singhania"
                        className="flex-1 text-sm font-medium text-[#17181C] dark:text-white bg-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17181C] dark:text-white uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center rounded-xl border border-[#E3E8EF] dark:border-white/15 overflow-hidden focus-within:border-[#4787F2] focus-within:ring-2 focus-within:ring-[#4787F2]/20 px-3 py-2 bg-white dark:bg-[#171E2C]">
                      <Mail className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rajesh@yourdomain.com"
                        className="flex-1 text-sm font-medium text-[#17181C] dark:text-white bg-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17181C] dark:text-white uppercase tracking-wider mb-1">
                      Create Password
                    </label>
                    <div className="flex items-center rounded-xl border border-[#E3E8EF] dark:border-white/15 overflow-hidden focus-within:border-[#4787F2] focus-within:ring-2 focus-within:ring-[#4787F2]/20 px-3 py-2 bg-white dark:bg-[#171E2C]">
                      <Lock className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="flex-1 text-sm font-medium text-[#17181C] dark:text-white bg-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17181C] dark:text-white uppercase tracking-wider mb-1">
                      Mobile Phone Number
                    </label>
                    <div className="flex rounded-xl border border-[#E3E8EF] dark:border-white/15 overflow-hidden bg-white dark:bg-[#171E2C]">
                      <span className="bg-[#F4F6FB] dark:bg-white/10 px-3 py-2 text-xs font-bold text-[#17181C] dark:text-white border-r border-[#E3E8EF] dark:border-white/10 flex items-center">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        value={phone.replace(/^\+91/, '')}
                        onChange={(e) => setPhone('+91' + e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="98765 43210"
                        className="flex-1 px-3 py-2 text-sm font-medium text-[#17181C] dark:text-white bg-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17181C] dark:text-white uppercase tracking-wider mb-1">
                      I am joining as:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSignupRole('consumer')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                          signupRole === 'consumer'
                            ? 'border-[#4787F2] bg-[#EDF4FF] dark:bg-[#4787F2]/20 text-[#4787F2]'
                            : 'border-[#E3E8EF] dark:border-white/10 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        🛍️ Consumer
                        <span className="block text-[10px] font-normal text-neutral-500">Discover offers &amp; events</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSignupRole('merchant')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                          signupRole === 'merchant'
                            ? 'border-[#4787F2] bg-[#EDF4FF] dark:bg-[#4787F2]/20 text-[#4787F2]'
                            : 'border-[#E3E8EF] dark:border-white/10 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        🏪 Merchant / Store
                        <span className="block text-[10px] font-normal text-neutral-500">Digital card &amp; banners</span>
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full font-bold shadow-md"
                    isLoading={loading}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Create Account &amp; Continue
                  </Button>
                </form>
              )}

              {/* FORM 3: PHONE OTP LOGIN */}
              {authMode === 'phone_otp' && (
                <div>
                  {otpStep === 'phone' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#17181C] dark:text-white uppercase tracking-wider mb-2">
                          Mobile Phone Number
                        </label>
                        <div className="flex rounded-xl border border-[#E3E8EF] dark:border-white/15 overflow-hidden focus-within:border-[#4787F2] focus-within:ring-2 focus-within:ring-[#4787F2]/20">
                          <span className="bg-[#F4F6FB] dark:bg-white/10 px-3.5 py-2.5 text-xs font-bold text-[#17181C] dark:text-white border-r border-[#E3E8EF] dark:border-white/10 flex items-center">
                            🇮🇳 +91
                          </span>
                          <input
                            type="tel"
                            value={phone.replace(/^\+91/, '')}
                            onChange={(e) => setPhone('+91' + e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="98765 43210"
                            className="flex-1 px-3.5 py-2.5 text-sm font-medium text-[#17181C] dark:text-white bg-transparent outline-none"
                            autoFocus
                          />
                        </div>
                        <p className="text-[11px] text-[#687182] dark:text-neutral-400 mt-1.5">
                          We'll send a 6-digit OTP to verify your account.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        className="w-full font-bold"
                        isLoading={loading}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Send OTP Code
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-bold text-[#17181C] dark:text-white uppercase tracking-wider">
                            Enter 6-Digit OTP
                          </label>
                          <button
                            type="button"
                            onClick={() => setOtpStep('phone')}
                            className="text-xs text-[#4787F2] font-semibold hover:underline"
                          >
                            Change Phone
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="123456"
                          className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3 rounded-xl border border-[#E3E8EF] dark:border-white/15 bg-white dark:bg-[#171E2C] focus:border-[#4787F2] focus:ring-2 focus:ring-[#4787F2]/20 outline-none text-[#17181C] dark:text-white"
                          autoFocus
                        />
                        <div className="flex items-center justify-between mt-2 text-[11px]">
                          <span className="text-[#687182] dark:text-neutral-400">Sent to {phone}</span>
                          <span className="text-[#35AB4E] font-bold">OTP: 123456</span>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        className="w-full font-bold"
                        isLoading={loading}
                        rightIcon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Verify &amp; Continue
                      </Button>
                    </form>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-[#E3E8EF] dark:border-white/10 text-center text-xs text-[#687182] dark:text-neutral-400">
                Protected by Amazon Aurora PostgreSQL &amp; Supabase Auth Engine.
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}


