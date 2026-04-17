'use client'

import { usePulseStore } from '@/lib/store'
import { motion } from 'framer-motion'

export default function StatsBar() {
  const { profile, currentSprint } = usePulseStore()

  const streak = profile?.current_streak || 0
  const weeklyStars = currentSprint?.total_stars || 0
  const level = profile?.level || 1
  const xp = profile?.xp || 0

  const stats = [
    {
      label: 'Streak',
      value: streak,
      unit: streak === 1 ? 'day' : 'days',
      color: '#F5C542',
      positive: streak > 0,
    },
    {
      label: 'This week',
      value: weeklyStars,
      unit: '/ 35★',
      color: '#4A9EFF',
      positive: weeklyStars > 0,
    },
    {
      label: 'Level',
      value: level,
      unit: `· ${xp} XP`,
      color: '#00C805',
      positive: true,
    },
  ]

  return (
    <div className="px-5 pb-5">
      <div className="grid grid-cols-3 gap-px bg-white/[0.05] rounded-xl overflow-hidden border border-white/[0.05]">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#0a0a0a] px-4 py-4"
          >
            <div className="stat-label mb-2">{stat.label}</div>
            <div className="flex items-baseline gap-1.5">
              <span
                className="font-bold tracking-tight"
                style={{
                  fontSize: '26px',
                  lineHeight: 1,
                  color: stat.positive ? stat.color : 'rgba(255,255,255,0.3)',
                }}
              >
                {stat.value}
              </span>
              <span className="text-[11px] text-white/25 font-medium">{stat.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
