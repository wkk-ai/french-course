import type { VerbConjugation } from '@/lib/course'

/**
 * Turn engine rows (pronoun + bare form) into phrases a person would actually say.
 * The engine keeps pronoun and form apart so the dictionary can look forms up;
 * the guide needs finished phrases: elision (j'ai, j'étais) and participle agreement (allé(e)).
 */

const COMPOUND_TENSES = new Set(['Passé composé', 'Plus-que-parfait', 'Futur antérieur', 'Conditionnel passé', 'Subjonctif passé'])

const ETRE_AUX = new Set([
  'suis', 'es', 'est', 'sommes', 'êtes', 'sont',
  'étais', 'était', 'étions', 'étiez', 'étaient',
  'serai', 'seras', 'sera', 'serons', 'serez', 'seront',
  'serais', 'serait', 'serions', 'seriez', 'seraient',
  'sois', 'soit', 'soyons', 'soyez', 'soient',
])

const VOWEL_START = /^[aeiouyàâäéèêëîïôöùûüœh]/i

function agreementSuffix(pronoun: string) {
  if (pronoun === 'nous' || pronoun === 'ils / elles') return '(e)s'
  if (pronoun === 'vous') return '(e)(s)'
  return '(e)'
}

export function conjugationPhrase(row: Pick<VerbConjugation, 'tense' | 'pronoun' | 'form'>): string {
  if (row.tense === 'Impératif') return row.form === '—' ? '—' : `${row.form} !`
  if (row.tense === 'Gérondif') return `en ${row.form}`

  let form = row.form
  if (COMPOUND_TENSES.has(row.tense)) {
    const [aux, ...rest] = form.replace(/^j'/, '').split(' ')
    if (ETRE_AUX.has(aux) && rest.length) form = `${row.form.startsWith("j'") ? "j'" : ''}${aux} ${rest.join(' ')}${agreementSuffix(row.pronoun)}`
  }

  if (row.pronoun === 'je') {
    if (form.startsWith("j'")) return form
    return VOWEL_START.test(form) ? `j'${form}` : `je ${form}`
  }
  return `${row.pronoun} ${form}`
}

export type GuideTableRow = { pronoun: string; phrase: string }
export type GuideTable = { verb: string; english: string; tense: string; rows: GuideTableRow[] }

export function buildTable(
  verb: string,
  english: string,
  tense: string,
  all: Pick<VerbConjugation, 'tense' | 'pronoun' | 'form'>[],
): GuideTable | null {
  const rows = all.filter((row) => row.tense === tense)
  if (!rows.length) return null
  return {
    verb,
    english,
    tense,
    rows: rows.map((row) => ({ pronoun: row.pronoun, phrase: conjugationPhrase(row) })),
  }
}
