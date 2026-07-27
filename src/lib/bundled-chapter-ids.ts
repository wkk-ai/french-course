/** Lightweight pathway chapter IDs — safe for client Home/Review without shipping full lesson bodies. */

import { PATHWAY_MODULES } from '@/lib/pathway/catalog'

/** Every core pathway sub-chapter id in catalog order (36 × 20 = 720). */
export const BUNDLED_CHAPTER_IDS: string[] = PATHWAY_MODULES.flatMap((module) =>
  module.subchapters.map((sub) => sub.id),
)

export function isBundledChapterId(chapterId: string): boolean {
  return BUNDLED_CHAPTER_IDS.includes(chapterId)
}
