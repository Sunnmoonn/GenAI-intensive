import { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'
import type { Profile, Project, Task, Reagent, Consumable } from './types'

// ── helpers ──────────────────────────────────────────────────────────────────

function useTable<T>(
  table: string,
  extraFilter?: (q: ReturnType<typeof supabase.from>) => ReturnType<typeof supabase.from>
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    let q = supabase.from(table).select('*')
    if (extraFilter) q = extraFilter(q) as typeof q
    const { data: rows, error: err } = await q
    if (err) setError(err.message)
    else setData((rows ?? []) as T[])
    setLoading(false)
  }, [table]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load() }, [load])

  return { data, loading, error, reload: load }
}

// ── profiles ─────────────────────────────────────────────────────────────────

export function useUsers() {
  const { data, loading, error, reload } = useTable<Profile>('profiles')

  async function update(id: string, changes: Partial<Profile>) {
    const { error: err } = await supabase.from('profiles').update(changes).eq('id', id)
    if (err) throw new Error(err.message)
    await reload()
  }

  return { users: data, loading, error, update, reload }
}

// ── projects ─────────────────────────────────────────────────────────────────

export function useProjects() {
  const { data, loading, error, reload } = useTable<Project>('projects')

  async function create(input: Omit<Project, 'id' | 'org_id' | 'deleted_at' | 'member_ids'>) {
    const { data: row, error: err } = await supabase
      .from('projects')
      .insert(input)
      .select()
      .single()
    if (err) throw new Error(err.message)
    await reload()
    return row as Project
  }

  async function update(id: string, changes: Partial<Project>) {
    const { error: err } = await supabase.from('projects').update(changes).eq('id', id)
    if (err) throw new Error(err.message)
    await reload()
  }

  async function remove(id: string) {
    const { error: err } = await supabase
      .from('projects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (err) throw new Error(err.message)
    await reload()
  }

  async function setMembers(projectId: string, userIds: string[]) {
    await supabase.from('project_members').delete().eq('project_id', projectId)
    if (userIds.length > 0) {
      const rows = userIds.map(user_id => ({ project_id: projectId, user_id }))
      const { error: err } = await supabase.from('project_members').insert(rows)
      if (err) throw new Error(err.message)
    }
    await reload()
  }

  return { projects: data, loading, error, create, update, remove, setMembers, reload }
}

// ── tasks ─────────────────────────────────────────────────────────────────────

export function useTasks(projectId?: string) {
  const filter = projectId
    ? (q: ReturnType<typeof supabase.from>) => q.eq('project_id', projectId)
    : undefined

  const { data, loading, error, reload } = useTable<Task>('tasks', filter)

  async function create(input: Omit<Task, 'id' | 'org_id' | 'deleted_at'>) {
    const { data: row, error: err } = await supabase
      .from('tasks')
      .insert(input)
      .select()
      .single()
    if (err) throw new Error(err.message)
    await reload()
    return row as Task
  }

  async function update(id: string, changes: Partial<Task>) {
    const { error: err } = await supabase.from('tasks').update(changes).eq('id', id)
    if (err) throw new Error(err.message)
    await reload()
  }

  async function remove(id: string) {
    const { error: err } = await supabase
      .from('tasks')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (err) throw new Error(err.message)
    await reload()
  }

  return { tasks: data, loading, error, create, update, remove, reload }
}

// ── reagents ──────────────────────────────────────────────────────────────────

export function useReagents(projectId?: string) {
  const filter = projectId
    ? (q: ReturnType<typeof supabase.from>) => q.eq('project_id', projectId)
    : undefined

  const { data, loading, error, reload } = useTable<Reagent>('reagents', filter)

  async function create(input: Omit<Reagent, 'id' | 'org_id' | 'deleted_at'>) {
    const { data: row, error: err } = await supabase
      .from('reagents')
      .insert(input)
      .select()
      .single()
    if (err) throw new Error(err.message)
    await reload()
    return row as Reagent
  }

  async function update(id: string, changes: Partial<Reagent>) {
    const { error: err } = await supabase.from('reagents').update(changes).eq('id', id)
    if (err) throw new Error(err.message)
    await reload()
  }

  async function remove(id: string) {
    const { error: err } = await supabase
      .from('reagents')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (err) throw new Error(err.message)
    await reload()
  }

  return { reagents: data, loading, error, create, update, remove, reload }
}

// ── consumables ───────────────────────────────────────────────────────────────

export function useConsumables() {
  const { data, loading, error, reload } = useTable<Consumable>('consumables')

  async function create(input: Omit<Consumable, 'id' | 'org_id' | 'deleted_at'>) {
    const { data: row, error: err } = await supabase
      .from('consumables')
      .insert(input)
      .select()
      .single()
    if (err) throw new Error(err.message)
    await reload()
    return row as Consumable
  }

  async function update(id: string, changes: Partial<Consumable>) {
    const { error: err } = await supabase.from('consumables').update(changes).eq('id', id)
    if (err) throw new Error(err.message)
    await reload()
  }

  async function remove(id: string) {
    const { error: err } = await supabase
      .from('consumables')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (err) throw new Error(err.message)
    await reload()
  }

  return { consumables: data, loading, error, create, update, remove, reload }
}
