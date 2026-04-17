/**
 * Guest mode — full local data layer using localStorage.
 * Guests get the same categories/missions as registered users.
 * All completions, XP, streaks, and levels are persisted locally.
 */

import { Category, Completion, Mission, Profile, Sprint } from './types'
import { format, startOfWeek, endOfWeek, getWeek, getYear } from 'date-fns'

const STORAGE_KEYS = {
  profile: 'pulse_guest_profile',
  completions: 'pulse_guest_completions',
  sprint: 'pulse_guest_sprint',
}

// ── Default categories & missions ───────────────────────────

export const GUEST_CATEGORIES: Category[] = [
  {
    id: 'guest-m1',
    user_id: 'guest',
    code: 'M1',
    name: 'Mind',
    color: '#F5C542',
    icon: '☀️',
    question: 'Did you invest in your mind today?',
    sort_order: 1,
    is_avoid: false,
    missions: [
      { id: 'g-m1-1', category_id: 'guest-m1', user_id: 'guest', name: 'Morning Routine', sort_order: 1, weekly_goal: 7, is_active: true },
      { id: 'g-m1-2', category_id: 'guest-m1', user_id: 'guest', name: 'Journaling', sort_order: 2, weekly_goal: 7, is_active: true },
      { id: 'g-m1-3', category_id: 'guest-m1', user_id: 'guest', name: 'Meditation / Prayer', sort_order: 3, weekly_goal: 7, is_active: true },
      { id: 'g-m1-4', category_id: 'guest-m1', user_id: 'guest', name: 'Reading (30 min)', sort_order: 4, weekly_goal: 7, is_active: true },
      { id: 'g-m1-5', category_id: 'guest-m1', user_id: 'guest', name: 'Gratitude Practice', sort_order: 5, weekly_goal: 7, is_active: true },
    ],
  },
  {
    id: 'guest-m2',
    user_id: 'guest',
    code: 'M2',
    name: 'Work',
    color: '#4A9EFF',
    icon: '💼',
    question: 'Did you make progress on what matters most?',
    sort_order: 2,
    is_avoid: false,
    missions: [
      { id: 'g-m2-1', category_id: 'guest-m2', user_id: 'guest', name: 'Deep Work Block', sort_order: 1, weekly_goal: 7, is_active: true },
      { id: 'g-m2-2', category_id: 'guest-m2', user_id: 'guest', name: 'Priority Task #1', sort_order: 2, weekly_goal: 7, is_active: true },
      { id: 'g-m2-3', category_id: 'guest-m2', user_id: 'guest', name: 'Priority Task #2', sort_order: 3, weekly_goal: 7, is_active: true },
      { id: 'g-m2-4', category_id: 'guest-m2', user_id: 'guest', name: 'Learning / Skill Build', sort_order: 4, weekly_goal: 7, is_active: true },
      { id: 'g-m2-5', category_id: 'guest-m2', user_id: 'guest', name: 'Admin / Comms', sort_order: 5, weekly_goal: 7, is_active: true },
    ],
  },
  {
    id: 'guest-m3',
    user_id: 'guest',
    code: 'M3',
    name: 'Body',
    color: '#00C805',
    icon: '💪',
    question: 'Did you take care of your body today?',
    sort_order: 3,
    is_avoid: false,
    missions: [
      { id: 'g-m3-1', category_id: 'guest-m3', user_id: 'guest', name: 'Sleep (7+ hrs)', sort_order: 1, weekly_goal: 7, is_active: true },
      { id: 'g-m3-2', category_id: 'guest-m3', user_id: 'guest', name: 'Workout / Training', sort_order: 2, weekly_goal: 7, is_active: true },
      { id: 'g-m3-3', category_id: 'guest-m3', user_id: 'guest', name: 'Nutrition Goal', sort_order: 3, weekly_goal: 7, is_active: true },
      { id: 'g-m3-4', category_id: 'guest-m3', user_id: 'guest', name: 'Supplements / Water', sort_order: 4, weekly_goal: 7, is_active: true },
      { id: 'g-m3-5', category_id: 'guest-m3', user_id: 'guest', name: 'Recovery / Stretch', sort_order: 5, weekly_goal: 7, is_active: true },
    ],
  },
  {
    id: 'guest-m4',
    user_id: 'guest',
    code: 'M4',
    name: 'Connect',
    color: '#FF6B8A',
    icon: '❤️',
    question: 'Did you show up for the people you love?',
    sort_order: 4,
    is_avoid: false,
    missions: [
      { id: 'g-m4-1', category_id: 'guest-m4', user_id: 'guest', name: 'Present at Meals', sort_order: 1, weekly_goal: 7, is_active: true },
      { id: 'g-m4-2', category_id: 'guest-m4', user_id: 'guest', name: 'Quality Time', sort_order: 2, weekly_goal: 7, is_active: true },
      { id: 'g-m4-3', category_id: 'guest-m4', user_id: 'guest', name: 'Check-in / Call', sort_order: 3, weekly_goal: 7, is_active: true },
      { id: 'g-m4-4', category_id: 'guest-m4', user_id: 'guest', name: 'Acts of Service', sort_order: 4, weekly_goal: 7, is_active: true },
      { id: 'g-m4-5', category_id: 'guest-m4', user_id: 'guest', name: 'Weekly Review Together', sort_order: 5, weekly_goal: 7, is_active: true },
    ],
  },
  {
    id: 'guest-m5',
    user_id: 'guest',
    code: 'M5',
    name: 'Discipline',
    color: '#A78BFA',
    icon: '🛡️',
    question: 'Did you hold your standards today?',
    sort_order: 5,
    is_avoid: true,
    missions: [
      { id: 'g-m5-1', category_id: 'guest-m5', user_id: 'guest', name: 'No Doom Scrolling', sort_order: 1, weekly_goal: 7, is_active: true },
      { id: 'g-m5-2', category_id: 'guest-m5', user_id: 'guest', name: 'No Junk Food', sort_order: 2, weekly_goal: 7, is_active: true },
      { id: 'g-m5-3', category_id: 'guest-m5', user_id: 'guest', name: 'No Excuses', sort_order: 3, weekly_goal: 7, is_active: true },
      { id: 'g-m5-4', category_id: 'guest-m5', user_id: 'guest', name: 'No Negative Self-Talk', sort_order: 4, weekly_goal: 7, is_active: true },
      { id: 'g-m5-5', category_id: 'guest-m5', user_id: 'guest', name: 'No Screen After 10pm', sort_order: 5, weekly_goal: 7, is_active: true },
    ],
  },
]

