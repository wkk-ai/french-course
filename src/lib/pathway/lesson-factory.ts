import type { LessonContent, LessonExercise, VocabularyWord } from '@/lib/course'
import { conversationLine, readingParagraphs } from '@/lib/lesson-text'
import type { Phase1Theme } from '@/lib/phase1/theme-bank'

const THEORY_JARGON_RE = /Hand-crafted focus|Enqueue reviewable lemmas|prove chunk/i
const ENGLISH_LEAK_IN_READING_RE = /\b(hello|goodbye|thank you|past tense|clickable dictionary)\b/i

export type DeepTheme = Phase1Theme & {
  role?: 'A' | 'B' | 'C' | 'D'
  moduleTitle?: string
  unitTitle?: string
  /** Fixed chunks (FR = EN). */
  chunks?: Array<[string, string]>
  /** Trap explanations in English. */
  traps?: string[]
  /** Register trio: [soutenu, courant, familier]. */
  registerTrio?: [string, string, string]
  /** Authored French reading paragraphs (required for Module-1 bar). */
  readingFr?: string[]
  /** Extra theory paragraphs after meanings (English). */
  theorySections?: Array<{ heading: string; body: string }>
}

function roleOf(theme: DeepTheme): 'A' | 'B' | 'C' | 'D' {
  if (theme.role) return theme.role
  if (/prove/i.test(theme.title)) return 'D'
  if (/checkpoint|integrate/i.test(theme.title)) return 'C'
  if (/apply/i.test(theme.title)) return 'B'
  return 'A'
}

function briefMinChars(role: 'A' | 'B' | 'C' | 'D'): number {
  if (role === 'A') return 2500
  if (role === 'B') return 1500
  return 900
}

function meaningsBlock(meanings: Array<[string, string]>): string {
  return meanings.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n')
}

function chunksBlock(chunks: Array<[string, string]>): string {
  if (!chunks.length) return '- *(reuse the focus lines as whole phrases)*'
  return chunks.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n')
}

function meaningDistractors(
  meanings: Array<[string, string]>,
  correctEn: string,
  index: number,
): [string, string] {
  const pool = meanings.map(([, en]) => en).filter((en) => en !== correctEn)
  const first = pool[index % Math.max(1, pool.length)] ?? 'autre sens'
  const second = pool[(index + 1) % Math.max(1, pool.length)] ?? 'un autre mot'
  return [first, second]
}

function wrongFrenchLines(theme: DeepTheme, index: number): [string, string] {
  const focus = theme.focus
  const lineA = focus[(index + 1) % Math.max(1, focus.length)] ?? 'Je ne comprends pas.'
  const lineB = focus[(index + 2) % Math.max(1, focus.length)] ?? "C'est difficile."
  return [lineA, lineB]
}

function learnerBriefPad(body: string, theme: DeepTheme, min: number): string {
  if (body.length >= min) return body

  let padded = body
  padded += `\n\n**8. Extra practice with meanings**\n`
  for (const [fr, en] of theme.meanings.slice(0, 12)) {
    padded += `- Say *${fr}* aloud, then "${en}", then use it in one new sentence.\n`
  }
  padded += `\n**9. Register reminder**\n`
  padded += `With a stranger, a teacher, or staff, use *vous* and *Bonjour*. `
  padded += `With a close friend who says *tu*, you can answer with *tu* and *Salut*.\n`

  let i = 0
  while (padded.length < min && theme.focus.length > 0) {
    const line = theme.focus[i % theme.focus.length]
    padded += `- Practice aloud: *${line}*. Try it with *je*, *tu*, *il/elle*, and *nous*.\n`
    i += 1
    if (i > theme.focus.length * 4) break
  }

  return padded
}

function sanitizeChunks(chunks: Array<[string, string]>): Array<[string, string]> {
  return chunks.map(([fr, en]) => [fr, /prove chunk/i.test(en) ? 'useful phrase — say it whole' : en])
}

