import { PATHWAY_MODULES, type PathwayModule, type PathwaySubChapter } from '@/lib/pathway/catalog'

/**
 * One lesson per unit (36 modules x 5 units = 180 lessons).
 * The unit lesson uses the id of the unit's old "A" chapter, so links and progress keep working.
 * The old A/B/C/D chapter ids are kept as `legacyIds`: finishing any of them counts the unit as done.
 */
export type UnitLesson = {
  id: string
  moduleId: string
  moduleOrder: number
  unitIndex: number
  /** Short title shown on Home, e.g. "Où habites-tu ?" */
  title: string
  /** What the unit teaches, in English. */
  focus: string
  legacyIds: string[]
}

function cleanTitle(unitTitle: string, first: PathwaySubChapter): string {
  // Generated modules have unit titles like "La journée · unit 1": use the first lesson's topic instead.
  if (/·\s*unit\s*\d+/i.test(unitTitle)) return first.title.replace(/^(Practice|Show what you know|Put it together)\s*[—-]\s*/i, '')
  return unitTitle
}

function cleanFocus(unitGrammar: string): string {
  return unitGrammar.replace(/\s*·\s*unit\s*\d+$/i, '')
}

export function unitLessonsForModule(module: PathwayModule): UnitLesson[] {
  const byUnit = new Map<number, PathwaySubChapter[]>()
  for (const sub of module.subchapters) {
    const list = byUnit.get(sub.unitIndex) ?? []
    list.push(sub)
    byUnit.set(sub.unitIndex, list)
  }
  return [...byUnit.entries()]
    .sort(([a], [b]) => a - b)
    .map(([unitIndex, subs]) => {
      const ordered = [...subs].sort((a, b) => a.orderIndex - b.orderIndex)
      const first = ordered.find((sub) => sub.role === 'A') ?? ordered[0]
      return {
        id: first.id,
        moduleId: module.id,
        moduleOrder: module.orderIndex,
        unitIndex,
        title: cleanTitle(first.unitTitle, first),
        focus: cleanFocus(first.unitGrammar),
        legacyIds: ordered.map((sub) => sub.id),
      }
    })
}

export const UNIT_LESSONS: UnitLesson[] = PATHWAY_MODULES.flatMap(unitLessonsForModule)

export const UNIT_LESSON_IDS: string[] = UNIT_LESSONS.map((unit) => unit.id)

export const UNIT_BY_ID = new Map(UNIT_LESSONS.map((unit) => [unit.id, unit]))

/** Any old chapter id (A, B, C or D) -> its unit lesson. */
export const UNIT_BY_LEGACY_ID = new Map(UNIT_LESSONS.flatMap((unit) => unit.legacyIds.map((id) => [id, unit] as const)))

export function unitIsDone(unit: UnitLesson, completed: Set<string>): boolean {
  return unit.legacyIds.some((id) => completed.has(id))
}

/** Completed chapter ids, with every finished old chapter mapped onto its unit lesson id. */
export function completedUnitIds(completed: Iterable<string>): Set<string> {
  const out = new Set<string>()
  for (const id of completed) {
    const unit = UNIT_BY_LEGACY_ID.get(id)
    out.add(unit ? unit.id : id)
  }
  return out
}
