import React from 'react';
import { gradients, radii } from '../tokens';

export interface SpotRingProps {
  children: React.ReactNode;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  thickness?: number;
  className?: string;
  animate?: boolean;
}

const sizeConfig = {
  sm: { padding: 2, radius: radii.avatar },
  md: { padding: 3, radius: radii.avatar },
  lg: { padding: 3.5, radius: '14px' },
  xl: { padding: 4, radius: '16px' },
};

export const SpotRing: React.FC<SpotRingProps> = ({
  children,
  active = true,
  size = 'md',
  thickness,
  className = '',
  animate = false,
}) => {
  if (!active) {
    return <div className={`inline-block ${className}`}>{children}</div>;
  }

  const config = sizeConfig[size];
  const paddingVal = thickness ?? config.padding;

  return (
    <div
      className={`inline-flex items-center justify-center relative p-[${paddingVal}px] transition-transform duration-300 ${animate ? 'hover:scale-105' : ''} ${className}`}
      style={{
        background: gradients.spotRingConic,
        borderRadius: config.radius,
        padding: `${paddingVal}px`,
      }}
    >
      <div
        className="w-full h-full bg-white flex items-center justify-center overflow-hidden"
        style={{
          borderRadius: `calc(${config.radius} - ${paddingVal}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
