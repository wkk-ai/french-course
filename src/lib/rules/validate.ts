import type { GrammarRuleDocument } from '@/lib/rules/types'

const MIN_WORDS = 250
const MIN_EXAMPLES = 8

function wordCount(text: string) {
  return text.split(/\s+/).filter(Boolean).length
}

/**
 * Authoring bar for deep grammar rules.
 * Fail CI if a Module 1 rule is still a one-paragraph stub.
 */
export function validateGrammarRule(rule: GrammarRuleDocument): { ok: true } | { ok: false; reason: string } {
  if (!rule.slug || !rule.title || !rule.category) {
    return { ok: false, reason: 'Missing slug, title, or category' }
  }
  if (!rule.unlockChapterIds.length) {
    return { ok: false, reason: `${rule.slug}: unlockChapterIds required` }
  }
  if (!rule.quickReference?.bullets?.length) {
    return { ok: false, reason: `${rule.slug}: quickReference.bullets required` }
  }
  if (!rule.deepDive?.whyItMatters || !rule.deepDive.sections?.length) {
    return { ok: false, reason: `${rule.slug}: deepDive incomplete` }
  }
  if (!rule.deepDive.commonMistakes?.length) {
    return { ok: false, reason: `${rule.slug}: commonMistakes required` }
  }
  const exampleCount = rule.examplesByGroup.reduce((sum, group) => sum + group.items.length, 0)
  if (exampleCount < MIN_EXAMPLES) {
    return { ok: false, reason: `${rule.slug}: need ≥${MIN_EXAMPLES} examples (have ${exampleCount})` }
  }
  if (!rule.drills?.length) {
    return { ok: false, reason: `${rule.slug}: drills required` }
  }
  const deepText = [
    rule.summary,
    rule.full_explanation,
    ...rule.quickReference.bullets,
    rule.deepDive.whyItMatters,
    ...rule.deepDive.sections.map((section) => `${section.heading} ${section.body}`),
    ...(rule.deepDive.pronunciationNotes ?? []),
    ...rule.deepDive.commonMistakes.flatMap((item) => [item.wrong, item.right, item.why]),
    ...rule.examplesByGroup.flatMap((group) =>
      group.items.flatMap((item) => [item.french, item.english, item.focus ?? '']),
    ),
  ].join(' ')
  const words = wordCount(deepText)
  if (words < MIN_WORDS) {
    return { ok: false, reason: `${rule.slug}: need ≥${MIN_WORDS} words in explanations (have ~${words})` }
  }
  const hasTable =
    Boolean(rule.quickReference.table) ||
    rule.deepDive.sections.some((section) => section.table) ||
    Boolean(rule.deepDive.contrastEn)
  if (!hasTable) {
    return { ok: false, reason: `${rule.slug}: at least one table required` }
  }
  return { ok: true }
}
