/**
 * Small toolkit for writing one hand-made lesson per unit.
 * A unit spec is plain data: words with English meanings first, then grammar, a real-life reading,
 * a dialogue and exercises. `buildUnitLesson` turns it into the LessonContent the app plays.
 */
import type { LessonContent, LessonExercise, VocabularyWord } from '@/lib/course'
import { conversationLine, readingParagraphs } from '@/lib/lesson-text'

export type WordSpec = {
  /** Dictionary form: infinitive for verbs, masculine singular for adjectives. */
  fr: string
  en: string
  pos: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'pronoun' | 'determiner' | 'conjunction' | 'phrase' | 'number' | 'interjection'
  gender?: 'masculine' | 'feminine'
  example?: [string, string]
  /** Shown in the brief next to the word, e.g. "feminine: française". */
  note?: string
}

export type UnitSpec = {
  id: string
  /** Prefix for token and exercise ids, e.g. "m2u1". */
  key: string
  /** Short title shown on Home (French, a few words). Defaults to the catalog unit title. */
  homeTitle?: string
  /** Short English line under the Home title, e.g. "Present of -er verbs; reflexive verbs". */
  homeFocus?: string
  title: string
  /** One sentence: what you can do after this lesson. */
  goal: string
  words: { group: string; items: WordSpec[] }[]
  chunks: [string, string][]
  sections: { title: string; lines: string[] }[]
  traps: string[]
  ruleSlugs?: string[]
  reading: string[]
  dialogue: { title: string; setting: string; lines: [string, string][] }
  exercises: LessonExercise[]
}

/** Stable small hash so option order differs per question but never between builds. */
function seed(text: string): number {
  let h = 2166136261
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return Math.abs(h)
}

function place(id: string, correct: string, wrong: string[]): { options: string[]; answer: number } {
  const answer = seed(id) % (wrong.length + 1)
  const options = [...wrong]
  options.splice(answer, 0, correct)
  return { options, answer }
}

type Src = LessonExercise['source']

export function ex(key: string) {
  let n = 0
  const id = () => `${key}-e${++n}`
  return {
    /** Multiple choice. */
    mcq(prompt: string, correct: string, wrong: string[], explanation: string, category = 'meaning', source: Src = 'grammar'): LessonExercise {
      const i = id()
      return { id: i, type: 'mcq', category, prompt, explanation, source, ...place(i, correct, wrong) }
    },
    /** Question about the reading text. */
    read(prompt: string, correct: string, wrong: string[], explanation: string): LessonExercise {
      const i = id()
      return { id: i, type: 'reading', category: 'reading', prompt, explanation, source: 'reading', ...place(i, correct, wrong) }
    },
    /** What do you answer in this situation? */
    reply(context: string, prompt: string, correct: string, wrong: string[], explanation: string): LessonExercise {
      const i = id()
      return { id: i, type: 'dialogue', category: 'conversation', context, prompt, explanation, source: 'dialogue', ...place(i, correct, wrong) }
    },
    /** Tu or vous, formal or casual. */
    register(situation: string, correct: string, wrong: string[], explanation: string): LessonExercise {
      const i = id()
      return { id: i, type: 'register', category: 'register', situation, prompt: 'What do you say?', explanation, source: 'grammar', ...place(i, correct, wrong) }
    },
    /** Fill the gap; text contains ___ . */
    cloze(text: string, answers: string[], explanation: string, category = 'grammar', hint?: string): LessonExercise {
      return { id: id(), type: 'cloze', category, prompt: 'Type the missing word.', text, answers, explanation, source: 'grammar', ...(hint ? { hint } : {}) }
    },
    tf(statement: string, answer: boolean, explanation: string, category = 'meaning', source: Src = 'reading'): LessonExercise {
      return { id: id(), type: 'true-false', category, prompt: 'True or false?', statement, answer, explanation, source }
    },
    /** Put words in order; the sentence is split on spaces. */
    order(sentence: string, english: string, explanation: string, category = 'word-order'): LessonExercise {
      const answer = sentence.split(' ')
      const words = [...answer].sort((a, b) => seed(a + sentence) - seed(b + sentence))
      if (words.join(' ') === answer.join(' ')) words.reverse()
      return { id: id(), type: 'order', category, prompt: `Build the sentence: “${english}”`, words, answer, explanation, source: 'grammar' }
    },
    /** English to French; give every correct way to write it. */
    toFrench(english: string, answers: string[], explanation: string, category = 'translate'): LessonExercise {
      return { id: id(), type: 'translate', category, direction: 'en-fr', prompt: english, answers, explanation, source: 'grammar' }
    },
    toEnglish(french: string, answers: string[], explanation: string, category = 'translate'): LessonExercise {
      return { id: id(), type: 'translate', category, direction: 'fr-en', prompt: french, answers, explanation, source: 'reading' }
    },
    match(pairs: [string, string][], explanation: string, category = 'meaning'): LessonExercise {
      const left = pairs.map(([fr]) => fr)
      const right = [...pairs.map(([, en]) => en)].sort((a, b) => seed(a) - seed(b))
      return {
        id: id(),
        type: 'match',
        category,
        prompt: 'Match each French phrase to its meaning.',
        left,
        right,
        pairs: pairs.map(([, en], i) => [i, right.indexOf(en)] as [number, number]),
        explanation,
        source: 'grammar',
      }
    },
    conj(verb: string, tense: string, pronoun: string, answers: string[], explanation: string): LessonExercise {
      return { id: id(), type: 'conjugation', category: 'conjugation', prompt: `Conjugate ${verb} (${tense}) for ${pronoun}.`, verb, tense, pronoun, answers, explanation, source: 'grammar' }
    },
    spot(sentence: string, errorWord: string, explanation: string, category = 'grammar'): LessonExercise {
      const words = sentence.split(' ')
      return { id: id(), type: 'spot-error', category, prompt: 'Tap the wrong word.', sentence, words, errorIndex: words.indexOf(errorWord), explanation, source: 'grammar' }
    },
  }
}

