// PULSE Gamification Engine
// Handles XP, multipliers, combos, and rewards

export interface XPEvent {
  type: 'mission_complete' | 'star_earned' | 'perfect_day' | 'streak_bonus' | 'combo' | 'achievement'
  baseXP: number
  multiplier: number
  finalXP: number
  description: string
}

export interface ComboState {
  count: number
  lastMissionTime: number
  categoryId: string | null
  isActive: boolean
}

// Base XP values
export const XP_VALUES = {
  MISSION_COMPLETE: 10,
  STAR_EARNED: 25,
  PERFECT_DAY: 100,      // All 5 stars
  PERFECT_WEEK: 500,     // 35/35 stars
  STREAK_MILESTONE_7: 50,
  STREAK_MILESTONE_14: 100,
  STREAK_MILESTONE_30: 250,
  STREAK_MILESTONE_100: 1000,
  COMBO_BONUS: 5,        // Per combo level
}

// Streak multipliers - the longer your streak, the more XP you earn
export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 100) return 3.0
  if (streakDays >= 30) return 2.5
  if (streakDays >= 14) return 2.0
  if (streakDays >= 7) return 1.5
  if (streakDays >= 3) return 1.25
  return 1.0
}

export function getStreakTier(streakDays: number): { name: string; color: string; nextAt: number } {
  if (streakDays >= 100) return { name: 'Legendary', color: '#EF9F27', nextAt: Infinity }
  if (streakDays >= 30) return { name: 'Master', color: '#D4537E', nextAt: 100 }
  if (streakDays >= 14) return { name: 'Dedicated', color: '#378ADD', nextAt: 30 }
  if (streakDays >= 7) return { name: 'Rising', color: '#1D9E75', nextAt: 14 }
  if (streakDays >= 3) return { name: 'Building', color: '#7F77DD', nextAt: 7 }
  return { name: 'Starting', color: '#5F5E5A', nextAt: 3 }
}

// Combo system - complete missions quickly for bonus XP
const COMBO_WINDOW_MS = 30 * 1000 // 30 seconds between completions to maintain combo

export function updateCombo(
  currentCombo: ComboState,
  categoryId: string
): { newCombo: ComboState; bonusXP: number } {
  const now = Date.now()
  const timeSinceLastMission = now - currentCombo.lastMissionTime
  
  // Check if combo is still active (within time window and same category for category combo)
  const comboStillActive = timeSinceLastMission < COMBO_WINDOW_MS && currentCombo.isActive
  
  if (comboStillActive) {
    // Extend combo
    const newCount = currentCombo.count + 1
    const bonusXP = newCount * XP_VALUES.COMBO_BONUS
    return {
      newCombo: {
        count: newCount,
        lastMissionTime: now,
        categoryId,
        isActive: true,
      },
      bonusXP,
    }
  } else {
    // Start new combo
    return {
      newCombo: {
        count: 1,
        lastMissionTime: now,
        categoryId,
        isActive: true,
      },
      bonusXP: 0,
    }
  }
}

// Calculate total XP for completing a mission
export function calculateMissionXP(
  streakDays: number,
  comboCount: number,
  isStarEarning: boolean // true if this mission completion earns a category star
): XPEvent[] {
  const events: XPEvent[] = []
  const multiplier = getStreakMultiplier(streakDays)
  
  // Base mission XP
  const missionXP = Math.round(XP_VALUES.MISSION_COMPLETE * multiplier)
  events.push({
    type: 'mission_complete',
    baseXP: XP_VALUES.MISSION_COMPLETE,
    multiplier,
    finalXP: missionXP,
    description: 'Mission complete',
  })
  
  // Combo bonus
  if (comboCount > 1) {
    const comboXP = comboCount * XP_VALUES.COMBO_BONUS
    events.push({
      type: 'combo',
      baseXP: XP_VALUES.COMBO_BONUS,
      multiplier: comboCount,
      finalXP: comboXP,
      description: `${comboCount}x Combo!`,
    })
  }
  
  // Star earned bonus
  if (isStarEarning) {
    const starXP = Math.round(XP_VALUES.STAR_EARNED * multiplier)
    events.push({
      type: 'star_earned',
      baseXP: XP_VALUES.STAR_EARNED,
      multiplier,
      finalXP: starXP,
      description: '⭐ Star earned!',
    })
  }
  
  return events
}

// Check for perfect day bonus
export function checkPerfectDay(starsEarned: number): XPEvent | null {
  if (starsEarned === 5) {
    return {
      type: 'perfect_day',
      baseXP: XP_VALUES.PERFECT_DAY,
      multiplier: 1,
      finalXP: XP_VALUES.PERFECT_DAY,
      description: '🌟 PERFECT DAY! All 5 stars!',
    }
  }
  return null
}

