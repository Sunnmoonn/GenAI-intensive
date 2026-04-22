import React, { useState } from 'react'
import { useTasks, useProjects, useUsers } from '../store'
import type { Task, TaskStatus } from '../types'
import { Plus, X, ChevronLeft, ChevronRight, CheckCircle2, Loader2, Clock } from 'lucide-react'

const STATUS_CFG: Record<TaskStatus, { label: string; bar: string; badge: string; icon: React.ReactNode }> = {
  pending:     { label: 'Ожидает',   bar: 'bg-neutral-border', badge: 'bg-neutral-secondary text-neutral-sub', icon: <Clock size={12} className="text-neutral-muted" /> },
  in_progress: { label: 'В работе',  bar: 'bg-primary',        badge: 'bg-primary-light text-primary',        icon: <Loader2 size={12} className="text-primary" /> },
  completed:   { label: 'Завершена', bar: 'bg-success',        badge: 'bg-green-100 text-green-700',          icon: <CheckCircle2 size={12} className="text-success" /> },
}

const EMPTY_TASK = {
  project_id: null as string | null,
  name: '',
  start_date: new Date().toISOString().slice(0, 10),
  end_date: null as string | null,
  responsible_id: null as string | null,
  status: 'pending' as TaskStatus,
  progress: 0,
}