function briefBody(spec: UnitSpec): string {
  const out: string[] = [`What you will be able to do: ${spec.goal}`, '']
  let n = 1
  out.push(`**${n++}. Words to learn first (meanings)**`, 'Read each word and its meaning before the grammar. Tap any French word later in the lesson to see it again.', '')
  for (const group of spec.words) {
    out.push(`${group.group}:`)
    for (const word of group.items) out.push(`- *${word.fr}* = ${word.en}${word.note ? ` (${word.note})` : ''}`)
    out.push('')
  }
  out.push(`**${n++}. Useful phrases (learn them whole)**`)
  for (const [fr, en] of spec.chunks) out.push(`- *${fr}* = ${en}`)
  out.push('')
  for (const section of spec.sections) {
    out.push(`**${n++}. ${section.title}**`, ...section.lines, '')
  }
  out.push(`**${n++}. Traps to avoid**`)
  for (const trap of spec.traps) out.push(`- ${trap}`)
  out.push('', `**${n}. How to do this lesson**`, 'Read the story slowly and tap every word you are not sure about. Then listen to the conversation, and finish the practice. Wrong answers come back in Review.')
  return out.join('\n')
}

export function unitWords(spec: UnitSpec): WordSpec[] {
  return spec.words.flatMap((group) => group.items)
}

export function buildUnitLesson(spec: UnitSpec, vocabulary: VocabularyWord[]): LessonContent {
  const reading = readingParagraphs(spec.key, spec.reading, vocabulary)
  const lines = spec.dialogue.lines.map(([speaker, text], i) => conversationLine(speaker, text, `${spec.key}-l${i}`, vocabulary))
  const wordCount = spec.reading.join(' ').split(/\s+/).filter((w) => /[A-Za-zÀ-ÿ]/.test(w)).length
  return {
    brief: { title: spec.title, body: briefBody(spec), ruleSlugs: spec.ruleSlugs ?? [] },
    reading,
    conversation: { title: spec.dialogue.title, setting: spec.dialogue.setting, lines },
    exercises: spec.exercises,
    wordCount,
  }
}
