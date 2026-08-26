import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
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
  glass = true,
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      className={`transition-all duration-300 rounded-[24px] ${
        glass
          ? 'ios-glass-card'
          : 'bg-white border border-[#E3E8EF] shadow-card'
      } ${paddingStyles[padding]} ${hoverable ? 'hover:-translate-y-1 hover:shadow-xl' : ''} ${className}`}
      style={{
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
