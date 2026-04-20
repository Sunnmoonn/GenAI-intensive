import { useState } from 'react'
import { useUsers, useProjects } from '../store'
import { useAuth } from '../contexts/AuthContext'
import type { Profile, UserRole } from '../types'
import { X, Shield, FlaskConical, Edit2, LogOut } from 'lucide-react'

const ROLE_CFG: Record<UserRole, { label: string; cls: string }> = {
  admin:      { label: 'Завлаб',        cls: 'bg-primary-light text-primary' },
  researcher: { label: 'Исследователь', cls: 'bg-neutral-secondary text-neutral-sub' },
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function ProfilePage() {
  const { user, role, signOut } = useAuth()
  const { users, update } = useUsers()
  const { projects } = useProjects()
  const [modal, setModal] = useState<{ open: boolean; data: { full_name: string; role: UserRole }; editId?: string }>({
    open: false, data: { full_name: '', role: 'researcher' },
  })

  const me = users.find(u => u.id === user?.id) ?? users[0]
  const isAdmin = role === 'admin'

  function openEdit(u: Profile) {
    setModal({ open: true, data: { full_name: u.full_name ?? '', role: u.role }, editId: u.id })
  }
  function closeModal() { setModal({ open: false, data: { full_name: '', role: 'researcher' } }) }

  async function save() {
    if (!modal.editId) return
    await update(modal.editId, modal.data)
    closeModal()
  }

  const myProjects = projects.filter(p =>
    p.member_ids?.includes(user?.id ?? '') || p.responsible_id === user?.id
  )

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="card flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shrink-0">
            {me ? initials(me.full_name ?? me.email) : '?'}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-neutral-text truncate">{me?.full_name ?? me?.email}</h2>
            <p className="text-sm text-neutral-muted truncate">{me?.email}</p>
            <span className={`badge mt-1 ${ROLE_CFG[me?.role ?? 'researcher'].cls}`}>
              {ROLE_CFG[me?.role ?? 'researcher'].label}
            </span>
          </div>
        </div>
        <button onClick={signOut} className="btn-ghost flex items-center gap-2 text-sm text-neutral-sub shrink-0">
          <LogOut size={15} /> Выйти
        </button>
      </div>

      <div className="card">
        <h3 className="font-semibold text-neutral-text mb-3">Мои проекты</h3>
        {myProjects.length === 0 ? (
          <p className="text-sm text-neutral-muted">Вы не добавлены ни в один проект</p>
        ) : (
          <div className="space-y-2">
            {myProjects.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-neutral-border last:border-0">
                <p className="text-sm font-medium text-neutral-text">{p.name}</p>
                {p.deadline && (
                  <span className="text-xs text-neutral-sub">
                    до {new Date(p.deadline).toLocaleDateString('ru-RU')}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-text">Команда</h3>
        </div>
        <div className="space-y-1">
          {users.map(u => {
            const userProjects = projects.filter(p => p.member_ids?.includes(u.id))
            const isCurrent = u.id === user?.id
            return (
              <div key={u.id} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isCurrent ? 'bg-primary-light/60' : 'hover:bg-neutral-secondary/50'}`}>
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                  {initials(u.full_name ?? u.email)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-text">{u.full_name ?? u.email}</p>
                    {isCurrent && <span className="text-xs text-primary font-medium">• вы</span>}
                  </div>
                  <p className="text-xs text-neutral-muted">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`badge ${ROLE_CFG[u.role].cls}`}>
                    {u.role === 'admin' ? <Shield size={10} className="inline mr-1" /> : <FlaskConical size={10} className="inline mr-1" />}
                    {ROLE_CFG[u.role].label}
                  </span>
                  {userProjects.length > 0 && (
                    <span className="hidden sm:inline text-xs text-neutral-sub">{userProjects.length} проект{userProjects.length > 1 ? 'а' : ''}</span>
                  )}
                  {isAdmin && (
                    <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-primary-light text-neutral-muted hover:text-primary transition-colors">
                      <Edit2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white rounded-card shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border">
              <h2 className="font-semibold text-neutral-text">Редактировать сотрудника</h2>
              <button onClick={closeModal}><X size={18} className="text-neutral-muted" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-sub mb-1">ФИО</label>
                <input className="input" value={modal.data.full_name} onChange={e => setModal(m => ({ ...m, data: { ...m.data, full_name: e.target.value } }))} placeholder="Фамилия И.О." />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-sub mb-1">Роль</label>
                <select className="input" value={modal.data.role} onChange={e => setModal(m => ({ ...m, data: { ...m.data, role: e.target.value as UserRole } }))}>
                  {Object.entries(ROLE_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
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
