import {
  ChevronDown,
  LogOut,
  User,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

type SidebarUserMenuProps = {
  username: string
  onLogout: () => void | Promise<void>
}

export function SidebarUserMenu({
  username,
  onLogout,
}: SidebarUserMenuProps) {
  return (
    <details className="group relative">
      <summary className="flex list-none items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-left transition hover:cursor-pointer hover:bg-white/10">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-slate-200 ring-1 ring-white/10">
          <User className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{username}</p>
          <p className="text-xs text-slate-400">Perfil autenticado</p>
        </div>

        <ChevronDown className="h-4 w-4 text-slate-400 transition" />
      </summary>

      <div className="absolute left-0 top-full z-20 mt-2 min-w-full w-max max-w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/30">
        <Button
          variant="ghost"
          onClick={() => {
            void onLogout()
          }}
          className="w-full justify-start rounded-xl"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </details>
  )
}