// Level calculation - each level requires more XP
export function calculateLevel(totalXP: number): { level: number; currentXP: number; requiredXP: number; progress: number } {
  // XP required per level: 100, 150, 225, 337, 506... (1.5x increase each level)
  let level = 1
  let xpForNextLevel = 100
  let remainingXP = totalXP
  
  while (remainingXP >= xpForNextLevel) {
    remainingXP -= xpForNextLevel
    level++
    xpForNextLevel = Math.round(xpForNextLevel * 1.5)
  }
  
  return {
    level,
    currentXP: remainingXP,
    requiredXP: xpForNextLevel,
    progress: (remainingXP / xpForNextLevel) * 100,
  }
}

// Daily bonuses - special missions that rotate
export interface DailyBonus {
  id: string
  name: string
  description: string
  xpReward: number
  categoryCode: string
  condition: 'first_of_day' | 'all_in_category' | 'before_time' | 'streak_extend'
  conditionValue?: string | number
}

export function getDailyBonuses(dayOfWeek: number): DailyBonus[] {
  const bonuses: DailyBonus[] = [
    // Always available
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Complete Morning Routine before 8 AM',
      xpReward: 50,
      categoryCode: 'M1',
      condition: 'before_time',
      conditionValue: '08:00',
    },
    {
      id: 'streak_keeper',
      name: 'Streak Keeper',
      description: 'Earn at least 1 star today',
      xpReward: 25,
      categoryCode: 'all',
      condition: 'streak_extend',
    },
  ]
  
  // Day-specific bonuses
  const dayBonuses: Record<number, DailyBonus> = {
    0: { // Sunday
      id: 'sunday_reset',
      name: 'Sunday Reset',
      description: 'Complete all Family missions',
      xpReward: 75,
      categoryCode: 'M4',
      condition: 'all_in_category',
    },
    1: { // Monday
      id: 'monday_momentum',
      name: 'Monday Momentum',
      description: 'Complete 3 Career missions',
      xpReward: 50,
      categoryCode: 'M2',
      condition: 'first_of_day',
    },
    3: { // Wednesday - hump day
      id: 'midweek_warrior',
      name: 'Midweek Warrior',
      description: 'Earn all 5 stars today',
      xpReward: 100,
      categoryCode: 'all',
      condition: 'all_in_category',
    },
    5: { // Friday
      id: 'friday_focus',
      name: 'Friday Focus',
      description: 'Complete all Health missions',
      xpReward: 75,
      categoryCode: 'M3',
      condition: 'all_in_category',
    },
  }
  
  if (dayBonuses[dayOfWeek]) {
    bonuses.push(dayBonuses[dayOfWeek])
  }
  
  return bonuses
}

// Insights - detect patterns in user behavior
export interface Insight {
  type: 'warning' | 'positive' | 'tip'
  title: string
  description: string
  category?: string
  actionable?: string
}

export function generateInsights(
  completionHistory: { date: string; categoryId: string; completed: boolean }[],
  categories: { id: string; code: string; name: string }[]
): Insight[] {
  const insights: Insight[] = []
  
  // Group by day of week
  const byDayOfWeek: Record<number, { total: number; completed: number }> = {}
  const byCategoryAndDay: Record<string, Record<number, { total: number; completed: number }>> = {}
  
  completionHistory.forEach(item => {
    const date = new Date(item.date)
    const dow = date.getDay()
    
    // Overall by day
    if (!byDayOfWeek[dow]) byDayOfWeek[dow] = { total: 0, completed: 0 }
    byDayOfWeek[dow].total++
    if (item.completed) byDayOfWeek[dow].completed++
    
    // By category and day
    if (!byCategoryAndDay[item.categoryId]) byCategoryAndDay[item.categoryId] = {}
    if (!byCategoryAndDay[item.categoryId][dow]) byCategoryAndDay[item.categoryId][dow] = { total: 0, completed: 0 }
    byCategoryAndDay[item.categoryId][dow].total++
    if (item.completed) byCategoryAndDay[item.categoryId][dow].completed++
  })
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  // Find weak days per category
  Object.entries(byCategoryAndDay).forEach(([catId, days]) => {
    const cat = categories.find(c => c.id === catId)
    if (!cat) return
    
    Object.entries(days).forEach(([dow, stats]) => {
      const rate = stats.total > 0 ? stats.completed / stats.total : 0
      if (rate < 0.4 && stats.total >= 3) {
        insights.push({
          type: 'warning',
          title: `${cat.name} dips on ${dayNames[parseInt(dow)]}s`,
          description: `You complete ${cat.code} missions only ${Math.round(rate * 100)}% of the time on ${dayNames[parseInt(dow)]}s`,
          category: cat.code,
          actionable: `Set a reminder for ${dayNames[parseInt(dow)]} morning`,
        })
      }
    })
  })
  
  // Find strong patterns
  Object.entries(byDayOfWeek).forEach(([dow, stats]) => {
    const rate = stats.total > 0 ? stats.completed / stats.total : 0
    if (rate > 0.8 && stats.total >= 10) {
      insights.push({
        type: 'positive',
        title: `${dayNames[parseInt(dow)]}s are your power day!`,
        description: `You crush it with ${Math.round(rate * 100)}% completion rate`,
      })
    }
  })
  
  return insights.slice(0, 5) // Return top 5 insights
}
