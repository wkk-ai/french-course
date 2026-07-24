/** Legacy Module 1 from an earlier seed; hide it so the pathway is not duplicated. */
export const LEGACY_MODULE_ID = '11111111-1111-1111-1111-111111111111'
export const LEGACY_CHAPTER_IDS = new Set([
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
])

export function isCanonicalModuleId(id: string) {
  return id !== LEGACY_MODULE_ID
}

export function isCanonicalChapterId(id: string) {
  return !LEGACY_CHAPTER_IDS.has(id)
}

export function filterCourseCatalog<
  M extends { id: string; order_index: number },
  C extends { id: string; module_id: string; order_index: number },
>(modules: M[], chapters: C[]) {
  const canonicalModules = modules
    .filter((module) => isCanonicalModuleId(module.id))
    .sort((a, b) => a.order_index - b.order_index)

  // If duplicates share the same order_index, keep the first after sort (stable pathway IDs).
  const seenOrders = new Set<number>()
  const modulesUnique = canonicalModules.filter((module) => {
    if (seenOrders.has(module.order_index)) return false
    seenOrders.add(module.order_index)
    return true
  })

  const moduleIds = new Set(modulesUnique.map((module) => module.id))
  const chaptersFiltered = chapters
    .filter((chapter) => moduleIds.has(chapter.module_id) && isCanonicalChapterId(chapter.id))
    .sort((a, b) => a.order_index - b.order_index)

  return { modules: modulesUnique, chapters: chaptersFiltered }
}
