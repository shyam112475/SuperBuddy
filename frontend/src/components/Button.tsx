import React from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Premium Button Component
 * 
 * Variants:
 * - primary: Brand color, primary CTA
 * - secondary: Secondary action (outline style)
 * - outline: Outlined button
 * - ghost: Transparent, minimal button
 * - danger: Red/destructive action
 * 
 * Sizes: xs, sm, md, lg, xl
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles = cn(
      // Base styles
      'inline-flex items-center justify-center font-medium rounded-xl',
      'transition-all duration-200 ease-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'whitespace-nowrap',
      fullWidth && 'w-full',
    );

    // Size variants
    const sizeStyles = {
      xs: 'h-8 px-3 text-xs',
      sm: 'h-10 px-3.5 text-sm',
      md: 'h-11 px-4 text-sm',
      lg: 'h-12 px-5 text-base',
      xl: 'h-14 px-6 text-base',
    };

    // Color variants
    const variantStyles = {
      primary: cn(
        'bg-brand-600 text-white shadow-button',
        'hover:bg-brand-700 hover:shadow-button-hover',
        'active:bg-brand-800',
        'focus:ring-brand-500',
      ),
      secondary: cn(
        'bg-emerald-50 text-emerald-700 shadow-sm',
        'hover:bg-emerald-100 hover:shadow-md',
        'active:bg-emerald-200',
        'focus:ring-emerald-500',
      ),
      outline: cn(
        'bg-white text-neutral-700 border-2 border-neutral-300 shadow-xs',
        'hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-sm',
        'active:border-neutral-500 active:bg-neutral-100',
        'focus:ring-neutral-500',
      ),
      ghost: cn(
        'bg-transparent text-neutral-700',
        'hover:bg-neutral-100',
        'active:bg-neutral-200',
        'focus:ring-neutral-500',
      ),
      danger: cn(
        'bg-red-600 text-white shadow-button',
        'hover:bg-red-700 hover:shadow-button-hover',
        'active:bg-red-800',
        'focus:ring-red-500',
      ),
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
