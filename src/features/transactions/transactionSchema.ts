import { z } from 'zod'

import {
  acceptedTransactionProofTypes,
  parseTransactionAmount,
} from '@/features/transactions/transactionUtils'

export const transactionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Informe o nome da movimentação.')
    .max(255, 'O nome deve ter no máximo 255 caracteres.'),
  date: z.string().min(1, 'Informe a data da movimentação.'),
  price: z
    .string()
    .trim()
    .min(1, 'Informe o valor da movimentação.')
    .refine((value) => Number.isFinite(parseTransactionAmount(value)), {
      message: 'Informe um valor numérico válido.',
    }),
  paymentMethodId: z.string().trim().min(1, 'Selecione o tipo de pagamento.'),
  categoryId: z.string().trim().min(1, 'Selecione a categoria.'),
  proofPaymentFile: z
    .custom<File | null>((value) => value === null || value instanceof File, {
      message: 'Selecione um arquivo válido.',
    })
    .refine(
      (value) =>
        value === null || acceptedTransactionProofTypes.includes(value.type),
      {
        message: 'Envie um arquivo PDF, PNG ou JPG.',
      },
    )
    .nullable(),
  note: z
    .string()
    .trim()
    .max(2000, 'As observações devem ter no máximo 2000 caracteres.'),
})

export type TransactionSchema = z.infer<typeof transactionSchema>
