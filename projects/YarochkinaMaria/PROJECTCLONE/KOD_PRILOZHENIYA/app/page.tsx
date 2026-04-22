'use client'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { Users, Building2, ArrowRight, HeartHandshake, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const { setRole, loadDemo } = useStore()
  const router = useRouter()

  function go(role: 'initiator' | 'org') {
    setRole(role)
    router.push(role === 'initiator' ? '/dashboard' : '/org')
  }

  function goDemo() {
    loadDemo()
    router.push('/dashboard')
  }

  return (
    <div className="min-h-dvh flex flex-col px-5 bg-[#F5F5F3]">
      {/* Hero area */}
      <div className="pt-16 pb-10">
        <div className="w-14 h-14 bg-[#1C3D5E] rounded-[18px] flex items-center justify-center mb-6 shadow-card-md">
          <HeartHandshake className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-[28px] font-semibold text-[#0F172A] tracking-tight leading-tight">
          Settld
        </h1>
        <p className="text-base text-[#64748B] mt-2 leading-relaxed">
          Уведомите все организации о смерти близкого — один раз и без лишних звонков
        </p>
      </div>

      {/* Role cards */}
      <div className="space-y-3 mb-6">
        <button
          onClick={() => go('initiator')}
          className="w-full bg-white rounded-2xl p-5 shadow-card border border-[#E2E8F0] flex items-center gap-4 text-left transition-all active:scale-[0.98] hover:border-[#1C3D5E]/20 hover:shadow-card-md group"
        >
          <div className="w-12 h-12 bg-[#EBF2FA] rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-[#1C3D5E]" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#0F172A]">Я — родственник</p>
            <p className="text-sm text-[#64748B] mt-0.5">Уведомить организации о смерти близкого</p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#94A3B8] group-hover:text-[#1C3D5E] transition-colors flex-shrink-0" />
        </button>

        <button
          onClick={() => go('org')}
          className="w-full bg-white rounded-2xl p-5 shadow-card border border-[#E2E8F0] flex items-center gap-4 text-left transition-all active:scale-[0.98] hover:border-slate-300 hover:shadow-card-md group"
        >
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-slate-500" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#0F172A]">Я — организация</p>
            <p className="text-sm text-[#64748B] mt-0.5">Обработать входящие уведомления</p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#94A3B8] group-hover:text-slate-500 transition-colors flex-shrink-0" />
        </button>
      </div>

      {/* Demo button */}
      <button
        onClick={goDemo}
        className="w-full bg-[#EBF2FA] rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-[0.98] hover:bg-[#C8DDEF]/50"
      >
        <Sparkles className="w-5 h-5 text-[#1C3D5E] flex-shrink-0" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-medium text-[#1C3D5E]">Открыть демо-версию</p>
          <p className="text-xs text-[#64748B]">Готовый кейс с 8 организациями</p>
        </div>
      </button>

      <p className="mt-auto pb-8 pt-6 text-center text-xs text-[#94A3B8]">
        Учебный MVP · МФТИ GenAI Intensive
      </p>
    </div>
  )
}
