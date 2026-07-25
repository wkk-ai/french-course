import { MODULE1_CHAPTER_IDS, MODULE1_LESSONS } from '@/lib/module1-content'
import { MODULE01_BY_ID, pathwayLabel } from '@/lib/pathway/module01'
import type { GrammarRuleDocument } from '@/lib/rules/types'

/** Map rule slug → chapter IDs that teach it (from brief.ruleSlugs). */
export function unlockChaptersForSlug(slug: string): string[] {
  const ids: string[] = []
  for (const chapterId of MODULE1_CHAPTER_IDS) {
    const slugs = MODULE1_LESSONS[chapterId]?.brief?.ruleSlugs ?? []
    if (slugs.includes(slug)) ids.push(chapterId)
  }
  return ids
}

export function lessonLabelForChapter(chapterId: string): string {
  const pathway = MODULE01_BY_ID.get(chapterId)
  if (pathway) return pathwayLabel(pathway)
  const index = (MODULE1_CHAPTER_IDS as readonly string[]).indexOf(chapterId)
  return index >= 0 ? `Lesson 1.${index + 1}` : 'Lesson'
}

export function isRuleUnlocked(rule: GrammarRuleDocument, completedChapterIds: Set<string>): boolean {
  if (!rule.unlockChapterIds.length) return true
  return rule.unlockChapterIds.some((id) => completedChapterIds.has(id))
}

/** First unlock chapter for teaser copy. */
export function unlockTeaser(rule: GrammarRuleDocument): string {
  const first = rule.unlockChapterIds[0]
  if (!first) return 'Available now'
  return `Unlock in ${lessonLabelForChapter(first)}`
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
