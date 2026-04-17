'use client'

import { usePulseStore } from '@/lib/store'

export default function StatsBar() {
  const { profile, currentSprint, completions } = usePulseStore()

  const stats = [
    { 
      label: 'STREAK', 
      value: profile?.current_streak || 0, 
      unit: 'days', 
      color: '#EF9F27' 
    },
    { 
      label: 'WEEKLY', 
      value: currentSprint?.total_stars || 0, 
      unit: '/35★', 
      color: '#378ADD' 
    },
    { 
      label: 'LEVEL', 
      value: profile?.level || 1, 
      unit: `${((profile?.xp || 0) % 100)}xp`, 
      color: '#1D9E75' 
    },
  ]

  return (
    <div className="flex gap-3 px-5 pb-4 overflow-x-auto scrollbar-hide">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex-shrink-0 min-w-[100px] card px-4 py-3"
        >
          <div className="text-[10px] text-white/40 tracking-wider">
            {stat.label}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span 
              className="text-2xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </span>
            <span className="text-xs text-white/30">{stat.unit}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
