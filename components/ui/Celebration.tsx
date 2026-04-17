'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XPEvent } from '@/lib/gamification'

interface CelebrationProps {
  events: XPEvent[]
  onComplete: () => void
}

// Confetti particle
const Particle = ({ color, delay }: { color: string; delay: number }) => {
  const randomX = Math.random() * 200 - 100
  const randomRotation = Math.random() * 720 - 360
  
  return (
    <motion.div
      initial={{ 
        y: 0, 
        x: 0, 
        rotate: 0, 
        scale: 1,
        opacity: 1 
      }}
      animate={{ 
        y: [0, -100, 200],
        x: [0, randomX * 0.5, randomX],
        rotate: randomRotation,
        scale: [1, 1.2, 0],
        opacity: [1, 1, 0]
      }}
      transition={{ 
        duration: 1.5, 
        delay,
        ease: "easeOut"
      }}
      style={{
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        background: color,
      }}
    />
  )
}

// Star burst animation
const StarBurst = ({ color }: { color: string }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.5, 1],
        opacity: [0, 1, 1]
      }}
      transition={{ duration: 0.5, ease: "backOut" }}
      className="text-6xl"
      style={{ filter: `drop-shadow(0 0 20px ${color})` }}
    >
      ⭐
    </motion.div>
  )
}

// XP popup
const XPPopup = ({ event, index }: { event: XPEvent; index: number }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ delay: index * 0.15 }}
      className="flex items-center gap-2 px-4 py-2 rounded-xl"
      style={{
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <span className="text-white/60 text-sm">{event.description}</span>
      <span className="text-pulse-amber font-bold">+{event.finalXP} XP</span>
      {event.multiplier > 1 && event.type !== 'combo' && (
        <span className="text-xs text-pulse-green">({event.multiplier}x)</span>
      )}
    </motion.div>
  )
}

// Combo indicator
const ComboIndicator = ({ count }: { count: number }) => {
  const colors = ['#1D9E75', '#378ADD', '#7F77DD', '#D4537E', '#EF9F27']
  const color = colors[Math.min(count - 1, colors.length - 1)]
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{ 
        background: `${color}30`,
        border: `2px solid ${color}`,
      }}
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 0.5 }}
        style={{ color }}
        className="font-bold"
      >
        {count}x
      </motion.span>
      <span className="text-white text-sm font-medium">COMBO</span>
    </motion.div>
  )
}

export default function Celebration({ events, onComplete }: CelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(true)
  const confettiColors = ['#EF9F27', '#378ADD', '#1D9E75', '#D4537E', '#7F77DD']
  
  const hasStarEarned = events.some(e => e.type === 'star_earned')
  const hasPerfectDay = events.some(e => e.type === 'perfect_day')
  const comboEvent = events.find(e => e.type === 'combo')
  const totalXP = events.reduce((sum, e) => sum + e.finalXP, 0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false)
      setTimeout(onComplete, 500)
    }, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.3)' }}
      >
        {/* Confetti */}
        {showConfetti && (hasStarEarned || hasPerfectDay) && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <Particle 
                key={i} 
                color={confettiColors[i % confettiColors.length]}
                delay={Math.random() * 0.3}
              />
            ))}
          </div>
        )}
        
        {/* Combo indicator */}
        {comboEvent && <ComboIndicator count={comboEvent.multiplier} />}
        
        {/* Center content */}
        <div className="flex flex-col items-center gap-4">
          {/* Star animation for star earned */}
          {hasStarEarned && !hasPerfectDay && (
            <StarBurst color="#EF9F27" />
          )}
          
          {/* Perfect day special */}
          {hasPerfectDay && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="flex gap-2"
            >
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="text-4xl"
                  style={{ filter: 'drop-shadow(0 0 10px #EF9F27)' }}
                >
                  ⭐
                </motion.span>
              ))}
            </motion.div>
          )}
          
          {/* XP events */}
          <div className="flex flex-col items-center gap-2 mt-4">
            {events.map((event, i) => (
              <XPPopup key={event.type + i} event={event} index={i} />
            ))}
          </div>
          
          {/* Total XP */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: events.length * 0.15 + 0.2, type: "spring" }}
            className="mt-2 text-2xl font-bold text-pulse-amber"
            style={{ textShadow: '0 0 20px rgba(239, 159, 39, 0.5)' }}
          >
            +{totalXP} XP Total
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook for triggering celebrations
export function useCelebration() {
  const [celebrationEvents, setCelebrationEvents] = useState<XPEvent[] | null>(null)
  
  const celebrate = (events: XPEvent[]) => {
    if (events.length > 0) {
      setCelebrationEvents(events)
    }
  }
  
  const clearCelebration = () => {
    setCelebrationEvents(null)
  }
  
  return { celebrationEvents, celebrate, clearCelebration }
}
