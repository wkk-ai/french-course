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

3. **[2026-07-24] Clickable words looked like plain text**
   Do instead: give dictionary tokens a dotted underline + cursor-pointer; verbs use verb-colored underline; show a short “tap any word / Conjugate” hint above reading.

4. **[2026-07-24] Shipped 1-minute “lessons”**
   Do instead: enforce chapter bar — ~30–60+ min, 220+ reading words, 22+ exercises, 60–100 lemmas, 12+ dialogue turns. Never ship snack demos as chapters.

## User Directives

1. **[2026-07-24] Always commit + push when finished (this chat / this product)**
   Do instead: end every completed change set with commit → push → Pages deploy so the user can check live.

2. **[2026-07-24] Course must aim at real fluency (months), not a thin 12×4**
   Do instead: be honest that only authored modules are playable; target ~96 chapters / ~8k lemmas / 18–24 months; do not claim “all of French” early.

## Domain Behavior Guardrails

1. **[2026-07-24] Words not clickable (*à bientôt*, conversation, function words)**
   Do instead: merge multiwords in `clickable-text`; tokenize conversation with `tokenizeFrench`; add missing lemmas; verify enrich has no bare content tokens.

2. **[2026-07-24] Verbs without full CONJUGATE (*parler*, *habite* as lemma)**
   Do instead: store infinitives (*habiter*); use `french-conjugations.ts` for all conjugable verbs; **prefer bundled vocab over DB** in `resolveVocabulary` so POS/meanings are not wiped.

3. **[2026-07-24] Broken token spacing in reading/conversation**
   Do instead: insert a real `' '` text node (not CSS margin) after punctuation/`« »`; split punct runs like `»,`; keep `œ` inside words.

4. **[2026-07-24] Thin DB lesson stubs shadowed rich Module 1**
   Do instead: `resolveLessonContent` must prefer bundled `MODULE1_LESSONS` over incomplete DB `lesson_content`.

5. **[2026-07-24] Review/Vocab Vault empty after lessons**
   Do instead: on complete, enqueue reading+dialogue lemmas (remote upsert + local vault fallback); log wrong answers to `user_mistakes` immediately; Review must resolve labels from bundled vocab if DB join is null.

6. **[2026-07-24] Popup missing meanings / examples**
   Do instead: every vocab entry gets `meanings[]` + `example { french, english }`; show multi-sense lists in the word popup.

## Shell & Command Reliability

1. **[2026-07-24] Assumed `gh` on PATH**
   Do instead: use `/tmp/ghcli/*/bin/gh` (or locate) for Pages deploy watches when `gh` is missing.
