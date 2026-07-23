import { createClient } from '@/utils/supabase/server'
import CenterClient from './CenterClient'

type VocabProgress = { created_at: string; last_reviewed_at: string | null }
type GrammarMastery = { grammar_category: string; total_attempts: number; correct_attempts: number }
type ChapterProgress = { status: string; completed_at: string | null }
type GrammarRuleSummary = { slug: string; title: string; category: string }

export default async function CenterPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let vocabProgress: VocabProgress[] = []
  let grammarMastery: GrammarMastery[] = []
  let chapterProgress: ChapterProgress[] = []
  let grammarRules: GrammarRuleSummary[] = []

  if (user) {
    const [vocabRes, grammarRes, chapterRes, rulesRes] = await Promise.all([
      supabase
        .from('user_vocab_progress')
        .select('*, vocabulary(word)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true }),
      supabase
        .from('user_grammar_mastery')
        .select('grammar_category, total_attempts, correct_attempts, updated_at')
        .eq('user_id', user.id),
      supabase
        .from('user_chapter_progress')
        .select('status, completed_at')
        .eq('user_id', user.id),
      supabase.from('grammar_rules').select('slug, title, category'),
    ])
    vocabProgress = vocabRes.data ?? []
    grammarMastery = grammarRes.data ?? []
    chapterProgress = chapterRes.data ?? []
    grammarRules = rulesRes.data ?? []
  }

  return (
    <CenterClient 
      vocabProgress={vocabProgress}
      grammarMastery={grammarMastery}
      chapterProgress={chapterProgress}
      grammarRules={grammarRules}
      today={new Date().toISOString()}
    />
  )
}
