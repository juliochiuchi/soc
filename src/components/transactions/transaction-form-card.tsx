import type { BaseSyntheticEvent } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CurrencyInput } from '@/components/ui/currency-input'
import { DatePicker } from '@/components/ui/date-picker'
import { FileUpload } from '@/components/ui/file-upload'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { TransactionSchema } from '@/features/transactions/transactionSchema'
import type {
  TransactionDetails,
  TransactionFormOptions,
} from '@/features/transactions/transactionTypes'

type TransactionFormCardProps = {
  form: UseFormReturn<TransactionSchema>
  options: TransactionFormOptions
  isEditing: boolean
  authenticatedUsername: string
  activeTransaction: TransactionDetails | null
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
  onCancel: () => void
}

export function TransactionFormCard({
  form,
  options,
  isEditing,
  authenticatedUsername,
  activeTransaction,
  onSubmit,
  onCancel,
}: TransactionFormCardProps) {
  return (
    <Card className="border-white/10 bg-transparent shadow-none">
      <CardHeader className="space-y-3 px-6 pt-6">
        <CardTitle className="text-2xl tracking-tight text-white">
          {isEditing ? 'Editar movimentação' : 'Nova movimentação'}
        </CardTitle>
        <CardDescription className="max-w-3xl text-sm leading-6 text-slate-300">
          Preencha os dados da saída, envie o comprovante para o bucket
          box/payments e mantenha o histórico da pasta centralizado no mesmo
          fluxo.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit} noValidate>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Registrado por
              </p>
              <p className="mt-2 text-sm font-medium text-white">
                {authenticatedUsername}
              </p>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex.: Aluguel do espaço" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="0,00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de pagamento</FormLabel>
                    <FormControl>
                      <Select
                        options={options.paymentMethods}
                        value={field.value}
                        onValueChange={field.onChange}
                        name={field.name}
                        placeholder="Selecione"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Select
                        options={options.categories}
                        value={field.value}
                        onValueChange={field.onChange}
                        name={field.name}
                        placeholder="Selecione"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="proofPaymentFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comprovante</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onFileChange={field.onChange}
                      existingFileUrl={activeTransaction?.proofPayment ?? null}
                    />
                  </FormControl>
                  <FormDescription>
                    Formatos aceitos: PDF, PNG e JPG.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Detalhes adicionais sobre a movimentação"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                className="rounded-xl"
                onClick={onCancel}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="rounded-xl"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? isEditing
                    ? 'Salvando alterações...'
                    : 'Criando movimentação...'
                  : isEditing
                    ? 'Salvar alterações'
                    : 'Criar movimentação'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
