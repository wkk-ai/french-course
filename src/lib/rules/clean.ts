import type { GrammarRuleDocument } from '@/lib/rules/types'

/**
 * Some generated rule pages carry study-tip filler repeated three times and meta "mistakes"
 * (about the app, not French). Strip that at load time so every rule page reads clean.
 */
const FILLER = [
  'Learn meanings before drilling forms.',
  'Say each example aloud.',
  'Contrast English word order with French when helpful.',
  'Reuse the same lemmas in reading, dialogue, and exercises.',
  'Avoid story-memory quizzes — test forms and meanings only.',
  'When unsure, reopen the Words to learn first list in the lesson brief.',
  'Register matters: vous with strangers, tu with friends who offered it.',
  'Silent letters and liaison appear often; listen and repeat.',
  'Spiral earlier tools into new sentences.',
  'Short daily review beats one long cram session.',
  'Mark traps in your notes and check them before the checkpoint lesson.',
  'This pattern appears across the Grand Pathway.',
  'Meanings first, then forms, then mixed drills.',
  'Do not quiz story memory.',
  'Keep chunks whole.',
]

const META_MISTAKES = new Set(['Skipping meanings', 'Quiz plot', 'One exposure'])
const META_TABLE_ROWS = new Set(['Core|See bullets', 'Trap|Meanings first', 'Review|Forms + vocab'])

export function cleanText(text: string): string {
  let out = text
  for (const sentence of FILLER) out = out.split(sentence).join('')
  // Drop sentences repeated word for word.
  const seen = new Set<string>()
  const parts = out.split(/(?<=[.!?])\s+/).filter((part) => {
    const key = part.trim()
    if (!key) return false
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  return parts.join(' ').replace(/\s{2,}/g, ' ').trim()
}

export function cleanRuleDocument(doc: GrammarRuleDocument): GrammarRuleDocument {
  const d = structuredClone(doc) as GrammarRuleDocument & Record<string, unknown>
  if (typeof d.full_explanation === 'string') d.full_explanation = cleanText(d.full_explanation)
  if (typeof d.summary === 'string') d.summary = cleanText(d.summary)
  const deep = d.deepDive as { whyItMatters?: string; sections?: Array<{ heading: string; body: string }>; commonMistakes?: Array<{ wrong: string }> } | undefined
  if (deep) {
    if (deep.whyItMatters) deep.whyItMatters = cleanText(deep.whyItMatters)
    if (deep.sections) deep.sections = deep.sections.map((section) => ({ ...section, body: cleanText(section.body) })).filter((section) => section.body.length > 0)
    if (deep.commonMistakes) deep.commonMistakes = deep.commonMistakes.filter((mistake) => !META_MISTAKES.has(mistake.wrong))
  }
  const quick = d.quickReference as { table?: { rows: string[][] } } | undefined
  if (quick?.table && quick.table.rows.every((row) => META_TABLE_ROWS.has(row.join('|')))) delete quick.table
  const groups = d.examplesByGroup as Array<{ items: Array<{ french: string; english: string }> }> | undefined
  if (groups) {
    for (const group of groups) {
      for (const item of group.items) if (item.english?.trim() === item.french?.trim()) item.english = ''
    }
  }
  return d
}
