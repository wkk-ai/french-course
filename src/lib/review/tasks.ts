import type { LessonExercise } from '@/lib/exercises/types'
import { buildRemediationExercises } from '@/lib/exercises/enrich'
import type { ReviewMistake, ReviewPoolItem, ReviewTask, ReviewTaskKind } from '@/lib/review/types'
import { MODULE1_VOCABULARY } from '@/lib/module1-content'

function bundledWord(vocabId: string) {
  return MODULE1_VOCABULARY.find((word) => word.id === vocabId) ?? null
}

function distractorsFor(correct: string, pool: string[], count = 3): string[] {
  const normalized = correct.toLowerCase()
  const others = pool.filter((item) => item.toLowerCase() !== normalized)
  const picked: string[] = []
  for (let i = 0; i < others.length && picked.length < count; i += 1) {
    const index = (correct.length * 7 + i * 13) % others.length
    const candidate = others[index]
    if (!picked.includes(candidate)) picked.push(candidate)
  }
  while (picked.length < count) picked.push(`—${picked.length}`)
  return picked
}

function shuffleStable<T>(items: T[], seed: string): T[] {
  const copy = [...items]
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  for (let i = copy.length - 1; i > 0; i -= 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0
    const j = hash % (i + 1)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function clozeFromExample(french: string, word: string): { text: string; answers: string[] } | null {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`\\b${escaped}\\b`, 'i')
  if (!regex.test(french)) return null
  return {
    text: french.replace(regex, '___'),
    answers: [word, word.charAt(0).toUpperCase() + word.slice(1)],
  }
}

/** Build a retrieval exercise for one vocab item in the infinite loop. */
export function taskFromPoolItem(item: ReviewPoolItem, kind: ReviewTaskKind, modalityIndex = 0): ReviewTask {
  const bundled = bundledWord(item.vocab_id)
  const word = item.word ?? bundled?.word ?? 'mot'
  const translation = item.base_translation ?? bundled?.base_translation ?? 'word'
  const exampleFrench = item.example_french ?? bundled?.example?.french ?? null
  const exampleEnglish = item.example_english ?? bundled?.example?.english ?? null
  const meaningPool = MODULE1_VOCABULARY.map((entry) => entry.base_translation.split(';')[0].trim()).filter(Boolean)

  const modalities: LessonExercise[] = []

  // 1) Meaning in context / MCQ FR → EN
  {
    const options = shuffleStable([translation, ...distractorsFor(translation, meaningPool)], `${item.vocab_id}-m`)
    modalities.push({
      id: `rv-meaning-${item.vocab_id}`,
      type: 'mcq',
      category: 'vocab-meaning',
      source: kind === 'spiral' ? 'spiral' : 'grammar',
      prompt: `What does “${word}” mean?`,
      options,
      answer: Math.max(0, options.findIndex((option) => option.toLowerCase() === translation.toLowerCase())),
      explanation: exampleFrench
        ? `${word} — ${translation}. Example: ${exampleFrench}${exampleEnglish ? ` (${exampleEnglish})` : ''}`
        : `${word} means “${translation}”.`,
    })
  }

  // 2) Context cloze from dictionary example
  if (exampleFrench) {
    const cloze = clozeFromExample(exampleFrench, word)
    if (cloze) {
      modalities.push({
        id: `rv-cloze-${item.vocab_id}`,
        type: 'cloze',
        category: 'vocab-cloze',
        source: 'reading',
        prompt: 'Fill the blank from a sentence you have seen.',
        text: cloze.text,
        answers: cloze.answers,
        explanation: exampleEnglish ? `${exampleFrench} — ${exampleEnglish}` : exampleFrench,
        hint: `Starts with “${word.slice(0, 1)}…”`,
      })
    }
  }

  // 3) Production: EN → FR
  modalities.push({
    id: `rv-translate-${item.vocab_id}`,
    type: 'translate',
    category: 'vocab-produce',
    source: 'grammar',
    direction: 'en-fr',
    prompt: `Translate to French: “${translation.split(';')[0].trim()}”`,
    answers: [word],
    explanation: exampleFrench
      ? `“${word}” — ${translation}. ${exampleFrench}`
      : `“${word}” — ${translation}.`,
    hint: `Part of speech: ${item.part_of_speech ?? bundled?.part_of_speech ?? 'word'}`,
  })

  const exercise = modalities[modalityIndex % modalities.length]
  return {
    id: `${kind}-${exercise.id}-${modalityIndex}`,
    kind,
    exercise,
    vocabId: item.vocab_id,
    poolItem: item,
  }
}

/** Repair drills from unresolved mistakes — require a correct attempt to resolve. */
export function tasksFromMistakes(mistakes: ReviewMistake[]): ReviewTask[] {
  const tasks: ReviewTask[] = []
  for (const mistake of mistakes) {
    if (mistake.grammar_category) {
      const remediation = buildRemediationExercises([mistake.grammar_category])
      if (remediation[0]) {
        tasks.push({
          id: `repair-${mistake.id}`,
          kind: 'repair',
          mistakeId: mistake.id,
          vocabId: mistake.vocab_id ?? undefined,
          exercise: {
            ...remediation[0],
            id: `repair-ex-${mistake.id}`,
            source: 'remediation',
            prompt: remediation[0].prompt.replace('Extra practice from your mistakes:', 'Repair:'),
            explanation: `${remediation[0].explanation}${mistake.error_context ? ` (You missed: ${mistake.error_context})` : ''}`,
          },
        })
        continue
      }
    }

    if (mistake.word && mistake.base_translation) {
      const options = shuffleStable(
        [mistake.base_translation, ...distractorsFor(mistake.base_translation, MODULE1_VOCABULARY.map((w) => w.base_translation), 3)],
        mistake.id,
      )
      tasks.push({
        id: `repair-vocab-${mistake.id}`,
        kind: 'repair',
        mistakeId: mistake.id,
        vocabId: mistake.vocab_id ?? undefined,
        exercise: {
          id: `repair-vocab-ex-${mistake.id}`,
          type: 'mcq',
          category: mistake.grammar_category ?? 'vocab-repair',
          source: 'remediation',
          prompt: `Repair: what does “${mistake.word}” mean?`,
          options,
          answer: Math.max(0, options.findIndex((option) => option === mistake.base_translation)),
          explanation: mistake.error_context ?? `${mistake.word} — ${mistake.base_translation}`,
        },
      })
      continue
    }

    // Generic grammar fallback from context
    tasks.push({
      id: `repair-generic-${mistake.id}`,
      kind: 'repair',
      mistakeId: mistake.id,
      exercise: {
        id: `repair-generic-ex-${mistake.id}`,
        type: 'true-false',
        category: mistake.grammar_category ?? 'review',
        source: 'remediation',
        prompt: 'Repair: confirm you understand this miss.',
        statement: mistake.error_context ?? `Review the pattern: ${mistake.grammar_category ?? 'grammar'}`,
        answer: true,
        explanation: 'Mark true once you have re-read the rule, then keep practicing in lessons.',
      },
    })
  }
  return tasks
}
