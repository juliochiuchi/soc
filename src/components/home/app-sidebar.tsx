import { Link } from '@tanstack/react-router'
import { FolderOpen, Home } from 'lucide-react'

import { SessionStatus } from '@/components/home/session-status'
import { SidebarUserMenu } from '@/components/home/sidebar-user-menu'
import { cn } from '@/lib/utils'

type AppSidebarProps = {
  username: string
  authenticatedAtLabel: string
  currentPath: string
  onLogout: () => void | Promise<void>
}

export function AppSidebar({
  username,
  authenticatedAtLabel,
  currentPath,
  onLogout,
}: AppSidebarProps) {
  const navigationItems = [
    {
      label: 'Início',
      to: '/home' as const,
      icon: Home,
      isActive: currentPath === '/home',
    },
    {
      label: 'Pastas',
      to: '/folders' as const,
      icon: FolderOpen,
      isActive: currentPath === '/folders' || currentPath.startsWith('/folders/'),
    },
  ]

  return (
    <aside className="w-full border-b border-white/10 bg-white/5 p-5 backdrop-blur md:w-72 md:border-b-0 md:border-r">
      <div className="flex h-full flex-col gap-6">
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
            SOC Platform
          </p>

          <SidebarUserMenu username={username} onLogout={onLogout} />
        </div>

        <nav className="space-y-3">
          {navigationItems.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                  item.isActive
                    ? 'bg-white/12 text-white ring-1 ring-white/15'
                    : 'text-slate-300 hover:bg-white/8 hover:text-white',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <SessionStatus authenticatedAtLabel={authenticatedAtLabel} />
      </div>
    </aside>
  )
}
