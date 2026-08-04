import { FileImage, FileText, Upload, X } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function getFileIcon(fileName: string) {
  return /\.pdf$/i.test(fileName) ? FileText : FileImage
}

type FileUploadProps = {
  value?: File | null
  onFileChange?: (file: File | null) => void
  accept?: string
  className?: string
  existingFileUrl?: string | null
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

export function FileUpload({
  value = null,
  onFileChange,
  accept = '.pdf,.png,.jpg,.jpeg',
  className,
  existingFileUrl,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const FileIcon = getFileIcon(value?.name ?? existingFileUrl ?? '')

  function handleSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null
    onFileChange?.(nextFile)
  }

  function handleRemoveSelectedFile() {
    onFileChange?.(null)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed border-white/12 bg-slate-950/35 p-4',
        className,
      )}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleSelectFile}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/6 p-3 text-slate-300">
            <FileIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-sm font-medium text-white">
              {value?.name ?? 'Selecionar comprovante'}
            </p>
            <p className="text-sm text-slate-400">
              Envie PDF, PNG ou JPG para armazenar no bucket box/payments.
            </p>
            {!value && existingFileUrl ? (
              <a
                href={existingFileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-sm font-medium text-sky-300 transition hover:text-sky-200"
              >
                Visualizar comprovante atual
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
          <Button
            type="button"
            variant="secondary"
            className="min-w-44 rounded-xl"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {value ? 'Trocar arquivo' : 'Escolher arquivo'}
          </Button>

          {value ? (
            <Button
              type="button"
              variant="ghost"
              className="min-w-44 rounded-xl text-slate-300 hover:text-white"
              onClick={handleRemoveSelectedFile}
            >
              <X className="h-4 w-4" />
              Remover seleção
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
