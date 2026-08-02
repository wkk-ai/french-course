/**
 * Hand-style lesson craft: narrative scenes + natural dialogue from theme lemmas.
 * Goal: feel like Module-1 Learn A (people, place, reason to talk) — not vocab quiz chat.
 */
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

type World = { seed: number; a: string; b: string; place: string }

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
  ['Pierre', 'Alice'],
  ['Maxime', 'Inès'],
  ['Alexandre', 'Julie'],
  ['Romain', 'Laura'],
  ['Gabriel', 'Sarah'],
  ['Mathieu', 'Élise'],
  ['Arthur', 'Louise'],
  ['Victor', 'Clara'],
  ['Raphaël', 'Zoé'],
  ['Nathan', 'Lina'],
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
  'Montpellier',
  'Grenoble',
  'Dijon',
  'Angers',
  'Reims',
  'Tours',
  'Orléans',
  'Caen',
  'Rouen',
  'Amiens',
]

const SCENE_DETAILS = [
  'près de la gare',
  'devant le café',
  'après le cours',
  'en fin de matinée',
  'au soleil',
  'avant le déjeuner',
  'sur la grande place',
  'près du métro',
  'devant la bibliothèque',
  'au coin de la rue',
  'après le travail',
  'vers seize heures',
  'devant la mairie',
  'près du marché',
  'devant le cinéma',
  'près de l\'école',
  'dans la rue',
  'devant le magasin',
  'après le café',
  'avant le soir',
]

type Domain =
  | 'greeting'
  | 'home'
  | 'cafe'
  | 'city'
  | 'family'
  | 'health'
  | 'school'
  | 'work'
  | 'past'
  | 'future'
  | 'register'
  | 'food'
  | 'travel'
  | 'generic'

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt) % arr.length]
}

export function worldForTheme(theme: { id: string }): World {
  const seed = hashId(theme.id)
  const [a, b] = pick(NAME_PAIRS, seed, 1)
  const place = pick(PLACES, seed, 3)
  return { seed, a, b, place }
}

