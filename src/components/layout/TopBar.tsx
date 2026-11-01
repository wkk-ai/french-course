'use client'

import { Flame, Trophy } from 'lucide-react'
import { AccountMenu } from '@/components/auth/AccountMenu'
import { useEffect, useState } from 'react'
import { mergeCompletedChapterIds, readLocalStreak, subscribeCompletedChapters } from '@/lib/local-progress'
import { getAllLocalVocabulary } from '@/lib/local-vocab-vault'

export default function TopBar() {
  const [streak, setStreak] = useState(0)
  const [xp, setXp] = useState(0)
  const [booting, setBooting] = useState(true)

  const refreshStats = () => {
    const completedCount = mergeCompletedChapterIds([]).size
    const localVocab = getAllLocalVocabulary().length
    setStreak(readLocalStreak())
    setXp(completedCount * 100 + localVocab * 5)
  }

  useEffect(() => {
    void Promise.resolve().then(() => {
      refreshStats()
      setBooting(false)
    })
    return subscribeCompletedChapters(refreshStats)
  }, [])


  return (
    <header className="fixed top-0 left-0 right-0 md:left-24 h-16 pt-safe bg-surface-container-lowest border-b-2 border-surface-variant flex items-center justify-between px-4 z-40">
      <div className={`flex items-center gap-2 transition-opacity ${booting ? 'opacity-40' : 'opacity-100'}`}>
        <div className="flex items-center gap-1 px-3 py-1 bg-surface-container rounded-full">
          <Flame className="w-5 h-5 text-warning fill-warning/20" />
          <span className="font-bold text-on-surface">{streak}</span>
        </div>
      </div>

      <div className={`flex items-center gap-2 transition-opacity ${booting ? 'opacity-40' : 'opacity-100'}`}>
        <div className="flex items-center gap-1 px-3 py-1 bg-primary-fixed rounded-full border border-primary-fixed-dim">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-label-caps text-primary">XP</span>
          <span className="font-bold text-primary">{xp}</span>
        </div>
        <AccountMenu />
      </div>
    </header>
  )
}
