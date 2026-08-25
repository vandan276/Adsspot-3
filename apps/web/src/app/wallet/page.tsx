'use client';

import React, { useState } from 'react';
import { Card } from '@adsspot/ui';
import {
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Building2,
} from 'lucide-react';

export default function WalletPage() {
  const [balance, setBalance] = useState<number>(1540.0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleTopUp = (amt: number) => {
    setBalance((b) => b + amt);
    showToast(`Added ₹${amt} via UPI to Adsspot Cash!`);
  };

  return (
    <div className="flex-1 bg-[#F4F6FB] pb-24 max-w-lg mx-auto w-full min-h-screen p-4 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#17181C] text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700">
          <CheckCircle className="w-4 h-4 text-[#35AB4E]" />
          {toastMessage}
        </div>
      )}

      {/* Main Cash Balance Card */}
      <div className="p-6 rounded-3xl bg-[#17181C] text-white shadow-2xl space-y-4">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="text-xs font-semibold">Adsspot Unified Cash Balance</span>
          <span className="flex items-center gap-1 text-[#35AB4E] text-[11px] font-bold">
            <ShieldCheck className="w-4 h-4" /> RBI Escrow Protected
          </span>
        </div>

        <div>
          <div className="text-4xl font-black text-white">₹{balance.toFixed(2)}</div>
          <p className="text-xs text-neutral-400 mt-1">Ready for 1-tap local store offers &amp; banner promos</p>
        </div>

        {/* Quick Top-Up Chips */}
        <div className="pt-3 border-t border-neutral-800 flex gap-2">
          <button
            onClick={() => handleTopUp(500)}
            className="flex-1 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-[#F2B604] border border-neutral-700 transition-all"
          >
            + ₹500
          </button>
          <button
            onClick={() => handleTopUp(1000)}
            className="flex-1 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-[#F2B604] border border-neutral-700 transition-all"
          >
            + ₹1,000
          </button>
          <button
            onClick={() => handleTopUp(2500)}
            className="flex-1 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-[#F2B604] border border-neutral-700 transition-all"
          >
            + ₹2,500
          </button>
        </div>
      </div>

      {/* Linked Bank Account */}
      <Card padding="md" className="space-y-3">
        <h3 className="text-xs font-bold text-[#17181C] uppercase tracking-wider">Linked Primary Bank Account</h3>
        <div className="p-3 bg-[#F4F6FB] rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E3E8EF] flex items-center justify-center text-[#4787F2]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#17181C]">HDFC Bank •••• 4892</p>
              <p className="text-[11px] text-[#687182]">IFSC: HDFC0000128 • Auto-settle enabled</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold bg-[#EBF9EE] text-[#1B6A2D] px-2.5 py-1 rounded-full">
            Verified
          </span>
        </div>
      </Card>

      {/* Transactions List */}
      <Card padding="lg" className="space-y-4">
        <h3 className="text-xs font-bold text-[#17181C] uppercase tracking-wider">Transaction Activity</h3>
        <div className="divide-y divide-[#F4F6FB]">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#1B6A2D] flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#17181C]">UPI Top-up (GPay)</p>
                <p className="text-[10px] text-[#687182]">Today, 2:40 PM</p>
              </div>
            </div>
            <span className="text-xs font-black text-[#35AB4E]">+ ₹500.00</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 text-[#981837] flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#17181C]">Royal Heritage Coupon Claim</p>
                <p className="text-[10px] text-[#687182]">Yesterday, 5:15 PM</p>
              </div>
            </div>
            <span className="text-xs font-black text-[#981837]">- ₹250.00</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#1B6A2D] flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#17181C]">Festival Promo Cashback</p>
                <p className="text-[10px] text-[#687182]">22 Aug 2026</p>
              </div>
            </div>
            <span className="text-xs font-black text-[#35AB4E]">+ ₹150.00</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
