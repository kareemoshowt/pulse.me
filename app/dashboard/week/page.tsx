'use client'

import { usePulseStore } from '@/lib/store'
import { format, startOfWeek, addDays } from 'date-fns'
import Link from 'next/link'

export default function WeekPage() {
  const { categories, getCategoryProgress, calculateDailyStars, currentSprint } = usePulseStore()
  const weekStart = startOfWeek(new Date())
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="min-h-screen pb-24">
      <header className="px-5 pt-5 pb-4">
        <div className="text-xs text-white/40 tracking-widest mb-1">
          WEEK {currentSprint?.week_number || '--'} OF 52
        </div>
        <h1 className="text-2xl font-bold">Weekly Overview</h1>
      </header>

      <div className="px-5">
        {/* Week Grid */}
        <div className="card overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-8 border-b border-white/[0.06]">
            <div className="p-3 text-xs text-white/40">Mission</div>
            {weekDays.map((day, i) => (
              <div key={i} className="p-3 text-center text-xs text-white/40">
                {format(day, 'EEE').charAt(0)}
              </div>
            ))}
          </div>

          {/* Category Rows */}
          {categories.map((cat) => (
            <div key={cat.id}>
              {/* Category Header */}
              <div 
                className="px-3 py-2 text-xs font-semibold"
                style={{ background: `${cat.color}20`, color: cat.color }}
              >
                {cat.code} — {cat.name}
              </div>
              
              {/* Mission Rows */}
              {cat.missions?.map((mission) => (
                <div key={mission.id} className="grid grid-cols-8 border-b border-white/[0.04]">
                  <div className="p-2 text-xs text-white/60 truncate">
                    {mission.name}
                  </div>
                  {weekDays.map((day, i) => (
                    <div key={i} className="p-2 flex items-center justify-center">
                      <div className="w-5 h-5 rounded border border-white/10" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {/* Stars Row */}
          <div className="grid grid-cols-8 bg-white/[0.02]">
            <div className="p-3 text-xs font-semibold text-pulse-amber">Stars</div>
            {weekDays.map((day, i) => {
              const stars = calculateDailyStars(day)
              return (
                <div key={i} className="p-3 text-center">
                  <span className="text-pulse-amber font-bold">{stars}</span>
                  <span className="text-white/20">/5</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="card p-5 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-white/40 mb-1">WEEKLY TOTAL</div>
              <div className="text-3xl font-bold text-pulse-amber">
                {currentSprint?.total_stars || 0}
                <span className="text-white/20 text-lg">/35★</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/40 mb-1">DAILY AVG</div>
              <div className="text-3xl font-bold text-pulse-green">
                {currentSprint?.avg_stars?.toFixed(1) || '0.0'}
                <span className="text-white/20 text-lg">★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
