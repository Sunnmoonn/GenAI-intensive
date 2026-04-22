export type Status =
  | 'PENDING'
  | 'SENT'
  | 'ACKNOWLEDGED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'REJECTED'

export type OrgCategory = 'Banks' | 'Utilities' | 'Telecom' | 'Government' | 'Insurance'

export type Role = 'initiator' | 'org'

export interface Organisation {
  id: string
  name: string
  category: OrgCategory
}

export interface StatusEvent {
  status: Status
  timestamp: string
  note?: string
}

export interface DeathCase {
  id: string
  deceasedFirstName: string
  deceasedLastName: string
  deceasedDOB: string
  dateOfDeath: string
  initiatorName: string
  initiatorRole: string
  initiatorEmail: string
  createdAt: string
}

export interface NotificationRequest {
  id: string
  caseId: string
  orgId: string
  orgName: string
  orgCategory: OrgCategory
  status: Status
  history: StatusEvent[]
  createdAt: string
}

export interface AppState {
  role: Role | null
  deathCase: DeathCase | null
  requests: NotificationRequest[]
}
