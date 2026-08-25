'use client';

import React, { useEffect, useState } from 'react';
import { AdsspotLogoMark } from '@adsspot/ui';



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
    // Phase 1: Enter -> Active
    const enterTimer = setTimeout(() => {
      setPhase('active');
    }, 50);

    // Phase 2: Active -> Exit
    let exitTimer: NodeJS.Timeout;
    let finishTimer: NodeJS.Timeout;

    if (autoDismiss) {
      exitTimer = setTimeout(() => {
        setPhase('exit');
      }, 2200);

      finishTimer = setTimeout(() => {
        if (onFinish) onFinish();
      }, 2600);
    }

    return () => {
      clearTimeout(enterTimer);
      if (exitTimer) clearTimeout(exitTimer);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, [autoDismiss, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#17181C] text-white transition-opacity duration-500 select-none ${
        phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-[#4787F2]/15 blur-3xl animate-pulse pointer-events-none" />

      {/* Main Logo Card with smooth entrance */}
      <div className="relative flex flex-col items-center z-10">
        {/* Spot Ring pulsating backdrop */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#4787F2] via-[#35AB4E] to-[#F2B604] opacity-30 blur-md animate-spin-slow" />
          
          <div
            className={`relative w-28 h-28 rounded-3xl bg-[#26272B] border-2 border-neutral-700 shadow-2xl flex items-center justify-center transform transition-all duration-700 ${
              phase === 'enter' ? 'scale-50 opacity-0 rotate-[-20deg]' : 'scale-100 opacity-100 rotate-0'
            }`}
          >
            <AdsspotLogoMark size={72} />
          </div>
        </div>

        {/* Brand Text & Live Tag */}
        <div
          className={`flex flex-col items-center transition-all duration-700 delay-200 ${
            phase === 'enter' ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase">
            <span className="text-[#4787F2]">ADS</span>
            <span className="text-[#981837]">SPOT</span>
          </h1>

          <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1 rounded-full bg-neutral-800/90 border border-neutral-700">

            <span className="w-2 h-2 rounded-full bg-[#35AB4E] animate-ping" />
            <span className="text-[11px] font-bold text-[#F2B604] tracking-wider uppercase">
              India Hyperlocal Discovery
            </span>
          </div>


          <p className="text-xs text-neutral-400 font-medium mt-3 text-center max-w-xs">
            Connecting local shoppers, merchants &amp; field ops in real time
          </p>
        </div>

        {/* Action Skip Button */}
        <button
          onClick={() => onFinish && onFinish()}
          className="mt-8 px-5 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-[#4787F2] border border-[#4787F2]/40 shadow-lg hover:border-[#4787F2] transition-all transform hover:scale-105"
        >
          Enter Platform →
        </button>
      </div>
    </div>
  );
};
