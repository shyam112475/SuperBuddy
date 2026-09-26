import React from 'react';
import { cn } from '../utils/cn';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary'|'secondary'|'outline'|'ghost'|'danger'; size?: 'xs'|'sm'|'md'|'lg'|'xl'; isLoading?: boolean; fullWidth?: boolean; children: React.ReactNode; }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({variant='primary',size='md',isLoading=false,fullWidth=false,className,children,disabled,...props},ref)=>{
 const sizes={xs:'h-8 px-3 text-xs',sm:'h-10 px-3.5 text-sm',md:'h-11 px-4 text-sm',lg:'h-12 px-5 text-base',xl:'h-14 px-6 text-base'};
 const variants={primary:'bg-brand-600 text-white shadow-md hover:bg-brand-700',secondary:'bg-violet-50 text-brand-700 hover:bg-violet-100',outline:'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50',ghost:'bg-transparent text-neutral-700 hover:bg-neutral-100',danger:'bg-red-600 text-white hover:bg-red-700'};
 return <button ref={ref} className={cn('inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50',sizes[size],variants[variant],fullWidth&&'w-full',className)} disabled={disabled||isLoading} {...props}>{isLoading&&<svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".3"/><path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3"/></svg>}{children}</button>;
});
Button.displayName='Button';
