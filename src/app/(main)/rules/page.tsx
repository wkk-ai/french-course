import { createStaticClient } from '@/utils/supabase/static'
import RulesClient from './RulesClient'

export default async function RulesPage() {
  const supabase = createStaticClient()
  const rules = supabase ? (await supabase.from('grammar_rules').select('*').order('title')).data ?? [] : []
  return <RulesClient rules={rules} />
}
