import React from 'react';
import { colors, radii } from '../tokens';
import { SpotRing } from './SpotRing';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  hasStoryRing?: boolean;
  isElite?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeMap = {
  xs: { box: 28, text: 'text-xs', ringSize: 'sm' as const },
  sm: { box: 36, text: 'text-sm', ringSize: 'sm' as const },
  md: { box: 48, text: 'text-base', ringSize: 'md' as const },
  lg: { box: 64, text: 'text-xl', ringSize: 'lg' as const },
  xl: { box: 88, text: 'text-2xl', ringSize: 'xl' as const },
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name = '',
  size = 'md',
  hasStoryRing = false,
  isElite = false,
  className = '',
  onClick,
}) => {
  const currentSize = sizeMap[size];
  const str = String(name || alt || '?').trim();
  const initials = (str.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join('') || '?').toUpperCase();

  const baseContent = (
    <div
      onClick={onClick}
      className={`relative overflow-hidden flex items-center justify-center font-bold select-none cursor-pointer ${currentSize.text} ${className}`}
      style={{
        width: `${currentSize.box}px`,
        height: `${currentSize.box}px`,
        borderRadius: radii.avatar, // STRICT: 12px rounded square, NEVER circle
        backgroundColor: colors.spotBlueLight,
        color: colors.spotBlueDark,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          style={{ borderRadius: radii.avatar }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );

  if (hasStoryRing || isElite) {
    return (
      <SpotRing active={true} size={currentSize.ringSize} animate={hasStoryRing}>
        {baseContent}
      </SpotRing>
    );
  }

  return baseContent;
};
