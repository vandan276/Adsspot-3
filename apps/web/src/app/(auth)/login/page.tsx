'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@adsspot/api';
import { Button, Card, Logo } from '@adsspot/ui';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPhone, verifyOtp } = useAuth();

  const [phone, setPhone] = useState('+919876543210');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    setLoading(true);
    const res = await loginWithPhone(phone);
    setLoading(false);
    if (res.success) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await verifyOtp(phone, otp || '123456');
    setLoading(false);
    if (res.success && res.user) {
      // Route to user's portal
      switch (res.user.role) {
        case 'super_admin':
          router.push('/admin');
          break;
        case 'zo':
          router.push('/zo');
          break;
        case 'ro':
          router.push('/ro');
          break;
        case 'sm':
          router.push('/sm');
          break;
        case 'merchant':
          router.push('/merchant');
          break;
        default:
          router.push('/');
          break;
      }
    } else {
      setError(res.error || 'Invalid OTP code. Please enter 123456');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-[#F4F6FB] min-h-[calc(100vh-100px)]">
      <div className="max-w-md w-full">
        {/* Phone OTP Login Card */}
        <Card padding="lg" className="shadow-lg bg-white border border-[#E3E8EF]">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#687182] hover:text-[#4787F2] mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-3.5 mb-6">
            <Logo size={52} withText={false} />
            <div>
              <h1 className="text-xl font-extrabold text-[#17181C]">Sign in to Adsspot</h1>
              <p className="text-xs text-[#687182]">Single phone login across all roles</p>
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
                <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider mb-2">
                  Mobile Phone Number
                </label>
                <div className="flex rounded-xl border border-[#E3E8EF] overflow-hidden focus-within:border-[#4787F2] focus-within:ring-2 focus-within:ring-[#4787F2]/20">
                  <span className="bg-[#F4F6FB] px-3.5 py-2.5 text-xs font-bold text-[#17181C] border-r border-[#E3E8EF] flex items-center">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={phone.replace(/^\+91/, '')}
                    onChange={(e) => setPhone('+91' + e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="98765 43210"
                    className="flex-1 px-3.5 py-2.5 text-sm font-medium text-[#17181C] outline-none"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-[#687182] mt-1.5">
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
                  <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider">
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
                  className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3 rounded-xl border border-[#E3E8EF] focus:border-[#4787F2] focus:ring-2 focus:ring-[#4787F2]/20 outline-none text-[#17181C]"
                  autoFocus
                />
                <div className="flex items-center justify-between mt-2 text-[11px]">
                  <span className="text-[#687182]">Sent to {phone}</span>
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

          <div className="pt-6 mt-6 border-t border-[#E3E8EF] text-center text-xs text-[#687182]">
            Protected by Supabase Phone Auth &amp; Row Level Security.
          </div>
        </Card>
      </div>
    </div>
  );
}
