'use client'

import { useState } from 'react'
import { usePulseStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import HeatMap from '@/components/stats/HeatMap'
import { InsightsCard, StreakCard, CorrelationCard } from '@/components/stats/Insights'
import ShareCard from '@/components/ui/ShareCard'
import { calculateLevel } from '@/lib/gamification'

export default function StatsPage() {
  const { profile, categories, currentSprint, completions, missions, insights } = usePulseStore()
  const [showShareCard, setShowShareCard] = useState(false)
  
  const levelInfo = calculateLevel(profile?.xp || 0)

  // Calculate weekly stars per category
  const categoryWeeklyProgress = categories.map(cat => {
    // This is a simplified calculation - in production you'd compute from completions
    const weeklyStars = Math.floor(Math.random() * 7) // Mock for now
    return {
      code: cat.code,
      name: cat.name,
      color: cat.color,
      weeklyProgress: weeklyStars,
    }
  })

  // Mock correlations - in production, calculate from actual data
  const correlations = [
    {
      trigger: { code: 'M1', name: 'Morning Routine' },
      effect: { code: 'M3', name: 'Health' },
      correlation: 0.82,
      description: 'When you complete your morning routine, you exercise 82% of the time',
    },
    {
      trigger: { code: 'M5', name: 'Awareness' },
      effect: { code: 'M2', name: 'Career' },
      correlation: 0.71,
      description: 'Avoiding distractions correlates with better work performance',
    },
  ]

  const stats = [
    { label: 'Current Streak', value: profile?.current_streak || 0, unit: 'days', color: '#EF9F27' },
    { label: 'Longest Streak', value: profile?.longest_streak || 0, unit: 'days', color: '#378ADD' },
    { label: 'Total Stars', value: profile?.total_stars || 0, unit: '★', color: '#1D9E75' },
    { label: 'Level', value: levelInfo.level, unit: '', color: '#D4537E' },
    { label: 'XP', value: profile?.xp || 0, unit: 'pts', color: '#7F77DD' },
    { label: 'This Week', value: currentSprint?.total_stars || 0, unit: '/35★', color: '#EF9F27' },
  ]

  return (
    <div className="min-h-screen pb-24">
      {/* Share Card Modal */}
      <AnimatePresence>
        {showShareCard && profile && (
          <ShareCard
            profile={{
              full_name: profile.full_name,
              current_streak: profile.current_streak || 0,
              longest_streak: profile.longest_streak || 0,
              level: levelInfo.level,
              xp: profile.xp || 0,
              total_stars: profile.total_stars || 0,
            }}
            weeklyStars={currentSprint?.total_stars || 0}
            categories={categoryWeeklyProgress}
            onClose={() => setShowShareCard(false)}
          />
        )}
      </AnimatePresence>

      <header className="px-5 pt-5 pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Statistics</h1>
          <p className="text-white/40 text-sm">Your performance over time</p>
        </div>
        <button
          onClick={() => setShowShareCard(true)}
          className="px-4 py-2 rounded-xl bg-pulse-blue/20 text-pulse-blue text-sm font-medium hover:bg-pulse-blue/30 transition-colors"
        >
          📤 Share
        </button>
      </header>

      {/* Main Stats Grid */}
      <div className="px-5 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-4"
            >
              <div className="text-xs text-white/40 mb-2">{stat.label}</div>
              <div className="flex items-baseline gap-1">
                <span 
                  className="text-3xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </span>
                <span className="text-sm text-white/30">{stat.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Streak Card */}
      <div className="px-5 pb-6">
        <StreakCard 
          streakDays={profile?.current_streak || 0}
          longestStreak={profile?.longest_streak || 0}
        />
      </div>

      {/* Level Progress */}
      <div className="px-5 pb-6">
        <div className="card p-5">
          <div className="flex justify-between items-center mb-3">
            <div className="text-xs text-white/40 tracking-widest">LEVEL PROGRESS</div>
            <div className="text-sm">
              <span className="text-pulse-green font-bold">{levelInfo.currentXP}</span>
              <span className="text-white/30"> / {levelInfo.requiredXP} XP</span>
            </div>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progress}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-pulse-green to-pulse-blue rounded-full"
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/40">
            <span>Level {levelInfo.level}</span>
            <span>Level {levelInfo.level + 1}</span>
          </div>
        </div>
      </div>

      {/* Heat Map */}
      <div className="px-5 pb-6">
        <HeatMap
          completions={completions}
          categories={categories}
          missions={missions}
          weeks={12}
        />
      </div>

      {/* Insights */}
      <div className="px-5 pb-6">
        <InsightsCard 
          insights={insights}
          streakDays={profile?.current_streak || 0}
        />
      </div>

      {/* Habit Correlations */}
      <div className="px-5 pb-6">
        <CorrelationCard correlations={correlations} />
      </div>

      {/* Category Performance */}
      <div className="px-5 pb-6">
        <div className="text-xs text-white/40 tracking-widest mb-3">CATEGORY PERFORMANCE</div>
        <div className="space-y-3">
          {categories.map((cat, i) => {
            const weeklyHits = Math.floor(Math.random() * 7)
            const avgCompletion = Math.floor(Math.random() * 40) + 60
            
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: cat.color }}
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{cat.name}</div>
                      <div className="text-xs text-white/40">{cat.code}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{ color: cat.color }}>
                      {weeklyHits}/7
                    </div>
                    <div className="text-xs text-white/40">this week</div>
                  </div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${avgCompletion}%` }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: cat.color }}
                  />
                </div>
                <div className="text-xs text-white/40 mt-1 text-right">
                  {avgCompletion}% avg completion
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
