import type { LessonContent, VocabularyWord } from '@/lib/course'
import { isPunctuationToken, tokenizeFrench } from '@/lib/clickable-text'
import { isPathwayProperNoun, untappableSurfaces } from '@/lib/pathway/content-quality'

export type TapCoverageStats = {
  totalWordTokens: number
  missTokens: number
  missRate: number
  uniqueMisses: number
}

/** Count alphabetic reading+dialogue tokens lacking lemmaId after enrichTokens. */
export function measureLessonTapCoverage(lesson: LessonContent, vocabulary: VocabularyWord[]): TapCoverageStats {
  let totalWordTokens = 0
  let missTokens = 0

  const texts: string[] = []
  for (const paragraph of lesson.reading ?? []) {
    texts.push(paragraph.tokens.map((token) => token.text).join(' '))
  }
  for (const line of lesson.conversation?.lines ?? []) {
    texts.push(line.tokens?.map((token) => token.text).join(' ') ?? line.text)
  }

  for (const [index, text] of texts.entries()) {
    const tokens = tokenizeFrench(text, `m${index}`, vocabulary)
    for (const token of tokens) {
      if (isPunctuationToken(token.text)) continue
      if (!/[A-Za-zÀ-ÿŒœÆæ]/.test(token.text)) continue
      totalWordTokens += 1
      if (!token.lemmaId && !isPathwayProperNoun(token.text)) missTokens += 1
    }
  }

  return {
    totalWordTokens,
    missTokens,
    missRate: totalWordTokens ? missTokens / totalWordTokens : 0,
    uniqueMisses: untappableSurfaces(lesson, vocabulary).length,
  }
}

export function measureBundledTapCoverage(
  lessons: Record<string, LessonContent>,
  chapterIds: string[],
  vocabulary: VocabularyWord[],
): TapCoverageStats & { byChapter: Map<string, TapCoverageStats> } {
  const byChapter = new Map<string, TapCoverageStats>()
  let totalWordTokens = 0
  let missTokens = 0
  let uniqueMisses = 0

  for (const chapterId of chapterIds) {
    const lesson = lessons[chapterId]
    if (!lesson) continue
    const stats = measureLessonTapCoverage(lesson, vocabulary)
    byChapter.set(chapterId, stats)
    totalWordTokens += stats.totalWordTokens
    missTokens += stats.missTokens
    uniqueMisses += stats.uniqueMisses
  }

  return {
    totalWordTokens,
    missTokens,
    missRate: totalWordTokens ? missTokens / totalWordTokens : 0,
    uniqueMisses,
    byChapter,
  }
}
