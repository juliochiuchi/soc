import { FolderOpen } from 'lucide-react'

type FoldersPageHeroProps = {
  totalFolders: number
}

function FoldersStatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/6 p-4 shadow-[0_18px_35px_-26px_rgba(2,6,23,0.6)]">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  )
}

export function FoldersPageHero({ totalFolders }: FoldersPageHeroProps) {
  return (
    <section className="overflow-hidden rounded-4xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.98)_100%)] p-6 shadow-[0_34px_80px_-50px_rgba(2,6,23,0.72)] md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 shadow-[0_10px_24px_-18px_rgba(2,6,23,0.5)]">
            <FolderOpen className="h-3.5 w-3.5" />
            Gestão de pastas
          </span>

          <div className="space-y-3">
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tighter text-white md:text-5xl">
              Pastas abertas
            </h1>
            {/* <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-[0.96rem]">
              breve decricao aqui
            </p> */}
          </div>
        </div>

        <div className="sm:min-w-40">
          <FoldersStatCard label="Pastas" value={totalFolders} />
        </div>
      </div>
    </section>
  )
}
