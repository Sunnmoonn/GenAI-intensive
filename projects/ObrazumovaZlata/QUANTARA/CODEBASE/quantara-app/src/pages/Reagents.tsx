import { useState } from 'react'
import { useReagents, useProjects } from '../store'
import type { Reagent } from '../types'
import { Plus, Search, X, AlertTriangle, Minus } from 'lucide-react'

const REAGENT_CATEGORIES = ['Жидкий', 'Сыпучий', 'Газ']

const EMPTY: Omit<Reagent, 'id' | 'org_id' | 'deleted_at'> = {
  name: '', category: 'Жидкий', cas_number: '', formula: '', concentration: '', storage: '',
  stock: 0, unit: 'мл', min_stock: 0, expiry_date: null, location: '', supplier: '', project_id: null,
}

export default function Reagents() {
  const { reagents, create, update, remove } = useReagents()
  const { projects } = useProjects()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [modal, setModal] = useState<{ open: boolean; data: typeof EMPTY; editId?: string }>({ open: false, data: EMPTY })
  const [writeOffId, setWriteOffId] = useState<string | null>(null)
  const [writeOffAmt, setWriteOffAmt] = useState('')

  const filtered = reagents.filter(r => {
    const matchSearch = [r.name, r.cas_number, r.formula, r.supplier].some(f => f?.toLowerCase().includes(search.toLowerCase()))
    const matchCat = filterCat === 'all' || r.category === filterCat
    return matchSearch && matchCat
  })

  function openCreate() { setModal({ open: true, data: { ...EMPTY } }) }
  function openEdit(r: Reagent) {
    setModal({ open: true, data: {
      name: r.name, category: r.category ?? 'Жидкий', cas_number: r.cas_number ?? '',
      formula: r.formula ?? '', concentration: r.concentration ?? '', storage: r.storage ?? '',
      stock: r.stock, unit: r.unit ?? 'мл', min_stock: r.min_stock,
      expiry_date: r.expiry_date, location: r.location ?? '', supplier: r.supplier ?? '',
      project_id: r.project_id,
    }, editId: r.id })
  }
  function closeModal() { setModal({ open: false, data: EMPTY }) }

  async function save() {
    if (!modal.data.name.trim()) return
    if (modal.editId) {
      await update(modal.editId, modal.data)
    } else {
      await create(modal.data)
    }
    closeModal()
  }

  async function doWriteOff() {
    const amt = parseFloat(writeOffAmt)
    if (!writeOffId || isNaN(amt) || amt <= 0) return
    const r = reagents.find(x => x.id === writeOffId)
    if (r) await update(writeOffId, { stock: Math.max(0, r.stock - amt) })
    setWriteOffId(null); setWriteOffAmt('')
  }

  function setField<K extends keyof typeof EMPTY>(k: K, v: typeof EMPTY[K]) {
    setModal(m => ({ ...m, data: { ...m.data, [k]: v } }))
  }

  const lowCount = reagents.filter(r => r.stock <= r.min_stock).length

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
            <input className="input pl-9" placeholder="Поиск по названию, CAS, поставщику..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {lowCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-warning text-sm bg-amber-50 px-3 py-1.5 rounded-btn border border-amber-200 shrink-0">
              <AlertTriangle size={14} />{lowCount} на низком остатке
            </div>
          )}
          <button className="btn-primary flex items-center gap-1.5 shrink-0" onClick={openCreate}>
            <Plus size={15} /> <span className="hidden sm:inline">Добавить реагент</span>
          </button>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {(['all', ...REAGENT_CATEGORIES] as const).map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-btn text-xs font-medium transition-colors shrink-0 ${filterCat === cat ? 'bg-primary text-white' : 'bg-white border border-neutral-border text-neutral-sub hover:bg-neutral-secondary'}`}>
              {cat === 'all' ? 'Все' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-secondary border-b border-neutral-border">
                {['Название', 'Категория', 'CAS / Формула', 'Конц-ция / Хранение', 'Остаток', 'Мин. остаток', 'Срок годности', 'Проект', 'Местоположение', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-sub">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-10 text-neutral-muted">Реагенты не найдены</td></tr>
              ) : filtered.map(r => {
                const isLow = r.stock <= r.min_stock
                const isExpiring = r.expiry_date && new Date(r.expiry_date) < new Date(Date.now() + 30 * 86400000)
                return (
                  <tr key={r.id} className="table-row">
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-text">{r.name}</p>
                      {r.supplier && <p className="text-xs text-neutral-muted">{r.supplier}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-primary-light text-primary">{r.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      {r.cas_number && <p className="text-xs font-mono text-neutral-sub">{r.cas_number}</p>}
                      {r.formula && <p className="text-xs text-neutral-muted">{r.formula}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {r.concentration && <p>{r.concentration}</p>}
                      {r.storage && <p className="text-neutral-muted">{r.storage}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${isLow ? 'text-warning' : 'text-neutral-text'}`}>{r.stock} {r.unit}</span>
                      {isLow && <AlertTriangle size={12} className="inline ml-1 text-warning" />}
                    </td>
                    <td className="px-4 py-3 text-neutral-sub">{r.min_stock} {r.unit}</td>
                    <td className="px-4 py-3 text-xs">
                      {r.expiry_date ? (
                        <span className={isExpiring ? 'text-error font-medium' : 'text-neutral-sub'}>
                          {new Date(r.expiry_date).toLocaleDateString('ru-RU')}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-muted">
                      {r.project_id ? (
                        <span className="badge bg-neutral-secondary text-neutral-sub">
                          {projects.find(p => p.id === r.project_id)?.name ?? '—'}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-muted">{r.location || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button title="Списать" onClick={() => setWriteOffId(r.id)} className="p-1.5 rounded-lg hover:bg-amber-50 text-neutral-muted hover:text-warning transition-colors">
                          <Minus size={14} />
                        </button>
                        <button onClick={() => openEdit(r)} className="px-2 py-1 text-xs text-neutral-sub hover:text-primary hover:bg-primary-light rounded-lg transition-colors">Изм.</button>
                        <button onClick={() => { if (confirm('Удалить реагент?')) remove(r.id) }} className="px-2 py-1 text-xs text-neutral-muted hover:text-error hover:bg-red-50 rounded-lg transition-colors">Уд.</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {writeOffId && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setWriteOffId(null)}>
          <div className="bg-white rounded-card shadow-xl w-full max-w-sm">
            <div className="px-6 py-4 border-b border-neutral-border flex items-center justify-between">
              <h2 className="font-semibold text-neutral-text">Списание реагента</h2>
              <button onClick={() => setWriteOffId(null)}><X size={18} className="text-neutral-muted" /></button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <p className="text-sm text-neutral-sub">Реагент: <span className="font-medium text-neutral-text">{reagents.find(r => r.id === writeOffId)?.name}</span></p>
              <p className="text-sm text-neutral-sub">Текущий остаток: <span className="font-medium">{reagents.find(r => r.id === writeOffId)?.stock} {reagents.find(r => r.id === writeOffId)?.unit}</span></p>
              <div>
                <label className="block text-xs font-medium text-neutral-sub mb-1">Количество для списания</label>
                <input type="number" className="input" placeholder="0" value={writeOffAmt} onChange={e => setWriteOffAmt(e.target.value)} min="0" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-border">
              <button className="btn-ghost" onClick={() => setWriteOffId(null)}>Отмена</button>
              <button className="btn-primary" onClick={doWriteOff}>Списать</button>
            </div>
          </div>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white rounded-card shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border">
              <h2 className="font-semibold text-neutral-text">{modal.editId ? 'Редактировать реагент' : 'Добавить реагент'}</h2>
              <button onClick={closeModal}><X size={18} className="text-neutral-muted" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <F label="Название *"><input className="input" value={modal.data.name} onChange={e => setField('name', e.target.value)} /></F>
                <div className="grid grid-cols-2 gap-4">
                  <F label="Категория">
                    <select className="input" value={modal.data.category ?? ''} onChange={e => setField('category', e.target.value)}>
                      {REAGENT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </F>
                  <F label="Проект (необязательно)">
                    <select className="input" value={modal.data.project_id ?? ''} onChange={e => setField('project_id', e.target.value || null)}>
                      <option value="">— не привязан —</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </F>
                  <F label="CAS номер"><input className="input font-mono" value={modal.data.cas_number ?? ''} onChange={e => setField('cas_number', e.target.value)} placeholder="xxxx-xx-x" /></F>
                  <F label="Формула"><input className="input" value={modal.data.formula ?? ''} onChange={e => setField('formula', e.target.value)} /></F>
                  <F label="Концентрация"><input className="input" value={modal.data.concentration ?? ''} onChange={e => setField('concentration', e.target.value)} /></F>
                  <F label="Условия хранения"><input className="input" value={modal.data.storage ?? ''} onChange={e => setField('storage', e.target.value)} placeholder="+4°C" /></F>
                  <F label="Остаток"><input type="number" className="input" value={modal.data.stock} onChange={e => setField('stock', +e.target.value)} min="0" /></F>
                  <F label="Единица"><input className="input" value={modal.data.unit ?? ''} onChange={e => setField('unit', e.target.value)} placeholder="мл, г, шт..." /></F>
                  <F label="Мин. остаток"><input type="number" className="input" value={modal.data.min_stock} onChange={e => setField('min_stock', +e.target.value)} min="0" /></F>
                  <F label="Срок годности"><input type="date" className="input" value={modal.data.expiry_date ?? ''} onChange={e => setField('expiry_date', e.target.value || null)} /></F>
                  <F label="Местоположение"><input className="input" value={modal.data.location ?? ''} onChange={e => setField('location', e.target.value)} /></F>
                  <F label="Поставщик"><input className="input" value={modal.data.supplier ?? ''} onChange={e => setField('supplier', e.target.value)} /></F>
                </div>
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
