import { hasLessonContent } from '@/lib/course'
import { filterCourseCatalog } from '@/lib/course-catalog'
import { BUNDLED_CHAPTER_IDS } from '@/lib/bundled-chapter-ids'
import { applyPathwayModuleMeta, mergePathwayChapters } from '@/lib/pathway/catalog'
import { createStaticClient } from '@/utils/supabase/static'
import HomeClient from './HomeClient'

const BUNDLED_ID_SET = new Set(BUNDLED_CHAPTER_IDS)

/** Home only needs unlock metadata — never ship full lesson JSON to the client. */
function chapterHomeStub<T extends { id: string; lesson_content: unknown }>(chapter: T) {
  const playable = BUNDLED_ID_SET.has(chapter.id) || hasLessonContent(chapter.lesson_content)
  return {
    ...chapter,
    // Minimal shape so hasLessonContent() stays true without shipping real lesson bodies.
    lesson_content: playable
      ? { brief: { title: 'playable', body: 'playable' }, reading: [{ tokens: [] }], exercises: [{ id: 'stub' }] }
      : null,
  }
}

export default async function HomePage() {
  const supabase = createStaticClient()
  if (!supabase) {
    return (
      <section className="tactile-card p-6">
        <h1 className="text-headline-md">Course content is not available yet</h1>
        <p className="mt-2 text-on-surface-variant">Set Supabase environment variables before building or deploying.</p>
      </section>
    )
  }

  const [{ data: modules }, { data: chapters }] = await Promise.all([
    supabase.from('modules').select('id,title,description,cefr_level,order_index').order('order_index'),
    supabase.from('chapters').select('id,module_id,title,description,order_index,lesson_content').order('order_index'),
  ])

  if (!modules?.length || !chapters?.length) {
    return (
      <section className="tactile-card p-6">
        <h1 className="text-headline-md">Course content is not available yet</h1>
        <p className="mt-2 text-on-surface-variant">Run the Supabase migrations and seed file to load the learning pathway.</p>
      </section>
    )
  }

  const catalog = filterCourseCatalog(modules, chapters)
  const pathwayModules = applyPathwayModuleMeta(catalog.modules)
  const pathwayChapters = mergePathwayChapters(catalog.chapters).map(chapterHomeStub)
  return (
    <HomeClient
      modules={pathwayModules}
      chapters={pathwayChapters}
    />
  )
}
