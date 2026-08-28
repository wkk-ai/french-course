import { bulletizeTheory } from '@/lib/pathway/bulletize-theory'

type Role = 'A' | 'B' | 'C' | 'D'

type TeacherTheme = {
  title: string
  grammar?: string
  role?: Role
}

function roleOf(theme: TeacherTheme): Role {
  if (theme.role) return theme.role
  if (/prove/i.test(theme.title)) return 'D'
  if (/checkpoint|integrate/i.test(theme.title)) return 'C'
  if (/apply/i.test(theme.title)) return 'B'
  return 'A'
}

function lemmaSurface(fr: string): string {
  return fr.replace(/[()]/g, '').split('/')[0]?.trim() ?? fr
}

function looksVerb(fr: string): boolean {
  const w = lemmaSurface(fr).toLowerCase()
  return /(er|ir|re)$/.test(w) && w.length > 3 && !/^(le|la|les|une|des)$/.test(w)
}

function jeForm(infinitive: string): string {
  const w = lemmaSurface(infinitive)
  if (w === 'être') return 'je suis'
  if (w === 'avoir') return "j'ai"
  if (w === 'aller') return 'je vais'
  if (w === 'faire') return 'je fais'
  if (w === 'dire') return 'je dis'
  if (w === 'venir') return 'je viens'
  if (w === 'partir') return 'je pars'
  if (w === 'prendre') return 'je prends'
  if (w === 'vouloir') return 'je veux'
  if (w === 'pouvoir') return 'je peux'
  if (w === 'devoir') return 'je dois'
  if (w === 'voir') return 'je vois'
  if (w === 'savoir') return 'je sais'
  if (w === "s'appeler") return "je m'appelle"
  if (w === 'se lever') return 'je me lève'
  if (w.startsWith("s'")) return `je m'${w.slice(2)}`
  if (w.startsWith('se ')) return `je me ${w.slice(3)}`
  if (w.endsWith('er')) {
    const stem = w.slice(0, -2)
    const je = /^[aeiouhâéèê]/i.test(stem) ? `j'${stem}e` : `je ${stem}e`
    return je
  }
  if (w.endsWith('ir')) return `je ${w.slice(0, -2)}is`
  return `je ${w}`
}

function tuForm(infinitive: string): string {
  const je = jeForm(infinitive)
  if (je === 'je suis') return 'tu es'
  if (je === "j'ai") return 'tu as'
  if (je === 'je vais') return 'tu vas'
  if (je === 'je fais') return 'tu fais'
  if (je === 'je dis') return 'tu dis'
  if (je === 'je viens') return 'tu viens'
  if (je === 'je pars') return 'tu pars'
  if (je === 'je prends') return 'tu prends'
  if (je === 'je veux') return 'tu veux'
  if (je === 'je peux') return 'tu peux'
  if (je === 'je dois') return 'tu dois'
  if (je === 'je vois') return 'tu vois'
  if (je === 'je sais') return 'tu sais'
  if (je === "je m'appelle") return "tu t'appelles"
  if (je.startsWith("j'")) return `tu ${je.slice(2)}s`.replace(/es$/, 'es')
  if (je.startsWith('je me ')) return `tu te ${je.slice(6)}s`
  if (je.startsWith('je ')) {
    const rest = je.slice(3)
    if (rest.endsWith('e') && !rest.endsWith('ee')) return `tu ${rest}s`
    return `tu ${rest}`
  }
  return `tu ${lemmaSurface(infinitive)}`
}

function ilForm(infinitive: string): string {
  const tu = tuForm(infinitive)
  if (tu === 'tu es') return 'il est'
  if (tu === 'tu as') return 'il a'
  if (tu === 'tu vas') return 'il va'
  if (tu === 'tu fais') return 'il fait'
  if (tu.startsWith('tu t\'')) return `il s'${tu.slice(5)}`.replace(/s$/, '')
  if (tu.startsWith('tu te ')) return `il se ${tu.slice(6)}`.replace(/s$/, '')
  if (tu.endsWith('s') && tu.startsWith('tu ')) return `il ${tu.slice(3, -1)}`
  return tu.replace(/^tu /, 'il ')
}

function purposeLine(theme: TeacherTheme): string {
  const title = theme.title.replace(/^Prove:\s*/i, '').replace(/^Checkpoint:\s*/i, '').trim()
  const grammar = (theme.grammar ?? '').replace(/Prove gate[\s\S]*$/i, '').trim()
  return `What this lesson is for: use **${title}** in real speech. Grammar in the background: ${grammar || 'today’s pattern'}. First: English meanings. Then: many example sentences.`
}

function exampleSentence(fr: string, en: string): { fr: string; en: string } {
  const w = lemmaSurface(fr)
  if (looksVerb(fr) || /^(être|avoir|aller|faire|dire)$/i.test(w)) {
    const je = jeForm(fr)
    const cap = je.charAt(0).toUpperCase() + je.slice(1)
    const gloss = en.replace(/^to\s+/i, '')
    return { fr: `${cap}.`, en: `I ${gloss}.` }
  }
  return { fr: `Voici ${w}.`, en: `Here is / here are: ${en}.` }
}

