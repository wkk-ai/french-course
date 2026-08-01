# Craft generator v2 (factory lessons)

## Input (theme)

Required: `id`, `title`, `grammar`, `ruleSlugs`, `meanings[]`, `focus[]`, `dialogue[]` (seed only), `exercises[]` (scrubbed).

Ignored as learner copy: Prove-gate `readingFr`, Examinateur ritual dialogue, `prove chunk` EN, theorySections with remediate runbooks.

## Output

Built by `buildCraftLesson` in `src/lib/pathway/craft-from-theme.ts`:

- Tutor brief (meanings-first, traps, chunks, register, optional Prove “what you must show”)
- Scene reading ≥220 FR words, unique names/place from theme id hash
- Named-character dialogue ≥12 with arc
- ≥22 drills across multiple categories (no `-padN`, no plot distractors)

## Acceptance per module batch

1. `validateChapterContent` ok for every chapter in batch  
2. `npx tsx scripts/measure-content-pads.ts` exit 0  
3. Tap coverage test still green  
4. No AUTHOR_PAD_DENYLIST hits in brief/reading/dialogue/setting  

## Vocab co-PR

New French content words in scenes must exist in `BUNDLED_VOCABULARY` (or allowlisted proper nouns) in the **same** change set.
