# Bug backlog — L'Art du Français

Saved audit list. Two exhaustive rounds (logic/content + UX/UI/auth).  
Last updated: **2026-07-27** (dictionary tap miss driven to 0% across 720 lessons).

**Status key:** `open` · `fixed` · `wontfix`  
**Severity:** P0 break learning · P1 serious friction · P2 polish

---

## Wave map (for builds)

| Wave | Focus |
|------|--------|
| **A** | Author/meta pads out · tappable dict · Review names · mistakes resolve · Prove score clean · Rules/Review local merge |
| **B** | English-out-of-reading · clone pads · meta/junk quizzes · Prove shells · Theory First substance · stronger CI |
| **C** | Blur→Confirm · popup clamp · Home load gate · leave-lesson guard · Prove fail CTAs · zoom · flashcards order · a11y |
| **D** | Auth/sign-out local clear · draft answers · Center today client-side · multi-tab · double-submit · perf (bundle size) |

---

## Round 1 — Logic & content

### P0

| ID | Status | Bug | Evidence / scale |
|----|--------|-----|------------------|
| R1-01 | fixed | Author/AI notes in Theory First — craft factory + live denylist (2026-08-01) |
| R1-02 | fixed | Meta French pads in Reading — craft scenes replace lemma loops (2026-08-01) |
| R1-03 | fixed | Reading/dialogue words missing from dictionary (no lemma) | 2026-08-27: names/cities are real lemmas; tap miss **0 / 720**; no allowlist pass |
| R1-04 | fixed | English leaking into “French” reading (gloss dumps, EN titles, Prove labels) | 256+ lessons / 511 themes |
| R1-05 | fixed | Identical pad paragraphs cloned (“Lecture de consolidation…”) | ×525 |
| R1-06 | fixed | CI length-only theater — structural craft validate + measure + Pages test gate (2026-08-01) |
| R1-07 | fixed | Review still seeds proper nouns (Marc/Paris) via DB `chapter_vocabulary` on complete | Remote `complete_chapter` now skips proper nouns; client filter + seed cleanup also shipped |
| R1-08 | fixed | Mistakes never clear (`is_resolved` never set true) → rem drills forever | LessonClient + migrations |
| R1-09 | fixed | Prove score / pass gate includes remediation extras | LessonClient exercises merge |

### P1

| ID | Status | Bug | Notes |
|----|--------|-----|-------|
| R1-10 | fixed | Rules unlock ignores local completed chapters | Home/Lesson merge; Rules don’t |
| R1-11 | fixed | Review backfill ignores local completed chapters | Same desync |
| R1-12 | fixed | `completeLesson` catch can mark chapter done after failed save | Local unlock without remote/Review |
| R1-13 | fixed | ~1.5k–3k meta study quizzes + junk options (`plot` / `spoiler` / `character name`) | Factory grammarCore + distractors |
| R1-14 | fixed | Thin focus lines + generic Prove shells | ~180 Prove themes |
| R1-15 | fixed | Typed answers lock forever on blur | ExerciseCard cloze/translate/conj |
| R1-16 | fixed | Dictionary popup clips off top/edges | Fixed `bottom-full` center |
| R1-17 | fixed | Locked Rules still ship full text in page payload | UI hide only |
| R1-18 | fixed | Some rules unlock late vs when taught | e.g. habiter-prepositions |
| R1-19 | fixed | Wrong answer on name-bearing item can vault Marc/Paris locally | lemmaIdFromExercise |

### P2

| ID | Status | Bug |
|----|--------|-----|
| R1-20 | fixed | Rem alias incomplete (`etre-family` etc.) |
| R1-21 | fixed | Many exercise categories have no remediation template |
| R1-22 | fixed | Daily “articles completed” can double-count |
| R1-23 | fixed | Home flashes wrong “Up next” before progress loads |
| R1-24 | fixed | Center / XP ignore local completes |
| R1-25 | fixed | No signup / forgot password |
| R1-26 | fixed | Pinch-zoom blocked (`maximumScale: 1`) — also Round 2 P0 |
| R1-27 | fixed | Rules “Try it” never records mistakes |
| R1-28 | fixed | RichText thin (no numbered lists / `#` headings) |

### Checked OK (Round 1)

