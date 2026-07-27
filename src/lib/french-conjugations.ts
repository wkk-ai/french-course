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
  venir: {
    present: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'],
    imparfait: ['venais', 'venais', 'venait', 'venions', 'veniez', 'venaient'],
    futur: ['viendrai', 'viendras', 'viendra', 'viendrons', 'viendrez', 'viendront'],
    conditionnel: ['viendrais', 'viendrais', 'viendrait', 'viendrions', 'viendriez', 'viendraient'],
    subjonctif: ['vienne', 'viennes', 'vienne', 'venions', 'veniez', 'viennent'],
    participePasse: 'venu',
    auxiliaire: 'être',
    imperatif: ['viens', 'venons', 'venez'],
  },
  revenir: {
    present: ['reviens', 'reviens', 'revient', 'revenons', 'revenez', 'reviennent'],
    imparfait: ['revenais', 'revenais', 'revenait', 'revenions', 'reveniez', 'revenaient'],
    futur: ['reviendrai', 'reviendras', 'reviendra', 'reviendrons', 'reviendrez', 'reviendront'],
    conditionnel: ['reviendrais', 'reviendrais', 'reviendrait', 'reviendrions', 'reviendriez', 'reviendraient'],
    subjonctif: ['revienne', 'reviennes', 'revienne', 'revenions', 'reveniez', 'reviennent'],
    participePasse: 'revenu',
    auxiliaire: 'être',
    imperatif: ['reviens', 'revenons', 'revenez'],
  },
  apprendre: {
    present: ['apprends', 'apprends', 'apprend', 'apprenons', 'apprenez', 'apprennent'],
    imparfait: ['apprenais', 'apprenais', 'apprenait', 'apprenions', 'appreniez', 'apprenaient'],
    futur: ['apprendrai', 'apprendras', 'apprendra', 'apprendrons', 'apprendrez', 'apprendront'],
    conditionnel: ['apprendrais', 'apprendrais', 'apprendrait', 'apprendrions', 'apprendriez', 'apprendraient'],
    subjonctif: ['apprenne', 'apprennes', 'apprenne', 'apprenions', 'appreniez', 'apprennent'],
    participePasse: 'appris',
    auxiliaire: 'avoir',
    imperatif: ['apprends', 'apprenons', 'apprenez'],
  },
  comprendre: {
    present: ['comprends', 'comprends', 'comprend', 'comprenons', 'comprenez', 'comprennent'],
    imparfait: ['comprenais', 'comprenais', 'comprenait', 'comprenions', 'compreniez', 'comprenaient'],
    futur: ['comprendrai', 'comprendras', 'comprendra', 'comprendrons', 'comprendrez', 'comprendront'],
    conditionnel: ['comprendrais', 'comprendrais', 'comprendrait', 'comprendrions', 'comprendriez', 'comprendraient'],
    subjonctif: ['comprenne', 'comprennes', 'comprenne', 'comprenions', 'compreniez', 'comprennent'],
    participePasse: 'compris',
    auxiliaire: 'avoir',
    imperatif: ['comprends', 'comprenons', 'comprenez'],
  },
  devoir: {
    present: ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent'],
    imparfait: ['devais', 'devais', 'devait', 'devions', 'deviez', 'devaient'],
    futur: ['devrai', 'devras', 'devra', 'devrons', 'devrez', 'devront'],
    conditionnel: ['devrais', 'devrais', 'devrait', 'devrions', 'devriez', 'devraient'],
    subjonctif: ['doive', 'doives', 'doive', 'devions', 'deviez', 'doivent'],
    participePasse: 'dû',
    auxiliaire: 'avoir',
    imperatif: ['—', '—', '—'],
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
  sortir: {
    present: ['sors', 'sors', 'sort', 'sortons', 'sortez', 'sortent'],
    imparfait: ['sortais', 'sortais', 'sortait', 'sortions', 'sortiez', 'sortaient'],
    futur: ['sortirai', 'sortiras', 'sortira', 'sortirons', 'sortirez', 'sortiront'],
    conditionnel: ['sortirais', 'sortirais', 'sortirait', 'sortirions', 'sortiriez', 'sortiraient'],
    subjonctif: ['sorte', 'sortes', 'sorte', 'sortions', 'sortiez', 'sortent'],
    participePasse: 'sorti',
    auxiliaire: 'être',
    imperatif: ['sors', 'sortons', 'sortez'],
  },
  dormir: {
    present: ['dors', 'dors', 'dort', 'dormons', 'dormez', 'dorment'],
    imparfait: ['dormais', 'dormais', 'dormait', 'dormions', 'dormiez', 'dormaient'],
    futur: ['dormirai', 'dormiras', 'dormira', 'dormirons', 'dormirez', 'dormiront'],
    conditionnel: ['dormirais', 'dormirais', 'dormirait', 'dormirions', 'dormiriez', 'dormiraient'],
    subjonctif: ['dorme', 'dormes', 'dorme', 'dormions', 'dormiez', 'dorment'],
    participePasse: 'dormi',
    auxiliaire: 'avoir',
    imperatif: ['dors', 'dormons', 'dormez'],
  },
  servir: {
    present: ['sers', 'sers', 'sert', 'servons', 'servez', 'servent'],
    imparfait: ['servais', 'servais', 'servait', 'servions', 'serviez', 'servaient'],
    futur: ['servirai', 'serviras', 'servira', 'servirons', 'servirez', 'serviront'],
    conditionnel: ['servirais', 'servirais', 'servirait', 'servirions', 'serviriez', 'serviraient'],
    subjonctif: ['serve', 'serves', 'serve', 'servions', 'serviez', 'servent'],
    participePasse: 'servi',
    auxiliaire: 'avoir',
    imperatif: ['sers', 'servons', 'servez'],
  },
  sentir: {
    present: ['sens', 'sens', 'sent', 'sentons', 'sentez', 'sentent'],
    imparfait: ['sentais', 'sentais', 'sentait', 'sentions', 'sentiez', 'sentaient'],
    futur: ['sentirai', 'sentiras', 'sentira', 'sentirons', 'sentirez', 'sentiront'],
    conditionnel: ['sentirais', 'sentirais', 'sentirait', 'sentirions', 'sentiriez', 'sentiraient'],
    subjonctif: ['sente', 'sentes', 'sente', 'sentions', 'sentiez', 'sentent'],
    participePasse: 'senti',
    auxiliaire: 'avoir',
    imperatif: ['sens', 'sentons', 'sentez'],
  },
  mentir: {
    present: ['mens', 'mens', 'ment', 'mentons', 'mentez', 'mentent'],
    imparfait: ['mentais', 'mentais', 'mentait', 'mentions', 'mentiez', 'mentaient'],
    futur: ['mentirai', 'mentiras', 'mentira', 'mentirons', 'mentirez', 'mentiront'],
    conditionnel: ['mentirais', 'mentirais', 'mentirait', 'mentirions', 'mentiriez', 'mentiraient'],
    subjonctif: ['mente', 'mentes', 'mente', 'mentions', 'mentiez', 'mentent'],
    participePasse: 'menti',
    auxiliaire: 'avoir',
    imperatif: ['mens', 'mentons', 'mentez'],
  },
  écrire: {
    present: ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'],
    imparfait: ['écrivais', 'écrivais', 'écrivait', 'écrivions', 'écriviez', 'écrivaient'],
    futur: ['écrirai', 'écriras', 'écrira', 'écrirons', 'écrirez', 'écriront'],
    conditionnel: ['écrirais', 'écrirais', 'écrirait', 'écririons', 'écririez', 'écriraient'],
    subjonctif: ['écrive', 'écrives', 'écrive', 'écrivions', 'écriviez', 'écrivent'],
    participePasse: 'écrit',
    auxiliaire: 'avoir',
    imperatif: ['écris', 'écrivons', 'écrivez'],
  },
  ecrire: {
    present: ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'],
    imparfait: ['écrivais', 'écrivais', 'écrivait', 'écrivions', 'écriviez', 'écrivaient'],
    futur: ['écrirai', 'écriras', 'écrira', 'écrirons', 'écrirez', 'écriront'],
    conditionnel: ['écrirais', 'écrirais', 'écrirait', 'écririons', 'écririez', 'écriraient'],
    subjonctif: ['écrive', 'écrives', 'écrive', 'écrivions', 'écriviez', 'écrivent'],
    participePasse: 'écrit',
    auxiliaire: 'avoir',
    imperatif: ['écris', 'écrivons', 'écrivez'],
  },
  lire: {
    present: ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'],
    imparfait: ['lisais', 'lisais', 'lisait', 'lisions', 'lisiez', 'lisaient'],
    futur: ['lirai', 'liras', 'lira', 'lirons', 'lirez', 'liront'],
    conditionnel: ['lirais', 'lirais', 'lirait', 'lirions', 'liriez', 'liraient'],
    subjonctif: ['lise', 'lises', 'lise', 'lisions', 'lisiez', 'lisent'],
    participePasse: 'lu',
    auxiliaire: 'avoir',
    imperatif: ['lis', 'lisons', 'lisez'],
  },
  mettre: {
    present: ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'],
    imparfait: ['mettais', 'mettais', 'mettait', 'mettions', 'mettiez', 'mettaient'],
    futur: ['mettrai', 'mettras', 'mettra', 'mettrons', 'mettrez', 'mettront'],
    conditionnel: ['mettrais', 'mettrais', 'mettrait', 'mettrions', 'mettriez', 'mettraient'],
    subjonctif: ['mette', 'mettes', 'mette', 'mettions', 'mettiez', 'mettent'],
    participePasse: 'mis',
    auxiliaire: 'avoir',
    imperatif: ['mets', 'mettons', 'mettez'],
  },
  ouvrir: {
    present: ['ouvre', 'ouvres', 'ouvre', 'ouvrons', 'ouvrez', 'ouvrent'],
    imparfait: ['ouvrais', 'ouvrais', 'ouvrait', 'ouvrions', 'ouvriez', 'ouvraient'],
    futur: ['ouvrirai', 'ouvriras', 'ouvrira', 'ouvrirons', 'ouvrirez', 'ouvriront'],
    conditionnel: ['ouvrirais', 'ouvrirais', 'ouvrirait', 'ouvririons', 'ouvririez', 'ouvriraient'],
    subjonctif: ['ouvre', 'ouvres', 'ouvre', 'ouvrions', 'ouvriez', 'ouvrent'],
    participePasse: 'ouvert',
    auxiliaire: 'avoir',
    imperatif: ['ouvre', 'ouvrons', 'ouvrez'],
  },
  suivre: {
    present: ['suis', 'suis', 'suit', 'suivons', 'suivez', 'suivent'],
    imparfait: ['suivais', 'suivais', 'suivait', 'suivions', 'suiviez', 'suivaient'],
    futur: ['suivrai', 'suivras', 'suivra', 'suivrons', 'suivrez', 'suivront'],
    conditionnel: ['suivrais', 'suivrais', 'suivrait', 'suivrions', 'suivriez', 'suivraient'],
    subjonctif: ['suive', 'suives', 'suive', 'suivions', 'suiviez', 'suivent'],
    participePasse: 'suivi',
    auxiliaire: 'avoir',
    imperatif: ['suis', 'suivons', 'suivez'],
  },
  conclure: {
    present: ['conclus', 'conclus', 'conclut', 'concluons', 'concluez', 'concluent'],
    imparfait: ['concluais', 'concluais', 'concluait', 'concluions', 'concluiez', 'concluaient'],
    futur: ['conclurai', 'concluras', 'conclura', 'conclurons', 'conclurez', 'concluront'],
    conditionnel: ['conclurais', 'conclurais', 'conclurait', 'conclurions', 'concluriez', 'concluraient'],
    subjonctif: ['conclue', 'conclues', 'conclue', 'concluions', 'concluiez', 'concluent'],
    participePasse: 'conclu',
    auxiliaire: 'avoir',
    imperatif: ['conclus', 'concluons', 'concluez'],
  },
  appartenir: {
    present: ['appartiens', 'appartiens', 'appartient', 'appartenons', 'appartenez', 'appartiennent'],
    imparfait: ['appartenais', 'appartenais', 'appartenait', 'appartenions', 'apparteniez', 'appartenaient'],
    futur: ['appartiendrai', 'appartiendras', 'appartiendra', 'appartiendrons', 'appartiendrez', 'appartiendront'],
    conditionnel: ['appartiendrais', 'appartiendrais', 'appartiendrait', 'appartiendrions', 'appartiendriez', 'appartiendraient'],
    subjonctif: ['appartienne', 'appartiennes', 'appartienne', 'appartenions', 'apparteniez', 'appartiennent'],
    participePasse: 'appartenu',
    auxiliaire: 'avoir',
    imperatif: ['appartiens', 'appartenons', 'appartenez'],
  },
  savoir: {
    present: ['sais', 'sais', 'sait', 'savons', 'savez', 'savent'],
    imparfait: ['savais', 'savais', 'savait', 'savions', 'saviez', 'savaient'],
    futur: ['saurai', 'sauras', 'saura', 'saurons', 'saurez', 'sauront'],
    conditionnel: ['saurais', 'saurais', 'saurait', 'saurions', 'sauriez', 'sauraient'],
    subjonctif: ['sache', 'saches', 'sache', 'sachions', 'sachiez', 'sachent'],
    participePasse: 'su',
    auxiliaire: 'avoir',
    imperatif: ['sache', 'sachons', 'sachez'],
  },
  connaître: {
    present: ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent'],
    imparfait: ['connaissais', 'connaissais', 'connaissait', 'connaissions', 'connaissiez', 'connaissaient'],
    futur: ['connaîtrai', 'connaîtras', 'connaîtra', 'connaîtrons', 'connaîtrez', 'connaîtront'],
    conditionnel: ['connaîtrais', 'connaîtrais', 'connaîtrait', 'connaîtrions', 'connaîtriez', 'connaîtraient'],
    subjonctif: ['connaisse', 'connaisses', 'connaisse', 'connaissions', 'connaissiez', 'connaissent'],
    participePasse: 'connu',
    auxiliaire: 'avoir',
    imperatif: ['connais', 'connaissons', 'connaissez'],
  },
  connaitre: {
    present: ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent'],
    imparfait: ['connaissais', 'connaissais', 'connaissait', 'connaissions', 'connaissiez', 'connaissaient'],
    futur: ['connaîtrai', 'connaîtras', 'connaîtra', 'connaîtrons', 'connaîtrez', 'connaîtront'],
    conditionnel: ['connaîtrais', 'connaîtrais', 'connaîtrait', 'connaîtrions', 'connaîtriez', 'connaîtraient'],
    subjonctif: ['connaisse', 'connaisses', 'connaisse', 'connaissions', 'connaissiez', 'connaissent'],
    participePasse: 'connu',
    auxiliaire: 'avoir',
    imperatif: ['connais', 'connaissons', 'connaissez'],
  },
  naître: {
    present: ['nais', 'nais', 'naît', 'naissons', 'naissez', 'naissent'],
    imparfait: ['naissais', 'naissais', 'naissait', 'naissions', 'naissiez', 'naissaient'],
    futur: ['naîtrai', 'naîtras', 'naîtra', 'naîtrons', 'naîtrez', 'naîtront'],
    conditionnel: ['naîtrais', 'naîtrais', 'naîtrait', 'naîtrions', 'naîtriez', 'naîtraient'],
    subjonctif: ['naisse', 'naisses', 'naisse', 'naissions', 'naissiez', 'naissent'],
    participePasse: 'né',
    auxiliaire: 'être',
    imperatif: ['nais', 'naissons', 'naissez'],
  },
  naitre: {
    present: ['nais', 'nais', 'naît', 'naissons', 'naissez', 'naissent'],
    imparfait: ['naissais', 'naissais', 'naissait', 'naissions', 'naissiez', 'naissaient'],
    futur: ['naîtrai', 'naîtras', 'naîtra', 'naîtrons', 'naîtrez', 'naîtront'],
    conditionnel: ['naîtrais', 'naîtrais', 'naîtrait', 'naîtrions', 'naîtriez', 'naîtraient'],
    subjonctif: ['naisse', 'naisses', 'naisse', 'naissions', 'naissiez', 'naissent'],
    participePasse: 'né',
    auxiliaire: 'être',
    imperatif: ['nais', 'naissons', 'naissez'],
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

function erPresentVowel(infinitive: string): { singular: string; plural: string } {
  const lower = infinitive.normalize('NFC').toLowerCase()
  // -eter / -éter verbs: répéter → répète, acheter → achète
  if (/(?:eter|éter)$/.test(lower)) {
    return { singular: 'è', plural: 'ènt' }
  }
  return { singular: 'e', plural: 'ent' }
}

function regularEr(infinitive: string): IrregularBundle {
  const lower = infinitive.normalize('NFC').toLowerCase()
  const isEter = /(?:eter|éter)$/.test(lower)
  const isYer = lower === 'envoyer' || /[^e]yer$/.test(lower)

  let stem = infinitive.slice(0, -2)
  // Soft g/c only before a/o/u — NOT before i (mangions, not mangeions).
  const softG = stem.endsWith('g')
  const softC = stem.endsWith('c')
  const softStem = softG ? `${stem}e` : softC ? `${stem.slice(0, -1)}ç` : stem

  if (isEter && stem.length > 1) {
    const cons = stem.slice(-1)
    const base = stem.slice(0, -1).replace(/é$/, 'è').replace(/e$/, 'è')
    const sg = `${base}${cons}e`
    const pl = `${base}${cons}ent`
    return {
      present: [sg, `${sg}s`, sg, `${softStem}ons`, `${stem}ez`, pl],
      imparfait: [`${softStem}ais`, `${softStem}ais`, `${softStem}ait`, `${stem}ions`, `${stem}iez`, `${softStem}aient`],
      futur: [`${infinitive}ai`, `${infinitive}as`, `${infinitive}a`, `${infinitive}ons`, `${infinitive}ez`, `${infinitive}ont`],
      conditionnel: [`${infinitive}ais`, `${infinitive}ais`, `${infinitive}ait`, `${infinitive}ions`, `${infinitive}iez`, `${infinitive}aient`],
      subjonctif: [sg, `${sg}s`, sg, `${stem}ions`, `${stem}iez`, pl],
      participePasse: `${stem}é`,
      auxiliaire: 'avoir',
      imperatif: [sg, `${softStem}ons`, `${stem}ez`],
    }
  }

  // lever / promener family: lève, lèves, lève, levons…
  if (/^(lever|soulever|relever|enlever|mener|amener|emmener|promener|semer|peser)$/.test(lower)) {
    const sgStem = stem.replace(/e([^e]*)$/, 'è$1')
    return {
      present: [`${sgStem}e`, `${sgStem}es`, `${sgStem}e`, `${softStem}ons`, `${stem}ez`, `${sgStem}ent`],
      imparfait: [`${softStem}ais`, `${softStem}ais`, `${softStem}ait`, `${stem}ions`, `${stem}iez`, `${softStem}aient`],
      futur: [`${infinitive}ai`, `${infinitive}as`, `${infinitive}a`, `${infinitive}ons`, `${infinitive}ez`, `${infinitive}ont`],
      conditionnel: [`${infinitive}ais`, `${infinitive}ais`, `${infinitive}ait`, `${infinitive}ions`, `${infinitive}iez`, `${infinitive}aient`],
      subjonctif: [`${sgStem}e`, `${sgStem}es`, `${sgStem}e`, `${stem}ions`, `${stem}iez`, `${sgStem}ent`],
      participePasse: `${stem}é`,
      auxiliaire: 'avoir',
      imperatif: [`${sgStem}e`, `${softStem}ons`, `${stem}ez`],
    }
  }

  // appeler / épeler: -eler → èll before silent e (appelle, épelle)
  if (/^(appeler|épeler|epeler|rappeler|renouveler)$/.test(lower) || /[^g]eler$/.test(lower)) {
    const sgStem = `${stem.slice(0, -2)}èll`
    return {
      present: [`${sgStem}e`, `${sgStem}es`, `${sgStem}e`, `${softStem}ons`, `${stem}ez`, `${sgStem}ent`],
      imparfait: [`${softStem}ais`, `${softStem}ais`, `${softStem}ait`, `${stem}ions`, `${stem}iez`, `${softStem}aient`],
      futur: [`${infinitive}ai`, `${infinitive}as`, `${infinitive}a`, `${infinitive}ons`, `${infinitive}ez`, `${infinitive}ont`],
      conditionnel: [`${infinitive}ais`, `${infinitive}ais`, `${infinitive}ait`, `${infinitive}ions`, `${infinitive}iez`, `${infinitive}aient`],
      subjonctif: [`${sgStem}e`, `${sgStem}es`, `${sgStem}e`, `${stem}ions`, `${stem}iez`, `${sgStem}ent`],
      participePasse: `${stem}é`,
      auxiliaire: 'avoir',
      imperatif: [`${sgStem}e`, `${softStem}ons`, `${stem}ez`],
    }
  }

  // préférer / espérer family: é → è in singular (préfère)
  if (/^(préférer|preferer|espérer|esperer|répéter|repeter|compléter|completer|inquiéter|inquieter|protéger)$/.test(lower)) {
    const sgStem = stem.replace(/é([^é]*)$/i, 'è$1')
    return {
      present: [`${sgStem}e`, `${sgStem}es`, `${sgStem}e`, `${softStem}ons`, `${stem}ez`, `${sgStem}ent`],
      imparfait: [`${softStem}ais`, `${softStem}ais`, `${softStem}ait`, `${stem}ions`, `${stem}iez`, `${softStem}aient`],
      futur: [`${infinitive}ai`, `${infinitive}as`, `${infinitive}a`, `${infinitive}ons`, `${infinitive}ez`, `${infinitive}ont`],
      conditionnel: [`${infinitive}ais`, `${infinitive}ais`, `${infinitive}ait`, `${infinitive}ions`, `${infinitive}iez`, `${infinitive}aient`],
      subjonctif: [`${sgStem}e`, `${sgStem}es`, `${sgStem}e`, `${stem}ions`, `${stem}iez`, `${sgStem}ent`],
      participePasse: `${stem}é`,
      auxiliaire: 'avoir',
      imperatif: [`${sgStem}e`, `${softStem}ons`, `${stem}ez`],
    }
  }

  // envoyer → envoie (y→i); futur enverrai
  if (lower === 'envoyer') {
    const sgStem = `${stem.slice(0, -1)}i`
    return {
      present: [`${sgStem}e`, `${sgStem}es`, `${sgStem}e`, `${softStem}ons`, `${stem}ez`, `${sgStem}ent`],
      imparfait: [`${softStem}ais`, `${softStem}ais`, `${softStem}ait`, `${stem}ions`, `${stem}iez`, `${softStem}aient`],
      futur: ['enverrai', 'enverras', 'enverra', 'enverrons', 'enverrez', 'enverront'],
      conditionnel: ['enverrais', 'enverrais', 'enverrait', 'enverrions', 'enverriez', 'enverraient'],
      subjonctif: [`${sgStem}e`, `${sgStem}es`, `${sgStem}e`, `${stem}ions`, `${stem}iez`, `${sgStem}ent`],
      participePasse: `${stem}é`,
      auxiliaire: 'avoir',
      imperatif: [`${sgStem}e`, `${softStem}ons`, `${stem}ez`],
    }
  }

  if (isYer) {
    const sgStem = `${stem.slice(0, -1)}i`
    return {
      present: [`${sgStem}e`, `${sgStem}es`, `${sgStem}e`, `${softStem}ons`, `${stem}ez`, `${sgStem}ent`],
      imparfait: [`${softStem}ais`, `${softStem}ais`, `${softStem}ait`, `${stem}ions`, `${stem}iez`, `${softStem}aient`],
      futur: [`${infinitive}ai`, `${infinitive}as`, `${infinitive}a`, `${infinitive}ons`, `${infinitive}ez`, `${infinitive}ont`],
      conditionnel: [`${infinitive}ais`, `${infinitive}ais`, `${infinitive}ait`, `${infinitive}ions`, `${infinitive}iez`, `${infinitive}aient`],
      subjonctif: [`${sgStem}e`, `${sgStem}es`, `${sgStem}e`, `${stem}ions`, `${stem}iez`, `${sgStem}ent`],
      participePasse: `${stem}é`,
      auxiliaire: 'avoir',
      imperatif: [`${sgStem}e`, `${softStem}ons`, `${stem}ez`],
    }
  }

  const { singular, plural } = erPresentVowel(infinitive)
  return {
    present: [`${stem}${singular}`, `${stem}${singular}s`, `${stem}${singular}`, `${softStem}ons`, `${stem}ez`, `${stem}${plural}`],
    imparfait: [`${softStem}ais`, `${softStem}ais`, `${softStem}ait`, `${stem}ions`, `${stem}iez`, `${softStem}aient`],
    futur: [`${infinitive}ai`, `${infinitive}as`, `${infinitive}a`, `${infinitive}ons`, `${infinitive}ez`, `${infinitive}ont`],
    conditionnel: [`${infinitive}ais`, `${infinitive}ais`, `${infinitive}ait`, `${infinitive}ions`, `${infinitive}iez`, `${infinitive}aient`],
    subjonctif: [`${stem}${singular}`, `${stem}${singular}s`, `${stem}${singular}`, `${stem}ions`, `${stem}iez`, `${stem}${plural}`],
    participePasse: `${stem}é`,
    auxiliaire: 'avoir',
    imperatif: [`${stem}${singular}`, `${softStem}ons`, `${stem}ez`],
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
