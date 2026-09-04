'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, ShieldCheck, X, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface UserLocation {
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  area: string;
}

const POPULAR_AREAS = [
  { city: 'Vadodara', pincode: '390007', area: 'Alkapuri & Old Padra Road', lat: 22.3106, lng: 73.1678 },
  { city: 'Vadodara', pincode: '390001', area: 'Raopura & Mandvi Gate', lat: 22.3008, lng: 73.2043 },
  { city: 'Vadodara', pincode: '390020', area: 'Gotri & Sevasi', lat: 22.3188, lng: 73.1412 },
  { city: 'Vadodara', pincode: '390005', area: 'Sayajigunj & Fatehgunj', lat: 22.3176, lng: 73.1895 },
  { city: 'Vadodara', pincode: '390011', area: 'Manjalpur & Makarpura', lat: 22.2682, lng: 73.1952 },
  { city: 'Mumbai', pincode: '400001', area: 'Fort & South Mumbai', lat: 18.9382, lng: 72.8315 },
  { city: 'Ahmedabad', pincode: '380015', area: 'SG Highway & Vastrapur', lat: 23.0338, lng: 72.5262 },
];

export const LocationPromptModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [activeArea, setActiveArea] = useState<string>('390007');

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let storedLoc: string | null = null;
    try {
      if (typeof window !== 'undefined') {
        storedLoc = localStorage.getItem('adsspot_user_location');
        if (storedLoc) {
          const parsed = JSON.parse(storedLoc);
          if (parsed.pincode) setActiveArea(parsed.pincode);
        }
      }
    } catch {}

    if (!storedLoc) {
      timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
    }

    // Listen for custom trigger to open location sheet
    const handleOpenSheet = () => setIsOpen(true);
    window.addEventListener('adsspot_open_location_sheet', handleOpenSheet);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('adsspot_open_location_sheet', handleOpenSheet);
    };
  }, []);

  const handleUseGPS = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            const res = await fetch(`/api/location/reverse?lat=${latitude}&lng=${longitude}`);
            const data = await res.json();
            if (data && data.success && data.location) {
              const detected: UserLocation = {
                city: data.location.city || 'Vadodara',
                pincode: data.location.pincode || '390007',
                area: data.location.area || 'Current Location',
                lat: latitude,
                lng: longitude,
              };
              localStorage.setItem('adsspot_user_location', JSON.stringify(detected));
              setActiveArea(detected.pincode);
              setIsDetecting(false);
              setIsOpen(false);
              window.dispatchEvent(new Event('adsspot_location_changed'));
              return;
            }
          } catch {}

          // Fallback heuristic if reverse geocoding is unavailable
          const distToVadodara = Math.hypot(latitude - 22.3072, longitude - 73.1812);
          const detected: UserLocation = distToVadodara < 1.0 || (latitude > 21.0 && latitude < 24.0)
            ? { city: 'Vadodara', pincode: '390007', area: 'Alkapuri / Current GPS', lat: latitude, lng: longitude }
            : { city: 'Mumbai', pincode: '400001', area: 'Current GPS Location', lat: latitude, lng: longitude };

          localStorage.setItem('adsspot_user_location', JSON.stringify(detected));
          setActiveArea(detected.pincode);
          setIsDetecting(false);
          setIsOpen(false);
          window.dispatchEvent(new Event('adsspot_location_changed'));
        },
        () => {
          handleSelectArea(POPULAR_AREAS[0]!);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      handleSelectArea(POPULAR_AREAS[0]!);
    }
  };

  const handleSelectArea = (item: typeof POPULAR_AREAS[0]) => {
    const loc: UserLocation = {
      city: item.city,
      pincode: item.pincode,
      area: item.area,
      lat: item.lat,
      lng: item.lng,
    };
    localStorage.setItem('adsspot_user_location', JSON.stringify(loc));
    setActiveArea(item.pincode);
    setIsDetecting(false);
    setIsOpen(false);
    window.dispatchEvent(new Event('adsspot_location_changed'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Zomato-Style Bottom Sheet Drawer */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-[#121620] rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-[#E3E8EF] dark:border-white/10 z-10 overflow-hidden animate-slide-up max-h-[88vh] flex flex-col">
        {/* iOS Drag Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        </div>

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E3E8EF] dark:border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-[#17181C] dark:text-white tracking-tight flex items-center gap-1.5">
              <span>Select Your Location</span>
              <Sparkles className="w-4 h-4 text-[#F2B604]" />
            </h3>
            <p className="text-xs text-[#687182] dark:text-neutral-400 mt-0.5">
              Find hyperlocal shops, offers &amp; stories near you
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* GPS Auto-detect Button */}
          <button
            onClick={handleUseGPS}
            disabled={isDetecting}
            className="w-full p-3.5 rounded-2xl bg-[#EDF4FF] dark:bg-[#4787F2]/15 border border-[#4787F2]/30 text-[#4787F2] hover:bg-[#4787F2]/20 flex items-center justify-between transition-all active:scale-98 group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4787F2] text-white flex items-center justify-center shadow-sm">
                <Navigation className={`w-5 h-5 ${isDetecting ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-[#17181C] dark:text-white">
                  {isDetecting ? 'Detecting GPS coordinates...' : 'Use Current Location'}
                </div>
                <span className="text-[11px] text-[#4787F2] font-semibold">Enable GPS for 100% exact stores</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#4787F2]" />
          </button>

          {/* Popular Local Areas */}
          <div>
            <div className="text-[11px] font-black uppercase text-[#687182] dark:text-neutral-400 tracking-wider mb-2.5 px-1">
              Popular Territories &amp; Pincodes
            </div>
            <div className="space-y-1.5">
              {POPULAR_AREAS.map((item) => {
                const isSelected = activeArea === item.pincode;
                return (
                  <button
                    key={item.pincode + item.area}
                    onClick={() => handleSelectArea(item)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-98 ${
                      isSelected
                        ? 'border-[#4787F2] bg-[#EDF4FF]/50 dark:bg-[#4787F2]/10 shadow-xs'
                        : 'border-[#E3E8EF] dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#4787F2] text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                      }`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#17181C] dark:text-white truncate">
                          {item.area}
                        </div>
                        <div className="text-[11px] text-[#687182] dark:text-neutral-400">
                          {item.city} • <span className="font-mono font-semibold">{item.pincode}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-[#4787F2] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info tag */}
        <div className="p-3 bg-[#F4F6FB] dark:bg-[#0B0E14] border-t border-[#E3E8EF] dark:border-white/10 text-center flex items-center justify-center gap-1.5 text-[11px] text-[#687182] dark:text-neutral-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#35AB4E]" />
          <span>All stores verified by Adsspot Sales Managers with GPS</span>
        </div>
      </div>
    </div>
  );
};
