'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { getStreakTier } from '@/lib/gamification'

interface ShareCardProps {
  profile: {
    full_name?: string
    current_streak: number
    longest_streak: number
    level: number
    xp: number
    total_stars: number
  }
  weeklyStars: number
  categories: {
    code: string
    name: string
    color: string
    weeklyProgress: number // 0-7 stars earned this week
  }[]
  onClose: () => void
}

export default function ShareCard({ profile, weeklyStars, categories, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const tier = getStreakTier(profile.current_streak)
  
  const handleShare = async () => {
    if (!cardRef.current) return
    
    try {
      // Use html2canvas if available, otherwise fall back to clipboard
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0f0f12',
        scale: 2,
      })
      
      canvas.toBlob(async (blob) => {
        if (!blob) return
        
        if (navigator.share && navigator.canShare({ files: [new File([blob], 'pulse-progress.png', { type: 'image/png' })] })) {
          // Native share on mobile
          await navigator.share({
            files: [new File([blob], 'pulse-progress.png', { type: 'image/png' })],
            title: 'My PULSE Progress',
            text: `${profile.current_streak} day streak! 🔥`,
          })
        } else {
          // Download on desktop
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'pulse-progress.png'
          a.click()
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  const handleCopyStats = () => {
    const stats = `🎯 PULSE Progress Report
━━━━━━━━━━━━━━━━
🔥 ${profile.current_streak} Day Streak (${tier.name})
⭐ ${weeklyStars}/35 Stars This Week
📊 Level ${profile.level} • ${profile.xp} XP
🏆 ${profile.total_stars} Total Stars

${categories.map(c => `${c.code}: ${'★'.repeat(c.weeklyProgress)}${'☆'.repeat(7 - c.weeklyProgress)}`).join('\n')}

Track your life at pulse.app`
    
    navigator.clipboard.writeText(stats)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm"
      >
        {/* The shareable card */}
        <div 
          ref={cardRef}
          className="rounded-2xl overflow-hidden"
          style={{ 
            background: 'linear-gradient(145deg, #1a1a1f 0%, #0f0f12 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Header */}
          <div 
            className="p-5 text-center"
            style={{ 
              background: `linear-gradient(135deg, ${tier.color}30 0%, transparent 100%)`,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="text-xs text-white/40 tracking-widest mb-2">
              {format(new Date(), 'MMMM d, yyyy').toUpperCase()}
            </div>
            <div className="text-2xl font-bold">
              {profile.full_name || 'Anonymous'}
            </div>
            <div 
              className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-sm"
              style={{ background: `${tier.color}20`, color: tier.color }}
            >
              <span>🔥</span>
              <span className="font-semibold">{profile.current_streak} Day Streak</span>
              <span>•</span>
              <span>{tier.name}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-px bg-white/[0.06]">
            <div className="bg-[#0f0f12] p-4 text-center">
              <div className="text-2xl font-bold text-pulse-amber">{weeklyStars}</div>
              <div className="text-xs text-white/40 mt-1">Weekly ★</div>
            </div>
            <div className="bg-[#0f0f12] p-4 text-center">
              <div className="text-2xl font-bold text-pulse-blue">Lv.{profile.level}</div>
              <div className="text-xs text-white/40 mt-1">Level</div>
            </div>
            <div className="bg-[#0f0f12] p-4 text-center">
              <div className="text-2xl font-bold text-pulse-green">{profile.total_stars}</div>
              <div className="text-xs text-white/40 mt-1">Total ★</div>
            </div>
          </div>

          {/* Category Progress */}
          <div className="p-5 space-y-3">
            {categories.map((cat) => (
              <div key={cat.code} className="flex items-center gap-3">
                <div 
                  className="w-10 text-xs font-semibold"
                  style={{ color: cat.color }}
                >
                  {cat.code}
                </div>
                <div className="flex-1 flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-2 rounded-full"
                      style={{
                        background: i < cat.weeklyProgress 
                          ? cat.color 
                          : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  ))}
                </div>
                <div className="w-8 text-right text-xs text-white/40">
                  {cat.weeklyProgress}/7
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 flex items-center justify-between border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-pulse-amber to-pulse-pink flex items-center justify-center text-xs font-bold">
                P
              </div>
              <span className="text-sm font-medium">PULSE</span>
            </div>
            <span className="text-xs text-white/30">pulse.app</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleCopyStats}
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 text-sm font-medium hover:bg-white/20 transition-colors"
          >
            {copied ? '✓ Copied!' : '📋 Copy Stats'}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-3 px-4 rounded-xl bg-pulse-blue text-sm font-medium hover:bg-pulse-blue/80 transition-colors"
          >
            📤 Share Image
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2 text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )
}
