import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import { folderSchema, type FolderSchema } from '@/features/folders/folderSchema'
import {
  folderInitialFilters,
  getFolderYears,
  matchesFolderFilters,
} from '@/features/folders/folderUtils'
import type {
  FolderDetails,
  FolderFilters,
  FolderSummary,
} from '@/features/folders/folderTypes'
import { useToast } from '@/hooks/use-toast'
import {
  createFolder,
  deleteFolder,
  getFolderById,
  listFolders,
  updateFolder,
} from '@/services/folderService'

function getFolderErrorDescription(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage
}

function getFolderFormDefaultValues(): FolderSchema {
  return {
    folderName: '',
    description: '',
    local: '',
    openedAt: '',
    isActive: true,
  }
}

function mapFolderToFormValues(folder: FolderDetails): FolderSchema {
  return {
    folderName: folder.folderName,
    description: folder.description ?? '',
    local: folder.local ?? '',
    openedAt: folder.openedAt ? folder.openedAt.slice(0, 10) : '',
    isActive: folder.isActive,
  }
}

export function useFoldersController() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [folders, setFolders] = React.useState<FolderSummary[]>([])
  const [filters, setFilters] = React.useState<FolderFilters>(folderInitialFilters)
  const [isLoading, setIsLoading] = React.useState(true)
  const [deletingFolderId, setDeletingFolderId] = React.useState<string | null>(
    null,
  )
  const [folderPendingDelete, setFolderPendingDelete] =
    React.useState<FolderSummary | null>(null)

  const loadFolders = React.useCallback(async () => {
    setIsLoading(true)

    try {
      const foldersResponse = await listFolders()
      setFolders(foldersResponse)
    } catch (error) {
      toast({
        title: 'Falha ao carregar pastas',
        description: getFolderErrorDescription(
          error,
          'Nao foi possivel listar as pastas agora.',
        ),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    void loadFolders()
  }, [loadFolders])

  const filteredFolders = React.useMemo(
    () => folders.filter((folder) => matchesFolderFilters(folder, filters)),
    [filters, folders],
  )

  const availableYears = React.useMemo(() => getFolderYears(folders), [folders])

  const updateFilter = React.useCallback(
    <TFilterKey extends keyof FolderFilters>(
      key: TFilterKey,
      value: FolderFilters[TFilterKey],
    ) => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        [key]: value,
      }))
    },
    [],
  )

  const resetFilters = React.useCallback(() => {
    setFilters(folderInitialFilters)
  }, [])

  const handleCreateFolder = React.useCallback(async () => {
    await navigate({ to: '/folders/new' })
  }, [navigate])

  const handleViewFolder = React.useCallback(
    async (folderId: string) => {
      await navigate({
        to: '/folders/$folderId',
        params: { folderId },
      })
    },
    [navigate],
  )

  const handleEditFolder = React.useCallback(
    async (folderId: string) => {
      await navigate({
        to: '/folders/$folderId/edit',
        params: { folderId },
      })
    },
    [navigate],
  )

  const handleDeleteFolder = React.useCallback(
    async (folder: FolderSummary) => {
      setFolderPendingDelete(folder)
    },
    [],
  )

  const handleConfirmDeleteFolder = React.useCallback(async () => {
    if (!folderPendingDelete) {
      return
    }

    setDeletingFolderId(folderPendingDelete.id)

    try {
      await deleteFolder(folderPendingDelete.id)
      toast({
        title: 'Pasta excluida',
        description: 'A pasta foi removida com sucesso.',
        variant: 'success',
      })
      setFolderPendingDelete(null)
      await loadFolders()
    } catch (error) {
      toast({
        title: 'Falha ao excluir pasta',
        description: getFolderErrorDescription(
          error,
          'Nao foi possivel excluir a pasta.',
        ),
        variant: 'destructive',
      })
    } finally {
      setDeletingFolderId(null)
    }
  }, [folderPendingDelete, loadFolders, toast])

  const handleDeleteDialogOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open && !deletingFolderId) {
        setFolderPendingDelete(null)
      }
    },
    [deletingFolderId],
  )

  return {
    filters,
    folders: filteredFolders,
    availableYears,
    isLoading,
    deletingFolderId,
    folderPendingDelete,
    updateFilter,
    resetFilters,
    handleCreateFolder,
    handleViewFolder,
    handleEditFolder,
    handleDeleteFolder,
    handleConfirmDeleteFolder,
    handleDeleteDialogOpenChange,
    reloadFolders: loadFolders,
  }
}

