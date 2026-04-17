'use client'

import { Mission, Category } from '@/lib/types'
import { usePulseStore } from '@/lib/store'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

interface MissionItemProps {
  mission: Mission
  category: Category
  date: Date
}

export default function MissionItem({ mission, category, date }: MissionItemProps) {
  const { completions, toggleCompletion } = usePulseStore()
  const dateStr = format(date, 'yyyy-MM-dd')
  
  const isComplete = completions.some(
    c => c.mission_id === mission.id && c.completed_date === dateStr
  )

  const handleToggle = () => {
    toggleCompletion(mission.id, date)
  }

  return (
    <motion.button
      onClick={handleToggle}
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isComplete
          ? ''
          : 'bg-white/[0.03] border border-white/[0.06]'
      }`}
      style={{
        background: isComplete ? `${category.color}20` : undefined,
        borderColor: isComplete ? `${category.color}40` : undefined,
      }}
    >
      {/* Checkbox */}
      <div
        className="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
        style={{
          borderColor: isComplete ? category.color : 'rgba(255,255,255,0.2)',
          background: isComplete ? category.color : 'transparent',
        }}
      >
        {isComplete && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-white text-xs font-bold"
          >
            ✓
          </motion.span>
        )}
      </div>

      {/* Mission Name */}
      <span
        className={`text-sm transition-colors ${
          isComplete ? 'text-white' : 'text-white/60'
        }`}
      >
        {mission.name}
      </span>
    </motion.button>
  )
}
