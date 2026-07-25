import { MODULE1_CHAPTER_IDS, MODULE1_LESSONS } from '@/lib/module1-content'
import type { GrammarRuleDocument } from '@/lib/rules/types'

const CHAPTER_TITLES: Record<string, string> = {
  '22222222-0000-0000-0000-000000000101': "Bonjour, je m'appelle…",
  '22222222-0000-0000-0000-000000000102': 'Les chiffres et le calendrier',
  '22222222-0000-0000-0000-000000000103': 'Au café',
  '22222222-0000-0000-0000-000000000104': 'Ma famille',
}

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
  const index = (MODULE1_CHAPTER_IDS as readonly string[]).indexOf(chapterId)
  const title = CHAPTER_TITLES[chapterId]
  const label = index >= 0 ? `Lesson 1.${index + 1}` : 'Lesson'
  return title ? `${label} · ${title}` : label
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
