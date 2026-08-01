import type { LessonContent, VocabularyWord, WordToken } from '@/lib/course'
import { BUNDLED_VOCABULARY } from '@/lib/bundled-vocabulary'
import { AUTHOR_PAD_DENYLIST, hasAuthorPad, englishLeakInFrench } from '@/lib/pathway/content-quality'

const META_READING_MARKERS = [
  ...AUTHOR_PAD_DENYLIST,
  'Production guidée',
  'Lecture de consolidation',
  "Dialogue d'entraînement",
  'Dialogue d’entraînement',
  'Relisez vite les sens',
  'Épreuve (Prove)',
  'Contrôle final',
  'Politesse : bonjour, merci',
  'signifie «',
  'Lisez chaque sens deux fois',
  "Pièges. N'interrogez",
  'Travaillez lentement. La précision',
  'Nous parlons encore de',
  'revient dans la leçon',
  'On répète les phrases',
  'Voici encore du français sur',
]

function paragraphText(tokens: WordToken[]): string {
  return tokens.map((token) => token.text).join(' ')
}

function isMetaReadingParagraph(tokens: WordToken[]): boolean {
  const text = paragraphText(tokens)
  if (hasAuthorPad(text)) return true
  if (englishLeakInFrench(text)) return true
  if (META_READING_MARKERS.some((marker) => text.includes(marker))) return true
  const words = text.match(/[A-Za-zÀ-ÿŒœÆæ']+/g) ?? []
  if (words.length >= 3) {
    const asciiContent = words.filter((word) => /^[A-Za-z]+$/.test(word) && word.length > 2)
    const frenchy = words.filter(
      (word) =>
        /[àâäéèêëîïôöùûüçœæÀÂÄÉÈÊËÎÏÔÖÙÛÜÇŒÆ]/.test(word) ||
        /^(je|tu|il|elle|nous|vous|ils|elles|le|la|les|un|une|des|et|de|du|au|aux|en|à|est|suis|pas|oui|non|bonjour|merci)$/i.test(
          word,
        ),
    )
    if (asciiContent.length >= 2 && frenchy.length === 0 && asciiContent.length / words.length > 0.45) return true
  }
  return false
}

function stripAuthorPhrases(body: string): string {
  let next = body
  for (const phrase of AUTHOR_PAD_DENYLIST) {
    next = next.split(phrase).join('')
  }
  next = next
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim()
      if (!trimmed) return true
      if (/Hand-crafted|Enqueue reviewable|prove chunk|Module-1 bar|Practice order|read-only if early|remediate B\/C|Prove gate/i.test(trimmed)) {
        return false
      }
      if (/^-\s*Meanings first\./i.test(trimmed)) return false
      return true
    })
    .join('\n')
  return next.replace(/\n{3,}/g, '\n\n').trim()
}

/** Strip author pads / English gloss dumps. Never re-inflate with filler French. */
export function sanitizeLessonContent(lesson: LessonContent, vocabulary: VocabularyWord[] = BUNDLED_VOCABULARY): LessonContent {
  void vocabulary
  let brief = lesson.brief
  if (brief) {
    brief = { ...brief, body: stripAuthorPhrases(brief.body) }
  }

  let reading = (lesson.reading ?? []).filter((paragraph) => !isMetaReadingParagraph(paragraph.tokens))

  const exercises = (lesson.exercises ?? []).filter((exercise) => {
    const options = 'options' in exercise && Array.isArray(exercise.options) ? exercise.options : []
    const blob = [exercise.prompt, ...options].join(' ')
    if (/plot|spoiler|character name|Before grammar|Chunks should be learned|prove chunk|Hand-crafted/i.test(blob)) {
      return false
    }
    if (options.some((option: string) => /^(plot|name|story|Only English)$/i.test(option.trim()))) {
      return false
    }
    if (/-pad\d+/i.test(exercise.id)) return false
    return true
  })

  const conversation = lesson.conversation
    ? {
        ...lesson.conversation,
        setting: lesson.conversation.setting
          ?.replace(/Prove gate[^.!]*/gi, '')
          .replace(/Fail\s*→\s*remediate[^.!]*/gi, '')
          .replace(/\s{2,}/g, ' ')
          .trim(),
        lines: lesson.conversation.lines.map((line) => {
          let text = line.text
          if (/Je comprends la règle|Es-tu prêt|Examinateur/i.test(`${line.speaker} ${text}`)) {
            // Leave craft dialogues alone; only flag classic shells if speaker is Examinateur
          }
          if (englishLeakInFrench(text) || /signifie\s*«/i.test(text)) {
            text = 'Tu comprends cette phrase ?'
          }
          return { ...line, text }
        }),
      }
    : lesson.conversation

  reading = reading.filter((paragraph) => {
    const text = paragraph.tokens.map((t) => t.text).join('')
    if (/\b(Office|Studies|Tech|Climate|Poetry|onboarding|Comprehension|Drills|Phase I|In The Wild|Global tense)\b/i.test(text)) {
      return false
    }
    if (/je…+rai/i.test(text) || /…rai/.test(text)) return false
    return true
  })

  return {
    ...lesson,
    brief,
    reading,
    conversation,
    exercises: exercises.length >= 22 ? exercises : lesson.exercises,
  }
}
