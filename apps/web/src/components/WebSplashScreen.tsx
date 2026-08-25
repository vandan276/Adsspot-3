'use client';

import React, { useEffect, useState } from 'react';
import { AnimatedLogoMark } from '@adsspot/ui';

interface WebSplashScreenProps {
  onFinish?: () => void;
  autoDismiss?: boolean;
}

export const WebSplashScreen: React.FC<WebSplashScreenProps> = ({
  onFinish,
  autoDismiss = true,
}) => {
  const [phase, setPhase] = useState<'enter' | 'active' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('active'), 50);

    let exitTimer: NodeJS.Timeout;
    let finishTimer: NodeJS.Timeout;

    if (autoDismiss) {
      exitTimer = setTimeout(() => setPhase('exit'), 2800);
      finishTimer = setTimeout(() => {
        if (onFinish) onFinish();
      }, 3300);
    }

    return () => {
      clearTimeout(t1);
      if (exitTimer) clearTimeout(exitTimer);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, [autoDismiss, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#141518] text-white transition-all duration-600 select-none overflow-hidden ${
        phase === 'exit' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Radial Glow matching the Animated Logo Standalone background */}
      <div 
        className="absolute w-[560px] h-[560px] rounded-full pointer-events-none transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(71, 135, 242, 0.22) 0%, rgba(53, 171, 78, 0.12) 40%, transparent 65%)',
          filter: 'blur(20px)',
          opacity: phase === 'active' ? 1 : 0,
        }}
      />

      <div className="relative flex flex-col items-center z-10 px-4">
        {/* Animated Brand Logo Mark from Animated Logo Standalone.html */}
        <div className="relative flex items-center justify-center mb-6">
          <AnimatedLogoMark size={160} loop={true} />
        </div>

        {/* Brand Typography */}
        <div
          className={`flex flex-col items-center text-center transition-all duration-700 delay-300 ${
            phase === 'enter'
              ? 'opacity-0 translate-y-4'
              : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Brand Wordmark */}
          <div className="flex items-center tracking-normal uppercase font-black text-5xl sm:text-6xl font-['Plus_Jakarta_Sans',sans-serif]">
            <span className="text-[#4787F2]">ADS</span>
            <span className="text-[#981837]">SPOT</span>
          </div>

          <p className="text-[12px] sm:text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase mt-4">
            HYPERLOCAL DISCOVERY &amp; MARKETING
          </p>

          {/* Minimal animated loader bar */}
          <div className="w-40 h-1 bg-neutral-800/80 rounded-full mt-6 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#4787F2] via-[#35AB4E] to-[#F2B604] rounded-full animate-[progress_1.6s_ease-in-out_infinite]"
              style={{ width: '60%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