- Pathway 720 A/B/C/D consistent  
- Bundled lessons beat thin DB stubs  
- Prove hints off  
- Match shuffle both columns  
- Favicon base-path fix shipped  
- Classic story-memory detector = 0 (meta quizzes still slip)  

---

## Round 2 — UX / UI / auth (new)

### P0

| ID | Status | Bug | User impact |
|----|--------|-----|-------------|
| R2-01 | fixed | Phone zoom locked (`maximumScale: 1`) | Low-vision can’t enlarge text |
| R2-02 | fixed | Full course pack pulled into client (~2.8MB themes; home `index.html` ~**34MB**) | Home now sends playable stubs only (no resolved lesson bodies) |
| R2-03 | fixed | Leave lesson (Back / X / Rules) wipes all answers — no draft, no “leave?” | Long lesson lost in one tap |
| R2-04 | fixed | Session expiry / sign-out mid-lesson unmounts AuthGate → same wipe | Soft banner + keep lesson mounted on lesson paths |
| R2-05 | fixed | Sign-out does not clear local progress / vocab vault; keys not user-scoped | Next account inherits prior user’s unlock + Review |

### P1

| ID | Status | Bug | User impact |
|----|--------|-----|-------------|
| R2-06 | fixed | Fail Prove: copy says remediate Apply/Integrate but **no links**; Pass stays disabled | Dead end |
| R2-07 | fixed | Wrong MCQ/match answer locked forever — no retry | Can’t recover without restarting lesson |
| R2-08 | fixed | Match/order: no undo; last pair auto-locks | Confirm + Undo on match/order |
| R2-09 | fixed | All 22+ drills on one endless scroll (“Q x of y” feels like carousel) | One exercise at a time + Next |
| R2-10 | fixed | Flashcards: **Again \| Easy \| Hard** — big green Easy in middle | Accidental “I know it” |
| R2-11 | fixed | PWA installable but SW only clears caches — offline fake | Install promise broken |
| R2-12 | fixed | No Sign up / Forgot password | New users stuck |
| R2-13 | fixed | Network fail → dumped to login with no offline message | Looks like auth failure |
| R2-14 | fixed | Top bar / lesson header ignore notch; X under Dynamic Island | Hard to hit Close |
| R2-15 | fixed | Sign-out / Close / X-Ray tap targets &lt; 44px | Fat-finger misses |
| R2-16 | fixed | Review session: bottom nav still live — leave mid-run loses session | ReviewSessionLock hides nav; sticky Exit + beforeunload/Back confirm |
| R2-17 | fixed | XP / streak / Center chapters = remote only | Local finishes invisible in chrome |
| R2-18 | fixed | Center “Reading Activity” ≠ reading words; “Words learned” = any queued lemma | Misleading stats |
| R2-19 | fixed | White text on lime Complete/Pass (`bg-success` + `text-on-primary`) | Hard to read CTA |
| R2-20 | fixed | Dict popup: no X, no Escape; conjugate sheet: backdrop/Esc don’t close; no focus trap | Trap / hard exit |
| R2-21 | fixed | Browser Back mid-lesson exits whole lesson; reopen always Theory | Stage not in URL |
| R2-22 | fixed | `lang="fr"` while chrome is English | Screen readers mispronounce UI |
| R2-23 | fixed | Center heatmap `today` frozen at **build time** (static export) | Wrong week until redeploy |
| R2-24 | fixed | Multi-tab Review vault last-write-wins clobber | `subscribeLocalVault` + always mirror scores locally |
| R2-25 | fixed | Multi-tab Home/Lesson progress stale | `subscribeCompletedChapters` / storage listener |
| R2-26 | fixed | AuthGate `getSession` vs pages `getUser` | Empty progress then kick |
| R2-27 | fixed | Complete-lesson / login double-submit race | Duplicate RPC / enqueue |

### P2

