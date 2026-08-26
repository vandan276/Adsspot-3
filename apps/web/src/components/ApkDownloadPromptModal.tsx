'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { Logo } from '@adsspot/ui';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function ApkDownloadPromptModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // 1. Check if already dismissed in this session
    const dismissed = sessionStorage.getItem('adsspot_apk_prompt_dismissed');
    if (dismissed) return;

    // 2. Catch native browser PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Timer fallback to show popup after 2.5 seconds on any browser
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('adsspot_apk_prompt_dismissed')) {
        setIsOpen(true);
      }
    }, 2500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsOpen(false);
      }
      setDeferredPrompt(null);
    } else {
      // Direct direct download / APK install guide
      window.location.href = '/download';
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('adsspot_apk_prompt_dismissed', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 border border-[#E3E8EF] shadow-2xl space-y-4 animate-slide-up relative overflow-hidden">
        {/* Top Glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4787F2] via-[#F2B604] to-[#981837]" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* App Logo & Title */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-12 h-12 rounded-2xl p-1 bg-white border border-[#E3E8EF] shadow-xs flex items-center justify-center">
            <Logo size={36} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black text-[#17181C]">Adsspot App</h3>
              <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded-full bg-[#EBF9EE] text-[#35AB4E] border border-[#35AB4E]/30">
                Official APK
              </span>
            </div>
            <p className="text-[11px] text-[#687182]">Instant Android APK &amp; Mobile App</p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="p-3 bg-[#F4F6FB] rounded-2xl border border-[#E3E8EF] space-y-1.5 text-[11px] text-neutral-700">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B604] shrink-0" />
            <span>Instant push alerts for local spot drops &amp; offers</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-[#4787F2] shrink-0" />
            <span>Fast &lt; 2MB size • Works smoothly in 2G/3G/4G</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleInstallClick}
            className="w-full py-3 bg-[#4787F2] hover:bg-[#3972D4] text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download / Install APK</span>
          </button>

          <button
            onClick={handleDismiss}
            className="w-full py-2 text-xs font-bold text-neutral-400 hover:text-neutral-700 transition-colors text-center"
          >
            Continue in Browser
          </button>
        </div>
      </div>
    </div>
  );
}
