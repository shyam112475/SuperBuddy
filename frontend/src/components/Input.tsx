import React from 'react';
import { cn } from '../utils/cn';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

/**
 * Premium Input Component
 * 
 * Features:
 * - Label, helper text, and error message support
 * - Icon support (left-aligned)
 * - Multiple sizes
 * - Focus states and transitions
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      size = 'md',
      fullWidth = false,
      className,
      ...props
    },
    ref,
  ) => {
    const sizeStyles = {
      sm: 'h-10 px-3 py-2 text-sm',
      md: 'h-11 px-4 py-2.5 text-sm',
      lg: 'h-12 px-4 py-3 text-base',
    };

    const baseStyles = cn(
      'w-full rounded-lg border-2 transition-all duration-200',
      'bg-white text-neutral-900 placeholder-neutral-400',
      'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
      'disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed',
      error ? 'border-red-500 focus:ring-red-100' : 'border-neutral-300',
    );

    const containerClasses = cn(
      'flex flex-col gap-1.5',
      fullWidth && 'w-full',
    );

    return (
      <div className={containerClasses}>
        {label && (
          <label className="text-sm font-medium text-neutral-700">
            {label}
            {props.required && <span className="ml-1 text-red-600">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              baseStyles,
              sizeStyles[size],
             icon ? 'pl-10' : undefined,
              className,
            )}
            {...props}
          />
        </div>

        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
