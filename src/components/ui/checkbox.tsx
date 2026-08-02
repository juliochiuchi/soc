import * as React from 'react'

import { cn } from '@/lib/utils'

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, type = 'checkbox', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'h-4 w-4 rounded-md border border-white/20 bg-white/5 text-slate-950 accent-white outline-none transition focus:ring-2 focus:ring-white/25 focus:ring-offset-2 focus:ring-offset-slate-950',
          className,
        )}
        {...props}
      />
    )
  },
)

Checkbox.displayName = 'Checkbox'
