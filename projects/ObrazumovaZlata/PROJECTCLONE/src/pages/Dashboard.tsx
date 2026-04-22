import { useProjects, useReagents, useConsumables, useTasks } from '../store'
import { FolderKanban, FlaskConical, Package, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { projects } = useProjects()
  const { reagents } = useReagents()
  const { consumables } = useConsumables()
  const { tasks } = useTasks()

  const activeProjects = projects.filter(p => p.status === 'active').length
  const lowReagents = reagents.filter(r => r.stock <= r.min_stock).length
  const lowConsumables = consumables.filter(c => c.stock <= c.min_stock).length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length

  const stats = [
    { label: 'Активных проектов', value: activeProjects, total: projects.length, icon: FolderKanban, color: 'text-primary', bg: 'bg-primary-light', to: '/projects' },
    { label: 'Реагентов на низком остатке', value: lowReagents, total: reagents.length, icon: FlaskConical, color: lowReagents > 0 ? 'text-warning' : 'text-success', bg: lowReagents > 0 ? 'bg-amber-50' : 'bg-green-50', to: '/reagents' },
    { label: 'Расходников на низком остатке', value: lowConsumables, total: consumables.length, icon: Package, color: lowConsumables > 0 ? 'text-error' : 'text-success', bg: lowConsumables > 0 ? 'bg-red-50' : 'bg-green-50', to: '/consumables' },
    { label: 'Задач в работе', value: inProgressTasks, total: tasks.length, icon: Clock, color: 'text-primary', bg: 'bg-primary-light', to: '/gantt' },
  ]

  const recentProjects = [...projects].sort((a, b) =>
    (b.start_date ?? '').localeCompare(a.start_date ?? '')
  ).slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Link key={s.label} to={s.to} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon size={20} className={s.color} />
              </div>
              {s.label.includes('остатке') && s.value > 0 && (
                <AlertTriangle size={16} className="text-warning" />
              )}
            </div>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-neutral-muted mt-1">{s.label}</p>
            <p className="text-xs text-neutral-muted">из {s.total} всего</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-neutral-text">Проекты</h2>
            <Link to="/projects" className="text-xs text-primary hover:underline">Все проекты</Link>
          </div>
          <div className="space-y-3">
            {recentProjects.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-neutral-border last:border-0">
                <p className="text-sm font-medium text-neutral-text">{p.name}</p>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-neutral-text">Требуют внимания</h2>
          </div>
          <div className="space-y-2">
            {reagents.filter(r => r.stock <= r.min_stock).map(r => (
              <div key={r.id} className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg">
                <AlertTriangle size={14} className="text-warning shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-text truncate">{r.name}</p>
                  <p className="text-xs text-neutral-muted">{r.stock} {r.unit} (мин: {r.min_stock})</p>
                </div>
                <span className="badge bg-amber-100 text-amber-700">Реагент</span>
              </div>
            ))}
            {consumables.filter(c => c.stock <= c.min_stock).map(c => (
              <div key={c.id} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                <AlertTriangle size={14} className="text-error shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-text truncate">{c.name}</p>
                  <p className="text-xs text-neutral-muted">{c.stock} {c.unit} (мин: {c.min_stock})</p>
                </div>
                <span className="badge bg-red-100 text-red-700">Расходник</span>
              </div>
            ))}
            {lowReagents + lowConsumables === 0 && (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 size={16} />
                <span className="text-sm">Все запасы в норме</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    on_hold: 'bg-amber-100 text-amber-700',
    completed: 'bg-primary-light text-primary',
    cancelled: 'bg-neutral-secondary text-neutral-muted',
  }
  const label: Record<string, string> = {
    active: 'Активный', on_hold: 'Приостановлен', completed: 'Завершён', cancelled: 'Отменён',
  }
  return <span className={`badge ${map[status] ?? ''}`}>{label[status] ?? status}</span>
}
