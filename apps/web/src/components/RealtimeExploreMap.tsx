'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Link from 'next/link';
import { Business } from '@adsspot/types';
import { TrustedBadge } from '@adsspot/ui';
import {
  MapPin,
  Navigation,
  Layers,
} from 'lucide-react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || '';

interface RealtimeExploreMapProps {
  businesses: Business[];
  selectedCategory?: string;
  onSelectBusiness?: (biz: Business) => void;
}

export const RealtimeExploreMap: React.FC<RealtimeExploreMapProps> = ({
  businesses,
  onSelectBusiness,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [activeBiz, setActiveBiz] = useState<Business | null>(null);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'maptiler'>('streets');
  const [isLocating, setIsLocating] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style:
        mapStyle === 'satellite'
          ? 'mapbox://styles/mapbox/satellite-streets-v12'
          : mapStyle === 'maptiler'
            ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`
            : 'mapbox://styles/mapbox/streets-v12',
      center: [72.8315, 18.9382], // Fort / Mumbai South center
      zoom: 14.5,
      pitch: 35,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [mapStyle]);

  // Update Markers when businesses change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    businesses.forEach((biz) => {
      // Custom HTML Marker with Spot Ring
      const el = document.createElement('div');
      el.className = 'group cursor-pointer transform transition-transform hover:scale-125';
      el.innerHTML = `
        <div style="
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 14px;
          padding: 2.5px;
          background: ${
            biz.tier === 'elite'
              ? 'conic-gradient(from 0deg, #4787F2, #35AB4E, #F2B604, #981837, #4787F2)'
              : biz.tier === 'premium'
                ? '#35AB4E'
                : '#4787F2'
          };
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <img src="${biz.logo_url || ''}" style="
            width: 100%;
            height: 100%;
            border-radius: 11px;
            object-fit: cover;
            background: #fff;
          " />
          ${
            biz.tier === 'elite'
              ? `<div style="
                  position: absolute;
                  top: -4px;
                  right: -4px;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: #981837;
                  color: #fff;
                  font-size: 9px;
                  font-weight: 900;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 1.5px solid #fff;
                ">★</div>`
              : ''
          }
        </div>
        <div style="
          margin-top: 2px;
          background: rgba(23, 24, 28, 0.9);
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 9999px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          text-align: center;
        ">${biz.name.split(' ')[0]}</div>
      `;

      el.addEventListener('click', () => {
        setActiveBiz(biz);
        if (onSelectBusiness) onSelectBusiness(biz);
        map.flyTo({ center: [biz.lng, biz.lat], zoom: 16, pitch: 45, speed: 1.2 });
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([biz.lng, biz.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [businesses, onSelectBusiness]);

  // Locate User GPS
  const handleLocateMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setIsLocating(false);

          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 15.5,
              pitch: 40,
            });

            // Add user pulse marker
            const el = document.createElement('div');
            el.innerHTML = `
              <div style="
                width: 20px;
                height: 20px;
                background: #4787F2;
                border: 3px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 12px #4787F2;
                animation: pulse 1.5s infinite;
              "></div>
            `;
            new mapboxgl.Marker({ element: el })
              .setLngLat([longitude, latitude])
              .addTo(mapRef.current);
          }
        },
        () => {
          setIsLocating(false);
          // Fallback to Fort Mumbai center
          if (mapRef.current) {
            mapRef.current.flyTo({ center: [72.8315, 18.9382], zoom: 15 });
          }
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  return (
    <div className="relative w-full h-[65vh] min-h-[420px] rounded-3xl overflow-hidden shadow-xl border border-[#E3E8EF] bg-neutral-900">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Map Controls */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {/* Style Switcher */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-neutral-200 flex items-center gap-1.5 text-xs font-bold">
          <Layers className="w-3.5 h-3.5 text-[#4787F2]" />
          <select
            value={mapStyle}
            onChange={(e) => setMapStyle(e.target.value as any)}
            className="bg-transparent outline-none cursor-pointer text-[#17181C]"
          >
            <option value="streets">Mapbox Streets</option>
            <option value="satellite">Satellite Hybrid</option>
            <option value="maptiler">MapTiler Vector</option>
          </select>
        </div>

        {/* Real-time GPS Locator */}
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          className="bg-white/95 hover:bg-white backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-neutral-200 flex items-center gap-1.5 text-xs font-bold text-[#4787F2] transition-transform active:scale-95"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
        </button>
      </div>

      {/* Realtime Live Marker Pill */}
      <div className="absolute top-3 right-12 z-10 bg-[#17181C]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-lg text-[11px] font-extrabold flex items-center gap-2 border border-neutral-700">
        <span className="w-2 h-2 rounded-full bg-[#35AB4E] animate-ping" />
        <span>{businesses.length} Real-time Spots</span>
      </div>

      {/* Active Business Floating Card Popup */}
      {activeBiz && (
        <div className="absolute bottom-4 left-4 right-4 z-20 max-w-sm mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-neutral-200 animate-slide-up">
          <div className="flex items-start justify-between gap-3">
            <img
              src={activeBiz.logo_url || ''}
              alt={activeBiz.name}
              className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-[#17181C] truncate">{activeBiz.name}</h4>
                {activeBiz.trusted && <TrustedBadge size="sm" />}
              </div>
              <p className="text-xs text-[#687182] truncate mt-0.5">{activeBiz.description}</p>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] font-semibold text-[#4787F2]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {activeBiz.address}
                </span>
                <span className="text-[#35AB4E] font-bold">★ {activeBiz.stats?.avg_rating || 4.8}</span>
              </div>
            </div>
            <button
              onClick={() => setActiveBiz(null)}
              className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2 mt-3 pt-3 border-t border-neutral-200">
            <Link href={`/card/${activeBiz.slug}`} className="flex-1">
              <button className="w-full py-2 rounded-full bg-[#4787F2] text-white font-extrabold text-xs shadow hover:bg-[#3972D4] transition-all">
                Digital Visiting Card
              </button>
            </Link>
            {activeBiz.tier === 'elite' && (
              <Link href={`/b/${activeBiz.slug}`} className="flex-1">
                <button className="w-full py-2 rounded-full bg-white text-[#981837] border border-[#981837]/30 font-extrabold text-xs hover:bg-red-50 transition-all">
                  Elite Microsite
                </button>
              </Link>
            )}
            <a
              href={`https://maps.google.com/?q=${activeBiz.lat},${activeBiz.lng}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-[#EDF4FF] text-[#4787F2] hover:bg-[#D9E8FF]"
              title="Get Directions"
            >
              <Navigation className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
