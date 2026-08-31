'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Crosshair } from 'lucide-react';

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  lat,
  lng,
  onLocationChange,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat, lng });

  // Sync internal state when parent props change
  useEffect(() => {
    setCoords({ lat, lng });
    if (markerRef.current && mapRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapRef.current.panTo([lat, lng]);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    // Custom Spot Pin Icon
    const spotPinIcon = L.divIcon({
      className: 'custom-picker-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: grab;">
          <div style="background: linear-gradient(135deg, #4787F2, #35AB4E); width: 36px; height: 36px; border-radius: 12px 12px 12px 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(71, 135, 242, 0.4); border: 2.5px solid white;">
            <div style="transform: rotate(45deg); color: white; font-weight: 900; font-size: 14px;">📍</div>
          </div>
          <div style="background: rgba(23, 24, 28, 0.85); color: white; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; margin-top: 4px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
            Store Location
          </div>
        </div>
      `,
      iconSize: [36, 50],
      iconAnchor: [18, 50],
    });

    const map = L.map(mapContainerRef.current, {
      center: [lat || 18.9322, lng || 72.8347],
      zoom: 15,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    // Draggable Marker
    const marker = L.marker([lat || 18.9322, lng || 72.8347], {
      draggable: true,
      icon: spotPinIcon,
    }).addTo(map);

    marker.on('dragend', (e: any) => {
      const position = e.target.getLatLng();
      const updatedLat = Number(position.lat.toFixed(6));
      const updatedLng = Number(position.lng.toFixed(6));
      setCoords({ lat: updatedLat, lng: updatedLng });
      onLocationChange(updatedLat, updatedLng);
    });

    // Map Click moves the marker
    map.on('click', (e: L.LeafletMouseEvent) => {
      const clickedLat = Number(e.latlng.lat.toFixed(6));
      const clickedLng = Number(e.latlng.lng.toFixed(6));
      marker.setLatLng(e.latlng);
      setCoords({ lat: clickedLat, lng: clickedLng });
      onLocationChange(clickedLat, clickedLng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // One-click GPS Detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = Number(pos.coords.latitude.toFixed(6));
        const userLng = Number(pos.coords.longitude.toFixed(6));
        setCoords({ lat: userLat, lng: userLng });

        if (mapRef.current && markerRef.current) {
          mapRef.current.flyTo([userLat, userLng], 16, { duration: 1.2 });
          markerRef.current.setLatLng([userLat, userLng]);
        }

        onLocationChange(userLat, userLng);
        setIsLocating(false);
      },
      (err) => {
        console.warn('[GPS Detection Error]', err);
        alert('Could not retrieve precise location. Please click or drag the pin on the map.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[#17181C] font-extrabold">
          <MapPin className="w-3.5 h-3.5 text-[#4787F2]" />
          <span>Precise Store Pinpoint (Drag pin or click map)</span>
        </div>
        <button
          type="button"
          onClick={handleDetectGPS}
          disabled={isLocating}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4787F2] hover:text-[#3972D4] bg-[#EDF4FF] hover:bg-[#D9E7FF] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
        >
          <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
          {isLocating ? 'Detecting GPS...' : '📍 Use My Exact GPS'}
        </button>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#E3E8EF] shadow-inner bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-0" />
        
        {/* Floating Coordinates Badge */}
        <div className="absolute bottom-2 left-2 z-10 bg-[#17181C]/90 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
          <Crosshair className="w-3 h-3 text-[#35AB4E]" />
          <span>Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
};
