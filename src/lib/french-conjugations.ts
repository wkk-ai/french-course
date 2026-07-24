import type { VerbConjugation, VocabularyWord } from '@/lib/course'

const PRONOUNS = ['je', 'tu', 'il / elle / on', 'nous', 'vous', 'ils / elles'] as const

const TENSES = [
  'Présent',
  'Passé composé',
  'Imparfait',
  'Futur simple',
  'Conditionnel présent',
  'Plus-que-parfait',
  'Futur antérieur',
  'Conditionnel passé',
  'Subjonctif présent',
  'Impératif',
] as const

type Tense = (typeof TENSES)[number]

type IrregularBundle = {
  present: string[]
  imparfait: string[]
  futur: string[]
  conditionnel: string[]
  subjonctif: string[]
  participePasse: string
  auxiliaire: 'avoir' | 'être'
  imperatif: string[] // tu, nous, vous
}

const AVOIR_PRESENT = ['ai', 'as', 'a', 'avons', 'avez', 'ont']
const ETRE_PRESENT = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont']
const AVOIR_IMPARFAIT = ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient']
const ETRE_IMPARFAIT = ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient']
const AVOIR_FUTUR = ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront']
const ETRE_FUTUR = ['serai', 'seras', 'sera', 'serons', 'serez', 'seront']
const AVOIR_COND = ['aurais', 'aurais', 'aurait', 'aurions', 'auriez', 'auraient']
const ETRE_COND = ['serais', 'serais', 'serait', 'serions', 'seriez', 'seraient']
const AVOIR_SUBJ = ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient']
const ETRE_SUBJ = ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient']

