'use client'

import { useState } from 'react'

const mockEvents = [
  { time: '9:00 AM', event: 'Deep Work Block', cat: 'M2', color: '#378ADD' },
  { time: '12:30 PM', event: 'Gym Session', cat: 'M3', color: '#1D9E75' },
  { time: '6:00 PM', event: 'Family Dinner', cat: 'M4', color: '#D4537E' },
]

export default function CalendarPreview() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="px-5 pb-6">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-white/40 tracking-widest">UPCOMING</span>
          <button 
            className="text-xs text-pulse-blue hover:underline"
            onClick={() => {/* TODO: Google Calendar OAuth */}}
          >
            + Connect Calendar
          </button>
        </div>

        {mockEvents.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3"
            style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
          >
            <div
              className="w-1 h-8 rounded-full"
              style={{ background: item.color }}
            />
            <div className="flex-1">
              <div className="text-xs text-white/40">{item.time}</div>
              <div className="text-sm">{item.event}</div>
            </div>
            <div
              className="text-[10px] px-2 py-1 rounded"
              style={{
                color: item.color,
                background: `${item.color}20`,
              }}
            >
              {item.cat}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
