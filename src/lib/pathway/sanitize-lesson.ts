import type { LessonContent, VocabularyWord, WordToken } from '@/lib/course'
import { readingParagraphs } from '@/lib/lesson-text'
import { BUNDLED_VOCABULARY } from '@/lib/bundled-vocabulary'
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
  if (words.length >= 3) {
    const asciiContent = words.filter((word) => /^[A-Za-z]+$/.test(word) && word.length > 2)
    const frenchy = words.filter((word) => /[àâäéèêëîïôöùûüçœæÀÂÄÉÈÊËÎÏÔÖÙÛÜÇŒÆ]/.test(word) || /^(je|tu|il|elle|nous|vous|ils|elles|le|la|les|un|une|des|et|de|du|au|aux|en|à|est|suis|pas|oui|non|bonjour|merci)$/i.test(word))
    if (asciiContent.length >= 2 && frenchy.length === 0 && asciiContent.length / words.length > 0.45) return true
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
    const fr = match[1].trim()
    const en = match[2].trim()
    // Do not pad reading with English lemma labels from bad briefs.
    if (/^[A-Za-z]+$/.test(fr) && !/[àâäéèêëîïôöùûüçœæ]/i.test(fr) && fr.length > 2) {
      if (englishLeakInFrench(fr) || /^(wild|import|radar|structure|texte)$/i.test(fr)) continue
    }
    if (englishLeakInFrench(fr)) continue
    meanings.push([fr, en])
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
              /\b(Emotions|Grammar|Prices|Elections|Friendship|Conflict|Headlines|Borders|Relatives|Concession|Passive|Citizen|Debate|Advice|Health|Jobs|Reciprocal|Compare|Laws|Report|Office|Studies|Tech|Climate|Poetry|Idioms|News|Essay|Data|Results|Research|Companies|Consumer|Hypothesis|Opinion|Global|Phase|Drills|Literary|Comprehension|onboarding|markers|openers|triggers|lexicon|skeleton|rewrite|Analysis|Character|Tone|Recycling|Proposals|Planet|Regret|Witness|Memory|Thesis|Support|Counter|Meetings|Reports|Objectives|Project|Forms|Applications|Contracts|Boilerplate|Disputes|Feature|Investigation|Editorial|Synthesis|Varieties|Norms|Africa|Americas|Diversity|Tale|Chapter|Ending|Food|Shopping|Fill|Formal|Version|Exact|Mix|Consequence|Yesterday|narrative|recap|review|Error|correction|Announcement|choice|Letter|Predictions|Promise|letter|Gift|scenario|Narrative|Biography|Register|ladder|Checkpoint|Prove|Tense|Weekend)\b(?:\s*·\s*apply)?/gi,
              'cette leçon',
            )
            .replace(/\bin\s+the\s+wild\b/gi, 'dans la vraie vie')
            .replace(/\bVersion\s*(tu|vous)\b/gi, 'Et toi')
            .replace(/hierj'ai…\/demainjevais…\/l'annéeprochaineje…rai/gi, "Hier j'ai fini. Demain je vais parler.")
            .replace(/…rai/g, ' parlerai')
          if (
            englishLeakInFrench(text) ||
            /signifie\s*«/i.test(text) ||
            /\b[A-Z][a-z]+(?:[A-Z][a-z]+)+\b/.test(text) ||
            /^(where|never|ladder|scenario|review|recap|narrative)$/i.test(text.trim())
          ) {
            const fallbacks = [
              'Tu comprends cette leçon ?',
              'Oui, un peu. Je répète les phrases.',
              'Donne un exemple, s’il te plaît.',
              'D’accord. Écoute encore une fois.',
            ]
            text = fallbacks[index % fallbacks.length]
          }
          // Tokens must match scrubbed text — otherwise EN theme titles stay tappable-missing.
          return {
            ...line,
            text,
            tokens: readingParagraphs(`conv-${index}`, [text], vocabulary)[0]?.tokens ?? line.tokens,
          }
        }),
      }
    : lesson.conversation

  // Drop reading paragraphs that are mostly English title noise or broken futur pads (…rai).
  reading = reading.filter((paragraph) => {
    const text = paragraph.tokens.map((t) => t.text).join('')
    if (/\b(Office|Studies|Tech|Climate|Poetry|onboarding|Comprehension|Drills|Phase I|In The Wild|Global tense|Fill many|Write from|Formal vs|postcard|prompts)\b/i.test(text)) {
      return false
    }
    if (/=atmy|at my parents|=at\s*my\b/i.test(text)) return false
    // Factory futur pads glue as je…raiOn… — no word boundary after rai.
    if (/je…+rai/i.test(text) || /je\.{2,}rai/i.test(text) || /…rai/.test(text) || /\/l'annéeprochaineje/i.test(text)) return false
    return true
  })

  // Re-pad if scrubbing removed too much reading depth.
  pass = 0
  while (wordCount() < 220 && pass < 4) {
    const extra = readingParagraphs(
      `sanitize2-${title}-${pass}`.replace(/\s+/g, ''),
      [topicFillerFrench(title, meanings, pass + 3)],
      vocabulary,
    )
    reading.push(...extra)
    pass += 1
  }

  return {
    ...lesson,
    brief,
    reading,
    conversation,
    exercises: exercises.length >= 22 ? exercises : lesson.exercises,
  }
}
