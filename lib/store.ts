import { create } from 'zustand'
import { Category, Completion, Mission, Sprint, Profile, DailyScore } from './types'
import { createClient } from './supabase/client'
import { startOfWeek, endOfWeek, format, getWeek, getYear } from 'date-fns'
import {
  ComboState,
  XPEvent,
  updateCombo,
  calculateMissionXP,
  checkPerfectDay,
  generateInsights,
  Insight,
} from './gamification'
import {
  GUEST_CATEGORIES,
  getGuestProfile,
  saveGuestProfile,
  getGuestCompletions,
  saveGuestCompletions,
  getGuestSprint,
  generateGuestId,
} from './guest'

interface PulseState {
  profile: Profile | null
  categories: Category[]
  missions: Mission[]
  currentSprint: Sprint | null
  completions: Completion[]
  dailyScores: DailyScore[]
  selectedDate: Date
  isLoading: boolean
  isGuest: boolean

  // Gamification state
  combo: ComboState
  pendingCelebration: XPEvent[] | null
  insights: Insight[]

  setProfile: (profile: Profile | null) => void
  setSelectedDate: (date: Date) => void
  fetchUserData: () => Promise<void>
  toggleCompletion: (missionId: string, date: Date) => Promise<XPEvent[]>
  calculateDailyStars: (date: Date) => number
  getCategoryProgress: (categoryId: string, date: Date) => number
  getWeeklyStars: () => number
  clearCelebration: () => void
  refreshInsights: () => void
}

