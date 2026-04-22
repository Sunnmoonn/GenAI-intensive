'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { StatusBadge } from '@/components/StatusBadge'
import { BottomNav } from '@/components/BottomNav'
import { ORGANISATIONS } from '@/lib/data'
import type { OrgCategory, Status } from '@/lib/types'
import { Building2, ChevronRight, Inbox } from 'lucide-react'

const ORG_ICONS: Record<OrgCategory, string> = {
  Banks: '🏦', Utilities: '⚡', Telecom: '📱',
  Government: '🏛️', Insurance: '🛡️',
}

const STATUS_FILTERS: { value: Status | 'ALL'; label: string }[] = [
  { value: 'ALL',          label: 'Все' },
  { value: 'SENT',         label: 'Новые' },
  { value: 'ACKNOWLEDGED', label: 'Получены' },
  { value: 'PROCESSING',   label: 'В работе' },
  { value: 'COMPLETED',    label: 'Готово' },
  { value: 'REJECTED',     label: 'Отклонены' },
]

export default function OrgPortalPage() {
  const { state, setRole } = useStore()
  const router = useRouter()
  const [selectedOrg, setSelectedOrg] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL')

  useEffect(() => {
    if (!state.role) { setRole('org'); }
  }, [])

  const orgIds = [...new Set(state.requests.map(r => r.orgId))]
  const availableOrgs = ORGANISATIONS.filter(o => orgIds.includes(o.id))

  const filtered = state.requests.filter(r =>
    (selectedOrg === 'ALL' || r.orgId === selectedOrg) &&
    (statusFilter === 'ALL' || r.status === statusFilter)
  )

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-[#1C3D5E] px-5 pt-14 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-4 h-4 text-white/60" strokeWidth={1.5} />
          <span className="text-xs text-white/60 font-medium uppercase tracking-wider">Организация</span>
        </div>
        <h1 className="text-[22px] font-semibold text-white">Входящие запросы</h1>
        <p className="text-sm text-white/60 mt-1">{state.requests.length} уведомлений</p>
      </div>

      {/* Org selector */}
      {availableOrgs.length > 0 && (
        <div className="px-4 pt-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedOrg('ALL')}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedOrg === 'ALL' ? 'bg-[#1C3D5E] text-white' : 'bg-white text-[#64748B] border border-[#E2E8F0]'
              }`}
            >
              Все ({state.requests.length})
            </button>
            {availableOrgs.map(org => {
              const count = state.requests.filter(r => r.orgId === org.id).length
              return (
                <button
                  key={org.id}
                  onClick={() => setSelectedOrg(org.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedOrg === org.id ? 'bg-[#1C3D5E] text-white' : 'bg-white text-[#64748B] border border-[#E2E8F0]'
                  }`}
                >
                  <span>{ORG_ICONS[org.category]}</span>
                  <span>{org.name}</span>
                  <span className="opacity-70">({count})</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Status filter */}
      <div className="px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                statusFilter === value
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-[#64748B] border border-[#E2E8F0]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Request list */}
      <div className="px-4 py-2 space-y-2">
        {filtered.length === 0 ? (
          <EmptyInbox />
        ) : (
          filtered.map(req => (
            <Link key={req.id} href={`/task/${req.id}`}>
              <div className="bg-white rounded-2xl p-4 shadow-card border border-[#E2E8F0] flex items-center gap-3 active:scale-[0.99] transition-transform">
                <span className="text-2xl flex-shrink-0">{ORG_ICONS[req.orgCategory as OrgCategory] ?? '🏢'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-medium text-[#0F172A] truncate">{req.orgName}</p>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    Кейс: {state.deathCase ? `${state.deathCase.deceasedFirstName} ${state.deathCase.deceasedLastName}` : req.caseId}
                  </p>
                  <p className="text-xs text-[#CBD5E1] mt-0.5">
                    {new Date(req.history[req.history.length - 1].timestamp).toLocaleString('ru-RU', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#CBD5E1] flex-shrink-0" />
              </div>
            </Link>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}

function EmptyInbox() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-[#94A3B8]" strokeWidth={1.2} />
      </div>
      <p className="text-[#0F172A] font-medium">Нет запросов</p>
      <p className="text-sm text-[#94A3B8] mt-1">Здесь появятся входящие уведомления</p>
    </div>
  )
}
