/* eslint-disable react-refresh/only-export-components */

import { createFileRoute } from '@tanstack/react-router'
import {
  Clock3,
  Home,
  LogOut,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react'

import { AuthShell } from '@/components/auth/auth-shell'
import { useHomeController } from '@/controllers/authController'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_auth/home')({
  component: HomePage,
})

function HomePage() {
  const { authenticatedAtLabel, handleLogout, username } = useHomeController()

  return (
    <AuthShell
      badge="SOC HOME"
      title={`Bem-vindo, ${username}`}
      description="Seu acesso foi validado com a nova estratégia de autenticação. A navegação já está protegida e a sessão ficou centralizada no contexto."
      aside={
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white/10 p-2 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-white">Fluxo protegido</p>
                <p className="text-sm leading-6 text-slate-300">
                  O layout só libera a rota depois que a sessão é restaurada.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white/10 p-2 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-white">Camadas organizadas</p>
                <p className="text-sm leading-6 text-slate-300">
                  Página para composição, controller para navegação e service
                  para integração e persistência.
                </p>
              </div>
            </div>
          </div>
        </div>
      }
      className="w-full max-w-xl"
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-2 text-white">
                <UserRoundCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Usuário autenticado</p>
                <p className="font-medium text-white">{username}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-2 text-white">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Sessão iniciada em</p>
                <p className="font-medium text-white">{authenticatedAtLabel}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm leading-6 text-slate-300">
          <div className="mb-3 flex items-center gap-2 font-medium text-white">
            <Home className="h-4 w-4" />
            Acesso validado
          </div>
          <p>
            A autenticação consulta a tabela <strong>soc_users</strong>, grava a
            sessão escolhendo persistência local ou apenas da aba e mantém a
            guarda de rotas sincronizada com esse estado central.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={handleLogout}
          className="w-full rounded-xl"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </AuthShell>
  )
}
