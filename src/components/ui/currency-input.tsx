import * as React from 'react'

import { cn } from '@/lib/utils'

function formatCurrencyDigits(value: string) {
  const isNegative = value.startsWith('-')
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return isNegative ? '-' : ''
  }

  const numericValue = Number(digits) / 100
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue)

  return isNegative ? `-${formattedValue}` : formattedValue
}

export type CurrencyInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> & {
  value?: string
  onValueChange?: (value: string) => void
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, onValueChange, value = '', ...props }, ref) => {
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const nextRawValue = event.target.value
      const normalizedValue = formatCurrencyDigits(nextRawValue)

      onValueChange?.(normalizedValue)
    }

    return (
      <input
        ref={ref}
        value={value}
        onChange={handleChange}
        inputMode="decimal"
        className={cn(
          'flex h-12 w-full rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none transition duration-300 selection:bg-white selection:text-slate-950 focus:border-white/35 focus:bg-white/10 focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    )
  },
)

CurrencyInput.displayName = 'CurrencyInput'
