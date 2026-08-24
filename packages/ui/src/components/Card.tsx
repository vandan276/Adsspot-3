import React from 'react';
import { colors, radii, shadows } from '../tokens';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3.5',
  md: 'p-5',
  lg: 'p-7',
};

export const Card: React.FC<CardProps> = ({
  children,
  elevated = true,
  bordered = true,
  hoverable = false,
  padding = 'md',
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      className={`bg-white transition-all duration-200 ${paddingStyles[padding]} ${hoverable ? 'hover:-translate-y-0.5' : ''} ${className}`}
      style={{
        borderRadius: radii.card, // STRICT: 16px border-radius
        backgroundColor: colors.card,
        border: bordered ? `1px solid ${colors.border}` : 'none',
        boxShadow: elevated ? shadows.card : 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
