'use client';

import React, { useEffect, useState } from 'react';
import { AdsspotLogoMark } from '@adsspot/ui';
import { Download, X } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      window.addEventListener('appinstalled', () => {
        setIsInstalled(true);
        setDeferredPrompt(null);
      });

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
    return undefined;
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'To install Adsspot on your phone:\n\n1. Tap the browser Menu (⋮) or Share (↑)\n2. Select "Add to Home Screen" or "Install App"\n\nIt will install as a native Android APK app!'
      );
    }
  };

  if (isDismissed || isInstalled) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 max-w-sm mx-auto bg-[#17181C]/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-neutral-700 flex items-center justify-between gap-3 animate-slide-up md:hidden">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shrink-0 shadow">
          <AdsspotLogoMark size={24} />
        </div>
        <div className="overflow-hidden">
          <h4 className="text-xs font-black text-white leading-tight">Install Adsspot App</h4>
          <p className="text-[10px] text-neutral-400">Fast native PWA • No Play Store needed</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 rounded-full bg-[#4787F2] hover:bg-[#3972D4] text-white font-extrabold text-xs shadow flex items-center gap-1 transition-transform active:scale-95"
        >
          <Download className="w-3.5 h-3.5" /> Install
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1.5 text-neutral-400 hover:text-white rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
