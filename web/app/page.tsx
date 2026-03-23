import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-light font-display">

      {/* ── Sticky Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border-light shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>balance</span>
            </div>
            <span className="text-lg font-extrabold text-primary tracking-tight">LawFlash AI</span>
          </div>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Features</a>
            <a href="#courses" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Courses</a>
            <a href="#pricing" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Pricing</a>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-primary font-semibold text-sm hover:text-primary-hover transition-colors px-3 py-2">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-primary hover:bg-primary-hover text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-primary transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero — Two Column ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Built for Nigerian Law Students</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-[1.1] tracking-tight mb-5">
              Master Nigerian Law,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-gold">
                One Card at a Time.
              </span>
            </h1>

            <p className="text-text-muted text-lg leading-relaxed mb-8 max-w-lg">
              The ultimate AI-powered study companion for Nigerian Bar Final students.
              Spaced repetition flashcards, timed MCQ exams, and gamified learning — all tailored to the NLS curriculum.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-7 py-4 rounded-xl shadow-primary transition-all text-base"
              >
                Start Learning Free
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-text-primary font-semibold px-7 py-4 rounded-xl border border-border-light transition-all text-base shadow-card"
              >
                <span className="material-symbols-outlined text-xl text-gold">play_circle</span>
                View Demo
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['#1a3b70', '#c5a059', '#0f766e', '#7c3aed'].map((color, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {['A', 'B', 'C', 'D'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-gold text-sm font-bold">
                  {'★★★★★'}
                  <span className="text-text-primary font-extrabold ml-1">4.9</span>
                </div>
                <p className="text-text-muted text-xs">Trusted by 500+ Bar Final students</p>
              </div>
            </div>
          </div>

          {/* Right — Card mockup */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Glow */}
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl" />

            <div className="relative w-full max-w-sm">
              {/* Main card */}
              <div className="bg-white rounded-2xl shadow-xl border border-border-light p-6">
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-white" style={{ fontSize: 16 }}>style</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text-primary">Criminal Litigation</div>
                      <div className="text-[10px] text-text-muted">Card 24 of 50</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">48% Mastered</div>
                </div>

                {/* Progress */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full mb-5 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '48%' }} />
                </div>

                {/* Flashcard */}
                <div className="bg-gradient-to-br from-primary to-primary-hover rounded-xl p-6 mb-5 relative overflow-hidden min-h-[120px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-6 translate-x-6" />
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Question</span>
                  <p className="text-white font-semibold text-sm leading-relaxed mt-2">
                    What is the key distinction between an indictable offence and a summary offence under the ACJA?
                  </p>
                  <div className="flex items-center gap-1 mt-3">
                    <span className="material-symbols-outlined text-white/50" style={{ fontSize: 14 }}>touch_app</span>
                    <span className="text-white/50 text-[10px]">Tap to reveal answer</span>
                  </div>
                </div>

                {/* Rating buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Hard', color: 'bg-red-50 text-red-500 border-red-100', icon: 'sentiment_very_dissatisfied' },
                    { label: 'Good', color: 'bg-yellow-50 text-yellow-600 border-yellow-100', icon: 'sentiment_satisfied' },
                    { label: 'Easy', color: 'bg-green-50 text-green-600 border-green-100', icon: 'sentiment_very_satisfied' },
                  ].map(b => (
                    <button key={b.label} className={`${b.color} border rounded-xl py-2.5 flex flex-col items-center gap-1 text-xs font-bold`}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{b.icon}</span>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floating badge — streak */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg border border-border-light px-4 py-3 flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="text-text-primary font-extrabold text-lg leading-none">15</div>
                  <div className="text-text-muted text-[10px] font-medium">day streak</div>
                </div>
              </div>

              {/* Floating badge — XP */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg border border-border-light px-4 py-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-gold" style={{ fontSize: 18 }}>bolt</span>
                </div>
                <div>
                  <div className="text-text-primary font-extrabold text-sm leading-none">+25 XP</div>
                  <div className="text-text-muted text-[10px]">Session complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-white border-y border-border-light py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '1,260+', label: 'AI Flashcards' },
            { value: '1,250+', label: 'MCQ Questions' },
            { value: '5', label: 'Bar Courses' },
            { value: '500+', label: 'Students' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="text-text-muted text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-primary py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Everything you need to pass
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Purpose-built tools for the Nigerian Bar Finals — not generic study apps.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: 'psychology',
                title: 'Spaced Repetition',
                desc: 'SM-2 algorithm schedules reviews at the perfect time. Rate cards Hard, Good, or Easy — the system adapts to your memory.',
                stat: '3× better retention',
              },
              {
                icon: 'auto_awesome',
                title: 'AI Case Summaries',
                desc: 'Every flashcard is AI-generated from the actual NLS curriculum. Complex cases distilled into clear, examinable summaries.',
                stat: 'RAG-powered accuracy',
              },
              {
                icon: 'fact_check',
                title: 'Curated Content',
                desc: 'Past exam questions, model answers, and topic breakdowns — manually reviewed and approved for quality.',
                stat: '100% NLS-aligned',
              },
            ].map((f) => (
              <div key={f.title} className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-all">
                <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-gold text-2xl">{f.icon}</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{f.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm mb-5">{f.desc}</p>
                <div className="inline-flex items-center gap-1 text-gold text-xs font-bold bg-gold/10 px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  {f.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Courses ── */}
      <section id="courses" className="py-24 px-4 sm:px-6 bg-bg-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">All 5 Bar Final courses</h2>
            <p className="text-text-muted text-lg">125 chapters, fully covered.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: 'gavel', name: 'Criminal Litigation', chapters: 25, desc: 'Procedures, evidence, sentencing, ACJA' },
              { icon: 'balance', name: 'Civil Litigation', chapters: 25, desc: 'Civil procedure, ADR, enforcement' },
              { icon: 'verified_user', name: 'Professional Ethics', chapters: 25, desc: 'RPC, duties, disciplinary proceedings' },
              { icon: 'corporate_fare', name: 'Company Law & Practice', chapters: 25, desc: 'Incorporation, directors, winding up' },
              { icon: 'domain', name: 'Property Law & Practice', chapters: 25, desc: 'Land Use Act, conveyancing, mortgages' },
            ].map((c) => (
              <div key={c.name} className="bg-white rounded-2xl p-6 border border-border-light shadow-card hover:shadow-card-hover transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-2xl">{c.icon}</span>
                </div>
                <h3 className="font-bold text-text-primary mb-1">{c.name}</h3>
                <p className="text-text-muted text-sm mb-3">{c.desc}</p>
                <div className="text-xs font-bold text-primary/70">{c.chapters} chapters</div>
              </div>
            ))}
            {/* CTA card */}
            <div className="bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-white text-2xl">rocket_launch</span>
                </div>
                <h3 className="font-bold text-white mb-2">Ready to start?</h3>
                <p className="text-white/70 text-sm">Create a free account and begin with any course.</p>
              </div>
              <Link href="/signup" className="mt-6 inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-all w-fit">
                Get Started Free
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">Simple pricing</h2>
            <p className="text-text-muted text-lg">Start free. No credit card required.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* Free */}
            <div className="rounded-2xl p-8 border-2 border-border-light">
              <div className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2">Free</div>
              <div className="text-4xl font-extrabold text-text-primary mb-1">₦0</div>
              <div className="text-text-muted text-sm mb-8">Forever free</div>
              <ul className="space-y-3 mb-8">
                {['5 flashcards/day', '3 MCQs/day (untimed)', '1 course preview', 'Basic progress'].map(i => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
                    <span className="material-symbols-outlined text-slate-300 text-base">check</span>
                    {i}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center py-3 rounded-xl border-2 border-border-light text-text-muted hover:border-primary hover:text-primary transition-all font-semibold text-sm">
                Start Free
              </Link>
            </div>

            {/* Beta — featured */}
            <div className="rounded-2xl p-8 border-2 border-gold relative shadow-gold">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-xs font-extrabold px-4 py-1 rounded-full shadow-sm">
                BEST VALUE
              </div>
              <div className="text-gold text-xs font-bold uppercase tracking-widest mb-2">Beta</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold text-text-primary">₦2,500</span>
                <span className="text-text-muted text-sm">/mo</span>
              </div>
              <div className="text-gold text-xs font-semibold mb-8">Price locks in forever at signup</div>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited flashcards — all 5 courses',
                  'Full 59-min timed MCQ exams',
                  'Streaks, XP & leaderboard',
                  'Progress analytics',
                  'Brain Workout daily drills',
                  'Priority support',
                ].map(i => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-primary">
                    <span className="material-symbols-outlined text-gold text-base icon-fill">check_circle</span>
                    {i}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center py-3.5 rounded-xl bg-gold hover:bg-gold/90 text-white font-bold transition-all shadow-gold">
                Claim Beta Price
              </Link>
            </div>

            {/* Standard */}
            <div className="rounded-2xl p-8 border-2 border-border-light">
              <div className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2">Standard</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold text-text-primary">₦4,500</span>
                <span className="text-text-muted text-sm">/mo</span>
              </div>
              <div className="text-text-muted text-xs mb-8">After beta period ends</div>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Beta',
                  'Unlimited flashcards',
                  'Full MCQ exams',
                  'All gamification',
                  'Full analytics',
                ].map(i => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
                    <span className="material-symbols-outlined text-primary text-base">check</span>
                    {i}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all font-semibold text-sm">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-primary py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontSize: 16 }}>balance</span>
            </div>
            <span className="font-bold text-white">LawFlash AI</span>
          </div>
          <p className="text-white/50 text-sm text-center">
            Built for Nigerian Law School students. Not affiliated with NLS.
          </p>
          <div className="flex gap-6 text-white/50 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="mailto:support@lawflash.ng" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
