export type FolderStatusFilter = 'all' | 'active' | 'inactive'

export type FolderFilters = {
  year: string
  month: string
  name: string
  status: FolderStatusFilter
}

export type FolderTransaction = {
  id: string
  folderId: string | null
  name: string
  price: number
  date: string
}

export type FolderSummary = {
  id: string
  folderName: string
  description: string | null
  local: string | null
  openedAt: string | null
  isActive: boolean
  transactionNames: string[]
  totalAmount: number
  transactionCount: number
}

export type FolderDetails = FolderSummary & {
  transactions: FolderTransaction[]
}

export type FolderMutationInput = {
  folderName: string
  description: string
  local: string
  openedAt: string
  isActive: boolean
}
