import React from 'react';
import { cn } from '../utils/cn';

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'away';
  verified?: boolean;
  initials?: string;
}

/**
 * Premium Avatar Component
 * 
 * Features:
 * - Profile image with initials fallback
 * - Online/offline status indicator
 * - Verification badge
 * - Multiple sizes
 */
export const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  (
    {
      src,
      name,
      size = 'md',
      status,
      verified = false,
      initials,
      className,
      ...props
    },
    ref,
  ) => {
    const getInitials = () => {
      if (initials) return initials;
      return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const sizeStyles = {
      xs: 'h-7 w-7 text-xs',
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
      '2xl': 'h-20 w-20 text-xl',
    };

    const statusDotSize = {
      xs: 'h-2 w-2',
      sm: 'h-2.5 w-2.5',
      md: 'h-3 w-3',
      lg: 'h-3.5 w-3.5',
      xl: 'h-4 w-4',
      '2xl': 'h-5 w-5',
    };

    const statusColor = {
      online: 'bg-emerald-500',
      offline: 'bg-neutral-400',
      away: 'bg-amber-500',
    };

    const verifiedBadgeSize = {
      xs: 'h-3 w-3 text-[8px]',
      sm: 'h-3.5 w-3.5 text-[10px]',
      md: 'h-4 w-4 text-xs',
      lg: 'h-5 w-5 text-xs',
      xl: 'h-6 w-6 text-sm',
      '2xl': 'h-7 w-7 text-sm',
    };

    return (
      <div className="relative inline-flex shrink-0">
        <div
          className={cn(
            sizeStyles[size],
            'relative flex items-center justify-center overflow-hidden rounded-full',
            'bg-gradient-brand font-semibold text-white',
          )}
        >
          {src ? (
            <img
              ref={ref}
              src={src}
              alt={name}
              className="h-full w-full object-cover"
              {...props}
            />
          ) : (
            <span className={cn(className)}>
              {getInitials()}
            </span>
          )}
        </div>

        {/* Status Indicator */}
        {status && (
          <span
            className={cn(
              statusDotSize[size],
              statusColor[status],
              'absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white',
            )}
            aria-label={`Status: ${status}`}
          />
        )}

        {/* Verification Badge */}
        {verified && (
          <span
            className={cn(
              verifiedBadgeSize[size],
              'absolute -bottom-1 -right-1 flex items-center justify-center rounded-full',
              'bg-emerald-500 text-white font-bold border-2 border-white',
            )}
            title="Verified"
          >
            ✓
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';

// Avatar Group Component
interface AvatarGroupProps {
  avatars: Array<{ src?: string; name: string; verified?: boolean }>;
  size?: 'sm' | 'md' | 'lg';
  max?: number;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = 'md',
  max = 3,
}) => {
  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const marginStyles = {
    sm: '-ml-1.5',
    md: '-ml-2.5',
    lg: '-ml-4',
  };

  return (
    <div className="flex items-center">
      {displayed.map((avatar, index) => (
        <Avatar
          key={index}
          {...avatar}
          size={size}
          className={index > 0 ? marginStyles[size] : ''}
        />
      ))}

      {remaining > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-neutral-200 font-medium text-neutral-600',
            marginStyles[size],
            size === 'sm' && 'h-8 w-8 text-xs',
            size === 'md' && 'h-10 w-10 text-sm',
            size === 'lg' && 'h-12 w-12 text-base',
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
