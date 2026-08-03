import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type WelcomeCardProps = {
  username: string
}

export function WelcomeCard({ username }: WelcomeCardProps) {
  return (
    <Card className="min-h-full border-white/10 bg-white/6">
      <CardHeader className="space-y-3">
        <CardTitle className="text-3xl tracking-tight text-white md:text-4xl">
          Bem-vindo, {username}
        </CardTitle>
        <CardDescription className="max-w-2xl text-base leading-7 text-slate-300">
          Sua area autenticada ja esta pronta com uma navegacao lateral para
          acomodar os proximos modulos da plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/35 p-6">
          <p className="text-sm leading-7 text-slate-300">
            Esta e a sua pagina inicial. Por enquanto, deixamos uma saudacao de
            boas-vindas ao usuario e a estrutura principal de navegacao para
            evoluirmos a plataforma com tranquilidade.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
