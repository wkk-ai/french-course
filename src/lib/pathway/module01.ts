/** Grand Pathway Module 01 — Les Fondamentaux (5 units × A/B/C/D = 20 sub-chapters). */

export const MODULE01_ID = '11111111-0000-0000-0000-000000000001'

export const MODULE01_META = {
  title: 'Les Fondamentaux',
  description:
    'Grand Pathway M01 · 5 units × Learn/Apply/Integrate/Prove. Identity, numbers, café, family, sounds — A1.1 foundation.',
  cefr_level: 'A1',
  order_index: 1,
} as const

export type SubChapterRole = 'A' | 'B' | 'C' | 'D'

export type Module01SubChapter = {
  id: string
  orderIndex: number
  unitIndex: number
  unitTitle: string
  unitGrammar: string
  role: SubChapterRole
  /** Learn / Apply / Integrate / Prove */
  roleLabel: string
  title: string
  description: string
}

const ROLE_LABEL: Record<SubChapterRole, string> = {
  A: 'Learn',
  B: 'Apply',
  C: 'Integrate',
  D: 'Prove',
}

function sub(
  idSuffix: string,
  orderIndex: number,
  unitIndex: number,
  unitTitle: string,
  unitGrammar: string,
  role: SubChapterRole,
  title: string,
  description: string,
): Module01SubChapter {
  return {
    id: `22222222-0000-0000-0000-00000000${idSuffix}`,
    orderIndex,
    unitIndex,
    unitTitle,
    unitGrammar,
    role,
    roleLabel: ROLE_LABEL[role],
    title,
    description,
  }
}

/** Pathway order. U1–U4 · A reuse shipped lesson IDs (…0101–…0104). Prove = …01Ud. */
export const MODULE01_SUBCHAPTERS: Module01SubChapter[] = [
  // Unit 1 — Bonjour
  sub('0101', 1, 1, "Bonjour, je m'appelle…", "Subject pronouns; être; c'est vs il/elle est", 'A', 'First meetings', 'Introduce yourself; greetings; tu/vous'),
  sub('0111', 2, 1, "Bonjour, je m'appelle…", "Subject pronouns; être; c'est vs il/elle est", 'B', 'Nationality & origin', 'Nationality adjectives; habiter; countries'),
  sub('0112', 3, 1, "Bonjour, je m'appelle…", "Subject pronouns; être; c'est vs il/elle est", 'C', 'Checkpoint: trois présentations', 'Mixed practice — three introduction scenes'),
  sub('011d', 4, 1, "Bonjour, je m'appelle…", "Subject pronouns; être; c'est vs il/elle est", 'D', 'Prove: introduce yourself cold', 'Timed gate — introduce yourself with no hints'),

  // Unit 2 — Numbers
  sub('0102', 5, 2, 'Les chiffres et le calendrier', 'Numbers; days; avoir (age); time adverbs', 'A', 'Age & dates', 'Numbers, days, age with avoir'),
  sub('0121', 6, 2, 'Les chiffres et le calendrier', 'Numbers; days; avoir (age); time adverbs', 'B', 'Planning the week', "Schedules; aujourd'hui / demain / hier"),
  sub('0122', 7, 2, 'Les chiffres et le calendrier', 'Numbers; days; avoir (age); time adverbs', 'C', 'Checkpoint: un agenda', 'Mixed practice — a full week agenda'),
  sub('012d', 8, 2, 'Les chiffres et le calendrier', 'Numbers; days; avoir (age); time adverbs', 'D', 'Prove: dates & age speed', 'Timed gate — dates and age'),

  // Unit 3 — Café
  sub('0103', 9, 3, 'Au café', 'prendre/vouloir/aimer/payer; articles & partitives', 'A', 'Ordering', 'Order drinks and food; partitives'),
  sub('0131', 10, 3, 'Au café', 'prendre/vouloir/aimer/payer; articles & partitives', 'B', 'Bill & politeness', "L'addition; s'il vous plaît; café verbs"),
  sub('0132', 11, 3, 'Au café', 'prendre/vouloir/aimer/payer; articles & partitives', 'C', 'Checkpoint: une terrasse', 'Mixed practice — terrace scene'),
  sub('013d', 12, 3, 'Au café', 'prendre/vouloir/aimer/payer; articles & partitives', 'D', 'Prove: order + pay', 'Timed gate — order and pay'),

  // Unit 4 — Family
  sub('0104', 13, 4, 'Ma famille', 'Possessives; kinship; avoir + people', 'A', 'Close family', 'mon/ma/mes; parents, siblings'),
  sub('0141', 14, 4, 'Ma famille', 'Possessives; kinship; avoir + people', 'B', 'Descriptions with être', 'Family descriptions; agreement'),
  sub('0142', 15, 4, 'Ma famille', 'Possessives; kinship; avoir + people', 'C', 'Checkpoint: arbre généalogique', 'Mixed practice — family tree'),
  sub('014d', 16, 4, 'Ma famille', 'Possessives; kinship; avoir + people', 'D', 'Prove: family paragraph', 'Timed gate — family paragraph'),

  // Unit 5 — Sounds
  sub('0151', 17, 5, 'Sons & alphabet', 'Phonetics; liaison preview; spelling', 'A', 'Alphabet & accents', 'French alphabet; acute, grave, circumflex'),
  sub('0152', 18, 5, 'Sons & alphabet', 'Phonetics; liaison preview; spelling', 'B', 'Silent letters', 'Final consonants; liaison awareness'),
  sub('0153', 19, 5, 'Sons & alphabet', 'Phonetics; liaison preview; spelling', 'C', 'Checkpoint: noms propres', 'Mixed practice — spelling names aloud'),
  sub('015d', 20, 5, 'Sons & alphabet', 'Phonetics; liaison preview; spelling', 'D', 'Prove: spell & liaise', 'Timed gate — spell and liaison'),
]

