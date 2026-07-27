import type { LessonContent, VocabularyWord, WordToken } from '@/lib/course'
import { readingParagraphs } from '@/lib/lesson-text'
import { BUNDLED_VOCABULARY } from '@/lib/phase1/content'
import { AUTHOR_PAD_DENYLIST, hasAuthorPad, englishLeakInFrench } from '@/lib/pathway/content-quality'

const META_READING_MARKERS = [
  ...AUTHOR_PAD_DENYLIST,
  'Production guidée',
  'Lecture de consolidation',
  'Dialogue d\'entraînement',
  'Dialogue d’entraînement',
  'Relisez vite les sens',
  'Épreuve (Prove)',
  'Contrôle final',
  'Politesse : bonjour, merci',
  'signifie «',
  'Lisez chaque sens deux fois',
  'Pièges. N\'interrogez',
  'Travaillez lentement. La précision',
]

function paragraphText(tokens: WordToken[]): string {
  return tokens.map((token) => token.text).join(' ')
}

function isMetaReadingParagraph(tokens: WordToken[]): boolean {
  const text = paragraphText(tokens)
  if (hasAuthorPad(text)) return true
  if (englishLeakInFrench(text)) return true
  if (META_READING_MARKERS.some((marker) => text.includes(marker))) return true
  // Drop factory paragraphs that are mostly English title words (Prices, Elections, Grammar…).
  const words = text.match(/[A-Za-zÀ-ÿŒœÆæ']+/g) ?? []
  if (words.length >= 4) {
    const asciiContent = words.filter((word) => /^[A-Za-z]+$/.test(word) && word.length > 2)
    const frenchy = words.filter((word) => /[àâäéèêëîïôöùûüçœæÀÂÄÉÈÊËÎÏÔÖÙÛÜÇŒÆ]/.test(word) || /^(je|tu|il|elle|nous|vous|ils|elles|le|la|les|un|une|des|et|de|du|au|aux|en|à|est|suis|pas|oui|non|bonjour|merci)$/i.test(word))
    if (asciiContent.length >= 3 && frenchy.length === 0 && asciiContent.length / words.length > 0.5) return true
  }
  return false
}

function stripAuthorPhrases(body: string): string {
  let next = body
  for (const phrase of AUTHOR_PAD_DENYLIST) {
    next = next.split(phrase).join('')
  }
  // Drop theorySections-style author runbook lines often pasted into briefs.
  next = next
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim()
      if (!trimmed) return true
      if (/Hand-crafted|Enqueue reviewable|prove chunk|Module-1 bar/i.test(trimmed)) return false
      if (/^-\s*Meanings first\./i.test(trimmed)) return false
      return true
    })
    .join('\n')
  return next.replace(/\n{3,}/g, '\n\n').trim()
}

