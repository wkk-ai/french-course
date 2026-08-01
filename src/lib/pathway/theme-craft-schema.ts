import type { Phase1Theme } from '@/lib/phase1/theme-bank'

export type ThemeCraftIssue = { field: string; message: string }

/**
 * Gate new/edited factory themes before bundle.
 * Rejects empty craft fields; does not prove prose beauty.
 */
export function validateThemeCraftFields(theme: Phase1Theme): ThemeCraftIssue[] {
  const issues: ThemeCraftIssue[] = []
  if (!theme.id?.trim()) issues.push({ field: 'id', message: 'required' })
  if (!theme.title?.trim()) issues.push({ field: 'title', message: 'required' })
  if (!theme.grammar?.trim()) issues.push({ field: 'grammar', message: 'required' })
  if (!theme.ruleSlugs?.length) issues.push({ field: 'ruleSlugs', message: 'need ≥1' })
  if (!theme.meanings || theme.meanings.length < 6) {
    issues.push({ field: 'meanings', message: 'need ≥6 lemma pairs' })
  }
  if ((!theme.focus || theme.focus.length < 1) && (!theme.meanings || theme.meanings.length < 6)) {
    issues.push({ field: 'focus', message: 'need focus lines or enough meanings for craft fallback' })
  }
  if ((!theme.exercises || theme.exercises.length < 1) && (!theme.meanings || theme.meanings.length < 6)) {
    issues.push({ field: 'exercises', message: 'need seed drills or meanings for craft expansion' })
  }
  // Grammar/title may still hold legacy Prove-gate notes — craft-from-theme strips them at build.
  return issues
}

export function assertThemesCraftReady(themes: Phase1Theme[]): void {
  const bad = themes
    .map((theme) => ({ id: theme.id, issues: validateThemeCraftFields(theme) }))
    .filter((row) => row.issues.length > 0)
  if (bad.length) {
    const sample = bad
      .slice(0, 5)
      .map((row) => `${row.id}: ${row.issues.map((i) => `${i.field} ${i.message}`).join('; ')}`)
      .join(' | ')
    throw new Error(`${bad.length} themes fail craft schema. Sample: ${sample}`)
  }
}
