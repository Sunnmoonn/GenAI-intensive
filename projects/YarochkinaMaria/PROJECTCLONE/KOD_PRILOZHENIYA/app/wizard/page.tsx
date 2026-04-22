'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { ArrowLeft, User, Calendar, Mail, ChevronRight, Check } from 'lucide-react'

type Step = 1 | 2 | 3

interface FormData {
  deceasedFirstName: string
  deceasedLastName: string
  deceasedDOB: string
  dateOfDeath: string
  initiatorName: string
  initiatorRole: string
  initiatorEmail: string
}

const ROLES = ['супруг/супруга', 'сын/дочь', 'брат/сестра', 'исполнитель завещания', 'другое']

export default function WizardPage() {
  const { createCase } = useStore()
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>({
    deceasedFirstName: '',
    deceasedLastName: '',
    deceasedDOB: '',
    dateOfDeath: '',
    initiatorName: '',
    initiatorRole: 'сын/дочь',
    initiatorEmail: '',
  })

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }))

  function next() {
    if (step < 3) setStep(s => (s + 1) as Step)
    else {
      createCase(form)
      router.push('/orgs')
    }
  }

  const canProceed =
    step === 1 ? !!(form.deceasedFirstName && form.deceasedLastName && form.dateOfDeath) :
    step === 2 ? !!(form.initiatorName && form.initiatorEmail) :
    true

  return (
    <div className="min-h-dvh flex flex-col bg-[#F5F5F3]">
      {/* Header */}
      <div className="bg-white px-4 pt-14 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => step > 1 ? setStep(s => (s - 1) as Step) : router.back()}
            className="w-9 h-9 rounded-xl bg-[#F1F5F9] flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-[#64748B]" />
          </button>
          <div>
            <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wider">Шаг {step} из 3</p>
            <h1 className="text-lg font-semibold text-[#0F172A]">
              {step === 1 ? 'Данные умершего' : step === 2 ? 'Ваши данные' : 'Подтверждение'}
            </h1>
          </div>
        </div>

        {/* Step progress */}
        <div className="flex gap-1.5">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-[#1C3D5E]' : 'bg-[#E2E8F0]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form body */}
      <div className="flex-1 px-5 py-6 space-y-4 overflow-y-auto">
        {step === 1 && (
          <>
            <Field label="Имя" value={form.deceasedFirstName} onChange={v => set('deceasedFirstName', v)} placeholder="Иван" />
            <Field label="Фамилия" value={form.deceasedLastName} onChange={v => set('deceasedLastName', v)} placeholder="Петров" />
            <Field label="Дата рождения" value={form.deceasedDOB} onChange={v => set('deceasedDOB', v)} type="date" />
            <Field label="Дата смерти *" value={form.dateOfDeath} onChange={v => set('dateOfDeath', v)} type="date" required />
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Ваше имя" value={form.initiatorName} onChange={v => set('initiatorName', v)} placeholder="Мария Иванова" />
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Ваши отношения с умершим</label>
              <div className="space-y-2">
                {ROLES.map(r => (
                  <button
                    key={r}
                    onClick={() => set('initiatorRole', r)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      form.initiatorRole === r
                        ? 'bg-[#EBF2FA] border-[#1C3D5E] text-[#1C3D5E]'
                        : 'bg-white border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  >
                    {r}
                    {form.initiatorRole === r && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Email" value={form.initiatorEmail} onChange={v => set('initiatorEmail', v)} type="email" placeholder="email@example.com" />
          </>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <ReviewCard
              title="Умерший"
              items={[
                { label: 'Имя', value: `${form.deceasedFirstName} ${form.deceasedLastName}` },
                { label: 'Дата рождения', value: form.deceasedDOB ? new Date(form.deceasedDOB).toLocaleDateString('ru-RU') : '—' },
                { label: 'Дата смерти', value: new Date(form.dateOfDeath).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) },
              ]}
            />
            <ReviewCard
              title="Инициатор"
              items={[
                { label: 'Имя', value: form.initiatorName },
                { label: 'Роль', value: form.initiatorRole },
                { label: 'Email', value: form.initiatorEmail },
              ]}
            />
            <div className="bg-[#EBF2FA] rounded-2xl p-4 text-sm text-[#1C3D5E]">
              <p className="font-medium mb-1">Что будет дальше?</p>
              <p className="text-[#64748B]">Вы выберете организации для уведомления. Система создаст запрос для каждой из них.</p>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 py-4 bg-white border-t border-[#E2E8F0] safe-bottom">
        <button
          onClick={next}
          disabled={!canProceed}
          className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
            canProceed
              ? 'bg-[#1C3D5E] text-white shadow-card-md active:scale-[0.98]'
              : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
          }`}
        >
          {step < 3 ? (
            <><span>Далее</span><ChevronRight className="w-5 h-5" /></>
          ) : (
            <><Check className="w-5 h-5" /><span>Создать кейс</span></>
          )}
        </button>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0F172A] mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3.5 text-base text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1C3D5E] focus:ring-2 focus:ring-[#1C3D5E]/10 transition-all"
      />
    </div>
  )
}

function ReviewCard({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-card border border-[#E2E8F0]">
      <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">{title}</p>
      <div className="space-y-2.5">
        {items.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-start gap-4">
            <span className="text-sm text-[#64748B]">{label}</span>
            <span className="text-sm font-medium text-[#0F172A] text-right">{value || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