export const MODULE01_BY_ID = new Map(MODULE01_SUBCHAPTERS.map((subChapter) => [subChapter.id, subChapter]))

export type PathwayChapter = {
  id: string
  module_id: string
  title: string
  description: string
  order_index: number
  lesson_content: unknown
}

/** Rebuild Module 01 chapters from the pathway map; keep DB lesson_content when present. */
export function mergeModule01Chapters<C extends PathwayChapter>(chapters: C[]): C[] {
  const byId = new Map(chapters.map((chapter) => [chapter.id, chapter]))
  const other = chapters.filter((chapter) => chapter.module_id !== MODULE01_ID)
  const rebuilt = MODULE01_SUBCHAPTERS.map((subChapter) => {
    const existing = byId.get(subChapter.id)
    return {
      ...(existing ?? {}),
      id: subChapter.id,
      module_id: MODULE01_ID,
      title: subChapter.title,
      description: subChapter.description,
      order_index: subChapter.orderIndex,
      lesson_content: existing?.lesson_content ?? {},
    } as C
  })
  return [...rebuilt, ...other]
}

export function applyModule01Meta<M extends { id: string; title: string; description: string; cefr_level: string; order_index: number }>(
  modules: M[],
): M[] {
  return modules.map((module) =>
    module.id === MODULE01_ID
      ? {
          ...module,
          title: MODULE01_META.title,
          description: MODULE01_META.description,
          cefr_level: MODULE01_META.cefr_level,
          order_index: MODULE01_META.order_index,
        }
      : module,
  )
}

export function unitsForModule01() {
  const map = new Map<number, { unitIndex: number; unitTitle: string; unitGrammar: string; chapters: Module01SubChapter[] }>()
  for (const subChapter of MODULE01_SUBCHAPTERS) {
    let unit = map.get(subChapter.unitIndex)
    if (!unit) {
      unit = {
        unitIndex: subChapter.unitIndex,
        unitTitle: subChapter.unitTitle,
        unitGrammar: subChapter.unitGrammar,
        chapters: [],
      }
      map.set(subChapter.unitIndex, unit)
    }
    unit.chapters.push(subChapter)
  }
  return [...map.values()].sort((a, b) => a.unitIndex - b.unitIndex)
}
