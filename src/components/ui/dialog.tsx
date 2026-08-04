import { X } from 'lucide-react'
import * as React from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

type DialogContextValue = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | undefined>(
  undefined,
)

type DialogProps = {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Dialog({ children, open, onOpenChange }: DialogProps) {
  const value = React.useMemo(
    () => ({ open, onOpenChange }),
    [onOpenChange, open],
  )

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  )
}

type DialogTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
  children: React.ReactElement
}

export function DialogTrigger({
  asChild,
  children,
  ...props
}: DialogTriggerProps) {
  const context = React.useContext(DialogContext)

  if (!context) {
    throw new Error('DialogTrigger must be used within Dialog')
  }

  if (!asChild) {
    return React.cloneElement(children, {
      ...props,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        props.onClick?.(event)
        context.onOpenChange(true)
      },
    })
  }

  return React.cloneElement(children, {
    ...props,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(event)
      context.onOpenChange(true)
    },
  })
}

type DialogContentProps = {
  children: React.ReactNode
  className?: string
}

export function DialogContent({ children, className }: DialogContentProps) {
  const context = React.useContext(DialogContext)

  React.useEffect(() => {
    if (!context?.open) {
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        context.onOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [context])

  if (!context?.open || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/72 backdrop-blur-md"
        aria-label="Fechar modal"
        onClick={() => context.onOpenChange(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96)_0%,rgba(2,6,23,0.99)_100%)] shadow-[0_40px_120px_-48px_rgba(15,23,42,0.98)]',
          className,
        )}
      >
        <button
          type="button"
          className="absolute right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/6 text-slate-300 transition hover:bg-white/10 hover:text-white"
          onClick={() => context.onOpenChange(false)}
          aria-label="Fechar modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="modal-scroll-area max-h-[92vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-2 px-6 pt-6', className)} {...props} />
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('text-2xl font-semibold tracking-tight text-white', className)}
      {...props}
    />
  )
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm leading-6 text-slate-300', className)} {...props} />
  )
}
