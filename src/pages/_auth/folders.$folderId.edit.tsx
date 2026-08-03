/* eslint-disable react-refresh/only-export-components */

import { createFileRoute } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'

import { FolderFormCard } from '@/components/folders/folder-form-card'
import { useFolderFormController } from '@/controllers/folderController'
import { getFolderById } from '@/services/folderService'

export const Route = createFileRoute('/_auth/folders/$folderId/edit')({
  loader: async ({ params }) => getFolderById(params.folderId),
  component: EditFolderPage,
})

function EditFolderPage() {
  const { folderId } = Route.useParams()
  const initialFolder = Route.useLoaderData()
  const { form, handleCancel, isEditing, isLoadingFolder, onSubmit } =
    useFolderFormController({
      folderId,
      initialFolder,
    })

  if (isLoadingFolder) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-3xl border border-white/10 bg-white/4">
        <div className="flex items-center gap-3 text-slate-300">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Carregando dados da pasta...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
          Editar pasta
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-300">
          Atualize as informações principais da pasta sem sair da navegação
          lateral da plataforma.
        </p>
      </section>

      <FolderFormCard
        form={form}
        onSubmit={onSubmit}
        onCancel={handleCancel}
        isEditing={isEditing}
      />
    </div>
  )
}
