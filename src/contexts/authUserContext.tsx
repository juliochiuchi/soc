/* eslint-disable react-refresh/only-export-components */

import * as React from 'react'

import {
  clearStoredAuthSession,
  persistAuthSession,
  restoreAuthSession,
  type AuthSession,
} from '@/services/authService'

type AuthUserContextValue = {
  status: 'loading' | 'authenticated' | 'anonymous'
  user: AuthSession | null
  isAuthenticated: boolean
  signIn: (session: AuthSession, rememberSession: boolean) => void
  signOut: () => void
}

const AuthUserContext = React.createContext<AuthUserContextValue | undefined>(
  undefined,
)

export function AuthUserProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [status, setStatus] = React.useState<
    'loading' | 'authenticated' | 'anonymous'
  >('loading')
  const [user, setUser] = React.useState<AuthSession | null>(null)

  React.useEffect(() => {
    const restoredSession = restoreAuthSession()

    if (restoredSession) {
      setUser(restoredSession)
      setStatus('authenticated')
      return
    }

    setStatus('anonymous')
  }, [])

  const signIn = React.useCallback(
    (session: AuthSession, rememberSession: boolean) => {
      persistAuthSession(session, rememberSession)
      setUser(session)
      setStatus('authenticated')
    },
    [],
  )

  const signOut = React.useCallback(() => {
    clearStoredAuthSession()
    setUser(null)
    setStatus('anonymous')
  }, [])

  const value = React.useMemo(
    () => ({
      status,
      user,
      isAuthenticated: status === 'authenticated',
      signIn,
      signOut,
    }),
    [signIn, signOut, status, user],
  )

  return (
    <AuthUserContext.Provider value={value}>
      {children}
    </AuthUserContext.Provider>
  )
}

export function useAuthUser() {
  const context = React.useContext(AuthUserContext)

  if (!context) {
    throw new Error('useAuthUser must be used within an AuthUserProvider')
  }

  return context
}
