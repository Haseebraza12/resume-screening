'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Star,
  GitCompare,
  FileText,
  CreditCard,
  Puzzle,
  UserPlus,
  PlusCircle,
  BarChart3,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type NavItem = {
  name: string
  href: string
  icon: React.ElementType
}

type NavGroup = {
  title?: string
  items: NavItem[]
}

const navigationGroups: NavGroup[] = [
  {
    title: "The Daily Workflow",
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Jobs', href: '/jobs', icon: Briefcase },
      { name: 'Talent Pool', href: '/upload', icon: Users },
      { name: 'Saved', href: '/favorites', icon: Star },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ]
  },
  {
    title: "AI Tools",
    items: [
      { name: 'Quick Compare', href: '/quick-compare', icon: GitCompare },
      { name: 'JD Generator', href: '/jd-generator', icon: FileText },
    ]
  },
  {
    title: "Organization",
    items: [
      { name: 'Team & Access', href: '/team', icon: UserPlus },
      { name: 'Billing & Credits', href: '/billing', icon: CreditCard },
      { name: 'Integrations', href: '/integrations', icon: Puzzle },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 bg-primary-fg border-r border-border/30 flex flex-col h-screen sticky top-0">
      {/* Logo Area */}
      <div className="flex items-center gap-3 h-20 px-6">
        <img src="/logo-accent.png" alt="Rankify" className="w-auto h-8 object-contain" />
      </div>

      <nav className="flex-1 px-4 overflow-y-auto py-2 custom-scrollbar">
        <div className="flex flex-col gap-8">
          {navigationGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.title && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  {group.title}
                </h3>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-5 py-3 rounded-full text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-white shadow-sm text-text-primary'
                            : 'text-text-secondary hover:bg-white/50 hover:text-text-primary'
                        )}
                      >
                        <Icon className={cn("w-5 h-5", isActive ? "text-accent" : "text-text-tertiary group-hover:text-text-primary")} />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* User Profile / Bottom Section could go here if needed */}
    </aside>
  )
}
