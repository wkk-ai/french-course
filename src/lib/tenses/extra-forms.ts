import type { VerbConjugation } from '@/lib/course'

/**
 * Forms the main conjugation engine does not produce, built from what it does produce:
 * - Subjonctif passé: subjonctif of avoir/être + past participle (from the passé composé rows)
 * - Gérondif: en + nous-stem + -ant (from the présent nous row), with the three irregulars
 * - Passé simple: regular endings + a hand table for common irregular verbs (recognition only)
 */

type Row = Pick<VerbConjugation, 'tense' | 'pronoun' | 'form'>

const PRONOUNS = ['je', 'tu', 'il / elle / on', 'nous', 'vous', 'ils / elles'] as const

const AUX_TO_SUBJ: Record<string, string> = {
  ai: 'aie', as: 'aies', a: 'ait', avons: 'ayons', avez: 'ayez', ont: 'aient',
  suis: 'sois', es: 'sois', est: 'soit', sommes: 'soyons', êtes: 'soyez', sont: 'soient',
}

export function subjonctifPasse(rows: Row[]): Row[] {
  const pc = rows.filter((row) => row.tense === 'Passé composé')
  return pc.map((row) => {
    const bare = row.form.replace(/^j'/, '')
    const [aux, ...rest] = bare.split(' ')
    const subj = AUX_TO_SUBJ[aux]
    return { tense: 'Subjonctif passé', pronoun: row.pronoun, form: subj ? `${subj} ${rest.join(' ')}` : row.form }
  })
}

const GERONDIF_IRREGULAR: Record<string, string> = { être: 'étant', avoir: 'ayant', savoir: 'sachant' }

export function gerondif(infinitive: string, rows: Row[]): Row[] {
  const irregular = GERONDIF_IRREGULAR[infinitive]
  if (irregular) return [{ tense: 'Gérondif', pronoun: '—', form: irregular }]
  const nous = rows.find((row) => row.tense === 'Présent' && row.pronoun === 'nous')?.form
  if (!nous || !nous.endsWith('ons')) return []
  return [{ tense: 'Gérondif', pronoun: '—', form: `${nous.slice(0, -3)}ant` }]
}

/** Irregular passé simple: stem + ending family. */
const PS_IRREGULAR: Record<string, { stem: string; type: 'i' | 'u' | 'in' }> = {
  être: { stem: 'f', type: 'u' },
  avoir: { stem: 'e', type: 'u' },
  faire: { stem: 'f', type: 'i' },
  pouvoir: { stem: 'p', type: 'u' },
  vouloir: { stem: 'voul', type: 'u' },
  devoir: { stem: 'd', type: 'u' },
  savoir: { stem: 's', type: 'u' },
  venir: { stem: 'v', type: 'in' },
  prendre: { stem: 'pr', type: 'i' },
  dire: { stem: 'd', type: 'i' },
  voir: { stem: 'v', type: 'i' },
  mettre: { stem: 'm', type: 'i' },
  partir: { stem: 'part', type: 'i' },
  devenir: { stem: 'dev', type: 'in' },
  revenir: { stem: 'rev', type: 'in' },
  tenir: { stem: 't', type: 'in' },
  mourir: { stem: 'mour', type: 'u' },
  connaître: { stem: 'conn', type: 'u' },
  lire: { stem: 'l', type: 'u' },
  boire: { stem: 'b', type: 'u' },
  vivre: { stem: 'véc', type: 'u' },
  croire: { stem: 'cr', type: 'u' },
  écrire: { stem: 'écriv', type: 'i' },
  naître: { stem: 'naqu', type: 'i' },
  recevoir: { stem: 'reç', type: 'u' },
  comprendre: { stem: 'compr', type: 'i' },
  apprendre: { stem: 'appr', type: 'i' },
  conduire: { stem: 'conduis', type: 'i' },
}

const PS_ENDINGS = {
  a: ['ai', 'as', 'a', 'âmes', 'âtes', 'èrent'],
  i: ['is', 'is', 'it', 'îmes', 'îtes', 'irent'],
  u: ['us', 'us', 'ut', 'ûmes', 'ûtes', 'urent'],
  in: ['ins', 'ins', 'int', 'înmes', 'întes', 'inrent'],
}

export function passeSimple(infinitive: string): Row[] {
  let stem: string
  let endings: string[]
  const irregular = PS_IRREGULAR[infinitive]
  if (irregular) {
    stem = irregular.stem
    endings = PS_ENDINGS[irregular.type]
  } else if (infinitive === 'aller') {
    stem = 'all'
    endings = PS_ENDINGS.a
  } else if (infinitive.endsWith('er')) {
    stem = infinitive.slice(0, -2)
    // keep the soft sound: mangea, commença
    endings = PS_ENDINGS.a
    if (stem.endsWith('g')) return PRONOUNS.map((pronoun, i) => ({ tense: 'Passé simple', pronoun, form: stem + (i === 5 ? 'èrent' : 'e' + endings[i]) }))
    if (stem.endsWith('c')) return PRONOUNS.map((pronoun, i) => ({ tense: 'Passé simple', pronoun, form: (i === 5 ? stem : stem.slice(0, -1) + 'ç') + endings[i] }))
  } else if (infinitive.endsWith('ir') || infinitive.endsWith('re')) {
    stem = infinitive.slice(0, -2)
    endings = PS_ENDINGS.i
  } else {
    return []
  }
  return PRONOUNS.map((pronoun, i) => ({ tense: 'Passé simple', pronoun, form: stem + endings[i] }))
}

/** All extra rows for a verb. */
export function extraForms(infinitive: string, rows: Row[]): Row[] {
  return [...subjonctifPasse(rows), ...gerondif(infinitive, rows), ...passeSimple(infinitive)]
}
