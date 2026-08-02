'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Store, ClipboardList, Target, MessageSquare, Globe, Crown, ExternalLink, Database } from 'lucide-react'

const VIP_NAV = [
  { path: '/vip-dashboard', label: 'VIP Pipeline', icon: LayoutDashboard },
  { path: '/vip-dashboard/brands', label: 'VIP Brands', icon: Store },
  { path: '/vip-dashboard/audits', label: 'VIP Audits', icon: ClipboardList },
  { path: '/vip-dashboard/websites', label: 'Premium Websites', icon: Globe },
  { path: '/vip-dashboard/scrape', label: 'Scrape Data', icon: Database },
  { path: '/vip-dashboard/leads', label: 'VIP Leads', icon: Target },
  { path: '/vip-dashboard/dm', label: 'VIP DM Queue', icon: MessageSquare },
]

export default function VIPDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Basic client-side auth check from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
      return null
    }

    const token = getCookie('kriya_token')
    const userRole = getCookie('kriya_role')

    if (!token) {
      router.push('/login')
    } else {
      setRole(userRole || 'Viewer')
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    document.cookie = 'kriya_token=; path=/; max-age=0'
    document.cookie = 'kriya_role=; path=/; max-age=0'
    router.push('/login')
  }

  if (!isAuthenticated) return null // Or a loader

  // Filter nav items based on role
  const allowedNav = role === 'SuperAdmin' 
    ? VIP_NAV 
    : VIP_NAV.filter(item => item.path === '/vip-dashboard')

  return (
    <div className="flex min-h-screen bg-[#050508] selection:bg-amber-500/30 font-sans">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#0a0a0f] border-r border-white/[0.05] p-6 flex flex-col h-screen sticky top-0 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.8)] z-20">
        <div className="mb-12 mt-4 flex items-center gap-2">
          <Crown className="text-amber-400 size-6" />
          <Link href="/vip-dashboard" className="font-display text-2xl font-bold tracking-tight text-white">
            Kriya <span className="text-[10px] text-amber-500 uppercase tracking-[0.2em] ml-1 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">VIP</span>
          </Link>
        </div>
        
        <nav className="flex-1 space-y-2">
          {allowedNav.map(item => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]' : 'text-white/40 hover:bg-white/[0.02] hover:text-white/80 border border-transparent'}`}
              >
                <item.icon className={`size-5 ${isActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : ''}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="pt-6 border-t border-white/[0.05] mt-auto flex flex-col gap-2">
          {role === 'SuperAdmin' && (
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/40 hover:bg-white/[0.02] hover:text-white transition-all duration-300 border border-transparent"
            >
              <ExternalLink className="size-5" />
              Standard Admin
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-transparent"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden p-8 md:p-12 text-white bg-[#050508] relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
