import { Check, ChevronDown } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

export type SelectProps = {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
  id?: string
  name?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  onValueChange?: (value: string) => void
}

const selectTriggerBaseClassName =
  'flex h-12 w-full cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none transition duration-300 focus-visible:border-white/20 focus-visible:bg-white/8 focus-visible:ring-2 focus-visible:ring-slate-700 disabled:cursor-not-allowed disabled:opacity-50'

const selectContentBaseClassName =
  'absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/96 p-1.5 text-slate-100 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.92)] backdrop-blur-xl'

const selectItemBaseClassName =
  'flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      placeholder = 'Selecione uma opção',
      disabled,
      className,
      triggerClassName,
      contentClassName,
      id,
      name,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '')
    const rootRef = React.useRef<HTMLDivElement>(null)
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue

    const selectedOption = React.useMemo(
      () => options.find((option) => option.value === currentValue),
      [currentValue, options],
    )

    React.useEffect(() => {
      function handlePointerDown(event: MouseEvent) {
        if (!rootRef.current?.contains(event.target as Node)) {
          setOpen(false)
        }
      }

      function handleEscape(event: KeyboardEvent) {
        if (event.key === 'Escape') {
          setOpen(false)
        }
      }

      document.addEventListener('mousedown', handlePointerDown)
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('mousedown', handlePointerDown)
        document.removeEventListener('keydown', handleEscape)
      }
    }, [])

    function handleSelect(nextValue: string) {
      if (!isControlled) {
        setInternalValue(nextValue)
      }

      onValueChange?.(nextValue)
      setOpen(false)
    }

    return (
      <div ref={rootRef} className={cn('relative', className)}>
        {name ? <input type="hidden" name={name} value={currentValue ?? ''} /> : null}

        <button
          ref={ref}
          id={id}
          type="button"
          disabled={disabled}
          data-state={open ? 'open' : 'closed'}
          className={cn(
            selectTriggerBaseClassName,
            !selectedOption && 'text-slate-400',
            triggerClassName,
          )}
          onClick={() => setOpen((currentOpen) => !currentOpen)}
          {...props}
        >
          <span className="truncate">{selectedOption?.label ?? placeholder}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
              open && 'rotate-180',
            )}
          />
        </button>

        {open ? (
          <div
            role="listbox"
            className={cn(
              selectContentBaseClassName,
              contentClassName,
            )}
          >
            {options.map((option) => {
              const isSelected = option.value === currentValue

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  className={cn(
                    selectItemBaseClassName,
                    isSelected && 'bg-white/8 text-white',
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? <Check className="h-4 w-4 shrink-0" /> : null}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
    )
  },
)

Select.displayName = 'Select'
