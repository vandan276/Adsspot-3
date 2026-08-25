'use client';

import React, { useEffect, useState } from 'react';

interface WebSplashScreenProps {
  onFinish?: () => void;
  autoDismiss?: boolean;
}

export const WebSplashScreen: React.FC<WebSplashScreenProps> = ({
  onFinish,
  autoDismiss = true,
}) => {
  const [phase, setPhase] = useState<'initial' | 'draw' | 'color' | 'text' | 'exit'>('initial');

  useEffect(() => {
    // Sequence of animations:
    // Step 1: Draw the SVG logo contours
    const t1 = setTimeout(() => setPhase('draw'), 80);
    // Step 2: Fill color nodes and activate signature Spot Ring rotation
    const t2 = setTimeout(() => setPhase('color'), 750);
    // Step 3: Reveal typography with glow
    const t3 = setTimeout(() => setPhase('text'), 1300);

    let exitTimer: NodeJS.Timeout;
    let finishTimer: NodeJS.Timeout;

    if (autoDismiss) {
      // Step 4: Smooth fade out exit
      exitTimer = setTimeout(() => setPhase('exit'), 2600);
      finishTimer = setTimeout(() => {
        if (onFinish) onFinish();
      }, 3100);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (exitTimer) clearTimeout(exitTimer);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, [autoDismiss, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#101114] text-white transition-all duration-700 select-none overflow-hidden ${
        phase === 'exit' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Animated Gradient Mesh Glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#4787F2]/20 via-[#35AB4E]/15 to-[#F2B604]/20 blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[#981837]/20 blur-[90px] pointer-events-none" />

      {/* Subtle grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#4787F2 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative flex flex-col items-center z-10 px-4">
        {/* Animated Brand SVG Logo Container */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Pulsing & rotating multi-color conic ring */}
          <div
            className={`absolute -inset-6 rounded-full transition-all duration-1000 ${
              phase === 'initial'
                ? 'opacity-0 scale-50'
                : 'opacity-40 scale-100 animate-spin-slow'
            }`}
            style={{
              background: 'conic-gradient(from 0deg, #4787F2, #35AB4E, #F2B604, #981837, #4787F2)',
              filter: 'blur(16px)',
            }}
          />

          {/* Elevated Logo Card with Glassmorphism */}
          <div
            className={`relative w-36 h-36 sm:w-40 sm:h-40 rounded-[32px] bg-[#17181C]/90 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center justify-center p-6 transform transition-all duration-700 ease-out ${
              phase === 'initial'
                ? 'scale-75 opacity-0 rotate-[-15deg]'
                : 'scale-100 opacity-100 rotate-0'
            }`}
          >
            {/* Animated SVG Logo */}
            <svg
              viewBox="0 0 110 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
            >
              {/* Deep Crimson Node (Bottom Left / Main) */}
              <g
                className={`transition-all duration-700 ease-out ${
                  phase === 'initial'
                    ? 'opacity-0 translate-y-4'
                    : 'opacity-100 translate-y-0'
                }`}
              >
                <path
                  d="M35.598 59.6398C35.598 59.6398 37.9681 59.3632 39.1944 59.3632C39.9654 59.3632 41.2381 59.3632 41.2381 59.3632C41.2381 59.3632 44.9509 59.651 47.2981 59.0308C51.6878 57.8708 53.157 55 53.157 55L55 55L55 56.6275C55 56.6275 52.525 57.8253 51.3484 62.4287C50.7062 64.9411 50.8074 69.5156 50.7079 72.2012C50.6251 74.4361 50.2936 75.0409 50.2936 75.0409L35.598 59.6398Z"
                  fill="#981837"
                  className={`transition-opacity duration-500 ${
                    phase === 'initial' || phase === 'draw' ? 'opacity-30' : 'opacity-100'
                  }`}
                />
                <circle
                  cx="37.69"
                  cy="72.51"
                  r="9.53"
                  stroke="#981837"
                  strokeWidth="7"
                  fill="none"
                  className={`transition-all duration-700 ${
                    phase === 'initial' ? 'stroke-dasharray-0' : 'stroke-dasharray-100'
                  }`}
                />
              </g>

              {/* Trust Green Node (Top Right) */}
              <g
                className={`transition-all duration-700 delay-100 ease-out ${
                  phase === 'initial'
                    ? 'opacity-0 -translate-y-4'
                    : 'opacity-100 translate-y-0'
                }`}
              >
                <path
                  d="M74.402 50.3602C74.402 50.3602 72.0319 50.6368 70.8056 50.6368C70.0346 50.6368 68.7619 50.6368 68.7619 50.6368C68.7619 50.6368 65.0491 50.349 62.7019 50.9692C58.3122 52.1292 56.843 55 56.843 55L55 55L55 53.3725C55 53.3725 57.475 52.1747 58.6516 47.5713C59.2938 45.0589 59.1926 40.4844 59.2921 37.7988C59.3749 35.5639 59.7064 34.9591 59.7064 34.9591L74.402 50.3602Z"
                  fill="#35AB4E"
                  className={`transition-opacity duration-500 ${
                    phase === 'initial' || phase === 'draw' ? 'opacity-30' : 'opacity-100'
                  }`}
                />
                <circle
                  cx="72.31"
                  cy="37.49"
                  r="9.53"
                  stroke="#35AB4E"
                  strokeWidth="7"
                  fill="none"
                />
              </g>

              {/* Spot Blue Node (Bottom Right) */}
              <g
                className={`transition-all duration-700 delay-200 ease-out ${
                  phase === 'initial'
                    ? 'opacity-0 translate-x-4'
                    : 'opacity-100 translate-x-0'
                }`}
              >
                <path
                  d="M74.402 59.6398C74.402 59.6398 72.0319 59.3632 70.8056 59.3632C70.0346 59.3632 68.7619 59.3632 68.7619 59.3632C68.7619 59.3632 65.0491 59.651 62.7019 59.0308C58.3122 57.8708 56.843 55 56.843 55L55 55L55 56.6275C55 56.6275 57.475 57.8253 58.6516 62.4287C59.2938 64.9411 59.1926 69.5156 59.2921 72.2012C59.3749 74.4361 59.7064 75.0409 59.7064 75.0409L74.402 59.6398Z"
                  fill="#4787F2"
                  className={`transition-opacity duration-500 ${
                    phase === 'initial' || phase === 'draw' ? 'opacity-30' : 'opacity-100'
                  }`}
                />
                <circle
                  cx="72.31"
                  cy="72.51"
                  r="9.53"
                  stroke="#4787F2"
                  strokeWidth="7"
                  fill="none"
                />
              </g>

              {/* Festival Yellow Node (Top Left) */}
              <g
                className={`transition-all duration-700 delay-300 ease-out ${
                  phase === 'initial'
                    ? 'opacity-0 -translate-x-4'
                    : 'opacity-100 translate-x-0'
                }`}
              >
                <path
                  d="M35.598 50.3602C35.598 50.3602 37.9681 50.6368 39.1944 50.6368C39.9654 50.6368 41.2381 50.6368 41.2381 50.6368C41.2381 50.6368 44.9509 50.349 47.2981 50.9692C51.6878 52.1292 53.157 55 53.157 55L55 55L55 53.3725C55 53.3725 57.475 52.1747 58.6516 47.5713C50.7062 45.0589 50.8074 40.4844 50.7079 37.7988C50.6251 35.5639 50.2936 34.9591 50.2936 34.9591L35.598 50.3602Z"
                  fill="#F2B604"
                  className={`transition-opacity duration-500 ${
                    phase === 'initial' || phase === 'draw' ? 'opacity-30' : 'opacity-100'
                  }`}
                />
                <circle
                  cx="37.69"
                  cy="37.49"
                  r="9.53"
                  stroke="#F2B604"
                  strokeWidth="7"
                  fill="none"
                />
              </g>

              {/* 4 Cardinal Center Spots */}
              <circle cx="55" cy="27.96" r="5.84" fill="#981837" className="animate-pulse" />
              <circle cx="81.84" cy="55" r="5.84" fill="#F2B604" className="animate-pulse" />
              <circle cx="55" cy="82.04" r="5.84" fill="#35AB4E" className="animate-pulse" />
              <circle cx="28.16" cy="55" r="5.84" fill="#4787F2" className="animate-pulse" />
            </svg>
          </div>
        </div>

        {/* Brand Text Reveal */}
        <div
          className={`flex flex-col items-center text-center transition-all duration-700 ${
            phase === 'initial' || phase === 'draw'
              ? 'opacity-0 translate-y-6 scale-95'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          <div className="flex items-center tracking-wider uppercase font-black text-4xl sm:text-5xl font-['Plus_Jakarta_Sans',sans-serif]">
            <span className="text-[#4787F2] drop-shadow-[0_2px_10px_rgba(71,135,242,0.5)]">ADS</span>
            <span className="text-[#981837] drop-shadow-[0_2px_10px_rgba(152,24,55,0.5)]">SPOT</span>
          </div>

          <p className="text-xs sm:text-sm font-semibold tracking-widest text-neutral-400 uppercase mt-2">
            Hyperlocal Discovery &amp; Marketing
          </p>

          {/* Loading line indicator */}
          <div className="w-44 h-1 bg-neutral-800 rounded-full mt-6 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#4787F2] via-[#35AB4E] to-[#F2B604] rounded-full animate-[progress_1.8s_ease-in-out_infinite]"
              style={{ width: '60%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
