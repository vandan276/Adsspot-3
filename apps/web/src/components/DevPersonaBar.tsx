'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@adsspot/api';
import { UserRole } from '@adsspot/types';
import { Sparkles, Shield, User, Store, MapPin, Building2, Crown } from 'lucide-react';

export const DevPersonaBar: React.FC = () => {
  const router = useRouter();
  const { user, switchPersona, personas } = useAuth();

  const handleSwitch = (p: (typeof personas)[0]) => {
    switchPersona(p.id);
    if (p.role === 'super_admin') router.push('/admin');
    else if (p.role === 'zo') router.push('/zo');
    else if (p.role === 'ro') router.push('/ro');
    else if (p.role === 'sm') router.push('/sm');
    else if (p.role === 'merchant') router.push('/merchant');
    else router.push('/');
  };

  const getIcon = (role: UserRole, tier?: string) => {
    if (role === 'super_admin') return <Crown className="w-3.5 h-3.5 text-purple-400" />;
    if (role === 'zo') return <Building2 className="w-3.5 h-3.5 text-red-400" />;
    if (role === 'ro') return <Shield className="w-3.5 h-3.5 text-emerald-400" />;
    if (role === 'sm') return <MapPin className="w-3.5 h-3.5 text-blue-400" />;
    if (role === 'merchant') {
      if (tier === 'elite') return <Crown className="w-3.5 h-3.5 text-amber-400" />;
      return <Store className="w-3.5 h-3.5 text-amber-400" />;
    }
    return <User className="w-3.5 h-3.5 text-slate-300" />;
  };

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
            {user?.full_name || 'Guest'} ({user?.role})
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {personas.map((p) => {
            const isActive = user?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSwitch(p)}
                title={`${p.name} — ${p.description}`}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#4787F2] text-white shadow-sm font-bold scale-[1.02]'
                    : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                }`}
              >
                {getIcon(p.role, p.tier)}
                <span className="whitespace-nowrap">
                  {p.role === 'merchant' ? `Merch (${p.tier})` : p.role.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
