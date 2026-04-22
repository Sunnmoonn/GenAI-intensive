'use client'
import { STATUS_META } from '@/lib/stateMachine'
import type { Status } from '@/lib/types'

export function StatusBadge({ status, size = 'sm' }: { status: Status; size?: 'sm' | 'md' }) {
  const m = STATUS_META[status]
  const padding = size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${m.bg} ${m.color} ${m.border} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}
