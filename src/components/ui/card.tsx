import * as React from 'react'

import { cn } from '@/lib/utils'

export type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-white/[0.06] shadow-[0_32px_80px_-34px_rgba(15,23,42,0.85)] backdrop-blur-2xl',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn('space-y-2 px-7 pt-7', className)} {...props} />
}

export function CardTitle({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'text-[1.75rem] font-semibold tracking-[-0.04em] text-white',
        className,
      )}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: CardProps) {
  return (
    <p
      className={cn(
        'max-w-md text-sm leading-6 text-slate-300/90',
        className,
      )}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('px-7 pb-7', className)} {...props} />
}

export function CardFooter({ className, ...props }: CardProps) {
  return <div className={cn('px-7 pb-7 pt-2', className)} {...props} />
}