// ── Guest profile ───────────────────────────────────────────

const DEFAULT_GUEST_PROFILE: Profile = {
  id: 'guest',
  email: 'guest@pulse.me',
  full_name: 'You',
  timezone: 'UTC',
  current_streak: 0,
  longest_streak: 0,
  total_stars: 0,
  level: 1,
  xp: 0,
}

// ── Persistence helpers ─────────────────────────────────────

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full — ignore
  }
}

// ── Public API ──────────────────────────────────────────────

export function getGuestProfile(): Profile {
  return safeGet(STORAGE_KEYS.profile, DEFAULT_GUEST_PROFILE)
}

export function saveGuestProfile(profile: Profile) {
  safeSet(STORAGE_KEYS.profile, profile)
}

export function getGuestCompletions(): Completion[] {
  return safeGet<Completion[]>(STORAGE_KEYS.completions, [])
}

export function saveGuestCompletions(completions: Completion[]) {
  safeSet(STORAGE_KEYS.completions, completions)
}

export function getGuestSprint(): Sprint {
  const today = new Date()
  const weekNum = getWeek(today)
  const year = getYear(today)
  const stored = safeGet<Sprint | null>(STORAGE_KEYS.sprint, null)

  // Return existing sprint if same week
  if (stored && stored.week_number === weekNum && stored.year === year) {
    return stored
  }

  // Create new sprint
  const sprint: Sprint = {
    id: `guest-sprint-${year}-${weekNum}`,
    user_id: 'guest',
    week_number: weekNum,
    year,
    start_date: format(startOfWeek(today), 'yyyy-MM-dd'),
    end_date: format(endOfWeek(today), 'yyyy-MM-dd'),
    total_stars: 0,
    avg_stars: 0,
    status: 'active',
  }
  safeSet(STORAGE_KEYS.sprint, sprint)
  return sprint
}

export function generateGuestId(): string {
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