function buildBrief(theme: DeepTheme): NonNullable<LessonContent['brief']> {
  const role = roleOf(theme)
  const chunks = sanitizeChunks(
    theme.chunks ?? theme.focus.slice(0, 8).map((line) => [line, 'useful phrase — say it whole'] as [string, string]),
  )
  const traps = theme.traps ?? [
    'Do not mix up name introductions (C\'est…) with descriptions (Il/Elle est… + adjective).',
    'Never put a French content word in a grammar example before its English meaning appears above.',
    'City uses habiter à; many feminine countries use habiter en.',
  ]
  const trio = theme.registerTrio ?? [
    'Bonjour, comment allez-vous ?',
    'Salut, ça va ?',
    'Hé, ça va ? (recognition only until later phases)',
  ]
  const extra = (theme.theorySections ?? [])
    .filter((section) => !THEORY_JARGON_RE.test(section.body) && !THEORY_JARGON_RE.test(section.heading))
    .map((section) => `**${section.heading}**\n${section.body}`)
    .join('\n\n')

  let body =
    `What this lesson is for: ${theme.grammar}.` +
    (theme.moduleTitle ? ` Module: ${theme.moduleTitle}.` : '') +
    (theme.unitTitle ? ` Unit: ${theme.unitTitle}.` : '') +
    ` Role: ${role === 'A' ? 'Learn' : role === 'B' ? 'Apply' : role === 'C' ? 'Integrate' : 'Prove'}.\n\n` +
    `**1. Words to learn first (meanings)**\n` +
    `Before any grammar example, learn these with English meanings. Do not skip this list.\n\n` +
    `${meaningsBlock(theme.meanings)}\n\n` +
    `**2. Why this matters**\n` +
    `This pattern shows up constantly in real French. If the meanings are shaky, the drills collapse. ` +
    `Take time on the list above. Say each French word aloud, then the English, then a short sentence. ` +
    `The reading and dialogue reuse these words on purpose.\n\n` +
    `**3. Grammar pattern (only after meanings)**\n` +
    `${theme.grammar}\n\n` +
    `Focus lines to produce (meanings already learned):\n` +
    theme.focus.map((line) => `- ${line}`).join('\n') +
    `\n\n` +
    `**4. Traps**\n` +
    traps.map((trap) => `- ${trap}`).join('\n') +
    `\n\n` +
    `**5. Chunks (learn as wholes)**\n` +
    `${chunksBlock(chunks)}\n\n` +
    `**6. Register trio (same idea, three tones)**\n` +
    `- Soutenu: *${trio[0]}*\n` +
    `- Courant: *${trio[1]}*\n` +
    `- Familier (read-only if early): *${trio[2]}*\n\n` +
    `**7. Practice order**\n` +
    `1) Meanings list until automatic\n` +
    `2) Focus lines aloud\n` +
    `3) Reading — tap any word you do not know\n` +
    `4) Dialogue\n` +
    `5) Exercises — French forms and meanings only\n`

  if (extra) body += `\n${extra}\n`

  body = learnerBriefPad(body, theme, briefMinChars(role))

  return {
    title: theme.title,
    body,
    ruleSlugs: theme.ruleSlugs,
  }
}

function defaultReadingFr(theme: DeepTheme): string[] {
  const focus = theme.focus
  const dialogueSample = theme.dialogue
    .slice(0, 8)
    .map((line) => `${line.speaker} : « ${line.text} »`)
    .join(' ')
  return [
    `Aujourd'hui, nous travaillons : ${theme.grammar}. ${focus[0] ?? ''} ${focus[1] ?? ''}`,
    `${focus.slice(2, 5).join(' ')} ${dialogueSample}`,
    `${focus.slice(0, 4).join(' ')} On répète les phrases du jour à voix haute.`,
    `${theme.meanings
      .slice(0, 6)
      .map(([fr]) => `Le mot « ${fr} » revient dans la leçon.`)
      .join(' ')} ${focus[4] ?? ''} ${focus[5] ?? ''}`,
    `${focus.slice(6, 10).join(' ')} ${theme.dialogue.slice(-2).map((line) => line.text).join(' ')}`,
  ]
}

