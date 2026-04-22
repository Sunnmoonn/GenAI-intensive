'use client'
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import type { AppState, DeathCase, NotificationRequest, Status, OrgCategory, Role } from './types'
import { canTransition } from './stateMachine'
import { DEMO_CASE, DEMO_REQUESTS } from './data'

const STORAGE_KEY = 'settld_mvp_state'

const emptyState: AppState = { role: null, deathCase: null, requests: [] }

function load(): AppState {
  if (typeof window === 'undefined') return emptyState
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : emptyState
  } catch { return emptyState }
}

function persist(s: AppState) {
  if (typeof window !== 'undefined')
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

interface Ctx {
  state: AppState
  setRole: (r: Role) => void
  createCase: (d: Omit<DeathCase, 'id' | 'createdAt'>) => string
  addRequests: (orgs: { id: string; name: string; category: OrgCategory }[]) => void
  updateStatus: (reqId: string, next: Status) => void
  loadDemo: () => void
  reset: () => void
}

const StoreCtx = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<AppState>(emptyState)
  const [ready, setReady] = useState(false)

  useEffect(() => { setStateRaw(load()); setReady(true) }, [])

  const set = useCallback((next: AppState) => {
    setStateRaw(next)
    persist(next)
  }, [])

  const setRole = (role: Role) => set({ ...state, role })

  const createCase = (data: Omit<DeathCase, 'id' | 'createdAt'>): string => {
    const id = `case-${Date.now()}`
    set({ ...state, deathCase: { ...data, id, createdAt: new Date().toISOString() }, requests: [] })
    return id
  }

  const addRequests = (orgs: { id: string; name: string; category: OrgCategory }[]) => {
    if (!state.deathCase) return
    const now = new Date().toISOString()
    const fresh: NotificationRequest[] = orgs.map(o => ({
      id: `req-${o.id}-${Date.now()}`,
      caseId: state.deathCase!.id,
      orgId: o.id,
      orgName: o.name,
      orgCategory: o.category,
      status: 'SENT' as Status,
      history: [
        { status: 'PENDING' as Status, timestamp: now },
        { status: 'SENT' as Status, timestamp: now },
      ],
      createdAt: now,
    }))
    set({ ...state, requests: [...state.requests, ...fresh] })
  }

  const updateStatus = (reqId: string, next: Status) => {
    set({
      ...state,
      requests: state.requests.map(r =>
        r.id !== reqId || !canTransition(r.status, next) ? r : {
          ...r,
          status: next,
          history: [...r.history, { status: next, timestamp: new Date().toISOString() }],
        }
      ),
    })
  }

  const loadDemo = () => set({ role: 'initiator', deathCase: DEMO_CASE, requests: DEMO_REQUESTS })
  const reset = () => set(emptyState)

  if (!ready) return null

  return (
    <StoreCtx.Provider value={{ state, setRole, createCase, addRequests, updateStatus, loadDemo, reset }}>
      {children}
    </StoreCtx.Provider>
  )
}

export function useStore(): Ctx {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore outside StoreProvider')
  return ctx
}
