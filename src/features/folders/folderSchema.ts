import { z } from 'zod'

export const folderSchema = z.object({
  folderName: z
    .string()
    .trim()
    .min(2, 'Informe um nome para a pasta.')
    .max(255, 'O nome da pasta deve ter no máximo 255 caracteres.'),
  description: z
    .string()
    .trim()
    .max(255, 'A descrição deve ter no máximo 255 caracteres.'),
  local: z
    .string()
    .trim()
    .max(255, 'O local deve ter no máximo 255 caracteres.'),
  openedAt: z.string().min(1, 'Informe a data de abertura.'),
  isActive: z.boolean(),
})

export type FolderSchema = z.infer<typeof folderSchema>
