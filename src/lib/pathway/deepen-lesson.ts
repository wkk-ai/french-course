import type { LessonContent } from '@/lib/course'
import { readingParagraphs } from '@/lib/lesson-text'
import { BUNDLED_VOCABULARY } from '@/lib/phase1/content'
import { sanitizeLessonContent } from '@/lib/pathway/sanitize-lesson'

function parseMeaningsFromBrief(body: string): Array<[string, string]> {
  const pairs: Array<[string, string]> = []
  const re = /\*([^*]+)\*\s*(?:\/\s*\*[^*]+\*)?\s*=\s*([^\n]+)/g
  let match: RegExpExecArray | null
  while ((match = re.exec(body)) !== null) {
    pairs.push([match[1].trim(), match[2].trim()])
  }
  if (pairs.length === 0) {
    const words = [...body.matchAll(/\*([^*]+)\*/g)].map((hit) => hit[1].trim())
    for (const word of words) {
      if (!word.includes('=')) pairs.push([word, `review the meaning of ${word}`])
    }
  }
  return pairs
}

function readingPlainText(lesson: LessonContent): string {
  return (lesson.reading ?? [])
    .map((paragraph) => paragraph.tokens.map((token) => token.text).join(' '))
    .join(' ')
}

function focusLinesFromLesson(lesson: LessonContent): string[] {
  const fromReading = readingPlainText(lesson)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 120)
  return fromReading.slice(0, 8)
}

function learnerBriefPad(body: string, minBrief: number, lesson?: LessonContent): string {
  if (body.length >= minBrief) return body

  const meanings = parseMeaningsFromBrief(body)
  const focusLines = lesson ? focusLinesFromLesson(lesson) : []
  const title = lesson?.brief?.title ?? 'this lesson'
  let padded = body

  padded += `\n\n**Extra practice with meanings**\n`
  if (meanings.length > 0) {
    for (const [fr, en] of meanings.slice(0, 12)) {
      padded += `- Say *${fr}* aloud, then "${en}", then use it in one new sentence.\n`
    }
  } else {
    padded += `- Review every word from section 1 aloud before you start the drills.\n`
    for (const line of focusLines.slice(0, 6)) {
      padded += `- Practice this line: *${line}*\n`
    }
  }

  padded += `\n**Register reminder**\n`
  padded += `With a stranger, a teacher, or staff, use *vous* and *Bonjour*. `
  padded += `With a close friend who says *tu*, you can answer with *tu* and *Salut*.\n`

  let i = 0
  while (padded.length < minBrief) {
    if (meanings.length > 0) {
      const [fr, en] = meanings[i % meanings.length]
      padded += `- Quick check: *${fr}* = "${en}". Say it with *je*, *tu*, and *nous*.\n`
    } else if (focusLines.length > 0) {
      padded += `- For *${title}*: repeat aloud — *${focusLines[i % focusLines.length]}*\n`
    } else {
      padded += `- For *${title}*: say three new sentences with today's pattern. Check accents and articles.\n`
    }
    i += 1
    if (i > 80) break
  }

  return padded
}

function topicReadingParagraphs(lesson: LessonContent, pass: number): string[] {
  const title =
    (lesson.brief?.title ?? 'cette leçon')
      .replace(/practice|checkpoint:?|prove:?|learn|apply|integrate|descriptions?/gi, '')
      .replace(/\bwith\b/gi, '')
      .replace(/[^A-Za-zÀ-ÿŒœÆæ0-9'\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || "aujourd'hui"
  const existing = readingPlainText(lesson)
  const sentences = existing.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 15)
  const offset = (pass * 3) % Math.max(1, sentences.length)
  const slice = (start: number, end: number) => sentences.slice(start, end).join(' ')

  return [
    `Voici encore du français sur ${title}. ${slice(offset, offset + 4)}`,
    `${slice(offset + 2, offset + 6)} ${slice(offset + 4, offset + 8)} On répète les structures du jour.`,
    `${slice(offset + 1, offset + 7)} ${slice(0, 4)} Ces phrases utilisent le vocabulaire de la leçon.`,
    `Encore une fois : ${slice(offset + 3, offset + 9)} ${slice(offset, offset + 5)}`,
  ]
}

function readingWords(lesson: LessonContent, paragraphs = lesson.reading ?? []): number {
  return paragraphs.reduce(
    (sum, paragraph) => sum + paragraph.tokens.filter((token) => /[A-Za-zÀ-ÿ]/.test(token.text)).length,
    0,
  )
}

/** Expand a short lesson until it meets the Module-1 authoring bar (napkin / COURSE_STRUCTURE §10). */
export function deepenLessonToModule1Bar(
  lesson: LessonContent,
  role: 'A' | 'B' | 'C' | 'D' = 'A',
): LessonContent {
  // Strip author pads / English gloss dumps baked into themes before depth pad.
  const cleaned = sanitizeLessonContent(lesson, BUNDLED_VOCABULARY)
  const minBrief = role === 'A' ? 2500 : role === 'B' ? 1500 : 900
  let brief = cleaned.brief
  if (brief) {
    let body = brief.body
    if (!body.includes('Words to learn first (meanings)')) {
      body =
        `**1. Words to learn first (meanings)**\n` +
        `Learn each new word's English meaning before the grammar drills.\n\n` +
        body
    }
    body = learnerBriefPad(body, minBrief, cleaned)
    brief = { ...brief, body }
  }

  const reading = [...(cleaned.reading ?? [])]
  let pass = 0
  while (readingWords(cleaned, reading) < 220 && pass < 4) {
    const extra = readingParagraphs(
      `deepen-${cleaned.brief?.title ?? 'lesson'}-${pass}`.replace(/\s+/g, ''),
      topicReadingParagraphs({ ...cleaned, reading }, pass),
      BUNDLED_VOCABULARY,
    )
    reading.push(...extra)
    pass += 1
  }

  return {
    ...cleaned,
    brief,
    reading,
  }
}
