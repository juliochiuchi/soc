/* eslint-disable react-refresh/only-export-components */

import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { FolderOpen, LoaderCircle } from 'lucide-react'

import { FolderCard } from '@/components/folders/folder-card'
import { FolderFiltersBar } from '@/components/folders/folder-filters'
import { FoldersPageHero } from '@/components/folders/folders-page-hero'
import { FoldersStatePanel } from '@/components/folders/folders-state-panel'
import { useFoldersController } from '@/controllers/folderController'

export const Route = createFileRoute('/_auth/folders')({
  component: FoldersPage,
})

function FoldersPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  if (pathname !== '/folders') {
    return <Outlet />
  }

  return <FoldersIndexContent />
}

function FoldersIndexContent() {
  const {
    availableYears,
    deletingFolderId,
    filters,
    folders,
    handleCreateFolder,
    handleDeleteFolder,
    handleEditFolder,
    handleViewFolder,
    isLoading,
    resetFilters,
    updateFilter,
  } = useFoldersController()

  return (
    <div className="space-y-6 text-white">
      <FoldersPageHero totalFolders={folders.length} />

      <FolderFiltersBar
        filters={filters}
        availableYears={availableYears}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        onCreateFolder={handleCreateFolder}
      />

      {isLoading ? (
        <FoldersStatePanel
          icon={LoaderCircle}
          title="Carregando pastas..."
          spinningIcon
        />
      ) : folders.length ? (
        <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              isDeleting={deletingFolderId === folder.id}
              onViewDetails={handleViewFolder}
              onEdit={handleEditFolder}
              onDelete={handleDeleteFolder}
            />
          ))}
        </div>
      ) : (
        <FoldersStatePanel
          icon={FolderOpen}
          title="Nenhuma pasta encontrada"
          description="Ajuste os filtros atuais ou abra uma nova pasta para iniciar a gestão desta área."
          variant="dashed"
        />
      )}
    </div>
  )
}
