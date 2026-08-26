import React from 'react';
import { AnimatedLogoMark } from './AnimatedLogoMark';

export interface LogoProps {
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  className?: string;
  dark?: boolean;
  animated?: boolean;
}

// 1. Signature 4-Node Brand Logo Mark (Animated by default with exact vector geometry & physics)
export const AdsspotLogoMark: React.FC<{ size?: number; className?: string; animated?: boolean }> = ({
  size = 44,
  className = '',
  animated = true,
}) => {
  if (animated) {
    return <AnimatedLogoMark size={size} className={className} loop={true} />;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <g id="Layer-1">
        <g opacity="1">
          <path
            d="M35.598 59.6398C35.598 59.6398 37.9681 59.3632 39.1944 59.3632C39.9654 59.3632 41.2381 59.3632 41.2381 59.3632C41.2381 59.3632 44.9509 59.651 47.2981 59.0308C51.6878 57.8708 53.157 55 53.157 55L55 55L55 56.6275C55 56.6275 52.525 57.8253 51.3484 62.4287C50.7062 64.9411 50.8074 69.5156 50.7079 72.2012C50.6251 74.4361 50.2936 75.0409 50.2936 75.0409L35.598 59.6398Z"
            fill="#981837"
          />
          <path
            d="M28.1604 72.5079C28.1604 67.2434 32.4282 62.9756 37.6927 62.9756C42.9573 62.9756 47.225 67.2434 47.225 72.5079C47.225 77.7725 42.9573 82.0402 37.6927 82.0402C32.4282 82.0402 28.1604 77.7725 28.1604 72.5079Z"
            fill="none"
            stroke="#981837"
            strokeWidth="7"
            strokeLinecap="butt"
            strokeLinejoin="round"
          />
        </g>
        <g opacity="1">
          <path
            d="M74.402 50.3602C74.402 50.3602 72.0319 50.6368 70.8056 50.6368C70.0346 50.6368 68.7619 50.6368 68.7619 50.6368C68.7619 50.6368 65.0491 50.349 62.7019 50.9692C58.3122 52.1292 56.843 55 56.843 55L55 55L55 53.3725C55 53.3725 57.475 52.1747 58.6516 47.5713C59.2938 45.0589 59.1926 40.4844 59.2921 37.7988C59.3749 35.5639 59.7064 34.9591 59.7064 34.9591L74.402 50.3602Z"
            fill="#35ab4e"
          />
          <path
            d="M81.8396 37.4921C81.8396 42.7566 77.5718 47.0244 72.3073 47.0244C67.0427 47.0244 62.775 42.7566 62.775 37.4921C62.775 32.2275 67.0427 27.9598 72.3073 27.9598C77.5718 27.9598 81.8396 32.2275 81.8396 37.4921Z"
            fill="none"
            stroke="#35ab4e"
            strokeWidth="7"
            strokeLinecap="butt"
            strokeLinejoin="round"
          />
        </g>
        <g opacity="1">
          <path
            d="M74.402 59.6398C74.402 59.6398 72.0319 59.3632 70.8056 59.3632C70.0346 59.3632 68.7619 59.3632 68.7619 59.3632C68.7619 59.3632 65.0491 59.651 62.7019 59.0308C58.3122 57.8708 56.843 55 56.843 55L55 55L55 56.6275C55 56.6275 57.475 57.8253 58.6516 62.4287C59.2938 64.9411 59.1926 69.5156 59.2921 72.2012C59.3749 74.4361 59.7064 75.0409 59.7064 75.0409L74.402 59.6398Z"
            fill="#4787f2"
          />
          <path
            d="M81.8396 72.5079C81.8396 67.2434 77.5718 62.9756 72.3073 62.9756C67.0427 62.9756 62.775 67.2434 62.775 72.5079C62.775 77.7725 67.0427 82.0402 72.3073 82.0402C77.5718 82.0402 81.8396 77.7725 81.8396 72.5079Z"
            fill="none"
            stroke="#4787f2"
            strokeWidth="7"
            strokeLinecap="butt"
            strokeLinejoin="round"
          />
        </g>
        <g opacity="1">
          <path
            d="M35.598 50.3602C35.598 50.3602 37.9681 50.6368 39.1944 50.6368C39.9654 50.6368 41.2381 50.6368 41.2381 50.6368C41.2381 50.6368 44.9509 50.349 47.2981 50.9692C51.6878 52.1292 53.157 55 53.157 55L55 55L55 53.3725C55 53.3725 57.475 52.1747 58.6516 47.5713C50.7062 45.0589 50.8074 40.4844 50.7079 37.7988C50.6251 35.5639 50.2936 34.9591 50.2936 34.9591L35.598 50.3602Z"
            fill="#f2b604"
          />
          <path
            d="M28.1604 37.4921C28.1604 42.7566 32.4282 47.0244 37.6927 47.0244C42.9573 47.0244 47.225 42.7566 47.225 37.4921C47.225 32.2275 42.9573 27.9598 37.6927 27.9598C32.4282 27.9598 28.1604 32.2275 28.1604 37.4921Z"
            fill="none"
            stroke="#f2b604"
            strokeWidth="7"
            strokeLinecap="butt"
            strokeLinejoin="round"
          />
        </g>
        <path
          d="M49.1608 27.9598C49.1608 24.7349 51.7751 22.1206 55 22.1206C58.2249 22.1206 60.8392 24.7349 60.8392 27.9598C60.8392 31.1847 58.2249 33.799 55 33.799C51.7751 33.799 49.1608 31.1847 49.1608 27.9598Z"
          fill="#981837"
        />
        <path
          d="M76.0004 55C76.0004 51.7751 78.6147 49.1608 81.8396 49.1608C85.0645 49.1608 87.6787 51.7751 87.6787 55C87.6787 58.2249 85.0645 60.8392 81.8396 60.8392C78.6147 60.8392 76.0004 58.2249 76.0004 55Z"
          fill="#f2b604"
        />
        <path
          d="M49.1608 82.0402C49.1608 78.8153 51.7751 76.201 55 76.201C58.2249 76.201 60.8392 78.8153 60.8392 82.0402C60.8392 85.2651 58.2249 87.8794 55 87.8794C51.7751 87.8794 49.1608 85.2651 49.1608 82.0402Z"
          fill="#35ab4e"
        />
        <path
          d="M22.3213 55C22.3213 51.7751 24.9355 49.1608 28.1604 49.1608C31.3853 49.1608 33.9996 51.7751 33.9996 55C33.9996 58.2249 31.3853 60.8392 28.1604 60.8392C24.9355 60.8392 22.3213 58.2249 22.3213 55Z"
          fill="#4787f2"
        />
      </g>
    </svg>
  );
};

