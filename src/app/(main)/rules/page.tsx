import { MODULE1_RULES } from '@/lib/rules/catalog'
import RulesClient from './RulesClient'

export default function RulesPage() {
  // Prefer rich bundled documents — DB stubs are too thin for the deep rulebook.
  const rules = [...MODULE1_RULES].sort((a, b) => a.title.localeCompare(b.title))
  return <RulesClient rules={rules} />
}
