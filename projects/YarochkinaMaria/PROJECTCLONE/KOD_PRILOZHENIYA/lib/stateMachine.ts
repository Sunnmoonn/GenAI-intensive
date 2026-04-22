import type { Status } from './types'

export const VALID_TRANSITIONS: Record<Status, Status[]> = {
  PENDING: ['SENT'],
  SENT: ['ACKNOWLEDGED', 'REJECTED'],
  ACKNOWLEDGED: ['PROCESSING', 'REJECTED'],
  PROCESSING: ['COMPLETED', 'REJECTED'],
  COMPLETED: [],
  REJECTED: [],
}

export function canTransition(from: Status, to: Status): boolean {
  return VALID_TRANSITIONS[from].includes(to)
}

export function getNextTransitions(current: Status): Status[] {
  return VALID_TRANSITIONS[current]
}

export const STATUS_META: Record<Status, { label: string; color: string; bg: string; border: string; dot: string }> = {
  PENDING: {
    label: 'Ожидает',
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    dot: 'bg-amber-400',
  },
  SENT: {
    label: 'Отправлено',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    dot: 'bg-blue-500',
  },
  ACKNOWLEDGED: {
    label: 'Получено',
    color: 'text-violet-800',
    bg: 'bg-violet-50',
    border: 'border-violet-300',
    dot: 'bg-violet-500',
  },
  PROCESSING: {
    label: 'В обработке',
    color: 'text-orange-800',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    dot: 'bg-orange-500',
  },
  COMPLETED: {
    label: 'Завершено',
    color: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    dot: 'bg-emerald-500',
  },
  REJECTED: {
    label: 'Отклонено',
    color: 'text-red-800',
    bg: 'bg-red-50',
    border: 'border-red-300',
    dot: 'bg-red-500',
  },
}
