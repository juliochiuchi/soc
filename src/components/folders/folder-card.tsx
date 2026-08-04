import { ArrowRight, CalendarDays, MapPin, Pencil, ReceiptText, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  formatFolderCurrency,
  formatFolderDate,
  getFolderStatusClasses,
  getFolderStatusLabel,
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
    <Card className="flex h-full w-full max-w-[560px] flex-col rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9)_0%,rgba(2,6,23,0.98)_100%)] shadow-[0_28px_70px_-44px_rgba(2,6,23,0.82)] transition duration-300 hover:-translate-y-0.5 hover:border-white/14 hover:bg-[linear-gradient(180deg,rgba(15,23,42,0.94)_0%,rgba(2,6,23,1)_100%)]">
      <CardHeader className="space-y-5 px-5 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-slate-200">
              <ReceiptText className="h-5 w-5" />
            </div>

            <div className="space-y-1.5">
              <CardTitle className="truncate text-[1.18rem] font-semibold tracking-tight text-white">
                {folder.folderName}
              </CardTitle>
              <p className="line-clamp-2 text-sm leading-6 text-slate-400">
                {folder.description?.trim() || 'Pasta pronta para consolidar saídas e comprovantes.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span
              className={`rounded-full border px-3 py-1 text-[0.68rem] font-semibold ${getFolderStatusClasses(folder.isActive)}`}
            >
              {getFolderStatusLabel(folder.isActive)}
            </span>
          </div>
        </div>

        <div className="grid gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
            <span>Aberta em {formatFolderDate(folder.openedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
            <span className="truncate">{folder.local?.trim() || 'Local não informado'}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-5 pb-5 mt-4">
        <div className="space-y-4 rounded-[24px] border border-white/8 bg-white/4 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <FolderMetricRow
            label="Transações"
            value={`${folder.transactionCount} ${folder.transactionCount === 1 ? 'registro' : 'registros'}`}
            valueClassName="font-semibold text-slate-100"
          />
          <div className="h-px bg-white/8" />
          <FolderMetricRow
            label="Total saídas"
            value={formatFolderCurrency(folder.totalAmount)}
            valueClassName="font-semibold text-rose-300"
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

      <CardFooter className="flex items-center justify-between border-t border-white/8 px-5 pb-5 pt-4">
        <Button
          variant="ghost"
          className="h-auto rounded-full p-2 text-sm font-semibold text-sky-300 hover:bg-transparent hover:text-sky-200"
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
