import type { BaseSyntheticEvent } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
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
import { Textarea } from '@/components/ui/textarea'
import type { FolderSchema } from '@/features/folders/folderSchema'

type FolderFormCardProps = {
  form: UseFormReturn<FolderSchema>
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
  onCancel: () => void | Promise<void>
  isEditing: boolean
}

export function FolderFormCard({
  form,
  onSubmit,
  onCancel,
  isEditing,
}: FolderFormCardProps) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="space-y-3 mb-4">
        <CardTitle className="text-3xl tracking-tight">
          {isEditing ? 'Editar pasta' : 'Abrir nova pasta'}
        </CardTitle>
        <CardDescription className="max-w-2xl text-base text-slate-300">
          Registre os dados principais da pasta para manter a operação
          organizada e pronta para receber transações.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit} noValidate>
            <FormField
              control={form.control}
              name="folderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da pasta</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex.: Prestação evento agosto" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-5 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="openedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de abertura</FormLabel>
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
                name="local"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Informe o local da pasta" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Adicione contexto ou observações da pasta"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <div className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel>Status ativo</FormLabel>
                      <FormDescription>
                        Deixe marcado para indicar que a pasta segue aberta e
                        disponível para movimentações.
                      </FormDescription>
                    </div>
                  </div>
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
                    : 'Abrindo pasta...'
                  : isEditing
                    ? 'Salvar alterações'
                    : 'Criar pasta'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
