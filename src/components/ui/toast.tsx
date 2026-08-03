import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'
import * as React from 'react'

import type { ToastItem } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const variantClasses: Record<NonNullable<ToastItem['variant']>, string> = {
  default: 'border-white/10 bg-slate-950/92 text-slate-50',
  success: 'border-emerald-400/20 bg-emerald-500/12 text-emerald-50',
  destructive: 'border-rose-400/25 bg-rose-500/12 text-rose-50',
}

const variantIcons: Record<NonNullable<ToastItem['variant']>, React.ReactNode> = {
  default: <Info className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  destructive: <CircleAlert className="h-4 w-4" />,
}

export function ToastViewport({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-md flex-col gap-3">{children}</div>
    </div>
  )
}

type ToastProps = {
  toast: ToastItem
  onDismiss: (id: number) => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  async function handleAction() {
    await toast.onAction?.()
    onDismiss(toast.id)
  }

  async function handleCancel() {
    await toast.onCancel?.()
    onDismiss(toast.id)
  }

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.9)] backdrop-blur-2xl',
        variantClasses[toast.variant ?? 'default'],
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mt-0.5 shrink-0">{variantIcons[toast.variant ?? 'default']}</div>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.description ? (
          <p className="text-sm leading-5 opacity-90">{toast.description}</p>
        ) : null}
        {toast.actionLabel || toast.cancelLabel ? (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {toast.cancelLabel ? (
              <button
                type="button"
                onClick={() => void handleCancel()}
                className="inline-flex h-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 px-3 text-xs font-medium text-current/85 transition hover:bg-white/10 hover:text-current"
              >
                {toast.cancelLabel}
              </button>
            ) : null}
            {toast.actionLabel ? (
              <button
                type="button"
                onClick={() => void handleAction()}
                className="inline-flex h-8 cursor-pointer items-center justify-center rounded-lg bg-white px-3 text-xs font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                {toast.actionLabel}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-current/75 transition hover:bg-white/10 hover:text-current"
        aria-label="Fechar notificação"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
