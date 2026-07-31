'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CAMPUSES = [
  { value: 'Abuja', label: 'Abuja', sub: 'Headquarters (Bwari)' },
  { value: 'Lagos', label: 'Lagos', sub: 'Victoria Island' },
  { value: 'Kano', label: 'Kano', sub: 'North West Zone' },
  { value: 'Enugu', label: 'Enugu', sub: 'South East Zone' },
  { value: 'Yola', label: 'Yola', sub: 'North East Zone' },
  { value: 'Port_Harcourt', label: 'Port Harcourt', sub: 'South South Zone' },
  { value: 'Yenagoa', label: 'Yenagoa', sub: 'South South Zone' },
  { value: 'Other', label: 'Other', sub: 'Not listed' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState('')
  const [campus, setCampus] = useState('Lagos')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleComplete() {
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { error } = await supabase
        .from('users')
        .update({ username: username.trim().toLowerCase(), user_type: 'student', campus })
        .eq('id', user.id)
      if (error) { setError(error.message); setLoading(false); return }
      window.location.href = '/dashboard'
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <div className="text-center mb-2">
          <span className="text-4xl">⚖️</span>
        </div>
        <div className="flex gap-2 mb-6 mt-4">
          {[1,2].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-[#1a3b70]' : 'bg-slate-200'}`} />
          ))}
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-red-600 text-sm">{error}</div>}

        {step === 1 && (
          <>
            <h1 className="text-2xl font-black text-slate-900 mb-1">Choose your username</h1>
            <p className="text-slate-500 text-sm mb-6">This is how you appear on the leaderboard.</p>
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="e.g. advocate_smith"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3b70] mb-4"
            />
            <button onClick={() => username.trim().length >= 3 && setStep(2)}
              disabled={username.trim().length < 3}
              className="w-full py-3 bg-[#1a3b70] text-white font-bold rounded-xl disabled:opacity-40">
              Continue →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-black text-slate-900 mb-1">Select your campus</h1>
            <p className="text-slate-500 text-sm mb-4">Choose your Nigerian Law School campus.</p>
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {CAMPUSES.map(c => (
                <label key={c.value} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${campus === c.value ? 'border-[#1a3b70] bg-slate-50' : 'border-slate-200'}`}>
                  <input type="radio" name="campus" value={c.value} checked={campus === c.value} onChange={() => setCampus(c.value)} className="text-[#1a3b70]" />
                  <div>
                    <div className="font-bold text-sm text-slate-900">{c.label}</div>
                    <div className="text-xs text-slate-400">{c.sub}</div>
                  </div>
                </label>
              ))}
            </div>
            <button onClick={handleComplete} disabled={loading}
              className="w-full py-3 bg-[#1a3b70] text-white font-bold rounded-xl disabled:opacity-50 mb-2">
              {loading ? 'Saving...' : 'Complete Registration 🎉'}
            </button>
            <button onClick={() => setStep(1)} className="w-full py-2 text-slate-400 text-sm">← Back</button>
          </>
        )}
      </div>
    </div>
  )
}
