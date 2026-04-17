'use client'

import { useState } from 'react'
import { Category } from '@/lib/types'
import { usePulseStore } from '@/lib/store'
import MissionItem from './MissionItem'
import { motion, AnimatePresence } from 'framer-motion'

interface CategoryCardProps {
  category: Category
  date: Date
}

export default function CategoryCard({ category, date }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { getCategoryProgress } = usePulseStore()
  
  const progress = getCategoryProgress(category.id, date)
  const isEarned = progress >= 3
  const missions = category.missions || []

  return (
    <div
      className="card overflow-hidden transition-all duration-300"
      style={{
        borderColor: isExpanded ? `${category.color}40` : undefined,
        background: isExpanded 
          ? `linear-gradient(135deg, ${category.color}08 0%, transparent 100%)`
          : undefined,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ 
              background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}CC 100%)` 
            }}
          >
            {category.icon}
          </div>
          <div className="text-left">
            <div 
              className="text-[10px] tracking-wider"
              style={{ color: category.color }}
            >
              {category.code}
            </div>
            <div className="font-medium">{category.name}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: isEarned ? category.color : 'rgba(255,255,255,0.1)',
              color: isEarned ? '#fff' : 'rgba(255,255,255,0.4)',
            }}
          >
            {progress}/5 {isEarned && '★'}
          </div>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/30"
          >
            ▼
          </motion.span>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Motivational Question */}
            {category.question && (
              <div 
                className="px-4 pb-2 text-xs italic"
                style={{ color: `${category.color}99` }}
              >
                {category.question}
              </div>
            )}

            {/* Missions */}
            <div className="px-4 pb-4 space-y-2">
              {missions.map((mission) => (
                <MissionItem
                  key={mission.id}
                  mission={mission}
                  category={category}
                  date={date}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
