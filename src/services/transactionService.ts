import axios from 'axios'

import {
  getTransactionKind,
} from '@/features/transactions/transactionUtils'
import type {
  FolderTransactionsPageData,
  TransactionDetails,
  TransactionFormOption,
  TransactionFormOptions,
  TransactionMutationInput,
} from '@/features/transactions/transactionTypes'
import { supabase } from '@/services/supabaseClient'
import { supabaseHttp } from '@/services/supabaseHttp'

const TRANSACTIONS_TABLE = 'soc_transactions'
const CATEGORIES_TABLE = 'soc_categories'
const PAYMENT_METHODS_TABLE = 'soc_payment_methods'
const USERS_TABLE = 'soc_users'
const TRANSACTION_PROOFS_BUCKET = 'box'
const TRANSACTION_PROOFS_FOLDER = 'payments'
const TRANSACTION_SELECT_FIELDS =
  'id,folder_id,name,date,price,payment_method,category_id,sent_by,proof_payment,note'

type TransactionRecord = {
  id: string
  folder_id: string | null
  name: string
  date: string
  price: number | string
  payment_method: string
  category_id: string
  sent_by: string
  proof_payment: string | null
  note: string | null
}

type NamedRecord = {
  id: string
  name: string
}

type UserRecord = {
  id: string
  username: string
}

function isMissingFolderIdColumnError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false
  }

  const responseData = error.response?.data

  if (
    responseData &&
    typeof responseData === 'object' &&
    'message' in responseData &&
    typeof responseData.message === 'string'
  ) {
    return responseData.message.includes('column soc_transactions.folder_id does not exist')
  }

  return false
}

function getTransactionErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data

    if (
      responseData &&
      typeof responseData === 'object' &&
      'message' in responseData &&
      typeof responseData.message === 'string'
    ) {
      return responseData.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

function parseTransactionPrice(value: number | string) {
  const parsedValue =
    typeof value === 'number' ? value : Number.parseFloat(String(value))

  return Number.isFinite(parsedValue) ? parsedValue : 0
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
}

function buildOptionsMap(options: TransactionFormOption[]) {
  return new Map(options.map((option) => [option.value, option.label]))
}

function toNamedOption(record: NamedRecord): TransactionFormOption {
  return {
    value: record.id,
    label: record.name,
  }
}

function toUserOption(record: UserRecord): TransactionFormOption {
  return {
    value: record.id,
    label: record.username,
  }
}

function toTransactionDetails(
  record: TransactionRecord,
  options: TransactionFormOptions,
): TransactionDetails {
  const categoriesMap = buildOptionsMap(options.categories)
  const paymentMethodsMap = buildOptionsMap(options.paymentMethods)
  const usersMap = buildOptionsMap(options.users)
  const price = parseTransactionPrice(record.price)

  return {
    id: record.id,
    folderId: record.folder_id,
    name: record.name,
    date: record.date,
    price,
    paymentMethodId: record.payment_method,
    paymentMethodLabel:
      paymentMethodsMap.get(record.payment_method) ?? 'Tipo não identificado',
    categoryId: record.category_id,
    categoryLabel: categoriesMap.get(record.category_id) ?? 'Categoria não identificada',
    sentBy: record.sent_by,
    sentByLabel: usersMap.get(record.sent_by) ?? 'Usuário não identificado',
    proofPayment: record.proof_payment,
    note: record.note,
    kind: getTransactionKind(price),
  }
}

async function fetchTransactions(folderId: string) {
  try {
    const { data } = await supabaseHttp.get<TransactionRecord[]>(
      `/${TRANSACTIONS_TABLE}`,
      {
        params: {
          select: TRANSACTION_SELECT_FIELDS,
          folder_id: `eq.${folderId}`,
          order: 'date.desc.nullslast',
        },
      },
    )

    return data ?? []
  } catch (error) {
    if (isMissingFolderIdColumnError(error)) {
      return []
    }

    throw error
  }
}

export async function listTransactionFormOptions(): Promise<TransactionFormOptions> {
  try {
    const [categoriesResponse, paymentMethodsResponse, usersResponse] =
      await Promise.all([
        supabaseHttp.get<NamedRecord[]>(`/${CATEGORIES_TABLE}`, {
          params: {
            select: 'id,name',
            order: 'name.asc',
          },
        }),
        supabaseHttp.get<NamedRecord[]>(`/${PAYMENT_METHODS_TABLE}`, {
          params: {
            select: 'id,name',
            order: 'name.asc',
          },
        }),
        supabaseHttp.get<UserRecord[]>(`/${USERS_TABLE}`, {
          params: {
            select: 'id,username',
            order: 'username.asc',
          },
        }),
      ])

    return {
      categories: (categoriesResponse.data ?? []).map(toNamedOption),
      paymentMethods: (paymentMethodsResponse.data ?? []).map(toNamedOption),
      users: (usersResponse.data ?? []).map(toUserOption),
    }
  } catch (error) {
    throw new Error(
      getTransactionErrorMessage(
        error,
        'Não foi possível carregar os dados auxiliares das movimentações.',
      ),
    )
  }
}

export async function listTransactionsByFolder(
  folderId: string,
  options: TransactionFormOptions,
): Promise<TransactionDetails[]> {
  try {
    const transactions = await fetchTransactions(folderId)

    return transactions.map((transaction) => toTransactionDetails(transaction, options))
  } catch (error) {
    throw new Error(
      getTransactionErrorMessage(
        error,
        'Não foi possível carregar as movimentações desta pasta.',
      ),
    )
  }
}

export async function getFolderTransactionsPageData(
  folderId: string,
): Promise<FolderTransactionsPageData> {
  try {
    const [options, rawTransactions] = await Promise.all([
      listTransactionFormOptions(),
      fetchTransactions(folderId),
    ])

    return {
      options,
      transactions: rawTransactions.map((transaction) =>
        toTransactionDetails(transaction, options),
      ),
    }
  } catch (error) {
    throw new Error(
      getTransactionErrorMessage(
        error,
        'Não foi possível carregar os dados da tela de movimentações.',
      ),
    )
  }
}

function mapTransactionPayload(folderId: string, input: TransactionMutationInput) {
  return {
    folder_id: folderId,
    name: input.name.trim(),
    date: input.date,
    price: input.price,
    payment_method: input.paymentMethodId,
    category_id: input.categoryId,
    sent_by: input.sentBy,
    proof_payment: input.proofPayment?.trim() || null,
    note: input.note.trim() || null,
  }
}

type UploadTransactionProofInput = {
  folderId: string
  file: File
}

export async function uploadTransactionProof({
  folderId,
  file,
}: UploadTransactionProofInput) {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
  const sanitizedName = sanitizeFileName(file.name.replace(/\.[^.]+$/, ''))
  const filePath =
    `${TRANSACTION_PROOFS_FOLDER}/${folderId}/` +
    `${Date.now()}-${crypto.randomUUID()}-${sanitizedName}.${extension}`

  const { error } = await supabase.storage
    .from(TRANSACTION_PROOFS_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error('Não foi possível enviar o comprovante para o storage.')
  }

  const { data } = supabase.storage
    .from(TRANSACTION_PROOFS_BUCKET)
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function createTransaction(
  folderId: string,
  input: TransactionMutationInput,
) {
  try {
    await supabaseHttp.post(`/${TRANSACTIONS_TABLE}`, mapTransactionPayload(folderId, input), {
      headers: {
        Prefer: 'return=representation',
      },
      params: {
        select: TRANSACTION_SELECT_FIELDS,
      },
    })
  } catch (error) {
    throw new Error(
      getTransactionErrorMessage(
        error,
        'Não foi possível criar a movimentação.',
      ),
    )
  }
}

export async function updateTransaction(
  transactionId: string,
  folderId: string,
  input: TransactionMutationInput,
) {
  try {
    await supabaseHttp.patch(
      `/${TRANSACTIONS_TABLE}`,
      mapTransactionPayload(folderId, input),
      {
        headers: {
          Prefer: 'return=representation',
        },
        params: {
          id: `eq.${transactionId}`,
          select: TRANSACTION_SELECT_FIELDS,
        },
      },
    )
  } catch (error) {
    throw new Error(
      getTransactionErrorMessage(
        error,
        'Não foi possível atualizar a movimentação.',
      ),
    )
  }
}

export async function deleteTransaction(transactionId: string) {
  try {
    await supabaseHttp.delete(`/${TRANSACTIONS_TABLE}`, {
      params: {
        id: `eq.${transactionId}`,
      },
    })
  } catch (error) {
    throw new Error(
      getTransactionErrorMessage(
        error,
        'Não foi possível excluir a movimentação.',
      ),
    )
  }
}
