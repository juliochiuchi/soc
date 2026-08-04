import { z } from 'zod'

import type { LoginSchema } from '@/features/auth/loginSchema'
import { supabase } from '@/services/supabaseClient'

const sessionStorageKey = 'soc.auth.session'
const persistentStorageKey = 'soc.auth.remembered-session'

const storedAuthSessionSchema = z.object({
  hasAuthentication: z.literal(true),
  userId: z.string().uuid().optional(),
  username: z.string().trim().min(1).max(60),
  authenticatedAt: z.string().min(1),
})

export type AuthSession = z.infer<typeof storedAuthSessionSchema>

type SocUserRecord = {
  id: string
  username: string
}

function isBrowserEnvironment() {
  return typeof window !== 'undefined'
}

function readStoredSession(storage: Storage, key: string): AuthSession | null {
  const rawValue = storage.getItem(key)

  if (!rawValue) {
    return null
  }

  let parsedJson: unknown

  try {
    parsedJson = JSON.parse(rawValue)
  } catch {
    storage.removeItem(key)
    return null
  }

  const parsedValue = storedAuthSessionSchema.safeParse(parsedJson)

  if (!parsedValue.success) {
    storage.removeItem(key)
    return null
  }

  return parsedValue.data
}

function writeStoredSession(
  storage: Storage,
  key: string,
  session: AuthSession,
) {
  storage.setItem(key, JSON.stringify(session))
}

export async function authenticateUser({
  username,
  password,
}: LoginSchema): Promise<AuthSession> {
  const { data, error } = await supabase
    .from('soc_users')
    .select('id,username')
    .eq('username', username)
    .eq('password', password)
    .maybeSingle<SocUserRecord>()

  if (error) {
    throw new Error('Não foi possível validar suas credenciais no momento.')
  }

  if (!data) {
    throw new Error('Usuário ou senha inválidos.')
  }

  return {
    hasAuthentication: true,
    userId: data.id,
    username: data.username,
    authenticatedAt: new Date().toISOString(),
  }
}

export async function getUserIdByUsername(username: string) {
  const { data, error } = await supabase
    .from('soc_users')
    .select('id')
    .eq('username', username)
    .maybeSingle<{ id: string }>()

  if (error) {
    throw new Error('Não foi possível identificar o usuário autenticado.')
  }

  if (!data) {
    throw new Error('O usuário autenticado não foi encontrado.')
  }

  return data.id
}

export function restoreAuthSession(): AuthSession | null {
  if (!isBrowserEnvironment()) {
    return null
  }

  return (
    readStoredSession(window.sessionStorage, sessionStorageKey) ??
    readStoredSession(window.localStorage, persistentStorageKey)
  )
}

export function persistAuthSession(
  session: AuthSession,
  rememberSession: boolean,
) {
  if (!isBrowserEnvironment()) {
    return
  }

  const targetStorage = rememberSession
    ? window.localStorage
    : window.sessionStorage
  const targetKey = rememberSession ? persistentStorageKey : sessionStorageKey
  const otherStorage = rememberSession
    ? window.sessionStorage
    : window.localStorage
  const otherKey = rememberSession ? sessionStorageKey : persistentStorageKey

  otherStorage.removeItem(otherKey)
  writeStoredSession(targetStorage, targetKey, session)
}

export function clearStoredAuthSession() {
  if (!isBrowserEnvironment()) {
    return
  }

  window.sessionStorage.removeItem(sessionStorageKey)
  window.localStorage.removeItem(persistentStorageKey)
}
