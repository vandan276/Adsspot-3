'use client';

import React from 'react';
import Link from 'next/link';
import { Logo, Button, Card } from '@adsspot/ui';
import { Download, Smartphone, Chrome, Apple } from 'lucide-react';

export default function DownloadPwaPage() {
  const handleInstallClick = () => {
    if (typeof window !== 'undefined') {
      alert(
        'To install the Adsspot PWA as an APK on Android:\n\n1. In Chrome / Samsung Internet, tap the top-right 3 dots (⋮)\n2. Tap "Install app" or "Add to Home screen"\n3. Adsspot will be added to your app drawer with a native app icon and fullscreen experience!'
      );
    }
  };

  return (
    <div className="flex-1 bg-[#F4F6FB] p-4 sm:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="max-w-xl w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size={56} withText={true} />
          </div>
          <h1 className="text-2xl font-black text-[#17181C] tracking-tight">
            Install Adsspot on Mobile
          </h1>
          <p className="text-xs text-[#687182]">
            Instant native Android APK / PWA experience with zero store download required
          </p>
        </div>

        {/* Main Install Card */}
        <Card padding="lg" className="shadow-xl bg-white border border-[#E3E8EF] space-y-6">
          <div className="flex items-center gap-3 p-4 bg-[#EDF4FF] rounded-2xl border border-[#4787F2]/20">
            <Smartphone className="w-8 h-8 text-[#4787F2] shrink-0" />
            <div>
              <h3 className="text-xs font-black text-[#1D53B8]">Progressive Web App (PWA) APK</h3>
              <p className="text-[11px] text-[#4787F2]">
                Full offline access, instant push alerts, and lightweight &lt; 2MB installation
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full font-black text-sm py-4 shadow-lg flex items-center justify-center gap-2"
            onClick={handleInstallClick}
          >
            <Download className="w-5 h-5" /> Install Adsspot App (1-Tap APK)
          </Button>

          {/* Step-by-step instructions */}
          <div className="space-y-4 pt-4 border-t border-[#E3E8EF]">
            <h4 className="text-xs font-black text-[#17181C] uppercase tracking-wider">
              Installation Steps by Device
            </h4>

            {/* Android Chrome */}
            <div className="p-3.5 rounded-2xl bg-[#F4F6FB] border border-[#E3E8EF] flex items-start gap-3">
              <Chrome className="w-5 h-5 text-[#35AB4E] shrink-0 mt-0.5" />
              <div className="text-xs text-[#4A5260] space-y-1">
                <span className="font-bold text-[#17181C] block">Android (Chrome / Samsung Internet)</span>
                <p className="text-[11px]">
                  1. Tap the <strong>three dots (⋮)</strong> in Chrome.<br />
                  2. Select <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.<br />
                  3. The native APK installs directly into your Android app drawer.
                </p>
              </div>
            </div>

            {/* iOS Safari */}
            <div className="p-3.5 rounded-2xl bg-[#F4F6FB] border border-[#E3E8EF] flex items-start gap-3">
              <Apple className="w-5 h-5 text-[#17181C] shrink-0 mt-0.5" />
              <div className="text-xs text-[#4A5260] space-y-1">
                <span className="font-bold text-[#17181C]">iPhone / iPad (Safari)</span>
                <p className="text-[11px]">
                  1. Tap the <strong>Share button (↑)</strong> at the bottom.<br />
                  2. Scroll down and tap <strong>"Add to Home Screen"</strong>.<br />
                  3. Tap <strong>"Add"</strong> to launch as a standalone app.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link href="/feed" className="text-xs font-bold text-[#4787F2] hover:underline inline-flex items-center gap-1">
              Continue in Browser &rarr;
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
