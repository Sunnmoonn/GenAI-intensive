import { useState } from 'react'
import { useConsumables } from '../store'
import type { Consumable } from '../types'
import { Plus, Search, X, AlertTriangle, Minus } from 'lucide-react'

const CATEGORIES = ['Пластик', 'Стекло', 'Фильтры', 'СИЗ', 'Другое']

const EMPTY: Omit<Consumable, 'id' | 'org_id' | 'deleted_at'> = {
  name: '', category: 'Пластик', stock: 0, unit: 'шт', min_stock: 0, location: '', supplier: '', comment: '',
}

export default function Consumables() {
  const { consumables, create, update, remove } = useConsumables()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [modal, setModal] = useState<{ open: boolean; data: typeof EMPTY; editId?: string }>({ open: false, data: EMPTY })
  const [writeOffId, setWriteOffId] = useState<string | null>(null)
  const [writeOffAmt, setWriteOffAmt] = useState('')

  const categories = ['all', ...Array.from(new Set(consumables.map(c => c.category).filter(Boolean)))]

  const filtered = consumables.filter(c => {
    const matchSearch = [c.name, c.supplier, c.location, c.comment].some(f => f?.toLowerCase().includes(search.toLowerCase()))
    const matchCat = filterCat === 'all' || c.category === filterCat
    return matchSearch && matchCat
  })

  function openCreate() { setModal({ open: true, data: { ...EMPTY } }) }
  function openEdit(c: Consumable) {
    setModal({ open: true, data: {
      name: c.name, category: c.category ?? 'Пластик', stock: c.stock,
      unit: c.unit ?? 'шт', min_stock: c.min_stock, location: c.location ?? '',
      supplier: c.supplier ?? '', comment: c.comment ?? '',
    }, editId: c.id })
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
    const c = consumables.find(x => x.id === writeOffId)
    if (c) await update(writeOffId, { stock: Math.max(0, c.stock - amt) })
    setWriteOffId(null); setWriteOffAmt('')
  }

  function setField<K extends keyof typeof EMPTY>(k: K, v: typeof EMPTY[K]) {
    setModal(m => ({ ...m, data: { ...m.data, [k]: v } }))
  }

  const lowCount = consumables.filter(c => c.stock <= c.min_stock).length

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
            <input className="input pl-9" placeholder="Поиск расходников..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {lowCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-error text-sm bg-red-50 px-3 py-1.5 rounded-btn border border-red-200 shrink-0">
              <AlertTriangle size={14} />{lowCount} на низком остатке
            </div>
          )}
          <button className="btn-primary flex items-center gap-1.5 shrink-0" onClick={openCreate}>
            <Plus size={15} /> <span className="hidden sm:inline">Добавить расходник</span>
          </button>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-btn text-xs font-medium transition-colors shrink-0 ${filterCat === cat ? 'bg-primary text-white' : 'bg-white border border-neutral-border text-neutral-sub hover:bg-neutral-secondary'}`}>
              {cat === 'all' ? 'Все категории' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-secondary border-b border-neutral-border">
                {['Название', 'Категория', 'Остаток', 'Мин. остаток', 'Местоположение', 'Поставщик', 'Комментарий', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-sub">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-neutral-muted">Расходники не найдены</td></tr>
              ) : filtered.map(c => {
                const isLow = c.stock <= c.min_stock
                const stockPct = c.min_stock > 0 ? Math.min(100, (c.stock / (c.min_stock * 3)) * 100) : 100
                return (
                  <tr key={c.id} className="table-row">
                    <td className="px-4 py-3"><p className="font-medium text-neutral-text">{c.name}</p></td>
                    <td className="px-4 py-3"><span className="badge bg-primary-light text-primary">{c.category}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isLow ? 'text-error' : 'text-neutral-text'}`}>{c.stock} {c.unit}</span>
                        {isLow && <AlertTriangle size={12} className="text-error" />}
                      </div>
                      <div className="w-20 h-1.5 bg-neutral-border rounded-full mt-1.5 overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${isLow ? 'bg-error' : stockPct < 50 ? 'bg-warning' : 'bg-success'}`}
                          style={{ width: `${stockPct}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-sub">{c.min_stock} {c.unit}</td>
                    <td className="px-4 py-3 text-xs text-neutral-muted">{c.location || '—'}</td>
                    <td className="px-4 py-3 text-xs text-neutral-muted">{c.supplier || '—'}</td>
                    <td className="px-4 py-3 text-xs text-neutral-muted">{c.comment || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button title="Списать" onClick={() => setWriteOffId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-muted hover:text-error transition-colors">
                          <Minus size={14} />
                        </button>
                        <button onClick={() => openEdit(c)} className="px-2 py-1 text-xs text-neutral-sub hover:text-primary hover:bg-primary-light rounded-lg transition-colors">Изм.</button>
                        <button onClick={() => { if (confirm('Удалить расходник?')) remove(c.id) }} className="px-2 py-1 text-xs text-neutral-muted hover:text-error hover:bg-red-50 rounded-lg transition-colors">Уд.</button>
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
              <h2 className="font-semibold text-neutral-text">Списание расходника</h2>
              <button onClick={() => setWriteOffId(null)}><X size={18} className="text-neutral-muted" /></button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <p className="text-sm text-neutral-sub">Позиция: <span className="font-medium text-neutral-text">{consumables.find(c => c.id === writeOffId)?.name}</span></p>
              <p className="text-sm text-neutral-sub">Остаток: <span className="font-medium">{consumables.find(c => c.id === writeOffId)?.stock} {consumables.find(c => c.id === writeOffId)?.unit}</span></p>
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
              <h2 className="font-semibold text-neutral-text">{modal.editId ? 'Редактировать' : 'Добавить расходник'}</h2>
              <button onClick={closeModal}><X size={18} className="text-neutral-muted" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <F label="Название *"><input className="input" value={modal.data.name} onChange={e => setField('name', e.target.value)} /></F>
                <div className="grid grid-cols-2 gap-4">
                  <F label="Категория">
                    <select className="input" value={modal.data.category ?? ''} onChange={e => setField('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </F>
                  <F label="Единица"><input className="input" value={modal.data.unit ?? ''} onChange={e => setField('unit', e.target.value)} placeholder="шт, г, мл..." /></F>
                  <F label="Остаток"><input type="number" className="input" value={modal.data.stock} onChange={e => setField('stock', +e.target.value)} min="0" /></F>
                  <F label="Мин. остаток"><input type="number" className="input" value={modal.data.min_stock} onChange={e => setField('min_stock', +e.target.value)} min="0" /></F>
                  <F label="Местоположение"><input className="input" value={modal.data.location ?? ''} onChange={e => setField('location', e.target.value)} /></F>
                  <F label="Поставщик"><input className="input" value={modal.data.supplier ?? ''} onChange={e => setField('supplier', e.target.value)} /></F>
                </div>
                <F label="Комментарий"><textarea className="input resize-none h-16" value={modal.data.comment ?? ''} onChange={e => setField('comment', e.target.value)} placeholder="Дополнительная информация..." /></F>
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
