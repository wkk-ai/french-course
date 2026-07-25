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

export function getRuleBySlug(slug: string): GrammarRuleDocument | undefined {
  return MODULE1_RULE_DOCUMENTS.find((rule) => rule.slug === slug)
}

/** Legacy export name used across the app. */
export const MODULE1_RULES = MODULE1_RULE_DOCUMENTS
