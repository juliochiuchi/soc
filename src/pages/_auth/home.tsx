/* eslint-disable react-refresh/only-export-components */

import { createFileRoute } from '@tanstack/react-router'

import { useHomeController } from '@/controllers/authController'
import { AppSidebar } from '@/components/home/app-sidebar'
import { WelcomeCard } from '@/components/home/welcome-card'

export const Route = createFileRoute('/_auth/home')({
  component: HomePage,
})

function HomePage() {
  const { authenticatedAtLabel, handleLogout, username } = useHomeController()

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="flex min-h-screen flex-col md:flex-row">
        <AppSidebar
          username={username}
          authenticatedAtLabel={authenticatedAtLabel}
          onLogout={handleLogout}
        />

        <section className="flex-1 p-5 md:p-8">
          <WelcomeCard username={username} />
        </section>
      </div>
    </main>
  )
}
