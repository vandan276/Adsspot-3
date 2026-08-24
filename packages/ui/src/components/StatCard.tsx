import React from 'react';
import { Card } from './Card';
import { colors } from '../tokens';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  subtext?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtext,
  className = '',
}) => {
  return (
    <Card padding="md" hoverable className={`flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#687182]">{title}</span>
        {icon && (
          <div
            className="w-8 h-8 flex items-center justify-center rounded-[10px]"
            style={{ backgroundColor: colors.spotBlueLight, color: colors.spotBlue }}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-[#17181C] tracking-tight">{value}</span>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded-full ${
              isPositive ? 'bg-[#EBF9EE] text-[#1B6A2D]' : 'bg-[#FBECEF] text-[#981837]'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>

      {subtext && <span className="text-xs text-[#687182] mt-1.5">{subtext}</span>}
    </Card>
  );
};
