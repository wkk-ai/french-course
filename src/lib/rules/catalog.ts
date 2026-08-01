import { PHASE1_RULE_DOCUMENTS } from '@/lib/rules/documents/phase1'
import { LATER_RULE_DOCUMENTS } from '@/lib/rules/documents/later-phases'
import { SUBJECT_PRONOUNS } from '@/lib/rules/documents/subject-pronouns'
import {
  ARTICLES_PARTITIVES,
  CEST_VS_ILEST,
  ER_PRESENT,
  ETRE_PRESENT,
  NUMBERS_AND_AGE,
  POSSESSIVE_ADJECTIVES,
  SILENT_FINALS,
} from '@/lib/rules/documents/module1-rest'
import { RULE_EXAMPLE_EN_OVERLAY } from '@/lib/rules/example-en-overlay'
import type { GrammarRuleDocument } from '@/lib/rules/types'

export const MODULE1_RULE_DOCUMENTS: GrammarRuleDocument[] = [
  SUBJECT_PRONOUNS,
  ETRE_PRESENT,
  CEST_VS_ILEST,
  NUMBERS_AND_AGE,
  ARTICLES_PARTITIVES,
  ER_PRESENT,
  POSSESSIVE_ADJECTIVES,
  SILENT_FINALS,
]

function withExampleOverlay(rule: GrammarRuleDocument): GrammarRuleDocument {
  const overlay = RULE_EXAMPLE_EN_OVERLAY[rule.slug]
  if (!overlay?.length) return rule
  return { ...rule, examples: overlay.map((example, index) => ({ ...(rule.examples?.[index] ?? {}), ...example })) }
}

/** All bundled grammar docs (Module 1 + Phase I + later phases). */
export const ALL_RULE_DOCUMENTS: GrammarRuleDocument[] = [
  ...MODULE1_RULE_DOCUMENTS,
  ...PHASE1_RULE_DOCUMENTS,
  ...LATER_RULE_DOCUMENTS,
].map(withExampleOverlay)

export function getRuleBySlug(slug: string): GrammarRuleDocument | undefined {
  return ALL_RULE_DOCUMENTS.find((rule) => rule.slug === slug)
}

/** Legacy export name — all bundled rules. */
export const MODULE1_RULES = ALL_RULE_DOCUMENTS
