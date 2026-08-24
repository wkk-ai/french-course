import { BUNDLED_CHAPTER_IDS } from '@/lib/bundled-chapter-ids'
import { PATHWAY_MODULES } from '@/lib/pathway/catalog'

const PLAYABLE = new Set(BUNDLED_CHAPTER_IDS)

const PLAYABLE_STUB = {
  brief: { title: 'playable', body: 'playable' },
  reading: [{ tokens: [] }],
  exercises: [{ id: 'stub' }],
}

export function homeCatalogFromPathway() {
  const modules = PATHWAY_MODULES.map((module) => ({
    id: module.id,
    title: module.title,
    description: module.description,
    cefr_level: module.cefr,
    order_index: module.orderIndex,
  }))
  const chapters = PATHWAY_MODULES.flatMap((module) =>
    module.subchapters.map((sub) => ({
      id: sub.id,
      module_id: module.id,
      title: sub.title,
      description: sub.description,
      order_index: sub.orderIndex,
      lesson_content: PLAYABLE.has(sub.id) ? PLAYABLE_STUB : null,
    })),
  )
  return { modules, chapters }
}
