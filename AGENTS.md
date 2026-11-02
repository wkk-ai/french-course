<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:french-course-lessons-learned -->
# Mistakes not to repeat (Module 1 / dictionary / Review)

## Ship when done
- Finished change sets: **commit + push** so Pages goes live. Do not leave playable fixes local-only.

## Curriculum honesty
- Do not claim “all of French” when only Module 1 (or a pathway shell) is authored.
- Thin 12×4 demos are too weak. Chapter bar: ~30–60+ min, 220+ reading words, 22+ exercises, 60–100 lemmas, dialogue. Long-term: ~96 chapters / ~8k lemmas / 18–24 months.
- Never ship a lesson finishable in ~1 minute.

## Clickable dictionary
- Every meaningful word in **reading and conversation** needs a lemma (incl. multiwords: *à bientôt*, *au revoir*, *s'il vous plaît*).
- Store verbs as **infinitives** (*habiter*, not *habite*); conjugations key off that id.
- Popup: multi-meanings, example FR/EN, and **CONJUGATE** for every conjugable verb — use `src/lib/french-conjugations.ts` for full tense sets, not Présent-only hand tables.

## Text rendering
- Space correctly after `. , ! ? : ;` and around `« »` (never `Bonjour!Je`).
- Keep `œ` inside words (*sœur*); split glued punct (`Moi,`); prefer `tokenizeFrench` / `readingParagraphs` over hand tokens.

## Content + Review
- **One lesson per unit** (36 modules × 5 units = 180). Unit id = the unit's old A chapter id (`src/lib/pathway/units.ts`). Old B/C/D ids only count toward progress (`completedUnitIds`).
- Hand-written units live in `src/lib/units/mNN-uN.ts` (kit: `src/lib/units/kit.ts`), registered in `src/lib/units/specs.ts`. After any edit run `npx tsx scripts/emit-unit-index.ts` (test checks it).
- Unit bar (tested in `tests/unit-lessons.test.ts`): brief opens with meanings, 220+ reading words, 12+ dialogue lines, 24+ exercises of 7+ types, every reading/dialogue word tappable, verbs as infinitives.
- Units not yet hand-written fall back to the old generated A lesson with junk questions filtered (`isJunkExercise`). Home shows their module as "Draft, being rewritten". Never call a draft module finished.
- Reading questions quote the French sentence (« … ») and ask what it means. No plot-memory quizzes (`validateLessonExercise`).
- Lesson complete must enqueue lemmas for Review (remote and/or local vault); wrong answers → `user_mistakes`.
- Legacy 720-chapter checks (`validateChapterContent`, measure pads) still run on the old generated content; they are not the quality bar any more.

## Theory First (meanings before grammar)
- Never use a French content word in a grammar example until its **English meaning** is taught in the brief.
- Open every Theory First with **Words to learn first (meanings)** (lemma = English), then patterns, traps, chunks, practice order.
- Bad: *mon frère* before *frère = brother*. Good: meanings list → then *mon frère*.
- Briefs should be deep (multi-section), not one short paragraph.
<!-- END:french-course-lessons-learned -->
