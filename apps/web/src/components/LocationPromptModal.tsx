'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Sparkles, Navigation, ShieldCheck } from 'lucide-react';
import { Button } from '@adsspot/ui';

interface UserLocation {
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  area: string;
}

export const LocationPromptModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    // Check if user has already granted or configured location
    let timer: NodeJS.Timeout | null = null;
    let storedLoc: string | null = null;
    try {
      if (typeof window !== 'undefined') {
        storedLoc = localStorage.getItem('adsspot_user_location');
      }
    } catch { }

    if (!storedLoc) {
      // Auto prompt on first entry to discover Vadodara / nearby shops
      timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleUseGPS = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          // Detect if coordinate is closer to Vadodara (22.3072, 73.1812) or Mumbai (18.9382, 72.8315)
          const distToVadodara = Math.hypot(latitude - 22.3072, longitude - 73.1812);
          const distToMumbai = Math.hypot(latitude - 18.9382, longitude - 72.8315);

          let detected: UserLocation;
          if (distToVadodara < distToMumbai || (latitude > 21.0 && latitude < 24.0)) {
            detected = {
              city: 'Vadodara',
              pincode: '390007',
              area: 'Alkapuri / Sayajigunj',
              lat: latitude,
              lng: longitude,
            };
          } else {
            detected = {
              city: 'Mumbai',
              pincode: '400001',
              area: 'Fort / South Mumbai',
              lat: latitude,
              lng: longitude,
            };
          }

          localStorage.setItem('adsspot_user_location', JSON.stringify(detected));
          setIsDetecting(false);
          setIsOpen(false);
          window.dispatchEvent(new Event('adsspot_location_changed'));
        },
        () => {
          // Default to Vadodara if permission denied
          handleSelectVadodara();
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      handleSelectVadodara();
    }
  };

  const handleSelectVadodara = () => {
    const loc: UserLocation = {
      city: 'Vadodara',
      pincode: '390007',
      area: 'Alkapuri & Old Padra Road',
      lat: 22.3106,
      lng: 73.1678,
    };
    localStorage.setItem('adsspot_user_location', JSON.stringify(loc));
    setIsDetecting(false);
    setIsOpen(false);
    window.dispatchEvent(new Event('adsspot_location_changed'));
  };

  const handleSelectMumbai = () => {
    const loc: UserLocation = {
      city: 'Mumbai',
      pincode: '400001',
      area: 'Fort & Colaba',
      lat: 18.933,
      lng: 72.834,
    };
    localStorage.setItem('adsspot_user_location', JSON.stringify(loc));
    setIsDetecting(false);
    setIsOpen(false);
    window.dispatchEvent(new Event('adsspot_location_changed'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#17181C]/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E3E8EF] text-center space-y-5 animate-slide-up">
        {/* Spot Ring Header Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#4787F2] via-[#35AB4E] to-[#F2B604] p-1 shadow-lg">
          <div className="w-full h-full bg-white rounded-xl flex items-center justify-center text-[#4787F2]">
            <MapPin className="w-8 h-8 stroke-[2.2] animate-bounce" />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF4FF] text-[#1D53B8] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#4787F2]" /> Hyperlocal Spot Discovery
          </div>
          <h3 className="text-xl font-black text-[#17181C]">Enable Precise Location</h3>
          <p className="text-xs text-[#687182] mt-1 leading-relaxed">
            Allow location access to discover 24-hour festival deals, local shops, and verified businesses in your neighborhood.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-center"
            onClick={handleUseGPS}
            disabled={isDetecting}
            leftIcon={<Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />}
          >
            {isDetecting ? 'Detecting GPS Coordinates...' : 'Use Precise Device GPS'}
          </Button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleSelectVadodara}
              className="p-3 rounded-2xl border border-[#E3E8EF] hover:border-[#4787F2] bg-[#F4F6FB] hover:bg-[#EDF4FF]/50 text-left transition-all group"
            >
              <span className="text-[10px] font-extrabold uppercase text-[#4787F2] block">Gujarat Hub</span>
              <span className="text-xs font-black text-[#17181C] block group-hover:text-[#4787F2]">
                Vadodara 390007
              </span>
              <span className="text-[10px] text-[#687182]">Alkapuri &amp; Mandvi</span>
            </button>

            <button
              onClick={handleSelectMumbai}
              className="p-3 rounded-2xl border border-[#E3E8EF] hover:border-[#4787F2] bg-[#F4F6FB] hover:bg-[#EDF4FF]/50 text-left transition-all group"
            >
              <span className="text-[10px] font-extrabold uppercase text-[#35AB4E] block">Metro Hub</span>
              <span className="text-xs font-black text-[#17181C] block group-hover:text-[#4787F2]">
                Mumbai 400001
              </span>
              <span className="text-[10px] text-[#687182]">Fort &amp; Colaba</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-[#687182] pt-2 border-t border-[#E3E8EF]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#35AB4E]" />
          <span>Your precise GPS is only used on-device for hyperlocal sorting</span>
        </div>
      </div>
    </div>
  );
};
