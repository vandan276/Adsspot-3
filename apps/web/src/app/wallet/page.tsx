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
      const defaultBal = user.id === 'usr-consumer-1' ? 1540.0 : 0.0;
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
          { id: 'tx-1', type: 'credit', title: 'UPI Top-up (GPay)', time: 'Today, 2:40 PM', amount: 500.0 },
          { id: 'tx-2', type: 'debit', title: 'Royal Heritage Coupon Claim', time: 'Yesterday, 5:15 PM', amount: 250.0 },
          { id: 'tx-3', type: 'credit', title: 'Festival Promo Cashback', time: '22 Aug 2026', amount: 150.0 },
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

  const handleTopUp = (amt: number) => {
    if (!user) {
      showToast('Please sign in to add funds to your wallet.');
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-emerald-100 text-[#1B6A2D]' : 'bg-red-100 text-[#981837]'
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
                  className={`text-xs font-black ${
                    tx.type === 'credit' ? 'text-[#35AB4E]' : 'text-[#981837]'
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
