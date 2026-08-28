# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)

1. **[2026-08-28] Factory = domain hand-feel craft (no pads / no quiz-chat)**
   Do instead: `craft-from-theme` picks domain from title/grammar first (never lemma-`bonjour` false greeting). Real apartment/café/city/family… scripts + focus uniquify on dialogue AND reading. Theory examples = real speech (*Je travaille au bureau*), never *J'utilise « travail »*. Shared name/place world with real dictionary lemmas. No pad emitters. CI: `npm test` + `measure-content-pads` → `failing: 0 / 720`. Still generator — not 705 human rewrites. Schema: `theme-craft-schema.ts`. Live host: Hostinger, not Pages.

2. **[2026-08-27] Reading tap “Not in the dictionary” / names as real lemmas**
   Do instead: every tappable surface needs a bank lemma — people and cities too (`vocabulary-proper-names.ts`, ids 7000+). Do not treat allowlist as a pass. CI: `measureBundledTapCoverage` missTokens = 0. Re-tokenize reading/dialogue in `LessonClient` via `joinFrenchTokens` + `tokenizeFrench`. Capitalized Tours/Nice prefer the proper-noun lemma.

3. **[2026-07-27] Factory readingFr dumps English glosses + EN grammar labels**
   Do instead: French-only reading; teach EN in Theory meanings list, not `signifie « past tense… »` / `with avoir` / `PC regular` inside `readingFr`. CI fail on ASCII EN content-words in reading/dialogue (allowlist cognates). Measured: 511/705 themes EN-in-readingFr; 305 dialogues with EN labels.

4. **[2026-07-27] Meta “how to study” quizzes + weak plot/name distractors**
   Do instead: quiz FR forms/meanings only; ban prompts like “Before grammar drills…” / distractors `plot`/`name`/`story`. `validateLessonExercise` must reject authoring-meta + junk distractors. Measured: ~3 301 meta items / 705 lessons; ~2 513 weak-distractor items. Classic story-memory prompts = 0.

5. **[2026-08-27] `validateChapterContent` must catch clones / pads / English, not length**
   Do instead: fail on skeleton-near-dup paragraphs, glued tokens (`BonjourLuc`), EN quiz labels in reading, `atteindre la lecture complète` pads. `measure-content-pads` fails on reading clones + tap misses. Never mark fixed from char count. `deepen-lesson` must not inject Marc/Marie filler.

6. **[2026-07-27] `user_mistakes.is_resolved` never written true**
   Do instead: resolve mistakes after correct rem/practice; else rem forever + Prove score pollution.

7. **[2026-07-27] RPC `chapter_vocabulary` re-seeds Marc/Paris into Review**
   Do instead: remote `complete_chapter` migration applied; keep client `filterReviewPool` as belt-and-suspenders.

8. **[2026-08-27] No login on phone; never ship factory in client**
   Do instead: all modules/units/lessons stay open (no sequential lock). Track not-started / in-progress percent / completed via local storage. Finish = `markLocalChapterCompleted` + vault. Compact JSON from `emit-course-data` (never import `BUNDLED_LESSONS` in client — freeze). Save-course caches JSON + slim pages. iPhone: Safari Add to Home Screen, Save course once on wifi.

9. **[2026-07-25] Prove D must gate at 70%, no hints**
   Do instead: `didPassProve`; `allowHints={!isProve}`; exclude rem from Prove score; fail → remediate B/C.

10. **[2026-07-25] Remediation accent aliases incomplete**
    Do instead: alias `etre-present` + `etre-family` (and all accented cats); mirror ASCII templates.


## User Directives

1. **[2026-07-27] Master bug list lives in `docs/BUG_BACKLOG.md`**
   Do instead: keep open items there (R1/R2 IDs + waves A–D); mark fixed with commit; don’t scatter audits only in chat.

2. **[2026-07-24] Always commit + push when finished (this chat / this product)**
   Do instead: end every completed change set with commit → push → Pages deploy so the user can check live.

3. **[2026-07-25] All modules must match Module-1 Learn A craft (not length theater)**
   Do instead: every sub-chapter passes craft `validateChapterContent` + `measure-content-pads` = 0/720. Factory builds via `craft-from-theme` (no Practice order / lemma-loop pads). Never mark fixed from char count alone. M01 Learn A (`…0101`) is the craft rubric for all 720.

