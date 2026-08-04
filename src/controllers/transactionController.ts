import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import { useAuthUser } from '@/contexts/authUserContext'
import type { FolderDetails } from '@/features/folders/folderTypes'
import {
  transactionSchema,
  type TransactionSchema,
} from '@/features/transactions/transactionSchema'
import type {
  TransactionDetails,
  TransactionFormOptions,
} from '@/features/transactions/transactionTypes'
import {
  buildTransactionOverview,
  formatTransactionAmountInput,
  parseTransactionAmount,
} from '@/features/transactions/transactionUtils'
import { useToast } from '@/hooks/use-toast'
import { getUserIdByUsername } from '@/services/authService'
import { getFolderById } from '@/services/folderService'
import {
  createTransaction,
  deleteTransaction,
  getFolderTransactionsPageData,
  updateTransaction,
  uploadTransactionProof,
} from '@/services/transactionService'

type TransactionFormMode = 'closed' | 'create' | 'edit'

function getErrorDescription(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function getTransactionFormDefaultValues(): TransactionSchema {
  return {
    name: '',
    date: '',
    price: '',
    paymentMethodId: '',
    categoryId: '',
    proofPaymentFile: null,
    note: '',
  }
}

function mapTransactionToFormValues(
  transaction: TransactionDetails,
): TransactionSchema {
  return {
    name: transaction.name,
    date: transaction.date,
    price: formatTransactionAmountInput(transaction.price),
    paymentMethodId: transaction.paymentMethodId,
    categoryId: transaction.categoryId,
    proofPaymentFile: null,
    note: transaction.note ?? '',
  }
}

export function useFolderTransactionsController(folderId: string) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuthUser()
  const [folder, setFolder] = React.useState<FolderDetails | null>(null)
  const [transactions, setTransactions] = React.useState<TransactionDetails[]>([])
  const [options, setOptions] = React.useState<TransactionFormOptions>({
    categories: [],
    paymentMethods: [],
    users: [],
  })
  const [authenticatedUserId, setAuthenticatedUserId] = React.useState<
    string | null
  >(user?.userId ?? null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [formMode, setFormMode] = React.useState<TransactionFormMode>('closed')
  const [activeTransaction, setActiveTransaction] =
    React.useState<TransactionDetails | null>(null)
  const [deletingTransactionId, setDeletingTransactionId] = React.useState<
    string | null
  >(null)
  const [transactionPendingDelete, setTransactionPendingDelete] =
    React.useState<TransactionDetails | null>(null)

  const form = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
    defaultValues: getTransactionFormDefaultValues(),
  })

  const resolveAuthenticatedUserId = React.useCallback(async () => {
    if (user?.userId) {
      setAuthenticatedUserId(user.userId)
      return user.userId
    }

    if (!user?.username) {
      throw new Error('Não foi possível identificar o usuário autenticado.')
    }

    const resolvedUserId = await getUserIdByUsername(user.username)
    setAuthenticatedUserId(resolvedUserId)

    return resolvedUserId
  }, [user?.userId, user?.username])

  const loadPageData = React.useCallback(
    async (showLoadingState = false) => {
      if (showLoadingState) {
        setIsLoading(true)
      } else {
        setIsRefreshing(true)
      }

      try {
        const [folderResponse, transactionData] = await Promise.all([
          getFolderById(folderId),
          getFolderTransactionsPageData(folderId),
        ])

        setFolder(folderResponse)
        setTransactions(transactionData.transactions)
        setOptions(transactionData.options)
      } catch (error) {
        toast({
          title: 'Falha ao carregar a pasta',
          description: getErrorDescription(
            error,
            'Não foi possível carregar as movimentações desta pasta.',
          ),
          variant: 'destructive',
        })

        await navigate({ to: '/folders', replace: true })
      } finally {
        if (showLoadingState) {
          setIsLoading(false)
        } else {
          setIsRefreshing(false)
        }
      }
    },
    [folderId, navigate, toast],
  )

  React.useEffect(() => {
    void loadPageData(true)
  }, [loadPageData])

  React.useEffect(() => {
    void resolveAuthenticatedUserId().catch((error) => {
      toast({
        title: 'Falha ao identificar usuário',
        description: getErrorDescription(
          error,
          'Não foi possível preparar o usuário autenticado.',
        ),
        variant: 'destructive',
      })
    })
  }, [resolveAuthenticatedUserId, toast])

  const overview = React.useMemo(
    () => buildTransactionOverview(transactions),
    [transactions],
  )

  const handleGoBack = React.useCallback(async () => {
    await navigate({ to: '/folders' })
  }, [navigate])

  const handleCreateTransaction = React.useCallback(() => {
    form.reset(getTransactionFormDefaultValues())
    setActiveTransaction(null)
    setFormMode('create')
  }, [form])

  const handleEditTransaction = React.useCallback(
    (transaction: TransactionDetails) => {
      form.reset(mapTransactionToFormValues(transaction))
      setActiveTransaction(transaction)
      setFormMode('edit')
    },
    [form],
  )

  const handleCancelForm = React.useCallback(() => {
    form.reset(getTransactionFormDefaultValues())
    setActiveTransaction(null)
    setFormMode('closed')
  }, [form])

  const handleDeleteTransaction = React.useCallback(
    async (transaction: TransactionDetails) => {
      setTransactionPendingDelete(transaction)
    },
    [],
  )

  const handleConfirmDeleteTransaction = React.useCallback(async () => {
    if (!transactionPendingDelete) {
      return
    }

    setDeletingTransactionId(transactionPendingDelete.id)

    try {
      await deleteTransaction(transactionPendingDelete.id)
      toast({
        title: 'Movimentação excluída',
        description: 'A movimentação foi removida com sucesso.',
        variant: 'success',
      })
      setTransactionPendingDelete(null)
      await loadPageData()
    } catch (error) {
      toast({
        title: 'Falha ao excluir movimentação',
        description: getErrorDescription(
          error,
          'Não foi possível excluir a movimentação.',
        ),
        variant: 'destructive',
      })
    } finally {
      setDeletingTransactionId(null)
    }
  }, [loadPageData, toast, transactionPendingDelete])

  const handleDeleteDialogOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open && !deletingTransactionId) {
        setTransactionPendingDelete(null)
      }
    },
    [deletingTransactionId],
  )

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resolvedUserId = authenticatedUserId ?? (await resolveAuthenticatedUserId())
      const uploadedProofPaymentUrl = values.proofPaymentFile
        ? await uploadTransactionProof({
            folderId,
            file: values.proofPaymentFile,
          })
        : activeTransaction?.proofPayment ?? null

      const payload = {
        name: values.name,
        date: values.date,
        price: -Math.abs(parseTransactionAmount(values.price)),
        paymentMethodId: values.paymentMethodId,
        categoryId: values.categoryId,
        sentBy: resolvedUserId,
        proofPayment: uploadedProofPaymentUrl,
        note: values.note,
      }

      if (formMode === 'edit' && activeTransaction) {
        await updateTransaction(activeTransaction.id, folderId, payload)
        toast({
          title: 'Movimentação atualizada',
          description: 'As alterações foram salvas com sucesso.',
          variant: 'success',
        })
      } else {
        await createTransaction(folderId, payload)
        toast({
          title: 'Movimentação criada',
          description: 'A nova movimentação foi registrada com sucesso.',
          variant: 'success',
        })
      }

      handleCancelForm()
      await loadPageData()
    } catch (error) {
      toast({
        title: 'Falha ao salvar movimentação',
        description: getErrorDescription(
          error,
          'Não foi possível salvar a movimentação.',
        ),
        variant: 'destructive',
      })
    }
  })

  const authenticatedUsername = user?.username ?? 'usuário autenticado'

  return {
    form,
    folder,
    transactions,
    options,
    overview,
    isLoading,
    isRefreshing,
    isFormOpen: formMode !== 'closed',
    isEditing: formMode === 'edit',
    activeTransaction,
    authenticatedUsername,
    deletingTransactionId,
    transactionPendingDelete,
    handleGoBack,
    handleCreateTransaction,
    handleEditTransaction,
    handleDeleteTransaction,
    handleConfirmDeleteTransaction,
    handleDeleteDialogOpenChange,
    handleCancelForm,
    onSubmit,
  }
}
