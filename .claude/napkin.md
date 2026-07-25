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

5. **[2026-07-25] Story-memory + proper-name quizzes shipped**
   Do instead: exercises quiz **French** (vocab/grammar), never “where does Marie live?” plot recall; never flashcard/review **proper nouns**; enforce via `isStoryMemoryExercise` + `isReviewablePartOfSpeech` + CI.

## User Directives

1. **[2026-07-24] Always commit + push when finished (this chat / this product)**
   Do instead: end every completed change set with commit → push → Pages deploy so the user can check live.

2. **[2026-07-24] Course must aim at real fluency (months), not a thin 12×4**
   Do instead: be honest that only authored modules are playable; target ~96 chapters / ~8k lemmas / 18–24 months; do not claim “all of French” early.

3. **[2026-07-25] Review = vocab + grammar only**
   Do instead: no character/plot quizzes; no Marc/Marie/Paris flashcards; names OK in reading clickable dict, not in Review/Flashcards.

## Domain Behavior Guardrails

1. **[2026-07-25] Quiz French, not the story / not proper names**
   Do instead: ban story-memory prompts (`according to the reading`, `Where does Marie…`); exclude `proper noun` from review pool, flashcards, and lemma enqueue; replace with habiter/c'est/family/vocab drills. Validate in `validate.ts`; strip invalid in `enrichLessonExercises`.

2. **[2026-07-25] Repair lane made nonsense True/False cards**
   Do instead: no repair session lane; show `Missed N×` from `mistake_count`; flashcards Again/Easy/Hard (Easy=5); T/F statements cannot be questions.

3. **[2026-07-25] Home “Today’s Reading” stuck at 0 / empty bar**
   Do instead: record `user_daily_reading_stats` client-side (local date); show module % and daily-words bars separately.

4. **[2026-07-25] Review pool stayed 0 after lesson complete**
   Do instead: local-first `enqueueLocalVocabulary`; `enqueue_lesson_vocabulary` RPC; Review backfills completed Module 1 chapters.

5. **[2026-07-24] Words not clickable (*à bientôt*, conversation, function words)**
   Do instead: merge multiwords in `clickable-text`; tokenize conversation with `tokenizeFrench`; add missing lemmas.

6. **[2026-07-24] Verbs without full CONJUGATE (*parler*, *habite* as lemma)**
   Do instead: store infinitives (*habiter*); use `french-conjugations.ts`; prefer bundled vocab over DB in `resolveVocabulary`.

7. **[2026-07-24] Broken token spacing in reading/conversation**
   Do instead: real `' '` text node after punct/`« »`; keep `œ` inside words.

8. **[2026-07-24] Thin DB lesson stubs shadowed rich Module 1**
   Do instead: `resolveLessonContent` prefers bundled `MODULE1_LESSONS` over incomplete DB stubs.

9. **[2026-07-24] Typed answers must ignore case**
   Do instead: grade via `normalizeFrenchInput` (lowercase + strip accents/trailing punct).

10. **[2026-07-24] Popup missing meanings / examples**
    Do instead: every vocab entry gets `meanings[]` + `example { french, english }`.

## Shell & Command Reliability

1. **[2026-07-24] Assumed `gh` on PATH**
   Do instead: use `/tmp/ghcli/*/bin/gh` (or locate) for Pages deploy watches when `gh` is missing.
