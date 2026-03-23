'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AppNav from '@/components/AppNav'

interface Flashcard {
  id: string
  front_text: string
  back_text: string
  difficulty: 'basic_recall' | 'application' | 'analysis'
  chapter_id: string
}

const COURSE_NAMES: Record<string, string> = {
  '65e185b9-6471-4e13-b9fc-5a502b5b6c49': 'Criminal Litigation',
  'f3f9762e-2d0a-4258-b94e-5a544c1b9c98': 'Civil Litigation',
  'a3e6e6a1-20c8-4a3b-bbc4-e2022db599b8': 'Professional Ethics',
  '8f524136-30f6-4a75-b660-c70338c1b090': 'Company Law & Practice',
  '6b05c6f6-1093-4690-adce-4a814a9ff178': 'Property Law & Practice',
}

function StudySession() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get('course_id')
  const chapterId = searchParams.get('chapter_id')

  const [cards, setCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reviewed, setReviewed] = useState(0)
  const [done, setDone] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [xpTotal, setXpTotal] = useState(0)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUserId(user.id)

      const { data: profile } = await supabase
        .from('users').select('username, xp_total').eq('id', user.id).single()
      if (profile) { setUsername(profile.username || ''); setXpTotal(profile.xp_total || 0) }

      // Resolve chapter IDs
      let chapterIds: string[] = []
      if (chapterId) {
        chapterIds = [chapterId]
      } else if (courseId) {
        const { data: chapters } = await supabase
          .from('chapters').select('id').eq('course_id', courseId)
        chapterIds = chapters?.map(c => c.id) ?? []
      }

      // Fetch flashcards
      let query = supabase
        .from('flashcards')
        .select('id, front_text, back_text, difficulty, chapter_id')
        .limit(50)

      const { data, error } = chapterIds.length > 0
        ? await query.in('chapter_id', chapterIds)
        : await query

      if (!error && data && data.length > 0) {
        setCards([...data].sort(() => Math.random() - 0.5))
      }
      setLoading(false)
    }
    init()
  }, [courseId, chapterId])

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === 'Space') { e.preventDefault(); setIsFlipped(f => !f) }
      if (isFlipped) {
        if (e.key === '1') rate('hard')
        if (e.key === '2') rate('good')
        if (e.key === '3') rate('easy')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlipped, currentIndex])

  async function rate(rating: 'hard' | 'good' | 'easy') {
    const card = cards[currentIndex]
    if (!card || !userId) return

    const supabase = createClient()

    // Fetch existing progress row (for previous interval_days, ease_factor, times_correct)
    const { data: prev } = await supabase
      .from('user_progress')
      .select('interval_days, ease_factor, times_reviewed, times_correct')
      .eq('user_id', userId)
      .eq('flashcard_id', card.id)
      .maybeSingle()

    const prevInterval = prev?.interval_days ?? 1
    const prevEase = prev?.ease_factor ?? 2.5
    const prevTimesCorrect = prev?.times_correct ?? 0
    const prevTimesReviewed = prev?.times_reviewed ?? 0

    // SM-2 calculations
    let newInterval: number
    let newEase: number
    let newTimesCorrect: number

    if (rating === 'hard') {
      newInterval = 1
      newEase = prevEase                       // ease unchanged
      newTimesCorrect = prevTimesCorrect       // not counted as correct
    } else if (rating === 'good') {
      newInterval = Math.max(1, Math.round(prevInterval * prevEase))
      newEase = prevEase
      newTimesCorrect = prevTimesCorrect + 1
    } else {
      // easy
      newInterval = Math.max(1, Math.round(prevInterval * prevEase * 1.3))
      newEase = Math.min(prevEase + 0.1, 4.0) // cap at 4.0
      newTimesCorrect = prevTimesCorrect + 1
    }

    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval)

    await supabase.from('user_progress').upsert(
      {
        user_id: userId,
        flashcard_id: card.id,
        last_rating: rating,
        interval_days: newInterval,
        next_review_date: nextReviewDate.toISOString().split('T')[0],
        ease_factor: newEase,
        times_reviewed: prevTimesReviewed + 1,
        times_correct: newTimesCorrect,
      },
      { onConflict: 'user_id,flashcard_id' }
    )

    const next = currentIndex + 1
    setReviewed(r => r + 1)
    if (next >= cards.length) {
      setDone(true)
    } else {
      setCurrentIndex(next)
      setIsFlipped(false)
    }
  }

  const courseName = courseId ? (COURSE_NAMES[courseId] ?? 'Study Session') : 'Study Session'
  const current = cards[currentIndex]
  const progress = cards.length > 0 ? (currentIndex / cards.length) * 100 : 0

  const difficultyBadge = {
    basic_recall: 'bg-green-100 text-green-700',
    application: 'bg-yellow-100 text-yellow-700',
    analysis: 'bg-red-100 text-red-700',
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8F0FE] flex items-center justify-center">
        <AppNav username={username} xpTotal={xpTotal} />
        <div className="md:ml-72 flex items-center justify-center w-full">
          <div className="text-center">
            <span className="w-10 h-10 border-3 border-[#1a3b70]/20 border-t-[#1a3b70] rounded-full animate-spin inline-block mb-4" />
            <p className="text-slate-500 text-sm">Loading your cards...</p>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!loading && cards.length === 0) {
    return (
      <div className="min-h-screen bg-[#E8F0FE]">
        <AppNav username={username} xpTotal={xpTotal} />
        <div className="md:ml-72 flex items-center justify-center min-h-screen p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[#1a3b70] text-4xl">style</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No flashcards yet</h2>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              Cards for <strong>{courseName}</strong> are being generated. Check back soon — content is being added daily.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[#1a3b70] text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-[#162f5a] transition-all"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Session complete
  if (done) {
    return (
      <div className="min-h-screen bg-[#E8F0FE]">
        <AppNav username={username} xpTotal={xpTotal} />
        <div className="md:ml-72 flex items-center justify-center min-h-screen p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Session Complete!</h2>
            <p className="text-slate-500 mb-1">
              You reviewed <span className="text-[#1a3b70] font-bold">{reviewed} card{reviewed !== 1 ? 's' : ''}</span>
            </p>
            <p className="text-[#c5a059] text-sm font-bold mb-8">+{reviewed * 5} XP earned</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => { setCurrentIndex(0); setIsFlipped(false); setDone(false); setReviewed(0) }}
                className="inline-flex items-center gap-2 bg-[#1a3b70] text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-[#162f5a] transition-all"
              >
                <span className="material-symbols-outlined text-base">refresh</span>
                Study Again
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-white text-slate-700 font-bold px-6 py-3 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all"
              >
                <span className="material-symbols-outlined text-base">home</span>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E8F0FE]">
      <AppNav username={username} xpTotal={xpTotal} />

      <div className="md:ml-72 flex flex-col min-h-screen">

        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-white/50 px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </Link>
                <div>
                  <h2 className="text-[#1a3b70] font-bold text-sm uppercase tracking-wider">{courseName}</h2>
                  <p className="text-slate-400 text-xs">Card {currentIndex + 1} of {cards.length}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#1a3b70] text-xs font-bold">{Math.round(progress)}%</div>
                <div className="text-slate-400 text-xs">{reviewed} reviewed</div>
              </div>
            </div>
            <div className="h-1.5 w-full bg-[#1a3b70]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1a3b70] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-lg">

            {/* Difficulty badge */}
            <div className="flex justify-center mb-4">
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                difficultyBadge[current?.difficulty ?? 'basic_recall']
              }`}>
                {(current?.difficulty ?? 'basic recall').replace('_', ' ')}
              </span>
            </div>

            {/* Flashcard — 3D flip */}
            <div
              className="relative cursor-pointer select-none"
              style={{ perspective: '1200px', height: '320px' }}
              onClick={() => setIsFlipped(f => !f)}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 bg-white rounded-2xl shadow-xl flex flex-col p-8 items-center justify-center text-center overflow-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a3b70]/5 rounded-full -translate-y-16 translate-x-16" />
                  <p className="text-[#1a3b70]/30 text-xs font-bold uppercase tracking-[0.2em] mb-5">Question</p>
                  <p className="text-[#1a3b70] text-xl font-bold leading-snug">
                    {current?.front_text}
                  </p>
                  <div className="absolute bottom-5 flex items-center gap-1.5 text-slate-300 text-xs">
                    <span className="material-symbols-outlined text-sm">touch_app</span>
                    <span>Tap to reveal</span>
                    <kbd className="hidden sm:inline ml-1 px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono text-slate-400">Space</kbd>
                  </div>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 bg-[#1a3b70] rounded-2xl shadow-xl flex flex-col p-8 items-center justify-center text-center"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-5">Answer</p>
                  <p className="text-white text-lg font-medium leading-relaxed">
                    {current?.back_text}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating buttons — appear after flip */}
            <div
              className={`mt-5 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            >
              <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                How well did you know this?
              </p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={e => { e.stopPropagation(); rate('hard') }}
                  className="flex flex-col items-center gap-1 py-4 bg-red-50 border-2 border-red-200 hover:bg-red-100 text-red-600 rounded-xl transition-all hover:scale-105 active:scale-95"
                >
                  <span className="material-symbols-outlined text-2xl">sentiment_very_dissatisfied</span>
                  <span className="font-bold text-sm">Hard</span>
                  <span className="text-[10px] text-red-400">1 min</span>
                  <kbd className="text-[10px] px-1.5 py-0.5 bg-red-100 rounded font-mono">1</kbd>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); rate('good') }}
                  className="flex flex-col items-center gap-1 py-4 bg-yellow-50 border-2 border-yellow-200 hover:bg-yellow-100 text-yellow-600 rounded-xl transition-all hover:scale-105 active:scale-95"
                >
                  <span className="material-symbols-outlined text-2xl">sentiment_satisfied</span>
                  <span className="font-bold text-sm">Good</span>
                  <span className="text-[10px] text-yellow-500">1 day</span>
                  <kbd className="text-[10px] px-1.5 py-0.5 bg-yellow-100 rounded font-mono">2</kbd>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); rate('easy') }}
                  className="flex flex-col items-center gap-1 py-4 bg-green-50 border-2 border-green-200 hover:bg-green-100 text-green-600 rounded-xl transition-all hover:scale-105 active:scale-95"
                >
                  <span className="material-symbols-outlined text-2xl">sentiment_very_satisfied</span>
                  <span className="font-bold text-sm">Easy</span>
                  <span className="text-[10px] text-green-500">4 days</span>
                  <kbd className="text-[10px] px-1.5 py-0.5 bg-green-100 rounded font-mono">3</kbd>
                </button>
              </div>
            </div>

            {/* Flip hint */}
            {!isFlipped && (
              <p className="text-center text-slate-400 text-xs mt-4">
                Click card or press{' '}
                <kbd className="px-1.5 py-0.5 bg-white rounded shadow-sm font-mono text-[10px]">Space</kbd>{' '}
                to flip
              </p>
            )}
          </div>
        </div>

        {/* Mobile nav spacer */}
        <div className="h-20 md:hidden" />
      </div>
    </div>
  )
}

export default function StudyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#E8F0FE] flex items-center justify-center">
        <div className="text-center">
          <span className="w-10 h-10 border-2 border-[#1a3b70]/20 border-t-[#1a3b70] rounded-full animate-spin inline-block mb-4" />
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <StudySession />
    </Suspense>
  )
}
