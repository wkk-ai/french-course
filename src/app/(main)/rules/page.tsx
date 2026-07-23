import { createClient } from '@/utils/supabase/server'
import RulesClient from './RulesClient'

export default async function RulesPage() {
  const supabase = await createClient()
  const [{ data: rules }, { data: { user } }] = await Promise.all([
    supabase.from('grammar_rules').select('*').order('title'),
    supabase.auth.getUser(),
  ])
  const { data: mastery } = user
    ? await supabase.from('user_grammar_mastery').select('grammar_category, total_attempts, correct_attempts').eq('user_id', user.id)
    : { data: [] }

  return <RulesClient rules={rules ?? []} mastery={mastery ?? []} />
}
