import React from 'react';
import { cn } from '../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Premium Badge Component
 * 
 * Variants:
 * - primary: Brand color
 * - secondary: Emerald/accent
 * - success: Green (completed/verified)
 * - warning: Amber (pending/caution)
 * - danger: Red (critical/error)
 * - neutral: Gray (default)
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'neutral',
      size = 'md',
      icon,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const sizeStyles = {
      sm: 'px-2.5 py-0.5 text-xs font-medium',
      md: 'px-3 py-1 text-xs font-semibold',
      lg: 'px-3.5 py-1.5 text-sm font-semibold',
    };

    const variantStyles = {
      primary: 'bg-brand-100 text-brand-700',
      secondary: 'bg-emerald-100 text-emerald-700',
      success: 'bg-emerald-100 text-emerald-700',
      warning: 'bg-amber-100 text-amber-700',
      danger: 'bg-red-100 text-red-700',
      neutral: 'bg-neutral-100 text-neutral-700',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full',
          sizeStyles[size],
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

// Dot Badge (small status indicator)
interface DotBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'online' | 'offline' | 'away' | 'success' | 'warning' | 'danger';
}

export const DotBadge = React.forwardRef<HTMLSpanElement, DotBadgeProps>(
  ({ variant = 'success', className, ...props }, ref) => {
    const variantStyles = {
      online: 'bg-emerald-500',
      offline: 'bg-neutral-400',
      away: 'bg-amber-500',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      danger: 'bg-red-500',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-block h-2.5 w-2.5 rounded-full border-2 border-white',
          variantStyles[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

DotBadge.displayName = 'DotBadge';
