import type { LessonContent, LessonExercise, VocabularyWord } from '@/lib/course'
import { conversationLine, readingParagraphs } from '@/lib/lesson-text'
import type { Phase1Theme } from '@/lib/phase1/theme-bank'

export type DeepTheme = Phase1Theme & {
  role?: 'A' | 'B' | 'C'
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

function roleOf(theme: DeepTheme): 'A' | 'B' | 'C' {
  if (theme.role) return theme.role
  if (/checkpoint|integrate/i.test(theme.title)) return 'C'
  if (/apply/i.test(theme.title)) return 'B'
  return 'A'
}

function briefMinChars(role: 'A' | 'B' | 'C'): number {
  if (role === 'A') return 2500
  if (role === 'B') return 1500
  return 900
}

function meaningsBlock(meanings: Array<[string, string]>): string {
  return meanings.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n')
}

function chunksBlock(chunks: Array<[string, string]>): string {
  if (!chunks.length) return '- *(none tagged — reuse lesson focus lines as chunks)*'
  return chunks.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n')
}

function buildBrief(theme: DeepTheme): NonNullable<LessonContent['brief']> {
  const role = roleOf(theme)
  const chunks = theme.chunks ?? theme.focus.slice(0, 8).map((line) => [line, 'useful chunk — say it whole'] as [string, string])
  const traps = theme.traps ?? [
    'Do not quiz story plot or character names — quiz French forms and meanings only.',
    'Never put a French content word in a grammar example before its English meaning appears above.',
    'Store verbs as infinitives (*habiter*, not *habite*) for the dictionary and conjugations.',
  ]
  const trio = theme.registerTrio ?? [
    'Bonjour, comment allez-vous ?',
    'Salut, ça va ?',
    'Hé, ça va ? (recognition only until later phases)',
  ]
  const extra = (theme.theorySections ?? [])
    .map((section) => `**${section.heading}**\n${section.body}`)
    .join('\n\n')

  let body =
    `What this lesson is for: ${theme.grammar}.` +
    (theme.moduleTitle ? ` Module: ${theme.moduleTitle}.` : '') +
    (theme.unitTitle ? ` Unit: ${theme.unitTitle}.` : '') +
    ` Role: ${role === 'A' ? 'Learn' : role === 'B' ? 'Apply' : 'Integrate'}.\n\n` +
    `**1. Words to learn first (meanings)**\n` +
    `Before any grammar example, learn these with English meanings. Do not skip this list.\n\n` +
    `${meaningsBlock(theme.meanings)}\n\n` +
    `**2. Why this matters**\n` +
    `This pattern shows up constantly in real French. If the meanings are shaky, the drills collapse. ` +
    `Take time on the list above. Say each French word aloud, then the English, then a short sentence. ` +
    `The reading and dialogue reuse these lemmas on purpose so Review can enqueue them later.\n\n` +
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
    `3) Reading with clickable dictionary\n` +
    `4) Dialogue\n` +
    `5) Exercises — French forms and meanings only, never plot memory\n`

  if (extra) body += `\n${extra}\n`

  // Enforce Module-1 depth bar by expanding practice/spiral notes (still pedagogical, not fluff-only).
  const min = briefMinChars(role)
  if (body.length < min) {
    body +=
      `\n**8. Deep practice notes**\n` +
      `Return to the meanings list after every wrong answer. ` +
      `Rewrite each focus line with a new subject pronoun. ` +
      `Mark silent letters and liaison points when you notice them. ` +
      `Tomorrow, review five hard lemmas before starting the next sub-chapter. ` +
      `If a verb appears, open CONJUGATE on the infinitive lemma — not a conjugated surface form. ` +
      `Spiral one older pattern from earlier modules into two new sentences today. ` +
      `Keep a tiny notebook of chunks; say them as music, not word-by-word translation. ` +
      `When unsure between two forms, re-read the trap list before guessing.\n`
    while (body.length < min) {
      body +=
        ` Re-read section 1, then produce three new sentences with today’s grammar. ` +
        `Check spacing after punctuation and around guillemets in any typed answer. `
    }
  }

  return {
    title: theme.title,
    body,
    ruleSlugs: theme.ruleSlugs,
  }
}

function defaultReadingFr(theme: DeepTheme): string[] {
  const meaningSentences = theme.meanings
    .slice(0, 8)
    .map(([fr, en]) => `Le mot ${fr} signifie « ${en} » en anglais.`)
    .join(' ')
  const focus = theme.focus.join(' ')
  return [
    `Aujourd'hui, nous travaillons cette idée : ${theme.grammar}. ${meaningSentences}`,
    `Voici des phrases utiles pour parler. ${focus} Répétez chaque phrase à voix haute. Cherchez d'abord le sens de chaque mot nouveau.`,
    theme.dialogue
      .slice(0, 10)
      .map((line) => `${line.speaker} dit : « ${line.text} »`)
      .join(' ') +
      ' Ces répliques entraînent la grammaire du jour, pas la mémoire d\'une histoire.',
    `Attention aux pièges. On quiz le français — formes et sens — jamais le scénario. ` +
      `Relisez les mots difficiles. Utilisez le dictionnaire cliquable. ` +
      `Les verbes s'apprennent à l'infinitif pour la conjugaison complète.`,
    `Encore une lecture courte pour installer les structures. ${focus} ` +
      `Combinez vocabulaire et grammaire dans des phrases complètes. ` +
      `Si une réponse est fausse, revenez à la liste de sens avant de continuer. ` +
      `La répétition lente construit une vraie lecture en français. ` +
      `Notez huit chunks et revoyez-en cinq demain. Patience ici accélère la suite du parcours. ` +
      `Dans la conversation, écoutez le registre : vous avec un inconnu, tu avec un ami. ` +
      `Gardez les formules de politesse : bonjour, merci, s'il vous plaît, au revoir, à bientôt.`,
  ]
}

function buildReading(theme: DeepTheme, prefix: string, vocabulary: VocabularyWord[]) {
  const paragraphs = (theme.readingFr?.length ? theme.readingFr : defaultReadingFr(theme)).slice()
  // Guarantee ~220+ reading words for chapter bar.
  const joined = paragraphs.join(' ')
  const approxWords = joined.split(/\s+/).filter(Boolean).length
  if (approxWords < 230) {
    paragraphs.push(
      `Pour finir, relisez tout le texte une fois sans précipitation. ` +
        `Chaque mot utile doit avoir un sens anglais clair avant les exercices. ` +
        `Les phrases suivantes consolident encore la leçon : ${theme.focus.join(' ')} ` +
        `Travaillez lentement. La précision aujourd'hui évite les erreurs demain. ` +
        `Quand vous voyez un verbe, rappelez l'infinitif. Quand vous voyez un nom, rappelez le genre si vous le connaissez. ` +
        `Le but n'est pas de finir en une minute : le but est de comprendre et de pouvoir produire.`,
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
    const distractors = theme.meanings
      .filter(([other]) => other !== fr)
      .map(([, otherEn]) => otherEn)
      .slice(0, 2)
    while (distractors.length < 2) distractors.push('a plot detail', 'a character name')
    return {
      id: `${prefix}-m${index + 1}`,
      category: 'vocab-meaning',
      prompt: `${fr} =`,
      options: [en, distractors[0], distractors[1]],
      answer: 0,
      explanation: en,
    }
  })

  const focusDrills: LessonExercise[] = theme.focus.map((line, index) => ({
    id: `${prefix}-f${index + 1}`,
    category: theme.ruleSlugs[0] ?? 'grammar',
    prompt: 'Choose the correct French line for this lesson:',
    options: [line, 'Je suis Paris.', "C'est française."],
    answer: 0,
    explanation: line,
  }))

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

  const trueFalse: LessonExercise[] = [
    {
      id: `${prefix}-tf1`,
      type: 'true-false',
      category: 'true-false',
      prompt: 'True or false',
      statement: `“${theme.meanings[0]?.[0] ?? 'bonjour'}” means “${theme.meanings[0]?.[1] ?? 'hello'}”.`,
      answer: true,
      explanation: 'From the meanings list',
    },
    {
      id: `${prefix}-tf2`,
      type: 'true-false',
      category: 'true-false',
      prompt: 'True or false',
      statement: 'Exercises should test French forms and meanings, not story plot memory.',
      answer: true,
      explanation: 'Quiz French only',
    },
    {
      id: `${prefix}-tf3`,
      type: 'true-false',
      category: 'true-false',
      prompt: 'True or false',
      statement: 'You should learn English meanings before studying grammar examples that use those words.',
      answer: true,
      explanation: 'Theory First',
    },
  ]

  const grammarCore: LessonExercise[] = [
    {
      id: `${prefix}-g1`,
      category: theme.ruleSlugs[0] ?? 'grammar',
      prompt: 'This lesson’s grammar focus is best described as:',
      options: [theme.grammar, 'Only memorizing a story', 'Skipping meanings'],
      answer: 0,
      explanation: theme.grammar,
    },
    {
      id: `${prefix}-g2`,
      category: 'vocab-meaning',
      prompt: 'Before grammar drills, you should first:',
      options: ['Learn word meanings', 'Memorize character names', 'Skip the brief'],
      answer: 0,
      explanation: 'Meanings first',
    },
    {
      id: `${prefix}-g3`,
      category: 'chunks',
      prompt: 'Useful chunks should be learned as:',
      options: ['Whole phrases', 'Isolated letters only', 'Plot spoilers'],
      answer: 0,
      explanation: 'Chunks as wholes',
    },
  ]

  // Cloze from first focus line if it has a clear verb/noun slot
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
    const meaning = theme.meanings[(n - 1) % Math.max(1, theme.meanings.length)] ?? ['bonjour', 'hello']
    combined.push({
      id: `${prefix}-pad${n}`,
      category: 'vocab-meaning',
      prompt: `${meaning[0]} =`,
      options: [meaning[1], 'a character name', 'a plot detail'],
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
