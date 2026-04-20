import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextValue {
  session: Session | null
  user: User | null
  orgId: string | null
  role: string | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => subscription.unsubscribe()
  }, [])

  const orgId = (session?.user?.user_metadata?.org_id as string | undefined)
    ?? (session?.access_token
      ? parseJwtClaim(session.access_token, 'org_id')
      : null)

  const role = (session?.access_token
      ? parseJwtClaim(session.access_token, 'user_role')
      : null)
    ?? (session?.user?.user_metadata?.role as string | undefined)
    ?? null

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, orgId, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

function parseJwtClaim(token: string, claim: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload[claim] ?? null
  } catch {
    return null
  }
}
