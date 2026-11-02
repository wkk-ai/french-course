import type { LessonContent, LessonExercise } from '@/lib/course'
import { BUNDLED_VOCABULARY } from '@/lib/bundled-vocabulary'
import { resolveLessonContent } from '@/lib/lesson-content'
import { buildUnitLesson } from '@/lib/units/kit'
import { UNIT_SPECS } from '@/lib/units/specs'
import { REWRITTEN_MODULE_ORDERS } from '@/lib/units/index.generated'
import { UNIT_BY_ID, type UnitLesson } from '@/lib/pathway/units'

const SPEC_BY_ID = new Map(UNIT_SPECS.map((spec) => [spec.id, spec]))

export function isHandWrittenUnit(unit: UnitLesson): boolean {
  return SPEC_BY_ID.has(unit.id) || REWRITTEN_MODULE_ORDERS.has(unit.moduleOrder)
}

export function isRewrittenModule(moduleOrder: number, unitIds: string[]): boolean {
  return REWRITTEN_MODULE_ORDERS.has(moduleOrder) || (unitIds.length > 0 && unitIds.every((id) => SPEC_BY_ID.has(id)))
}

const JUNK_OPTION = /^(Je suis Paris\.$|C'est française\.$|Yo\.?$|Hé$|Je pratique :|Tu utilises «)/

function optionsOf(exercise: LessonExercise): string[] | null {
  return 'options' in exercise && Array.isArray(exercise.options) ? exercise.options : null
}

/** Questions from the old generator that teach nothing or have more than one right answer. */
export function isJunkExercise(exercise: LessonExercise): boolean {
  const options = optionsOf(exercise)
  if (/fits this lesson|matches this lesson|^Prove —/i.test(exercise.prompt)) return true
  if (options?.some((option) => JUNK_OPTION.test(option))) return true
  const meaning = exercise.prompt.match(/^What does [“"'](.+?)[”"'] mean\?$/)
  if (meaning && options && 'answer' in exercise && typeof exercise.answer === 'number') {
    const asked = meaning[1].toLowerCase().trim()
    const right = (options[exercise.answer] ?? '').toLowerCase().trim()
    if (asked === right) return true
    if (/passé|imparfait|subjonctif|conditionnel|futur|présent|infinitif|participe|gérondif/.test(asked)) return true
  }
  return false
}

function dedupe(exercises: LessonExercise[]): LessonExercise[] {
  const seen = new Set<string>()
  return exercises.filter((exercise) => {
    const key = `${exercise.type ?? 'mcq'}|${exercise.prompt}|${JSON.stringify(optionsOf(exercise) ?? ('answers' in exercise ? exercise.answers : ''))}`
    if (seen.has(key) || seen.has(`id:${exercise.id}`)) return false
    seen.add(key)
    seen.add(`id:${exercise.id}`)
    return true
  })
}

/** The one lesson for a unit: hand-written when it exists, otherwise the old lesson cleaned up. */
export function resolveUnitLesson(unitId: string): LessonContent | null {
  const spec = SPEC_BY_ID.get(unitId)
  if (spec) return buildUnitLesson(spec, BUNDLED_VOCABULARY)

  const unit = UNIT_BY_ID.get(unitId)
  const base = resolveLessonContent(unitId, null)
  if (!unit || !base) return base
  // Pull practice from the old B/C/D chapters of this unit so nothing good is lost.
  const more = unit.legacyIds.slice(1).flatMap((id) => resolveLessonContent(id, null)?.exercises ?? [])
  const exercises = dedupe([...(base.exercises ?? []), ...more]).filter((exercise) => !isJunkExercise(exercise))
  return { ...base, exercises: exercises.slice(0, 30) }
}
