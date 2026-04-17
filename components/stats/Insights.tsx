'use client'

import { motion } from 'framer-motion'
import { Insight, getStreakTier, getDailyBonuses } from '@/lib/gamification'

interface InsightsCardProps {
  insights: Insight[]
  streakDays: number
}

export function InsightsCard({ insights, streakDays }: InsightsCardProps) {
  if (insights.length === 0) return null

  const iconMap = {
    warning: '⚠️',
    positive: '🎯',
    tip: '💡',
  }

  const colorMap = {
    warning: { bg: '#EF9F2720', border: '#EF9F27', text: '#EF9F27' },
    positive: { bg: '#1D9E7520', border: '#1D9E75', text: '#1D9E75' },
    tip: { bg: '#378ADD20', border: '#378ADD', text: '#378ADD' },
  }

  return (
    <div className="card p-5">
      <div className="text-xs text-white/40 tracking-widest mb-4">INSIGHTS</div>
      
      <div className="space-y-3">
        {insights.map((insight, i) => {
          const colors = colorMap[insight.type]
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 rounded-xl"
              style={{
                background: colors.bg,
                borderLeft: `3px solid ${colors.border}`,
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{iconMap[insight.type]}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm" style={{ color: colors.text }}>
                    {insight.title}
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    {insight.description}
                  </div>
                  {insight.actionable && (
                    <div className="text-xs text-white/40 mt-2 flex items-center gap-1">
                      <span>💡</span>
                      <span>{insight.actionable}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

interface StreakCardProps {
  streakDays: number
  longestStreak: number
}

export function StreakCard({ streakDays, longestStreak }: StreakCardProps) {
  const tier = getStreakTier(streakDays)
  const progress = tier.nextAt === Infinity 
    ? 100 
    : ((streakDays - (tier.nextAt === 7 ? 0 : tier.nextAt === 14 ? 7 : tier.nextAt === 30 ? 14 : tier.nextAt === 100 ? 30 : 0)) / 
       (tier.nextAt - (tier.nextAt === 7 ? 0 : tier.nextAt === 14 ? 7 : tier.nextAt === 30 ? 14 : tier.nextAt === 100 ? 30 : 0))) * 100

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-white/40 tracking-widest">STREAK</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold" style={{ color: tier.color }}>
              {streakDays}
            </span>
            <span className="text-white/40">days</span>
          </div>
        </div>
        <div 
          className="px-3 py-1.5 rounded-full text-sm font-semibold"
          style={{ 
            background: `${tier.color}20`,
            color: tier.color,
          }}
        >
          {tier.name}
        </div>
      </div>

      {/* Progress to next tier */}
      {tier.nextAt !== Infinity && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/40 mb-1">
            <span>Next tier: {tier.nextAt} days</span>
            <span>{tier.nextAt - streakDays} to go</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full"
              style={{ background: tier.color }}
            />
          </div>
        </div>
      )}

      {/* Multiplier info */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
        <div className="text-sm text-white/60">XP Multiplier</div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-pulse-amber">
            {streakDays >= 100 ? '3.0' : streakDays >= 30 ? '2.5' : streakDays >= 14 ? '2.0' : streakDays >= 7 ? '1.5' : streakDays >= 3 ? '1.25' : '1.0'}x
          </span>
          {streakDays < 100 && (
            <span className="text-xs text-white/30">
              → {streakDays >= 30 ? '3.0' : streakDays >= 14 ? '2.5' : streakDays >= 7 ? '2.0' : streakDays >= 3 ? '1.5' : '1.25'}x
            </span>
          )}
        </div>
      </div>

      {/* Record */}
      {longestStreak > streakDays && (
        <div className="mt-3 text-center text-xs text-white/40">
          Personal best: <span className="text-white/60 font-medium">{longestStreak} days</span>
        </div>
      )}
    </div>
  )
}

interface DailyBonusesCardProps {
  completedBonusIds: string[]
}

export function DailyBonusesCard({ completedBonusIds }: DailyBonusesCardProps) {
  const today = new Date()
  const bonuses = getDailyBonuses(today.getDay())

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-white/40 tracking-widest">DAILY BONUSES</div>
        <div className="text-xs text-white/30">
          {completedBonusIds.length}/{bonuses.length} completed
        </div>
      </div>

      <div className="space-y-3">
        {bonuses.map((bonus, i) => {
          const isCompleted = completedBonusIds.includes(bonus.id)
          
          return (
            <motion.div
              key={bonus.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-3 rounded-xl flex items-center gap-3 ${
                isCompleted ? 'bg-pulse-green/20' : 'bg-white/[0.03]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isCompleted ? 'bg-pulse-green' : 'bg-white/10'
              }`}>
                {isCompleted ? (
                  <span className="text-white text-sm">✓</span>
                ) : (
                  <span className="text-xl">🎯</span>
                )}
              </div>
              
              <div className="flex-1">
                <div className={`text-sm font-medium ${isCompleted ? 'text-pulse-green' : ''}`}>
                  {bonus.name}
                </div>
                <div className="text-xs text-white/40">{bonus.description}</div>
              </div>
              
              <div className={`text-sm font-semibold ${isCompleted ? 'text-pulse-green' : 'text-pulse-amber'}`}>
                +{bonus.xpReward}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

interface CorrelationCardProps {
  correlations: {
    trigger: { code: string; name: string }
    effect: { code: string; name: string }
    correlation: number // 0-1
    description: string
  }[]
}

export function CorrelationCard({ correlations }: CorrelationCardProps) {
  if (correlations.length === 0) return null

  return (
    <div className="card p-5">
      <div className="text-xs text-white/40 tracking-widest mb-4">HABIT CORRELATIONS</div>
      
      <div className="space-y-4">
        {correlations.map((corr, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            className="p-3 rounded-xl bg-white/[0.03]"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-pulse-blue/20 text-pulse-blue">
                {corr.trigger.code}
              </span>
              <span className="text-white/30">→</span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-pulse-green/20 text-pulse-green">
                {corr.effect.code}
              </span>
              <span className="ml-auto text-lg font-bold text-pulse-amber">
                {Math.round(corr.correlation * 100)}%
              </span>
            </div>
            <div className="text-xs text-white/60">{corr.description}</div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-white/30 text-center">
        Based on your last 30 days of data
      </div>
    </div>
  )
}
