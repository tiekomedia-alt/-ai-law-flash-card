'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const COURSES = [
  { id: '65e185b9-6471-4e13-b9fc-5a502b5b6c49', name: 'Criminal Litigation', icon: '⚖️', cards: 260, mcqs: 250 },
  { id: 'f3f9762e-2d0a-4258-b94e-5a544c1b9c98', name: 'Civil Litigation', icon: '📋', cards: 250, mcqs: 250 },
  { id: 'a3e6e6a1-20c8-4a3b-bbc4-e2022db599b8', name: 'Professional Ethics', icon: '🏛️', cards: 318, mcqs: 250 },
  { id: '8f524136-30f6-4a75-b660-c70338c1b090', name: 'Company Law & Practice', icon: '🏢', cards: 250, mcqs: 250 },
  { id: '6b05c6f6-1093-4690-adce-4a814a9ff178', name: 'Property Law & Practice', icon: '🏗️', cards: 250, mcqs: 250 },
]

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      try {
        if (!user) { window.location.href = '/login'; return }
        const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
        setProfile({ ...(data ?? {}), email: user.email })
      } catch (err) {
        console.error('Dashboard load error:', err)
        setProfile({ email: user?.email ?? '' })
      } finally {
        setLoading(false)
      }
    }).catch(() => {
      window.location.href = '/login'
    })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#1a3b70] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const name = profile?.full_name?.split(' ')[0] || profile?.username || 'Student'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-100 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          <span className="font-black text-[#1a3b70]">LawFlash AI</span>
        </div>
        <button onClick={async () => { const s = createClient(); await s.auth.signOut(); window.location.href = '/login' }}
          className="text-xs text-slate-400 hover:text-[#1a3b70] font-medium">Sign out</button>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">{greeting}, {name} 👋</h1>
          <p className="text-slate-500 text-sm mt-1">Ready to master your Bar Finals?</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/study" className="bg-[#1a3b70] rounded-xl p-4 text-white">
            <div className="text-2xl mb-2">🃏</div>
            <div className="font-black">Flashcards</div>
            <div className="text-white/60 text-xs mt-0.5">1,328 cards ready</div>
          </Link>
          <Link href="/exam" className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-black text-slate-900">MCQ Exam</div>
            <div className="text-slate-400 text-xs mt-0.5">1,250 questions</div>
          </Link>
        </div>

        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Your Courses</h2>
        <div className="space-y-3">
          {COURSES.map(course => (
            <div key={course.id} className="bg-white rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{course.icon}</span>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{course.name}</div>
                  <div className="text-xs text-slate-400">{course.cards} cards · {course.mcqs} MCQs</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href={`/study?course_id=${course.id}`}
                  className="py-2 bg-[#1a3b70] text-white text-xs font-bold rounded-lg text-center">
                  Study Cards
                </Link>
                <Link href={`/exam?course_id=${course.id}`}
                  className="py-2 bg-slate-50 text-[#1a3b70] text-xs font-bold rounded-lg text-center border border-slate-200">
                  Take Exam
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex">
        {[
          { icon: '🏠', label: 'Home', href: '/dashboard' },
          { icon: '🃏', label: 'Study', href: '/study' },
          { icon: '📝', label: 'Exam', href: '/exam' },
          { icon: '🏆', label: 'Ranks', href: '/leaderboard' },
          { icon: '📊', label: 'Progress', href: '/progress' },
        ].map(item => (
          <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center py-3 text-slate-400 hover:text-[#1a3b70]">
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
