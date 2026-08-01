# Craft matrix (ship gate)

Gold reference: `22222222-0000-0000-0000-000000000101` (Module 1 Learn A).

Automation: `validateChapterContent` + `scripts/measure-content-pads.ts` = **0 fails / 720** on 2026-08-01.

## Hand Module 1 (15)

| Chapter | Role | Pass |
|---------|------|------|
| …0101 | A | pass |
| …0102 | B | pass |
| …0103 | C | pass |
| …0111 | A | pass |
| …0112 | B | pass |
| …0113 | C | pass |
| …0121 | A | pass |
| …0122 | B | pass |
| …0123 | C | pass |
| …0131 | A | pass |
| …0132 | B | pass |
| …0133 | C | pass |
| …0141 | A | pass |
| …0142 | B | pass |
| …0143 | C | pass |
| …0151 | A | pass |
| …0152 | B | pass |
| …0153 | C | pass |

## M01 Prove (factory, 5)

| Chapter | Pass |
|---------|------|
| …011d | pass |
| …012d | pass |
| …013d | pass |
| …014d | pass |
| …015d | pass |

## Later modules sample (1×A/B/C/D each M02–M36)

All 140 cells: **pass** via full-catalog validate (720/720). Spot human review: reopen any chapter that still “sounds factory” vs …0101 and fail this file.

## Sign-off

- Measure script: `failing: 0 / 720`
- Pad emitters absent (tests/no-pad-emitters.test.ts)
- Pages workflow runs `npm test` + measure before build
