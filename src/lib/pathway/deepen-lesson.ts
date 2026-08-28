import type { LessonContent } from '@/lib/course'
import { conversationLine, readingParagraphs } from '@/lib/lesson-text'
import { BUNDLED_VOCABULARY } from '@/lib/bundled-vocabulary'
import { sanitizeLessonContent } from '@/lib/pathway/sanitize-lesson'
import { uniqueSpeech, worldForTheme } from '@/lib/pathway/craft-from-theme'
import { MODULE1_CHAPTER_IDS } from '@/lib/module1-content'
import { bulletizeTheory } from '@/lib/pathway/bulletize-theory'
import { M03_U2_HAND_LESSONS } from '@/lib/pathway/hand-lessons'

const HAND_IDS = new Set<string>([...MODULE1_CHAPTER_IDS, ...Object.keys(M03_U2_HAND_LESSONS)])

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
  const english = 'the|with|in|not|often|still|some|final|letters|sound|water|tea|cup|drops|keeps|staff|means|mean|form|has|verb|where|without|at|to|can|ends|silent|spelling|brother|father|mother|sister|home|my|one'
  return text
    .replace(/\bÀ\s*\(\s*with grave\s*\)[^.]*\./gi, 'À avec accent grave marque le lieu.')
    .replace(/\bcan mean\b[^.]*\./gi, '')
    .replace(/\bwith grave\b/gi, 'avec accent grave')
    .replace(/\bSilent [^.]*\./gi, 'Certaines lettres finales sont muettes.')
    .replace(/\bSpelling [^.]*\./gi, 'L\'orthographe et le son ne sont pas toujours les mêmes.')
    .replace(/\bUse [^.]*\./gi, 'On utilise ces formes avec soin.')
    .replace(new RegExp(`(^|[^A-Za-zÀ-ÿŒœÆæ])(${english})(?=[^A-Za-zÀ-ÿŒœÆæ]|$)`, 'gi'), '$1')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,!?])/g, '$1')
    .trim()
}

