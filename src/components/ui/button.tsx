import * as React from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'secondary' | 'ghost'
type ButtonSize = 'default' | 'lg' | 'icon'

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'bg-white/90 text-slate-950 shadow-[0_18px_35px_-22px_rgba(255,255,255,0.65)] hover:bg-white',
  secondary:
    'bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/16',
  ghost: 'bg-transparent text-slate-200 hover:bg-white/10 hover:text-white',
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-sm',
  icon: 'h-10 w-10',
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, type = 'button', variant = 'default', size = 'default', ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
