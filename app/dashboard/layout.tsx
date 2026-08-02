'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Store, ClipboardList, Target, MessageSquare, ExternalLink, Crown } from 'lucide-react'

const NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/brands', label: 'Brands', icon: Store },
  { path: '/dashboard/audits', label: 'Audits', icon: ClipboardList },
  { path: '/dashboard/leads', label: 'Leads', icon: Target },
  { path: '/dashboard/dm', label: 'DM Queue', icon: MessageSquare },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-card border-r border-border p-6 flex flex-col h-screen sticky top-0">
        <div className="mb-12 mt-4">
          <Link href="/dashboard" className="font-display text-2xl font-bold tracking-tight">
            Kriya<span className="text-primary">®</span> <span className="text-xs text-muted-foreground ml-2 uppercase tracking-widest">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 space-y-2">
          {NAV.map(item => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(210,255,0,0.1)]' : 'text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent'}`}
              >
                <item.icon className={`size-5 ${isActive ? 'text-primary' : ''}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="pt-6 border-t border-border mt-auto">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-300 border border-transparent"
          >
            <ExternalLink className="size-5" />
            Live Website
          </Link>
          <Link
            href="/vip-dashboard"
            className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-sm font-semibold text-amber-500 hover:bg-amber-500/10 transition-all duration-300 border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.05)]"
          >
            <Crown className="size-5" />
            VIP Experience
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden p-8 md:p-12 text-foreground bg-background">
        {children}
      </main>
    </div>
  )
}
