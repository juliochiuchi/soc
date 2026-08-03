/* eslint-disable react-refresh/only-export-components */

import { createFileRoute } from '@tanstack/react-router'

import { useHomeController } from '@/controllers/authController'
import { WelcomeCard } from '@/components/home/welcome-card'

export const Route = createFileRoute('/_auth/home')({
  component: HomePage,
})

function HomePage() {
  const { username } = useHomeController()

  return <WelcomeCard username={username} />
}
