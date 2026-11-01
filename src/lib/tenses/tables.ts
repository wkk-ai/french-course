import { BUNDLED_VOCABULARY } from '@/lib/bundled-vocabulary'
import { conjugateVerb } from '@/lib/french-conjugations'
import { buildTable, type GuideTable } from '@/lib/tenses/format'
import {
  CORE_IRREGULAR_VERBS,
  MORE_IRREGULAR_VERBS,
  REGULAR_VERBS,
  type TenseGoal,
} from '@/lib/tenses/guide'

export type TableGroup = { id: string; title: string; hint: string; open: boolean; tables: GuideTable[] }

const GROUPS = {
  regular: { title: 'Regular verbs', hint: 'Follow the pattern. Learn these first.', verbs: REGULAR_VERBS, open: true },
  core: { title: 'Four verbs to know by heart', hint: 'être, avoir, aller, faire', verbs: CORE_IRREGULAR_VERBS, open: true },
  more: { title: 'More useful irregular verbs', hint: 'pouvoir, vouloir, devoir, savoir, venir, prendre, dire, voir, partir, mettre', verbs: MORE_IRREGULAR_VERBS, open: false },
} as const

/** Build full conjugation tables on the server from the same engine the dictionary uses. */
export function tablesForGoal(goal: TenseGoal): TableGroup[] {
  const byWord = new Map(BUNDLED_VOCABULARY.filter((word) => word.part_of_speech === 'verb').map((word) => [word.word, word]))
  return goal.verbGroups.map((key) => {
    const group = GROUPS[key]
    const tables: GuideTable[] = []
    for (const verb of group.verbs) {
      const word = byWord.get(verb)
      if (!word) continue
      const rows = conjugateVerb(word)
      for (const tense of goal.tenses) {
        const table = buildTable(verb, word.base_translation, tense, rows)
        if (table) tables.push(table)
      }
    }
    return { id: key, title: group.title, hint: group.hint, open: group.open, tables }
  })
}
