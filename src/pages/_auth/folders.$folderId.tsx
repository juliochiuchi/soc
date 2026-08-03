/* eslint-disable react-refresh/only-export-components */

import {
  Outlet,
  createFileRoute,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_auth/folders/$folderId')({
  component: FolderDetailsPage,
})

function FolderDetailsPage() {
  const { folderId } = Route.useParams()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const navigate = useNavigate()

  if (pathname !== `/folders/${folderId}`) {
    return <Outlet />
  }

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="space-y-4">
        <Button
          variant="ghost"
          className="w-fit rounded-xl px-0 text-slate-300 hover:text-white"
          onClick={() => void navigate({ to: '/folders' })}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="space-y-2">
          <CardTitle className="text-3xl tracking-tight text-white">
            Em desenvolvimento
          </CardTitle>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            A visualização de detalhes desta pasta será revisada em uma próxima
            etapa.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-3xl border border-dashed border-white/12 bg-slate-950/30 p-8 text-center">
          <p className="text-base font-medium text-white">em desenvolvimento</p>
        </div>
      </CardContent>
    </Card>
  )
}
