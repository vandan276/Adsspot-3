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
          {/* Authentic Pure Vector Brand Wordmark (from Logo name .svg) */}
          <div className="flex items-center justify-center">
            <svg
              width="240"
              height="72"
              viewBox="0 0 2810 1000"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible"
            >
              <g transform="translate(0, 800) scale(1, -1)">
                {/* ADS in Spot Blue */}
                <g fill="#4787F2">
                  <g transform="translate(0, 0)">
                    <path d="M254 249 204 507H202L152 249ZM2 0 161 712H246L405 0H303L273 153H134L104 0Z" />
                  </g>
                  <g transform="translate(407, 0)">
                    <path d="M48 0V712H199Q287 712 332.5 664.0Q378 616 378 528V195Q378 95 329.5 47.5Q281 0 190 0ZM150 616V96H197Q240 96 258.0 117.5Q276 139 276 185V528Q276 570 259.0 593.0Q242 616 197 616Z" />
                  </g>
                  <g transform="translate(833, 0)">
                    <path d="M378 507H276V530Q276 565 259.5 590.5Q243 616 204 616Q183 616 170.0 608.0Q157 600 149 588Q141 575 138.0 558.5Q135 542 135 524Q135 503 136.5 489.0Q138 475 144 464Q150 453 161.5 445.0Q173 437 193 429L271 398Q305 385 326.0 367.5Q347 350 359 327Q370 303 374.0 272.5Q378 242 378 203Q378 158 369.0 119.5Q360 81 340 54Q319 26 285.0 10.0Q251 -6 202 -6Q165 -6 133.0 7.0Q101 20 78 43Q55 66 41.5 96.5Q28 127 28 163V201H130V169Q130 141 146.5 118.5Q163 96 202 96Q228 96 242.5 103.5Q257 111 265 125Q273 139 274.5 158.5Q276 178 276 202Q276 230 274.0 248.0Q272 266 266 277Q259 288 247.5 295.0Q236 302 217 310L144 340Q78 367 55.5 411.5Q33 456 33 523Q33 563 44.0 599.0Q55 635 77 661Q98 687 130.5 702.5Q163 718 208 718Q246 718 277.5 704.0Q309 690 332 667Q378 619 378 557Z" />
                  </g>
                </g>

                {/* SPOT in Deep Crimson */}
                <g fill="#981837">
                  <g transform="translate(1239, 0)">
                    <path d="M378 507H276V530Q276 565 259.5 590.5Q243 616 204 616Q183 616 170.0 608.0Q157 600 149 588Q141 575 138.0 558.5Q135 542 135 524Q135 503 136.5 489.0Q138 475 144 464Q150 453 161.5 445.0Q173 437 193 429L271 398Q305 385 326.0 367.5Q347 350 359 327Q370 303 374.0 272.5Q378 242 378 203Q378 158 369.0 119.5Q360 81 340 54Q319 26 285.0 10.0Q251 -6 202 -6Q165 -6 133.0 7.0Q101 20 78 43Q55 66 41.5 96.5Q28 127 28 163V201H130V169Q130 141 146.5 118.5Q163 96 202 96Q228 96 242.5 103.5Q257 111 265 125Q273 139 274.5 158.5Q276 178 276 202Q276 230 274.0 248.0Q272 266 266 277Q259 288 247.5 295.0Q236 302 217 310L144 340Q78 367 55.5 411.5Q33 456 33 523Q33 563 44.0 599.0Q55 635 77 661Q98 687 130.5 702.5Q163 718 208 718Q246 718 277.5 704.0Q309 690 332 667Q378 619 378 557Z" />
                  </g>
                  <g transform="translate(1645, 0)">
                    <path d="M48 0V712H201Q243 712 275.0 701.0Q307 690 333 662Q359 634 369.0 596.5Q379 559 379 495Q379 447 373.5 414.0Q368 381 350 352Q329 317 294.0 297.5Q259 278 202 278H150V0ZM150 616V374H199Q230 374 247.0 383.0Q264 392 272 408Q280 423 281.5 445.0Q283 467 283 494Q283 519 282.0 541.5Q281 564 273 581Q265 598 249.0 607.0Q233 616 203 616Z" />
                  </g>
                  <g transform="translate(2052, 0)">
                    <path d="M42 544Q42 587 57.0 620.0Q72 653 97 675Q121 696 151.5 707.0Q182 718 213 718Q244 718 274.5 707.0Q305 696 330 675Q354 653 369.0 620.0Q384 587 384 544V168Q384 123 369.0 91.0Q354 59 330 38Q305 16 274.5 5.0Q244 -6 213 -6Q182 -6 151.5 5.0Q121 16 97 38Q72 59 57.0 91.0Q42 123 42 168ZM144 168Q144 131 164.5 113.5Q185 96 213 96Q241 96 261.5 113.5Q282 131 282 168V544Q282 581 261.5 598.5Q241 616 213 616Q185 616 164.5 598.5Q144 581 144 544Z" />
                  </g>
                  <g transform="translate(2478, 0)">
                    <path d="M115 0V616H-3V712H335V616H217V0Z" />
                  </g>
                </g>
              </g>
            </svg>
          </div>

          <p className="text-[12px] sm:text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase mt-4">
            HYPERLOCAL DISCOVERY &amp; MARKETING
          </p>

          {/* 🌟 Authentic 4-Segment Signature Brand Line (from logo line.svg) */}
          <div className="mt-5 flex items-center justify-center">
            <svg
              width="240"
              height="8"
              viewBox="20 90 250 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible"
            >
              {/* Crimson Segment */}
              <path d="M263.562 95.0929L224.067 95.0929L209.713 95.0929" stroke="#981837" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              {/* Blue Segment */}
              <path d="M209.713 95.0929L166.249 95.0929L150.453 95.0929" stroke="#4787F2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              {/* Green Segment */}
              <path d="M150.453 95.0929L107.036 95.0929L91.2566 95.0929" stroke="#35AB4E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              {/* Yellow Segment */}
              <path d="M91.2566 95.0929L47.8252 95.0929L32.0407 95.0929" stroke="#F2B604" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
