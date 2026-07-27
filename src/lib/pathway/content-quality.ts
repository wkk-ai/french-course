import type { LessonContent, VocabularyWord } from '@/lib/course'
import { enrichTokens, isPunctuationToken, tokenizeFrench } from '@/lib/clickable-text'

/** Authoring / CI padding phrases that must not appear in learner-facing French or Theory. */
export const AUTHOR_PAD_DENYLIST: string[] = [
  'Deep practice (Module-1 bar)',
  'Deep practice notes',
  'Store verbs as infinitives',
  'Dans cette leçon, relisez',
  'dictionnaire cliquable',
  'Hand-crafted focus',
  'Enqueue reviewable lemmas',
  'Lecture de consolidation',
  'Module-1 bar',
  'Every meaningful word needs a lemma',
  'Produce six pronoun variants',
  'Le but n’est pas',
  "Le but n'est pas",
  "Le but n'est pas de finir en une minute",
  'Dialogue d’entraînement (formes et sens, pas l’histoire)',
  "Dialogue d'entraînement (formes et sens, pas l'histoire)",
  'Les verbes s’apprennent à l’infinitif',
  "Les verbes s'apprennent à l'infinitif",
  'Lisez chaque sens deux fois avant de continuer',
  'Structure du jour :',
  'Production guidée. Répétez, puis cachez le modèle',
  "N'interrogez jamais le scénario",
  'N’interrogez jamais le scénario',
  'Pour atteindre la barre du Module 1',
  'prove chunk',
  'one-minute click-through',
  'Relisez vite les sens',
  'Contrôle final : expliquez la règle',
  'Épreuve (Prove)',
]

const PROPER_NOUN_ALLOWLIST = new Set([
  'marc',
  'marie',
  'sophie',
  'paul',
  'thomas',
  'pierre',
  'paris',
  'lyon',
  'france',
  'canada',
  'belgique',
  'suisse',
  'luc',
  'julie',
  'claire',
  'nicolas',
  'emma',
  'antoine',
])

const EN_GRAMMAR_LEAK =
  /\b(past tense|past participle|with avoir|with être|you finished|I ate|I have eaten|still \/ again|to eat|to finish|to speak|to see|to take|to do\/make|to write|to buy|goodbye|see you soon|please informal)\b/i

const EN_GLOSS_LEAK = /signifie\s*«/i
const EN_TITLE_IN_FR =
  /\b(Emotions|Grammar|Prices|Elections|Friendship|Conflict|Headlines|Borders|Relatives|Concession|Passive|Citizen|Debate|Advice|Health|Jobs|Reciprocal|Compare|Laws|Report|scene|story|drill|news|nouns|tone|switch|Final|global|texts|diploma)\b/

export function hasAuthorPad(text: string): boolean {
  const lower = text.toLowerCase()
  return AUTHOR_PAD_DENYLIST.some((phrase) => lower.includes(phrase.toLowerCase()))
}

/** Detect English grammar labels or gloss dumps inside French reading/dialogue. */
export function englishLeakInFrench(text: string): boolean {
  if (EN_GRAMMAR_LEAK.test(text)) return true
  if (EN_GLOSS_LEAK.test(text)) return true
  if (EN_TITLE_IN_FR.test(text)) return true
  if (/\bStructure du jour\s*:[^·\n]*\b(with|regular|irregular|tense|apply)\b/i.test(text)) return true
  return false
}

function isProperNounAllowlisted(surface: string): boolean {
  const trimmed = surface.trim().replace(/^[«»"'(\[]+/, '').replace(/[.,!?;:»"')\]]+$/, '')
  if (!/^[A-ZÀ-Ÿ]/.test(trimmed)) return false
  return PROPER_NOUN_ALLOWLIST.has(trimmed.normalize('NFC').toLowerCase())
}

function collectUntappable(text: string, prefix: string, vocabulary: VocabularyWord[], out: Set<string>) {
  const tokens = tokenizeFrench(text, prefix, vocabulary)
  for (const token of tokens) {
    if (token.lemmaId) continue
    if (isPunctuationToken(token.text)) continue
    if (!/[A-Za-zÀ-ÿŒœÆæ]/.test(token.text)) continue
    if (isProperNounAllowlisted(token.text)) continue
    out.add(token.text)
  }
}

/** Alphabetic surfaces in reading + dialogue that lack a lemma after enrichTokens. */
export function untappableSurfaces(lesson: LessonContent, vocabulary: VocabularyWord[]): string[] {
  const surfaces = new Set<string>()

  for (const [pi, paragraph] of (lesson.reading ?? []).entries()) {
    const text = paragraph.tokens.map((t) => t.text).join(' ')
    collectUntappable(text, `r${pi}`, vocabulary, surfaces)
  }

  for (const [li, line] of (lesson.conversation?.lines ?? []).entries()) {
    const text = line.tokens?.map((t) => t.text).join(' ') ?? line.text
    collectUntappable(text, `c${li}`, vocabulary, surfaces)
  }

  return [...surfaces].sort((a, b) => a.localeCompare(b, 'fr'))
}
