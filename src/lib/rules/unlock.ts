import { BUNDLED_CHAPTER_IDS, BUNDLED_LESSONS } from '@/lib/bundled-lessons'
import { PATHWAY_BY_CHAPTER_ID, pathwayLabel } from '@/lib/pathway/catalog'
import type { GrammarRuleDocument } from '@/lib/rules/types'

/** Map rule slug → chapter IDs that teach it (from brief.ruleSlugs). */
export function unlockChaptersForSlug(slug: string): string[] {
  const ids: string[] = []
  for (const chapterId of BUNDLED_CHAPTER_IDS) {
    const slugs = BUNDLED_LESSONS[chapterId]?.brief?.ruleSlugs ?? []
    if (slugs.includes(slug)) ids.push(chapterId)
  }
  return ids
}

export function lessonLabelForChapter(chapterId: string): string {
  const hit = PATHWAY_BY_CHAPTER_ID.get(chapterId)
  if (hit) return pathwayLabel(hit.module.orderIndex, hit.sub)
  const index = BUNDLED_CHAPTER_IDS.indexOf(chapterId)
  return index >= 0 ? `Lesson ${index + 1}` : 'Lesson'
}

export function isRuleUnlocked(
  rule: Pick<GrammarRuleDocument, 'slug' | 'unlockChapterIds'>,
  completedChapterIds: Set<string>,
): boolean {
  // Union brief.ruleSlugs hits + document unlock ids (document can unlock earlier than a late brief).
  const unlockIds = [...new Set([...unlockChaptersForSlug(rule.slug), ...rule.unlockChapterIds])]
  if (!unlockIds.length) return true
  return unlockIds.some((id) => completedChapterIds.has(id))
}

/** First unlock chapter for teaser copy — never spoil locked titles in UI that shows this. */
export function unlockTeaser(rule: GrammarRuleDocument): string {
  const ids = resolvedUnlockChapterIds(rule)
  const first = ids[0]
  if (!first) return 'Available now'
  return `Unlock in ${lessonLabelForChapter(first)}`
}

/** Resolved unlock chapter ids (document + brief.ruleSlugs, earliest pathway order first). */
export function resolvedUnlockChapterIds(rule: GrammarRuleDocument): string[] {
  const ids = [...new Set([...rule.unlockChapterIds, ...unlockChaptersForSlug(rule.slug)])]
  return ids.sort((a, b) => BUNDLED_CHAPTER_IDS.indexOf(a) - BUNDLED_CHAPTER_IDS.indexOf(b))
}

export type RuleMasteryStage = 'locked' | 'introduced' | 'practiced' | 'solid'

export function masteryStage(
  unlocked: boolean,
  correctAttempts: number,
  totalAttempts: number,
): RuleMasteryStage {
  if (!unlocked) return 'locked'
  if (totalAttempts === 0) return 'introduced'
  const rate = correctAttempts / totalAttempts
  if (totalAttempts >= 5 && rate >= 0.85) return 'solid'
  if (totalAttempts >= 2 && rate >= 0.7) return 'practiced'
  return 'introduced'
}

export function masteryLabel(stage: RuleMasteryStage): string {
  if (stage === 'locked') return 'Locked'
  if (stage === 'introduced') return 'Introduced'
  if (stage === 'practiced') return 'Practiced'
  return 'Solid'
}
