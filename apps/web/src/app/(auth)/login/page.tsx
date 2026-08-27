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
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPhone, verifyOtp, switchPersona } = useAuth();

  const [phone, setPhone] = useState('+919876543210');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState<string | null>(null);
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
        setStep('otp');
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
            <ShieldCheck className="w-4 h-4" /> Supabase Multi-Role Auth Active
          </div>
        </div>

        {/* 1. 1-CLICK ROLE QUICK LOGIN DIRECTORY */}
        <div className="bg-white dark:bg-[#121620] rounded-3xl p-6 border border-[#E3E8EF] dark:border-white/10 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-extrabold text-[#4787F2] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Instant Role Access
              </div>
              <h2 className="text-lg font-black text-[#17181C] dark:text-white">1-Click Staff &amp; Merchant Login</h2>
              <p className="text-xs text-[#687182] dark:text-neutral-400 mt-0.5">
                Select any profile below to instantly jump into their dedicated dashboard.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold bg-[#F4F6FB] dark:bg-white/5 text-neutral-600 dark:text-neutral-300 px-3 py-1.5 rounded-xl border border-[#E3E8EF] dark:border-white/10">
              Demo OTP: 123456
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEMO_PERSONAS.map((persona) => {
              const dest = getRoleDestination(persona.role);
              return (
                <div
                  key={persona.id}
                  onClick={() => handleQuickLogin(persona)}
                  className="p-3.5 rounded-2xl border border-[#E3E8EF] dark:border-white/10 hover:border-[#4787F2] dark:hover:border-[#4787F2] bg-white dark:bg-[#171E2C] hover:bg-[#F8FAFF] dark:hover:bg-[#1C2638] transition-all cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${roleBadges[persona.role] || 'bg-neutral-100 text-neutral-800'}`}>
                        {roleIcons[persona.role]}
                        <span>{persona.role.replace('_', ' ')}</span>
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 group-hover:text-[#4787F2] font-bold">
                        {dest} &rarr;
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Avatar src={persona.avatar_url} name={persona.name} size="sm" />
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-black text-[#17181C] dark:text-white truncate group-hover:text-[#4787F2] transition-colors">
                          {persona.name}
                        </h4>
                        <span className="text-[10px] text-[#687182] dark:text-neutral-400 font-mono block">
                          {persona.phone}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#4A5260] dark:text-neutral-300 line-clamp-2 leading-relaxed">
                      {persona.description}
                    </p>
                  </div>

                  <div className="pt-2.5 mt-2 border-t border-neutral-100 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#4787F2]">1-Tap Login</span>
                    <Button variant="primary" size="sm" className="text-[10px] py-1 px-3 h-auto font-bold bg-[#4787F2] group-hover:bg-[#3373E0]">
                      Open {persona.role.toUpperCase()}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. STANDARD PHONE OTP LOGIN FORM */}
        <div className="max-w-md mx-auto w-full">
          <Card padding="lg" className="shadow-lg bg-white dark:bg-[#121620] border border-[#E3E8EF] dark:border-white/10">
            <div className="flex items-center gap-3.5 mb-6">
              <Logo size={46} withText={false} />
              <div>
                <h3 className="text-base font-extrabold text-[#17181C] dark:text-white">Or Login with Any Mobile Number</h3>
                <p className="text-xs text-[#687182] dark:text-neutral-400">Single phone login across all roles</p>
              </div>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-[#FBECEF] border border-[#981837]/20 text-xs font-bold text-[#981837]">
                {error}
              </div>
            )}

            {step === 'phone' ? (
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
                      onClick={() => setStep('phone')}
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
          </Card>
        </div>
      </div>
    </div>
  );
}

