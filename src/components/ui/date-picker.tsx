import dayjs from 'dayjs'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

type DatePickerProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
> & {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
}

const weekdayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const monthLabels = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

function formatDateLabel(value?: string) {
  if (!value) {
    return ''
  }

  const parsedDate = dayjs(value)

  if (!parsedDate.isValid()) {
    return value
  }

  return parsedDate.format('DD/MM/YYYY')
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      className,
      disabled,
      id,
      name,
      onBlur,
      onValueChange,
      placeholder = 'Selecione uma data',
      value,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const buttonRef = React.useRef<HTMLButtonElement | null>(null)
    const [open, setOpen] = React.useState(false)
    const selectedDate = value ? dayjs(value) : null
    const selectedDateKey = selectedDate?.isValid()
      ? selectedDate.format('YYYY-MM-DD')
      : null
    const [viewMonth, setViewMonth] = React.useState(
      selectedDate?.isValid() ? selectedDate.startOf('month') : dayjs().startOf('month'),
    )
    const displayValue = formatDateLabel(value)
    const monthTitle = `${monthLabels[viewMonth.month()]} de ${viewMonth.format('YYYY')}`

    function setButtonRef(node: HTMLButtonElement | null) {
      buttonRef.current = node

      if (typeof ref === 'function') {
        ref(node)
        return
      }

      if (ref) {
        ref.current = node
      }
    }

    React.useEffect(() => {
      if (selectedDateKey) {
        setViewMonth(dayjs(selectedDateKey).startOf('month'))
      }
    }, [selectedDateKey])

    React.useEffect(() => {
      if (!open) {
        return
      }

      function handlePointerDown(event: MouseEvent) {
        if (!rootRef.current?.contains(event.target as Node)) {
          setOpen(false)
        }
      }

      function handleEscape(event: KeyboardEvent) {
        if (event.key === 'Escape') {
          setOpen(false)
          buttonRef.current?.focus()
        }
      }

      document.addEventListener('mousedown', handlePointerDown)
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('mousedown', handlePointerDown)
        document.removeEventListener('keydown', handleEscape)
      }
    }, [open])

    const calendarDays = React.useMemo(() => {
      const startDate = viewMonth.startOf('month').startOf('week')
      const endDate = viewMonth.endOf('month').endOf('week')
      const days: dayjs.Dayjs[] = []

      let currentDate = startDate

      while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
        days.push(currentDate)
        currentDate = currentDate.add(1, 'day')
      }

      return days
    }, [viewMonth])

    function handleSelectDate(date: dayjs.Dayjs) {
      onValueChange?.(date.format('YYYY-MM-DD'))
      onBlur?.()
      setOpen(false)
      buttonRef.current?.focus()
    }

    function handleToggleOpen() {
      if (disabled) {
        return
      }

      setOpen((currentOpen) => !currentOpen)
    }

    return (
      <div ref={rootRef} className="relative w-full">
        {name ? <input type="hidden" name={name} value={value ?? ''} /> : null}

        <button
          {...props}
          id={id}
          type="button"
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          aria-expanded={open}
          aria-haspopup="dialog"
          disabled={disabled}
          ref={setButtonRef}
          className={cn(
            'group flex h-12 w-full cursor-pointer items-center rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-left text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none transition duration-300 focus-visible:border-white/35 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/20',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
          onBlur={onBlur}
          onClick={handleToggleOpen}
        >
          <div className="pointer-events-none flex w-full items-center justify-between gap-3">
            <span className={cn(displayValue ? 'text-white' : 'text-slate-400')}>
              {displayValue || placeholder}
            </span>
            <CalendarDays className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-white group-hover:text-slate-200" />
          </div>
        </button>

        {open ? (
          <div className="absolute left-0 z-30 mt-2 w-76 rounded-2xl border border-white/10 bg-slate-950/98 p-3 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.92)] backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/8 hover:text-white"
                onClick={() =>
                  setViewMonth((currentMonth) => currentMonth.subtract(1, 'month'))
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <p className="text-sm font-semibold text-white">{monthTitle}</p>

              <button
                type="button"
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/8 hover:text-white"
                onClick={() =>
                  setViewMonth((currentMonth) => currentMonth.add(1, 'month'))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1">
              {weekdayLabels.map((label) => (
                <span
                  key={label}
                  className="flex h-9 items-center justify-center text-xs font-medium uppercase tracking-[0.12em] text-slate-500"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date) => {
                const isSelected = selectedDate?.isSame(date, 'day') ?? false
                const isCurrentMonth = date.month() === viewMonth.month()
                const isToday = date.isSame(dayjs(), 'day')

                return (
                  <button
                    key={date.format('YYYY-MM-DD')}
                    type="button"
                    className={cn(
                      'flex h-10 cursor-pointer items-center justify-center rounded-xl text-sm transition',
                      isSelected
                        ? 'bg-white text-slate-950'
                        : 'text-slate-200 hover:bg-white/8 hover:text-white',
                      !isCurrentMonth && !isSelected && 'text-slate-500',
                      isToday && !isSelected && 'ring-1 ring-white/15',
                    )}
                    onClick={() => handleSelectDate(date)}
                  >
                    {date.date()}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    )
  },
)

DatePicker.displayName = 'DatePicker'
