'use client'

import { useState } from 'react'
import { Category } from '@/lib/types'
import { usePulseStore } from '@/lib/store'
import MissionItem from './MissionItem'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

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
  const pct = (progress / 5) * 100

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: isExpanded ? '#0e0e0e' : '#0a0a0a',
        border: `1px solid ${isExpanded ? `${category.color}20` : 'rgba(255,255,255,0.05)'}`,
      }}
    >
      {/* Header row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 pt-4 pb-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
            style={{ background: `${category.color}18` }}
          >
            {category.icon}
          </div>

          {/* Name + code */}
          <div className="text-left">
            <div
              className="text-[10px] font-semibold tracking-[0.1em] mb-0.5"
              style={{ color: `${category.color}80` }}
            >
              {category.code}
            </div>
            <div className="text-sm font-semibold text-white/90 tracking-tight">
              {category.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress count */}
          <div className="text-right">
            <div
              className="text-lg font-bold leading-none"
              style={{ color: isEarned ? category.color : 'rgba(255,255,255,0.25)' }}
            >
              {progress}<span className="text-xs font-normal opacity-50">/5</span>
            </div>
            {isEarned && (
              <div className="text-[9px] font-semibold tracking-wider mt-0.5" style={{ color: category.color }}>
                STAR ★
              </div>
            )}
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/20"
          >
            <ChevronDown size={16} />
          </motion.div>
        </div>
      </button>

      {/* Progress bar */}
      <div className="px-4 pb-3">
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            style={{ background: category.color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Expanded missions */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {category.question && (
              <div
                className="px-4 pb-2 text-xs italic leading-relaxed"
                style={{ color: `${category.color}60` }}
              >
                {category.question}
              </div>
            )}
            <div className="px-3 pb-3 space-y-1">
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
