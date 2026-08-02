import type * as React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type AuthShellProps = {
  badge: string
  title: string
  description: string
  children: React.ReactNode
  aside?: React.ReactNode
  className?: string
}

export function AuthShell({
  badge,
  title,
  description,
  children,
  aside,
  className,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0">
        <div className="absolute -left-56 -top-48 h-112 w-md rounded-full bg-[radial-gradient(circle,rgba(148,163,184,0.18),transparent_62%)] blur-2xl" />
        <div className="absolute -bottom-48 -right-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_28%,transparent_68%,rgba(255,255,255,0.03))]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-10 lg:px-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-slate-300">
              {badge}
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tighter text-white md:text-5xl">
                {title}
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300">
                {description}
              </p>
            </div>

            {aside}
          </section>

          <Card className={cn('relative overflow-hidden', className)}>
            <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
            <CardHeader className="space-y-3">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
