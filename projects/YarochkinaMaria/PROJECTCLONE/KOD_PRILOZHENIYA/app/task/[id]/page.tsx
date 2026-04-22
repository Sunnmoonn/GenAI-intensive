'use client'
import { useParams, useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { StatusBadge } from '@/components/StatusBadge'
import { STATUS_META, getNextTransitions } from '@/lib/stateMachine'
import type { Status } from '@/lib/types'
import { ArrowLeft, Clock } from 'lucide-react'

const ORG_ICONS: Record<string, string> = {
  Banks: '🏦', Utilities: '⚡', Telecom: '📱',
  Government: '🏛️', Insurance: '🛡️',
}

const TRANSITION_LABELS: Partial<Record<Status, string>> = {
  ACKNOWLEDGED: 'Подтвердить получение',
  PROCESSING: 'Взять в обработку',
  COMPLETED: 'Отметить завершённым',
  REJECTED: 'Отклонить',
  SENT: 'Отправить',
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { state, updateStatus } = useStore()
  const router = useRouter()

  const req = state.requests.find(r => r.id === id)
  if (!req) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-[#94A3B8]">Запрос не найден</p>
      </div>
    )
  }

  const transitions = getNextTransitions(req.status)
  const isOrg = state.role === 'org'

  return (
    <div className="min-h-dvh flex flex-col bg-[#F5F5F3]">
      {/* Header */}
      <div className="bg-white px-4 pt-14 pb-5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-[#F1F5F9] flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-[#64748B]" />
          </button>
          <p className="text-xs text-[#94A3B8] uppercase tracking-wider font-medium">Детали запроса</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-4xl">{ORG_ICONS[req.orgCategory] ?? '🏢'}</span>
          <div>
            <h1 className="text-xl font-semibold text-[#0F172A]">{req.orgName}</h1>
            <p className="text-sm text-[#64748B]">{req.orgCategory}</p>
          </div>
        </div>

        <div className="mt-4">
          <StatusBadge status={req.status} size="md" />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 py-5 space-y-4 overflow-y-auto">
        {/* Status timeline */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-[#E2E8F0]">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-4">
            История статусов
          </p>
          <div className="space-y-0">
            {[...req.history].reverse().map((ev, i) => {
              const m = STATUS_META[ev.status]
              const isLast = i === req.history.length - 1
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${i === 0 ? m.dot : 'bg-[#E2E8F0]'}`} />
                    {!isLast && <div className="w-px flex-1 bg-[#E2E8F0] my-1" />}
                  </div>
                  <div className={`pb-4 flex-1 ${isLast ? '' : ''}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-medium ${i === 0 ? m.color : 'text-[#64748B]'}`}>
                        {m.label}
                      </span>
                      <span className="text-xs text-[#94A3B8] flex-shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(ev.timestamp).toLocaleString('ru-RU', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {ev.note && (
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{ev.note}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Meta */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-[#E2E8F0]">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Информация</p>
          <div className="space-y-2.5">
            {[
              { label: 'ID запроса', value: req.id.slice(0, 20) + '...' },
              { label: 'Создан', value: new Date(req.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) },
              { label: 'Категория', value: req.orgCategory },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-sm text-[#64748B]">{label}</span>
                <span className="text-sm font-medium text-[#0F172A] text-right truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions for org role */}
        {isOrg && transitions.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-card border border-[#E2E8F0]">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Действия</p>
            <div className="space-y-2">
              {transitions.map(next => {
                const isDestructive = next === 'REJECTED'
                return (
                  <button
                    key={next}
                    onClick={() => { updateStatus(req.id, next); router.back() }}
                    className={`w-full py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98] ${
                      isDestructive
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-[#1C3D5E] text-white'
                    }`}
                  >
                    {TRANSITION_LABELS[next] ?? next}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
