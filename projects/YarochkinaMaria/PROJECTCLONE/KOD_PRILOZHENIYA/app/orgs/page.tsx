'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { ORGANISATIONS } from '@/lib/data'
import type { OrgCategory } from '@/lib/types'
import { ArrowLeft, Check, Search } from 'lucide-react'

const CATEGORIES: OrgCategory[] = ['Banks', 'Utilities', 'Telecom', 'Government', 'Insurance']
const CAT_RU: Record<OrgCategory, string> = {
  Banks: 'Банки', Utilities: 'Коммунальные', Telecom: 'Телеком',
  Government: 'Государство', Insurance: 'Страхование',
}
const ORG_ICONS: Record<OrgCategory, string> = {
  Banks: '🏦', Utilities: '⚡', Telecom: '📱', Government: '🏛️', Insurance: '🛡️',
}

export default function OrgsPage() {
  const { state, addRequests } = useStore()
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState<OrgCategory | 'All'>('All')
  const [query, setQuery] = useState('')

  const existingOrgIds = new Set(state.requests.map(r => r.orgId))

  const filtered = ORGANISATIONS.filter(o =>
    !existingOrgIds.has(o.id) &&
    (activeCategory === 'All' || o.category === activeCategory) &&
    (query === '' || o.name.toLowerCase().includes(query.toLowerCase()))
  )

  const toggle = (id: string) =>
    setSelected(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  function submit() {
    const orgs = ORGANISATIONS.filter(o => selected.has(o.id))
    addRequests(orgs)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-dvh flex flex-col bg-[#F5F5F3]">
      {/* Header */}
      <div className="bg-white px-4 pt-14 pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-[#F1F5F9] flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-[#64748B]" />
          </button>
          <div>
            <p className="text-xs text-[#94A3B8] uppercase tracking-wider font-medium">Шаг 2</p>
            <h1 className="text-lg font-semibold text-[#0F172A]">Выбор организаций</h1>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск организации..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1C3D5E]"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {(['All', ...CATEGORIES] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#1C3D5E] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B]'
              }`}
            >
              {cat === 'All' ? 'Все' : CAT_RU[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#94A3B8] text-sm">Организации не найдены</p>
          </div>
        ) : (
          filtered.map(org => {
            const isSelected = selected.has(org.id)
            return (
              <button
                key={org.id}
                onClick={() => toggle(org.id)}
                className={`w-full bg-white rounded-2xl p-4 shadow-card border flex items-center gap-3 text-left transition-all active:scale-[0.98] ${
                  isSelected ? 'border-[#1C3D5E] bg-[#EBF2FA]/50' : 'border-[#E2E8F0]'
                }`}
              >
                <span className="text-2xl flex-shrink-0">{ORG_ICONS[org.category]}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#0F172A] truncate">{org.name}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{CAT_RU[org.category]}</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                  isSelected ? 'bg-[#1C3D5E] border-[#1C3D5E]' : 'border-[#CBD5E1]'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />}
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* CTA */}
      <div className="px-5 py-4 bg-white border-t border-[#E2E8F0] safe-bottom">
        <button
          onClick={submit}
          disabled={selected.size === 0}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${
            selected.size > 0
              ? 'bg-[#1C3D5E] text-white shadow-card-md active:scale-[0.98]'
              : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
          }`}
        >
          {selected.size > 0 ? `Уведомить ${selected.size} ${plural(selected.size)}` : 'Выберите организации'}
        </button>
      </div>
    </div>
  )
}

function plural(n: number) {
  if (n === 1) return 'организацию'
  if (n >= 2 && n <= 4) return 'организации'
  return 'организаций'
}
