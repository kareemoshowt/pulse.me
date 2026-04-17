'use client'

import { usePulseStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Header() {
  const { profile } = usePulseStore()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const streak = profile?.current_streak || 0
  const level = profile?.level || 1
  const xp = profile?.xp || 0
  const xpInLevel = xp % 100
  const xpProgress = xpInLevel / 100

  return (
    <header className="px-5 pt-6 pb-4">
      <div className="flex justify-between items-center">
        {/* Left: Brand + streak */}
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-semibold tracking-[0.14em] text-white/25 uppercase">
              Week {new Date().toLocaleDateString('en-US', { week: 'numeric' } as any)}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-[-0.03em]">PULSE</h1>
        </div>

        {/* Right: Streak + avatar */}
        <div className="flex items-center gap-3">
          {/* Streak pill */}
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(245,197,66,0.1)', border: '1px solid rgba(245,197,66,0.2)' }}
            >
              <span className="text-xs">🔥</span>
              <span className="text-xs font-bold" style={{ color: 'var(--pulse-amber)' }}>
                {streak}
              </span>
            </motion.div>
          )}

          {/* Avatar */}
          <button
            onClick={handleSignOut}
            className="relative w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-sm font-semibold"
            style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
            title="Sign out"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/70">
                {profile?.full_name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || '?'}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* XP progress bar */}
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="stat-label text-white/20">LVL {level}</span>
          <span className="stat-label text-white/20">{xpInLevel} / 100 XP</span>
        </div>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            style={{ background: 'var(--pulse-amber)', width: `${xpProgress * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress * 100}%` }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </header>
  )
}
