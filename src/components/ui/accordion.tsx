import { ChevronDown } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

type AccordionContextValue = {
  openValue: string | null
  onItemToggle: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(
  undefined,
)

type AccordionItemContextValue = {
  value: string
  isOpen: boolean
}

const AccordionItemContext = React.createContext<
  AccordionItemContextValue | undefined
>(undefined)

type AccordionProps = {
  children: React.ReactNode
  className?: string
  defaultValue?: string | null
}

export function Accordion({
  children,
  className,
  defaultValue = null,
}: AccordionProps) {
  const [openValue, setOpenValue] = React.useState<string | null>(defaultValue)

  const contextValue = React.useMemo<AccordionContextValue>(
    () => ({
      openValue,
      onItemToggle: (value) => {
        setOpenValue((currentValue) => (currentValue === value ? null : value))
      },
    }),
    [openValue],
  )

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  )
}

type AccordionItemProps = {
  children: React.ReactNode
  className?: string
  value: string
}

export function AccordionItem({
  children,
  className,
  value,
}: AccordionItemProps) {
  const accordion = React.useContext(AccordionContext)

  if (!accordion) {
    throw new Error('AccordionItem must be used within Accordion')
  }

  const itemContext = React.useMemo<AccordionItemContextValue>(
    () => ({
      value,
      isOpen: accordion.openValue === value,
    }),
    [accordion.openValue, value],
  )

  return (
    <AccordionItemContext.Provider value={itemContext}>
      <div
        className={cn(
          'overflow-hidden border-b border-white/8 last:border-b-0',
          className,
        )}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function AccordionTrigger({
  children,
  className,
  ...props
}: AccordionTriggerProps) {
  const accordion = React.useContext(AccordionContext)
  const item = React.useContext(AccordionItemContext)

  if (!accordion || !item) {
    throw new Error('AccordionTrigger must be used within AccordionItem')
  }

  return (
    <button
      type="button"
      className={cn(
        'flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/4',
        className,
      )}
      onClick={() => accordion.onItemToggle(item.value)}
      {...props}
    >
      <div className="min-w-0 flex-1">{children}</div>
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
          item.isOpen && 'rotate-180 text-white',
        )}
      />
    </button>
  )
}

type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>

export function AccordionContent({
  children,
  className,
  ...props
}: AccordionContentProps) {
  const item = React.useContext(AccordionItemContext)

  if (!item) {
    throw new Error('AccordionContent must be used within AccordionItem')
  }

  if (!item.isOpen) {
    return null
  }

  return (
    <div className={cn('px-5 pb-5', className)} {...props}>
      {children}
    </div>
  )
}