const IRREGULAR: Record<string, IrregularBundle> = {
  être: {
    present: ETRE_PRESENT,
    imparfait: ETRE_IMPARFAIT,
    futur: ETRE_FUTUR,
    conditionnel: ETRE_COND,
    subjonctif: ETRE_SUBJ,
    participePasse: 'été',
    auxiliaire: 'avoir',
    imperatif: ['sois', 'soyons', 'soyez'],
  },
  avoir: {
    present: AVOIR_PRESENT,
    imparfait: AVOIR_IMPARFAIT,
    futur: AVOIR_FUTUR,
    conditionnel: AVOIR_COND,
    subjonctif: AVOIR_SUBJ,
    participePasse: 'eu',
    auxiliaire: 'avoir',
    imperatif: ['aie', 'ayons', 'ayez'],
  },
  aller: {
    present: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
    imparfait: ['allais', 'allais', 'allait', 'allions', 'alliez', 'allaient'],
    futur: ['irai', 'iras', 'ira', 'irons', 'irez', 'iront'],
    conditionnel: ['irais', 'irais', 'irait', 'irions', 'iriez', 'iraient'],
    subjonctif: ['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent'],
    participePasse: 'allé',
    auxiliaire: 'être',
    imperatif: ['va', 'allons', 'allez'],
  },
  faire: {
    present: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
    imparfait: ['faisais', 'faisais', 'faisait', 'faisions', 'faisiez', 'faisaient'],
    futur: ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront'],
    conditionnel: ['ferais', 'ferais', 'ferait', 'ferions', 'feriez', 'feraient'],
    subjonctif: ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent'],
    participePasse: 'fait',
    auxiliaire: 'avoir',
    imperatif: ['fais', 'faisons', 'faites'],
  },
  prendre: {
    present: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'],
    imparfait: ['prenais', 'prenais', 'prenait', 'prenions', 'preniez', 'prenaient'],
    futur: ['prendrai', 'prendras', 'prendra', 'prendrons', 'prendrez', 'prendront'],
    conditionnel: ['prendrais', 'prendrais', 'prendrait', 'prendrions', 'prendriez', 'prendraient'],
    subjonctif: ['prenne', 'prennes', 'prenne', 'prenions', 'preniez', 'prennent'],
    participePasse: 'pris',
    auxiliaire: 'avoir',
    imperatif: ['prends', 'prenons', 'prenez'],
  },
  vouloir: {
    present: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'],
    imparfait: ['voulais', 'voulais', 'voulait', 'voulions', 'vouliez', 'voulaient'],
    futur: ['voudrai', 'voudras', 'voudra', 'voudrons', 'voudrez', 'voudront'],
    conditionnel: ['voudrais', 'voudrais', 'voudrait', 'voudrions', 'voudriez', 'voudraient'],
    subjonctif: ['veuille', 'veuilles', 'veuille', 'voulions', 'vouliez', 'veuillent'],
    participePasse: 'voulu',
    auxiliaire: 'avoir',
    imperatif: ['veuille', 'voulons', 'voulez'],
  },
  pouvoir: {
    present: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'],
    imparfait: ['pouvais', 'pouvais', 'pouvait', 'pouvions', 'pouviez', 'pouvaient'],
    futur: ['pourrai', 'pourras', 'pourra', 'pourrons', 'pourrez', 'pourront'],
    conditionnel: ['pourrais', 'pourrais', 'pourrait', 'pourrions', 'pourriez', 'pourraient'],
    subjonctif: ['puisse', 'puisses', 'puisse', 'puissions', 'puissiez', 'puissent'],
    participePasse: 'pu',
    auxiliaire: 'avoir',
    imperatif: ['—', '—', '—'],
  },
  voir: {
    present: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'],
    imparfait: ['voyais', 'voyais', 'voyait', 'voyions', 'voyiez', 'voyaient'],
    futur: ['verrai', 'verras', 'verra', 'verrons', 'verrez', 'verront'],
    conditionnel: ['verrais', 'verrais', 'verrait', 'verrions', 'verriez', 'verraient'],
    subjonctif: ['voie', 'voies', 'voie', 'voyions', 'voyiez', 'voient'],
    participePasse: 'vu',
    auxiliaire: 'avoir',
    imperatif: ['vois', 'voyons', 'voyez'],
  },
  dire: {
    present: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'],
    imparfait: ['disais', 'disais', 'disait', 'disions', 'disiez', 'disaient'],
    futur: ['dirai', 'diras', 'dira', 'dirons', 'direz', 'diront'],
    conditionnel: ['dirais', 'dirais', 'dirait', 'dirions', 'diriez', 'diraient'],
    subjonctif: ['dise', 'dises', 'dise', 'disions', 'disiez', 'disent'],
    participePasse: 'dit',
    auxiliaire: 'avoir',
    imperatif: ['dis', 'disons', 'dites'],
  },
  boire: {
    present: ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'],
    imparfait: ['buvais', 'buvais', 'buvait', 'buvions', 'buviez', 'buvaient'],
    futur: ['boirai', 'boiras', 'boira', 'boirons', 'boirez', 'boiront'],
    conditionnel: ['boirais', 'boirais', 'boirait', 'boirions', 'boiriez', 'boiraient'],
    subjonctif: ['boive', 'boives', 'boive', 'buvions', 'buviez', 'boivent'],
    participePasse: 'bu',
    auxiliaire: 'avoir',
    imperatif: ['bois', 'buvons', 'buvez'],
  },
  partir: {
    present: ['pars', 'pars', 'part', 'partons', 'partez', 'partent'],
    imparfait: ['partais', 'partais', 'partait', 'partions', 'partiez', 'partaient'],
    futur: ['partirai', 'partiras', 'partira', 'partirons', 'partirez', 'partiront'],
    conditionnel: ['partirais', 'partirais', 'partirait', 'partirions', 'partiriez', 'partiraient'],
    subjonctif: ['parte', 'partes', 'parte', 'partions', 'partiez', 'partent'],
    participePasse: 'parti',
    auxiliaire: 'être',
    imperatif: ['pars', 'partons', 'partez'],
  },
  "s'appeler": {
    present: ["m'appelle", "t'appelles", "s'appelle", 'nous appelons', 'vous appelez', "s'appellent"],
    imparfait: ["m'appelais", "t'appelais", "s'appelait", 'nous appelions', 'vous appeliez', "s'appelaient"],
    futur: ["m'appellerai", "t'appelleras", "s'appellera", 'nous appellerons', 'vous appellerez', "s'appelleront"],
    conditionnel: ["m'appellerais", "t'appellerais", "s'appellerait", 'nous appellerions', 'vous appelleriez', "s'appelleraient"],
    subjonctif: ["m'appelle", "t'appelles", "s'appelle", 'nous appelions', 'vous appeliez', "s'appellent"],
    participePasse: 'appelé',
    auxiliaire: 'être',
    imperatif: ['appelle-toi', 'appelons-nous', 'appelez-vous'],
  },
}