function buildReading(theme: DeepTheme, prefix: string, vocabulary: VocabularyWord[]) {
  const authored = theme.readingFr ?? []
  const readingSource =
    authored.length > 0 && !authored.some((paragraph) => ENGLISH_LEAK_IN_READING_RE.test(paragraph))
      ? authored
      : defaultReadingFr(theme)
  const paragraphs = readingSource.slice()
  const joined = paragraphs.join(' ')
  const approxWords = joined.split(/\s+/).filter(Boolean).length
  if (approxWords < 230) {
    paragraphs.push(
      `Pour finir, voici encore des phrases sur le thème. ${theme.focus.join(' ')} ` +
        `${theme.dialogue
          .slice(-4)
          .map((line) => line.text)
          .join(' ')}`,
    )
  }
  return readingParagraphs(prefix, paragraphs, vocabulary)
}

function topicExercises(theme: DeepTheme, prefix: string): LessonExercise[] {
  const fromTheme: LessonExercise[] = theme.exercises.map((item, index) => ({
    id: `${prefix}-e${index + 1}`,
    category: item.category,
    prompt: item.prompt,
    options: item.options,
    answer: item.answer,
    explanation: item.options[item.answer] ?? 'Correct form',
  }))

  const meaningDrills: LessonExercise[] = theme.meanings.map(([fr, en], index) => {
    const [d1, d2] = meaningDistractors(theme.meanings, en, index)
    return {
      id: `${prefix}-m${index + 1}`,
      category: 'vocab-meaning',
      prompt: `${fr} =`,
      options: [en, d1, d2],
      answer: 0,
      explanation: en,
    }
  })

  const focusDrills: LessonExercise[] = theme.focus.map((line, index) => {
    const [wrongA, wrongB] = wrongFrenchLines(theme, index)
    return {
      id: `${prefix}-f${index + 1}`,
      category: theme.ruleSlugs[0] ?? 'grammar',
      prompt: 'Choose the correct French line for this lesson:',
      options: [line, wrongA, wrongB],
      answer: 0,
      explanation: line,
    }
  })

  const left = theme.meanings.slice(0, Math.min(4, theme.meanings.length)).map(([fr]) => fr)
  const right = theme.meanings.slice(0, Math.min(4, theme.meanings.length)).map(([, en]) => en)
  const matchExercise: LessonExercise = {
    id: `${prefix}-match`,
    type: 'match',
    category: 'match-pairs',
    prompt: 'Match French ↔ English (this lesson)',
    explanation: 'Meanings from Words to learn first',
    left,
    right,
    pairs: left.map((_, index) => [index, index] as [number, number]),
  }

  const meaningTf = (index: number): LessonExercise => {
    const [fr, en] = theme.meanings[index % Math.max(1, theme.meanings.length)] ?? ['bonjour', 'bonjour']
    return {
      id: `${prefix}-tf${index + 1}`,
      type: 'true-false',
      category: 'true-false',
      prompt: 'True or false',
      statement: `“${fr}” means “${en}”.`,
      answer: true,
      explanation: 'From the meanings list',
    }
  }

  const trueFalse: LessonExercise[] =
    roleOf(theme) === 'D'
      ? [
          meaningTf(0),
          {
            id: `${prefix}-tf2`,
            type: 'true-false',
            category: theme.ruleSlugs[0] ?? 'grammar',
            prompt: 'True or false',
            statement: `A correct focus line for this unit is: “${theme.focus[0] ?? 'Je pratique.'}”.`,
            answer: true,
            explanation: theme.focus[0] ?? 'Focus line',
          },
          meaningTf(1),
        ]
      : [meaningTf(0), meaningTf(1), meaningTf(2)]

  const grammarCore: LessonExercise[] = [
    {
      id: `${prefix}-g1`,
      category: theme.ruleSlugs[0] ?? 'grammar',
      prompt: 'This lesson’s grammar focus is best described as:',
      options: [theme.grammar, 'Only memorizing isolated letters', 'Skipping word meanings'],
      answer: 0,
      explanation: theme.grammar,
    },
    {
      id: `${prefix}-g2`,
      category: 'vocab-meaning',
      prompt: `${theme.meanings[1]?.[0] ?? theme.meanings[0]?.[0] ?? 'merci'} =`,
      options: [
        theme.meanings[1]?.[1] ?? theme.meanings[0]?.[1] ?? 'thanks',
        theme.meanings[0]?.[1] ?? 'other',
        theme.meanings[2]?.[1] ?? 'third',
      ],
      answer: 0,
      explanation: theme.meanings[1]?.[1] ?? theme.meanings[0]?.[1] ?? 'From meanings list',
    },
    {
      id: `${prefix}-g3`,
      category: theme.ruleSlugs[0] ?? 'grammar',
      prompt: 'Choose the correct French line for this lesson:',
      options: [theme.focus[0] ?? 'Je pratique.', ...wrongFrenchLines(theme, 0)],
      answer: 0,
      explanation: theme.focus[0] ?? 'Focus line',
    },
  ]

  const clozeSource = theme.focus[0] ?? 'Je pratique.'
  const cloze: LessonExercise = {
    id: `${prefix}-cloze1`,
    type: 'cloze',
    category: theme.ruleSlugs[0] ?? 'grammar',
    prompt: 'Type the missing word.',
    text: clozeSource.includes(' ') ? clozeSource.replace(/\S+/, '___') : `___ ${clozeSource}`,
    answers: [clozeSource.split(/\s+/)[0]?.replace(/[.,!?]/g, '') || 'Je'],
    explanation: clozeSource,
  }

  const order: LessonExercise = {
    id: `${prefix}-order1`,
    type: 'order',
    category: theme.ruleSlugs[0] ?? 'grammar',
    prompt: 'Put the words in order.',
    explanation: theme.focus[0] ?? 'Practice line',
    words: (theme.focus[0] ?? 'Je pratique bien.').replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean),
    answer: (theme.focus[0] ?? 'Je pratique bien.').replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean),
  }

  const combined = [
    ...fromTheme,
    ...meaningDrills,
    ...focusDrills,
    matchExercise,
    ...trueFalse,
    ...grammarCore,
    cloze,
    order,
  ]

  let n = combined.length
  while (combined.length < 25) {
    n += 1
    const meaning = theme.meanings[(n - 1) % Math.max(1, theme.meanings.length)] ?? ['bonjour', 'bonjour']
    const [d1, d2] = meaningDistractors(theme.meanings, meaning[1], n)
    combined.push({
      id: `${prefix}-pad${n}`,
      category: 'vocab-meaning',
      prompt: `${meaning[0]} =`,
      options: [meaning[1], d1, d2],
      answer: 0,
      explanation: meaning[1],
    })
  }
  return combined
}

