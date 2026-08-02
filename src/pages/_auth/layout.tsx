/* eslint-disable react-refresh/only-export-components */

import { Outlet, createFileRoute } from '@tanstack/react-router'
import { LoaderCircle, ShieldCheck } from 'lucide-react'

import { AuthShell } from '@/components/auth/auth-shell'
import { useAuthLayoutController } from '@/controllers/authController'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  const { canRenderContent, isCheckingSession, isRedirecting } =
    useAuthLayoutController()

  if (!canRenderContent) {
    return (
      <AuthShell
        badge="SOC ACCESS"
        title="Autenticando ambiente seguro"
        description="Estamos restaurando sua sessão e aplicando as regras de acesso antes de liberar a navegação."
        aside={
          <div className="rounded-3xl border border-white/10 bg-white/6 p-5 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-xl bg-white/10 p-2 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <p className="font-medium text-white">Sessão centralizada</p>
                <p className="leading-6 text-slate-300">
                  O estado de autenticação é restaurado primeiro e só depois as
                  rotas são resolvidas.
                </p>
              </div>
            </div>
          </div>
        }
      >
        <div className="flex min-h-56 flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-white">
            <LoaderCircle className="h-6 w-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-white">
              {isCheckingSession
                ? 'Restaurando sessão'
                : isRedirecting
                  ? 'Redirecionando com segurança'
                  : 'Preparando ambiente'}
            </p>
            <p className="text-sm leading-6 text-slate-300">
              Aguarde um instante enquanto o fluxo de acesso é concluído.
            </p>
          </div>
        </div>
      </AuthShell>
    )
  }

  return <Outlet />
}
