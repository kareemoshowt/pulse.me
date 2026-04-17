import Link from 'next/link'

export default function Home() {
  const categories = [
    { label: 'Mind', color: '#D97706', bg: '#FEF3C7', icon: '☀️', desc: 'Morning routine, journaling, meditation' },
    { label: 'Work', color: '#1D4ED8', bg: '#DBEAFE', icon: '💼', desc: 'Deep work, priorities, skill building' },
    { label: 'Body', color: '#15803D', bg: '#DCFCE7', icon: '💪', desc: 'Sleep, training, nutrition, recovery' },
    { label: 'Connect', color: '#BE185D', bg: '#FCE7F3', icon: '❤️', desc: 'Family, presence, quality time' },
    { label: 'Discipline', color: '#6D28D9', bg: '#EDE9FE', icon: '🛡️', desc: 'Avoiding what pulls you down' },
  ]

  return (
    <main className="min-h-screen bg-white text-[#0a0a0a]" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-black/[0.06]">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black text-black"
            style={{ background: 'linear-gradient(135deg, #F5C542 0%, #F59E0B 100%)' }}
          >
            P
          </div>
          <span className="text-base font-bold tracking-[-0.02em]">PULSE</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth?mode=login" className="text-sm font-medium text-black/50 hover:text-black transition-colors">
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
            style={{ background: '#0a0a0a' }}
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="px-6 md:px-12 pt-20 pb-16 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border"
          style={{ background: '#FFFBEB', borderColor: '#FDE68A', color: '#92400E' }}>
          <span className="text-amber-500">★</span>
          Your life, gamified
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[1.02] mb-6"
          style={{ letterSpacing: '-0.04em' }}
        >
          Build the habits<br />
          that{' '}
          <span
            className="relative inline-block"
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            change everything.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-black/40 max-w-xl mx-auto mb-10 leading-relaxed font-light">
          25 daily missions. 5 life categories. Track what matters, earn stars, and watch your score rise week by week.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] text-base"
            style={{ background: '#0a0a0a', minWidth: '220px' }}
          >
            Start for free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link
            href="/auth?mode=login"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-black/60 hover:text-black transition-colors text-base border border-black/10 hover:border-black/20"
            style={{ minWidth: '220px', background: '#FAFAFA' }}
          >
            I have an account
          </Link>
        </div>
        <p className="text-xs text-black/25 font-medium">No account needed · Progress saves in your browser</p>
      </section>

      {/* ── Dashboard Preview Card ───────────────────────── */}
      <section className="px-6 md:px-12 pb-20 max-w-5xl mx-auto">
        <div
          className="rounded-2xl overflow-hidden border border-black/[0.07] shadow-2xl shadow-black/[0.08]"
        >
          {/* Fake browser bar */}
          <div className="bg-[#F5F5F5] border-b border-black/[0.06] px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex-1 mx-4 bg-white rounded-md px-3 py-1 text-xs text-black/30 border border-black/[0.08] font-medium">
              pulse.me/dashboard
            </div>
          </div>

          {/* App preview */}
          <div className="bg-[#000000] p-5">
            {/* Mini header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] text-white/25 font-semibold tracking-wider mb-0.5">WEEK 16 OF 52</div>
                <div className="text-xl font-black text-white tracking-tight">PULSE</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,197,66,0.15)', border: '1px solid rgba(245,197,66,0.3)' }}>
                  <span className="text-xs">🔥</span>
                  <span className="text-xs font-bold" style={{ color: '#F5C542' }}>7</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/70">K</div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-px bg-white/[0.05] rounded-xl overflow-hidden mb-4">
              {[
                { label: 'Streak', val: '7', unit: 'days', color: '#F5C542' },
                { label: 'This week', val: '18', unit: '/ 35★', color: '#4A9EFF' },
                { label: 'Level', val: '4', unit: '· 340 XP', color: '#00C805' },
              ].map((s) => (
                <div key={s.label} className="bg-[#0a0a0a] px-3 py-3">
                  <div className="text-[9px] text-white/25 uppercase tracking-wider mb-1 font-semibold">{s.label}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold" style={{ color: s.color }}>{s.val}</span>
                    <span className="text-[10px] text-white/25">{s.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mission cards */}
            <div className="space-y-2">
              {[
                { code: 'M1', name: 'Mind', color: '#F5C542', progress: 4, icon: '☀️' },
                { code: 'M2', name: 'Work', color: '#4A9EFF', progress: 3, icon: '💼' },
                { code: 'M3', name: 'Body', color: '#00C805', progress: 2, icon: '💪' },
              ].map((cat) => (
                <div
                  key={cat.code}
                  className="rounded-xl px-4 py-3"
                  style={{ background: '#111', border: `1px solid rgba(255,255,255,0.05)` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: `${cat.color}18` }}>
                        {cat.icon}
                      </div>
                      <span className="text-sm font-semibold text-white/80">{cat.name}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: cat.progress >= 3 ? cat.color : 'rgba(255,255,255,0.2)' }}>
                      {cat.progress}<span className="text-xs opacity-50">/5</span>
                      {cat.progress >= 3 && <span className="ml-1">★</span>}
                    </span>
                  </div>
                  <div className="h-0.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(cat.progress / 5) * 100}%`, background: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────── */}
      <section className="border-y border-black/[0.06] bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '25', label: 'Daily missions across 5 categories' },
            { value: '5★', label: 'Stars available every single day' },
            { value: '52×', label: 'Weekly sprints to run per year' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl md:text-5xl font-black tracking-[-0.04em] mb-2" style={{ color: '#0a0a0a' }}>{s.value}</div>
              <div className="text-sm text-black/40 font-medium leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-bold tracking-[0.12em] text-black/30 uppercase mb-3">The 5 Life Categories</div>
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em]">Every area that matters.</h2>
        </div>

        <div className="grid md:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="rounded-2xl p-5 border transition-all hover:shadow-lg hover:shadow-black/[0.06] hover:-translate-y-0.5"
              style={{ background: cat.bg, borderColor: `${cat.color}20` }}
            >
              <div className="text-2xl mb-3">{cat.icon}</div>
              <div className="font-bold text-sm mb-1" style={{ color: cat.color }}>{cat.label}</div>
              <div className="text-xs leading-relaxed" style={{ color: `${cat.color}99` }}>{cat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section className="bg-[#FAFAFA] border-y border-black/[0.06]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-20">
          <div className="text-center mb-14">
            <div className="text-xs font-bold tracking-[0.12em] text-black/30 uppercase mb-3">How it works</div>
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em]">Simple. Powerful. Addictive.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Check off missions',
                desc: 'Each day has 25 missions across 5 life categories. Complete at least 3 in a category to earn its star.',
                color: '#D97706',
              },
              {
                step: '02',
                title: 'Earn stars & XP',
                desc: 'Hit your daily stars to build a streak. Longer streaks unlock XP multipliers up to 3×.',
                color: '#1D4ED8',
              },
              {
                step: '03',
                title: 'Level up your life',
                desc: 'Watch your rolling average climb week by week. Unlock badges. Track 52 sprints per year.',
                color: '#15803D',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-[64px] font-black leading-none mb-4 select-none" style={{ color: `${item.color}15` }}>
                  {item.step}
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2">{item.title}</h3>
                <p className="text-sm text-black/45 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ──────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black tracking-[-0.04em] mb-4">
          Ready to run your life<br />like a system?
        </h2>
        <p className="text-base text-black/40 mb-10 font-light">
          No account. No credit card. Just open it and start.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] text-base"
          style={{ background: '#0a0a0a' }}
        >
          Open the dashboard
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-black/[0.06] px-6 md:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black text-black"
              style={{ background: 'linear-gradient(135deg, #F5C542 0%, #F59E0B 100%)' }}
            >
              P
            </div>
            <span className="text-sm font-bold tracking-tight">PULSE</span>
          </div>
          <span className="text-xs text-black/25 font-medium">Built for the relentless.</span>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-xs text-black/35 hover:text-black/60 transition-colors">Sign in</Link>
            <Link href="/dashboard" className="text-xs text-black/35 hover:text-black/60 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>

    </main>
  )
}