// 2. Complete Brand Logo Component (Animated Icon + Seamless ADSSPOT Typography)
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  withText = true,
  className = '',
  animated = true,
}) => {
  const pixelHeight =
    typeof size === 'number'
      ? size
      : size === 'sm'
        ? 38
        : size === 'md'
          ? 48
          : size === 'lg'
            ? 62
            : 78;

  if (!withText) {
    return <AdsspotLogoMark size={pixelHeight} className={className} animated={animated} />;
  }

  // Proportion: Logo mark height and text sizing
  const iconSize = Math.round(pixelHeight * 0.95);
  const fontSize = Math.round(pixelHeight * 0.72);

  return (
    <div className={`inline-flex items-center gap-2 shrink-0 select-none ${className}`}>
      {/* 1. Dynamic Animated Brand Logo Mark */}
      <div className="shrink-0 flex items-center justify-center">
        {animated ? (
          <AnimatedLogoMark size={iconSize} loop={true} />
        ) : (
          <AdsspotLogoMark size={iconSize} animated={false} />
        )}
      </div>

      {/* 2. Authentic Brand Typography (100% Android & iOS Pixel-Perfect Layout) */}
      <div
        className="font-black uppercase flex items-center leading-none tracking-[-0.03em]"
        style={{
          fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
          fontSize: `${fontSize}px`,
        }}
      >
        <span style={{ color: '#4787F2' }}>ADS</span>
        <span style={{ color: '#981837' }}>SPOT</span>
      </div>
    </div>
  );
};

