import {
  ArrowUpRight,
  CreditCard,
  FileText,
  Pencil,
  Tag,
  Trash2,
  User2,
} from 'lucide-react'
import type { ReactNode } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import type { TransactionDetails } from '@/features/transactions/transactionTypes'
import {
  formatTransactionCurrency,
  formatTransactionDate,
  getTransactionAmountClassName,
} from '@/features/transactions/transactionUtils'

type TransactionHistoryAccordionProps = {
  transactions: TransactionDetails[]
  deletingTransactionId: string | null
  onEdit: (transaction: TransactionDetails) => void
  onDelete: (transaction: TransactionDetails) => void
}

type MetaRowProps = {
  icon: ReactNode
  label: string
  value: string
}

function MetaRow({ icon, label, value }: MetaRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
        <span className="text-slate-400">{icon}</span>
        <span>{label}</span>
      </div>
      <p className="text-sm font-medium leading-6 text-slate-100">{value}</p>
    </div>
  )
}

function getProofPaymentLabel(proofPayment: string | null) {
  if (!proofPayment) {
    return 'Sem comprovante'
  }

  return proofPayment
}

function isExternalLink(value: string | null) {
  return Boolean(value && /^https?:\/\//i.test(value))
}

export function TransactionHistoryAccordion({
  transactions,
  deletingTransactionId,
  onEdit,
  onDelete,
}: TransactionHistoryAccordionProps) {
  return (
    <Accordion
      className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.72)_0%,rgba(2,6,23,0.92)_100%)]"
      defaultValue={transactions[0]?.id ?? null}
    >
      {transactions.map((transaction) => {
        const amountClassName = getTransactionAmountClassName(transaction.kind)
        const proofPaymentLabel = getProofPaymentLabel(transaction.proofPayment)

        return (
          <AccordionItem key={transaction.id} value={transaction.id}>
            <AccordionTrigger className="gap-5">
              <div className="flex min-w-0 items-center gap-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rose-400/20 bg-rose-500/10 text-rose-300"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </div>

                <div className="w-full min-w-0 space-y-1 flex items-center justify-between">
                  <div className="">
                    <p className="truncate text-sm font-semibold text-white md:text-base">
                      {transaction.name}
                    </p>
                    <p className="text-xs font-medium text-slate-400">
                      {formatTransactionDate(transaction.date)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 pr-3">
                    <p className={`text-sm font-semibold md:text-base ${amountClassName}`}>
                      {formatTransactionCurrency(-Math.abs(transaction.price))}
                    </p>
                  </div>
                </div>

              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-5 p-4">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <MetaRow
                    icon={<Tag className="h-4 w-4" />}
                    label="Categoria"
                    value={transaction.categoryLabel}
                  />
                  <MetaRow
                    icon={<User2 className="h-4 w-4" />}
                    label="Registrado por"
                    value={transaction.sentByLabel}
                  />
                  <MetaRow
                    icon={<CreditCard className="h-4 w-4" />}
                    label="Tipo de pagamento"
                    value={transaction.paymentMethodLabel}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span>Comprovante</span>
                    </div>
                    {isExternalLink(transaction.proofPayment) ? (
                      <a
                        href={transaction.proofPayment ?? '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-sky-300 transition hover:text-sky-200"
                      >
                        Visualizar
                      </a>
                    ) : (
                      <p className="text-sm font-medium leading-6 text-slate-100">
                        {proofPaymentLabel}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                    Observações
                  </p>
                  <p className="text-sm leading-7 text-slate-200">
                    {transaction.note?.trim() || 'Nenhuma observação informada.'}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-white/8 pt-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-full border border-white/10 bg-white/6 text-slate-300 hover:bg-white/10 hover:text-white"
                    onClick={() => onEdit(transaction)}
                    aria-label={`Editar movimentação ${transaction.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-full border border-white/10 bg-white/6 text-rose-300 hover:bg-rose-500/12 hover:text-rose-200"
                    onClick={() => onDelete(transaction)}
                    disabled={deletingTransactionId === transaction.id}
                    aria-label={`Excluir movimentação ${transaction.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
