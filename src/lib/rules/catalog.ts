import { PHASE1_RULE_DOCUMENTS } from '@/lib/rules/documents/phase1'
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

/** All bundled grammar docs (Module 1 + Phase I). */
export const ALL_RULE_DOCUMENTS: GrammarRuleDocument[] = [
  ...MODULE1_RULE_DOCUMENTS,
  ...PHASE1_RULE_DOCUMENTS,
]

export function getRuleBySlug(slug: string): GrammarRuleDocument | undefined {
  return ALL_RULE_DOCUMENTS.find((rule) => rule.slug === slug)
}

/** Legacy export name — now includes Phase I rules too. */
export const MODULE1_RULES = ALL_RULE_DOCUMENTS
