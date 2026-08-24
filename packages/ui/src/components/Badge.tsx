import React from 'react';
import { colors, radii } from '../tokens';
import { MembershipTier, UserRole } from '@adsspot/types';
import { Crown, Sparkles, ShieldCheck } from 'lucide-react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'spot' | 'festival' | 'trust' | 'crimson' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'spot',
  size = 'md',
  icon,
  className = '',
}) => {
  const variantStyles = {
    spot: { bg: colors.spotBlueLight, color: colors.spotBlueDark, border: 'transparent' },
    festival: { bg: colors.festivalYellowLight, color: '#A06E00', border: 'transparent' },
    trust: { bg: colors.trustGreenLight, color: '#1B6A2D', border: 'transparent' },
    crimson: { bg: colors.deepCrimsonLight, color: colors.deepCrimson, border: 'transparent' },
    neutral: { bg: colors.canvas, color: colors.inkSecondary, border: colors.border },
    outline: { bg: 'transparent', color: colors.inkSecondary, border: colors.border },
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-3 py-1 text-xs font-bold gap-1.5',
  };

  const style = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center justify-center select-none ${sizeStyles[size]} ${className}`}
      style={{
        borderRadius: radii.full, // STRICT: Pill shape
        backgroundColor: style.bg,
        color: style.color,
        border: style.border !== 'transparent' ? `1px solid ${style.border}` : 'none',
      }}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export const TrustedBadge: React.FC<{ size?: 'sm' | 'md'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center font-bold text-xs gap-1 select-none ${size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1'} ${className}`}
      style={{
        borderRadius: radii.full,
        backgroundColor: colors.trustGreenLight,
        color: '#135E23',
        border: `1px solid ${colors.trustGreen}`,
      }}
    >
      <ShieldCheck className={size === 'sm' ? 'w-3 h-3 text-[#35AB4E]' : 'w-3.5 h-3.5 text-[#35AB4E]'} />
      <span>Trusted</span>
    </span>
  );
};

export const TierBadge: React.FC<{ tier: MembershipTier; size?: 'sm' | 'md'; className?: string }> = ({
  tier,
  size = 'md',
  className = '',
}) => {
  if (tier === 'elite') {
    return (
      <Badge variant="crimson" size={size} icon={<Crown className="w-3 h-3 text-[#981837]" />} className={className}>
        Elite
      </Badge>
    );
  }
  if (tier === 'premium') {
    return (
      <Badge variant="festival" size={size} icon={<Sparkles className="w-3 h-3 text-[#A06E00]" />} className={className}>
        Premium
      </Badge>
    );
  }
  return (
    <Badge variant="neutral" size={size} className={className}>
      Basic
    </Badge>
  );
};

export const RoleBadge: React.FC<{ role: UserRole; size?: 'sm' | 'md'; className?: string }> = ({
  role,
  size = 'md',
  className = '',
}) => {
  const roleDisplayMap: Record<UserRole, { label: string; variant: BadgeProps['variant'] }> = {
    consumer: { label: 'Consumer', variant: 'neutral' },
    merchant: { label: 'Merchant', variant: 'festival' },
    sm: { label: 'Sales Manager (SM)', variant: 'spot' },
    ro: { label: 'Regional Officer (RO)', variant: 'trust' },
    zo: { label: 'Zone Officer (ZO)', variant: 'crimson' },
    super_admin: { label: 'Super Admin', variant: 'crimson' },
  };

  const item = roleDisplayMap[role];
  return (
    <Badge variant={item.variant} size={size} className={className}>
      {item.label}
    </Badge>
  );
};
