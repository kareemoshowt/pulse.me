import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-black">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
        <span className="text-lg font-bold tracking-tight">PULSE</span>
        <div className="flex items-center gap-3">
          <Link href="/auth?mode=login" className="text-sm text-white/50 hover:text-white transition-colors font-medium">
            Log in
          </Link>
          <Link href="/auth" className="btn-primary !py-2 !px-5 !text-sm !rounded-lg">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs text-white/50 font-medium tracking-wide">Your Life Operating System</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] leading-none mb-6">
          Build habits.<br />
          <span style={{ color: 'var(--pulse-amber)' }}>Level up.</span>
        </h1>
        
        <p className="text-lg text-white/40 max-w-md mb-12 leading-relaxed font-light">
          25 daily missions across 5 life categories. Earn stars, build streaks, and track your progress like never before.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mb-20">
          <Link href="/auth" className="btn-primary text-center flex-1">
            Start for free
          </Link>
          <Link href="/dashboard?demo=true" className="btn-secondary text-center flex-1">
            See demo
          </Link>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 max-w-lg">
          {[
            { label: 'Mind', color: '#F5C542', icon: '☀️' },
            { label: 'Work', color: '#4A9EFF', icon: '💼' },
            { label: 'Body', color: '#00C805', icon: '💪' },
            { label: 'Connect', color: '#FF6B8A', icon: '❤️' },
            { label: 'Discipline', color: '#A78BFA', icon: '🛡️' },
          ].map((cat) => (
            <div
              key={cat.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border"
              style={{ borderColor: `${cat.color}30`, background: `${cat.color}08` }}
            >
              <span className="text-sm">{cat.icon}</span>
              <span className="text-sm font-medium" style={{ color: cat.color }}>{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-6 py-10 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '25', label: 'Daily missions' },
            { value: '5★', label: 'Stars to earn daily' },
            { value: '52', label: 'Week sprints per year' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold tracking-tight mb-1">{s.value}</div>
              <div className="text-sm text-white/30 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature grid */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-px bg-white/[0.06]">
          {[
            {
              icon: '🎯',
              title: 'Mission System',
              desc: 'Hit 3 of 5 missions in a category to earn its star. 5 categories, 5 stars max per day.',
            },
            {
              icon: '🔥',
              title: 'Streak Multipliers',
              desc: 'Keep your streak alive to earn XP multipliers up to 3×. Consistency compounds.',
            },
            {
              icon: '📊',
              title: 'Weekly Sprints',
              desc: 'Every week is a sprint. Track your rolling average and compete across 52 weeks.',
            },
          ].map((f, i) => (
            <div key={i} className="bg-black p-8">
              <div className="text-2xl mb-4">{f.icon}</div>
              <div className="font-semibold text-white mb-2 tracking-tight">{f.title}</div>
              <div className="text-sm text-white/35 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-8 flex items-center justify-between">
        <span className="text-sm font-bold tracking-tight">PULSE</span>
        <span className="text-xs text-white/20">Built for the relentless.</span>
      </footer>
    </main>
  )
}