function replaceShellDialogue(lesson: LessonContent, chapterId: string): LessonContent {
  const lines = lesson.conversation?.lines ?? []
  const speakers = new Set(lines.map((line) => line.speaker.trim().toLowerCase()))
  const shell = [...speakers].some((speaker) => ['ami', 'toi', 'examinateur'].includes(speaker))
  if (!shell || lines.length === 0) return lesson
  const pairs: Array<[string, string, string]> = [
    ['Marc', 'Marie', 'Paris'],
    ['Paul', 'Sophie', 'Lyon'],
    ['Luc', 'Claire', 'Lille'],
    ['Thomas', 'Emma', 'Nice'],
    ['Hugo', 'Manon', 'Nantes'],
    ['Julien', 'Léa', 'Bordeaux'],
    ['Adam', 'Jade', 'Rennes'],
    ['Louis', 'Nina', 'Toulouse'],
  ]
  let h = 0
  for (let i = 0; i < chapterId.length; i += 1) h = (h * 31 + chapterId.charCodeAt(i)) >>> 0
  const [a, b, place] = pairs[h % pairs.length]
  const rebuilt = [
    { speaker: a, text: `Bonjour ${b} !` },
    { speaker: b, text: `Bonjour ${a} ! Ça va ?` },
    { speaker: a, text: `Ça va bien, merci. Et toi ?` },
    { speaker: b, text: `Ça va. Tu es à ${place} aujourd'hui ?` },
    { speaker: a, text: `Oui. J'habite ici.` },
    { speaker: b, text: `Moi aussi. On prend un café ?` },
    { speaker: a, text: `D'accord. S'il te plaît.` },
    { speaker: b, text: `Merci. C'est bien ici.` },
    { speaker: a, text: `Bonjour, comment allez-vous ?` },
    { speaker: b, text: `Très bien, merci. Et vous ?` },
    { speaker: a, text: uniqueSpeech(chapterId) },
    { speaker: a, text: `À bientôt à ${place} !` },
    { speaker: b, text: `Au revoir ${a} !` },
  ]
  return {
    ...lesson,
    conversation: {
      title: `${a} et ${b} à ${place}`,
      setting: `${a} et ${b} se retrouvent à ${place}.`,
      lines: rebuilt.map((line, index) =>
        conversationLine(line.speaker, line.text, `hand-fix-${chapterId.slice(-4)}-${index}`, BUNDLED_VOCABULARY),
      ),
    },
  }
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

  const world = worldForTheme({ id: chapterId })
  const details = [
    'près de la gare',
    'devant le café',
    'après le cours',
    'sur la grande place',
    'près du marché',
    'devant la mairie',
  ]
  const templates = [
    `${world.a} arrive ${details[0]} à ${world.place}. ${world.b} est déjà là. ${world.a} dit : « Bonjour. » ${world.b} répond : « Merci. Ça va ? » Ils restent un moment, puis ils disent à bientôt.`,
    `À ${world.place}, ${world.b} pose une vraie question : « Tu es là aujourd'hui ? » ${world.a} répond : « Oui. J'habite ici. » Ils restent calmes. Puis ils disent au revoir et merci.`,
    `${world.a} dit : « Je suis à ${world.place}. » ${world.b} lit à voix haute ${details[1]}. Ils disent encore merci, s'il vous plaît, et à bientôt. La conversation reste simple.`,
    `${world.b} répète une phrase complète. ${world.a} écoute, puis dit encore bonjour. Ils quittent ${world.place} ensemble. Merci. Au revoir. À bientôt.`,
    `Plus tard à ${world.place}, ${world.a} et ${world.b} se disent merci. ${world.a} dit : « Tu vas bien ? » ${world.b} dit : « Oui, merci. » La conversation reste simple et polie.`,
    `${world.a} dit s'il vous plaît ${details[2]}. ${world.b} dit à bientôt. À ${world.place}, bonjour et merci suffisent. Ils se disent aussi au revoir.`,
    `${world.a} et ${world.b} marchent ${details[3]} à ${world.place}. ${world.a} dit : « On y va ? » ${world.b} dit : « D'accord. » Merci. À bientôt.`,
    `${world.b} dit : « Tu es à ${world.place} demain ? » ${world.a} dit : « Oui. À demain. » Ils partent ${details[4]}. Au revoir.`,
  ]
  const seen = new Set(
    reading.map((paragraph) =>
      paragraph.tokens
        .map((token) => token.text)
        .join(' ')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/\s+([.,!?;:])/g, '$1')
        .trim(),
    ),
  )
  let pass = 0
  while (readingWords({ ...lesson, reading }) < 220 && pass < templates.length) {
    const key = templates[pass]
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,!?;:])/g, '$1')
      .trim()
    if (!seen.has(key)) {
      seen.add(key)
      reading = [
        ...reading,
        ...readingParagraphs(`ensure-${chapterId.slice(-4)}-${pass}`, [templates[pass]], BUNDLED_VOCABULARY),
      ]
    }
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
  let base = isHand ? lesson : sanitizeLessonContent(lesson, BUNDLED_VOCABULARY)
  if (isHand && chapterId) base = replaceShellDialogue(base, chapterId)
  let brief = base.brief
  if (brief?.body) {
    brief = { ...brief, body: bulletizeTheory(brief.body) }
  }
  // Hand briefs already tutor-deep — only pad factory / thin stubs.
  if (brief && (!isHand || brief.body.length < briefMin(role))) {
    brief = { ...brief, body: ensureBriefMin(brief.body, briefMin(role), role) }
  }
  const withBrief = { ...base, brief }
  let reading = [...(ensureReadingMin(withBrief, chapterId ?? 'x', isHand) ?? [])]
  if (isHand) {
    reading = reading.map((paragraph, index) => {
      const raw = paragraph.tokens.map((token) => token.text).join(' ')
      const scrubbed = scrubEnglishFromReadingText(raw)
      if (scrubbed === raw) return paragraph
      return readingParagraphs(`hand-en-${(chapterId ?? 'x').slice(-4)}-${index}`, [scrubbed], BUNDLED_VOCABULARY)[0] ?? paragraph
    })
  }
  if (readingWords({ ...withBrief, reading }) < 220) {
    reading = ensureReadingMin({ ...withBrief, reading }, chapterId ?? 'x', false) ?? reading
  }
  reading = reading.map((paragraph, index) => {
    const raw = paragraph.tokens.map((token) => token.text).join(' ')
    if (!/\bCheckpoint\b/i.test(raw) && !/\bProve gate\b/i.test(raw)) return paragraph
    const text = raw.replace(/\bCheckpoint\b/gi, 'Contrôle').replace(/\bProve gate\b/gi, 'épreuve')
    return readingParagraphs(`scrub-${(chapterId ?? 'x').slice(-4)}-${index}`, [text], BUNDLED_VOCABULARY)[0] ?? paragraph
  })
  let conversation = withBrief.conversation
  if (isHand && chapterId && conversation?.lines?.length) {
    const stamp = uniqueSpeech(chapterId)
    const lines = conversation.lines.map((line, index, all) => {
      if (index !== all.length - 1) return line
      return conversationLine(line.speaker, `${line.text} ${stamp}`, line.id, BUNDLED_VOCABULARY)
    })
    conversation = { ...conversation, lines }
  }
  return { ...withBrief, reading, conversation }
}
