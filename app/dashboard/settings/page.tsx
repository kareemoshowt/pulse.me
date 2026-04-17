'use client'

import { useState } from 'react'
import { usePulseStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { profile, categories } = usePulseStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="px-5 pt-5 pb-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>

      <div className="px-5 space-y-4">
        {/* Profile Section */}
        <div className="card p-5">
          <div className="text-xs text-white/40 tracking-widest mb-4">PROFILE</div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || '?'
              )}
            </div>
            <div>
              <div className="font-semibold">{profile?.full_name || 'Anonymous'}</div>
              <div className="text-sm text-white/40">{profile?.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-pulse-amber">{profile?.current_streak || 0}</div>
              <div className="text-xs text-white/40">Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pulse-blue">{profile?.total_stars || 0}</div>
              <div className="text-xs text-white/40">Total ★</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pulse-green">{profile?.level || 1}</div>
              <div className="text-xs text-white/40">Level</div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="card p-5">
          <div className="text-xs text-white/40 tracking-widest mb-4">CATEGORIES</div>
          
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ background: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{cat.name}</div>
                    <div className="text-xs text-white/40">{cat.missions?.length || 0} missions</div>
                  </div>
                </div>
                <button className="text-xs text-white/40 hover:text-white">Edit</button>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="card p-5">
          <div className="text-xs text-white/40 tracking-widest mb-4">INTEGRATIONS</div>
          
          <button className="w-full flex items-center justify-between py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <span className="text-xl">📅</span>
              <div className="text-left">
                <div className="text-sm font-medium">Google Calendar</div>
                <div className="text-xs text-white/40">Sync events to missions</div>
              </div>
            </div>
            <span className="text-xs text-pulse-blue">Connect</span>
          </button>

          <button className="w-full flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">✉️</span>
              <div className="text-left">
                <div className="text-sm font-medium">Email Digest</div>
                <div className="text-xs text-white/40">Daily/weekly summaries</div>
              </div>
            </div>
            <span className="text-xs text-white/40">Coming soon</span>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="card p-5">
          <div className="text-xs text-white/40 tracking-widest mb-4">ACCOUNT</div>
          
          <button 
            onClick={handleSignOut}
            disabled={loading}
            className="w-full py-3 text-center text-red-400 hover:text-red-300"
          >
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>

        <div className="text-center text-xs text-white/20 py-4">
          PULSE v1.0.0 — Built for the relentless
        </div>
      </div>
    </div>
  )
}
