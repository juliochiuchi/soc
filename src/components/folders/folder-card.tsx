import { ArrowRight, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  formatFolderCurrency,
  formatFolderDate,
  getFolderStatusClasses,
  getFolderStatusLabel,
  getFolderTransactionLabel,
} from '@/features/folders/folderUtils'
import type { FolderSummary } from '@/features/folders/folderTypes'

type FolderCardProps = {
  folder: FolderSummary
  isDeleting: boolean
  onViewDetails: (folderId: string) => void | Promise<void>
  onEdit: (folderId: string) => void | Promise<void>
  onDelete: (folder: FolderSummary) => void | Promise<void>
}

type FolderMetricRowProps = {
  label: string
  value: string
  valueClassName?: string
}

function FolderMetricRow({
  label,
  value,
  valueClassName,
}: FolderMetricRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="font-medium text-slate-400">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  )
}

export function FolderCard({
  folder,
  isDeleting,
  onViewDetails,
  onEdit,
  onDelete,
}: FolderCardProps) {
  return (
    <Card className="flex h-full flex-col rounded-4xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.88)_0%,rgba(2,6,23,0.96)_100%)] shadow-[0_24px_60px_-40px_rgba(2,6,23,0.7)]">
      <CardHeader className="space-y-5 px-6 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 pb-4">
            <CardTitle className="truncate text-[1.42rem] font-semibold tracking-tight text-white">
              {folder.folderName}
            </CardTitle>
            <p className="text-xs font-medium text-slate-400">
              Aberta em {formatFolderDate(folder.openedAt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-[0.7rem] font-semibold ${getFolderStatusClasses(folder.isActive)}`}
            >
              {getFolderStatusLabel(folder.isActive)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-6 pb-5">
        <div className="space-y-4 rounded-3xl border border-white/8 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <FolderMetricRow
            label="Transações"
            value={getFolderTransactionLabel(folder.transactionNames)}
            valueClassName="max-w-[58%] truncate text-right font-semibold text-slate-200"
          />
          <div className="h-px bg-white/8" />
          <FolderMetricRow
            label="Valor total"
            value={formatFolderCurrency(folder.totalAmount)}
            valueClassName="font-semibold text-emerald-500"
          />
          <div className="h-px bg-white/8" />
          <FolderMetricRow
            label="Status"
            value={getFolderStatusLabel(folder.isActive)}
            valueClassName={
              folder.isActive
                ? 'font-semibold text-emerald-300'
                : 'font-semibold text-slate-300'
            }
          />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-6 pb-6 pt-0">
        <Button
          variant="ghost"
          className="h-auto rounded-full px-0 py-0 text-sm font-semibold text-sky-300 hover:bg-transparent hover:text-sky-200"
          onClick={() => onViewDetails(folder.id)}
        >
          Visualizar detalhes
          <ArrowRight className="h-4 w-4" />
        </Button>

        <div className="flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full border border-white/10 bg-white/8 text-slate-300 hover:bg-white/12 hover:text-white"
            onClick={() => onEdit(folder.id)}
            aria-label={`Editar pasta ${folder.folderName}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full border border-white/10 bg-white/8 text-rose-300 hover:bg-rose-500/12 hover:text-rose-200"
            onClick={() => onDelete(folder)}
            disabled={isDeleting}
            aria-label={`Excluir pasta ${folder.folderName}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
