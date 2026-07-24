import { createStaticClient } from '@/utils/supabase/static'
import { MODULE1_RULES } from '@/lib/module1-content'
import type { GrammarRule } from '@/lib/course'
import RulesClient from './RulesClient'

export default async function RulesPage() {
  const supabase = createStaticClient()
  const fromDb = supabase ? (await supabase.from('grammar_rules').select('*').order('title')).data ?? [] : []
  const bySlug = new Map<string, GrammarRule>()
  for (const rule of MODULE1_RULES) bySlug.set(rule.slug, rule)
  for (const rule of fromDb as GrammarRule[]) bySlug.set(rule.slug, rule)
  const rules = [...bySlug.values()].sort((a, b) => a.title.localeCompare(b.title))
  return <RulesClient rules={rules} />
}
