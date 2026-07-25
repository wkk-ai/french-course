import { hasLessonContent, type GrammarRule, type LessonContent, type VerbConjugation, type VocabularyWord } from '@/lib/course'
import { BUNDLED_LESSONS } from '@/lib/bundled-lessons'
import { enrichLessonExercises } from '@/lib/exercises/enrich'
import {
  MODULE1_CONJUGATIONS,
  MODULE1_RULES,
  MODULE1_VOCABULARY,
} from '@/lib/module1-content'
import { BUNDLED_VOCABULARY } from '@/lib/phase1/content'

export function resolveLessonContent(
  chapterId: string,
  content: unknown,
  options?: { remediationCategories?: string[] },
): LessonContent | null {
  // Prefer authored bundles over thin DB stubs that would shadow them.
  const bundled = BUNDLED_LESSONS[chapterId]
  const base = bundled ?? (hasLessonContent(content) ? content : null)
  if (!base) return null
  return {
    ...base,
    exercises: enrichLessonExercises(chapterId, base.exercises ?? [], options?.remediationCategories ?? []),
  }
}

export function withResolvedLessonContent<T extends { id: string; lesson_content: unknown }>(chapters: T[]): T[] {
  return chapters.map((chapter) => {
    const resolved = resolveLessonContent(chapter.id, chapter.lesson_content)
    return resolved ? { ...chapter, lesson_content: resolved } : chapter
  })
}

export function resolveVocabulary(lemmaIds: string[], fromDb: VocabularyWord[]): VocabularyWord[] {
  const byId = new Map(BUNDLED_VOCABULARY.map((word) => [word.id, word]))
  for (const word of fromDb) {
    const existing = byId.get(word.id)
    byId.set(word.id, existing ? { ...word, ...existing } : word)
  }
  // Prefer bundled rows for requested lemmas; keep multiword helpers that share surface forms.
  const requested = new Set(lemmaIds)
  const resolved = lemmaIds.map((id) => byId.get(id)).filter((word): word is VocabularyWord => Boolean(word))
  // Also include any bundled idiom/multiword whose id was requested indirectly via reading tokens.
  for (const word of BUNDLED_VOCABULARY) {
    if (requested.has(word.id) && !resolved.some((item) => item.id === word.id)) resolved.push(word)
  }
  return resolved.length ? resolved : lemmaIds.map((id) => byId.get(id)).filter((word): word is VocabularyWord => Boolean(word))
}

export function resolveConjugations(lemmaIds: string[], fromDb: VerbConjugation[]): VerbConjugation[] {
  const byId = new Map(MODULE1_CONJUGATIONS.map((item) => [item.id, item]))
  for (const item of fromDb) byId.set(item.id, item)
  const lemmaSet = new Set(lemmaIds.length ? lemmaIds : MODULE1_VOCABULARY.map((word) => word.id))
  if (MODULE1_CONJUGATIONS.some((item) => lemmaSet.has(item.vocab_id))) {
    return [...byId.values()].sort((left, right) => left.order_index - right.order_index || left.id.localeCompare(right.id))
  }
  return fromDb
}

export function resolveRules(slugs: string[], fromDb: GrammarRule[]): GrammarRule[] {
  const bySlug = new Map(MODULE1_RULES.map((rule) => [rule.slug, rule]))
  for (const rule of fromDb) {
    const existing = bySlug.get(rule.slug)
    bySlug.set(rule.slug, existing ?? rule)
  }
  return slugs.map((slug) => bySlug.get(slug)).filter((rule): rule is GrammarRule => Boolean(rule))
}
