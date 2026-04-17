'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { format, subDays, startOfWeek, eachDayOfInterval } from 'date-fns'

interface HeatMapProps {
  completions: {
    completed_date: string
    mission_id: string
    category_id?: string
  }[]
  categories: {
    id: string
    code: string
    name: string
    color: string
  }[]
  missions: {
    id: string
    category_id: string
  }[]
  weeks?: number // How many weeks to show, default 12
}

export default function HeatMap({ completions, categories, missions, weeks = 12 }: HeatMapProps) {
  const today = new Date()
  const startDate = startOfWeek(subDays(today, weeks * 7))
  
  // Build a map of date -> category -> completion count
  const heatData = useMemo(() => {
    const data: Record<string, Record<string, number>> = {}
    
    // Initialize all dates
    const allDays = eachDayOfInterval({ start: startDate, end: today })
    allDays.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      data[dateStr] = {}
      categories.forEach(cat => {
        data[dateStr][cat.id] = 0
      })
    })
    
    // Count completions
    completions.forEach(completion => {
      const dateStr = completion.completed_date
      if (!data[dateStr]) return
      
      // Find category for this mission
      const mission = missions.find(m => m.id === completion.mission_id)
      if (!mission) return
      
      if (data[dateStr][mission.category_id] !== undefined) {
        data[dateStr][mission.category_id]++
      }
    })
    
    return data
  }, [completions, categories, missions, startDate, today])
  
  // Get color intensity based on completion count (0-5 missions per category)
  const getIntensity = (count: number, maxCount: number = 5): number => {
    return Math.min(count / maxCount, 1)
  }
  
  // Group days by week
  const weekGroups = useMemo(() => {
    const allDays = eachDayOfInterval({ start: startDate, end: today })
    const groups: Date[][] = []
    let currentWeek: Date[] = []
    
    allDays.forEach((day, i) => {
      currentWeek.push(day)
      if (day.getDay() === 6 || i === allDays.length - 1) {
        groups.push(currentWeek)
        currentWeek = []
      }
    })
    
    return groups
  }, [startDate, today])
  
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="card p-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-xs text-white/40 tracking-widest">COMPLETION HEAT MAP</div>
          <div className="text-sm text-white/60 mt-1">Last {weeks} weeks</div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{
                  background: intensity === 0 
                    ? 'rgba(255,255,255,0.05)' 
                    : `rgba(29, 158, 117, ${intensity})`,
                }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Main heat map - all categories combined */}
      <div className="mb-6">
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1">
            {dayLabels.map((label, i) => (
              <div key={i} className="w-3 h-3 text-[8px] text-white/30 flex items-center justify-center">
                {i % 2 === 1 ? label : ''}
              </div>
            ))}
          </div>
          
          {/* Weeks */}
          {weekGroups.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {week.map((day, dayIdx) => {
                const dateStr = format(day, 'yyyy-MM-dd')
                const dayData = heatData[dateStr] || {}
                const totalCompletions = Object.values(dayData).reduce((sum, c) => sum + c, 0)
                const maxPossible = categories.length * 5 // 5 missions per category
                const intensity = getIntensity(totalCompletions, maxPossible)
                const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                
                return (
                  <motion.div
                    key={dateStr}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (weekIdx * 7 + dayIdx) * 0.005 }}
                    className="w-3 h-3 rounded-sm relative group cursor-pointer"
                    style={{
                      background: intensity === 0 
                        ? 'rgba(255,255,255,0.05)' 
                        : `rgba(29, 158, 117, ${0.2 + intensity * 0.8})`,
                      border: isToday ? '1px solid #EF9F27' : 'none',
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="font-medium">{format(day, 'MMM d')}</div>
                      <div className="text-white/60">{totalCompletions}/{maxPossible} missions</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Per-category breakdown */}
      <div className="space-y-3">
        <div className="text-xs text-white/40 tracking-widest">BY CATEGORY</div>
        
        {categories.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: cat.color }}
              />
              <span className="text-xs text-white/60">{cat.code}</span>
              <span className="text-xs text-white/40">{cat.name}</span>
            </div>
            
            <div className="flex gap-[2px]">
              {weekGroups.flat().map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd')
                const count = heatData[dateStr]?.[cat.id] || 0
                const intensity = getIntensity(count)
                
                return (
                  <div
                    key={dateStr}
                    className="w-2 h-2 rounded-sm"
                    style={{
                      background: intensity === 0 
                        ? 'rgba(255,255,255,0.05)' 
                        : `${cat.color}${Math.round((0.2 + intensity * 0.8) * 255).toString(16).padStart(2, '0')}`,
                    }}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Day of week analysis */}
      <div className="mt-6 pt-4 border-t border-white/[0.06]">
        <div className="text-xs text-white/40 tracking-widest mb-3">BEST DAYS</div>
        <div className="grid grid-cols-7 gap-2">
          {dayLabels.map((label, i) => {
            // Calculate average for this day of week
            const daysOfWeek = weekGroups.flat().filter(d => d.getDay() === i)
            const totalForDay = daysOfWeek.reduce((sum, day) => {
              const dateStr = format(day, 'yyyy-MM-dd')
              const dayData = heatData[dateStr] || {}
              return sum + Object.values(dayData).reduce((s, c) => s + c, 0)
            }, 0)
            const avgCompletions = daysOfWeek.length > 0 ? totalForDay / daysOfWeek.length : 0
            const maxAvg = categories.length * 5
            const pct = Math.round((avgCompletions / maxAvg) * 100)
            
            return (
              <div key={i} className="text-center">
                <div className="text-xs text-white/40 mb-1">{label}</div>
                <div 
                  className="text-sm font-semibold"
                  style={{ 
                    color: pct > 60 ? '#1D9E75' : pct > 40 ? '#EF9F27' : '#5F5E5A' 
                  }}
                >
                  {pct}%
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
