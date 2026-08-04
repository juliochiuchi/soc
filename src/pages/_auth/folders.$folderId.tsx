/* eslint-disable react-refresh/only-export-components */

import {
  ArrowLeft,
  CalendarDays,
  FolderOpen,
  LoaderCircle,
  MapPin,
  Plus,
  TrendingDown,
} from 'lucide-react'
import {
  Outlet,
  createFileRoute,
  useRouterState,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'

import {
  TransactionFormCard,
  TransactionHistoryAccordion,
} from '@/components/transactions'
import { Button } from '@/components/ui/button'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useFolderTransactionsController } from '@/controllers/transactionController'
import {
  formatFolderDate,
  getFolderStatusClasses,
  getFolderStatusLabel,
} from '@/features/folders/folderUtils'
import { formatTransactionCurrency } from '@/features/transactions/transactionUtils'

export const Route = createFileRoute('/_auth/folders/$folderId')({
  component: FolderTransactionsPage,
})

type SummaryMetricCardProps = {
  icon: ReactNode
  label: string
  value: string
  toneClassName: string
}

function SummaryMetricCard({
  icon,
  label,
  value,
  toneClassName,
}: SummaryMetricCardProps) {
  return (
    <Card className="border-white/10 bg-white/5 shadow-[0_24px_60px_-40px_rgba(2,6,23,0.85)]">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${toneClassName}`}
        >
          {icon}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function FolderTransactionsPage() {
  const { folderId } = Route.useParams()
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  if (pathname !== `/folders/${folderId}`) {
    return <Outlet />
  }

  return <FolderTransactionsContent folderId={folderId} />
}

function FolderTransactionsContent({ folderId }: { folderId: string }) {
  const {
    form,
    folder,
    transactions,
    options,
    overview,
    isLoading,
    isRefreshing,
    isFormOpen,
    isEditing,
    activeTransaction,
    authenticatedUsername,
    deletingTransactionId,
    transactionPendingDelete,
    handleGoBack,
    handleCreateTransaction,
    handleConfirmDeleteTransaction,
    handleDeleteDialogOpenChange,
    handleEditTransaction,
    handleDeleteTransaction,
    handleCancelForm,
    onSubmit,
  } = useFolderTransactionsController(folderId)

  if (isLoading || !folder) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-[28px] border border-white/10 bg-white/4">
        <div className="flex items-center gap-3 text-slate-300">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Carregando detalhes da pasta...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-fit rounded-xl px-0 text-slate-300 hover:bg-transparent hover:text-white"
            onClick={() => void handleGoBack()}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para pastas
          </Button>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
              Detalhes da pasta
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-300">
              Acompanhe o histórico completo de movimentações vinculadas a esta
              pasta
            </p>
          </div>
        </div>

        <Button className="rounded-xl" onClick={handleCreateTransaction}>
          <Plus className="h-4 w-4" />
          Nova movimentação
        </Button>
      </div>

      <Card className="overflow-hidden rounded-[32px] border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.88)_0%,rgba(2,6,23,0.98)_100%)] shadow-[0_30px_100px_-55px_rgba(15,23,42,0.95)]">
        <CardContent className="space-y-6 p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-semibold tracking-tight text-white">
                  {folder.folderName}
                </h2>
                <span
                  className={`rounded-full border px-3 py-1 text-[0.72rem] font-semibold ${getFolderStatusClasses(folder.isActive)}`}
                >
                  {getFolderStatusLabel(folder.isActive)}
                </span>
              </div>

              <p className="max-w-3xl text-sm leading-7 text-slate-300">
                {folder.description?.trim() ||
                  'Esta pasta ainda não possui uma descrição adicional cadastrada.'}
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-300">
              <p className="font-medium text-white">
                {transactions.length}{' '}
                {transactions.length === 1 ? 'movimentação' : 'movimentações'}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                Histórico vinculado
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              <span>Aberta em {formatFolderDate(folder.openedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{folder.local?.trim() || 'Local não informado'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-1">
        <SummaryMetricCard
          icon={<TrendingDown className="h-5 w-5 text-rose-300" />}
          label="Total saídas"
          value={formatTransactionCurrency(overview.totalExpenses)}
          toneClassName="border-rose-400/20 bg-rose-500/10 text-rose-300"
        />
      </div>

      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelForm()
          }
        }}
      >
        <DialogContent>
          <TransactionFormCard
            form={form}
            options={options}
            isEditing={isEditing}
            authenticatedUsername={authenticatedUsername}
            activeTransaction={activeTransaction}
            onSubmit={onSubmit}
            onCancel={handleCancelForm}
          />
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={Boolean(transactionPendingDelete)}
        onOpenChange={handleDeleteDialogOpenChange}
        title="Excluir movimentação"
        description={
          transactionPendingDelete
            ? `Deseja realmente excluir a movimentação "${transactionPendingDelete.name}"?`
            : ''
        }
        isConfirming={Boolean(deletingTransactionId)}
        onConfirm={handleConfirmDeleteTransaction}
      />

      <Card className="mt-3 overflow-hidden rounded-[32px] border-white/10 bg-white/5">
        <CardHeader className="flex flex-col gap-3 border-b border-white/8 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl tracking-tight text-white">
              Histórico de movimentações
            </CardTitle>
            <p className="text-sm text-slate-400">
              {isRefreshing
                ? 'Atualizando movimentações...'
                : `Total de ${transactions.length} registro${transactions.length === 1 ? '' : 's'} nesta pasta.`}
            </p>
          </div>
        </CardHeader>

        <CardContent className="mt-8 p-0">
          {transactions.length ? (
            <TransactionHistoryAccordion
              transactions={transactions}
              deletingTransactionId={deletingTransactionId}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4 text-slate-300">
                <FolderOpen className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-white">
                  Nenhuma movimentação cadastrada
                </p>
                <p className="max-w-2xl text-sm leading-7 text-slate-400">
                  Use o botão no topo direito para registrar a primeira
                  movimentação desta pasta.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
