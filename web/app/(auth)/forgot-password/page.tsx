'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-[#1a3b70] rounded-xl flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white text-xl">balance</span>
            </div>
            <span className="text-xl font-extrabold text-[#1a3b70]">LawFlash AI</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Reset your password</h1>
          <p className="text-slate-500 text-sm">We&apos;ll email you a link to reset it</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-green-600 text-2xl">mark_email_read</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Email sent!</h2>
              <p className="text-slate-500 text-sm">
                Reset link sent to <span className="text-[#1a3b70] font-semibold">{email}</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: 20 }}>mail</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1a3b70] focus:ring-2 focus:ring-[#1a3b70]/20 transition-all" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-[#1a3b70] hover:bg-[#162f5a] disabled:opacity-60 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                ) : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          <Link href="/login" className="text-[#1a3b70] font-semibold hover:underline inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
