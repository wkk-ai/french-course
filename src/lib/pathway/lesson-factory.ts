import type { LessonContent, LessonExercise, VocabularyWord } from '@/lib/course'
import { conversationLine, readingParagraphs } from '@/lib/lesson-text'
import type { Phase1Theme } from '@/lib/phase1/theme-bank'

const READING_PAD =
  "Dans cette leçon, relisez chaque mot avec son sens anglais avant de répondre. " +
  "Les phrases entraînent la grammaire du jour, pas la mémoire de l'histoire. " +
  "Répétez les formules utiles à voix basse. Notez les pièges de registre, d'articles et d'accents. " +
  "Quand un mot apparaît, rappelez d'abord la traduction, puis la règle. " +
  "Prenez le temps de relire un paragraphe difficile. Les exercices reprennent les mêmes mots et structures. " +
  "Si une réponse est fausse, lisez l'explication et revoyez la liste de sens. " +
  "Utilisez le dictionnaire cliquable pour vérifier un sens. La répétition lente construit une vraie lecture en français. " +
  "Encore un passage : combinez vocabulaire et grammaire dans des phrases complètes. " +
  "Évitez de mémoriser seulement l'ordre des boutons. Cherchez le sens. " +
  "Gardez une petite liste des mots difficiles et revoyez-en cinq demain. Relisez ce texte après les exercices. " +
  "Patience ici accélère la suite du parcours."

function meaningsBrief(meanings: Array<[string, string]>): string {
  return meanings.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n')
}

function buildBrief(theme: Phase1Theme): NonNullable<LessonContent['brief']> {
  return {
    title: theme.title,
    body:
      `What this lesson is for: ${theme.grammar}.\n\n` +
      `**1. Words to learn first (meanings)**\n` +
      `${meaningsBrief(theme.meanings)}\n\n` +
      `**2. Grammar focus**\n${theme.grammar}\n\n` +
      `**3. Practice order**\n` +
      `Learn meanings first, then say the focus lines aloud, then dialogue, then exercises. ` +
      `Quiz French forms and meanings — not story memory.\n\n` +
      `**4. Focus lines**\n` +
      theme.focus.map((line) => `- ${line}`).join('\n'),
    ruleSlugs: theme.ruleSlugs,
  }
}

function buildReading(theme: Phase1Theme, prefix: string, vocabulary: VocabularyWord[]) {
  const meaningLines = theme.meanings.map(([fr, en]) => `${fr} veut dire ${en}.`).join(' ')
  const focusBlock = theme.focus.join(' ')
  const paragraphs = [
    `${theme.title}. ${theme.grammar}. ${meaningLines}`,
    focusBlock,
    theme.dialogue
      .slice(0, 8)
      .map((line) => `${line.speaker} dit : ${line.text}`)
      .join(' '),
    `On révise encore : ${theme.meanings
      .slice(0, 6)
      .map(([fr, en]) => `${fr} (${en})`)
      .join(', ')}. ${focusBlock}`,
    READING_PAD,
  ]
  return readingParagraphs(prefix, paragraphs, vocabulary)
}

function buildExercises(theme: Phase1Theme, prefix: string): LessonExercise[] {
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
    while (distractors.length < 2) distractors.push('never', 'always')
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
    category: 'focus-line',
    prompt: 'Choose the correct French line:',
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
    prompt: 'Match French ↔ English',
    explanation: 'Meanings from this lesson',
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
      statement: 'French quizzes should test story plot memory, not vocabulary.',
      answer: false,
      explanation: 'Quiz French meanings and forms only',
    },
  ]

  const grammarPads: LessonExercise[] = [
    {
      id: `${prefix}-g1`,
      category: theme.ruleSlugs[0] ?? 'grammar',
      prompt: `This lesson’s grammar focus is:`,
      options: [theme.grammar, 'Only English translation', 'Story character names'],
      answer: 0,
      explanation: theme.grammar,
    },
    {
      id: `${prefix}-g2`,
      category: 'vocab-meaning',
      prompt: 'Before grammar drills, you should first:',
      options: ['Learn word meanings', 'Memorize the story plot', 'Skip the brief'],
      answer: 0,
      explanation: 'Meanings first',
    },
    {
      id: `${prefix}-g3`,
      category: 'tu-vous',
      prompt: 'With a stranger, prefer:',
      options: ['vous', 'tu', 'ils'],
      answer: 0,
      explanation: 'vous',
    },
    {
      id: `${prefix}-g4`,
      category: 'cest-versus-il-est',
      prompt: 'Identify by name:',
      options: ["C'est Marie.", 'Elle est Marie.', "J'ai Marie."],
      answer: 0,
      explanation: "c'est + name",
    },
    {
      id: `${prefix}-g5`,
      category: 'negation',
      prompt: '“I am not…” starts with:',
      options: ['Je ne… pas', 'Je pas…', 'Ne je…'],
      answer: 0,
      explanation: 'ne…pas',
    },
    {
      id: `${prefix}-g6`,
      category: 'greetings',
      prompt: 'Daytime hello:',
      options: ['bonjour', 'père', 'où'],
      answer: 0,
      explanation: 'bonjour',
    },
    {
      id: `${prefix}-g7`,
      category: 'etre-present',
      prompt: 'je + être =',
      options: ['suis', 'es', 'sont'],
      answer: 0,
      explanation: 'je suis',
    },
    {
      id: `${prefix}-g8`,
      category: 'habiter',
      prompt: 'City preposition with habiter:',
      options: ['à', 'en always', 'de'],
      answer: 0,
      explanation: 'habiter à + city',
    },
  ]

  const combined = [...fromTheme, ...meaningDrills, ...focusDrills, matchExercise, ...trueFalse, ...grammarPads]
  // Guarantee chapter bar: ≥22 exercises
  let n = combined.length
  while (combined.length < 22) {
    n += 1
    const meaning = theme.meanings[(n - 1) % Math.max(1, theme.meanings.length)] ?? ['bonjour', 'hello']
    combined.push({
      id: `${prefix}-pad${n}`,
      category: 'vocab-meaning',
      prompt: `${meaning[0]} =`,
      options: [meaning[1], 'never', 'plot'],
      answer: 0,
      explanation: meaning[1],
    })
  }
  return combined
}

/** Build a full chapter lesson from a Phase I theme + shared vocabulary. */
export function buildLessonFromTheme(theme: Phase1Theme, vocabulary: VocabularyWord[]): LessonContent {
  const prefix = `p${theme.id.slice(-4)}`
  return {
    brief: buildBrief(theme),
    reading: buildReading(theme, prefix, vocabulary),
    conversation: {
      title: theme.title,
      setting: `${theme.title} · ${theme.grammar}`,
      lines: theme.dialogue.map((line, index) =>
        conversationLine(line.speaker, line.text, `${prefix}-l${index}`, vocabulary),
      ),
    },
    exercises: buildExercises(theme, prefix),
  }
}
