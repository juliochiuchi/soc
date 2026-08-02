import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Informe seu usuário.')
    .max(60, 'O usuário informado é muito longo.'),
  password: z
    .string()
    .min(1, 'Informe sua senha.')
    .max(72, 'A senha informada é muito longa.'),
  rememberSession: z.boolean(),
})

export type LoginSchema = z.infer<typeof loginSchema>
