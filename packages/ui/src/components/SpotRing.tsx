import React from 'react';

export interface SpotRingProps {
  children?: React.ReactNode;
  active?: boolean;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  thickness?: number;
  className?: string;
  imageSrc?: string;
  alt?: string;
  animate?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export const StorySpotRing: React.FC<SpotRingProps> = ({
  children,
  size = 'md',
  className = '',
  imageSrc,
  onClick,
}) => {
  const clipId = React.useId().replace(/:/g, '_');

  const pixelSize =
    typeof size === 'number'
      ? size
      : size === 'xs'
        ? 34
        : size === 'sm'
          ? 42
          : size === 'md'
            ? 58
            : size === 'lg'
              ? 74
              : 98;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
    >
      <svg
        viewBox="0 0 80 80"
        width={pixelSize}
        height={pixelSize}
        className="w-full h-full overflow-visible pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <rect id={`spotRing_${clipId}`} x="2.5" y="2.5" width="75" height="75" rx="18" pathLength="100" fill="none" />
          <clipPath id={`storyPhotoClip_${clipId}`}>
            <rect x="9" y="9" width="62" height="62" rx="14" />
          </clipPath>
        </defs>

        {/* 4-Color Quarter Squircle Segments (Spot Blue, Trust Green, Festival Yellow, Deep Crimson) */}
        <use href={`#spotRing_${clipId}`} stroke="#4787F2" strokeWidth="5" strokeDasharray="26 74" strokeDashoffset="0" />
        <use href={`#spotRing_${clipId}`} stroke="#35AB4E" strokeWidth="5" strokeDasharray="26 74" strokeDashoffset="-25" />
        <use href={`#spotRing_${clipId}`} stroke="#F2B604" strokeWidth="5" strokeDasharray="26 74" strokeDashoffset="-50" />
        <use href={`#spotRing_${clipId}`} stroke="#981837" strokeWidth="5" strokeDasharray="26 74" strokeDashoffset="-75" />

        {/* Photo Slot */}
        {imageSrc ? (
          <image
            href={imageSrc}
            x="9"
            y="9"
            width="62"
            height="62"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#storyPhotoClip_${clipId})`}
          />
        ) : null}
      </svg>

      {/* Render children inside clip area if no imageSrc */}
      {!imageSrc && children && (
        <div
          className="absolute inset-[11%] rounded-[14px] overflow-hidden flex items-center justify-center pointer-events-none"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const SpotRing = StorySpotRing;