4. **[2026-07-25] Review = vocab + grammar only**
   Do instead: no character/plot quizzes; no Marc/Marie/Paris flashcards; names OK in reading clickable dict, not in Review/Flashcards.

5. **[2026-07-25] Theory must teach meanings before grammar examples**
   Do instead: every Theory First brief starts with **Words to learn first (meanings)**; never *mon frère* before *frère = brother*; deep multi-section briefs.

6. **[2026-08-27] Match / open lessons / mobile safe-area**
   Do instead: shuffle both match columns; every playable lesson is open (status: not started / in progress % / completed). Today’s Reading M1 X/20 + daily 300 words; mobile nav `pb-safe` + main `pb-[calc(4rem+env(safe-area))]`.

7. **[2026-07-25] Learn / Review / Rules wiring**
   Do instead: resolve `BUNDLED_LESSONS` (720 A/B/C/D); Review + rule unlock scan all `BUNDLED_CHAPTER_IDS`; lesson page pathway fallback if DB row missing; static-generate all playable IDs; **DB must seed all 720 rows** or complete/FK fail.

## Domain Behavior Guardrails

1. **[2026-07-28] Lesson Back / Center stats — no scroll gate**
   Do instead: stage in `?stage=` + `pushState`/`popstate`; **never** block Continue on scroll-to-end (user rejected — unreliable). Center heatmap = `words_read`; Words = reviewed; chart `Mon W1 '26`; articles via `shouldCountDailyArticle`.

2. **[2026-07-27] Prove score polluted by remediation extras**
   Do instead: never append `buildRemediationExercises` into Prove (D) scoring set; gate score on chapter drills only (`allowHints={!isProve}` stays).

3. **[2026-07-27] Sign-out leaves local progress + vault for next account**
   Do instead: clear `french-course:completed-chapters` + `ladf-vocab-vault-v1` on sign-out, or scope both keys by `user.id`.

4. **[2026-07-27] AuthGate hard-kicks mid-lesson on session loss**
   Do instead: soft banner + draft answers to sessionStorage before `/login/`; don’t unmount lesson on first `SIGNED_OUT`.

5. **[2026-07-27] Rules/Review ignore local completed chapters**
   Do instead: unlock + Review backfill via `mergeCompletedChapterIds` (same as Home/LessonClient), not remote-only `user_chapter_progress`.

6. **[2026-07-27] Center `today` baked at static export build**
   Do instead: compute heatmap “today” in client (`new Date()`), never from SSG page props.

7. **[2026-08-27] Home progress flash before local load**
   Do instead: boot Home with loading state until local completed + in-progress percents load (don’t paint false Not started).

8. **[2026-07-27] `completeLesson` catch marks local complete on any throw**
   Do instead: mark local only after enqueue intent succeeds; never on pre-save auth failure.

9. **[2026-07-27] Multi-tab local vault last-write-wins**
   Do instead: CAS merge on write (`mergeVaultItem`); `subscribeLocalVault` + ReviewClient storage listener.

10. **[2026-07-27] Typed drills lock on blur forever**
    Do instead: cloze/translate/conjugation need Confirm; no `onBlur` auto-submit; allow edit until Confirm.

## Shell & Command Reliability

1. **[2026-07-24] Assumed `gh` on PATH**
   Do instead: use `/tmp/ghcli/*/bin/gh` (or locate) for Pages deploy watches when `gh` is missing.

2. **[2026-08-26] `tests/**/*.test.ts` fails on GitHub Actions**
   Do instead: `tsx --test tests/*.test.ts` — Linux npm does not expand `**`.

3. **[2026-08-26] Private course lives on Hostinger, not Pages**
   Do instead: deploy `out/` (no `NEXT_PUBLIC_BASE_PATH`) to `french.worldhealthshop.com` (`public_html/french`). Folder password via `.htaccess` + `.htpasswd` (user `french`). Do not deploy to `worldhealthshop.com` itself. Keep GitHub **private**. CI workflow tests only — never `deploy-pages` (that would republish the course).
