import { notFound } from 'next/navigation'
import type { GrammarRule, VerbConjugation, VocabularyWord } from '@/lib/course'
import { isCanonicalChapterId } from '@/lib/course-catalog'
import { resolveConjugations, resolveLessonContent, resolveRules, resolveVocabulary } from '@/lib/lesson-content'
import { MODULE1_CHAPTER_IDS } from '@/lib/module1-content'
import { createStaticClient } from '@/utils/supabase/static'
import LessonClient from './LessonClient'

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const fromDb = supabase ? (await supabase.from('chapters').select('id')).data ?? [] : []
  const ids = new Set([
    ...fromDb.map((chapter) => chapter.id).filter(isCanonicalChapterId),
    ...MODULE1_CHAPTER_IDS,
  ])
  return [...ids].map((id) => ({ id }))
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createStaticClient()
  if (!supabase) notFound()

  const { data: chapter } = await supabase
    .from('chapters')
    .select('*, module:modules(title, order_index)')
    .eq('id', id)
    .maybeSingle()

  if (!chapter) notFound()

  const content = resolveLessonContent(chapter.id, chapter.lesson_content)
  if (!content) {
    return (
      <main className="mx-auto flex min-h-screen max-w-[680px] items-center p-6">
        <section className="tactile-card p-6">
          <h1 className="text-headline-md">{chapter.title}</h1>
          <p className="mt-2 text-on-surface-variant">This chapter is part of the course pathway, but its learning content is still being authored.</p>
        </section>
      </main>
    )
  }

  const lemmaIds = [...new Set(content.reading?.flatMap((paragraph) => paragraph.tokens.map((token) => token.lemmaId).filter((lemmaId): lemmaId is string => Boolean(lemmaId))) ?? [])]
  const ruleSlugs = content.brief?.ruleSlugs ?? []
  const [{ data: vocabulary }, { data: conjugations }, { data: rules }] = await Promise.all([
    lemmaIds.length ? supabase.from('vocabulary').select('*').in('id', lemmaIds) : Promise.resolve({ data: [] }),
    lemmaIds.length ? supabase.from('verb_conjugations').select('*').in('vocab_id', lemmaIds).order('order_index') : Promise.resolve({ data: [] }),
    ruleSlugs.length ? supabase.from('grammar_rules').select('*').in('slug', ruleSlugs) : Promise.resolve({ data: [] }),
  ])

  return (
    <LessonClient
      chapterId={chapter.id}
      title={chapter.title}
      content={content}
      vocabulary={resolveVocabulary(lemmaIds, (vocabulary ?? []) as VocabularyWord[])}
      conjugations={resolveConjugations(lemmaIds, (conjugations ?? []) as VerbConjugation[])}
      rules={resolveRules(ruleSlugs, (rules ?? []) as GrammarRule[])}
    />
  )
}
