export type TransactionKind = 'entry' | 'expense'

export type TransactionFormOption = {
  value: string
  label: string
}

export type TransactionFormOptions = {
  categories: TransactionFormOption[]
  paymentMethods: TransactionFormOption[]
  users: TransactionFormOption[]
}

export type TransactionDetails = {
  id: string
  folderId: string | null
  name: string
  date: string
  price: number
  paymentMethodId: string
  paymentMethodLabel: string
  categoryId: string
  categoryLabel: string
  sentBy: string
  sentByLabel: string
  proofPayment: string | null
  note: string | null
  kind: TransactionKind
}

export type TransactionMutationInput = {
  name: string
  date: string
  price: number
  paymentMethodId: string
  categoryId: string
  sentBy: string
  proofPayment: string | null
  note: string
}

export type TransactionOverview = {
  balance: number
  totalEntries: number
  totalExpenses: number
}

export type FolderTransactionsPageData = {
  transactions: TransactionDetails[]
  options: TransactionFormOptions
}
