export type ChapterProgressStatus = 'not-started' | 'in-progress' | 'completed' | 'coming-soon'

export function deriveChapterStatus(
  chapterId: string,
  authoredChapterIds: string[],
  completedChapterIds: Set<string>,
  inProgressPercents: Record<string, number> = {},
): ChapterProgressStatus {
  if (!authoredChapterIds.includes(chapterId)) return 'coming-soon'
  if (completedChapterIds.has(chapterId)) return 'completed'
  const percent = inProgressPercents[chapterId] ?? 0
  if (percent > 0) return 'in-progress'
  return 'not-started'
}
