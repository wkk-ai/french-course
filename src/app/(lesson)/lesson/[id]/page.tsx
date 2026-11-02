import { UNIT_BY_ID, UNIT_LESSON_IDS } from '@/lib/pathway/units'
import { notFound } from 'next/navigation'
import LessonShell from './LessonShell'

export function generateStaticParams() {
  return UNIT_LESSON_IDS.map((id) => ({ id }))
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const unit = UNIT_BY_ID.get(id)
  if (!unit) notFound()
  const title = unit.title
  return <LessonShell chapterId={id} title={title} />
}
