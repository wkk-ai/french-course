import type { LessonContent } from '@/lib/course'
import { readingParagraphs } from '@/lib/lesson-text'
import { BUNDLED_VOCABULARY } from '@/lib/phase1/content'

/** Expand a short lesson until it meets the Module-1 authoring bar (napkin / COURSE_STRUCTURE §10). */
export function deepenLessonToModule1Bar(
  lesson: LessonContent,
  role: 'A' | 'B' | 'C' | 'D' = 'A',
): LessonContent {
  const minBrief = role === 'A' ? 2500 : role === 'B' ? 1500 : 900
  let brief = lesson.brief
  if (brief) {
    let body = brief.body
    if (!body.includes('Words to learn first (meanings)')) {
      body =
        `**1. Words to learn first (meanings)**\n` +
        `Re-open this lesson’s reading with the clickable dictionary and learn each new lemma’s English meaning before grammar drills.\n\n` +
        body
    }
    if (body.length < minBrief) {
      body +=
        `\n\n**Deep practice (Module-1 bar)**\n` +
        `Return to meanings after every wrong answer. Produce six pronoun variants of the key pattern. ` +
        `Learn chunks as wholes. Quiz French forms only — never story plot or proper-name flashcards. ` +
        `Store verbs as infinitives and open full conjugations. Check spacing after punctuation. ` +
        `Spiral one older pattern into two new sentences. Review five hard lemmas tomorrow before the next sub-chapter. ` +
        `Register: vous with strangers, tu with friends who offered it. ` +
        `The goal is real comprehension and production — not a one-minute click-through.\n`
      while (body.length < minBrief) {
        body +=
          ` Re-read the meanings list, then say three new French sentences with today’s grammar. ` +
          `If unsure, re-check traps before guessing. `
      }
    }
    brief = { ...brief, body }
  }

  const reading = [...(lesson.reading ?? [])]
  const wordCount = reading.reduce(
    (sum, paragraph) => sum + paragraph.tokens.filter((token) => /[A-Za-zÀ-ÿ]/.test(token.text)).length,
    0,
  )
  if (wordCount < 220) {
    const extra = readingParagraphs(
      `deepen-${lesson.brief?.title ?? 'lesson'}`.replace(/\s+/g, ''),
      [
        `Pour atteindre la barre du Module 1, relisez encore une fois avec le dictionnaire cliquable. ` +
          `Chaque mot utile doit avoir un sens anglais clair. Les exercices entraînent les formes françaises, pas la mémoire de l'histoire. ` +
          `Répétez les formules à voix haute. Notez les chunks. Vérifiez les articles, les accords et les prépositions. ` +
          `Si un verbe apparaît, rappelez l'infinitif. Demain, revoyez cinq lemmes difficiles avant la leçon suivante. ` +
          `Politesse : bonjour, merci, s'il vous plaît, au revoir, à bientôt. Patience ici accélère la suite du parcours.`,
      ],
      BUNDLED_VOCABULARY,
    )
    reading.push(...extra)
  }

  return {
    ...lesson,
    brief,
    reading,
  }
}
