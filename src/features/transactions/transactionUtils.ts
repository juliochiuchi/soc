import dayjs from 'dayjs'

import type {
  TransactionDetails,
  TransactionKind,
  TransactionOverview,
} from '@/features/transactions/transactionTypes'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export const acceptedTransactionProofTypes = [
  'application/pdf',
  'image/png',
  'image/jpeg',
]

export function parseTransactionAmount(value: string) {
  const compactValue = value.replace(/\s+/g, '')
  const normalizedValue = compactValue.includes(',')
    ? compactValue.replace(/\./g, '').replace(',', '.')
    : compactValue
  return Number.parseFloat(normalizedValue)
}

export function formatTransactionAmountInput(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatTransactionCurrency(value: number) {
  return currencyFormatter.format(value)
}

export function formatTransactionDate(value: string) {
  return dayjs(value).format('DD/MM/YYYY')
}

export function getTransactionKind(value: number): TransactionKind {
  return 'expense'
}

export function getTransactionAmountClassName(kind: TransactionKind) {
  return kind === 'expense' ? 'text-rose-300' : 'text-emerald-300'
}

export function buildTransactionOverview(
  transactions: TransactionDetails[],
): TransactionOverview {
  return transactions.reduce<TransactionOverview>(
    (accumulator, transaction) => {
      accumulator.totalExpenses += Math.abs(transaction.price)
      accumulator.balance += transaction.price

      return accumulator
    },
    {
      balance: 0,
      totalEntries: 0,
      totalExpenses: 0,
    },
  )
}
