import { BUNDLED_CHAPTER_IDS } from '@/lib/bundled-chapter-ids'
import { isCanonicalChapterId } from '@/lib/course-catalog'
import { PATHWAY_BY_CHAPTER_ID } from '@/lib/pathway/catalog'
import { notFound } from 'next/navigation'
import LessonShell from './LessonShell'

export function generateStaticParams() {
  return BUNDLED_CHAPTER_IDS.filter(isCanonicalChapterId).map((id) => ({ id }))
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pathway = PATHWAY_BY_CHAPTER_ID.get(id)
  if (!pathway && !BUNDLED_CHAPTER_IDS.includes(id)) notFound()
  const title = pathway?.sub.title ?? 'Lesson'
  return <LessonShell chapterId={id} title={title} />
}
