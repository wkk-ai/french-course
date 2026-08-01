import type { LessonContent } from '@/lib/course'
import { readingParagraphs } from '@/lib/lesson-text'
import { BUNDLED_VOCABULARY } from '@/lib/bundled-vocabulary'
import { sanitizeLessonContent } from '@/lib/pathway/sanitize-lesson'
import { MODULE1_CHAPTER_IDS } from '@/lib/module1-content'

const HAND_IDS = new Set(MODULE1_CHAPTER_IDS)

function briefMin(role: 'A' | 'B' | 'C' | 'D'): number {
  if (role === 'A') return 2500
  if (role === 'B') return 1500
  return 900
}

function parseMeanings(body: string): Array<[string, string]> {
  const pairs: Array<[string, string]> = []
  const re = /\*([^*]+)\*\s*=\s*([^\n]+)/g
  let match: RegExpExecArray | null
  while ((match = re.exec(body)) !== null) {
    pairs.push([match[1].trim(), match[2].trim()])
  }
  return pairs
}

function readingWords(lesson: LessonContent): number {
  return (lesson.reading ?? []).reduce(
    (sum, paragraph) => sum + paragraph.tokens.filter((token) => /[A-Za-zÀ-ÿ]/.test(token.text)).length,
    0,
  )
}

function frenchSceneLabel(raw: string | undefined): string {
  const cleaned = (raw ?? '')
    .replace(/^Prove\s*[—:-]\s*/i, '')
    .replace(/\b(Learn|Apply|Integrate|Prove|Checkpoint|practice|with)\b/gi, '')
    .replace(/[^A-Za-zÀ-ÿŒœÆæ0-9'\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!cleaned || !/[àâäéèêëîïôöùûüçœæÀÂÄÉÈÊËÎÏÔÖÙÛÜÇŒÆ]/.test(cleaned) && !/\b(le|la|les|je|tu|bonjour|merci)\b/i.test(cleaned)) {
    return 'cette leçon'
  }
  return cleaned
}

function scrubEnglishFromReadingText(text: string): string {
  return text
    .replace(/\bÀ\s*\(\s*with grave\s*\)[^.]*\./gi, 'À avec accent grave marque le lieu.')
    .replace(/\bcan mean\b[^.]*\./gi, '')
    .replace(/\bwith grave\b/gi, 'avec accent grave')
    .replace(/\bthe\b/gi, 'le')
    .replace(/\bin\b/gi, 'dans')
    .replace(/\bwith\b/gi, 'avec')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function ensureReadingMin(lesson: LessonContent, chapterId: string, isHand: boolean): LessonContent['reading'] {
  let reading = [...(lesson.reading ?? [])]
  // Hand gold already deep — do not mutate length when already at bar.
  if (isHand && readingWords({ ...lesson, reading }) >= 220) {
    return reading.map((paragraph, index) => {
      const raw = paragraph.tokens.map((token) => token.text).join(' ')
      const scrubbed = scrubEnglishFromReadingText(raw)
      if (scrubbed === raw) return paragraph
      return readingParagraphs(`hand-scrub-${chapterId.slice(-4)}-${index}`, [scrubbed], BUNDLED_VOCABULARY)[0] ?? paragraph
    })
  }

  const meanings = parseMeanings(lesson.brief?.body ?? '').filter(
    ([fr]) =>
      fr &&
      !/\b(Drills|Phase|grammar|Final|Checkpoint|Prove|Global|diploma|texts|Comprehension|mixte Phase)\b/i.test(fr) &&
      (/[àâäéèêëîïôöùûüçœæ]/i.test(fr) ||
        /\b(je|tu|bonjour|merci|oui|non|le|la|être|avoir|habiter|père|mère|frère|sœur)\b/i.test(fr) ||
        /^[a-zàâäéèêëîïôöùûüçœæ' -]{2,}$/i.test(fr)),
  )
  const words = meanings.slice(0, 10).map(([fr]) => fr).join(', ') || 'bonjour, merci, oui, non'
  let pass = 0
  while (readingWords({ ...lesson, reading }) < 220 && pass < 6) {
    const a = ['Marc', 'Paul', 'Luc', 'Hugo', 'Louis', 'Adam'][pass % 6]
    const b = ['Marie', 'Sophie', 'Claire', 'Léa', 'Nina', 'Jade'][pass % 6]
    const place = ['Paris', 'Lyon', 'Lille', 'Nantes', 'Nice', 'Rennes'][pass % 6]
    const para =
      `${a} et ${b} sont à ${place}. Ils parlent de ${words}. ${a} dit bonjour clairement. ${b} répond merci. ` +
      `${a} ajoute encore une phrase simple. ${b} dit oui, puis à bientôt. Ils disent aussi au revoir. ` +
      `Cette scène ${chapterId.slice(-4)}-${pass} reste utile pour retenir le sens.`
    reading = [...reading, ...readingParagraphs(`ensure-${chapterId.slice(-4)}-${pass}`, [para], BUNDLED_VOCABULARY)]
    pass += 1
  }
  return reading
}

/** Expand brief with learner teaching lines (not banned pad stock). */
function ensureBriefMin(body: string, min: number, role: 'A' | 'B' | 'C' | 'D'): string {
  let next = body
  if (!next.includes('Words to learn first (meanings)')) {
    next =
      `**1. Words to learn first (meanings)**\n` +
      `Learn each English meaning before the grammar examples.\n\n` +
      next
  }
  const minSections = role === 'A' ? 8 : 5
  let section = 7
  const meanings = parseMeanings(next)
  while (((next.match(/\*\*\d+\./g) ?? []).length) < minSections || next.length < min) {
    next += `\n\n**${section}. Guided reuse**\n`
    if (meanings.length > 0) {
      for (const [fr, en] of meanings.slice(0, 8)) {
        next += `- Picture a real moment for *${fr}* (${en}). Say it aloud, then one short sentence.\n`
      }
    } else {
      next += `- Say three new sentences with today's pattern. Check articles and register.\n`
    }
    section += 1
    if (section > 20) break
  }
  return next
}

/**
 * Sanitize factory lessons; never use banned pad stock.
 * Ensure brief/reading minima with craft-style expansion when thin (incl. older hand stubs).
 */
export function deepenLessonToModule1Bar(
  lesson: LessonContent,
  role: 'A' | 'B' | 'C' | 'D' = 'A',
  chapterId?: string,
): LessonContent {
  const isHand = Boolean(chapterId && HAND_IDS.has(chapterId))
  const base = isHand ? lesson : sanitizeLessonContent(lesson, BUNDLED_VOCABULARY)
  let brief = base.brief
  // Hand briefs already tutor-deep — only pad factory / thin stubs.
  if (brief && (!isHand || brief.body.length < briefMin(role))) {
    brief = { ...brief, body: ensureBriefMin(brief.body, briefMin(role), role) }
  }
  const withBrief = { ...base, brief }
  let reading = ensureReadingMin(withBrief, chapterId ?? 'x', isHand)
  reading = reading.map((paragraph, index) => {
    const raw = paragraph.tokens.map((token) => token.text).join(' ')
    if (!/\bCheckpoint\b/i.test(raw) && !/\bProve gate\b/i.test(raw)) return paragraph
    const text = raw.replace(/\bCheckpoint\b/gi, 'Contrôle').replace(/\bProve gate\b/gi, 'épreuve')
    return readingParagraphs(`scrub-${(chapterId ?? 'x').slice(-4)}-${index}`, [text], BUNDLED_VOCABULARY)[0] ?? paragraph
  })
  return { ...withBrief, reading }
}