export function cleanGrammar(grammar: string): string {
  return grammar
    .replace(/\s*[·•|]\s*Prove gate[^.]*\.?/gi, '')
    .replace(/Prove gate\s*\([^)]*\)/gi, '')
    .replace(/Fail\s*→\s*remediate[^.]*\.?/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function looksFrenchLemma(fr: string): boolean {
  const raw = fr.replace(/[()]/g, '').split('/')[0]?.trim() ?? ''
  if (!raw || raw.length < 2) return false
  if (/\b(Drills|Phase|grammar|Final|Checkpoint|Prove|Global|diploma|texts|Comprehension|radar|Mix |Swap drill)\b/i.test(raw)) {
    return false
  }
  if (/say as one chunk/i.test(raw)) return false
  if (/[àâäéèêëîïôöùûüçœæ]/i.test(raw)) return true
  return /\b(je|tu|il|bonjour|merci|le|la|les|un|une|des|de|à|être|avoir|maison|père|mère|café|oui|non)\b/i.test(raw)
    || /^[a-zàâäéèêëîïôöùûüçœæ'’\s-]{2,40}$/i.test(raw)
}

function cleanMeanings(theme: DeepTheme): Array<[string, string]> {
  return theme.meanings.filter(([fr, en]) => looksFrenchLemma(fr) && en && !/prove chunk|useful phrase/i.test(en))
}

function lemmas(theme: DeepTheme): string[] {
  return cleanMeanings(theme).map(([fr]) => fr.replace(/[()]/g, '').split('/')[0]?.trim() ?? '').filter(Boolean)
}

function L(list: string[], i: number, fallback: string): string {
  if (!list.length) return fallback
  return list[i % list.length]
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

function detectDomain(theme: DeepTheme): Domain {
  // Title/grammar first — lemmas always include bonjour/merci and false-trigger greeting.
  const title = `${theme.title} ${theme.grammar} ${theme.moduleTitle ?? ''} ${theme.unitTitle ?? ''}`.toLowerCase()
  const lemmasBlob = lemmas(theme).join(' ').toLowerCase()
  const blob = `${title} ${lemmasBlob}`

  if (/apartment|appartement|maison|chambre|cuisine|salon|meuble|rooms|furniture|\bhome\b|logement|pièce/.test(title)) {
    return 'home'
  }
  if (/café|cafe|thé|tea|addition|serveur|commander|boisson|drink order/.test(title)) return 'cafe'
  if (/famille|family|père|mère|frère|sœur|parents|cousin|kinship|possessive/.test(title)) return 'family'
  if (/santé|health|médicament|médecin|devoir|pouvoir|il faut|malade|modal/.test(title)) return 'health'
  if (/école|school|cours|étudiant|université|classe|classroom/.test(title)) return 'school'
  if (/travail|work|bureau|emploi|réunion|\bjob\b|pro |office/.test(title)) return 'work'
  if (/passé composé|imparfait|\bpast\b|hier|pc with|avoir\/être/.test(title)) return 'past'
  if (/futur|\bfuture\b|demain|aller \+ infinitive|je vais/.test(title)) return 'future'
  if (/registre|register|soutenu|familier|idiome|tu ou vous|formal/.test(title)) return 'register'
  if (/manger|boire|restaurant|nourriture|\bfood\b|repas|meal/.test(title)) return 'food'
  if (/voyage|travel|train|avion|hôtel|billet|airport|station/.test(title)) return 'travel'
  if (
    /ville|city|places|rue|métro|magasin|direction|il y a|shopping|weather|météo|quartier|institution|mairie|poste|banque/
      .test(title)
  ) {
    return 'city'
  }
  if (
    /bonjour|salut|présente|greeting|enchanté|subject pronouns|introduce yourself|first meeting|politeness/
      .test(title)
  ) {
    return 'greeting'
  }
  // Lemma fallbacks when title is vague (Emotions, Routine, Numbers, …)
  if (/appartement|chambre|cuisine|salon|meuble/.test(lemmasBlob)) return 'home'
  if (/café|serveur|thé|addition/.test(lemmasBlob)) return 'cafe'
  if (/père|mère|frère|sœur|famille/.test(lemmasBlob)) return 'family'
  if (/médecin|médicament|malade|hôpital/.test(lemmasBlob)) return 'health'
  if (/école|étudiant|classe|cours/.test(lemmasBlob)) return 'school'
  if (/bureau|travail|emploi|réunion/.test(lemmasBlob)) return 'work'
  if (/train|avion|hôtel|billet|voyage/.test(lemmasBlob)) return 'travel'
  if (/restaurant|manger|repas|pain|fromage/.test(lemmasBlob)) return 'food'
  if (/métro|magasin|rue|quartier|météo|mairie|poste|banque/.test(lemmasBlob)) return 'city'
  return 'generic'
}

function cleanTraps(theme: DeepTheme): string[] {
  const cleaned = (theme.traps ?? [])
    .map((t) => t.trim())
    .filter((t) => t && !/remediate|Prove is timed|Prove gate|story memory|Fail\s*→|no hints/i.test(t))
  if (cleaned.length >= 2) return cleaned.slice(0, 5)
  return [
    'Do not use a French content word in an example before its English meaning appears above.',
    'Keep polite chunks whole — do not rebuild them from English word order.',
    'Use *vous* with strangers and staff; *tu* only when the relationship allows it.',
  ]
}

function cleanChunks(theme: DeepTheme): Array<[string, string]> {
  const meanings = cleanMeanings(theme)
  const fromTheme = (theme.chunks ?? []).filter(([fr, en]) => en && !/prove chunk|useful phrase/i.test(en) && looksFrenchLemma(fr))
  if (fromTheme.length >= 3) return fromTheme.slice(0, 8)
  return meanings.slice(0, 6)
}

function frenchFocusLines(theme: DeepTheme): string[] {
  const words = lemmas(theme)
  const wrap = (raw: string): string => {
    const line = raw
      .replace(/^Je pratique\s*:\s*/i, '')
      .replace(/^Encore\s*:\s*/i, '')
      .trim()
    if (!line) return ''
    // Bare lemma / short gloss → speak it as a real sentence
    if (line.split(/\s+/).length <= 2 && !/[.!?]$/.test(line) && !/\b(je|tu|il|elle|nous|vous|on|j')\b/i.test(line)) {
      return `Aujourd'hui j'utilise « ${line} ».`
    }
    return line
  }
  const fromTheme = theme.focus
    .map(wrap)
    .filter((line) => looksFrenchLemma(line) || /[àâäéèêëîïôöùûüç]/i.test(line) || /\b(je|tu|il|nous|vous|j')\b/i.test(line))
  if (fromTheme.length >= 2) return fromTheme.slice(0, 8)
  const w0 = L(words, 0, 'bonjour')
  const w1 = L(words, 1, 'merci')
  const w2 = L(words, 2, 'oui')
  return [
    `J'utilise « ${w0} » aujourd'hui.`,
    `Tu comprends « ${w1} » ?`,
    `On dit « ${w0} » ici.`,
    `Moi aussi, j'utilise « ${w2} ».`,
  ]
}

function expandBrief(body: string, theme: DeepTheme, min: number): string {
  if (body.length >= min) return body
  let next = body
  const meanings = cleanMeanings(theme)
  const grammar = cleanGrammar(theme.grammar)
  let i = 0
  while (next.length < min && meanings.length > 0) {
    const [fr, en] = meanings[i % meanings.length]
    next += `\n- Picture a real moment for *${fr}* (${en}). Say one short French sentence aloud.\n`
    if (i % 5 === 4) next += `\nKeep listening for: ${grammar}\n`
    i += 1
    if (i > 120) break
  }
  return next
}

export function buildCraftBrief(theme: DeepTheme): NonNullable<LessonContent['brief']> {
  const role = roleOf(theme)
  const grammar = cleanGrammar(theme.grammar)
  const meanings = cleanMeanings(theme)
  const traps = cleanTraps(theme)
  const chunks = cleanChunks(theme)
  const world = worldForTheme(theme)
  const domain = detectDomain(theme)
  const mid = Math.ceil(Math.max(1, meanings.length) / 2)
  const groupA = meanings.slice(0, mid)
  const groupB = meanings.slice(mid)
  const trio = theme.registerTrio ?? ['Bonjour, comment allez-vous ?', 'Salut, ça va ?', 'Hé, ça va ?']

  const purpose =
    domain === 'home'
      ? `name rooms and say where you live`
      : domain === 'cafe'
        ? `order politely and talk about drinks`
        : domain === 'family'
          ? `name family members and say who is whose`
          : domain === 'greeting'
            ? `meet people and use the main polite words`
            : domain === 'health'
              ? `say what you must / can / need for health`
              : `use this pattern in real speech: ${grammar}`

  const proveNote =
    role === 'D'
      ? `\n\n**What you must show**\nYou will answer mixed drills without hints. Aim for a solid score. If you miss it, reopen the practice and review chapters in this unit, then try again.\n`
      : ''

  let body =
    `What this lesson is for: ${purpose}.` +
    (theme.moduleTitle ? ` You are in *${theme.moduleTitle}*.` : '') +
    (theme.unitTitle ? ` Unit: *${theme.unitTitle}*.` : '') +
    `\n\n` +
    `In the reading and dialogue, watch ${world.a} and ${world.b} in ${world.place} — same world, same people.\n\n` +
    `**1. Words to learn first (meanings)**\n` +
    `Before any grammar example, learn these with English meanings. Do not skip this list.\n\n` +
    groupA.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n') +
    `\n\n` +
    (groupB.length ? groupB.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n') + `\n\n` : '') +
    `**2. Why these meanings matter**\n` +
    `If a meaning is empty sound, later sentences feel random. Say each French form aloud, then the English, then one short sentence of your own.\n\n` +
    `**3. Grammar pattern (only after meanings)**\n` +
    `${grammar}\n\n` +
    `Lines to produce once meanings are clear:\n` +
    frenchFocusLines(theme)
      .slice(0, 6)
      .map((line) => `- ${line}`)
      .join('\n') +
    `\n\n` +
    `**4. Traps**\n` +
    traps.map((t) => `- ${t}`).join('\n') +
    `\n\n` +
    `**5. Chunks (learn as wholes)**\n` +
    chunks.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n') +
    `\n\n` +
    `**6. Register — same idea, three tones**\n` +
    `In ${world.place}, with a stranger or staff, prefer *vous*. With a friend like ${world.b}, *tu* is fine once invited.\n` +
    `- More formal: *${trio[0]}*\n` +
    `- Everyday: *${trio[1]}*\n` +
    `- Very casual (recognition only early on): *${trio[2]}*\n` +
    proveNote

  for (const section of theme.theorySections ?? []) {
    if (/Prove rules|remediate|Fail\s*→|no hints|Hand-crafted|Enqueue|Practice order/i.test(`${section.heading} ${section.body}`)) {
      continue
    }
    body += `\n**${section.heading}**\n${section.body}\n`
  }

  // Numbered depth sections toward hand brief feel
  body += `\n**7. Build-up order**\n1. Meanings first.\n2. Hear the pattern in the ${world.place} scene.\n3. Copy ${world.a}/${world.b} lines, then change the subject.\n4. Say three new sentences without looking.\n`
  body += `\n**8. What to practice**\nUse today's words in short true sentences about your own life. Grammar without meanings is empty pattern-matching — this lesson refuses that.\n`

  body = expandBrief(body, theme, briefMinChars(role) + 200)

  const titleBase = theme.title.replace(/^Prove:\s*/i, '').replace(/^Checkpoint:\s*/i, '')
  return {
    title: role === 'D' ? `Show what you know — ${titleBase}` : titleBase,
    body,
    ruleSlugs: theme.ruleSlugs,
  }
}

function buildReading(theme: DeepTheme, world: World): string[] {
  const { a, b, place, seed } = world
  const w = lemmas(theme)
  const w0 = L(w, 0, 'bonjour')
  const w1 = L(w, 1, 'merci')
  const w2 = L(w, 2, 'oui')
  const w3 = L(w, 3, 'non')
  const w4 = L(w, 4, 'aujourd\'hui')
  const w5 = L(w, 5, 'ville')
  const domain = detectDomain(theme)
  const extra = w.slice(0, 8).join(', ')
  const focus = frenchFocusLines(theme)

  const banks: Record<Domain, string[][]> = {
    greeting: [
      [
        `Bonjour ! Je m'appelle ${a} et j'habite à ${place}. Je suis content d'être ici. Mon amie ${b} habite aussi près de ${place}.`,
        `${a} dit bonjour, puis remercie les gens poliment. ${b} répond : « Salut ! Ça va ? » Ils s'arrêtent dans la rue.`,
        `En France, la politesse compte. On dit bonjour en entrant. On dit au revoir et à bientôt en partant.`,
        `${a} présente ${b} : « Voici ${b}. » ${b} dit : « Enchantée. » Ils parlent un peu de la ville.`,
        `${b} demande : « Tu es français ? » ${a} répond clairement. Puis ils utilisent aussi « ${w0} » et « ${w1} ».`,
        `Plus tard, ${a} écrit une petite présentation. ${b} lit à voix haute. Les mots du jour restent : ${extra}.`,
        `Avant de partir, ${a} dit merci. ${b} dit à bientôt. Ils se disent aussi au revoir à ${place}.`,
        `${a} et ${b} sont contents. Une bonne première rencontre commence toujours par des mots simples et vrais.`,
        `Le lendemain, ${a} revoit ${b} près de la gare. Ils répètent bonjour, merci, s'il vous plaît.`,
        `Pour finir, ${a} dit : « À demain à ${place}. » ${b} sourit : « Oui. À demain. »`,
      ],
    ],
    home: [
      [
        `${a} habite dans un appartement à ${place}. Il y a une chambre, une cuisine et un salon. ${b} vient voir l'appartement ce matin.`,
        `${a} ouvre la porte : « Entre ! » ${b} regarde la cuisine. « C'est joli, » dit-elle. Ils parlent de la maison.`,
        `Dans la chambre, ${a} montre une table et une chaise. ${b} demande : « Tu as aussi une salle de bain ? » ${a} dit oui.`,
        `Ils utilisent les mots du jour : ${extra}. ${a} dit clairement « ${w0} » et « ${w1} ».`,
        `${b} s'assoit dans le salon. ${a} apporte de l'eau. Ils restent un moment sans stress.`,
        `Plus tard, ${a} explique : « J'habite ici depuis un an. » ${b} écoute et répète la phrase.`,
        `Avant de partir, ${b} dit merci. ${a} dit à bientôt. L'appartement de ${place} est simple et calme.`,
        `${a} écrit trois phrases sur sa maison. ${b} lit : chambre, cuisine, salon. C'est clair.`,
        `Le soir, ${a} range la table. ${b} appelle : « Tu es à la maison ? » ${a} répond : « Oui. »`,
        `Fin de journée à ${place} : au revoir, à demain, et une maison qui commence à être familière.`,
      ],
    ],
    cafe: [
      [
        `${a} et ${b} entrent dans un café à ${place}. ${a} dit bonjour au serveur. ${b} sourit.`,
        `${a} commande : « Je prends un café, s'il vous plaît. » ${b} dit : « Je voudrais un thé. »`,
        `Le serveur apporte les boissons. ${a} dit merci. ${b} demande l'addition plus tard.`,
        `Ils parlent calmement. Les mots utiles aujourd'hui : ${extra}.`,
        `${b} dit : « ${w0} ». ${a} répond avec « ${w1} ». La conversation reste naturelle.`,
        `Un autre client entre. Tout le monde dit bonjour. La politesse compte au café.`,
        `${a} paie. « Ça fait sept euros. » ${b} dit : « Merci. Au revoir ! »`,
        `Dehors, à ${place}, ils répètent les phrases de commande sans regarder.`,
        `${a} écrit : Je prends un café. ${b} écrit : L'addition, s'il vous plaît.`,
        `Ils sont contents. Un café simple, des mots clairs, et une bonne pratique à ${place}.`,
      ],
    ],
    city: [
      [
        `${a} et ${b} marchent dans ${place}. Il y a une rue, un magasin et une grande place.`,
        `${b} demande : « Où est la gare ? » ${a} répond : « Tout droit, puis à gauche. »`,
        `Ils voient un café et un marché. ${a} dit : « Il y a beaucoup de monde. »`,
        `Les mots du jour apparaissent dans la ville : ${extra}.`,
        `${a} utilise « ${w0} ». ${b} utilise « ${w1} ». Ils avancent sans stress.`,
        `Une personne demande le chemin. ${a} répond avec *vous* et s'il vous plaît.`,
        `${b} dit : « On va au magasin ? » ${a} dit oui. Ils entrent et disent bonjour.`,
        `Plus tard, ils restent assis. ${a} décrit ${place}. ${b} écoute et pose une question.`,
        `Avant de partir : merci, à bientôt, au revoir.`,
        `La ville de ${place} est un peu plus claire — rue après rue, mot après mot.`,
      ],
    ],
    family: [
      [
        `La famille de ${a} habite près de ${place}. Son père et sa mère sont là. ${b} pose des questions.`,
        `${a} dit : « J'ai un frère et une sœur. » ${b} demande : « Comment s'appelle ta sœur ? »`,
        `${a} répond avec mon, ma, mes. Les mots du jour : ${extra}.`,
        `${b} parle aussi de sa famille. Elle a des parents à ${place}.`,
        `Ils utilisent « ${w0} » et « ${w1} » dans des phrases vraies, pas mécaniques.`,
        `Le dimanche, la famille se retrouve. ${a} raconte. ${b} écoute.`,
        `${a} écrit : Mon père est… Ma mère est… ${b} lit à voix haute.`,
        `Ils parlent de deux familles sans jugement — juste pour pratiquer.`,
        `Avant de partir : merci, à bientôt.`,
        `Parler de la famille à ${place} est plus simple phrase après phrase.`,
      ],
    ],
    health: [
      [
        `${a} ne se sent pas bien à ${place}. ${b} dit : « Tu dois te reposer. »`,
        `${a} répond : « Je peux marcher un peu. » ${b} insiste : « Il faut boire de l'eau. »`,
        `Ils parlent de santé avec soin. Mots utiles : ${extra}.`,
        `${b} utilise « ${w0} ». ${a} utilise « ${w1} ».`,
        `Un pharmacien les aide. Ils disent bonjour et s'il vous plaît.`,
        `${a} comprend le conseil. ${b} répète la phrase importante.`,
        `Plus tard, ${a} se sent mieux. ${b} dit : « Tu peux sortir demain. »`,
        `Ils écrivent deux phrases avec je dois / je peux / il faut.`,
        `Merci, à bientôt, au revoir — politesse même quand on est fatigué.`,
        `À ${place}, les mots de santé servent dans la vraie vie.`,
      ],
    ],
    school: [
      [
        `${a} et ${b} sont à l'école près de ${place}. Le cours commence.`,
        `${a} dit : « J'étudie le français. » ${b} dit : « Moi aussi. »`,
        `Le professeur explique. Les étudiants écoutent. Mots du jour : ${extra}.`,
        `${a} utilise « ${w0} » dans une phrase. ${b} répond avec « ${w1} ».`,
        `Après le cours, ils révisent ensemble sans stress.`,
        `${b} pose une question. ${a} donne un exemple clair.`,
        `Ils écrivent trois phrases sur le cahier.`,
        `Dans la rue, ils répètent encore une fois.`,
        `À bientôt à ${place}. Le français avance un peu chaque jour.`,
        `Fin de journée d'école : merci au professeur, au revoir aux amis.`,
      ],
    ],
    work: [
      [
        `${a} travaille à ${place}. ${b} arrive pour une réunion.`,
        `${a} dit bonjour. ${b} dit : « On parle du travail ? »`,
        `Ils utilisent les mots du jour : ${extra}.`,
        `${a} explique avec « ${w0} ». ${b} note « ${w1} ».`,
        `La réunion reste simple et polie. *Vous* avec un client, *tu* entre collègues amis.`,
        `${b} demande un conseil. ${a} répond clairement.`,
        `Après, ils boivent un café et répètent deux phrases.`,
        `${a} écrit un court message. ${b} le lit.`,
        `Merci, à bientôt, bonne journée.`,
        `Le travail à ${place} est un lieu pour parler vrai.`,
      ],
    ],
    past: [
      [
        `Hier, ${a} et ${b} étaient à ${place}. Ils ont parlé beaucoup.`,
        `${a} dit : « J'ai mangé. » ${b} dit : « J'ai fini. »`,
        `Ils racontent la journée avec le passé. Mots utiles : ${extra}.`,
        `${a} utilise « ${w0} ». ${b} utilise « ${w1} ».`,
        `Ce matin, ils parlent d'hier et aujourd'hui.`,
        `${b} demande : « Qu'est-ce que tu as fait ? » ${a} répond avec une phrase complète.`,
        `Ils écrivent trois phrases au passé.`,
        `Dans la rue de ${place}, ils répètent sans livre.`,
        `Merci, à bientôt — et une histoire claire d'hier.`,
        `Le passé est moins difficile phrase après phrase.`,
      ],
    ],
    future: [
      [
        `Demain, ${a} et ${b} vont à ${place}. Ils préparent le plan.`,
        `${a} dit : « Je vais partir tôt. » ${b} dit : « Je vais venir aussi. »`,
        `Ils parlent du futur avec des mots simples : ${extra}.`,
        `${a} utilise « ${w0} ». ${b} utilise « ${w1} ».`,
        `${b} demande : « Qu'est-ce que tu vas faire ? » ${a} répond clairement.`,
        `Ils écrivent trois phrases avec aller + verbe.`,
        `Le soir, ils répètent le plan une dernière fois.`,
        `À ${place}, demain est concret.`,
        `Merci, à bientôt, à demain.`,
        `Le futur se dit avec des phrases courtes et vraies.`,
      ],
    ],
    register: [
      [
        `${a} et ${b} sont à ${place}. Ils utilisent *tu* et *vous*.`,
        `Avec un serveur, ${a} dit : « Bonjour, vous allez bien ? »`,
        `Entre amis, ${b} dit : « Salut, ça va ? »`,
        `Les tons du jour : ${extra}.`,
        `${a} pratique « ${w0} ». ${b} pratique « ${w1} ».`,
        `Ils jouent deux scènes : formel, puis familier.`,
        `${b} dit : « Attention au registre. » ${a} corrige une phrase.`,
        `Ils écrivent la même idée en trois tons.`,
        `Merci, à bientôt — et le bon ton pour la bonne personne.`,
        `À ${place}, le registre est un choix, pas une surprise.`,
      ],
    ],
    food: [
      [
        `${a} et ${b} mangent à ${place}. Le repas est simple.`,
        `${a} dit : « J'aime le pain. » ${b} dit : « Je prends de l'eau. »`,
        `Ils parlent de nourriture. Mots du jour : ${extra}.`,
        `${a} utilise « ${w0} ». ${b} utilise « ${w1} ».`,
        `Le serveur apporte l'addition. Ils disent merci.`,
        `Après le repas, ils marchent un peu.`,
        `Ils écrivent trois phrases sur ce qu'ils mangent.`,
        `À ${place}, parler de nourriture est facile et utile.`,
        `À bientôt, au revoir.`,
        `Un bon repas, des mots clairs, et une vraie conversation.`,
      ],
    ],
    travel: [
      [
        `${a} et ${b} voyagent vers ${place}. Ils ont un billet.`,
        `${a} dit : « Le train part bientôt. » ${b} dit : « On y va. »`,
        `À la gare, ils disent s'il vous plaît et merci.`,
        `Mots utiles pour le voyage : ${extra}.`,
        `${a} utilise « ${w0} ». ${b} utilise « ${w1} ».`,
        `Dans le train, ils parlent du voyage.`,
        `Ils écrivent : Je vais à ${place}.`,
        `À l'arrivée : bonjour à la ville, à bientôt aux amis.`,
        `Le voyage est une leçon vivante.`,
        `Merci, au revoir — et ${place} devant eux.`,
      ],
    ],
    generic: [
      [
        `${whenCap(seed)}, ${a} retrouve ${b} à ${place}. Ils ont le temps de parler bien — pas seulement de répéter une liste.`,
        `${a} commence : « ${focus[0] ?? `Aujourd'hui j'utilise « ${w0} ».`} » ${b} écoute, puis répond.`,
        `${b} dit : « ${focus[1] ?? `Moi, je comprends « ${w1} ».`} » Ils restent sur le même sujet.`,
        `Le sujet du jour arrive dans la conversation. Mots utiles : ${extra}.`,
        `${a} change un peu la phrase : je, tu, il. Le sens reste clair.`,
        `Une personne arrive. ${a} passe à *vous* un moment. Puis ils reviennent à *tu*.`,
        `${b} pose une vraie question. ${a} répond avec « ${w2} » et « ${w3} ».`,
        `Ils marchent dans ${place}. ${a} ajoute « ${w4} ». ${b} ajoute « ${w5} ».`,
        `Avant de partir : merci, à bientôt, au revoir.`,
        `${a} et ${b} sont contents. À ${place}, le français sert à parler de la vie.`,
      ],
    ],
  }

  const variants = banks[domain]
  return variants[seed % variants.length]
}

function whenCap(seed: number): string {
  return pick(
    ['Ce matin', 'Cet après-midi', 'Ce soir', 'Aujourd\'hui', 'Vers midi', 'En fin de journée'],
    seed,
    11,
  )
}

export function buildCraftReadingFr(theme: DeepTheme): string[] {
  return buildReading(theme, worldForTheme(theme))
}

export function buildCraftDialogue(theme: DeepTheme): Array<{ speaker: string; text: string }> {
  const world = worldForTheme(theme)
  const { a, b, place, seed } = world
  const w = lemmas(theme)
  const w0 = L(w, 0, 'bonjour')
  const w1 = L(w, 1, 'merci')
  const w2 = L(w, 2, 'oui')
  const domain = detectDomain(theme)
  const focus = frenchFocusLines(theme)
  const f0 = focus[0] ?? `Aujourd'hui j'utilise « ${w0} ».`
  const f1 = focus[1] ?? `Tu comprends « ${w1} » ?`
  const f2 = focus[2] ?? `On dit « ${w0} » ici.`
  const f3 = focus[3] ?? `Moi aussi, j'utilise « ${w2} ».`

  const scripts: Record<Domain, Array<{ speaker: string; text: string }>> = {
    greeting: [
      { speaker: a, text: `Bonjour ! Je m'appelle ${a}. Enchanté.` },
      { speaker: b, text: `Salut ${a} ! Moi, c'est ${b}. Enchantée.` },
      { speaker: a, text: `Tu habites à ${place} ?` },
      { speaker: b, text: `Oui. Et toi ?` },
      { speaker: a, text: `Moi aussi. Comment ça va ?` },
      { speaker: b, text: `Ça va bien, merci. Et toi ?` },
      { speaker: a, text: `Ça va. Tu es française ?` },
      { speaker: b, text: `Oui. Tu es français ?` },
      { speaker: a, text: `Oui. On se dit à bientôt ?` },
      { speaker: b, text: `Oui. À bientôt à ${place} !` },
      { speaker: a, text: `Au revoir ${b} !` },
      { speaker: b, text: `Au revoir ${a} !` },
      { speaker: a, text: `Bonjour, comment allez-vous ?` },
      { speaker: b, text: `Très bien, merci. Et vous ?` },
    ],
    home: [
      { speaker: b, text: `C'est ton appartement à ${place} ?` },
      { speaker: a, text: `Oui. Entre, s'il te plaît.` },
      { speaker: b, text: `Il y a combien de pièces ?` },
      { speaker: a, text: `Une chambre, une cuisine et un salon.` },
      { speaker: b, text: `C'est joli. Tu as une table ?` },
      { speaker: a, text: `Oui, dans la cuisine.` },
      { speaker: b, text: `Et la salle de bain ?` },
      { speaker: a, text: `Oui, bien sûr.` },
      { speaker: b, text: `Tu habites ici depuis un an ?` },
      { speaker: a, text: `Oui. J'aime cette maison.` },
      { speaker: b, text: `Merci pour la visite.` },
      { speaker: a, text: `Avec plaisir. À bientôt !` },
      { speaker: b, text: `Au revoir !` },
      { speaker: a, text: `Au revoir ${b} !` },
    ],
    cafe: [
      { speaker: a, text: `Bonjour !` },
      { speaker: b, text: `Bonjour. On s'assoit ici ?` },
      { speaker: a, text: `Oui. Je prends un café, s'il vous plaît.` },
      { speaker: b, text: `Moi, je voudrais un thé.` },
      { speaker: a, text: `Tu as faim ?` },
      { speaker: b, text: `Un peu. Et toi ?` },
      { speaker: a, text: `Moi non. L'addition, s'il vous plaît.` },
      { speaker: b, text: `Merci. C'était bien.` },
      { speaker: a, text: `On se revoit à ${place} ?` },
      { speaker: b, text: `Oui. À bientôt !` },
      { speaker: a, text: `Au revoir !` },
      { speaker: b, text: `Au revoir ${a} !` },
      { speaker: a, text: `Bonjour, comment allez-vous ?` },
      { speaker: b, text: `Très bien, merci.` },
    ],
    city: [
      { speaker: a, text: `Bonjour ${b} ! Tu connais ${place} ?` },
      { speaker: b, text: `Un peu. Où est la gare ?` },
      { speaker: a, text: `Tout droit, puis à gauche.` },
      { speaker: b, text: `Merci. Il y a un café près d'ici ?` },
      { speaker: a, text: `Oui. On y va ?` },
      { speaker: b, text: `D'accord.` },
      { speaker: a, text: `Attention, beaucoup de monde dans la rue.` },
      { speaker: b, text: `Je vois. On marche lentement.` },
      { speaker: a, text: `Tu veux voir le magasin ?` },
      { speaker: b, text: `Oui. Puis on se dit à bientôt.` },
      { speaker: a, text: `À bientôt à ${place} !` },
      { speaker: b, text: `Au revoir !` },
      { speaker: a, text: `Excusez-moi, s'il vous plaît ?` },
      { speaker: b, text: `Oui ?` },
    ],
    family: [
      { speaker: b, text: `Tu as une grande famille ?` },
      { speaker: a, text: `Non, ma famille est petite.` },
      { speaker: b, text: `Tu as des frères et sœurs ?` },
      { speaker: a, text: `Oui, j'ai un frère et une sœur.` },
      { speaker: b, text: `Comment s'appelle ta sœur ?` },
      { speaker: a, text: `Elle s'appelle Sophie.` },
      { speaker: b, text: `Et tes parents habitent où ?` },
      { speaker: a, text: `Ils habitent près de ${place}.` },
      { speaker: b, text: `Tu as des cousins ?` },
      { speaker: a, text: `Oui. Et toi ?` },
      { speaker: b, text: `Moi aussi. À bientôt !` },
      { speaker: a, text: `À bientôt ${b} !` },
      { speaker: b, text: `Au revoir !` },
      { speaker: a, text: `Au revoir !` },
    ],
    health: [
      { speaker: b, text: `Ça va, ${a} ?` },
      { speaker: a, text: `Pas trop. Je dois me reposer.` },
      { speaker: b, text: `Tu peux marcher ?` },
      { speaker: a, text: `Un peu. Il faut boire de l'eau.` },
      { speaker: b, text: `Tu veux un médicament ?` },
      { speaker: a, text: `Peut-être. Merci.` },
      { speaker: b, text: `On reste à ${place} aujourd'hui.` },
      { speaker: a, text: `Oui. C'est mieux.` },
      { speaker: b, text: `Demain tu peux sortir.` },
      { speaker: a, text: `J'espère. À bientôt.` },
      { speaker: b, text: `À bientôt. Repose-toi.` },
      { speaker: a, text: `Merci ${b}. Au revoir.` },
      { speaker: b, text: `Au revoir !` },
      { speaker: a, text: `Bonjour, s'il vous plaît.` },
    ],
    school: [
      { speaker: a, text: `Le cours commence bientôt.` },
      { speaker: b, text: `Oui. Tu as ton livre ?` },
      { speaker: a, text: `Oui. On étudie à ${place}.` },
      { speaker: b, text: `Tu comprends la leçon ?` },
      { speaker: a, text: `Oui, un peu. Et toi ?` },
      { speaker: b, text: `Moi aussi. On révise ensemble ?` },
      { speaker: a, text: `D'accord. Encore un exemple.` },
      { speaker: b, text: `Très bien. Merci.` },
      { speaker: a, text: `À demain en cours !` },
      { speaker: b, text: `À demain !` },
      { speaker: a, text: `Au revoir ${b} !` },
      { speaker: b, text: `Au revoir ${a} !` },
      { speaker: a, text: `Bonjour, professeur.` },
      { speaker: b, text: `Bonjour. Asseyez-vous.` },
    ],
    work: [
      { speaker: a, text: `Bonjour ${b}. La réunion est à ${place}.` },
      { speaker: b, text: `Bonjour. On commence ?` },
      { speaker: a, text: `Oui. Voici le point du jour.` },
      { speaker: b, text: `Je comprends. Tu as une question ?` },
      { speaker: a, text: `Oui. On peut finir demain ?` },
      { speaker: b, text: `Oui. Merci.` },
      { speaker: a, text: `Parfait. À bientôt au bureau.` },
      { speaker: b, text: `À bientôt !` },
      { speaker: a, text: `Bonne journée.` },
      { speaker: b, text: `Merci. Toi aussi.` },
      { speaker: a, text: `Au revoir.` },
      { speaker: b, text: `Au revoir ${a}.` },
      { speaker: a, text: `Bonjour, vous allez bien ?` },
      { speaker: b, text: `Oui, merci. Et vous ?` },
    ],
    past: [
      { speaker: b, text: `Qu'est-ce que tu as fait hier ?` },
      { speaker: a, text: `J'ai marché à ${place}.` },
      { speaker: b, text: `Tu as vu des amis ?` },
      { speaker: a, text: `Oui. On a parlé beaucoup.` },
      { speaker: b, text: `Tu as mangé où ?` },
      { speaker: a, text: `J'ai mangé près de la gare.` },
      { speaker: b, text: `C'était bien ?` },
      { speaker: a, text: `Oui. Et toi ?` },
      { speaker: b, text: `J'ai fini mon travail.` },
      { speaker: a, text: `Bravo. À bientôt !` },
      { speaker: b, text: `À bientôt ${a}.` },
      { speaker: a, text: `Au revoir !` },
      { speaker: b, text: `Au revoir !` },
      { speaker: a, text: `Hier, c'était une bonne journée.` },
    ],
    future: [
      { speaker: a, text: `Qu'est-ce que tu vas faire demain ?` },
      { speaker: b, text: `Je vais aller à ${place}.` },
      { speaker: a, text: `Tu vas partir tôt ?` },
      { speaker: b, text: `Oui. Et toi ?` },
      { speaker: a, text: `Je vais rester ici.` },
      { speaker: b, text: `On se voit après ?` },
      { speaker: a, text: `Oui. Je vais t'appeler.` },
      { speaker: b, text: `Parfait. À demain.` },
      { speaker: a, text: `À demain ${b} !` },
      { speaker: b, text: `Au revoir !` },
      { speaker: a, text: `Au revoir !` },
      { speaker: b, text: `Bonne soirée.` },
      { speaker: a, text: `Merci. Toi aussi.` },
      { speaker: b, text: `À bientôt à ${place}.` },
    ],
    register: [
      { speaker: a, text: `Bonjour, comment allez-vous ?` },
      { speaker: b, text: `Très bien, merci. Et vous ?` },
      { speaker: a, text: `Maintenant, entre nous : salut, ça va ?` },
      { speaker: b, text: `Ça va ! Tu vois la différence ?` },
      { speaker: a, text: `Oui. *Vous* avec un inconnu.` },
      { speaker: b, text: `Et *tu* avec un ami.` },
      { speaker: a, text: `On répète le ton soutenu ?` },
      { speaker: b, text: `Oui. Bonjour, s'il vous plaît.` },
      { speaker: a, text: `Bien. À bientôt à ${place}.` },
      { speaker: b, text: `À bientôt !` },
      { speaker: a, text: `Au revoir.` },
      { speaker: b, text: `Au revoir ${a}.` },
      { speaker: a, text: `Salut !` },
      { speaker: b, text: `Salut !` },
    ],
    food: [
      { speaker: a, text: `Tu as faim ?` },
      { speaker: b, text: `Oui. On mange à ${place} ?` },
      { speaker: a, text: `D'accord. Je prends du pain.` },
      { speaker: b, text: `Moi, de l'eau et un café.` },
      { speaker: a, text: `C'est bon ?` },
      { speaker: b, text: `Oui. Merci.` },
      { speaker: a, text: `L'addition, s'il vous plaît.` },
      { speaker: b, text: `On se revoit demain ?` },
      { speaker: a, text: `Oui. À bientôt !` },
      { speaker: b, text: `À bientôt ${a}.` },
      { speaker: a, text: `Au revoir !` },
      { speaker: b, text: `Au revoir !` },
      { speaker: a, text: `Bon appétit !` },
      { speaker: b, text: `Merci. Toi aussi.` },
    ],
    travel: [
      { speaker: a, text: `Le train pour ${place} part bientôt.` },
      { speaker: b, text: `Tu as ton billet ?` },
      { speaker: a, text: `Oui. On y va.` },
      { speaker: b, text: `Je suis prête.` },
      { speaker: a, text: `À quelle heure on arrive ?` },
      { speaker: b, text: `Bientôt. Tu veux de l'eau ?` },
      { speaker: a, text: `Oui, merci.` },
      { speaker: b, text: `Voilà ${place}.` },
      { speaker: a, text: `Parfait. À bientôt ici ?` },
      { speaker: b, text: `Oui. À bientôt !` },
      { speaker: a, text: `Au revoir !` },
      { speaker: b, text: `Au revoir ${a}.` },
      { speaker: a, text: `Bon voyage !` },
      { speaker: b, text: `Merci !` },
    ],
    generic: [
      { speaker: a, text: `Bonjour ${b} ! Ça va ?` },
      { speaker: b, text: `Ça va bien, merci. Et toi ?` },
      { speaker: a, text: f0 },
      { speaker: b, text: `Oui. ${f1}` },
      { speaker: a, text: `À ${place}, j'entends aussi « ${w0} ».` },
      { speaker: b, text: `Moi aussi. ${f2}` },
      { speaker: a, text: `Encore une fois : ${f3}` },
      { speaker: b, text: `C'est clair. Merci.` },
      { speaker: a, text: `On se dit à bientôt ?` },
      { speaker: b, text: `Oui. À bientôt à ${place} !` },
      { speaker: a, text: `Au revoir ${b} !` },
      { speaker: b, text: `Au revoir ${a} !` },
      { speaker: a, text: `Bonjour, comment allez-vous ?` },
      { speaker: b, text: `Très bien, merci. Et vous ?` },
    ],
  }

  return uniquifyDialogue(scripts[domain], theme, world)
}

/** Mix theme focus into every dialogue so shared domain shells stay unique. */
function uniquifyDialogue(
  lines: Array<{ speaker: string; text: string }>,
  theme: DeepTheme,
  world: World,
): Array<{ speaker: string; text: string }> {
  const focus = frenchFocusLines(theme)
  const w = lemmas(theme)
  const { a, b, place, seed } = world
  const f0 = focus[0] ?? `Aujourd'hui j'utilise « ${L(w, 0, 'bonjour')} ».`
  const f1 = focus[1] ?? `Tu comprends « ${L(w, 1, 'merci')} » ?`
  const f2 = focus[2] ?? `On dit « ${L(w, 2, 'oui')} » à ${place}.`
  const out = lines.map((line) => ({ ...line }))
  if (out.length < 8) return out
  // Slot theme-specific lines where they won't break greetings/goodbyes
  const mid = 4 + (seed % 3)
  out[mid] = { speaker: a, text: f0 }
  out[Math.min(mid + 1, out.length - 4)] = { speaker: b, text: `Oui. ${f1}` }
  out[Math.min(mid + 2, out.length - 3)] = { speaker: a, text: f2 }
  const detail = pick(SCENE_DETAILS, seed, 17)
  out[2] = {
    speaker: out[2]?.speaker ?? a,
    text: `${out[2]?.text ?? 'Oui.'} On est ${detail}.`.replace(/\.\s*\./g, '.'),
  }
  out[out.length - 3] = {
    speaker: b,
    text: `D'accord. À ${place}, j'entends aussi « ${L(w, seed % Math.max(w.length, 1), 'merci')} ».`,
  }
  // Last unique beat from later lemmas so same-focus themes still diverge
  out[out.length - 4] = {
    speaker: a,
    text: `Et « ${L(w, (seed + 3) % Math.max(w.length, 1), 'oui')} », tu le dis souvent ?`,
  }
  return out
}

function meaningDistractors(meanings: Array<[string, string]>, correctEn: string, index: number): [string, string] {
  const pool = meanings.map(([, en]) => en).filter((en) => en !== correctEn)
  return [pool[index % Math.max(1, pool.length)] ?? 'another meaning', pool[(index + 1) % Math.max(1, pool.length)] ?? 'a different word']
}

function scrubExercise(
  item: { category: string; prompt: string; options: string[]; answer: number },
  theme: DeepTheme,
  index: number,
): LessonExercise | null {
  const blob = [item.prompt, ...item.options].join(' ')
  if (/plot|spoiler|character name|Before grammar|prove chunk|Hand-crafted|only English/i.test(blob)) return null
  if (item.options.some((o) => /^(plot|name|story|Only English|only English)$/i.test(o.trim()))) return null
  return {
    id: `craft-e${index + 1}`,
    category: item.category || theme.ruleSlugs[0] || 'grammar',
    prompt: item.prompt.replace(/^Prove\s*—\s*/i, ''),
    options: item.options,
    answer: item.answer,
    explanation: item.options[item.answer] ?? 'Correct',
  }
}

function dedupe(items: LessonExercise[]): LessonExercise[] {
  const seen = new Set<string>()
  const out: LessonExercise[] = []
  for (const item of items) {
    const key = `${item.prompt}|${(item.options ?? []).join('~')}|${item.type ?? ''}|${'statement' in item ? (item as { statement?: string }).statement : ''}`
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

  const focusDrills: LessonExercise[] = focus.slice(0, 6).map((line, index) => ({
    id: `${prefix}-f${index + 1}`,
    category: 'focus-production',
    prompt: 'Which French line fits this lesson?',
    options: [line, focus[(index + 1) % focus.length] ?? 'Je ne sais pas.', focus[(index + 2) % focus.length] ?? "C'est difficile."],
    answer: 0,
    explanation: line,
  }))

  const left = meanings.slice(0, Math.min(4, meanings.length)).map(([fr]) => fr)
  const right = meanings.slice(0, Math.min(4, meanings.length)).map(([, en]) => en)
  const matchExercise: LessonExercise = {
    id: `${prefix}-match`,
    type: 'match',
    category: 'match-pairs',
    prompt: 'Match French ↔ English',
    explanation: 'From Words to learn first',
    left,
    right,
    pairs: left.map((_, i) => [i, i] as [number, number]),
  }

  const clozeSource = focus[0] ?? `J'habite à Paris.`
  const firstWord = clozeSource.split(/\s+/)[0]?.replace(/[.,!?]/g, '') || 'Je'
  const orderWords = clozeSource.replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean)

  const combined = dedupe([
    ...fromTheme,
    ...meaningDrills,
    ...focusDrills,
    matchExercise,
    {
      id: `${prefix}-cloze1`,
      type: 'cloze',
      category: 'cloze-production',
      prompt: 'Type the missing French word.',
      text: clozeSource.includes(' ') ? clozeSource.replace(/\S+/, '___') : `___ ${clozeSource}`,
      answers: [firstWord],
      explanation: clozeSource,
    },
    {
      id: `${prefix}-order1`,
      type: 'order',
      category: 'word-order',
      prompt: 'Put the words in order.',
      explanation: clozeSource,
      words: orderWords,
      answer: orderWords,
    },
    ...[0, 1, 2].map((index) => {
      const [fr, en] = meanings[index % Math.max(1, meanings.length)] ?? ['bonjour', 'hello']
      const truth = index !== 1
      const fake = meaningDistractors(meanings, en, index + 4)[0]
      return {
        id: `${prefix}-tf${index + 1}`,
        type: 'true-false' as const,
        category: 'true-false',
        prompt: 'Is this meaning correct?',
        statement: truth ? `“${fr}” means “${en}”.` : `“${fr}” means “${fake}”.`,
        answer: truth,
        explanation: truth ? 'From the meanings list' : `Actually “${fr}” means “${en}”.`,
      }
    }),
    {
      id: `${prefix}-g1`,
      category: theme.ruleSlugs[0] ?? 'grammar-core',
      prompt: 'Pick the French line that matches this lesson:',
      options: [focus[0] ?? 'Bonjour.', focus[1] ?? 'Merci.', 'Yo.'],
      answer: 0,
      explanation: focus[0] ?? 'Focus',
    },
    {
      id: `${prefix}-reg1`,
      category: 'register',
      prompt: 'You meet a stranger at a desk. Best first word?',
      options: ['Bonjour', 'Hé', 'Yo'],
      answer: 0,
      explanation: 'Clear polite greeting with strangers.',
    },
  ])

  let n = 0
  while (combined.length < 22 && meanings.length > 0) {
    const meaning = meanings[n % meanings.length]
    const [d1, d2] = meaningDistractors(meanings, meaning[1], n + 7)
    const next: LessonExercise = {
      id: `${prefix}-x${n + 1}`,
      category: 'vocab-meaning',
      prompt: `“${meaning[0]}” in English is…`,
      options: [meaning[1], d1, d2],
      answer: 0,
      explanation: meaning[1],
    }
    const before = combined.length
    combined.push(...dedupe([...combined, next]).slice(before))
    if (combined.length === before) {
      combined.push({ ...next, id: `${prefix}-x${n + 1}b`, prompt: `Choose the meaning of ${meaning[0]}:` })
    }
    n += 1
    if (n > 40) break
  }

  return combined.slice(0, 40)
}

export function buildCraftLesson(theme: DeepTheme, vocabulary: VocabularyWord[]): LessonContent {
  const prefix = `p${theme.id.slice(-4)}`
  const world = worldForTheme(theme)
  const domain = detectDomain(theme)
  const venueHint =
    domain === 'cafe'
      ? 'un café'
      : domain === 'home'
        ? 'un appartement'
        : domain === 'city'
          ? 'la rue'
          : domain === 'school'
            ? "l'école"
            : 'le centre-ville'

  return {
    brief: buildCraftBrief(theme),
    reading: readingParagraphs(prefix, buildCraftReadingFr(theme), vocabulary),
    conversation: {
      title: `${world.a} et ${world.b} à ${world.place}`,
      setting: `${world.a} et ${world.b} se retrouvent près de ${venueHint} à ${world.place}.`,
      lines: buildCraftDialogue(theme).map((line, index) =>
        conversationLine(line.speaker, line.text, `${prefix}-l${index}`, vocabulary),
      ),
    },
    exercises: buildCraftExercises(theme, prefix),
  }
}
