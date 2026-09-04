'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@adsspot/api';
import { Avatar } from '@adsspot/ui';
import { MapPin, ChevronDown, Search, Mic, SlidersHorizontal } from 'lucide-react';

const SEARCH_PLACEHOLDERS = [
  "Search 'Sweets & Bakeries'...",
  "Search 'Diamond & Gold Jewellers'...",
  "Search 'Doctors & Clinics'...",
  "Search 'Tours & Travel Packages'...",
  "Search 'Real Estate & Rentals'...",
  "Search 'B2B Manufacturers & Wholesalers'...",
];

export const ZomatoMobileHeader: React.FC<{
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  showFilters?: boolean;
  onFilterClick?: () => void;
}> = ({ onSearchChange, searchValue = '', showFilters = false, onFilterClick }) => {
  const { user } = useAuth();

  const [locationName, setLocationName] = useState({
    area: 'Alkapuri',
    city: 'Vadodara',
    pincode: '390007',
  });

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fadeAnim, setFadeAnim] = useState(true);

  // Read stored location
  useEffect(() => {
    const updateLoc = () => {
      try {
        const stored = localStorage.getItem('adsspot_user_location');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.city) {
            setLocationName({
              area: parsed.area || 'Current Area',
              city: parsed.city,
              pincode: parsed.pincode || '390007',
            });
          }
        }
      } catch {}
    };

    updateLoc();
    window.addEventListener('adsspot_location_changed', updateLoc);
    return () => window.removeEventListener('adsspot_location_changed', updateLoc);
  }, []);

  // Cycling animated search placeholders (like Zomato)
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeAnim(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
        setFadeAnim(true);
      }, 200);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const openLocationSheet = () => {
    window.dispatchEvent(new Event('adsspot_open_location_sheet'));
  };

  return (
    <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#121620]/95 backdrop-blur-xl border-b border-[#E3E8EF]/80 dark:border-white/10 shadow-xs transition-all">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 space-y-2.5">
        {/* ROW 1: Zomato-Style Location Bar & User Profile Access */}
        <div className="flex items-center justify-between gap-3">
          {/* Location Selector Pill */}
          <button
            onClick={openLocationSheet}
            className="flex items-center gap-2 group text-left min-w-0 flex-1 active:scale-98 transition-transform"
          >
            <div className="w-8 h-8 rounded-full bg-[#EDF4FF] dark:bg-[#4787F2]/20 flex items-center justify-center text-[#4787F2] shrink-0 shadow-2xs group-hover:bg-[#4787F2] group-hover:text-white transition-colors">
              <MapPin className="w-4 h-4 fill-current" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 leading-tight">
                <span className="text-xs sm:text-sm font-black text-[#17181C] dark:text-white truncate">
                  {locationName.area}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#4787F2] transition-colors shrink-0" />
              </div>
              <div className="text-[10px] text-[#687182] dark:text-neutral-400 truncate flex items-center gap-1 font-medium">
                <span>{locationName.city}</span>
                <span>•</span>
                <span className="font-mono">{locationName.pincode}</span>
              </div>
            </div>
          </button>

          {/* Right Header Actions: Dark Mode / Wallet / Profile */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/wallet"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#35AB4E]/10 dark:bg-[#35AB4E]/20 text-[#35AB4E] border border-[#35AB4E]/30 text-[11px] font-extrabold active:scale-95 transition-transform"
            >
              <span>UPI</span>
              <span className="text-[9px] bg-[#35AB4E] text-white px-1 rounded-full">₹0</span>
            </Link>

            <Link href={user ? '/profile' : '/login'} className="active:scale-95 transition-transform">
              <Avatar
                src={user?.avatar_url || undefined}
                name={user?.full_name || 'User'}
                size="sm"
                isElite={user?.role === 'super_admin'}
              />
            </Link>
          </div>
        </div>

        {/* ROW 2: Zomato-Style Sticky Animated Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center bg-[#F4F6FB] dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/10 rounded-2xl px-3.5 py-2.5 shadow-2xs focus-within:border-[#4787F2] focus-within:ring-2 focus-within:ring-[#4787F2]/15 transition-all">
            <Search className="w-4 h-4 text-[#4787F2] shrink-0 mr-2.5" />

            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
              className={`w-full bg-transparent text-xs font-bold text-[#17181C] dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none transition-opacity duration-200 ${
                fadeAnim ? 'opacity-100' : 'opacity-40'
              }`}
            />

            {searchValue ? (
              <button
                onClick={() => onSearchChange && onSearchChange('')}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white text-xs font-black p-0.5"
              >
                ✕
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
                    alert('Listening... Speak store name or category.');
                  }
                }}
                className="text-neutral-400 hover:text-[#4787F2] transition-colors p-0.5"
                title="Voice Search"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {showFilters && (
            <button
              onClick={onFilterClick}
              className="p-2.5 rounded-2xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/10 text-neutral-700 dark:text-neutral-200 hover:text-[#4787F2] hover:border-[#4787F2] shadow-2xs active:scale-95 transition-all shrink-0"
              title="Filter Stores"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