type UseFolderFormControllerOptions = {
  folderId?: string
  initialFolder?: FolderDetails | null
}

export function useFolderFormController({
  folderId,
  initialFolder = null,
}: UseFolderFormControllerOptions = {}) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoadingFolder, setIsLoadingFolder] = React.useState(
    Boolean(folderId) && !initialFolder,
  )
  const isEditing = Boolean(folderId)

  const form = useForm<FolderSchema>({
    resolver: zodResolver(folderSchema),
    defaultValues: initialFolder
      ? mapFolderToFormValues(initialFolder)
      : getFolderFormDefaultValues(),
  })

  React.useEffect(() => {
    if (initialFolder) {
      form.reset(mapFolderToFormValues(initialFolder))
      setIsLoadingFolder(false)
      return
    }

    if (!folderId) {
      return
    }

    let cancelled = false

    async function loadFolder() {
      setIsLoadingFolder(true)

      try {
        const folder = await getFolderById(folderId)

        if (!cancelled) {
          form.reset(mapFolderToFormValues(folder))
        }
      } catch (error) {
        toast({
          title: 'Falha ao carregar pasta',
          description: getFolderErrorDescription(
            error,
            'Nao foi possivel carregar os dados da pasta.',
          ),
          variant: 'destructive',
        })

        await navigate({ to: '/folders', replace: true })
      } finally {
        if (!cancelled) {
          setIsLoadingFolder(false)
        }
      }
    }

    void loadFolder()

    return () => {
      cancelled = true
    }
  }, [folderId, form, initialFolder, navigate, toast])

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (folderId) {
        await updateFolder(folderId, values)
        toast({
          title: 'Pasta atualizada',
          description: 'As informacoes da pasta foram salvas com sucesso.',
          variant: 'success',
        })
        await navigate({ to: '/folders' })
        return
      }

      await createFolder(values)
      toast({
        title: 'Pasta criada',
        description: 'A nova pasta foi aberta com sucesso.',
        variant: 'success',
      })
      await navigate({ to: '/folders' })
    } catch (error) {
      toast({
        title: 'Falha ao salvar pasta',
        description: getFolderErrorDescription(
          error,
          'Nao foi possivel salvar a pasta.',
        ),
        variant: 'destructive',
      })
    }
  })

  const handleCancel = React.useCallback(async () => {
    await navigate({ to: '/folders' })
  }, [navigate])

  return {
    form,
    onSubmit,
    handleCancel,
    isEditing,
    isLoadingFolder,
  }
}

export function useFolderDetailsController(folderId: string) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [folder, setFolder] = React.useState<FolderDetails | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const loadFolder = React.useCallback(async () => {
    setIsLoading(true)

    try {
      const folderDetails = await getFolderById(folderId)
      setFolder(folderDetails)
    } catch (error) {
      toast({
        title: 'Falha ao carregar detalhes',
        description: getFolderErrorDescription(
          error,
          'Nao foi possivel carregar os detalhes da pasta.',
        ),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [folderId, toast])

  React.useEffect(() => {
    void loadFolder()
  }, [loadFolder])

  const handleBack = React.useCallback(async () => {
    await navigate({ to: '/folders' })
  }, [navigate])

  const handleEdit = React.useCallback(async () => {
    await navigate({
      to: '/folders/$folderId/edit',
      params: { folderId },
    })
  }, [folderId, navigate])

  return {
    folder,
    isLoading,
    handleBack,
    handleEdit,
    reloadFolder: loadFolder,
  }
}
