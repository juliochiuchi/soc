/* eslint-disable react-refresh/only-export-components */

import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, KeyRound, UserRound } from 'lucide-react'

import { useLoginController } from '@/controllers/authController'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const { form, onSubmit } = useLoginController()

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0">
        <div className="absolute -left-56 -top-48 h-112 w-md rounded-full bg-[radial-gradient(circle,rgba(148,163,184,0.18),transparent_62%)] blur-2xl" />
        <div className="absolute -bottom-48 -right-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_28%,transparent_68%,rgba(255,255,255,0.03))]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-10 lg:px-10">
        <Card className="relative w-full max-w-xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="">
                <CardTitle>Entre no seu ambiente protegido</CardTitle>
                <CardDescription>
                  Informe seu usuário e senha para acessar a plataforma.
                </CardDescription>
              </div>
              <span className="pt-1 text-xs font-medium tracking-[0.18em] uppercase text-slate-400">
                SOC Platform
              </span>
            </div>
          </CardHeader>

          <CardContent className="mt-4">
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-5" noValidate>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuário</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input
                            {...field}
                            autoComplete="username"
                            placeholder="Digite seu usuário"
                            className="rounded-xl pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input
                            {...field}
                            type="password"
                            autoComplete="current-password"
                            placeholder="Digite sua senha"
                            className="rounded-xl pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-xl mt-4"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Validando acesso...' : 'Entrar'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main >
  )
}
