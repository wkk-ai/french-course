import type { LessonContent, LessonExercise, VocabularyWord } from '@/lib/course'
import { conversationLine, readingParagraphs } from '@/lib/lesson-text'
import type { Phase1Theme } from '@/lib/phase1/theme-bank'

export type DeepTheme = Phase1Theme & {
  role?: 'A' | 'B' | 'C' | 'D'
  moduleTitle?: string
  unitTitle?: string
  chunks?: Array<[string, string]>
  traps?: string[]
  registerTrio?: [string, string, string]
  readingFr?: string[]
  theorySections?: Array<{ heading: string; body: string }>
}

const NAME_PAIRS: Array<[string, string]> = [
  ['Marc', 'Marie'],
  ['Paul', 'Sophie'],
  ['Luc', 'Claire'],
  ['Antoine', 'Camille'],
  ['Julien', 'Léa'],
  ['Thomas', 'Emma'],
  ['Nicolas', 'Chloé'],
  ['Hugo', 'Manon'],
  ['Louis', 'Nina'],
  ['Adam', 'Jade'],
]

const PLACES = [
  'Paris',
  'Lyon',
  'Marseille',
  'Bordeaux',
  'Lille',
  'Nantes',
  'Toulouse',
  'Strasbourg',
  'Nice',
  'Rennes',
]

const VENUES = [
  'un café',
  'la gare',
  'un parc',
  'une bibliothèque',
  'un marché',
  'une terrasse',
  'un musée',
  'la rue principale',
  'un appartement',
  'une salle de classe',
]

const OPENERS = [
  'Ce matin',
  'Cet après-midi',
  'Ce soir',
  'Aujourd\'hui',
  'Vers midi',
  'En fin de journée',
  'Après le déjeuner',
  'Avant le cours',
]

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt) % arr.length]
}

/** One shared world for reading + dialogue + setting. */
export function worldForTheme(theme: { id: string }) {
  const seed = hashId(theme.id)
  const [a, b] = pick(NAME_PAIRS, seed, 1)
  const place = pick(PLACES, seed, 3)
  const venue = pick(VENUES, seed, 5)
  const when = pick(OPENERS, seed, 7)
  return { seed, a, b, place, venue, when }
}

