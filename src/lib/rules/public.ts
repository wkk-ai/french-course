import type { GrammarRuleDocument } from '@/lib/rules/types'

/** Safe fields for list pages — no deepDive/examples/drills in serialized props. */
export type PublicGrammarRule = {
  id: string
  slug: string
  title: string
  summary: string
  category: string
  unlockChapterIds: string[]
  linkedChapterIds: string[]
  masteryCategories: string[]
}

export function toPublicRule(rule: GrammarRuleDocument): PublicGrammarRule {
  return {
    id: rule.id,
    slug: rule.slug,
    title: rule.title,
    summary: rule.summary,
    category: rule.category,
    unlockChapterIds: rule.unlockChapterIds,
    linkedChapterIds: rule.linkedLessons.map((lesson) => lesson.chapterId),
    masteryCategories: rule.masteryCategories,
  }
}
