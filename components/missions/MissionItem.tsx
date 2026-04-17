'use client'

import { Mission, Category } from '@/lib/types'
import { usePulseStore } from '@/lib/store'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

interface MissionItemProps {
  mission: Mission
  category: Category
  date: Date
}

export default function MissionItem({ mission, category, date }: MissionItemProps) {
  const { completions, toggleCompletion } = usePulseStore()
  const dateStr = format(date, 'yyyy-MM-dd')

  const isComplete = completions.some(
    (c) => c.mission_id === mission.id && c.completed_date === dateStr
  )

  return (
    <motion.button
      onClick={() => toggleCompletion(mission.id, date)}
      whileTap={{ scale: 0.985 }}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left"
      style={{
        background: isComplete ? `${category.color}10` : 'transparent',
        border: `1px solid ${isComplete ? `${category.color}25` : 'rgba(255,255,255,0.04)'}`,
      }}
    >
      {/* Custom checkbox */}
      <div
        className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center transition-all"
        style={{
          border: `1.5px solid ${isComplete ? category.color : 'rgba(255,255,255,0.18)'}`,
          background: isComplete ? category.color : 'transparent',
        }}
      >
        <AnimatePresence>
          {isComplete && (
            <motion.svg
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
            >
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="black"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>

      {/* Label */}
      <span
        className="text-sm font-medium transition-all"
        style={{
          color: isComplete ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
          textDecoration: isComplete ? 'none' : 'none',
        }}
      >
        {mission.name}
      </span>

      {/* Completion indicator dot */}
      {isComplete && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: category.color }}
        />
      )}
    </motion.button>
  )
}
