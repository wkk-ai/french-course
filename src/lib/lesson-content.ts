import { hasLessonContent, type GrammarRule, type LessonContent, type VerbConjugation, type VocabularyWord } from '@/lib/course'
import {
  MODULE1_CONJUGATIONS,
  MODULE1_LESSONS,
  MODULE1_RULES,
  MODULE1_VOCABULARY,
} from '@/lib/module1-content'

export function resolveLessonContent(chapterId: string, content: unknown): LessonContent | null {
  if (hasLessonContent(content)) return content
  return MODULE1_LESSONS[chapterId] ?? null
}

export function withResolvedLessonContent<T extends { id: string; lesson_content: unknown }>(chapters: T[]): T[] {
  return chapters.map((chapter) => {
    const resolved = resolveLessonContent(chapter.id, chapter.lesson_content)
    return resolved ? { ...chapter, lesson_content: resolved } : chapter
  })
}

export function resolveVocabulary(lemmaIds: string[], fromDb: VocabularyWord[]): VocabularyWord[] {
  const byId = new Map(MODULE1_VOCABULARY.map((word) => [word.id, word]))
  for (const word of fromDb) byId.set(word.id, word)
  return lemmaIds.map((id) => byId.get(id)).filter((word): word is VocabularyWord => Boolean(word))
}

export function resolveConjugations(lemmaIds: string[], fromDb: VerbConjugation[]): VerbConjugation[] {
  const lemmaSet = new Set(lemmaIds)
  const fromStatic = MODULE1_CONJUGATIONS.filter((item) => lemmaSet.has(item.vocab_id))
  if (fromDb.length) return fromDb
  return fromStatic
}

export function resolveRules(slugs: string[], fromDb: GrammarRule[]): GrammarRule[] {
  const bySlug = new Map(MODULE1_RULES.map((rule) => [rule.slug, rule]))
  for (const rule of fromDb) bySlug.set(rule.slug, rule)
  return slugs.map((slug) => bySlug.get(slug)).filter((rule): rule is GrammarRule => Boolean(rule))
}
