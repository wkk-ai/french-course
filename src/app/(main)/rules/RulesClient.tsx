'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Lock, Search } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import type { GrammarRuleDocument } from '@/lib/rules/types'
import { isRuleUnlocked, masteryLabel, masteryStage, unlockTeaser } from '@/lib/rules/unlock'

const categoryColorMap: Record<string, string> = {
  Verbs: 'bg-syntax-verb',
  Nouns: 'bg-syntax-noun',
  Syntax: 'bg-syntax-adj',
  Phonetics: 'bg-primary',
}

type Mastery = {
  grammar_category: string
  total_attempts: number
  correct_attempts: number
}

export default function RulesClient({ rules }: { rules: GrammarRuleDocument[] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [mastery, setMastery] = useState<Mastery[]>([])
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) {
        if (!cancelled) setBooting(false)
        return
      }
      const [{ data: masteryData }, { data: progress }] = await Promise.all([
        supabase.from('user_grammar_mastery').select('grammar_category, total_attempts, correct_attempts').eq('user_id', user.id),
        supabase.from('user_chapter_progress').select('chapter_id').eq('user_id', user.id).eq('status', 'completed'),
      ])
      if (cancelled) return
      setMastery(masteryData ?? [])
      setCompleted(new Set((progress ?? []).map((row) => row.chapter_id)))
      setBooting(false)
    })().catch(() => {
      if (!cancelled) setBooting(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const categories = ['All', ...Array.from(new Set(rules.map((rule) => rule.category)))]

  const filteredRules = rules.filter((rule) => {
    const matchesCategory = activeCategory === 'All' || rule.category === activeCategory
    const matchesSearch =
      !searchQuery ||
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getStage = (rule: GrammarRuleDocument) => {
    const unlocked = isRuleUnlocked(rule, completed)
    const rows = mastery.filter((item) => rule.masteryCategories.includes(item.grammar_category))
    const total = rows.reduce((sum, row) => sum + (row.total_attempts ?? 0), 0)
    const correct = rows.reduce((sum, row) => sum + (row.correct_attempts ?? 0), 0)
    return masteryStage(unlocked, correct, total)
  }

  const unlockedCount = rules.filter((rule) => isRuleUnlocked(rule, completed)).length

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Search grammar rules..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-full rounded-full border-2 border-surface-variant bg-surface-container-lowest py-3 pl-12 pr-4 text-body-ui text-on-surface outline-none transition-colors focus:border-primary"
        />
      </div>

      <div>
        <h1 className="text-headline-lg text-on-surface">Grammar Rulebook</h1>
        <p className="mt-2 text-body-reading text-on-surface-variant">
          Deep reference pages unlock when you finish the lesson that teaches them.
          {!booting && (
            <span className="mt-1 block text-sm">
              Unlocked: {unlockedCount}/{rules.length}
            </span>
          )}
        </p>
      </div>

      <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-label-caps font-bold transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredRules.length === 0 ? (
        <div className="py-12 text-center text-on-surface-variant">
          <p className="text-body-ui">No grammar rules match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredRules.map((rule) => {
            const unlocked = isRuleUnlocked(rule, completed)
            const stage = getStage(rule)
            const colorClass = categoryColorMap[rule.category] || 'bg-primary'
            return (
              <Link
                href={`/rules/${rule.slug}/`}
                key={rule.id}
                className={`tactile-card group flex cursor-pointer flex-col p-4 transition-colors hover:bg-surface-container-low ${
                  unlocked ? '' : 'opacity-80'
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-on-primary ${colorClass}`}>
                    {rule.category}
                  </span>
                  {unlocked ? (
                    <ChevronRight className="h-5 w-5 text-on-surface-variant transition-colors group-hover:text-primary" />
                  ) : (
                    <Lock className="h-5 w-5 text-on-surface-variant" />
                  )}
                </div>
                <h3 className="mb-1 text-body-ui font-bold text-on-surface">{rule.title}</h3>
                <p className="mb-4 line-clamp-2 flex-1 text-sm text-body-ui text-on-surface-variant">{rule.summary}</p>
                <div className="mt-auto flex items-center gap-2">
                  <span className="text-label-caps text-on-surface-variant">{unlocked ? masteryLabel(stage) : unlockTeaser(rule)}</span>
                  {unlocked && (
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                      <div
                        className={`h-full rounded-full ${
                          stage === 'solid' ? 'bg-success' : stage === 'practiced' ? 'bg-warning' : 'bg-surface-variant'
                        }`}
                        style={{ width: stage === 'solid' ? '100%' : stage === 'practiced' ? '70%' : '35%' }}
                      />
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