export function buildTeacherBrief(theme: TeacherTheme, extras: {
  meanings: Array<[string, string]>
  traps: string[]
  chunks: Array<[string, string]>
  focus: string[]
  grammar: string
  trio: [string, string, string]
}): string {
  const role = roleOf(theme)
  const meanings = extras.meanings.slice(0, 24)
  const traps = extras.traps.slice(0, 10)
  const chunks = extras.chunks.slice(0, 10)
  const focus = extras.focus.filter(Boolean).slice(0, 8)
  const verbs = meanings.filter(([fr]) => looksVerb(fr) || /^(être|avoir|aller|faire)$/i.test(lemmaSurface(fr)))

  const meaningList = meanings.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n')

  const sentenceBank = meanings
    .slice(0, 12)
    .map(([fr, en]) => {
      const ex = exampleSentence(fr, en)
      return `- *${fr}* = ${en}\n- ${ex.en} → *${ex.fr}*`
    })
    .join('\n')

  const personBank = verbs.slice(0, 4).flatMap(([fr, en]) => {
    const je = jeForm(fr)
    const tu = tuForm(fr)
    const il = ilForm(fr)
    const gloss = en.replace(/^to\s+/i, '')
    return [
      `- *${je}* = I ${gloss}`,
      `- *${tu}* = you ${gloss} (one friend)`,
      `- *${il}* = he ${gloss}`,
      `- *elle ${il.replace(/^il\s+/, '')}* = she ${gloss}`,
    ]
  }).join('\n')

  const focusBank = focus.map((line) => `- *${line}*`).join('\n')

  const trapBank = [
    ...traps.map((t) => `- ${t}`),
    `- Wrong: *Je ${lemmaSurface(meanings[0]?.[0] ?? 'bonjour')}.* with no ending when it is a verb → Right: use the present form (*${jeForm(meanings[0]?.[0] ?? 'aimer')}*).`,
  ].join('\n')

  const enFr = meanings.slice(0, 12).map(([fr, en]) => {
    const ex = exampleSentence(fr, en)
    return `- ${ex.en} → *${ex.fr}*`
  }).join('\n')

  const chunkBank = chunks.map(([fr, en]) => `- *${fr}* = ${en}`).join('\n')
  const f0 = focus[0] ?? 'Bonjour.'
  const f1 = focus[1] ?? 'Merci.'

  let body = `${purposeLine(theme)}

**1. Words to learn first (meanings)**
Learn English first. Do not jump to a sentence until every word below has a meaning.

${meaningList}

**2. Hear each word in a real sentence**
Cover the French. Say it. Then uncover.

${sentenceBank}

**3. Change the person (same idea)**
Keep the meaning. Change *je / tu / il / elle*.

${personBank || focusBank}

Now copy these lesson lines:
${focusBank}

**4. Grammar pattern (only after meanings)**
${extras.grammar}

- Produce the first line with *je*, then *tu*, then *elle*.
- Keep polite chunks whole: *s'il vous plaît*, *au revoir*, *à bientôt*.

**5. Right vs wrong**
${trapBank}

**6. English → French (cover the French)**
${enFr}

**7. Mini class**
- A: *${f0}*
- B: *${f1}*
- A: Prefer a real line from this lesson, not a vague “you understand?”
- B: *Oui. ${f1}*
- A: *Bonjour, comment allez-vous ?*
- B: *Très bien, merci. Et vous ?*

**8. Chunks — say each as one piece**
${chunkBank || focusBank}

**9. *tu* vs *vous***
- More formal: *${extras.trio[0]}*
- Everyday: *${extras.trio[1]}*
- Very casual (recognition only): *${extras.trio[2]}*
- Stranger / teacher / shop: start with *vous*.
- Friend who offered *tu*: *tu* is fine.

**10. What to practice**
- Say five lines out loud without looking.
- If a French word is empty sound, return to section 1.
`

  if (role === 'D') {
    body += `
**11. Cold check**
- No hints on the drills.
- Aim for a solid score.
- If you miss it, reopen the Learn / Practice lessons in this unit, then try again.
- Before Continue: say the same five lines with *je*, then with *elle*.
`
  } else if (role === 'C') {
    body += `
**11. Put it together**
- Mix two or three of today's lines into one short day.
- Keep the same words. Change only the person or the time.
`
  } else if (role === 'B') {
    body += `
**11. Practice the same tools**
- Same meanings as the Learn lesson.
- More swaps: place, person, hour.
`
  } else {
    body += `
**11. Build a tiny scene**
- Greeting.
- One fact with *je*.
- One question with *tu* or *vous*.
- One closing: *merci* / *au revoir* / *à bientôt*.

**12. Same idea, new people**
- *Tu … ?* (friend)
- *Vous … ?* (polite)
- *Elle … .* (she)
- *Nous … .* (we)
`
  }

  return bulletizeTheory(body)
}
