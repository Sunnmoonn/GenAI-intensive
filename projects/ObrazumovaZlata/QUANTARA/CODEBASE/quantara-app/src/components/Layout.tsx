import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FlaskConical, Package, FolderKanban, CalendarDays, LayoutDashboard, UserCircle } from 'lucide-react'
import { useUsers } from '../store'
import { useAuth } from '../contexts/AuthContext'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Главная' },
  { to: '/projects', icon: FolderKanban, label: 'Проекты' },
  { to: '/reagents', icon: FlaskConical, label: 'Реагенты' },
  { to: '/consumables', icon: Package, label: 'Расходники' },
  { to: '/gantt', icon: CalendarDays, label: 'Календарь' },
  { to: '/profile', icon: UserCircle, label: 'Кабинет' },
]

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { users } = useUsers()
  const { user } = useAuth()

  const me = users.find(u => u.id === user?.id) ?? users[0]

  const pageTitle = nav.find(n =>
    n.to === '/' ? location.pathname === '/' : location.pathname.startsWith(n.to)
  )?.label ?? 'Quantara'

  return (
    <div className="flex h-screen bg-neutral-secondary overflow-hidden">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-56 bg-white border-r border-neutral-border flex-col shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-neutral-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <FlaskConical size={14} className="text-white" />
            </div>
            <span className="font-bold text-neutral-text text-base tracking-tight">Quantara</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-light text-primary'
                    : 'text-neutral-sub hover:bg-neutral-secondary hover:text-neutral-text'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Current user footer */}
        <button
          onClick={() => navigate('/profile')}
          className="px-4 py-3 border-t border-neutral-border hover:bg-neutral-secondary/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center text-primary text-xs font-bold shrink-0">
              {me ? initials(me.full_name ?? me.email) : '?'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-neutral-text truncate">{me?.full_name ?? me?.email ?? '—'}</p>
              <p className="text-xs text-neutral-muted">{me?.role === 'admin' ? 'Завлаб' : 'Исследователь'}</p>
            </div>
          </div>
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 md:h-16 bg-white border-b border-neutral-border flex items-center px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-2">
            <div className="md:hidden w-6 h-6 bg-primary rounded-md flex items-center justify-center mr-1">
              <FlaskConical size={12} className="text-white" />
            </div>
            <h1 className="text-base md:text-lg font-semibold text-neutral-text">{pageTitle}</h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-border z-40 flex">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-neutral-muted'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-[10px]">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
