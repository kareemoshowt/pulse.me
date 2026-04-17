import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 text-xs tracking-[0.3em] text-white/40">WELCOME TO</div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-4">
          PULSE
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-md mb-2">
          Your life operating system.
        </p>
        <p className="text-sm text-white/40 max-w-sm mb-12">
          Track missions. Build streaks. Level up.
        </p>

        {/* Stars preview */}
        <div className="flex gap-2 mb-12">
          {['#EF9F27', '#378ADD', '#1D9E75', '#D4537E', '#5F5E5A'].map((color, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)` }}
            >
              {['☀️', '💼', '💪', '❤️', '🛡️'][i]}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Link href="/auth" className="btn-primary text-center flex-1">
            Get Started
          </Link>
          <Link href="/auth?mode=login" className="btn-secondary text-center flex-1">
            Sign In
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 pb-12">
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { icon: '🎯', title: '25 Daily Missions', desc: '5 categories × 5 habits' },
            { icon: '⭐', title: '5 Stars Per Day', desc: 'Hit 3+ in each category' },
            { icon: '📊', title: 'PokeDex', desc: 'Collect achievements' },
          ].map((f, i) => (
            <div key={i} className="card p-6 text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-semibold mb-1">{f.title}</div>
              <div className="text-sm text-white/40">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-white/20 py-6">
        Built for the relentless.
      </footer>
    </main>
  )
}
