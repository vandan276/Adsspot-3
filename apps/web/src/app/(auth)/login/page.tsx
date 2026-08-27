'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, DEMO_PERSONAS } from '@adsspot/api';
import { Button, Card, Logo, Avatar } from '@adsspot/ui';
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
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, signupWithEmail, loginWithPhone, verifyOtp, switchPersona } = useAuth();

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

  const handleQuickLogin = (persona: any) => {
    switchPersona(persona.id);
    const dest = getRoleDestination(persona.role);
    router.push(dest);
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
        setSuccessMsg(`Welcome back, ${res.user.full_name}!`);
        const dest = getRoleDestination(res.user.role);
        setTimeout(() => router.push(dest), 500);
      } else {
        setError(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err?.message || 'Login error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!name.trim()) {
      setError('Please enter your full name');
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
        setSuccessMsg(`Account created! Welcome, ${res.user.full_name}!`);
        const dest = getRoleDestination(res.user.role);
        setTimeout(() => router.push(dest), 500);
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

        {/* 2. PRIMARY EMAIL & PASSWORD AUTHENTICATION CARD */}
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
      </div>
    </div>
  );
}


