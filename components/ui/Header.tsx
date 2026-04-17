'use client'

import { usePulseStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { profile } = usePulseStore()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="px-5 pt-5 pb-3 flex justify-between items-start">
      <div>
        <div className="text-[10px] text-white/30 tracking-[0.2em] mb-1">
          {profile?.current_streak || 0} DAY STREAK
        </div>
        <h1 className="text-2xl font-bold tracking-tight">PULSE</h1>
      </div>
      
      <button
        onClick={handleSignOut}
        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
      >
        {profile?.avatar_url ? (
          <img 
            src={profile.avatar_url} 
            alt="" 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm">
            {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || '?'}
          </span>
        )}
      </button>
    </header>
  )
}