function elideJeCompound(form: string) {
  if (form.startsWith('ai ') || form.startsWith('avais ') || form.startsWith('aurai ') || form.startsWith('aurais ')) {
    return `j'${form}`
  }
  return form
}

function withAux(auxForms: string[], participle: string, _auxiliaire: 'avoir' | 'être') {
  return auxForms.map((aux) => `${aux} ${participle}`)
}

function regularEr(infinitive: string): IrregularBundle {
  let stem = infinitive.slice(0, -2)
  // manger → mangeons needs soft g
  const softG = stem.endsWith('g')
  const softC = stem.endsWith('c')
  const nousStem = softG ? `${stem}e` : softC ? `${stem.slice(0, -1)}ç` : stem
  // payer / appeler style doubles often handled as regular for A1 display
  const futurStem = infinitive
  return {
    present: [`${stem}e`, `${stem}es`, `${stem}e`, `${nousStem}ons`, `${stem}ez`, `${stem}ent`],
    imparfait: [`${nousStem}ais`, `${nousStem}ais`, `${nousStem}ait`, `${nousStem}ions`, `${nousStem}iez`, `${nousStem}aient`],
    futur: [`${futurStem}ai`, `${futurStem}as`, `${futurStem}a`, `${futurStem}ons`, `${futurStem}ez`, `${futurStem}ont`],
    conditionnel: [`${futurStem}ais`, `${futurStem}ais`, `${futurStem}ait`, `${futurStem}ions`, `${futurStem}iez`, `${futurStem}aient`],
    subjonctif: [`${stem}e`, `${stem}es`, `${stem}e`, `${nousStem}ions`, `${nousStem}iez`, `${stem}ent`],
    participePasse: `${stem}é`,
    auxiliaire: 'avoir',
    imperatif: [`${stem}e`, `${nousStem}ons`, `${stem}ez`],
  }
}

function regularIr(infinitive: string): IrregularBundle {
  const stem = infinitive.slice(0, -2)
  return {
    present: [`${stem}is`, `${stem}is`, `${stem}it`, `${stem}issons`, `${stem}issez`, `${stem}issent`],
    imparfait: [`${stem}issais`, `${stem}issais`, `${stem}issait`, `${stem}issions`, `${stem}issiez`, `${stem}issaient`],
    futur: [`${infinitive}ai`, `${infinitive}as`, `${infinitive}a`, `${infinitive}ons`, `${infinitive}ez`, `${infinitive}ont`],
    conditionnel: [`${infinitive}ais`, `${infinitive}ais`, `${infinitive}ait`, `${infinitive}ions`, `${infinitive}iez`, `${infinitive}aient`],
    subjonctif: [`${stem}isse`, `${stem}isses`, `${stem}isse`, `${stem}issions`, `${stem}issiez`, `${stem}issent`],
    participePasse: `${stem}i`,
    auxiliaire: 'avoir',
    imperatif: [`${stem}is`, `${stem}issons`, `${stem}issez`],
  }
}

function regularRe(infinitive: string): IrregularBundle {
  const stem = infinitive.slice(0, -2)
  return {
    present: [`${stem}s`, `${stem}s`, stem, `${stem}ons`, `${stem}ez`, `${stem}ent`],
    imparfait: [`${stem}ais`, `${stem}ais`, `${stem}ait`, `${stem}ions`, `${stem}iez`, `${stem}aient`],
    futur: [`${stem}rai`, `${stem}ras`, `${stem}ra`, `${stem}rons`, `${stem}rez`, `${stem}ront`],
    conditionnel: [`${stem}rais`, `${stem}rais`, `${stem}rait`, `${stem}rions`, `${stem}riez`, `${stem}raient`],
    subjonctif: [`${stem}e`, `${stem}es`, `${stem}e`, `${stem}ions`, `${stem}iez`, `${stem}ent`],
    participePasse: `${stem}u`,
    auxiliaire: 'avoir',
    imperatif: [`${stem}s`, `${stem}ons`, `${stem}ez`],
  }
}

