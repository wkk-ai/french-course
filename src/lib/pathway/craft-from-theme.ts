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

const TIMES = ['ce matin', 'cet après-midi', 'ce soir', 'aujourd\'hui', 'en fin de journée']

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt) % arr.length]
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

function cleanChunks(theme: DeepTheme): Array<[string, string]> {
  const fromTheme = (theme.chunks ?? []).filter(([, en]) => en && !/prove chunk|useful phrase/i.test(en))
  if (fromTheme.length >= 3) return fromTheme.slice(0, 8)
  return theme.focus.slice(0, 6).map((line, index) => {
    const meaning = theme.meanings[index % Math.max(1, theme.meanings.length)]
    const en = meaning?.[1] ?? 'useful French line from this lesson'
    return [line.replace(/^Je pratique\s*:\s*/i, 'Je dis ').replace(/^Encore\s*:\s*/i, ''), en] as [string, string]
  })
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

function expandBriefToMin(body: string, theme: DeepTheme, min: number): string {
  if (body.length >= min) return body
  let next = body
  const grammar = cleanGrammar(theme.grammar)
  next += `\n\n**More meaning practice**\n`
  for (const [fr, en] of theme.meanings) {
    next += `- Picture a real moment where you need *${fr}* (${en}). Say the French aloud, then a short sentence with it.\n`
    if (next.length >= min) return next
  }
  next += `\n**How the pattern works in speech**\n`
  next += `${grammar} Listen for this pattern in the reading and dialogue. Copy the rhythm of the French — do not rebuild it from English word order.\n`
  for (const line of theme.focus) {
    const cleaned = line.replace(/^Je pratique\s*:\s*/i, '').replace(/^Encore\s*:\s*/i, '')
    next += `- Produce: *${cleaned}*. Change the subject pronoun if the line allows it.\n`
    if (next.length >= min) return next
  }
  next += `\n**Before you continue**\n`
  next += `If any meaning above is still fuzzy, stay on the list. Reading and drills reuse these words on purpose so they stick.\n`
  // Guarantee length for thin themes
  let i = 0
  while (next.length < min && theme.meanings.length > 0) {
    const [fr, en] = theme.meanings[i % theme.meanings.length]
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
  const trio = theme.registerTrio ?? ['Bonjour, comment allez-vous ?', 'Salut, ça va ?', 'Hé, ça va ?']
  const roleLabel = role === 'A' ? 'Learn' : role === 'B' ? 'Apply' : role === 'C' ? 'Integrate' : 'Prove'
  const proveNote =
    role === 'D'
      ? `\n\n**What you must show**\nYou will answer mixed drills on this unit with no hints. You need a solid score to pass. If you miss the mark, reopen Apply and Integrate, then try again.\n`
      : ''

  const meaningGroups = theme.meanings
  const mid = Math.ceil(meaningGroups.length / 2)
  const groupA = meaningGroups.slice(0, mid)
  const groupB = meaningGroups.slice(mid)

  let body =
    `This lesson builds: ${grammar}.` +
    (theme.moduleTitle ? ` You are in *${theme.moduleTitle}*.` : '') +
    (theme.unitTitle ? ` Unit focus: *${theme.unitTitle}*.` : '') +
    ` Stage: ${roleLabel}.\n\n` +
    `**1. Words to learn first (meanings)**\n` +
    `Before any grammar example, learn these with English meanings. Do not skip this list.\n\n` +
    `**People, politeness, and core words**\n` +
    groupA.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n') +
    `\n\n` +
    (groupB.length
      ? `**More words for this lesson**\n` + groupB.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n') + `\n\n`
      : '') +
    `**2. Why these meanings matter**\n` +
    `These words carry the lesson. If a meaning is shaky, later sentences feel random. Say each French form aloud, then the English, then one short sentence of your own.\n\n` +
    `**3. Grammar pattern (only after meanings)**\n` +
    `${grammar}\n\n` +
    `Lines to produce once meanings are clear:\n` +
    theme.focus
      .map((line) => `- ${line.replace(/^Je pratique\s*:\s*/i, 'Je dis ').replace(/^Encore\s*:\s*/i, '')}`)
      .join('\n') +
    `\n\n` +
    `**4. Traps**\n` +
    traps.map((trap) => `- ${trap}`).join('\n') +
    `\n\n` +
    `**5. Chunks (learn as wholes)**\n` +
    chunks.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n') +
    `\n\n` +
    `**6. Register — same idea, three tones**\n` +
    `With a stranger, teacher, or staff, prefer *vous* and a clear greeting.\n` +
    `- More formal: *${trio[0]}*\n` +
    `- Everyday: *${trio[1]}*\n` +
    `- Very casual (recognition only early on): *${trio[2]}*\n` +
    `Choose the tone from the relationship, not from habit alone.\n` +
    proveNote

  // Optional learner-facing theory (strip author runbooks).
  for (const section of theme.theorySections ?? []) {
    if (/Prove rules|remediate|Fail\s*→|no hints|Hand-crafted|Enqueue/i.test(`${section.heading} ${section.body}`)) {
      continue
    }
    body += `\n**${section.heading}**\n${section.body}\n`
  }

  body = expandBriefToMin(body, theme, briefMinChars(role) + 150)

  return {
    title: theme.title.replace(/^Prove:\s*/i, role === 'D' ? 'Prove — ' : ''),
    body,
    ruleSlugs: theme.ruleSlugs,
  }
}

function frWord(theme: DeepTheme, index: number): string {
  const pool = theme.meanings
    .map(([fr]) => fr.replace(/[()]/g, '').split('/')[0]?.trim() ?? '')
    .filter((fr) => fr && looksFrenchLine(fr) && !/\b(Drills|Phase|grammar|Final|Checkpoint|Prove|Global|diploma|texts)\b/i.test(fr))
  if (pool.length === 0) return 'bonjour'
  return pool[index % pool.length]
}

/** Reject English titles / grammar labels accidentally stored in focus. */
function looksFrenchLine(line: string): boolean {
  const cleaned = line
    .replace(/^Je pratique\s*:\s*/i, '')
    .replace(/^Encore\s*:\s*/i, '')
    .trim()
  if (!cleaned) return false
  if (/[àâäéèêëîïôöùûüçœæÀÂÄÉÈÊËÎÏÔÖÙÛÜÇŒÆ]/.test(cleaned)) return true
  if (
    /\b(je|tu|il|elle|nous|vous|ils|elles|bonjour|merci|oui|non|est|suis|avoir|être|pas|le|la|les|un|une|des|au|aux|du|de|à)\b/i.test(
      cleaned,
    )
  ) {
    return true
  }
  // ASCII-only English labels (Global tense radar, Final grammar check, …)
  if (/^[A-Za-z0-9][A-Za-z0-9 .·:\-/']{2,}$/.test(cleaned) && !/\b(je|tu|il|bonjour)\b/i.test(cleaned)) {
    return false
  }
  return !/\b(global|diploma|texts|grammar|checkpoint|comprehension|phase|radar|tense|mixed|final|vocab|check)\b/i.test(
    cleaned,
  )
}

function frenchFocusLines(theme: DeepTheme): string[] {
  const fromTheme = theme.focus
    .map((line) =>
      line
        .replace(/^Je pratique\s*:\s*/i, 'Je dis ')
        .replace(/^Encore\s*:\s*/i, '')
        .replace(/^C'est\s*«\s*/i, "C'est ")
        .replace(/»\s*\.?$/, '')
        .trim(),
    )
    .filter(looksFrenchLine)
  if (fromTheme.length >= 3) return fromTheme
  return theme.meanings.slice(0, 8).map(([fr], index) => {
    const word = fr.replace(/[()]/g, '').split('/')[0]?.trim() ?? 'bonjour'
    if (index % 3 === 0) return `Je dis ${word}.`
    if (index % 3 === 1) return `Tu dis ${word} ?`
    return `C'est ${word}.`
  })
}

export function buildCraftReadingFr(theme: DeepTheme): string[] {
  const seed = hashId(theme.id)
  const [a, b] = pick(NAME_PAIRS, seed, 1)
  const place = pick(PLACES, seed, 3)
  const when = pick(TIMES, seed, 5)
  const w = (i: number) => frWord(theme, i)
  const focusClean = frenchFocusLines(theme)
  const list = theme.meanings
    .map(([fr]) => fr.replace(/[()]/g, '').split('/')[0]?.trim())
    .filter((fr): fr is string => Boolean(fr) && looksFrenchLine(fr) && !/\b(Drills|Phase|grammar|Final|Checkpoint|Prove|Global|diploma|texts)\b/i.test(fr))
    .slice(0, 12)
    .join(', ')
  const cleanMeanings = theme.meanings
    .map(([fr]) => fr.replace(/[()]/g, '').split('/')[0]?.trim())
    .filter((fr): fr is string => Boolean(fr) && looksFrenchLine(fr) && !/\b(Drills|Phase|grammar|Final|Checkpoint|Prove|Global|diploma|texts)\b/i.test(fr))
  const extra = cleanMeanings
    .slice(0, 6)
    .map((fr, index) => `${a} répète « ${fr} » (${index + 1}).`)
    .join(' ')

  const paras: string[] = [
    `${when.charAt(0).toUpperCase() + when.slice(1)}, ${a} et ${b} sont à ${place}. ${a} dit « ${w(0)} ». ${b} dit « ${w(1)} ». Ils sont calmes et attentifs.`,
    `${a} dit : « ${focusClean[0] || `Je dis ${w(0)}`} ». ${b} dit : « ${focusClean[1] || `Tu dis ${w(1)}`} ». Ils répètent avec soin dans la rue.`,
    `${b} demande : « ${w(2)} ? » ${a} répond : « ${w(2)} ». Puis ${a} dit « ${w(3)} » et « ${w(4)} ». ${b} sourit.`,
    `À ${place}, ${a} et ${b} utilisent : ${list}. ${a} dit merci. ${b} dit à bientôt. Ils marchent un peu.`,
    `${a} dit encore : « ${focusClean[2] || `C'est ${w(0)}`} ». ${b} dit : « Oui. Encore une fois. » Ils sont contents de parler.`,
    `${b} dit « ${w(5)} ». ${a} dit « ${w(6)} ». Ils disent au revoir à ${place}. C'est fini pour aujourd'hui, mais le sens reste.`,
    `${a} est à la maison. Il dit « ${w(0)} », « ${w(2)} » et « ${w(4)} ». ${b} dit : « Très bien. À demain à ${place}. »`,
    `Pour finir, ${a} et ${b} disent : bonjour, merci, au revoir, à bientôt. Ils gardent le sens des mots : ${list}.`,
    `Le lendemain, ${a} revoit ${b} près de ${place}. ${extra} ${b} dit : « Oui, c'est clair. »`,
    `${b} écrit trois phrases avec ${w(0)}, ${w(1)} et ${w(2)}. ${a} lit à voix haute. Ils corrigent ensemble, sans stress.`,
  ]

  return paras
}

export function buildCraftDialogue(theme: DeepTheme): Array<{ speaker: string; text: string }> {
  const seed = hashId(theme.id)
  const [a, b] = pick(NAME_PAIRS, seed, 7)
  const place = pick(PLACES, seed, 9)
  const w = (i: number) => frWord(theme, i)
  const focus = frenchFocusLines(theme)
  const f = (i: number) => focus[i % focus.length] ?? `Je dis ${w(i)}.`

  return [
    { speaker: a, text: `Bonjour ${b} !` },
    { speaker: b, text: `Bonjour ${a} ! Tu es à ${place} ?` },
    { speaker: a, text: `Oui. Dis-moi : ${w(0)}.` },
    { speaker: b, text: `${w(0)}. Et ${w(1)} ?` },
    { speaker: a, text: f(0) },
    { speaker: b, text: `Bien. Et avec tu ?` },
    { speaker: a, text: f(1) },
    { speaker: b, text: `Encore un exemple, s'il te plaît.` },
    { speaker: a, text: f(2) },
    { speaker: b, text: `Merci. Et plus poli ?` },
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
  const focus = theme.focus
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
  if (/plot|spoiler|character name|Before grammar|Chunks should be learned|prove chunk|Hand-crafted/i.test(blob)) {
    return null
  }
  if (item.options.some((option) => /^(plot|name|story|Only English)$/i.test(option.trim()))) {
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

export function buildCraftExercises(theme: DeepTheme, prefix: string): LessonExercise[] {
  const fromTheme = theme.exercises
    .map((item, index) => scrubExercise(item, theme, index))
    .filter((item): item is LessonExercise => Boolean(item))
    .map((item, index) => ({ ...item, id: `${prefix}-e${index + 1}` }))

  const meaningDrills: LessonExercise[] = theme.meanings.map(([fr, en], index) => {
    const [d1, d2] = meaningDistractors(theme.meanings, en, index)
    return {
      id: `${prefix}-m${index + 1}`,
      category: 'vocab-meaning',
      prompt: `${fr} =`,
      options: [en, d1, d2],
      answer: 0,
      explanation: en,
    }
  })

  const focusDrills: LessonExercise[] = theme.focus.slice(0, 8).map((line, index) => {
    const [wrongA, wrongB] = wrongFrenchLines(theme, index)
    const cleaned = line.replace(/^Je pratique\s*:\s*/i, 'Je dis ')
    return {
      id: `${prefix}-f${index + 1}`,
      category: 'focus-production',
      prompt: 'Choose the correct French line:',
      options: [cleaned, wrongA, wrongB],
      answer: 0,
      explanation: cleaned,
    }
  })

  const left = theme.meanings.slice(0, Math.min(4, theme.meanings.length)).map(([fr]) => fr)
  const right = theme.meanings.slice(0, Math.min(4, theme.meanings.length)).map(([, en]) => en)
  const matchExercise: LessonExercise = {
    id: `${prefix}-match`,
    type: 'match',
    category: 'match-pairs',
    prompt: 'Match French ↔ English',
    explanation: 'Meanings from Words to learn first',
    left,
    right,
    pairs: left.map((_, index) => [index, index] as [number, number]),
  }

  const clozeSource = (theme.focus[0] ?? 'Je dis bonjour.').replace(/^Je pratique\s*:\s*/i, 'Je dis ')
  const firstWord = clozeSource.split(/\s+/)[0]?.replace(/[.,!?]/g, '') || 'Je'
  const orderWords = clozeSource.replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean)

  const cloze: LessonExercise = {
    id: `${prefix}-cloze1`,
    type: 'cloze',
    category: 'cloze-production',
    prompt: 'Type the missing word.',
    text: clozeSource.includes(' ') ? clozeSource.replace(/\S+/, '___') : `___ ${clozeSource}`,
    answers: [firstWord],
    explanation: clozeSource,
  }

  const order: LessonExercise = {
    id: `${prefix}-order1`,
    type: 'order',
    category: 'word-order',
    prompt: 'Put the words in order.',
    explanation: clozeSource,
    words: orderWords,
    answer: orderWords,
  }

  const trueFalse: LessonExercise[] = [0, 1, 2].map((index) => {
    const [fr, en] = theme.meanings[index % Math.max(1, theme.meanings.length)] ?? ['bonjour', 'hello']
    return {
      id: `${prefix}-tf${index + 1}`,
      type: 'true-false' as const,
      category: 'true-false',
      prompt: 'True or false',
      statement: `“${fr}” means “${en}”.`,
      answer: true,
      explanation: 'From the meanings list',
    }
  })

  const grammarCore: LessonExercise[] = [
    {
      id: `${prefix}-g1`,
      category: theme.ruleSlugs[0] ?? 'grammar-core',
      prompt: 'Choose the correct French line for this lesson:',
      options: [
        (theme.focus[0] ?? 'Je dis bonjour.').replace(/^Je pratique\s*:\s*/i, 'Je dis '),
        ...wrongFrenchLines(theme, 0),
      ],
      answer: 0,
      explanation: theme.focus[0] ?? 'Focus line',
    },
    {
      id: `${prefix}-reg1`,
      category: 'register',
      prompt: 'With a stranger at a desk, you usually start with:',
      options: ['Bonjour', 'Hé', 'Yo'],
      answer: 0,
      explanation: 'Use a clear polite greeting with strangers.',
    },
  ]

  const combined = [
    ...fromTheme,
    ...meaningDrills,
    ...focusDrills,
    matchExercise,
    ...trueFalse,
    ...grammarCore,
    cloze,
    order,
  ]

  let n = 0
  while (combined.length < 22 && theme.meanings.length > 0) {
    const meaning = theme.meanings[n % theme.meanings.length]
    const [d1, d2] = meaningDistractors(theme.meanings, meaning[1], n + 3)
    combined.push({
      id: `${prefix}-x${n + 1}`,
      category: 'vocab-meaning',
      prompt: `What does “${meaning[0]}” mean?`,
      options: [meaning[1], d1, d2],
      answer: 0,
      explanation: meaning[1],
    })
    n += 1
    if (n > 40) break
  }

  return combined.slice(0, 40)
}

export function buildCraftLesson(theme: DeepTheme, vocabulary: VocabularyWord[]): LessonContent {
  const prefix = `p${theme.id.slice(-4)}`
  const readingFr = buildCraftReadingFr(theme)
  const dialogue = buildCraftDialogue(theme)
  const seed = hashId(theme.id)
  const place = pick(PLACES, seed, 3)
  const [a, b] = pick(NAME_PAIRS, seed, 1)

  return {
    brief: buildCraftBrief(theme),
    reading: readingParagraphs(prefix, readingFr, vocabulary),
    conversation: {
      title: `${a} et ${b} à ${place}`,
      setting: `Conversation naturelle à ${place}, avec le vocabulaire de la leçon.`,
      lines: dialogue.map((line, index) =>
        conversationLine(line.speaker, line.text, `${prefix}-l${index}`, vocabulary),
      ),
    },
    exercises: buildCraftExercises(theme, prefix),
  }
}
