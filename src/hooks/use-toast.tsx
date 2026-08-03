/* eslint-disable react-refresh/only-export-components */

import * as React from 'react'

type ToastVariant = 'default' | 'success' | 'destructive'

export type ToastInput = {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number | null
  actionLabel?: string
  onAction?: () => void | Promise<void>
  cancelLabel?: string
  onCancel?: () => void | Promise<void>
}

export type ToastItem = ToastInput & {
  id: number
}

type ToastContextValue = {
  toast: (value: ToastInput) => void
  dismiss: (id: number) => void
  toasts: ToastItem[]
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined,
)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])
  const toastIdRef = React.useRef(0)

  const dismiss = React.useCallback((id: number) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
  }, [])

  const toast = React.useCallback(
    ({
      duration = 4000,
      variant = 'default',
      ...value
    }: ToastInput) => {
      toastIdRef.current += 1
      const id = toastIdRef.current

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          variant,
          duration,
          ...value,
        },
      ])

      if (typeof duration === 'number' && duration > 0) {
        window.setTimeout(() => {
          dismiss(id)
        }, duration)
      }
    },
    [dismiss],
  )

  const value = React.useMemo(
    () => ({
      toast,
      dismiss,
      toasts,
    }),
    [dismiss, toast, toasts],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = React.useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}
