import React from 'react';
import { colors, radii } from '../tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'festival' | 'trust' | 'crimson' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles = {
  primary: {
    backgroundColor: colors.spotBlue,
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 2px 6px rgba(71, 135, 242, 0.3)',
  },
  festival: {
    backgroundColor: colors.festivalYellow,
    color: colors.ink,
    border: 'none',
    boxShadow: '0 2px 6px rgba(242, 182, 4, 0.3)',
  },
  trust: {
    backgroundColor: colors.trustGreen,
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 2px 6px rgba(53, 171, 78, 0.3)',
  },
  crimson: {
    backgroundColor: colors.deepCrimson,
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 2px 6px rgba(152, 24, 55, 0.3)',
  },
  secondary: {
    backgroundColor: colors.canvas,
    color: colors.ink,
    border: `1px solid ${colors.border}`,
  },
  outline: {
    backgroundColor: 'transparent',
    color: colors.spotBlue,
    border: `1.5px solid ${colors.spotBlue}`,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.inkSecondary,
    border: 'none',
  },
};

const sizeStyles = {
  sm: 'px-3.5 py-1.5 text-xs font-semibold gap-1.5',
  md: 'px-5 py-2.5 text-sm font-semibold gap-2',
  lg: 'px-7 py-3.5 text-base font-bold gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const currentVariant = variantStyles[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${sizeStyles[size]} ${className}`}
      style={{
        borderRadius: radii.full, // STRICT: Pill-shaped (9999px)
        ...currentVariant,
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        leftIcon && <span className="flex items-center">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
};