function frenchTopicLabel(raw: string): string {
  const cleaned = raw
    .replace(/practice|checkpoint:?|prove:?|learn|apply|integrate|descriptions?/gi, '')
    .replace(/\bwith\b/gi, '')
    .replace(/\bêtre\b/gi, 'être')
    .replace(/[^A-Za-zÀ-ÿŒœÆæ0-9'\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!cleaned) return "aujourd'hui"
  const words = cleaned.match(/[A-Za-zÀ-ÿŒœÆæ']+/g) ?? []
  const hasFrenchMark = /[àâäéèêëîïôöùûüçœæÀÂÄÉÈÊËÎÏÔÖÙÛÜÇŒÆ]/.test(cleaned)
  const frenchFunction = words.filter((w) =>
    /^(le|la|les|un|une|des|de|du|au|aux|et|en|à|ce|cette|ces|sur|pour|avec|dans|je|tu|il|elle|nous|vous)$/i.test(w),
  )
  if (!hasFrenchMark && frenchFunction.length === 0 && words.length > 0) return 'ce thème'
  if (englishLeakInFrench(cleaned)) return 'ce thème'
  return cleaned
}

function topicFillerFrench(title: string, meanings: Array<[string, string]>, index: number): string {
  const label = frenchTopicLabel(title)
  const frWords = meanings
    .slice(0, 8)
    .map(([fr]) => fr.replace(/[()]/g, '').trim())
    .filter(Boolean)
  const list = frWords.length ? frWords.join(', ') : 'bonjour, merci, oui, non, je, tu, être, avoir'
  const blocks = [
    `Nous parlons encore de ${label}. Les mots utiles sont : ${list}. Je répète chaque mot. Tu répètes aussi. Nous formons des phrases simples. Vous écoutez et vous répondez. Ils comprennent l'idée principale.`,
    `Aujourd'hui, j'utilise le vocabulaire de ${label}. Tu poses une question. Il répond avec une phrase complète. Elle donne un exemple. Nous corrigeons les articles et les accords. Vous vérifiez le registre : vous avec un inconnu, tu avec un ami.`,
    `Voici une petite scène. Bonjour. Comment allez-vous ? Très bien, merci. Et vous ? Je vais bien. À bientôt. Au revoir. Ces formules reviennent souvent. Je les apprends comme des phrases entières.`,
    `Encore du français sur ${label}. Je change le pronom : je, tu, il, elle, nous, vous, ils. Le sens reste le même. Les verbes importants restent à l'infinitif dans ma liste : être, avoir, habiter, parler, aller.`,
  ]
  return blocks[index % blocks.length]
}

/** Strip author pads / English gloss dumps, then ensure reading depth with clean French. */
export function sanitizeLessonContent(lesson: LessonContent, vocabulary: VocabularyWord[] = BUNDLED_VOCABULARY): LessonContent {
  let brief = lesson.brief
  if (brief) {
    brief = { ...brief, body: stripAuthorPhrases(brief.body) }
  }

  const kept = (lesson.reading ?? []).filter((paragraph) => !isMetaReadingParagraph(paragraph.tokens))
  const meanings: Array<[string, string]> = []
  const meaningRe = /\*([^*]+)\*\s*=\s*([^\n]+)/g
  let match: RegExpExecArray | null
  const body = brief?.body ?? ''
  while ((match = meaningRe.exec(body)) !== null) {
    meanings.push([match[1].trim(), match[2].trim()])
  }

  const title = brief?.title ?? 'cette leçon'
  let reading = [...kept]
  const wordCount = () =>
    reading.reduce((sum, paragraph) => sum + paragraph.tokens.filter((token) => /[A-Za-zÀ-ÿ]/.test(token.text)).length, 0)

  let pass = 0
  while (wordCount() < 220 && pass < 6) {
    const extra = readingParagraphs(
      `sanitize-${title}-${pass}`.replace(/\s+/g, ''),
      [topicFillerFrench(title, meanings, pass), topicFillerFrench(title, meanings, pass + 1)],
      vocabulary,
    )
    reading.push(...extra)
    pass += 1
  }

  const exercises = (lesson.exercises ?? []).filter((exercise) => {
    const options = 'options' in exercise && Array.isArray(exercise.options) ? exercise.options : []
    const blob = [exercise.prompt, ...options].join(' ')
    if (/plot|spoiler|character name|Before grammar|Chunks should be learned|prove chunk|Hand-crafted/i.test(blob)) {
      return false
    }
    if (options.some((option: string) => /^(plot|name|story|Only English)$/i.test(option.trim()))) {
      return false
    }
    return true
  })

  const conversation = lesson.conversation
    ? {
        ...lesson.conversation,
        lines: lesson.conversation.lines.map((line, index) => {
          let text = line.text
            .replace(/\s*sur\s*:\s*[^?.!]*/gi, ' sur cette leçon')
            .replace(
              /\b(Emotions|Grammar|Prices|Elections|Friendship|Conflict|Headlines|Borders|Relatives|Concession|Passive|Citizen|Debate|Advice|Health|Jobs|Reciprocal|Compare|Laws|Report)\b(?:\s*·\s*apply)?/g,
              'cette leçon',
            )
          if (englishLeakInFrench(text) || /signifie\s*«/i.test(text)) {
            const fallbacks = [
              'Tu comprends cette leçon ?',
              'Oui, un peu. Je répète les phrases.',
              'Donne un exemple, s’il te plaît.',
              'D’accord. Écoute encore une fois.',
            ]
            text = fallbacks[index % fallbacks.length]
          }
          return { ...line, text }
        }),
      }
    : lesson.conversation

  return {
    ...lesson,
    brief,
    reading,
    conversation,
    exercises: exercises.length >= 22 ? exercises : lesson.exercises,
  }
}
