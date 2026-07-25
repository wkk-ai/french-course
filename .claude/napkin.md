# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)

1. **[2026-07-24] PWA service worker cache-first hid deploys**
   Do instead: keep SW as a **cleanup/unregister** worker (or network-first with bumped `CACHE_NAME`); register with `NEXT_PUBLIC_BASE_PATH`. Clickable words need visible affordance — never ship invisible dictionary hits.

2. **[2026-07-24] Finished work left local (not on Pages)**
   Do instead: when a playable change set is done, **commit + push** and confirm Deploy to GitHub Pages succeeds before telling the user it’s live.

3. **[2026-07-24] Clickable words / X-Ray UX**
   Do instead: keep words clickable with hover (no dotted underlines); X-Ray must set `token.syntax` from vocab POS in `enrichTokens` — never leave all tokens as `none`.

4. **[2026-07-24] Shipped 1-minute “lessons”**
   Do instead: enforce chapter bar — ~30–60+ min, 220+ reading words, 22+ exercises, 60–100 lemmas, 12+ dialogue turns. Never ship snack demos as chapters.

5. **[2026-07-25] Story-memory + proper-name quizzes shipped (incl. “Marie orders…”)**
   Do instead: quiz **French** only — ban Name+plot (`Marie orders…`, `Marc asks for…`, `Marc and Marie sit…`, `Name's birthday/mother…`, `How many … does Marc…`) plus reading-recall phrasing; never flashcard **proper nouns**; CI must validate **raw** `MODULE1_LESSONS` (not only enriched) so bad items cannot hide behind silent strip.

6. **[2026-07-25] Grammar rules were stubs / locked rules shown as tease**
   Do instead: deep `GrammarRuleDocument` + unlock by lesson; **hide locked rules** in the list (no lock cards / titles); detail URL for locked = generic “not available yet”, no spoilers.

## User Directives

1. **[2026-07-24] Always commit + push when finished (this chat / this product)**
   Do instead: end every completed change set with commit → push → Pages deploy so the user can check live.

2. **[2026-07-25] All 36 modules must be rich + playable (not shells)**
   Do instead: factory themes M02–M36 + Module 1 hand bundle → `BUNDLED_LESSONS` (540 A/B/C); catalog all `playable`; Rules include later-phase docs; never leave M07+ as coming-soon titles only.

3. **[2026-07-25] Review = vocab + grammar only**
   Do instead: no character/plot quizzes; no Marc/Marie/Paris flashcards; names OK in reading clickable dict, not in Review/Flashcards.

4. **[2026-07-25] Theory must teach meanings before grammar examples**
   Do instead: every Theory First brief starts with **Words to learn first (meanings)**; never *mon frère* before *frère = brother*; deep multi-section briefs.

5. **[2026-07-25] Match / unlock / mobile safe-area**
   Do instead: shuffle both match columns; authored pathway order unlocks next; Today’s Reading Module 1 X/15 + daily 300 words; mobile nav `pb-safe` + main `pb-[calc(4rem+env(safe-area))]`.

6. **[2026-07-25] Learn / Review / Rules wiring**
   Do instead: resolve `BUNDLED_LESSONS` (540); Review + rule unlock scan all `BUNDLED_CHAPTER_IDS`; lesson page pathway fallback if DB row missing; static-generate all playable IDs.

## Domain Behavior Guardrails

1. **[2026-07-25] Theory used French words before teaching meanings (*frère*, *père*)**
   Do instead: every **Theory First** brief opens with **Words to learn first (meanings)** — each lemma + English — **before** any grammar example uses that word; never *mon frère* until *frère = brother*; deep multi-section briefs (traps, chunks, practice order). Module 1+ authoring bar.

2. **[2026-07-25] Quiz French, not the story / not proper names**
   Do instead: ban plot prompts (reading-recall **and** `Name orders/asks/sits…`, possessives, how-many-about-Name); exclude `proper noun` from review/flashcards/enqueue; rewrite to grammar/vocab drills. Guard in `isStoryMemoryExercise`; strip in enrich; **fail CI on raw Module 1** if any slip through.

3. **[2026-07-25] Repair lane made nonsense True/False cards**
   Do instead: no repair session lane; show `Missed N×` from `mistake_count`; flashcards Again/Easy/Hard (Easy=5); T/F statements cannot be questions.

4. **[2026-07-25] Home “Today’s Reading” stuck at 0 / empty bar**
   Do instead: record `user_daily_reading_stats` client-side (local date); show module % and daily-words bars separately.

5. **[2026-07-25] Review pool stayed 0 after lesson complete**
   Do instead: local-first `enqueueLocalVocabulary`; `enqueue_lesson_vocabulary` RPC; Review backfills completed Module 1 chapters.

6. **[2026-07-24] Words not clickable / popup thin**
   Do instead: merge multiwords in `clickable-text`; tokenize conversation with `tokenizeFrench`; every vocab entry gets `meanings[]` + `example { french, english }`.

7. **[2026-07-24] Verbs without full CONJUGATE (*parler*, *habite* as lemma)**
   Do instead: store infinitives (*habiter*); use `french-conjugations.ts`; prefer bundled vocab over DB in `resolveVocabulary`.

8. **[2026-07-24] Broken token spacing in reading/conversation**
   Do instead: real `' '` text node after punct/`« »`; keep `œ` inside words.

9. **[2026-07-24] Thin DB lesson stubs shadowed rich Module 1**
   Do instead: `resolveLessonContent` prefers bundled `MODULE1_LESSONS` over incomplete DB stubs. Pathway titles = seed; playable = `MODULE1_LESSONS`. Expand chapters in seed + TS; `HomeClient` maps rows / `module01.ts` merge.

10. **[2026-07-24] Typed answers must ignore case**
    Do instead: grade via `normalizeFrenchInput` (lowercase + strip accents/trailing punct).

## Shell & Command Reliability

1. **[2026-07-24] Assumed `gh` on PATH**
   Do instead: use `/tmp/ghcli/*/bin/gh` (or locate) for Pages deploy watches when `gh` is missing.
