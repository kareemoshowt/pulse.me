'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', icon: '◉', label: 'Today' },
  { href: '/dashboard/week', icon: '▦', label: 'Week' },
  { href: '/dashboard/stats', icon: '📊', label: 'Stats' },
  { href: '/pokedex', icon: '◎', label: 'PokeDex' },
  { href: '/dashboard/settings', icon: '⚙', label: 'Settings' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/[0.06] pb-safe">
      <div className="flex justify-around py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-opacity ${
                isActive ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <span className={`text-xl ${isActive ? 'text-pulse-amber' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
