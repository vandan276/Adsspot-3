'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@adsspot/api';
import { Card, Button } from '@adsspot/ui';
import {
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Building2,
  Wallet as WalletIcon,
  LogIn,
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  title: string;
  time: string;
  amount: number;
}

export default function WalletPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const fetchWallet = async () => {
    if (!user) {
      setBalance(0);
      setTransactions([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/wallet');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBalance(data.wallet?.balance || 0);
          setTransactions(data.transactions || []);
        }
      }
    } catch (err) {
      console.warn('[WalletPage] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleTopUp = async (amt: number) => {
    if (!user) {
      showToast('Please sign in to add funds to your wallet.');
      return;
    }
    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'topup',
          amount: amt,
          title: `UPI Top-up (Instant)`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBalance(data.balance);
        if (data.transaction) {
          setTransactions((prev) => [data.transaction, ...prev]);
        }
        showToast(`Added ₹${amt.toLocaleString()} via UPI to Adsspot Cash!`);
      } else {
        showToast(data.error || 'Failed to process top-up.');
      }
    } catch (err: any) {
      showToast('Payment processing failed. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="flex-1 bg-[#F4F6FB] pb-24 max-w-lg mx-auto w-full min-h-screen p-4 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#E3E8EF] flex items-center justify-center text-[#4787F2] shadow-sm">
          <WalletIcon className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-black text-[#17181C]">Sign In to View Wallet</h1>
        <p className="text-xs text-[#687182] max-w-xs">
          Access your personal Adsspot Cash balance, cashback rewards, and 1-tap UPI payments.
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
    <div className="flex-1 bg-[#F4F6FB] pb-24 max-w-lg mx-auto w-full min-h-screen p-4 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#17181C] text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700">
          <CheckCircle className="w-4 h-4 text-[#35AB4E]" />
          {toastMessage}
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#17181C]">Adsspot Cash</h1>
          <p className="text-xs text-[#687182]">Account: {user.full_name} ({user.phone})</p>
        </div>
      </div>

      {/* Main Cash Balance Card */}
      <div className="p-6 rounded-3xl bg-[#17181C] text-white shadow-2xl space-y-4">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="text-xs font-semibold">Unified Cash Balance</span>
          <span className="flex items-center gap-1 text-[#35AB4E] text-[11px] font-bold">
            <ShieldCheck className="w-4 h-4" /> RBI Escrow Protected
          </span>
        </div>

        <div>
          {loading ? (
            <div className="h-10 w-32 bg-white/10 rounded-xl animate-pulse" />
          ) : (
            <div className="text-4xl font-black text-white">₹{balance.toFixed(2)}</div>
          )}
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
              <p className="text-xs font-bold text-[#17181C]">
                {user.id === 'usr-consumer-1' ? 'HDFC Bank •••• 4892' : 'UPI Linked • Auto-settle'}
              </p>
              <p className="text-[11px] text-[#687182]">Instant P2P &amp; merchant UPI settlements</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold bg-[#EBF9EE] text-[#1B6A2D] px-2.5 py-1 rounded-full">
            Active
          </span>
        </div>
      </Card>

      {/* Transactions List */}
      <Card padding="lg" className="space-y-4">
        <h3 className="text-xs font-bold text-[#17181C] uppercase tracking-wider">Transaction Activity</h3>
        {transactions.length === 0 ? (
          <div className="py-8 text-center text-[#687182] space-y-2">
            <p className="text-xs font-semibold">No Transactions Yet</p>
            <p className="text-[11px]">Top up your wallet above or use Adsspot at nearby verified shops.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F4F6FB]">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-100 text-[#1B6A2D]' : 'bg-red-100 text-[#981837]'
                      }`}
                  >
                    {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#17181C]">{tx.title}</p>
                    <p className="text-[10px] text-[#687182]">{tx.time}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-black ${tx.type === 'credit' ? 'text-[#35AB4E]' : 'text-[#981837]'
                    }`}
                >
                  {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
