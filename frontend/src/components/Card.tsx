import React from 'react';
import { cn } from '../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'subtle';
  interactive?: boolean;
  children: React.ReactNode;
}

/**
 * Premium Card Component
 * 
 * Variants:
 * - elevated: Shadow-based, premium feel (default)
 * - outlined: Border-based, minimal
 * - subtle: Light background, no shadow
 * 
 * interactive: Adds hover animations for clickable cards
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      interactive = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles = cn(
      'rounded-2xl transition-all duration-300 ease-out',
      'bg-white',
    );

    const variantStyles = {
      elevated: cn(
        'shadow-card',
        interactive && 'hover:shadow-card-hover cursor-pointer',
      ),
      outlined: cn(
        'border-2 border-neutral-200',
        interactive && 'hover:border-neutral-300 hover:shadow-sm cursor-pointer',
      ),
      subtle: cn(
        'bg-neutral-50',
        interactive && 'hover:bg-neutral-100 cursor-pointer',
      ),
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

// Card Image Component
interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'square' | '4/3' | '16/9' | '1/1';
}

export const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  (
    {
      aspectRatio = '4/3',
      className,
      ...props
    },
    ref,
  ) => {
    const aspectRatioStyles = {
      square: 'aspect-square',
      '4/3': 'aspect-video',
      '16/9': 'aspect-video',
      '1/1': 'aspect-square',
    };

    return (
      <div className={cn('overflow-hidden rounded-t-2xl bg-neutral-200', aspectRatioStyles[aspectRatio])}>
        <img
          ref={ref}
          className={cn('h-full w-full object-cover', className)}
          {...props}
        />
      </div>
    );
  },
);

CardImage.displayName = 'CardImage';

// Card Body Component
interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 lg:p-8', className)}
      {...props}
    >
      {children}
    </div>
  ),
);

CardBody.displayName = 'CardBody';

// Card Header Component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('border-b border-neutral-100 px-6 py-4 lg:px-8 lg:py-5', className)}
      {...props}
    >
      {children}
    </div>
  ),
);

CardHeader.displayName = 'CardHeader';

// Card Footer Component
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('border-t border-neutral-100 px-6 py-4 lg:px-8 lg:py-5', className)}
      {...props}
    >
      {children}
    </div>
  ),
);

CardFooter.displayName = 'CardFooter';
