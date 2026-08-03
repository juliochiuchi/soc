import { Check } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export type CheckboxProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    { checked = false, className, disabled, onCheckedChange, onClick, ...props },
    ref,
  ) => {
    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
      onClick?.(event)

      if (event.defaultPrevented || disabled) {
        return
      }

      onCheckedChange?.(!checked)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        data-state={checked ? 'checked' : 'unchecked'}
        className={cn(
          'inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border border-white/20 bg-white/5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none transition focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50',
          checked && 'border-white/70 bg-white/14 text-white',
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        <Check
          className={cn(
            'h-3.5 w-3.5 transition-opacity',
            checked ? 'opacity-100' : 'opacity-0',
          )}
        />
      </button>
    )
  },
)

Checkbox.displayName = 'Checkbox'
