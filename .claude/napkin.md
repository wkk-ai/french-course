# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)

1. **[2026-07-27] Depth padders leak author/AI notes into Theory + Reading**
   Do instead: never pad brief/reading with authoring jargon (“Deep practice (Module-1 bar)”, “Store verbs as infinitives”, “Dans cette leçon, relisez…”, “dictionnaire cliquable”, “Hand-crafted focus”, “Enqueue reviewable lemmas”, “Lecture de consolidation”). Meet depth with real learner content; CI denylist those phrases on all 720. Measured: author pad 716/720 briefs; meta FR pad 717/720 readings; consol template ×525.

2. **[2026-07-27] Reading tap “Not in the dictionary” / vocab id hygiene**
   Do instead: (1) namespaces M1 `1–295`, P1 `400–499`, LATER `600–841`, CORE `4000+`, TAP `5000+`; (2) one surface → one id (`dedupeVocabularySurfaces` + `scripts/dedupe-vocab-banks.ts`); (3) CI unique ids + unique surfaces; (4) `npx tsx scripts/audit-vocab-ids.ts` after vocab edits.

3. **[2026-07-27] Factory readingFr dumps English glosses + EN grammar labels**
   Do instead: French-only reading; teach EN in Theory meanings list, not `signifie « past tense… »` / `with avoir` / `PC regular` inside `readingFr`. CI fail on ASCII EN content-words in reading/dialogue (allowlist cognates). Measured: 511/705 themes EN-in-readingFr; 305 dialogues with EN labels.

4. **[2026-07-27] Meta “how to study” quizzes + weak plot/name distractors**
   Do instead: quiz FR forms/meanings only; ban prompts like “Before grammar drills…” / distractors `plot`/`name`/`story`. `validateLessonExercise` must reject authoring-meta + junk distractors. Measured: ~3 301 meta items / 705 lessons; ~2 513 weak-distractor items. Classic story-memory prompts = 0.

5. **[2026-07-27] `validateChapterContent` only checks length/presence — not quality**
   Do instead: extend CI: pad denylist, EN-in-readingFr, lemma coverage, near-dup paragraphs, focus originality, Prove dialogue originality, meta-exercise ban. Char minima currently reward `deepen-lesson` pad loops.

6. **[2026-07-27] `user_mistakes.is_resolved` never written true**
   Do instead: resolve mistakes after correct rem/practice; else rem forever + Prove score pollution.

7. **[2026-07-27] RPC `chapter_vocabulary` re-seeds Marc/Paris into Review**
   Do instead: remote `complete_chapter` migration applied; keep client `filterReviewPool` as belt-and-suspenders.

8. **[2026-07-27] Lesson page freezes (“Checking session…” / Page Unresponsive)**
   Do instead: never import `BUNDLED_LESSONS` / factory themes from client components; use `bundled-vocabulary`, `remediation.ts`, packed lemma index; lazy-build factory lessons server-side only; cache `buildLemmaLookup`.

9. **[2026-07-25] Prove D must gate at 70%, no hints**
   Do instead: `didPassProve`; `allowHints={!isProve}`; exclude rem from Prove score; fail → remediate B/C.

10. **[2026-07-25] Remediation accent aliases incomplete**
    Do instead: alias `etre-present` + `etre-family` (and all accented cats); mirror ASCII templates.


## User Directives

1. **[2026-07-27] Master bug list lives in `docs/BUG_BACKLOG.md`**
   Do instead: keep open items there (R1/R2 IDs + waves A–D); mark fixed with commit; don’t scatter audits only in chat.

2. **[2026-07-24] Always commit + push when finished (this chat / this product)**
   Do instead: end every completed change set with commit → push → Pages deploy so the user can check live.

3. **[2026-07-25] All modules must match Module-1 deepest bar (not thin factory)**
   Do instead: every sub-chapter passes `validateChapterContent` (meanings-first brief depth by role, ≥220 reading words, ≥12 dialogue, ≥22 exercises, no story-memory). Deepen via `deepenLessonToModule1Bar` + deep `readingFr`/theory themes. Never ship snack/factory-pad-only lessons. Honesty: M01 Learn A = deepest hand; M02–M36 + D = theme+bar, not equal prose craft.

4. **[2026-07-25] Review = vocab + grammar only**
   Do instead: no character/plot quizzes; no Marc/Marie/Paris flashcards; names OK in reading clickable dict, not in Review/Flashcards.

5. **[2026-07-25] Theory must teach meanings before grammar examples**
   Do instead: every Theory First brief starts with **Words to learn first (meanings)**; never *mon frère* before *frère = brother*; deep multi-section briefs.

6. **[2026-07-25] Match / unlock / mobile safe-area**
   Do instead: shuffle both match columns; unlock via `BUNDLED_CHAPTER_IDS` (20/module incl. D); Today’s Reading M1 X/20 + daily 300 words; mobile nav `pb-safe` + main `pb-[calc(4rem+env(safe-area))]`.

7. **[2026-07-25] Learn / Review / Rules wiring**
   Do instead: resolve `BUNDLED_LESSONS` (720 A/B/C/D); Review + rule unlock scan all `BUNDLED_CHAPTER_IDS`; lesson page pathway fallback if DB row missing; static-generate all playable IDs; **DB must seed all 720 rows** or complete/FK fail.

## Domain Behavior Guardrails

1. **[2026-07-27] Prove score polluted by remediation extras**
   Do instead: never append `buildRemediationExercises` into Prove (D) scoring set; gate score on chapter drills only (`allowHints={!isProve}` stays).

2. **[2026-07-27] Sign-out leaves local progress + vault for next account**
   Do instead: clear `french-course:completed-chapters` + `ladf-vocab-vault-v1` on sign-out, or scope both keys by `user.id`.

3. **[2026-07-27] AuthGate hard-kicks mid-lesson on session loss**
   Do instead: soft banner + draft answers to sessionStorage before `/login/`; don’t unmount lesson on first `SIGNED_OUT`.

4. **[2026-07-27] Rules/Review ignore local completed chapters**
   Do instead: unlock + Review backfill via `mergeCompletedChapterIds` (same as Home/LessonClient), not remote-only `user_chapter_progress`.

5. **[2026-07-27] Center `today` baked at static export build**
   Do instead: compute heatmap “today” in client (`new Date()`), never from SSG page props.

6. **[2026-07-25] Home progress flash before remote load**
   Do instead: boot Home with loading state until progress merge finishes (don’t paint false “Up next”).

7. **[2026-07-27] `completeLesson` catch marks local complete on any throw**
   Do instead: mark local only after enqueue intent succeeds; never on pre-save auth failure.

8. **[2026-07-27] Multi-tab local vault last-write-wins**
   Do instead: CAS merge on write (`mergeVaultItem`); `subscribeLocalVault` + ReviewClient storage listener.

9. **[2026-07-27] Typed drills lock on blur forever**
   Do instead: cloze/translate/conjugation need Confirm; no `onBlur` auto-submit; allow edit until Confirm.

10. **[2026-07-27] Dict popup clips off-screen**
    Do instead: clamp/flip popup to viewport (edges + first lines); avoid fixed `bottom-full left-1/2 w-72` only.

## Shell & Command Reliability

1. **[2026-07-24] Assumed `gh` on PATH**
   Do instead: use `/tmp/ghcli/*/bin/gh` (or locate) for Pages deploy watches when `gh` is missing.
