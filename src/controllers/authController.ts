import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import dayjs from 'dayjs'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import { useAuthUser } from '@/contexts/authUserContext'
import { loginSchema, type LoginSchema } from '@/features/auth/loginSchema'
import { useToast } from '@/hooks/use-toast'
import { authenticateUser } from '@/services/authService'

function getRedirectTarget(pathname: string, isAuthenticated: boolean) {
  if (pathname === '/') {
    return isAuthenticated ? '/home' : '/login'
  }

  if (pathname === '/login' && isAuthenticated) {
    return '/home'
  }

  if (pathname !== '/login' && !isAuthenticated) {
    return '/login'
  }

  return null
}

export function useAuthLayoutController() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { isAuthenticated, status } = useAuthUser()

  const redirectTarget = React.useMemo(
    () =>
      status === 'loading'
        ? null
        : getRedirectTarget(pathname, isAuthenticated),
    [isAuthenticated, pathname, status],
  )

  React.useEffect(() => {
    if (!redirectTarget || redirectTarget === pathname) {
      return
    }

    void navigate({ to: redirectTarget, replace: true })
  }, [navigate, pathname, redirectTarget])

  return {
    isCheckingSession: status === 'loading',
    isRedirecting: redirectTarget !== null,
    canRenderContent: status !== 'loading' && redirectTarget === null,
  }
}

export function useLoginController() {
  const navigate = useNavigate()
  const { signIn } = useAuthUser()
  const { toast } = useToast()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberSession: true,
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const authenticatedUser = await authenticateUser(values)

      signIn(authenticatedUser, values.rememberSession)
      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo, ${authenticatedUser.username}.`,
        variant: 'success',
      })
      await navigate({ to: '/home', replace: true })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível concluir o login agora.'

      toast({
        title: 'Falha na autenticação',
        description: message,
        variant: 'destructive',
      })
    }
  })

  return {
    form,
    onSubmit,
  }
}

export function useHomeController() {
  const { user } = useAuthUser()
  const username = user?.username ?? 'usuario'

  return {
    username,
  }
}

export function useProtectedAppController() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { user, signOut } = useAuthUser()

  async function handleLogout() {
    signOut()
    await navigate({ to: '/login', replace: true })
  }

  const username = user?.username ?? 'usuario'
  const authenticatedAtLabel = user?.authenticatedAt
    ? dayjs(user.authenticatedAt).format('DD/MM/YYYY [as] HH:mm')
    : 'agora'

  return {
    pathname,
    username,
    authenticatedAtLabel,
    handleLogout,
  }
}
