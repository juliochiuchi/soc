type SessionStatusProps = {
  authenticatedAtLabel: string
}

export function SessionStatus({
  authenticatedAtLabel,
}: SessionStatusProps) {
  return (
    <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
        Sessão
      </p>
      <p className="mt-1 text-xs text-slate-300">
        Autenticado em {authenticatedAtLabel}
      </p>
    </div>
  )
}
