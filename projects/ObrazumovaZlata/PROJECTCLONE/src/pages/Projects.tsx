import { useState } from 'react'
import { useProjects, useUsers } from '../store'
import { useAuth } from '../contexts/AuthContext'
import type { Project, ProjectStatus, Profile } from '../types'
import { Plus, Search, Calendar, Tag, Users } from 'lucide-react'
import { X, User as UserIcon } from 'lucide-react'

const STATUS_CONFIG: Record<ProjectStatus, { label: string; cls: string }> = {
  active:    { label: 'Активный',      cls: 'bg-green-100 text-green-700' },
  on_hold:   { label: 'Приостановлен', cls: 'bg-amber-100 text-amber-700' },
  completed: { label: 'Завершён',      cls: 'bg-primary-light text-primary' },
  cancelled: { label: 'Отменён',       cls: 'bg-neutral-secondary text-neutral-muted' },
}

const EMPTY = {
  name: '', description: '', status: 'active' as ProjectStatus,
  start_date: new Date().toISOString().slice(0, 10),
  deadline: null as string | null, responsible_id: null as string | null, tags: [] as string[],
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

function profileName(users: Profile[], id: string | null | undefined): string {
  if (!id) return ''
  const u = users.find(x => x.id === id)
  return u?.full_name ?? u?.email ?? ''
}

export default function Projects() {
  const { projects, create, update, remove, setMembers } = useProjects()
  const { users } = useUsers()
  const { user, role } = useAuth()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all')
  const [myOnly, setMyOnly] = useState(false)
  const [modal, setModal] = useState<{ open: boolean; data: typeof EMPTY; editId?: string; memberIds: string[] }>({
    open: false, data: { ...EMPTY }, memberIds: [],
  })
  const isAdmin = role === 'admin'

  const filtered = projects.filter(p => {
    const responsible = profileName(users, p.responsible_id)
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      || responsible.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    const matchMy = !myOnly || p.member_ids?.includes(user?.id ?? '') || p.responsible_id === user?.id
    return matchSearch && matchStatus && matchMy
  })

  function openCreate() { setModal({ open: true, data: { ...EMPTY }, memberIds: [] }) }
  function openEdit(p: Project) {
    setModal({
      open: true,
      data: {
        name: p.name, description: p.description ?? '', status: p.status,
        start_date: p.start_date ?? new Date().toISOString().slice(0, 10),
        deadline: p.deadline, responsible_id: p.responsible_id, tags: p.tags,
      },
      editId: p.id,
      memberIds: p.member_ids ?? [],
    })
  }
  function closeModal() { setModal({ open: false, data: { ...EMPTY }, memberIds: [] }) }

  async function save() {
    if (!modal.data.name.trim()) return
    if (modal.editId) {
      await update(modal.editId, modal.data)
      await setMembers(modal.editId, modal.memberIds)
    } else {
      const created = await create(modal.data)
      await setMembers(created.id, modal.memberIds)
    }
    closeModal()
  }

  function setField<K extends keyof typeof EMPTY>(k: K, v: typeof EMPTY[K]) {
    setModal(m => ({ ...m, data: { ...m.data, [k]: v } }))
  }

  const counts = { all: projects.length } as Record<string, number>
  Object.keys(STATUS_CONFIG).forEach(s => { counts[s] = projects.filter(p => p.status === s).length })

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
            <input className="input pl-9" placeholder="Поиск проектов..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button
            onClick={() => setMyOnly(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-medium transition-colors border shrink-0 ${myOnly ? 'bg-primary text-white border-primary' : 'bg-white border-neutral-border text-neutral-sub hover:bg-neutral-secondary'}`}
          >
            <UserIcon size={13} /> <span className="hidden sm:inline">Мои проекты</span>
          </button>
          {isAdmin && (
            <button className="btn-primary flex items-center gap-1.5 shrink-0" onClick={openCreate}>
              <Plus size={15} /> <span className="hidden sm:inline">Новый проект</span>
            </button>
          )}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {(['all', 'active', 'on_hold', 'completed', 'cancelled'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-btn text-xs font-medium transition-colors shrink-0 ${filterStatus === s ? 'bg-primary text-white' : 'bg-white border border-neutral-border text-neutral-sub hover:bg-neutral-secondary'}`}>
              {s === 'all' ? 'Все' : STATUS_CONFIG[s].label} ({counts[s] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-12 text-neutral-muted">Проекты не найдены</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <ProjectCard key={p.id} project={p} users={users}
              responsible={profileName(users, p.responsible_id)}
              onEdit={() => openEdit(p)}
              onDelete={() => { if (confirm('Удалить проект?')) remove(p.id) }}
              isAdmin={isAdmin} />
          ))}
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white rounded-card shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border">
              <h2 className="font-semibold text-neutral-text">{modal.editId ? 'Редактировать проект' : 'Новый проект'}</h2>
              <button onClick={closeModal} className="text-neutral-muted hover:text-neutral-text"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <Field label="Название *">
                  <input className="input" value={modal.data.name} onChange={e => setField('name', e.target.value)} placeholder="Название проекта" />
                </Field>
                <Field label="Описание">
                  <textarea className="input resize-none h-20" value={modal.data.description} onChange={e => setField('description', e.target.value)} placeholder="Краткое описание" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Статус">
                    <select className="input" value={modal.data.status} onChange={e => setField('status', e.target.value as ProjectStatus)}>
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Ответственный">
                    <select className="input" value={modal.data.responsible_id ?? ''} onChange={e => setField('responsible_id', e.target.value || null)}>
                      <option value="">— не назначен —</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.full_name ?? u.email}</option>)}
                    </select>
                  </Field>
                  <Field label="Дата начала">
                    <input type="date" className="input" value={modal.data.start_date} onChange={e => setField('start_date', e.target.value)} />
                  </Field>
                  <Field label="Дедлайн">
                    <input type="date" className="input" value={modal.data.deadline ?? ''} onChange={e => setField('deadline', e.target.value || null)} />
                  </Field>
                </div>
                <Field label="Теги (через запятую)">
                  <input className="input" value={modal.data.tags.join(', ')} onChange={e => setField('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} placeholder="биотех, ПЦР, ..." />
                </Field>
                <Field label="Участники">
                  <div className="space-y-1.5 max-h-36 overflow-y-auto border border-neutral-border rounded-xl p-2">
                    {users.map(u => (
                      <label key={u.id} className="flex items-center gap-2 cursor-pointer hover:bg-neutral-secondary/50 px-2 py-1.5 rounded-lg">
                        <input
                          type="checkbox"
                          className="accent-primary"
                          checked={modal.memberIds.includes(u.id)}
                          onChange={e => {
                            const ids = e.target.checked
                              ? [...modal.memberIds, u.id]
                              : modal.memberIds.filter(id => id !== u.id)
                            setModal(m => ({ ...m, memberIds: ids }))
                          }}
                        />
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {initials(u.full_name ?? u.email)}
                        </div>
                        <span className="text-sm text-neutral-text">{u.full_name ?? u.email}</span>
                      </label>
                    ))}
                  </div>
                </Field>
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

function ProjectCard({ project: p, users, responsible, onEdit, onDelete, isAdmin }: {
  project: Project; users: Profile[]; responsible: string;
  onEdit: () => void; onDelete: () => void; isAdmin: boolean
}) {
  const cfg = STATUS_CONFIG[p.status]
  const daysLeft = p.deadline ? Math.ceil((new Date(p.deadline).getTime() - Date.now()) / 86400000) : null
  const members = users.filter(u => p.member_ids?.includes(u.id))

  return (
    <div className="card hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-neutral-text text-sm leading-snug">{p.name}</h3>
        <span className={`badge shrink-0 ${cfg.cls}`}>{cfg.label}</span>
      </div>
      {p.description && <p className="text-xs text-neutral-sub line-clamp-2">{p.description}</p>}
      <div className="space-y-1.5 text-xs text-neutral-sub">
        {responsible && <div className="flex items-center gap-1.5"><UserIcon size={12} />{responsible}</div>}
        {p.deadline && (
          <div className={`flex items-center gap-1.5 ${daysLeft !== null && daysLeft < 14 && p.status === 'active' ? 'text-warning' : ''}`}>
            <Calendar size={12} />
            до {new Date(p.deadline).toLocaleDateString('ru-RU')}
            {daysLeft !== null && p.status === 'active' && ` (${daysLeft > 0 ? `${daysLeft} дн.` : 'просрочен'})`}
          </div>
        )}
        {p.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag size={12} />
            {p.tags.map(t => <span key={t} className="bg-primary-light text-primary px-1.5 py-0.5 rounded text-xs">{t}</span>)}
          </div>
        )}
        {members.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Users size={12} />
            <div className="flex -space-x-1">
              {members.slice(0, 4).map(u => (
                <div key={u.id} title={u.full_name ?? u.email} className="w-5 h-5 rounded-full bg-primary/20 border border-white flex items-center justify-center text-primary text-[9px] font-bold">
                  {initials(u.full_name ?? u.email)}
                </div>
              ))}
              {members.length > 4 && <div className="w-5 h-5 rounded-full bg-neutral-secondary border border-white flex items-center justify-center text-neutral-sub text-[9px]">+{members.length - 4}</div>}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-auto pt-2 border-t border-neutral-border">
        {isAdmin && <button className="btn-ghost text-xs flex-1" onClick={onEdit}>Редактировать</button>}
        {isAdmin && <button className="btn-ghost text-xs text-error hover:bg-red-50" onClick={onDelete}>Удалить</button>}
        {!isAdmin && <p className="text-xs text-neutral-muted italic">Только просмотр</p>}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-sub mb-1">{label}</label>
      {children}
    </div>
  )
}
