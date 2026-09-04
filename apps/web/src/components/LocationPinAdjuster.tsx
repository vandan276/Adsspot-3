'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

interface LocationPinAdjusterProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
  height?: string;
}

export const LocationPinAdjuster: React.FC<LocationPinAdjusterProps> = ({
  initialLat = 22.3072, // Vadodara default
  initialLng = 73.1812,
  onLocationChange,
  className = '',
  height = '320px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [lat, setLat] = useState<number>(initialLat || 22.3072);
  const [lng, setLng] = useState<number>(initialLng || 73.1812);
  const [isLocating, setIsLocating] = useState(false);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Sync with prop changes if initialLat/Lng change externally
  useEffect(() => {
    if (initialLat && initialLng && (initialLat !== lat || initialLng !== lng)) {
      setLat(initialLat);
      setLng(initialLng);
      if (markerRef.current && mapRef.current) {
        markerRef.current.setLatLng([initialLat, initialLng]);
        mapRef.current.panTo([initialLat, initialLng]);
      }
    }
  }, [initialLat, initialLng]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const startLat = lat || 22.3072;
    const startLng = lng || 73.1812;

    const map = L.map(mapContainerRef.current, {
      center: [startLat, startLng],
      zoom: 16,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const tileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
        subdomains: 'abcd',
      }
    ).addTo(map);
    tileLayerRef.current = tileLayer;

    // Custom Draggable Pin HTML
    const pinIconHtml = `
      <div style="cursor: grab; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="
          width: 36px;
          height: 36px;
          background: #4787F2;
          border: 3px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 14px rgba(71, 135, 242, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 14px;
            height: 14px;
            background: #ffffff;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
        <div style="
          background: #17181C;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
          margin-top: 4px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.2);
        ">
          📍 Drag to Your Shop
        </div>
      </div>
    `;

    const pinIcon = L.divIcon({
      className: 'custom-draggable-pin',
      html: pinIconHtml,
      iconSize: [36, 60],
      iconAnchor: [18, 55],
    });

    const marker = L.marker([startLat, startLng], {
      icon: pinIcon,
      draggable: true,
      autoPan: true,
    }).addTo(map);

    marker.on('dragend', () => {
      const position = marker.getLatLng();
      const newLat = Number(position.lat.toFixed(6));
      const newLng = Number(position.lng.toFixed(6));
      setLat(newLat);
      setLng(newLng);
      onLocationChange(newLat, newLng);
    });

    map.on('click', (e) => {
      const newLat = Number(e.latlng.lat.toFixed(6));
      const newLng = Number(e.latlng.lng.toFixed(6));
      marker.setLatLng([newLat, newLng]);
      setLat(newLat);
      setLng(newLng);
      onLocationChange(newLat, newLng);
    });

    markerRef.current = marker;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle Satellite vs Streets layer toggle
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
      attribution:
        mapStyle === 'satellite'
          ? 'Esri &copy; OpenStreetMap'
          : '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(mapRef.current);

    tileLayerRef.current = newTileLayer;
  }, [mapStyle]);

  // GPS Current Location button
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newLat = Number(pos.coords.latitude.toFixed(6));
        const newLng = Number(pos.coords.longitude.toFixed(6));
        setLat(newLat);
        setLng(newLng);

        if (mapRef.current && markerRef.current) {
          markerRef.current.setLatLng([newLat, newLng]);
          mapRef.current.flyTo([newLat, newLng], 17, { animate: true, duration: 1 });
        }
        onLocationChange(newLat, newLng);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        alert('Could not fetch GPS location. Please drag the pin on the map manually.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Top Banner / Helper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-[#EDF4FF] dark:bg-blue-950/40 rounded-2xl border border-[#4787F2]/20 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#4787F2] text-white flex items-center justify-center shrink-0 shadow-xs">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-[#17181C] dark:text-white leading-tight">
              Adjust Your Exact Shop Location
            </p>
            <p className="text-[11px] text-[#4A5260] dark:text-neutral-300">
              Drag the blue marker or tap anywhere on the map to pinpoint your store.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="self-start sm:self-center px-3 py-1.5 rounded-full bg-[#4787F2] hover:bg-[#3972D4] text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Detecting GPS...' : 'Use My GPS Location'}</span>
        </button>
      </div>

      {/* Map Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E3E8EF] dark:border-neutral-700 shadow-inner bg-neutral-100" style={{ height }}>
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Map Type Switcher Floating Controls */}
        <div className="absolute top-3 left-3 z-[400] flex items-center bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-neutral-200 dark:border-neutral-700 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setMapStyle('streets')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mapStyle === 'streets'
                ? 'bg-[#4787F2] text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('satellite')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mapStyle === 'satellite'
                ? 'bg-[#4787F2] text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Coordinates Pill at Bottom Right */}
        <div className="absolute bottom-3 right-3 z-[400] bg-neutral-900/85 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg shadow-md border border-white/10 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#35AB4E] animate-pulse"></span>
          <span>Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
};
