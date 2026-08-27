/** Every playable lesson is open. Progress is tracked; nothing is gated. */
export function isLessonUnlocked(_chapterId: string, _completed: Iterable<string>, _orderedIds: string[]): boolean {
  return true
}
