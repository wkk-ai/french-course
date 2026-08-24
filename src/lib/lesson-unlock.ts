/** Next playable chapter is the first incomplete authored id. */
export function isLessonUnlocked(chapterId: string, completed: Iterable<string>, orderedIds: string[]): boolean {
  const done = completed instanceof Set ? completed : new Set(completed)
  const firstIncomplete = orderedIds.find((id) => !done.has(id))
  return done.has(chapterId) || firstIncomplete === chapterId || orderedIds.length === 0
}
