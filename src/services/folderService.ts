import axios from 'axios'

import type {
  FolderDetails,
  FolderMutationInput,
  FolderSummary,
  FolderTransaction,
} from '@/features/folders/folderTypes'
import { supabaseHttp } from '@/services/supabaseHttp'

const FOLDERS_TABLE = 'soc_folders'
const TRANSACTIONS_TABLE = 'soc_transactions'
const FOLDER_SELECT_FIELDS = 'id,folder_name,description,local,date,status'
const TRANSACTION_SELECT_FIELDS = 'id,folder_id,name,price,date'

type FolderRecord = {
  id: string
  folder_name: string
  description: string | null
  local: string | null
  date: string | null
  status: boolean
}

type TransactionRecord = {
  id: string
  folder_id: string | null
  name: string
  price: number | string
  date: string
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

function getFolderErrorMessage(error: unknown, fallback: string) {
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

function toFolderTransaction(record: TransactionRecord): FolderTransaction {
  return {
    id: record.id,
    folderId: record.folder_id,
    name: record.name,
    price: parseTransactionPrice(record.price),
    date: record.date,
  }
}

function toFolderSummary(
  folder: FolderRecord,
  transactions: FolderTransaction[],
): FolderSummary {
  return {
    id: folder.id,
    folderName: folder.folder_name,
    description: folder.description,
    local: folder.local,
    openedAt: folder.date,
    isActive: folder.status,
    transactionNames: transactions.map((transaction) => transaction.name),
    totalAmount: transactions.reduce(
      (accumulator, transaction) => accumulator + transaction.price,
      0,
    ),
    transactionCount: transactions.length,
  }
}

async function fetchTransactionsByFolderIds(folderIds: string[]) {
  if (!folderIds.length) {
    return []
  }

  try {
    const { data } = await supabaseHttp.get<TransactionRecord[]>(
      `/${TRANSACTIONS_TABLE}`,
      {
        params: {
          select: TRANSACTION_SELECT_FIELDS,
          folder_id: `in.(${folderIds.join(',')})`,
          order: 'date.desc.nullslast',
        },
      },
    )

    return (data ?? []).map(toFolderTransaction)
  } catch (error) {
    if (isMissingFolderIdColumnError(error)) {
      return []
    }

    throw error
  }
}

async function fetchFolderTransactions(folderId: string) {
  try {
    const { data } = await supabaseHttp.get<TransactionRecord[]>(`/${TRANSACTIONS_TABLE}`, {
      params: {
        select: TRANSACTION_SELECT_FIELDS,
        folder_id: `eq.${folderId}`,
        order: 'date.desc.nullslast',
      },
    })

    return (data ?? []).map(toFolderTransaction)
  } catch (error) {
    if (isMissingFolderIdColumnError(error)) {
      return []
    }

    throw error
  }
}

function groupTransactionsByFolderId(transactions: FolderTransaction[]) {
  const transactionsByFolderId = new Map<string, FolderTransaction[]>()

  for (const transaction of transactions) {
    if (!transaction.folderId) {
      continue
    }

    const currentTransactions =
      transactionsByFolderId.get(transaction.folderId) ?? []

    currentTransactions.push(transaction)
    transactionsByFolderId.set(transaction.folderId, currentTransactions)
  }

  return transactionsByFolderId
}

function mapFolderPayload(input: FolderMutationInput) {
  return {
    folder_name: input.folderName.trim(),
    description: input.description.trim() || null,
    local: input.local.trim() || null,
    date: input.openedAt,
    status: input.isActive,
  }
}

export async function listFolders() {
  try {
    const { data } = await supabaseHttp.get<FolderRecord[]>(`/${FOLDERS_TABLE}`, {
      params: {
        select: FOLDER_SELECT_FIELDS,
        order: 'date.desc.nullslast',
      },
    })

    const folders = data ?? []
    const transactions = await fetchTransactionsByFolderIds(
      folders.map((folder) => folder.id),
    )
    const transactionsByFolderId = groupTransactionsByFolderId(transactions)

    return folders.map((folder) =>
      toFolderSummary(folder, transactionsByFolderId.get(folder.id) ?? []),
    )
  } catch (error) {
    throw new Error(
      getFolderErrorMessage(
        error,
        'Nao foi possivel carregar as pastas no momento.',
      ),
    )
  }
}

export async function getFolderById(folderId: string): Promise<FolderDetails> {
  try {
    const { data } = await supabaseHttp.get<FolderRecord[]>(`/${FOLDERS_TABLE}`, {
      params: {
        select: FOLDER_SELECT_FIELDS,
        id: `eq.${folderId}`,
      },
    })

    const folder = data?.[0]

    if (!folder) {
      throw new Error('A pasta solicitada nao foi encontrada.')
    }

    const transactions = await fetchFolderTransactions(folderId)

    return {
      ...toFolderSummary(folder, transactions),
      transactions,
    }
  } catch (error) {
    throw new Error(
      getFolderErrorMessage(
        error,
        'Nao foi possivel carregar os detalhes da pasta.',
      ),
    )
  }
}

export async function createFolder(input: FolderMutationInput) {
  try {
    const { data } = await supabaseHttp.post<FolderRecord[]>(
      `/${FOLDERS_TABLE}`,
      mapFolderPayload(input),
      {
        headers: {
          Prefer: 'return=representation',
        },
        params: {
          select: FOLDER_SELECT_FIELDS,
        },
      },
    )

    const folder = data?.[0]

    if (!folder) {
      throw new Error('Nao foi possivel confirmar a criacao da pasta.')
    }

    return toFolderSummary(folder, [])
  } catch (error) {
    throw new Error(
      getFolderErrorMessage(error, 'Nao foi possivel criar a pasta.'),
    )
  }
}

export async function updateFolder(folderId: string, input: FolderMutationInput) {
  try {
    const { data } = await supabaseHttp.patch<FolderRecord[]>(
      `/${FOLDERS_TABLE}`,
      mapFolderPayload(input),
      {
        headers: {
          Prefer: 'return=representation',
        },
        params: {
          id: `eq.${folderId}`,
          select: FOLDER_SELECT_FIELDS,
        },
      },
    )

    const folder = data?.[0]

    if (!folder) {
      throw new Error('Nao foi possivel confirmar a atualizacao da pasta.')
    }

    const details = await getFolderById(folder.id)

    return details
  } catch (error) {
    throw new Error(
      getFolderErrorMessage(error, 'Nao foi possivel atualizar a pasta.'),
    )
  }
}

export async function deleteFolder(folderId: string) {
  try {
    await supabaseHttp.delete(`/${FOLDERS_TABLE}`, {
      params: {
        id: `eq.${folderId}`,
      },
    })
  } catch (error) {
    throw new Error(
      getFolderErrorMessage(error, 'Nao foi possivel excluir a pasta.'),
    )
  }
}
