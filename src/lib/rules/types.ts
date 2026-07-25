import type { LessonExercise } from '@/lib/exercises/types'

/** Minimal row still used by DB / legacy resolve. */
export type GrammarRuleSummary = {
  id: string
  slug: string
  title: string
  category: string
  summary: string
}

export type RuleExample = {
  french: string
  english: string
  focus?: string
}

export type RuleTable = {
  caption?: string
  headers: string[]
  rows: string[][]
}

export type RuleMistake = {
  wrong: string
  right: string
  why: string
}

export type RuleLinkedLesson = {
  chapterId: string
  lessonLabel: string
  title: string
  note?: string
}

export type RuleRelated = {
  slug: string
  label: string
}

/** Inline “Try it” drills — reuse LessonExercise shapes (vocab/grammar only). */
export type RuleDrill = {
  id: string
  title: string
  exercise: LessonExercise
}

export type GrammarRuleDocument = GrammarRuleSummary & {
  /** Short one-liner still used in list cards / search. */
  full_explanation: string
  /** Legacy flat examples — also mirrored into examplesByGroup. */
  examples: RuleExample[]
  unlockChapterIds: string[]
  linkedLessons: RuleLinkedLesson[]
  relatedRules: RuleRelated[]
  masteryCategories: string[]
  quickReference: {
    bullets: string[]
    table?: RuleTable
  }
  deepDive: {
    whyItMatters: string
    sections: Array<{
      heading: string
      body: string
      table?: RuleTable
    }>
    contrastEn?: RuleTable
    commonMistakes: RuleMistake[]
    pronunciationNotes?: string[]
  }
  examplesByGroup: Array<{
    heading: string
    items: RuleExample[]
  }>
  dialogueSample?: {
    title: string
    lines: Array<{ speaker: string; text: string }>
    note?: string
  }
  drills: RuleDrill[]
}

/** Back-compat alias — rich documents satisfy this shape. */
export type GrammarRule = GrammarRuleDocument
