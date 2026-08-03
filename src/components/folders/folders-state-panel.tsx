import type { LucideIcon } from 'lucide-react'

type FoldersStatePanelProps = {
  icon: LucideIcon
  title: string
  description?: string
  centered?: boolean
  spinningIcon?: boolean
  variant?: 'default' | 'dashed'
}

export function FoldersStatePanel({
  icon: Icon,
  title,
  description,
  centered = true,
  spinningIcon = false,
  variant = 'default',
}: FoldersStatePanelProps) {
  return (
    <div
      className={`rounded-4xl border bg-white/5 p-8 text-center shadow-[0_24px_60px_-42px_rgba(2,6,23,0.72)] ${
        variant === 'dashed' ? 'border-dashed border-white/12' : 'border-white/10'
      }`}
    >
      <div
        className={`mx-auto flex max-w-xl flex-col gap-3 ${centered ? 'items-center' : ''}`}
      >
        <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-white">
          <Icon className={`h-5 w-5 ${spinningIcon ? 'animate-spin' : ''}`} />
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {description ? (
          <p className="text-sm leading-7 text-slate-300">{description}</p>
        ) : null}
      </div>
    </div>
  )
}
