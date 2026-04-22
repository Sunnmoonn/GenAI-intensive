export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled'
export type TaskStatus = 'pending' | 'in_progress' | 'completed'
export type UserRole = 'admin' | 'researcher'

export interface Profile {
  id: string
  org_id: string
  full_name: string | null
  role: UserRole
  email: string
}

/** @deprecated use Profile */
export type User = Profile & { name: string }

export interface Project {
  id: string
  org_id: string
  responsible_id: string | null
  name: string
  description: string | null
  status: ProjectStatus
  tags: string[]
  start_date: string | null
  deadline: string | null
  deleted_at: string | null
  // joined from project_members
  member_ids?: string[]
}

export interface Task {
  id: string
  org_id: string
  project_id: string | null
  responsible_id: string | null
  name: string
  status: TaskStatus
  progress: number
  start_date: string | null
  end_date: string | null
  deleted_at: string | null
}

/** @deprecated use Task */
export type GanttTask = Task & {
  projectId: string
  startDate: string
  endDate: string
  responsible: string
}

export interface Reagent {
  id: string
  org_id: string
  project_id: string | null
  name: string
  category: string | null
  cas_number: string | null
  formula: string | null
  concentration: string | null
  storage: string | null
  stock: number
  unit: string | null
  min_stock: number
  expiry_date: string | null
  location: string | null
  supplier: string | null
  deleted_at: string | null
}

export interface Consumable {
  id: string
  org_id: string
  name: string
  category: string | null
  stock: number
  unit: string | null
  min_stock: number
  location: string | null
  supplier: string | null
  comment: string | null
  deleted_at: string | null
}
