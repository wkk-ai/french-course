'use client'

import { Flame, LogOut, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function TopBar() {
  const router = useRouter()
  const [streak, setStreak] = useState(0)
  const [xp, setXp] = useState(0)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return

      setEmail(user.email ?? null)
      const [{ data: streakData }, { count: chapterCount }, { count: vocabCount }] = await Promise.all([
        supabase.from('user_streaks').select('current_streak').eq('user_id', user.id).single(),
        supabase.from('user_chapter_progress').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed'),
        supabase.from('user_vocab_progress').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ])
      if (cancelled) return
      setStreak(streakData?.current_streak ?? 0)
      setXp((chapterCount ?? 0) * 100 + (vocabCount ?? 0) * 5)
    })().catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 md:left-24 h-16 bg-surface-container-lowest border-b-2 border-surface-variant flex items-center justify-between px-4 z-40">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-3 py-1 bg-surface-container rounded-full">
          <Flame className="w-5 h-5 text-warning fill-warning/20" />
          <span className="font-bold text-on-surface">{streak}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-3 py-1 bg-primary-fixed rounded-full border border-primary-fixed-dim">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-label-caps text-primary">XP</span>
          <span className="font-bold text-primary">{xp}</span>
        </div>
        {email && (
          <button onClick={signOut} title="Sign out" aria-label="Sign out" className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low">
            <LogOut className="size-4" />
          </button>
        )}
      </div>
    </header>
  )
}
