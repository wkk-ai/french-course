import { notFound, redirect } from 'next/navigation'
import { hasLessonContent, type GrammarRule, type LessonContent, type VerbConjugation, type VocabularyWord } from '@/lib/course'
import { createClient } from '@/utils/supabase/server'
import LessonClient from './LessonClient'

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: chapter }, { data: { user } }] = await Promise.all([
    supabase.from('chapters').select('*, module:modules(title, order_index)').eq('id', id).maybeSingle(),
    supabase.auth.getUser(),
  ])

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

  if (!user) redirect('/login')

  const { data: progress } = await supabase
    .from('user_chapter_progress')
    .select('chapter_id, status')
    .eq('user_id', user.id)

  const { data: authored } = await supabase
    .from('chapters')
    .select('id, lesson_content, order_index, module:modules(order_index)')

  const orderedAuthored = (authored ?? [])
    .filter((item) => hasLessonContent(item.lesson_content))
    .sort((left, right) => {
      const leftModule = Array.isArray(left.module) ? left.module[0] : left.module
      const rightModule = Array.isArray(right.module) ? right.module[0] : right.module
      return (leftModule?.order_index ?? 0) - (rightModule?.order_index ?? 0) || left.order_index - right.order_index
    })
  const completed = new Set((progress ?? []).filter((item) => item.status === 'completed').map((item) => item.chapter_id))
  const firstIncomplete = orderedAuthored.find((item) => !completed.has(item.id))?.id

  if (!completed.has(chapter.id) && firstIncomplete !== chapter.id) redirect('/')

  const content = chapter.lesson_content as LessonContent
  const lemmaIds = [...new Set(content.reading?.flatMap((paragraph) => paragraph.tokens.map((token) => token.lemmaId).filter((id): id is string => Boolean(id))) ?? [])]
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
