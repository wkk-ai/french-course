# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)

1. **[2026-07-25] Home shows 720; DB seed thin — unlock/complete desync**
   Do instead: unlock via `BUNDLED_CHAPTER_IDS`; `ensure_chapter_row` + seed migration `20260725180000_pathway_720_chapters.sql`; always `markLocalChapterCompleted` so Home advances even if FK fails. Apply migration on remote Supabase.

2. **[2026-07-25] Proper nouns leaked into Review vault on lesson complete**
   Do instead: enqueue only `lemmaIdsForChapter` / filtered lemma ids — never union raw reading tokens. Ban plot/name quizzes; strip proper nouns in enrich; fail CI on raw Module 1.

3. **[2026-07-25] Prove D must gate at 70%, no hints**
   Do instead: `didPassProve` / `PROVE_PASS_SCORE`; `allowHints={!isProve}`; fail copy sends learner to B/C. Unit-specific Prove focus lines.

4. **[2026-07-25] Remediation key `être-present` vs lesson `etre-present`**
   Do instead: alias both in `buildRemediationExercises`; mirror ASCII key.

5. **[2026-07-25] Clickable dict starved (lemmaIds-only vocab)**
   Do instead: `resolveVocabularyForLesson` = linked + full `BUNDLED_VOCABULARY` for surface lookup.

6. **[2026-07-24] PWA service worker cache-first hid deploys**
   Do instead: keep SW as a **cleanup/unregister** worker; register with `NEXT_PUBLIC_BASE_PATH`.

7. **[2026-07-24] Finished work left local (not on Pages)**
   Do instead: when a playable change set is done, **commit + push** and confirm Deploy to GitHub Pages succeeds.

8. **[2026-07-24] Shipped 1-minute “lessons”**
   Do instead: enforce chapter bar — ≥220 reading words, ≥22 exercises, ≥12 dialogue; CI `validateChapterContent` on all 720.

9. **[2026-07-25] Story-memory + proper-name quizzes**
   Do instead: quiz **French** only; never flashcard **proper nouns**; CI validate raw Module 1.

10. **[2026-07-25] Grammar rules stubs / locked spoilers**
    Do instead: hide locked rules in list; locked detail = generic “not available yet”.


## User Directives

1. **[2026-07-24] Always commit + push when finished (this chat / this product)**
   Do instead: end every completed change set with commit → push → Pages deploy so the user can check live.

2. **[2026-07-25] All modules must match Module-1 deepest bar (not thin factory)**
   Do instead: every sub-chapter passes `validateChapterContent` (meanings-first brief depth by role, ≥220 reading words, ≥12 dialogue, ≥22 exercises, no story-memory). Deepen via `deepenLessonToModule1Bar` + deep `readingFr`/theory themes. Never ship snack/factory-pad-only lessons. Honesty: M01 Learn A = deepest hand; M02–M36 + D = theme+bar, not equal prose craft.

3. **[2026-07-25] Review = vocab + grammar only**
   Do instead: no character/plot quizzes; no Marc/Marie/Paris flashcards; names OK in reading clickable dict, not in Review/Flashcards.

4. **[2026-07-25] Theory must teach meanings before grammar examples**
   Do instead: every Theory First brief starts with **Words to learn first (meanings)**; never *mon frère* before *frère = brother*; deep multi-section briefs.

5. **[2026-07-25] Match / unlock / mobile safe-area**
   Do instead: shuffle both match columns; unlock via `BUNDLED_CHAPTER_IDS` (20/module incl. D); Today’s Reading M1 X/20 + daily 300 words; mobile nav `pb-safe` + main `pb-[calc(4rem+env(safe-area))]`.

6. **[2026-07-25] Learn / Review / Rules wiring**
   Do instead: resolve `BUNDLED_LESSONS` (720 A/B/C/D); Review + rule unlock scan all `BUNDLED_CHAPTER_IDS`; lesson page pathway fallback if DB row missing; static-generate all playable IDs; **DB must seed all 720 rows** or complete/FK fail.

## Domain Behavior Guardrails

1. **[2026-07-25] Home shows 720; DB seed ~59 — unlock/complete desync**
   Do instead: seed all pathway chapter rows (36×20) incl. Prove `…d` IDs; LessonClient gate + complete use `BUNDLED_CHAPTER_IDS` order (not DB-only). FK needs `chapters` row.

2. **[2026-07-25] Proper nouns leaked into Review vault on lesson complete**
   Do instead: enqueue only `lemmaIdsForChapter` / filtered lemma ids — never union raw reading tokens. Ban plot/name quizzes; strip proper nouns in enrich; fail CI on raw Module 1.

3. **[2026-07-25] Theory used French words before teaching meanings (*frère*, *père*)**
   Do instead: every **Theory First** brief opens with **Words to learn first (meanings)** before grammar examples; deep multi-section briefs.

4. **[2026-07-25] Repair lane made nonsense True/False cards**
   Do instead: no repair session lane; show `Missed N×` from `mistake_count`; flashcards Again/Easy/Hard (Easy=5); T/F statements cannot be questions.

5. **[2026-07-25] Home “Today’s Reading” stuck at 0 / empty bar**
   Do instead: record `user_daily_reading_stats` client-side (local date); show module % and daily-words bars separately.

6. **[2026-07-25] Review pool stayed 0 after lesson complete**
   Do instead: local-first `enqueueLocalVocabulary`; `enqueue_lesson_vocabulary` RPC; Review backfills all completed `BUNDLED_CHAPTER_IDS`.

7. **[2026-07-24] Words not clickable / popup thin**
   Do instead: merge multiwords in `clickable-text`; tokenize with full `BUNDLED_VOCABULARY` at render (not only pre-linked lemmaIds); meanings[] + example FR/EN.

8. **[2026-07-24] Verbs without full CONJUGATE (*parler*, *habite* as lemma)**
   Do instead: store infinitives (*habiter*); use `french-conjugations.ts`; prefer bundled vocab over DB in `resolveVocabulary`.

9. **[2026-07-24] Broken token spacing in reading/conversation**
   Do instead: real `' '` text node after punct/`« »`; keep `œ` inside words.

10. **[2026-07-25] Thin factory / DB stubs shadowed rich lessons**
    Do instead: `resolveLessonContent` prefers `BUNDLED_LESSONS`; CI `validateChapterContent` on all 720; Prove D per unit; enqueue only `lemmaIdsForChapter`.

## Shell & Command Reliability

1. **[2026-07-24] Assumed `gh` on PATH**
   Do instead: use `/tmp/ghcli/*/bin/gh` (or locate) for Pages deploy watches when `gh` is missing.
