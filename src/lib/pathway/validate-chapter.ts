import type { LessonContent } from '@/lib/course'
import { AUTHOR_PAD_DENYLIST, englishLeakInFrench, hasAuthorPad } from '@/lib/pathway/content-quality'

function readingWordCount(lesson: LessonContent): number {
  let count = 0
  for (const paragraph of lesson.reading ?? []) {
    for (const token of paragraph.tokens) {
      if (/[A-Za-zÀ-ÿŒœ]/.test(token.text)) count += 1
    }
  }
  return count
}

function readingPlainText(lesson: LessonContent): string {
  return (lesson.reading ?? [])
    .map((paragraph) => paragraph.tokens.map((token) => token.text).join(' '))
    .join('\n')
}

function dialoguePlainText(lesson: LessonContent): string {
  return (lesson.conversation?.lines ?? []).map((line) => `${line.speaker}: ${line.text}`).join('\n')
}

function normalizePara(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim()
}

function countTeachingSections(brief: string): number {
  const boldNumbered = brief.match(/\*\*\d+\./g) ?? []
  if (boldNumbered.length) return boldNumbered.length
  const hashes = brief.match(/^#{2,3}\s+/gm) ?? []
  return hashes.length
}

function hasNearDupParagraphs(lesson: LessonContent): boolean {
  const paras = (lesson.reading ?? []).map((paragraph) =>
    normalizePara(paragraph.tokens.map((token) => token.text).join(' ')),
  )
  const seen = new Set<string>()
  for (const para of paras) {
    if (para.length < 40) continue
    if (seen.has(para)) return true
    seen.add(para)
  }
  return false
}

function templateRepetitionHit(text: string): string | null {
  const patterns: Array<[RegExp, string]> = [
    [/Le mot « [^»]+ » revient/gi, 'Le mot «…» revient'],
    [/Je pratique\s*:/gi, 'Je pratique :'],
    [/Nous parlons encore de/gi, 'Nous parlons encore de'],
  ]
  for (const [re, label] of patterns) {
    const hits = text.match(re)
    if (hits && hits.length >= 3) return label
  }
  return null
}

/**
 * Module-1 Learn A craft bar for every bundled sub-chapter.
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
  const minSections = role === 'A' ? 8 : 5
  const sections = countTeachingSections(brief)
  if (sections < minSections) {
    return { ok: false, reason: `Too few teaching sections for ${role}: ${sections} < ${minSections}` }
  }
  const words = readingWordCount(lesson)
  if (words < 220) {
    return { ok: false, reason: `Reading too short: ${words} words` }
  }
  const readingParas = lesson.reading?.length ?? 0
  if (readingParas < 4) {
    return { ok: false, reason: `Reading needs ≥4 paragraphs (got ${readingParas})` }
  }
  if (hasNearDupParagraphs(lesson)) {
    return { ok: false, reason: 'Near-duplicate reading paragraphs' }
  }
  const dialogue = lesson.conversation?.lines?.length ?? 0
  if (dialogue < 12) {
    return { ok: false, reason: `Dialogue too short: ${dialogue} turns` }
  }
  const speakers = new Set((lesson.conversation?.lines ?? []).map((line) => line.speaker.trim().toLowerCase()))
  if (speakers.has('examinateur')) {
    return { ok: false, reason: 'Dialogue uses shell speakers (Examinateur)' }
  }
  const shellLines = (lesson.conversation?.lines ?? []).filter((line) =>
    /Je comprends la règle|Je pratique\s*:|Es-tu prêt/i.test(line.text),
  ).length
  if (shellLines >= 3) {
    return { ok: false, reason: 'Dialogue looks like exam/practice ritual' }
  }
  const exercises = lesson.exercises ?? []
  if (exercises.length < 22) {
    return { ok: false, reason: `Too few exercises: ${exercises.length}` }
  }
  const categories = new Set(exercises.map((exercise) => exercise.category || 'unknown'))
  if (categories.size < 2) {
    return { ok: false, reason: `Too few exercise categories: ${categories.size} < 2` }
  }
  if (exercises.some((exercise) => /-pad\d+/i.test(exercise.id))) {
    return { ok: false, reason: 'Exercise pad ids present' }
  }
  if (!lesson.brief?.ruleSlugs?.length) {
    return { ok: false, reason: 'ruleSlugs required' }
  }
  if (!lesson.conversation?.title?.trim() || !lesson.conversation?.setting?.trim()) {
    return { ok: false, reason: 'Conversation title/setting required' }
  }
  if (/Prove gate|remediate B\/C|Fail\s*→/i.test(lesson.conversation.setting)) {
    return { ok: false, reason: 'Conversation setting has exam-runbook meta' }
  }

  const readingText = readingPlainText(lesson)
  const dialogueText = dialoguePlainText(lesson)
  const haystack = `${brief}\n${readingText}\n${dialogueText}\n${lesson.conversation.setting}`
  if (hasAuthorPad(haystack)) {
    const hit = AUTHOR_PAD_DENYLIST.find((phrase) => haystack.toLowerCase().includes(phrase.toLowerCase()))
    return { ok: false, reason: `Authoring jargon detected: "${hit ?? 'pad'}"` }
  }
  const templateHit = templateRepetitionHit(`${readingText}\n${dialogueText}`)
  if (templateHit) {
    return { ok: false, reason: `Template repetition: ${templateHit}` }
  }
  if (englishLeakInFrench(readingText)) {
    return { ok: false, reason: 'English leak in reading text' }
  }
  if (englishLeakInFrench(dialogueText)) {
    return { ok: false, reason: 'English leak in dialogue text' }
  }

  return { ok: true }
}

/** Fingerprint for cross-lesson clone detection. */
export function dialogueFingerprint(lesson: LessonContent): string {
  return normalizePara(
    (lesson.conversation?.lines ?? []).map((line) => line.text).join('|'),
  )
}

export function readingFingerprint(lesson: LessonContent): string {
  return normalizePara(readingPlainText(lesson).slice(0, 400))
}
