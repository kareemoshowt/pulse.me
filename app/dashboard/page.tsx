'use client'

import { useEffect, useState } from 'react'
import { usePulseStore } from '@/lib/store'
import { format, startOfWeek, addDays, isToday, getWeek } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/ui/Header'
import StatsBar from '@/components/stats/StatsBar'
import CategoryCard from '@/components/missions/CategoryCard'
import CalendarPreview from '@/components/ui/CalendarPreview'
import Celebration from '@/components/ui/Celebration'
import { DailyBonusesCard } from '@/components/stats/Insights'
import { getStreakTier } from '@/lib/gamification'

export default function DashboardPage() {
  const { 
    categories, 
    selectedDate, 
    setSelectedDate, 
    fetchUserData, 
    isLoading,
    calculateDailyStars,
    currentSprint,
    pendingCelebration,
    clearCelebration,
    profile,
    combo,
  } = usePulseStore()
  
  const [showDailyBonuses, setShowDailyBonuses] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const weekStart = startOfWeek(selectedDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const todayStars = calculateDailyStars(selectedDate)
  const streakTier = profile ? getStreakTier(profile.current_streak || 0) : null

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-4xl font-bold mb-2"
          >
            PULSE
          </motion.div>
          <div className="text-white/40 text-sm">Loading your missions...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Celebration overlay */}
      <AnimatePresence>
        {pendingCelebration && pendingCelebration.length > 0 && (
          <Celebration 
            events={pendingCelebration} 
            onComplete={clearCelebration}
          />
        )}
      </AnimatePresence>

      <Header />

      {/* Streak multiplier banner */}
      {profile && profile.current_streak >= 3 && streakTier && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-5 mb-2 px-4 py-2 rounded-xl flex items-center justify-between"
          style={{ 
            background: `${streakTier.color}15`,
            border: `1px solid ${streakTier.color}30`,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <span className="text-sm">
              <span className="font-semibold" style={{ color: streakTier.color }}>
                {streakTier.name}
              </span>
              <span className="text-white/50"> streak active</span>
            </span>
          </div>
          <div 
            className="text-sm font-bold"
            style={{ color: streakTier.color }}
          >
            {profile.current_streak >= 100 ? '3.0' : profile.current_streak >= 30 ? '2.5' : profile.current_streak >= 14 ? '2.0' : profile.current_streak >= 7 ? '1.5' : '1.25'}x XP
          </div>
        </motion.div>
      )}

      {/* Active combo indicator */}
      <AnimatePresence>
        {combo.isActive && combo.count > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-20 right-5 z-40 px-3 py-1.5 rounded-full bg-pulse-green/20 border border-pulse-green/40"
          >
            <span className="text-pulse-green font-bold">{combo.count}x</span>
            <span className="text-white/60 text-sm ml-1">combo</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Week Strip */}
      <div className="px-5 py-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-white/40 tracking-widest">
            WEEK {currentSprint?.week_number || getWeek(new Date())} OF 52
          </span>
          <button 
            onClick={() => setShowDailyBonuses(!showDailyBonuses)}
            className="flex items-center gap-2"
          >
            <div className="text-xl font-bold text-pulse-amber">
              {'★'.repeat(todayStars)}
              <span className="opacity-20">{'★'.repeat(5 - todayStars)}</span>
            </div>
            {todayStars === 5 && (
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                🎉
              </motion.span>
            )}
          </button>
        </div>
        
        <div className="flex justify-between gap-2">
          {weekDays.map((day, idx) => {
            const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
            const dayStars = calculateDailyStars(day)
            const isFuture = day > new Date()
            
            return (
              <motion.button
                key={day.toISOString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => !isFuture && setSelectedDate(day)}
                disabled={isFuture}
                className={`flex-1 py-3 rounded-xl text-center transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-pulse-amber to-pulse-amber/80'
                    : isFuture
                    ? 'bg-white/[0.02] opacity-40'
                    : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                }`}
              >
                <div className={`text-[10px] ${isSelected ? 'text-black/60' : 'text-white/40'}`}>
                  {format(day, 'EEE').charAt(0)}
                </div>
                <div className={`text-sm font-semibold ${isSelected ? 'text-black' : ''}`}>
                  {format(day, 'd')}
                </div>
                {dayStars > 0 && !isSelected && (
                  <div className="text-[8px] text-pulse-amber mt-1">
                    {'★'.repeat(Math.min(dayStars, 3))}{dayStars > 3 ? '+' : ''}
                  </div>
                )}
                {dayStars === 5 && !isSelected && (
                  <div className="text-[8px] text-pulse-green mt-0.5">Perfect!</div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      <StatsBar />

      {/* Daily Bonuses (collapsible) */}
      <AnimatePresence>
        {showDailyBonuses && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-4 overflow-hidden"
          >
            <DailyBonusesCard completedBonusIds={[]} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Missions */}
      <div className="px-5 pb-6">
        <div className="text-xs text-white/40 tracking-widest mb-3">
          {isToday(selectedDate) ? "TODAY'S MISSIONS" : format(selectedDate, 'EEEE, MMM d').toUpperCase()}
        </div>
        
        <div className="space-y-3">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <CategoryCard 
                category={category} 
                date={selectedDate}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <CalendarPreview />
    </div>
  )
}