| ID | Status | Bug |
|----|--------|-----|
| R2-28 | fixed | Progress bar jumps 20→45→70→90, never 100; flame chip says “Lesson” like streak |
| R2-29 | wontfix | One tap skips Reading / Dialogue — no “read first” gate (scroll gate removed; unreliable) |
| R2-30 | fixed | X-Ray: most words stay plain (`syntax: none`) — looks broken |
| R2-31 | fixed | Home “Coming soon” uses check icon → looks finished |
| R2-32 | fixed | “Today’s reading” card also shows Pathway % — mixed jobs |
| R2-33 | fixed | Nav icon = house, label = Learn |
| R2-34 | fixed | Login shows raw server error string |
| R2-35 | fixed | Vocab growth chart labels collide (`W1` every month) |
| R2-36 | fixed | Soft 404: no `not-found.tsx`; empty lesson shell soft dead-end | `src/app/not-found.tsx` + lesson `notFound()` |
| R2-37 | fixed | Center / TopBar flash zeros before fetch |
| R2-38 | fixed | Lesson auth-fail gate says “Loading lesson…” while redirecting |
| R2-39 | fixed | Cleanup SW re-registers every visit — brief control flicker |

---

## Suggested fix order (when building)

1. **R1-01…06 + R1-03** — content honesty + tap coverage + CI denylist  
2. **R1-07…09 + R1-10…11** — Review/Prove/mistakes/local merge  
3. **R2-01…05** — zoom, leave guard / drafts, sign-out clear, perf plan  
4. **R2-06…10** — Prove CTAs, retry, flashcard order, exercise paging  
5. Wave B content + Wave C remaining UX  

---

## Notes

- Do **not** delete this file without merging open items elsewhere.  
- When fixing, mark `Status` → `fixed` and link commit/PR.  
- Measured numbers from 2026-07-27 scripts; re-measure after Wave A.

---

## Round 3 — audit 2026-11-01 (open unless marked)

| ID | Status | Bug | Evidence |
|----|--------|-----|----------|
| R3-01 | open | Rule pages for later modules are padded filler. Same generic paragraph repeated 3 times in each section; mentions "listen and repeat" | `public/rules-data/futur.json` and most files there |
| R3-02 | open | Rule examples with English equal to the French sentence | `futur.json` `examplesByGroup` |
| R3-03 | open | Quiz seeds in later themes use junk options ("plot", "story", "never") and meta prompts | `themes-m07-m36.ts` (generator rewrites; output not human-reviewed) |
| R3-04 | open | Dialogue seeds are template chat ("Tu travailles sur : PC regular ?") | `themes-m07-m36.ts` |
| R3-05 | open | Modules 2-36 never read by a native speaker | all generated lessons |
| R3-06 | fixed | Scope too big for the goal: ~15,000 lemmas planned, conversation needs ~2,000 | `COURSE_STRUCTURE.md` |
| R3-07 | fixed | Hard/literary content (passé simple, droit, philosophie, littérature) mixed into the main path; should be a skippable track | `public/rules-data/*`, pathway themes |
| R3-08 | fixed | Dead Supabase keep-alive job (daily ping, app has no database) | workflow removed |
| R3-09 | fixed | `package.json` named `temp_project` | renamed `french-course` |
| R3-10 | fixed | README/PRD/napkin disagree about live host and about Supabase | README now says GitHub Pages + Neon; PRD still describes Supabase (historic) |
| R3-11 | open | Conjugation table in dictionary popup shows participle without agreement for être verbs (only a note) and bare endings under "je" | `LessonClient.tsx` conjugate sheet; new `src/lib/tenses/format.ts` has the correct phrase builder to reuse |
| R3-12 | fixed | No always-open guide to tenses | `/tenses/` (11 pages) |
| R3-13 | fixed | Lessons had no visual real-life material | Module 1 units 1-4 Learn A |
| R3-14 | open | Real-life documents only in 4 chapters of Module 1 | `src/lib/visual/module1-documents.ts` |
| R3-15 | fixed | No listen-only audio | `SpeakButton` (needs iPhone test, voice may need download) |
| R3-16 | open | Business track has no hand-written lessons (email, meetings, phone, negotiation); it reuses generated modules 14, 21, 29, 31 | `tracks.ts` |
| R3-17 | fixed | iPhone Safari blocks cross-site login cookies | Login relay; verified end to end with all cookies off from wkk-ai.github.io (sign-up, sign-in, wrong password, token, upload, download, sign-out revokes). Still to try on the real iPhone |
| R3-18 | open | Neon Auth still allows new sign-ups; turn off after owner account exists | Neon Console |