function addDays(date: Date, days: number) {
  const d = new Date(date); d.setDate(d.getDate() + days); return d
}
function formatDate(d: Date) {
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export default function Gantt() {
  const { tasks, create, update, remove } = useTasks()
  const { projects } = useProjects()
  const { users } = useUsers()
  const [modal, setModal] = useState<{ open: boolean; data: typeof EMPTY_TASK; editId?: string }>({ open: false, data: EMPTY_TASK })
  const [filterProject, setFilterProject] = useState('all')
  const [viewStart, setViewStart] = useState(() => {
    const d = new Date(); d.setDate(1); return d
  })
  const DAYS = 60

  const filteredTasks = tasks.filter(t => filterProject === 'all' || t.project_id === filterProject)
  const grouped = projects.map(p => ({
    project: p,
    tasks: filteredTasks.filter(t => t.project_id === p.id),
  })).filter(g => g.tasks.length > 0 || filterProject === g.project.id)

  const viewEnd = addDays(viewStart, DAYS)

  function openCreate(projectId: string | null = null) {
    setModal({ open: true, data: { ...EMPTY_TASK, project_id: projectId } })
  }
  function openEdit(t: Task) {
    setModal({ open: true, data: {
      project_id: t.project_id, name: t.name,
      start_date: t.start_date ?? EMPTY_TASK.start_date,
      end_date: t.end_date, responsible_id: t.responsible_id,
      status: t.status, progress: t.progress,
    }, editId: t.id })
  }
  function closeModal() { setModal({ open: false, data: EMPTY_TASK }) }

  async function save() {
    if (!modal.data.name.trim() || !modal.data.project_id) return
    if (modal.editId) {
      await update(modal.editId, modal.data)
    } else {
      await create(modal.data)
    }
    closeModal()
  }

  function setField<K extends keyof typeof EMPTY_TASK>(k: K, v: typeof EMPTY_TASK[K]) {
    setModal(m => ({ ...m, data: { ...m.data, [k]: v } }))
  }

  const headerDays: Date[] = []
  for (let i = 0; i < DAYS; i++) headerDays.push(addDays(viewStart, i))

  function getBarStyle(startDate: string | null, endDate: string | null) {
    if (!startDate || !endDate) return null
    const start = new Date(startDate)
    const end = new Date(endDate)
    const vsMs = viewStart.getTime()
    const veMs = viewEnd.getTime()
    const rangeMs = veMs - vsMs
    const left = Math.max(0, (start.getTime() - vsMs) / rangeMs) * 100
    const right = Math.min(100, (end.getTime() - vsMs) / rangeMs) * 100
    if (right < 0 || left > 100) return null
    return { left: `${left}%`, width: `${Math.max(right - left, 0.5)}%` }
  }

  const todayPct = ((Date.now() - viewStart.getTime()) / (viewEnd.getTime() - viewStart.getTime())) * 100

  const weeks: { label: string; left: number; width: number }[] = []
  let wStart = new Date(viewStart)
  while (wStart < viewEnd) {
    const wEnd = addDays(wStart, 7)
    const left = ((wStart.getTime() - viewStart.getTime()) / (viewEnd.getTime() - viewStart.getTime())) * 100
    const width = (Math.min(wEnd.getTime(), viewEnd.getTime()) - wStart.getTime()) / (viewEnd.getTime() - viewStart.getTime()) * 100
    weeks.push({ label: formatDate(wStart), left, width })
    wStart = wEnd
  }

  function responsibleName(id: string | null | undefined) {
    if (!id) return ''
    const u = users.find(x => x.id === id)
    return u?.full_name ?? u?.email ?? ''
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <select className="input flex-1 min-w-0" value={filterProject} onChange={e => setFilterProject(e.target.value)}>
            <option value="all">Все проекты</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="btn-primary flex items-center gap-1.5 shrink-0" onClick={() => openCreate()}>
            <Plus size={15} /> <span className="hidden sm:inline">Добавить задачу</span>
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="btn-ghost p-2" onClick={() => setViewStart(d => addDays(d, -14))}><ChevronLeft size={16} /></button>
          <span className="text-xs text-neutral-sub font-medium flex-1 text-center">
            {formatDate(viewStart)} — {formatDate(viewEnd)}
          </span>
          <button className="btn-ghost p-2" onClick={() => setViewStart(d => addDays(d, 14))}><ChevronRight size={16} /></button>
          <button className="btn-ghost text-xs px-3 shrink-0" onClick={() => { const d = new Date(); d.setDate(d.getDate() - 7); setViewStart(d) }}>
            Сегодня
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex">
          <div className="w-36 sm:w-48 md:w-72 shrink-0 border-r border-neutral-border">
            <div className="h-14 border-b border-neutral-border bg-neutral-secondary flex items-end px-2 sm:px-4 pb-2">
              <span className="text-xs font-semibold text-neutral-sub">Задача</span>
            </div>
            {grouped.length === 0 ? (
              <div className="p-4 text-xs text-neutral-muted text-center">Задачи не найдены</div>
            ) : grouped.map(({ project: p, tasks: pts }) => (
              <div key={p.id}>
                <div className="h-9 flex items-center justify-between px-2 sm:px-4 bg-primary-light/50 border-b border-neutral-border">
                  <span className="text-xs font-semibold text-primary truncate">{p.name}</span>
                  <button onClick={() => openCreate(p.id)} className="text-primary hover:bg-primary-light rounded p-0.5 transition-colors shrink-0 ml-1">
                    <Plus size={12} />
                  </button>
                </div>
                {pts.map(t => (
                  <div key={t.id} className="relative h-16 flex items-center gap-1 px-2 sm:px-4 border-b border-neutral-border hover:bg-neutral-secondary/50 group">
                    <div title={STATUS_CFG[t.status].label} className="absolute top-1.5 right-1.5">
                      {STATUS_CFG[t.status].icon}
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-xs font-medium text-neutral-text leading-snug">{t.name}</p>
                      {t.responsible_id && <p className="hidden sm:block text-xs text-neutral-muted truncate mt-0.5">{responsibleName(t.responsible_id)}</p>}
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(t)} className="text-xs text-neutral-muted hover:text-primary px-1">✎</button>
                      <button onClick={() => { if (confirm('Удалить задачу?')) remove(t.id) }} className="text-xs text-neutral-muted hover:text-error px-1">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-x-auto">
            <div className="min-w-0 relative" style={{ minWidth: `${DAYS * 20}px` }}>
              <div className="relative h-7 border-b border-neutral-border/50 bg-neutral-secondary">
                {weeks.map((w, i) => (
                  <div key={i} className="absolute top-0 h-full border-l border-neutral-border/50 flex items-center"
                    style={{ left: `${w.left}%`, width: `${w.width}%` }}>
                    <span className="text-xs text-neutral-muted px-1">{w.label}</span>
                  </div>
                ))}
              </div>
              <div className="relative h-7 border-b border-neutral-border bg-neutral-secondary flex">
                {headerDays.map((d, i) => {
                  const isWeekend = d.getDay() === 0 || d.getDay() === 6
                  const isToday = d.toDateString() === new Date().toDateString()
                  return (
                    <div key={i} className={`flex-1 flex items-center justify-center text-xs border-r border-neutral-border/30 ${isToday ? 'bg-primary text-white font-bold' : isWeekend ? 'text-neutral-muted bg-neutral-secondary' : 'text-neutral-sub'}`}>
                      {d.getDate()}
                    </div>
                  )
                })}
              </div>

              {grouped.map(({ project: p, tasks: pts }) => (
                <div key={p.id}>
                  <div className="relative h-9 bg-primary-light/30 border-b border-neutral-border">
                    {todayPct >= 0 && todayPct <= 100 && (
                      <div className="absolute top-0 bottom-0 w-px bg-primary/30 z-10" style={{ left: `${todayPct}%` }} />
                    )}
                    {(() => {
                      const style = getBarStyle(p.start_date, p.deadline)
                      return style ? <div className="absolute top-2 h-1.5 bg-primary/20 rounded-full" style={style} /> : null
                    })()}
                  </div>
                  {pts.map(t => {
                    const barStyle = getBarStyle(t.start_date, t.end_date)
                    const cfg = STATUS_CFG[t.status]
                    return (
                      <div key={t.id} className="relative h-16 border-b border-neutral-border hover:bg-neutral-secondary/30 transition-colors group">
                        {todayPct >= 0 && todayPct <= 100 && (
                          <div className="absolute top-0 bottom-0 w-px bg-primary/20 z-10" style={{ left: `${todayPct}%` }} />
                        )}
                        {weeks.map((w, i) => (
                          <div key={i} className="absolute top-0 bottom-0 w-px bg-neutral-border/40" style={{ left: `${w.left}%` }} />
                        ))}
                        {barStyle && (
                          <div className={`absolute top-4 h-6 rounded-md overflow-hidden cursor-pointer ${cfg.bar} opacity-80`}
                            style={barStyle}
                            onClick={() => openEdit(t)}
                            title={`${t.name}: ${t.start_date ? new Date(t.start_date).toLocaleDateString('ru-RU') : '?'} — ${t.end_date ? new Date(t.end_date).toLocaleDateString('ru-RU') : '?'}`}
                          >
                            {t.progress > 0 && (
                              <div className="h-full bg-black/15 rounded-md" style={{ width: `${t.progress}%` }} />
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white rounded-card shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border">
              <h2 className="font-semibold text-neutral-text">{modal.editId ? 'Редактировать задачу' : 'Новая задача'}</h2>
              <button onClick={closeModal}><X size={18} className="text-neutral-muted" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <F label="Проект *">
                  <select className="input" value={modal.data.project_id ?? ''} onChange={e => setField('project_id', e.target.value || null)}>
                    <option value="">— выбрать —</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </F>
                <F label="Название задачи *">
                  <input className="input" value={modal.data.name} onChange={e => setField('name', e.target.value)} />
                </F>
                <div className="grid grid-cols-2 gap-4">
                  <F label="Дата начала">
                    <input type="date" className="input" value={modal.data.start_date} onChange={e => setField('start_date', e.target.value)} />
                  </F>
                  <F label="Дата окончания">
                    <input type="date" className="input" value={modal.data.end_date ?? ''} onChange={e => setField('end_date', e.target.value || null)} />
                  </F>
                  <F label="Ответственный">
                    <select className="input" value={modal.data.responsible_id ?? ''} onChange={e => setField('responsible_id', e.target.value || null)}>
                      <option value="">— не назначен —</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.full_name ?? u.email}</option>)}
                    </select>
                  </F>
                  <F label="Статус">
                    <select className="input" value={modal.data.status} onChange={e => setField('status', e.target.value as TaskStatus)}>
                      {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </F>
                </div>
                <F label={`Прогресс: ${modal.data.progress}%`}>
                  <input type="range" min="0" max="100" value={modal.data.progress}
                    onChange={e => setField('progress', +e.target.value)}
                    className="w-full accent-primary" />
                </F>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-border">
              <button className="btn-ghost" onClick={closeModal}>Отмена</button>
              <button className="btn-primary" onClick={save}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-sub mb-1">{label}</label>
      {children}
    </div>
  )
}
