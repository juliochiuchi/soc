/* eslint-disable react-refresh/only-export-components */

import { createFileRoute } from '@tanstack/react-router'

import { FolderFormCard } from '@/components/folders/folder-form-card'
import { useFolderFormController } from '@/controllers/folderController'

export const Route = createFileRoute('/_auth/folders/new')({
  component: NewFolderPage,
})

function NewFolderPage() {
  const { form, handleCancel, isEditing, onSubmit } = useFolderFormController()

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
          Criar pasta
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-300">
          Preencha os dados abaixo para abrir uma nova pasta e deixá-la pronta
          para consolidar transações.
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
