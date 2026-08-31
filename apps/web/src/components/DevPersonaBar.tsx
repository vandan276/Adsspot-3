'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@adsspot/api';
import { Sparkles, Shield, User, Store, MapPin, Building2, Crown } from 'lucide-react';

export const DevPersonaBar: React.FC = () => {
  const router = useRouter();
  const { user, loginWithEmail } = useAuth();

  const handleSwitchRole = async (_roleSlug: string, email: string) => {
    try {
      const res = await loginWithEmail(email, 'adsspot123');
      if (res.success && res.user) {
        if (res.user.role === 'super_admin' || res.user.dashboard_type === 'admin') router.push('/admin');
        else if (res.user.role === 'zo' || res.user.dashboard_type === 'zo') router.push('/zo');
        else if (res.user.role === 'ro' || res.user.dashboard_type === 'ro') router.push('/ro');
        else if (res.user.role === 'sm' || res.user.dashboard_type === 'sm') router.push('/sm');
        else if (res.user.role === 'merchant' || res.user.dashboard_type === 'merchant') router.push('/merchant');
        else router.push('/feed');
      }
    } catch (e) {
      console.warn('Switch failed:', e);
    }
  };

  const getIcon = (role: string) => {
    if (role === 'super_admin') return <Crown className="w-3.5 h-3.5 text-purple-400" />;
    if (role === 'zo') return <Building2 className="w-3.5 h-3.5 text-red-400" />;
    if (role === 'ro') return <Shield className="w-3.5 h-3.5 text-emerald-400" />;
    if (role === 'sm') return <MapPin className="w-3.5 h-3.5 text-blue-400" />;
    if (role === 'merchant') return <Store className="w-3.5 h-3.5 text-amber-400" />;
    return <User className="w-3.5 h-3.5 text-slate-300" />;
  };

  const personas = [
    { role: 'super_admin', name: 'Super Admin', email: 'admin@adsspot.in' },
    { role: 'zo', name: 'ZO', email: 'zo@adsspot.in' },
    { role: 'ro', name: 'RO', email: 'ro@adsspot.in' },
    { role: 'sm', name: 'SM', email: 'sm@adsspot.in' },
    { role: 'merchant', name: 'Merchant', email: 'merchant.rajesh@adsspot.in' },
    { role: 'consumer', name: 'Consumer', email: 'priya@adsspot.in' },
  ];

  return (
    <div className="hidden sm:block bg-[#17181C] text-white border-b border-neutral-800 text-xs py-1.5 px-4 sticky top-0 z-50 shadow-md w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('adsspot:trigger-splash'));
              }
            }}
            className="flex items-center gap-1 font-bold text-amber-400 uppercase tracking-wider text-[10px] bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30 transition-colors shrink-0"
          >
            <Sparkles className="w-3 h-3" /> ✨ Replay Splash
          </button>
          <span className="text-neutral-400">Active:</span>
          <span className="font-semibold text-white truncate max-w-[200px]">
            {user?.full_name || 'Guest'} ({user?.role || 'Guest'})
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {personas.map((p) => {
            const isActive = user?.role === p.role || user?.email === p.email;
            return (
              <button
                key={p.role}
                onClick={() => handleSwitchRole(p.role, p.email)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#4787F2] text-white shadow-sm font-bold scale-[1.02]'
                    : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                }`}
              >
                {getIcon(p.role)}
                <span className="whitespace-nowrap">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
