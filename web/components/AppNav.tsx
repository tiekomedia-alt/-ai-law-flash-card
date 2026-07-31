'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const SIDEBAR_NAV = [
  { href: '/dashboard', icon: 'home', label: 'Home' },
  { href: '/study', icon: 'style', label: 'Study' },
  { href: '/exam', icon: 'quiz', label: 'Exam' },
  { href: '/leaderboard', icon: 'emoji_events', label: 'Ranks' },
  { href: '/progress', icon: 'analytics', label: 'Progress' },
  { href: '/settings', icon: 'settings', label: 'Settings' },
]

const BOTTOM_TABS = [
  { href: '/dashboard', icon: 'home', label: 'Home' },
  { href: '/study', icon: 'style', label: 'Study' },
  { href: '/exam', icon: 'quiz', label: 'Exam' },
  { href: '/leaderboard', icon: 'emoji_events', label: 'Ranks' },
  { href: '/progress', icon: 'person', label: 'Profile' },
]

interface AppNavProps {
  username?: string
  xpTotal?: number
}

export default function AppNav({ username, xpTotal }: AppNavProps) {
  const pathname = usePathname()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-40 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
          <div className="w-9 h-9 bg-[#1a3b70] rounded-xl flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-xl">balance</span>
          </div>
          <span className="text-xl font-extrabold text-[#1a3b70] tracking-tight">LawFlash AI</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          {SIDEBAR_NAV.map(item => {
            const active = !!pathname && (pathname === item.href || pathname.startsWith(item.href + '/'))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-[#1a3b70] text-white shadow-lg'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="px-4 pb-6 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50">
            <div className="w-9 h-9 bg-[#1a3b70] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
              {username?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-slate-900 font-bold text-sm truncate">@{username ?? '...'}</div>
              <div className="text-slate-400 text-xs">{(xpTotal ?? 0).toLocaleString()} XP</div>
            </div>
            <button onClick={handleSignOut} className="text-slate-400 hover:text-red-500 transition-colors" title="Sign out">
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
          {BOTTOM_TABS.map(item => {
            const active = !!pathname && (pathname === item.href || pathname.startsWith(item.href + '/'))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                  active ? 'text-[#1a3b70]' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
