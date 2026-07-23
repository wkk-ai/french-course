export type ChapterProgressStatus = 'locked' | 'active' | 'completed' | 'coming-soon'

export function deriveChapterStatus(
  chapterId: string,
  authoredChapterIds: string[],
  completedChapterIds: Set<string>
): ChapterProgressStatus {
  if (!authoredChapterIds.includes(chapterId)) return 'coming-soon'
  if (completedChapterIds.has(chapterId)) return 'completed'
  const nextChapterId = authoredChapterIds.find((id) => !completedChapterIds.has(id))
  return chapterId === nextChapterId ? 'active' : 'locked'
}
