'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, Building2 } from 'lucide-react'

const tabs = [
  { href: '/dashboard', icon: Home,        label: 'Кейс' },
  { href: '/wizard',    icon: PlusCircle,  label: 'Новый' },
  { href: '/org',       icon: Building2,   label: 'Орг.' },
]

export function BottomNav() {
  const path = usePathname()
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#E2E8F0] safe-bottom z-50">
      <div className="flex items-center justify-around px-2 pt-2 pb-3">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href === '/dashboard' && path.startsWith('/task'))
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-6 py-1 rounded-xl transition-colors ${
                active ? 'text-[#1C3D5E]' : 'text-slate-400'
              }`}
            >
              <Icon
                className={`w-6 h-6 transition-all ${active ? 'stroke-[2.5]' : 'stroke-[1.5]'}`}
              />
              <span className={`text-[10px] font-medium ${active ? 'text-[#1C3D5E]' : 'text-slate-400'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
