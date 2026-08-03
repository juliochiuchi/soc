import type { ReactNode } from 'react'

import { AppSidebar } from '@/components/home/app-sidebar'

type AppShellLayoutProps = {
  username: string
  authenticatedAtLabel: string
  currentPath: string
  onLogout: () => void | Promise<void>
  children: ReactNode
}

export function AppShellLayout({
  username,
  authenticatedAtLabel,
  currentPath,
  onLogout,
  children,
}: AppShellLayoutProps) {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="flex min-h-screen flex-col md:flex-row">
        <AppSidebar
          username={username}
          authenticatedAtLabel={authenticatedAtLabel}
          currentPath={currentPath}
          onLogout={onLogout}
        />

        <section className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.08),transparent_32%)]" />
          <div className="relative h-full p-5 md:p-8">{children}</div>
        </section>
      </div>
    </main>
  )
}
