'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { StatusBadge } from '@/components/StatusBadge'
import { BottomNav } from '@/components/BottomNav'
import { STATUS_META } from '@/lib/stateMachine'
import type { Status } from '@/lib/types'
import {
  Plus, ChevronRight, HeartHandshake, CheckCircle2,
  Clock, AlertCircle, CalendarDays,
} from 'lucide-react'

const ORG_ICONS: Record<string, string> = {
  Banks: '🏦', Utilities: '⚡', Telecom: '📱',
  Government: '🏛️', Insurance: '🛡️',
}

const STATUS_ORDER: Status[] = ['PROCESSING', 'ACKNOWLEDGED', 'SENT', 'PENDING', 'COMPLETED', 'REJECTED']

export default function DashboardPage() {
  const { state } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!state.role) router.replace('/')
  }, [state.role, router])

  const { deathCase: dc, requests } = state

  if (!dc) return <EmptyState />

  const total      = requests.length
  const completed  = requests.filter(r => r.status === 'COMPLETED').length
  const active     = requests.filter(r => ['SENT','ACKNOWLEDGED','PROCESSING'].includes(r.status)).length
  const pending    = requests.filter(r => r.status === 'PENDING').length
  const rejected   = requests.filter(r => r.status === 'REJECTED').length
  const progress   = total > 0 ? Math.round((completed / total) * 100) : 0

  const sorted = [...requests].sort((a, b) =>
    STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
  )

  const dod = new Date(dc.dateOfDeath).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-[#1C3D5E] px-5 pt-14 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <HeartHandshake className="w-4 h-4 text-white/60" strokeWidth={1.5} />
          <span className="text-xs text-white/60 font-medium uppercase tracking-wider">Кейс</span>
        </div>
        <h1 className="text-[22px] font-semibold text-white leading-tight">
          {dc.deceasedFirstName} {dc.deceasedLastName}
        </h1>
        <div className="flex items-center gap-1.5 mt-1">
          <CalendarDays className="w-3.5 h-3.5 text-white/50" />
          <p className="text-sm text-white/60">{dod}</p>
        </div>
      </div>

      {/* Progress Hero */}
      <div className="mx-4 -mt-4">
        <div className="bg-white rounded-2xl p-5 shadow-card-md border border-white">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider mb-1">Прогресс</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[32px] font-bold text-[#0F172A] leading-none">{completed}</span>
                <span className="text-lg text-[#94A3B8] font-medium">/ {total}</span>
              </div>
              <p className="text-sm text-[#64748B] mt-0.5">организаций уведомлено</p>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#EBF2FA" strokeWidth="6" />
                <circle
                  cx="32" cy="32" r="26"
                  fill="none"
                  stroke="#1C3D5E"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-[#1C3D5E]">
                {progress}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-[#1C3D5E] rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Готово',    value: completed, icon: CheckCircle2, color: 'text-emerald-600' },
              { label: 'В работе',  value: active,    icon: Clock,        color: 'text-blue-600' },
              { label: 'Ожидает',   value: pending,   icon: AlertCircle,  color: 'text-amber-600' },
              { label: 'Отклон.',   value: rejected,  icon: AlertCircle,  color: 'text-red-500' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-[#F8FAFC] rounded-xl p-2.5 text-center">
                <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} strokeWidth={2} />
                <p className="text-base font-bold text-[#0F172A]">{value}</p>
                <p className="text-[10px] text-[#94A3B8] leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Requests list */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#0F172A]">
            Организации <span className="text-[#94A3B8] font-normal ml-1">{total}</span>
          </h2>
          <Link href="/orgs" className="text-sm text-[#1C3D5E] font-medium flex items-center gap-1">
            <Plus className="w-4 h-4" /> Добавить
          </Link>
        </div>

        <div className="space-y-2">
          {sorted.map(req => {
            const meta = STATUS_META[req.status]
            return (
              <Link key={req.id} href={`/task/${req.id}`}>
                <div className={`bg-white rounded-2xl border-l-4 ${meta.border} shadow-card p-4 flex items-center gap-3 active:scale-[0.99] transition-transform`}>
                  <span className="text-2xl flex-shrink-0" role="img" aria-label={req.orgCategory}>
                    {ORG_ICONS[req.orgCategory] ?? '🏢'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#0F172A] truncate">{req.orgName}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{req.orgCategory}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={req.status} />
                    <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

function EmptyState() {
  const router = useRouter()
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8 text-center pb-24">
      <div className="w-20 h-20 bg-[#EBF2FA] rounded-3xl flex items-center justify-center mb-6">
        <HeartHandshake className="w-10 h-10 text-[#1C3D5E]" strokeWidth={1.2} />
      </div>
      <h2 className="text-xl font-semibold text-[#0F172A] mb-2">Кейс не создан</h2>
      <p className="text-[#64748B] text-sm leading-relaxed mb-8">
        Создайте кейс, чтобы начать уведомлять организации о смерти близкого
      </p>
      <button
        onClick={() => router.push('/wizard')}
        className="bg-[#1C3D5E] text-white font-semibold px-8 py-3.5 rounded-2xl w-full max-w-[260px] shadow-card-md active:scale-[0.98] transition-transform"
      >
        Создать кейс
      </button>
      <BottomNav />
    </div>
  )
}
