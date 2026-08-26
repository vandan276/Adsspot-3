'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { AdsspotLogoMark } from '@adsspot/ui';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface ApkDownloadPromptModalProps {
  forceOpen?: boolean;
  title?: string;
  subtitle?: string;
  preventDismiss?: boolean;
  onDismiss?: () => void;
}

export function ApkDownloadPromptModal({
  forceOpen = false,
  title = 'Adsspot App',
  subtitle = 'Hyperlocal Discovery & Offers',
  preventDismiss = false,
  onDismiss,
}: ApkDownloadPromptModalProps = {}) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // 1. Check if user is ALREADY running inside the standalone PWA / APK installed app
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error navigator.standalone is iOS Safari specific
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      // Never show install prompt when already in the installed App / APK variant!
      setIsOpen(false);
      return;
    }

    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    // 2. Check if already dismissed in this browser session
    const dismissed = sessionStorage.getItem('adsspot_apk_prompt_dismissed');
    if (dismissed) return;

    // 3. Catch native browser PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Timer fallback to show popup after 2.5 seconds on web browser
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('adsspot_apk_prompt_dismissed')) {
        setIsOpen(true);
      }
    }, 2500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [forceOpen]);

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
    if (onDismiss) onDismiss();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      {/* Modal Card with elevated Spot styling */}
      <div className="bg-white w-full max-w-sm rounded-[28px] p-6 border border-neutral-200/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] space-y-4 animate-scale-in relative overflow-hidden">
        {/* Spot Gradient Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4787F2] via-[#35AB4E] to-[#F2B604]" />

        {/* Close Button (Hidden if preventDismiss is true) */}
        {!preventDismiss && (
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-all active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

        {/* Header with App Logo Mark (No ADSSPOT text) & Title */}
        <div className="flex items-center gap-3.5 pr-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EDF4FF] to-white border border-[#4787F2]/20 shadow-xs flex items-center justify-center p-2 shrink-0">
            <AdsspotLogoMark size={38} animated={true} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base font-black text-[#17181C] tracking-tight">{title}</h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#EBF9EE] text-[#1B6A2D] border border-[#35AB4E]/30">
                Official APK
              </span>
            </div>
            <p className="text-xs text-[#687182] font-medium mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Value Proposition Pills */}
        <div className="p-3.5 bg-[#F4F6FB] rounded-2xl border border-[#E3E8EF] space-y-2 text-xs text-[#17181C]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#F2B604]" />
            </div>
            <span className="font-semibold">Interactive 3D GPS navigation &amp; real-time shop pins</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Smartphone className="w-3.5 h-3.5 text-[#4787F2]" />
            </div>
            <span className="font-semibold">Ultra-light &lt; 2 MB • 2x Faster map rendering</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleInstallClick}
            className="w-full py-3.5 bg-[#4787F2] hover:bg-[#3972D4] text-white rounded-full text-xs font-extrabold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download App to Access Map</span>
          </button>

          {!preventDismiss ? (
            <button
              onClick={handleDismiss}
              className="w-full py-2.5 text-xs font-bold text-[#687182] hover:text-[#17181C] transition-colors text-center"
            >
              Continue in Web Browser
            </button>
          ) : (
            <p className="text-[10px] text-center text-[#687182] font-semibold pt-1">
              🔒 Live GPS Map is exclusive to the Adsspot Mobile App
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
