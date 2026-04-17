export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  timezone: string
  current_streak: number
  longest_streak: number
  total_stars: number
  level: number
  xp: number
}

export interface Category {
  id: string
  user_id: string
  code: string
  name: string
  color: string
  icon: string
  question?: string
  sort_order: number
  is_avoid: boolean
  missions?: Mission[]
}

export interface Mission {
  id: string
  category_id: string
  user_id: string
  name: string
  description?: string
  sort_order: number
  weekly_goal: number
  is_active: boolean
}

export interface Sprint {
  id: string
  user_id: string
  week_number: number
  year: number
  start_date: string
  end_date: string
  total_stars: number
  avg_stars: number
  status: 'active' | 'completed'
  reflection?: string
}

export interface Completion {
  id: string
  user_id: string
  mission_id: string
  sprint_id: string
  completed_date: string
  value: string
  notes?: string
}

export interface DailyScore {
  id: string
  user_id: string
  sprint_id: string
  score_date: string
  total_completed: number
  stars_earned: number
  category_scores: Record<string, number>
}

export interface Achievement {
  id: string
  code: string
  name: string
  description: string
  icon: string
  color: string
  xp_reward: number
  requirement_type: string
  requirement_value: number
  unlocked_at?: string
}

export interface CalendarEvent {
  id: string
  user_id: string
  external_id?: string
  title: string
  start_time: string
  end_time?: string
  category_id?: string
  mission_id?: string
  source: 'manual' | 'google' | 'outlook'
}

export type CategoryCode = 'M1' | 'M2' | 'M3' | 'M4' | 'M5'

export const CATEGORY_COLORS: Record<CategoryCode, string> = {
  M1: '#EF9F27',
  M2: '#378ADD',
  M3: '#1D9E75',
  M4: '#D4537E',
  M5: '#5F5E5A',
}