export const usePulseStore = create<PulseState>((set, get) => ({
  profile: null,
  categories: [],
  missions: [],
  currentSprint: null,
  completions: [],
  dailyScores: [],
  selectedDate: new Date(),
  isLoading: true,
  isGuest: false,

  combo: { count: 0, lastMissionTime: 0, categoryId: null, isActive: false },
  pendingCelebration: null,
  insights: [],

  setProfile: (profile) => set({ profile }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  clearCelebration: () => set({ pendingCelebration: null }),

  // ── Fetch ──────────────────────────────────────────────────
  fetchUserData: async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // ── GUEST MODE ────────────────────────────────────────────
    if (!user) {
      const profile = getGuestProfile()
      const completions = getGuestCompletions()
      const sprint = getGuestSprint()
      const allMissions = GUEST_CATEGORIES.flatMap((c) => c.missions || [])

      set({
        isGuest: true,
        profile,
        categories: GUEST_CATEGORIES,
        missions: allMissions,
        currentSprint: sprint,
        completions,
        isLoading: false,
      })
      get().refreshInsights()
      return
    }

    // ── AUTHENTICATED MODE ────────────────────────────────────
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const { data: categories } = await supabase
      .from('categories')
      .select('*, missions(*)')
      .eq('user_id', user.id)
      .order('sort_order')

    const today = new Date()
    const weekNum = getWeek(today)
    const year = getYear(today)

    let { data: sprint } = await supabase
      .from('sprints')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_number', weekNum)
      .eq('year', year)
      .single()

    if (!sprint) {
      const { data: newSprint } = await supabase
        .from('sprints')
        .insert({
          user_id: user.id,
          week_number: weekNum,
          year,
          start_date: format(startOfWeek(today), 'yyyy-MM-dd'),
          end_date: format(endOfWeek(today), 'yyyy-MM-dd'),
        })
        .select()
        .single()
      sprint = newSprint
    }

    const { data: completions } = await supabase
      .from('completions')
      .select('*')
      .eq('sprint_id', sprint?.id)

    const allMissions = categories?.flatMap((c) => c.missions || []) || []

    set({
      isGuest: false,
      profile,
      categories: categories || [],
      missions: allMissions,
      currentSprint: sprint,
      completions: completions || [],
      isLoading: false,
    })

    get().refreshInsights()
  },

  // ── Toggle completion ──────────────────────────────────────
  toggleCompletion: async (missionId: string, date: Date): Promise<XPEvent[]> => {
    const { isGuest, currentSprint, completions, profile, missions, combo, categories } = get()
    const dateStr = format(date, 'yyyy-MM-dd')
    const mission = missions.find((m) => m.id === missionId)

    if (!mission || !profile) return []

    const existing = completions.find(
      (c) => c.mission_id === missionId && c.completed_date === dateStr
    )

    // ── GUEST uncomplete ──
    if (existing) {
      if (isGuest) {
        const updated = completions.filter((c) => c.id !== existing.id)
        saveGuestCompletions(updated)
        set({ completions: updated })
        return []
      }
      // Authenticated uncomplete
      const supabase = createClient()
      await supabase.from('completions').delete().eq('id', existing.id)
      set({ completions: completions.filter((c) => c.id !== existing.id) })
      return []
    }

    // ── Complete ──
    const newCompletion: Completion = {
      id: isGuest ? generateGuestId() : '', // will be replaced by Supabase id
      user_id: profile.id,
      mission_id: missionId,
      sprint_id: currentSprint?.id || '',
      completed_date: dateStr,
      value: 'X',
    }

    let finalCompletion = newCompletion

    if (!isGuest) {
      const supabase = createClient()
      const { data } = await supabase
        .from('completions')
        .insert({
          user_id: profile.id,
          mission_id: missionId,
          sprint_id: currentSprint?.id,
          completed_date: dateStr,
          value: 'X',
        })
        .select()
        .single()
      if (!data) return []
      finalCompletion = data
    }

    const newCompletions = [...completions, finalCompletion]

    // Calculate XP
    const { newCombo, bonusXP } = updateCombo(combo, mission.category_id)

    const categoryMissions = missions.filter((m) => m.category_id === mission.category_id)
    const categoryCompletions = newCompletions.filter(
      (c) => categoryMissions.some((m) => m.id === c.mission_id) && c.completed_date === dateStr
    ).length
    const isStarEarning = categoryCompletions === 3

    const xpEvents = calculateMissionXP(profile.current_streak || 0, newCombo.count, isStarEarning)

    const starsToday = categories.filter((cat) => {
      const catMissions = missions.filter((m) => m.category_id === cat.id)
      return (
        newCompletions.filter(
          (c) => catMissions.some((m) => m.id === c.mission_id) && c.completed_date === dateStr
        ).length >= 3
      )
    }).length

    const perfectDayEvent = checkPerfectDay(starsToday)
    if (perfectDayEvent) xpEvents.push(perfectDayEvent)

    const totalXP = xpEvents.reduce((sum, e) => sum + e.finalXP, 0)
    const updatedProfile = { ...profile, xp: (profile.xp || 0) + totalXP }

    if (!isGuest && totalXP > 0) {
      const supabase = createClient()
      await supabase
        .from('profiles')
        .update({ xp: updatedProfile.xp })
        .eq('id', profile.id)
    }

    if (isGuest) {
      saveGuestCompletions(newCompletions)
      saveGuestProfile(updatedProfile)
    }

    set({
      completions: newCompletions,
      combo: newCombo,
      pendingCelebration: xpEvents.length > 0 ? xpEvents : null,
      profile: updatedProfile,
    })

    return xpEvents
  },

  // ── Helpers ────────────────────────────────────────────────
  getCategoryProgress: (categoryId: string, date: Date) => {
    const { completions, missions } = get()
    const dateStr = format(date, 'yyyy-MM-dd')
    const categoryMissions = missions.filter((m) => m.category_id === categoryId)
    return categoryMissions.filter((m) =>
      completions.some((c) => c.mission_id === m.id && c.completed_date === dateStr)
    ).length
  },

  calculateDailyStars: (date: Date) => {
    const { categories } = get()
    const { getCategoryProgress } = get()
    return categories.filter((cat) => getCategoryProgress(cat.id, date) >= 3).length
  },

  getWeeklyStars: () => {
    const { categories, currentSprint } = get()
    if (!currentSprint) return 0
    const { getCategoryProgress } = get()
    let total = 0
    const start = new Date(currentSprint.start_date)
    const end = new Date(currentSprint.end_date)
    const today = new Date()
    for (let d = new Date(start); d <= end && d <= today; d.setDate(d.getDate() + 1)) {
      total += categories.filter((cat) => getCategoryProgress(cat.id, d) >= 3).length
    }
    return total
  },

  refreshInsights: () => {
    const { completions, categories, missions } = get()
    const history = completions.map((c) => {
      const mission = missions.find((m) => m.id === c.mission_id)
      return { date: c.completed_date, categoryId: mission?.category_id || '', completed: true }
    })
    const insights = generateInsights(
      history,
      categories.map((c) => ({ id: c.id, code: c.code, name: c.name }))
    )
    set({ insights })
  },
}))
