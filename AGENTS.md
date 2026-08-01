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
- Bundled `BUNDLED_LESSONS` (all 36 modules × A/B/C/D = 720) **wins** over thin DB stubs in `resolveLessonContent`.
- Pathway UI: `src/lib/pathway/catalog.ts`. Every module playable at **Module-1 Learn A craft** (`validateChapterContent` + measure pads). Prove (D) is mandatory per unit.
- Lesson complete must enqueue lemmas for Review (remote and/or local vault); wrong answers → `user_mistakes`.
- Before done: check missing lemmas after enrich, conjugate on infinitives, spacing, Review queue after complete, depth CI on all bundled lessons.

## Theory First (meanings before grammar)
- Never use a French content word in a grammar example until its **English meaning** is taught in the brief.
- Open every Theory First with **Words to learn first (meanings)** (lemma = English), then patterns, traps, chunks, practice order.
- Bad: *mon frère* before *frère = brother*. Good: meanings list → then *mon frère*.
- Briefs should be deep (multi-section), not one short paragraph.
<!-- END:french-course-lessons-learned -->
