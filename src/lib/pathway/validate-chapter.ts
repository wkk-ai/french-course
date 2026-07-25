import type { LessonContent } from '@/lib/course'

function readingWordCount(lesson: LessonContent): number {
  let count = 0
  for (const paragraph of lesson.reading ?? []) {
    for (const token of paragraph.tokens) {
      if (/[A-Za-zÀ-ÿŒœ]/.test(token.text)) count += 1
    }
  }
  return count
}

/**
 * Module-1 authoring bar for every bundled sub-chapter.
 * Matches COURSE_STRUCTURE §10 + napkin Theory First / no snack lessons.
 */
export function validateChapterContent(
  lesson: LessonContent,
  options?: { role?: 'A' | 'B' | 'C' | 'D' },
): { ok: true } | { ok: false; reason: string } {
  const role = options?.role ?? 'A'
  const brief = lesson.brief?.body ?? ''
  if (!brief.includes('Words to learn first (meanings)')) {
    return { ok: false, reason: 'Missing meanings-first section' }
  }
  const minBrief = role === 'A' ? 2500 : role === 'B' ? 1500 : 900
  if (brief.length < minBrief) {
    return { ok: false, reason: `Brief too short for ${role}: ${brief.length} < ${minBrief}` }
  }
  const words = readingWordCount(lesson)
  if (words < 220) {
    return { ok: false, reason: `Reading too short: ${words} words` }
  }
  const dialogue = lesson.conversation?.lines?.length ?? 0
  if (dialogue < 12) {
    return { ok: false, reason: `Dialogue too short: ${dialogue} turns` }
  }
  const exercises = lesson.exercises?.length ?? 0
  if (exercises < 22) {
    return { ok: false, reason: `Too few exercises: ${exercises}` }
  }
  if (!lesson.brief?.ruleSlugs?.length) {
    return { ok: false, reason: 'ruleSlugs required' }
  }
  return { ok: true }
}
