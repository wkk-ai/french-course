/** Module 01 helpers — single source is `catalog.ts` PATHWAY_MODULES[0]. */

import {
  PATHWAY_MODULES,
  unitsForModule,
  type PathwaySubChapter,
  type SubChapterRole,
} from '@/lib/pathway/catalog'

export const MODULE01_ID = '11111111-0000-0000-0000-000000000001'

const module01 = PATHWAY_MODULES[0]

export const MODULE01_META = {
  title: module01.title,
  description: module01.description,
  cefr_level: module01.cefr,
  order_index: module01.orderIndex,
} as const

export type { SubChapterRole }

export type Module01SubChapter = PathwaySubChapter

/** Pathway order for Module 01 (20 = 5 × A/B/C/D). */
export const MODULE01_SUBCHAPTERS: Module01SubChapter[] = module01.subchapters

export const MODULE01_BY_ID = new Map(MODULE01_SUBCHAPTERS.map((subChapter) => [subChapter.id, subChapter]))

export type PathwayChapter = {
  id: string
  module_id: string
  title: string
  description: string
  order_index: number
  lesson_content: unknown
}

/** Rebuild Module 01 chapters from the pathway map; keep DB lesson_content when present. */
export function mergeModule01Chapters<C extends PathwayChapter>(chapters: C[]): C[] {
  const byId = new Map(chapters.map((chapter) => [chapter.id, chapter]))
  const other = chapters.filter((chapter) => chapter.module_id !== MODULE01_ID)
  const rebuilt = MODULE01_SUBCHAPTERS.map((subChapter) => {
    const existing = byId.get(subChapter.id)
    return {
      ...(existing ?? {}),
      id: subChapter.id,
      module_id: MODULE01_ID,
      title: subChapter.title,
      description: subChapter.description,
      order_index: subChapter.orderIndex,
      lesson_content: existing?.lesson_content ?? {},
    } as C
  })
  return [...rebuilt, ...other]
}

export function applyModule01Meta<M extends { id: string; title: string; description: string; cefr_level: string; order_index: number }>(
  modules: M[],
): M[] {
  return modules.map((module) =>
    module.id === MODULE01_ID
      ? {
          ...module,
          title: MODULE01_META.title,
          description: MODULE01_META.description,
          cefr_level: MODULE01_META.cefr_level,
          order_index: MODULE01_META.order_index,
        }
      : module,
  )
}

export function unitsForModule01() {
  return unitsForModule(module01)
}