export function cleanGrammar(grammar: string): string {
  return grammar
    .replace(/\s*[·•|]\s*Prove gate[^.]*\.?/gi, '')
    .replace(/Prove gate\s*\([^)]*\)/gi, '')
    .replace(/Fail\s*→\s*remediate[^.]*\.?/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function cleanTraps(theme: DeepTheme): string[] {
  const cleaned = (theme.traps ?? [])
    .map((trap) => trap.trim())
    .filter(
      (trap) =>
        trap &&
        !/remediate|Prove is timed|Prove gate|story memory|Fail\s*→|no hints/i.test(trap) &&
        !/Only French forms and meanings count/i.test(trap),
    )
  if (cleaned.length >= 2) return cleaned.slice(0, 5)
  return [
    `Do not use a French content word in an example before its English meaning appears in the list above.`,
    `Keep chunks whole — do not translate word-by-word from English.`,
    `Watch register: *vous* with strangers and staff; *tu* only when invited.`,
  ]
}

function looksFrenchLine(line: string): boolean {
  const cleaned = line
    .replace(/^Je pratique\s*:\s*/i, '')
    .replace(/^Encore\s*:\s*/i, '')
    .trim()
  if (!cleaned) return false
  if (/[àâäéèêëîïôöùûüçœæÀÂÄÉÈÊËÎÏÔÖÙÛÜÇŒÆ]/.test(cleaned)) return true
  if (
    /\b(je|tu|il|elle|nous|vous|ils|elles|bonjour|merci|oui|non|est|suis|avoir|être|pas|le|la|les|un|une|des|au|aux|du|de|à|où|qui|que)\b/i.test(
      cleaned,
    )
  ) {
    return true
  }
  if (/^[A-Za-z0-9][A-Za-z0-9 .·:\-/']{2,}$/.test(cleaned) && !/\b(je|tu|il|bonjour)\b/i.test(cleaned)) {
    return false
  }
  return !/\b(global|diploma|texts|grammar|checkpoint|comprehension|phase|radar|tense|mixed|final|vocab|check|drills)\b/i.test(
    cleaned,
  )
}

function isCleanLemma(fr: string): boolean {
  const raw = fr.replace(/[()]/g, '').split('/')[0]?.trim() ?? ''
  if (!raw || raw.length < 2) return false
  if (/\b(Drills|Phase|grammar|Final|Checkpoint|Prove|Global|diploma|texts|Comprehension|radar|Mix )\b/i.test(raw)) {
    return false
  }
  if (/say as one chunk/i.test(raw)) return false
  return looksFrenchLine(raw) || /^[a-zàâäéèêëîïôöùûüçœæ'’\s-]{2,40}$/i.test(raw)
}

function cleanMeanings(theme: DeepTheme): Array<[string, string]> {
  return theme.meanings.filter(([fr, en]) => isCleanLemma(fr) && en && !/prove chunk|useful phrase/i.test(en))
}

function cleanChunks(theme: DeepTheme): Array<[string, string]> {
  const meanings = cleanMeanings(theme)
  const fromTheme = (theme.chunks ?? []).filter(
    ([fr, en]) => en && !/prove chunk|useful phrase/i.test(en) && isCleanLemma(fr),
  )
  if (fromTheme.length >= 3) return fromTheme.slice(0, 8)
  return meanings.slice(0, 6).map(([fr, en]) => [fr, en] as [string, string])
}

function roleOf(theme: DeepTheme): 'A' | 'B' | 'C' | 'D' {
  if (theme.role) return theme.role
  if (/prove/i.test(theme.title)) return 'D'
  if (/checkpoint|integrate/i.test(theme.title)) return 'C'
  if (/apply/i.test(theme.title)) return 'B'
  return 'A'
}

function briefMinChars(role: 'A' | 'B' | 'C' | 'D'): number {
  if (role === 'A') return 2500
  if (role === 'B') return 1500
  return 900
}

function frenchFocusLines(theme: DeepTheme): string[] {
  const meanings = cleanMeanings(theme)
  const fromTheme = theme.focus
    .map((line) =>
      line
        .replace(/^Je pratique\s*:\s*/i, '')
        .replace(/^Encore\s*:\s*/i, '')
        .replace(/^C'est\s*«\s*/i, "C'est ")
        .replace(/»\s*\.?$/, '')
        .trim(),
    )
    .filter(looksFrenchLine)
  if (fromTheme.length >= 2) return fromTheme
  return meanings.slice(0, 8).map(([fr], index) => {
    const word = fr.replace(/[()]/g, '').split('/')[0]?.trim() ?? 'bonjour'
    if (index % 3 === 0) return `J'aime le mot « ${word} ».`
    if (index % 3 === 1) return `Tu aimes « ${word} » ?`
    return `On dit « ${word} » ici.`
  })
}

function lemma(theme: DeepTheme, index: number): string {
  const pool = cleanMeanings(theme).map(([fr]) => fr.replace(/[()]/g, '').split('/')[0]?.trim() ?? 'bonjour')
  if (pool.length === 0) return 'bonjour'
  return pool[index % pool.length]
}

function expandBriefToMin(body: string, theme: DeepTheme, min: number): string {
  if (body.length >= min) return body
  let next = body
  const grammar = cleanGrammar(theme.grammar)
  const meanings = cleanMeanings(theme)
  next += `\n\n**More meaning practice**\n`
  for (const [fr, en] of meanings) {
    next += `- Picture a real moment where you need *${fr}* (${en}). Say the French aloud, then a short sentence with it.\n`
    if (next.length >= min) return next
  }
  next += `\n**How the pattern works in speech**\n`
  next += `${grammar} Listen for this pattern in the reading and dialogue. Copy the rhythm of the French — do not rebuild it from English word order.\n`
  for (const line of frenchFocusLines(theme)) {
    next += `- Produce: *${line}*. Change the subject pronoun if the line allows it.\n`
    if (next.length >= min) return next
  }
  let i = 0
  while (next.length < min && meanings.length > 0) {
    const [fr, en] = meanings[i % meanings.length]
    next += `- Quick reuse: *${fr}* = ${en}. Make one new sentence, then say it slower.\n`
    i += 1
    if (i > 100) break
  }
  return next
}

export function buildCraftBrief(theme: DeepTheme): NonNullable<LessonContent['brief']> {
  const role = roleOf(theme)
  const grammar = cleanGrammar(theme.grammar)
  const traps = cleanTraps(theme)
  const chunks = cleanChunks(theme)
  const meanings = cleanMeanings(theme)
  const world = worldForTheme(theme)
  const seed = world.seed
  const trio =
    theme.registerTrio ??
    ([
      ['Bonjour, comment allez-vous ?', 'Salut, ça va ?', 'Hé, ça va ?'],
      ['Bonjour, pourriez-vous m\'aider ?', 'Tu peux m\'aider ?', 'Hé, un coup de main ?'],
      ['Bonsoir, je voudrais un café.', 'Je prends un café.', 'Un café, s\'il te plaît.'],
      ['Excusez-moi, où est la gare ?', 'C\'est où, la gare ?', 'La gare, c\'est par où ?'],
    ] as Array<[string, string, string]>)[seed % 4]

  const mid = Math.ceil(Math.max(1, meanings.length) / 2)
  const groupA = meanings.slice(0, mid)
  const groupB = meanings.slice(mid)
  const proveNote =
    role === 'D'
      ? `\n\n**What you must show**\nYou will answer mixed drills on this unit without hints. Aim for a solid score. If you miss the mark, reopen the practice and review chapters in this unit, then try again.\n`
      : ''

  const whyVariants = [
    `These words carry the lesson. If a meaning is shaky, later sentences feel random.`,
    `You will meet these forms in the ${world.place} scene and in the dialogue between ${world.a} and ${world.b}.`,
    `Say each French form aloud, then the English, then one short sentence of your own before moving on.`,
  ]

  let body =
    `You are learning: ${grammar}.` +
    (theme.moduleTitle ? ` Module: *${theme.moduleTitle}*.` : '') +
    (theme.unitTitle ? ` Unit: *${theme.unitTitle}*.` : '') +
    `\n\n` +
    `**1. Words to learn first (meanings)**\n` +
    `Before any grammar example, learn these with English meanings. Do not skip this list.\n\n` +
    `**People, politeness, and core words**\n` +
    groupA.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n') +
    `\n\n` +
    (groupB.length
      ? `**More words for this lesson**\n` + groupB.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n') + `\n\n`
      : '') +
    `**2. Why these meanings matter**\n` +
    `${whyVariants[seed % whyVariants.length]} ${whyVariants[(seed + 1) % whyVariants.length]}\n\n` +
    `**3. Grammar pattern (only after meanings)**\n` +
    `${grammar}\n\n` +
    `Lines to produce once meanings are clear:\n` +
    frenchFocusLines(theme)
      .slice(0, 6)
      .map((line) => `- ${line}`)
      .join('\n') +
    `\n\n` +
    `**4. Traps**\n` +
    traps.map((trap) => `- ${trap}`).join('\n') +
    `\n\n` +
    `**5. Chunks (learn as wholes)**\n` +
    chunks.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n') +
    `\n\n` +
    `**6. Register — same idea, three tones**\n` +
    `In ${world.place}, with a stranger or staff, prefer *vous*. With a friend like ${world.b}, *tu* is fine once invited.\n` +
    `- More formal: *${trio[0]}*\n` +
    `- Everyday: *${trio[1]}*\n` +
    `- Very casual (recognition only early on): *${trio[2]}*\n` +
    `Choose the tone from the relationship, not from habit alone.\n` +
    proveNote

  for (const section of theme.theorySections ?? []) {
    if (/Prove rules|remediate|Fail\s*→|no hints|Hand-crafted|Enqueue|Practice order/i.test(`${section.heading} ${section.body}`)) {
      continue
    }
    body += `\n**${section.heading}**\n${section.body}\n`
  }

  body = expandBriefToMin(body, theme, briefMinChars(role) + 150)

  const titleBase = theme.title.replace(/^Prove:\s*/i, '')
  return {
    title: role === 'D' ? `Show what you know — ${titleBase}` : titleBase,
    body,
    ruleSlugs: theme.ruleSlugs,
  }
}

export function buildCraftReadingFr(theme: DeepTheme): string[] {
  const world = worldForTheme(theme)
  const { a, b, place, venue, when, seed } = world
  const w = (i: number) => lemma(theme, i)
  const focus = frenchFocusLines(theme)
  const list = cleanMeanings(theme)
    .slice(0, 10)
    .map(([fr]) => fr.replace(/[()]/g, '').split('/')[0]?.trim())
    .filter(Boolean)
    .join(', ')

  const sceneJobs: string[][] = [
    [
      `${when}, ${a} et ${b} sont à ${place}, près de ${venue}. ${a} dit bonjour. ${b} dit bonjour aussi.`,
      `${a} parle avec « ${w(0)} » et « ${w(1)} ». ${b} écoute bien, puis dit la même phrase avec soin.`,
      `Une personne demande : « S'il vous plaît ? » ${a} répond avec *vous*. Entre amis, ${a} et ${b} disent *tu*.`,
      `Ils marchent un peu dans ${place}. ${a} dit aussi « ${w(2)} ». ${b} dit : « Oui, je comprends. »`,
      `Près de ${venue}, ${b} demande : « ${w(3)} ? » ${a} donne un exemple simple et clair.`,
      `${a} dit : « ${focus[0] ?? `J'aime le mot « ${w(0)} ».`} » ${b} dit : « ${focus[1] ?? `Tu aimes « ${w(1)} » ?`} »`,
      `Ils regardent les mots du jour : ${list}. ${a} est content. ${b} est contente.`,
      `Avant de partir, ${a} dit merci. ${b} dit à bientôt. Ils disent aussi au revoir à ${place}.`,
      `Plus tard, ${a} écrit trois phrases avec ${w(0)}, ${w(1)} et ${w(2)}. ${b} lit à voix haute.`,
      `${b} dit : « Très bien. » ${a} dit encore une fois. C'est une bonne journée à ${place}.`,
    ],
    [
      `${a} et ${b} sont à ${place}. Ils vont à ${venue} pour parler. ${when.toLowerCase()}, c'est calme.`,
      `${b} dit : « Tu aimes « ${w(0)} » ? » ${a} répond avec une phrase simple et complète.`,
      `Avec un serveur, ils disent bonjour et *vous*. Entre ${a} et ${b}, c'est *tu*.`,
      `${a} fait une petite histoire avec « ${w(1)} » et « ${w(2)} ». ${b} change : je, tu, il.`,
      `${a} parle plus lentement. ${b} écrit les mots : ${list}.`,
      `${b} dit : « ${focus[0] ?? `On dit « ${w(0)} » ici.`} » ${a} dit : « D'accord. Encore une fois. »`,
      `Ils s'arrêtent devant ${venue}. ${a} parle de la scène. ${b} dit « ${w(3)} » et « ${w(4)} ».`,
      `Pour finir, ${a} cache la liste. ${b} dit le sens de chaque mot. Pas de stress.`,
      `Le soleil est bas à ${place}. ${a} dit : « C'est clair. » ${b} dit : « Oui. À demain. »`,
      `Ils partent. Merci, à bientôt, au revoir — des phrases simples et vraies.`,
    ],
    [
      `À ${place}, ${a} aide ${b} près de ${venue}. ${when}, ils ont le temps.`,
      `${a} montre « ${w(0)} ». ${b} pense en anglais une seconde, puis parle seulement en français.`,
      `Un ami arrive. Ils disent : bonjour, ça va, merci. Puis ils reviennent au point du jour.`,
      `${b} dit : « ${focus[0] ?? `J'aime « ${w(0)} ».`} » ${a} dit : « Bien. Et avec « ${w(1)} » ? »`,
      `Ils jouent un petit dialogue. ${a} est le client. ${b} est le serveur. *Vous* est important.`,
      `Ensuite ils disent *tu*. ${a} dit « ${w(2)} ». ${b} dit « ${w(3)} ». La différence est claire.`,
      `Dans la rue, ils entendent d'autres phrases. Ils voient aussi : ${list}.`,
      `${a} dit la règle en une phrase simple. ${b} donne deux exemples nouveaux.`,
      `Ils rient d'une petite erreur, puis corrigent. Le français avance sans stress.`,
      `Fin de scène à ${place} : à bientôt. Au revoir. Ils se voient demain.`,
    ],
  ]

  return sceneJobs[seed % sceneJobs.length]
}

export function buildCraftDialogue(theme: DeepTheme): Array<{ speaker: string; text: string }> {
  const world = worldForTheme(theme)
  const { a, b, place, venue } = world
  const w = (i: number) => lemma(theme, i)
  const focus = frenchFocusLines(theme)
  const f0 = focus[0] ?? `Je connais le mot « ${w(0)} ».`
  const f1 = focus[1] ?? `Tu comprends « ${w(1)} » ?`
  const f2 = focus[2] ?? `On utilise « ${w(2)} » ici.`

  return [
    { speaker: a, text: `Bonjour ${b} !` },
    { speaker: b, text: `Bonjour ${a} ! Tu es à ${place} ?` },
    { speaker: a, text: `Oui, près de ${venue}. On parle un peu ?` },
    { speaker: b, text: `Oui. Tu aimes le mot « ${w(0)} » ?` },
    { speaker: a, text: f0 },
    { speaker: b, text: `Bien. Et « ${w(1)} », tu le dis comment ?` },
    { speaker: a, text: f1 },
    { speaker: b, text: `Encore un exemple, s'il te plaît.` },
    { speaker: a, text: f2 },
    { speaker: b, text: `Merci. Et plus poli, avec vous ?` },
    { speaker: a, text: `Bonjour, comment allez-vous ?` },
    { speaker: b, text: `Très bien, merci. Et vous ?` },
    { speaker: a, text: `À bientôt à ${place} !` },
    { speaker: b, text: `Au revoir !` },
  ]
}

function meaningDistractors(meanings: Array<[string, string]>, correctEn: string, index: number): [string, string] {
  const pool = meanings.map(([, en]) => en).filter((en) => en !== correctEn)
  const first = pool[index % Math.max(1, pool.length)] ?? 'another meaning'
  const second = pool[(index + 1) % Math.max(1, pool.length)] ?? 'a different word'
  return [first, second]
}

function wrongFrenchLines(theme: DeepTheme, index: number): [string, string] {
  const focus = frenchFocusLines(theme)
  const lineA = focus[(index + 1) % Math.max(1, focus.length)] ?? 'Je ne comprends pas.'
  const lineB = focus[(index + 2) % Math.max(1, focus.length)] ?? "C'est difficile."
  return [lineA, lineB]
}

function scrubExercise(
  item: { category: string; prompt: string; options: string[]; answer: number },
  theme: DeepTheme,
  index: number,
): LessonExercise | null {
  const blob = [item.prompt, ...item.options].join(' ')
  if (/plot|spoiler|character name|Before grammar|Chunks should be learned|prove chunk|Hand-crafted|only English/i.test(blob)) {
    return null
  }
  if (item.options.some((option) => /^(plot|name|story|Only English|only English)$/i.test(option.trim()))) {
    return null
  }
  return {
    id: `craft-e${index + 1}`,
    category: item.category || theme.ruleSlugs[0] || 'grammar',
    prompt: item.prompt.replace(/^Prove\s*—\s*/i, ''),
    options: item.options,
    answer: item.answer,
    explanation: item.options[item.answer] ?? 'Correct form',
  }
}

function dedupeExercises(items: LessonExercise[]): LessonExercise[] {
  const seen = new Set<string>()
  const out: LessonExercise[] = []
  for (const item of items) {
    const key = `${item.prompt}|${(item.options ?? []).join('~')}|${item.type ?? 'mcq'}|${'statement' in item ? item.statement : ''}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

export function buildCraftExercises(theme: DeepTheme, prefix: string): LessonExercise[] {
  const meanings = cleanMeanings(theme)
  const focus = frenchFocusLines(theme)
  const fromTheme = theme.exercises
    .map((item, index) => scrubExercise(item, theme, index))
    .filter((item): item is LessonExercise => Boolean(item))
    .map((item, index) => ({ ...item, id: `${prefix}-e${index + 1}` }))

  const meaningDrills: LessonExercise[] = meanings.slice(0, 12).map(([fr, en], index) => {
    const [d1, d2] = meaningDistractors(meanings, en, index)
    return {
      id: `${prefix}-m${index + 1}`,
      category: 'vocab-meaning',
      prompt: `What does “${fr}” mean?`,
      options: [en, d1, d2],
      answer: 0,
      explanation: en,
    }
  })

  const focusDrills: LessonExercise[] = focus.slice(0, 6).map((line, index) => {
    const [wrongA, wrongB] = wrongFrenchLines(theme, index)
    return {
      id: `${prefix}-f${index + 1}`,
      category: 'focus-production',
      prompt: `Which French line fits this lesson best?`,
      options: [line, wrongA, wrongB],
      answer: 0,
      explanation: line,
    }
  })

  const left = meanings.slice(0, Math.min(4, meanings.length)).map(([fr]) => fr)
  const right = meanings.slice(0, Math.min(4, meanings.length)).map(([, en]) => en)
  const matchExercise: LessonExercise = {
    id: `${prefix}-match`,
    type: 'match',
    category: 'match-pairs',
    prompt: 'Match each French word with its English meaning',
    explanation: 'Meanings from Words to learn first',
    left,
    right,
    pairs: left.map((_, index) => [index, index] as [number, number]),
  }

  const clozeSource = focus[0] ?? `Je connais le mot « ${lemma(theme, 0)} ».`
  const firstWord = clozeSource.split(/\s+/)[0]?.replace(/[.,!?]/g, '') || 'Je'
  const orderWords = clozeSource.replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean)

  const cloze: LessonExercise = {
    id: `${prefix}-cloze1`,
    type: 'cloze',
    category: 'cloze-production',
    prompt: 'Type the missing French word.',
    text: clozeSource.includes(' ') ? clozeSource.replace(/\S+/, '___') : `___ ${clozeSource}`,
    answers: [firstWord],
    explanation: clozeSource,
  }

  const order: LessonExercise = {
    id: `${prefix}-order1`,
    type: 'order',
    category: 'word-order',
    prompt: 'Put these French words in the right order.',
    explanation: clozeSource,
    words: orderWords,
    answer: orderWords,
  }

  const trueFalse: LessonExercise[] = [0, 1, 2].map((index) => {
    const [fr, en] = meanings[index % Math.max(1, meanings.length)] ?? ['bonjour', 'hello']
    const truth = index !== 1
    const fakeEn = meaningDistractors(meanings, en, index + 5)[0]
    return {
      id: `${prefix}-tf${index + 1}`,
      type: 'true-false' as const,
      category: 'true-false',
      prompt: 'Is this meaning correct?',
      statement: truth ? `“${fr}” means “${en}”.` : `“${fr}” means “${fakeEn}”.`,
      answer: truth,
      explanation: truth ? 'From the meanings list' : `Actually “${fr}” means “${en}”.`,
    }
  })

  const grammarCore: LessonExercise[] = [
    {
      id: `${prefix}-g1`,
      category: theme.ruleSlugs[0] ?? 'grammar-core',
      prompt: 'Pick the French line that matches this lesson:',
      options: [focus[0] ?? `Je connais « ${lemma(theme, 0)} ».`, ...wrongFrenchLines(theme, 0)],
      answer: 0,
      explanation: focus[0] ?? 'Focus line',
    },
    {
      id: `${prefix}-reg1`,
      category: 'register',
      prompt: 'You meet a stranger at a desk. Best first word?',
      options: ['Bonjour', 'Hé', 'Yo'],
      answer: 0,
      explanation: 'Use a clear polite greeting with strangers.',
    },
  ]

  const combined = dedupeExercises([
    ...fromTheme,
    ...meaningDrills,
    ...focusDrills,
    matchExercise,
    ...trueFalse,
    ...grammarCore,
    cloze,
    order,
  ])

  let n = 0
  while (combined.length < 22 && meanings.length > 0) {
    const meaning = meanings[n % meanings.length]
    const [d1, d2] = meaningDistractors(meanings, meaning[1], n + 9)
    const next: LessonExercise = {
      id: `${prefix}-x${n + 1}`,
      category: 'vocab-meaning',
      prompt: `“${meaning[0]}” in English is…`,
      options: [meaning[1], d1, d2],
      answer: 0,
      explanation: meaning[1],
    }
    const before = combined.length
    combined.push(...dedupeExercises([...combined, next]).slice(before))
    if (combined.length === before) {
      combined.push({
        ...next,
        id: `${prefix}-x${n + 1}-b`,
        prompt: `Choose the meaning of ${meaning[0]}:`,
      })
    }
    n += 1
    if (n > 40) break
  }

  return combined.slice(0, 40)
}

export function buildCraftLesson(theme: DeepTheme, vocabulary: VocabularyWord[]): LessonContent {
  const prefix = `p${theme.id.slice(-4)}`
  const world = worldForTheme(theme)
  const readingFr = buildCraftReadingFr(theme)
  const dialogue = buildCraftDialogue(theme)

  return {
    brief: buildCraftBrief(theme),
    reading: readingParagraphs(prefix, readingFr, vocabulary),
    conversation: {
      title: `${world.a} et ${world.b} à ${world.place}`,
      setting: `${world.a} et ${world.b} se retrouvent près de ${world.venue} à ${world.place}.`,
      lines: dialogue.map((line, index) =>
        conversationLine(line.speaker, line.text, `${prefix}-l${index}`, vocabulary),
      ),
    },
    exercises: buildCraftExercises(theme, prefix),
  }
}
