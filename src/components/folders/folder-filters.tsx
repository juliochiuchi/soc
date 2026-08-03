import { Plus, Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, type SelectOption } from '@/components/ui/select'
import { folderMonthOptions } from '@/features/folders/folderUtils'
import type { FolderFilters } from '@/features/folders/folderTypes'

const monthOptions: SelectOption[] = [
  { value: 'all', label: 'Todos os meses' },
  ...folderMonthOptions,
]

const statusOptions: SelectOption[] = [
  { value: 'all', label: 'Todos os status' },
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
]

type FolderFiltersProps = {
  filters: FolderFilters
  availableYears: string[]
  onFilterChange: <TFilterKey extends keyof FolderFilters>(
    key: TFilterKey,
    value: FolderFilters[TFilterKey],
  ) => void
  onReset: () => void
  onCreateFolder: () => void | Promise<void>
}

export function FolderFiltersBar({
  filters,
  availableYears,
  onFilterChange,
  onReset,
  onCreateFolder,
}: FolderFiltersProps) {
  const yearOptions: SelectOption[] = [
    { value: 'all', label: 'Todos os anos' },
    ...availableYears.map((year) => ({ value: year, label: year })),
  ]

  return (
    <div className="rounded-4xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.8)_0%,rgba(2,6,23,0.96)_100%)] p-4 shadow-[0_24px_60px_-42px_rgba(2,6,23,0.72)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-[0.95rem] font-semibold tracking-tight text-white">
              Pastas organizadas com visão rápida
            </p>
            <p className="text-sm text-slate-300">
              Busca imediata com leitura simples e foco nos dados principais.
            </p>
          </div>

          <Button
            onClick={onCreateFolder}
            className="rounded-full bg-white px-5 text-slate-950 shadow-[0_18px_35px_-22px_rgba(2,6,23,0.75)] hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" />
            Abrir pasta
          </Button>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.65fr)_repeat(3,minmax(0,0.8fr))_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={filters.name}
              onChange={(event) => onFilterChange('name', event.target.value)}
              placeholder="Buscar por nome da pasta ou transação"
              className="rounded-2xl border-white/10 bg-white/6 pl-11 text-slate-100 placeholder:text-slate-400 focus:border-white/20 focus:bg-white/8 focus:ring-slate-700"
            />
          </div>

          <Select
            options={yearOptions}
            value={filters.year}
            onValueChange={(value) => onFilterChange('year', value)}
          />

          <Select
            options={monthOptions}
            value={filters.month}
            onValueChange={(value) => onFilterChange('month', value)}
          />

          <Select
            options={statusOptions}
            value={filters.status}
            onValueChange={(value) =>
              onFilterChange('status', value as FolderFilters['status'])
            }
          />

          <Button
            variant="secondary"
            className="rounded-2xl border border-white/10 bg-white/6 px-4 text-slate-200 ring-0 hover:bg-white/10 hover:text-white lg:min-w-0"
            onClick={onReset}
          >
            <X className="h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>
    </div>
  )
}