function ensureDialogue(theme: DeepTheme): Array<{ speaker: string; text: string }> {
  const lines = [...theme.dialogue]
  const fillers = [
    { speaker: 'Ami', text: 'Tu comprends la règle ?' },
    { speaker: 'Toi', text: 'Oui, je comprends.' },
    { speaker: 'Ami', text: 'Donne un exemple.' },
    { speaker: 'Toi', text: theme.focus[0] ?? 'Je pratique.' },
    { speaker: 'Ami', text: 'Encore un, s\'il te plaît.' },
    { speaker: 'Toi', text: theme.focus[1] ?? theme.focus[0] ?? 'Je répète.' },
    { speaker: 'Ami', text: 'Très bien. À bientôt !' },
    { speaker: 'Toi', text: 'Merci. À bientôt !' },
  ]
  let i = 0
  while (lines.length < 14) {
    lines.push(fillers[i % fillers.length])
    i += 1
  }
  return lines.slice(0, 16)
}

/** Build a Module-1-bar lesson from a deep theme + vocabulary. */
export function buildLessonFromTheme(theme: DeepTheme, vocabulary: VocabularyWord[]): LessonContent {
  const prefix = `p${theme.id.slice(-4)}`
  const dialogue = ensureDialogue(theme)
  return {
    brief: buildBrief(theme),
    reading: buildReading(theme, prefix, vocabulary),
    conversation: {
      title: theme.title,
      setting: `${theme.moduleTitle ?? 'Grand Pathway'} · ${theme.title} · ${theme.grammar}`,
      lines: dialogue.map((line, index) =>
        conversationLine(line.speaker, line.text, `${prefix}-l${index}`, vocabulary),
      ),
    },
    exercises: topicExercises(theme, prefix),
  }
}
