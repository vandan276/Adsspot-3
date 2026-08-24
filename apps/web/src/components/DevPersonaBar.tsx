'use client';

import React from 'react';
import { useAuth } from '@adsspot/api';
import { UserRole } from '@adsspot/types';
import { Sparkles, Shield, User, Store, MapPin, Building2, Crown } from 'lucide-react';

export const DevPersonaBar: React.FC = () => {
  const { user, switchPersona, personas } = useAuth();

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
    <div className="bg-[#17181C] text-white border-b border-neutral-800 text-xs py-1.5 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="flex items-center gap-1 font-bold text-amber-400 uppercase tracking-wider text-[10px] bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            <Sparkles className="w-3 h-3" /> Dev Fast-Switcher
          </span>
          <span className="text-neutral-400 hidden sm:inline">Active:</span>
          <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">
            {user?.full_name || 'Guest'} ({user?.role})
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {personas.map((p) => {
            const isActive = user?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => switchPersona(p.id)}
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
