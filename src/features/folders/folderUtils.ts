import dayjs from 'dayjs'

import type { FolderFilters, FolderSummary } from '@/features/folders/folderTypes'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export const folderInitialFilters: FolderFilters = {
  year: 'all',
  month: 'all',
  name: '',
  status: 'active',
}

export const folderMonthOptions = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
]

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function formatFolderCurrency(value: number) {
  return currencyFormatter.format(value)
}

export function formatFolderDate(value: string | null) {
  if (!value) {
    return 'Data não informada'
  }

  return dayjs(value).format('DD/MM/YYYY')
}

export function getFolderStatusLabel(isActive: boolean) {
  return isActive ? 'Ativo' : 'Inativo'
}

export function getFolderStatusClasses(isActive: boolean) {
  return isActive
    ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
    : 'border-slate-400/20 bg-slate-400/10 text-slate-300'
}

export function getFolderTransactionLabel(transactionNames: string[]) {
  if (!transactionNames.length) {
    return '-'
  }

  if (transactionNames.length <= 2) {
    return transactionNames.join(' · ')
  }

  return `${transactionNames.slice(0, 2).join(' · ')} +${transactionNames.length - 2}`
}

export function getFolderYears(folders: FolderSummary[]) {
  return [...new Set(folders.map((folder) => folder.openedAt?.slice(0, 4)).filter(Boolean))]
    .sort((left, right) => Number(right) - Number(left)) as string[]
}

export function matchesFolderFilters(
  folder: FolderSummary,
  filters: FolderFilters,
) {
  if (filters.status === 'active' && !folder.isActive) {
    return false
  }

  if (filters.status === 'inactive' && folder.isActive) {
    return false
  }

  if (filters.year !== 'all') {
    const folderYear = folder.openedAt?.slice(0, 4)

    if (folderYear !== filters.year) {
      return false
    }
  }

  if (filters.month !== 'all') {
    const folderMonth = folder.openedAt?.slice(5, 7)

    if (folderMonth !== filters.month) {
      return false
    }
  }

  const normalizedTerm = normalizeText(filters.name)

  if (!normalizedTerm) {
    return true
  }

  const candidates = [
    folder.folderName,
    folder.description ?? '',
    folder.local ?? '',
    ...folder.transactionNames,
  ]

  return candidates.some((value) => normalizeText(value).includes(normalizedTerm))
}