function resolveBundle(infinitive: string): IrregularBundle | null {
  const key = infinitive.normalize('NFC').toLowerCase()
  if (IRREGULAR[key]) return IRREGULAR[key]
  if (key.endsWith('er') || key.endsWith('é')) return regularEr(key.endsWith('é') ? key.slice(0, -1) + 'er' : key)
  if (key.endsWith('ir')) return regularIr(key)
  if (key.endsWith('re')) return regularRe(key)
  return null
}

export function isConjugableVerb(word: VocabularyWord) {
  if (word.part_of_speech !== 'verb') return false
  const w = word.word.normalize('NFC').toLowerCase()
  if (IRREGULAR[w]) return true
  if (w.startsWith("s'") || w.startsWith('s’')) return true
  return /(?:er|ir|re)$/i.test(w)
}

function rowsForTense(vocabId: string, infinitive: string, tense: Tense, bundle: IrregularBundle): VerbConjugation[] {
  const auxPresent = bundle.auxiliaire === 'être' ? ETRE_PRESENT : AVOIR_PRESENT
  const auxImparfait = bundle.auxiliaire === 'être' ? ETRE_IMPARFAIT : AVOIR_IMPARFAIT
  const auxFutur = bundle.auxiliaire === 'être' ? ETRE_FUTUR : AVOIR_FUTUR
  const auxCond = bundle.auxiliaire === 'être' ? ETRE_COND : AVOIR_COND
  const slug = infinitive.replace(/[^a-zàâäéèêëïîôùûüç']/gi, '')

  const mapForms = (forms: string[], tenseName: Tense, startIndex: number) =>
    forms.map((form, index) => ({
      id: `gen-${slug}-${tenseName}-${index + 1}`,
      vocab_id: vocabId,
      tense: tenseName,
      pronoun: PRONOUNS[index],
      form,
      order_index: startIndex + index,
    }))

  const mapCompound = (auxForms: string[], tenseName: Tense, startIndex: number) =>
    withAux(auxForms, bundle.participePasse, bundle.auxiliaire).map((form, index) => ({
      id: `gen-${slug}-${tenseName}-${index + 1}`,
      vocab_id: vocabId,
      tense: tenseName,
      pronoun: PRONOUNS[index],
      form: index === 0 ? elideJeCompound(form) : form,
      order_index: startIndex + index,
    }))

  switch (tense) {
    case 'Présent':
      return mapForms(bundle.present, tense, 1)
    case 'Imparfait':
      return mapForms(bundle.imparfait, tense, 10)
    case 'Futur simple':
      return mapForms(bundle.futur, tense, 20)
    case 'Conditionnel présent':
      return mapForms(bundle.conditionnel, tense, 30)
    case 'Subjonctif présent':
      return mapForms(bundle.subjonctif, tense, 40)
    case 'Passé composé':
      return mapCompound(auxPresent, tense, 50)
    case 'Plus-que-parfait':
      return mapCompound(auxImparfait, tense, 60)
    case 'Futur antérieur':
      return mapCompound(auxFutur, tense, 70)
    case 'Conditionnel passé':
      return mapCompound(auxCond, tense, 80)
    case 'Impératif':
      return [
        { id: `gen-${slug}-imp-1`, vocab_id: vocabId, tense, pronoun: 'tu', form: bundle.imperatif[0], order_index: 90 },
        { id: `gen-${slug}-imp-2`, vocab_id: vocabId, tense, pronoun: 'nous', form: bundle.imperatif[1], order_index: 91 },
        { id: `gen-${slug}-imp-3`, vocab_id: vocabId, tense, pronoun: 'vous', form: bundle.imperatif[2], order_index: 92 },
      ]
    default:
      return []
  }
}

/** Build full conjugation tables for a vocabulary verb. */
export function conjugateVerb(word: VocabularyWord): VerbConjugation[] {
  if (!isConjugableVerb(word)) return []
  const bundle = resolveBundle(word.word)
  if (!bundle) return []
  return TENSES.flatMap((tense) => rowsForTense(word.id, word.word, tense, bundle))
}

export function conjugationsForWord(word: VocabularyWord, authored: VerbConjugation[] = []) {
  const generated = conjugateVerb(word)
  if (!generated.length) return authored.filter((item) => item.vocab_id === word.id)
  // Prefer generated full tables; authored present-only tables are superseded.
  return generated
}

export const CONJUGATION_TENSES = TENSES
