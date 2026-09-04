'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@adsspot/api';
import { Card, Button } from '@adsspot/ui';
import {
  Handshake,
  Users,
  Copy,
  Check,
  Share2,
  Wallet as WalletIcon,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  LogIn,
  Store,
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  title: string;
  time: string;
  amount: number;
}

export default function PartnerPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'partner' | 'wallet'>('partner');
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const referralCount = 6;
  const earnings = 1800;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const referralCode = user?.id ? `ADSSPOT-${user.phone?.slice(-4) || 'VIP88'}` : 'ADSSPOT-PARTNER';
  const referralLink = `https://adsspot.in/r/${referralCode}`;

  useEffect(() => {
    if (!user) {
      setBalance(0);
      setTransactions([]);
      return;
    }

    const storedBalance = localStorage.getItem(`adsspot_wallet_${user.id}`);
    if (storedBalance !== null) {
      setBalance(parseFloat(storedBalance));
    } else {
      const defaultBal = Number(user.wallet?.balance || 0.0);
      setBalance(defaultBal);
      localStorage.setItem(`adsspot_wallet_${user.id}`, defaultBal.toString());
    }

    const storedTx = localStorage.getItem(`adsspot_tx_${user.id}`);
    if (storedTx) {
      try {
        setTransactions(JSON.parse(storedTx));
      } catch {
        setTransactions([]);
      }
    } else {
      if (user.id === 'usr-consumer-1') {
        const demoTx: Transaction[] = [
          { id: 'tx-ref-1', type: 'credit', title: 'Merchant Referral Reward (Mandap)', time: 'Today, 11:20 AM', amount: 500.0 },
          { id: 'tx-1', type: 'credit', title: 'UPI Top-up (GPay)', time: 'Yesterday, 2:40 PM', amount: 500.0 },
          { id: 'tx-2', type: 'debit', title: 'Royal Heritage Coupon Claim', time: '22 Aug 2026', amount: 250.0 },
          { id: 'tx-ref-2', type: 'credit', title: 'Friend Joining Bonus (Rahul K.)', time: '20 Aug 2026', amount: 150.0 },
        ];
        setTransactions(demoTx);
        localStorage.setItem(`adsspot_tx_${user.id}`, JSON.stringify(demoTx));
      } else {
        setTransactions([]);
      }
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🚀 Join Adsspot to discover verified local spots and claim exclusive deals! Use my referral code ${referralCode} to get ₹100 instant bonus:\n${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleTopUp = (amt: number) => {
    if (!user) {
      showToast('Please sign in to add funds.');
      return;
    }
    const newBal = balance + amt;
    setBalance(newBal);
    localStorage.setItem(`adsspot_wallet_${user.id}`, newBal.toString());

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'credit',
      title: 'UPI Top-up (Instant)',
      time: 'Just now',
      amount: amt,
    };
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    localStorage.setItem(`adsspot_tx_${user.id}`, JSON.stringify(updatedTx));

    showToast(`Added ₹${amt.toLocaleString()} via UPI to Adsspot Cash!`);
  };

  if (!user) {
    return (
      <div className="flex-1 bg-[#F4F6FB] pb-28 max-w-lg mx-auto w-full min-h-screen p-4 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#E3E8EF] flex items-center justify-center text-[#4787F2] shadow-sm">
          <Handshake className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-black text-[#17181C]">Adsspot Partner &amp; Referrals</h1>
        <p className="text-xs text-[#687182] max-w-xs">
          Earn ₹500 on every merchant you onboard and ₹100 when your friends join Adsspot.
        </p>
        <Link href="/login">
          <Button variant="primary" size="md" leftIcon={<LogIn className="w-4 h-4" />}>
            Sign In with Phone
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F4F6FB] pb-28 max-w-lg mx-auto w-full min-h-screen p-4 space-y-4">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#17181C] text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700 animate-fade-in whitespace-nowrap">
          <ShieldCheck className="w-4 h-4 text-[#35AB4E]" />
          {toastMessage}
        </div>
      )}

      {/* Header & Sub-tab Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#17181C] tracking-tight">Partner &amp; Wallet</h1>
          <p className="text-xs text-[#687182]">Referral commissions, passbook &amp; rewards</p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white p-1 rounded-full border border-[#E3E8EF] shadow-xs flex items-center">
          <button
            onClick={() => setActiveTab('partner')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              activeTab === 'partner' ? 'bg-[#4787F2] text-white shadow-xs' : 'text-[#687182] hover:text-[#17181C]'
            }`}
          >
            Referral
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              activeTab === 'wallet' ? 'bg-[#4787F2] text-white shadow-xs' : 'text-[#687182] hover:text-[#17181C]'
            }`}
          >
            Wallet
          </button>
        </div>
      </div>

      {activeTab === 'partner' ? (
        /* ================= 🤝 PARTNER & REFERRAL VIEW ================= */
        <div className="space-y-4">
          {/* 1. Partner Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17181C] via-[#242730] to-[#17181C] text-white p-5 shadow-xl border border-neutral-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F2B604]/20 border border-[#F2B604]/40 text-[#F2B604] text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> Adsspot Partner Club
                </span>
                <h2 className="text-xl font-black mt-2 leading-tight">
                  Earn Up to <span className="text-[#F2B604]">₹500</span> Per Lead
                </h2>
                <p className="text-xs text-neutral-300 mt-1 max-w-[240px]">
                  Refer local shops, salons &amp; restaurants to Adsspot and earn instant direct payouts.
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-[#4787F2]/20 border border-[#4787F2]/40 flex items-center justify-center text-[#4787F2] shrink-0">
                <Handshake className="w-6 h-6" />
              </div>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] font-bold text-neutral-400 block uppercase">Total Referred</span>
                <span className="text-lg font-black text-white">{referralCount} Partners</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] font-bold text-neutral-400 block uppercase">Earned Commission</span>
                <span className="text-lg font-black text-[#35AB4E]">₹{earnings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 2. Referral Code & Sharing Card */}
          <Card padding="lg" className="space-y-3 bg-white shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#17181C]">Your Personal Referral Code</h3>
            
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F6FB] border border-[#E3E8EF]">
              <span className="text-base font-black text-[#4787F2] tracking-wider">{referralCode}</span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E3E8EF] hover:border-[#4787F2] text-xs font-bold text-[#17181C] shadow-2xs transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#35AB4E]" /> : <Copy className="w-3.5 h-3.5 text-[#4787F2]" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Share buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleShareWhatsApp}
                className="py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" /> Share on WhatsApp
              </button>
              <button
                onClick={handleCopyLink}
                className="py-2.5 rounded-full bg-[#4787F2] hover:bg-[#3972D4] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Invite Link
              </button>
            </div>
          </Card>

          {/* 3. Partner Commission Tiers */}
          <Card padding="md" className="space-y-3 bg-white shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#17181C]">Partner Reward Tiers</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F6FB] border border-[#E3E8EF]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EDF4FF] text-[#4787F2] flex items-center justify-center shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#17181C]">Merchant Onboarding</h4>
                    <p className="text-[10px] text-[#687182]">When a local shop registers via your link</p>
                  </div>
                </div>
                <span className="text-sm font-black text-[#35AB4E]">₹500 / biz</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F6FB] border border-[#E3E8EF]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#17181C]">Consumer Friend Invite</h4>
                    <p className="text-[10px] text-[#687182]">When your friend completes first visit</p>
                  </div>
                </div>
                <span className="text-sm font-black text-[#35AB4E]">₹100 / user</span>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* ================= 💳 PASSBOOK & WALLET VIEW ================= */
        <div className="space-y-4">
          {/* Card 1: Balance Header */}
          <div className="bg-gradient-to-br from-[#1D53B8] via-[#4787F2] to-[#2B70C9] rounded-3xl p-5 text-white shadow-lg space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider">
                  Adsspot Cash Balance
                </span>
                <h2 className="text-3xl font-black tracking-tight mt-0.5">
                  ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
              </div>
              <div className="p-2 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20">
                <WalletIcon className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleTopUp(500)}
                className="flex-1 py-2.5 rounded-full bg-white text-[#1D53B8] font-bold text-xs flex items-center justify-center gap-1.5 shadow hover:bg-neutral-50 active:scale-95 transition-all"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" /> +₹500 Top-up
              </button>
              <button
                onClick={() => handleTopUp(1000)}
                className="flex-1 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/30 active:scale-95 transition-all"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" /> +₹1,000 Top-up
              </button>
            </div>
          </div>

          {/* Card 2: Recent Transactions */}
          <Card padding="md" className="space-y-3 bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#17181C]">Passbook Activity</h3>
              <span className="text-[10px] text-[#687182] font-semibold">{transactions.length} Total</span>
            </div>

            <div className="divide-y divide-neutral-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                        tx.type === 'credit'
                          ? 'bg-[#EBF9F3] text-[#35AB4E]'
                          : 'bg-[#FFF1EE] text-[#E14D2A]'
                      }`}
                    >
                      {tx.type === 'credit' ? (
                        <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#17181C] leading-tight">{tx.title}</h4>
                      <span className="text-[10px] text-[#687182]">{tx.time}</span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-black ${
                      tx.type === 'credit' ? 'text-[#35AB4E]' : 'text-[#E14D2A]'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}

              {transactions.length === 0 && (
                <div className="py-6 text-center text-xs text-[#687182]">No passbook activity yet</div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
