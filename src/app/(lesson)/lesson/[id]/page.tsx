import { notFound } from 'next/navigation'
import { hasLessonContent, type GrammarRule, type LessonContent, type VerbConjugation, type VocabularyWord } from '@/lib/course'
import { createStaticClient } from '@/utils/supabase/static'
import LessonClient from './LessonClient'

export async function generateStaticParams() {
  const supabase = createStaticClient()
  if (!supabase) return []
  const { data } = await supabase.from('chapters').select('id')
  return (data ?? []).map((chapter) => ({ id: chapter.id }))
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
  if (!hasLessonContent(chapter.lesson_content)) {
    return (
      <main className="mx-auto flex min-h-screen max-w-[680px] items-center p-6">
        <section className="tactile-card p-6">
          <h1 className="text-headline-md">{chapter.title}</h1>
          <p className="mt-2 text-on-surface-variant">This chapter is part of the course pathway, but its learning content is still being authored.</p>
        </section>
      </main>
    )
  }

  const content = chapter.lesson_content as LessonContent
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
      vocabulary={(vocabulary ?? []) as VocabularyWord[]}
      conjugations={(conjugations ?? []) as VerbConjugation[]}
      rules={(rules ?? []) as GrammarRule[]}
    />
  )
}
