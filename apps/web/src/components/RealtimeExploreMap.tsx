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

  // Initialize Map with reliable standard tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let mapInstance: mapboxgl.Map | null = null;
    try {
      // Standard raster tile style (CartoDB / OpenStreetMap)
      const mapboxStyle = {
        version: 8 as const,
        sources: {
          'osm-raster-tiles': {
            type: 'raster' as const,
            tiles:
              mapStyle === 'satellite'
                ? [
                    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                  ]
                : [
                    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors',
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: 'background',
            type: 'background' as const,
            paint: {
              'background-color': '#e5e3df',
            },
          },
          {
            id: 'osm-raster-layer',
            type: 'raster' as const,
            source: 'osm-raster-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      };

      mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapboxStyle as any,
        center: [72.834, 18.933], // Fort / South Mumbai shopping hub
        zoom: 14.8,
        pitch: 0,
      });

      mapInstance.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');
      mapRef.current = mapInstance;
    } catch (e) {
      console.warn('Map canvas init notice:', e);
    }

    return () => {
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch {}
      }
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

      {/* Top Map Controls - Responsively Stacked without Overlapping */}
      <div className="absolute top-3 left-3 right-14 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Style Switcher */}
          <div className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-lg border border-neutral-200 flex items-center gap-1.5 text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-[#4787F2]" />
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value as any)}
              className="bg-transparent outline-none cursor-pointer text-[#17181C] text-xs font-bold"
            >
              <option value="streets">Streets</option>
              <option value="satellite">Satellite</option>
            </select>
          </div>

          {/* Real-time GPS Locator */}
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="bg-white/95 hover:bg-white backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-neutral-200 flex items-center gap-1.5 text-xs font-bold text-[#4787F2] transition-transform active:scale-95 shrink-0"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'Near Me'}</span>
          </button>
        </div>

        {/* Realtime Live Marker Pill */}
        <div className="bg-[#17181C]/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full shadow-lg text-[10px] font-extrabold flex items-center gap-1.5 border border-neutral-700 pointer-events-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#35AB4E] animate-ping" />
          <span>{businesses.length} Spots</span>
        </div>
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
