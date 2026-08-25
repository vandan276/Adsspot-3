'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
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
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeBiz, setActiveBiz] = useState<Business | null>(null);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');
  const [isLocating, setIsLocating] = useState(false);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [18.933, 72.834], // Fort, South Mumbai center
      zoom: 15,
      zoomControl: false,
    });

    // Add Zoom control on top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initial tile layer
    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Markers layer group
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 2. Handle Map Style Switch
  useEffect(() => {
    if (!mapRef.current) return;
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    const newTileUrl =
      mapStyle === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const newTileLayer = L.tileLayer(newTileUrl, {
      attribution: mapStyle === 'satellite' ? 'Esri &copy; OpenStreetMap' : '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(mapRef.current);

    tileLayerRef.current = newTileLayer;
  }, [mapStyle]);

  // 3. Render Spot Markers with Custom HTML & Spot Ring
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    businesses.forEach((biz) => {
      const ringGradient =
        biz.tier === 'elite'
          ? 'conic-gradient(from 0deg, #4787F2, #35AB4E, #F2B604, #981837, #4787F2)'
          : biz.tier === 'premium'
            ? '#35AB4E'
            : '#4787F2';

      const customIconHtml = `
        <div style="cursor: pointer; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
          <div style="
            position: relative;
            width: 42px;
            height: 42px;
            border-radius: 13px;
            padding: 2.5px;
            background: ${ringGradient};
            box-shadow: 0 4px 14px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <img src="${biz.logo_url || ''}" style="
              width: 100%;
              height: 100%;
              border-radius: 10px;
              object-fit: cover;
              background: #fff;
            " />
            ${
              biz.tier === 'elite'
                ? `<div style="
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    background: #981837;
                    color: #fff;
                    font-size: 8px;
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
            margin-top: 3px;
            background: rgba(23, 24, 28, 0.92);
            color: #fff;
            font-size: 10px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 9999px;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          ">${biz.name.split(' ')[0]}</div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-spot-marker',
        html: customIconHtml,
        iconSize: [42, 56],
        iconAnchor: [21, 28],
      });

      const marker = L.marker([biz.lat, biz.lng], { icon: customIcon });

      marker.on('click', () => {
        setActiveBiz(biz);
        if (onSelectBusiness) onSelectBusiness(biz);
        mapRef.current?.flyTo([biz.lat, biz.lng], 16, { animate: true, duration: 1 });
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [businesses, onSelectBusiness]);

  // 4. Locate User GPS
  const handleLocateMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setIsLocating(false);

          if (mapRef.current) {
            mapRef.current.flyTo([latitude, longitude], 16, { animate: true, duration: 1.2 });

            const userIconHtml = `
              <div style="
                width: 18px;
                height: 18px;
                background: #4787F2;
                border: 3px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 14px #4787F2;
                transform: translate(-50%, -50%);
              "></div>
            `;
            const userIcon = L.divIcon({
              className: 'user-gps-pulse',
              html: userIconHtml,
              iconSize: [18, 18],
              iconAnchor: [9, 9],
            });

            L.marker([latitude, longitude], { icon: userIcon }).addTo(mapRef.current);
          }
        },
        () => {
          setIsLocating(false);
          if (mapRef.current) {
            mapRef.current.flyTo([18.933, 72.834], 15);
          }
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  return (
    <div className="relative w-full h-[65vh] min-h-[420px] rounded-3xl overflow-hidden shadow-xl border border-[#E3E8EF] bg-[#F4F6FB]">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

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
