'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Achievement } from '@/lib/types'
import { motion } from 'framer-motion'
import Link from 'next/link'

const CATEGORY_COLORS = ['#EF9F27', '#378ADD', '#1D9E75', '#D4537E', '#5F5E5A']

export default function PokeDexPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [weeklyProgress, setWeeklyProgress] = useState(18) // Mock

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Fetch all achievements
    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*')
      .order('xp_reward')

    // Fetch user's unlocked achievements
    if (user) {
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', user.id)

      if (userAchievements) {
        setUnlockedIds(new Set(userAchievements.map(ua => ua.achievement_id)))
      }
    }

    setAchievements(allAchievements || [])
    setLoading(false)
  }

  const unlockedCount = achievements.filter(a => unlockedIds.has(a.id)).length

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-5 pt-5 pb-4">
        <Link href="/dashboard" className="text-white/40 text-sm mb-2 block">← Back</Link>
        <h1 className="text-2xl font-bold">PokeDex</h1>
        <p className="text-white/40 text-sm">Your achievement collection</p>
      </header>

      {/* Stats */}
      <div className="px-5 pb-6">
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-3xl font-bold text-pulse-amber">
                {unlockedCount}/{achievements.length}
              </div>
              <div className="text-xs text-white/40">Achievements unlocked</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-pulse-green">
                {achievements.filter(a => unlockedIds.has(a.id)).reduce((sum, a) => sum + a.xp_reward, 0)}
              </div>
              <div className="text-xs text-white/40">Total XP earned</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-pulse-amber to-pulse-green rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Weekly Habit Grid */}
      <div className="px-5 pb-6">
        <div className="text-xs text-white/40 tracking-widest mb-3">THIS WEEK'S COLLECTION</div>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 25 }, (_, i) => {
            const isCollected = i < weeklyProgress
            const catIdx = Math.floor(i / 5)
            const color = CATEGORY_COLORS[catIdx]
            
            return (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="aspect-square rounded-xl flex items-center justify-center text-lg"
                style={{
                  background: isCollected 
                    ? `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`
                    : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isCollected ? color + '40' : 'rgba(255,255,255,0.04)'}`,
                }}
              >
                {isCollected ? '✓' : <span className="opacity-10">?</span>}
              </motion.div>
            )
          })}
        </div>
        <div className="text-center text-sm text-white/40 mt-3">
          {weeklyProgress}/25 missions collected this week
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="px-5">
        <div className="text-xs text-white/40 tracking-widest mb-3">ALL ACHIEVEMENTS</div>
        
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-4 shimmer h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => {
              const isUnlocked = unlockedIds.has(achievement.id)
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`card p-4 ${!isUnlocked && 'opacity-40'}`}
                  style={{
                    borderColor: isUnlocked ? `${achievement.color}40` : undefined,
                    background: isUnlocked 
                      ? `linear-gradient(135deg, ${achievement.color}10 0%, transparent 100%)`
                      : undefined,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div 
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ 
                        background: `${achievement.color}20`,
                        color: achievement.color,
                      }}
                    >
                      +{achievement.xp_reward}xp
                    </div>
                  </div>
                  <div className="font-semibold text-sm mb-1">{achievement.name}</div>
                  <div className="text-xs text-white/40">{achievement.description}</div>
                  
                  {isUnlocked && (
                    <div className="mt-2 text-[10px] text-pulse-green">
                      ✓ Unlocked
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
