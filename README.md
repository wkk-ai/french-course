# L'Art du Français

French for real conversation: daily life and work. Reading-first, with tappable words, visual real-life documents, a tenses guide you can open any time, spaced review and a grammar rulebook.

Goal: hold a normal conversation and a business conversation. Rare, literary vocabulary belongs in separate skippable modules.

## What is in the app

- **Learn**: 36 modules x 5 units x A/B/C/D (720 chapters). Module 1 is hand-written. Later modules are generated and still being audited.
- **Real-life documents** inside lessons: chat, menu, bill, family tree, agenda (Module 1 so far). Words are tappable. English can be hidden.
- **Tenses** tab: "How do I say it?" Pick a goal (talk about the future, say what happened, be polite, say "if"...). Each page has when to use it, how to build it, everyday and work sentences, full conjugation tables and a quiz. Always open, no order.
- **Listen button**: the phone reads French aloud. Listen only. No voice recording or grading.
- **Review**: spaced repetition on words you met.
- **Rules**: grammar rulebook.
- **Center**: progress stats.

## No accounts, no database

Progress and review live on the phone (local storage). The app does not call Supabase at runtime. Old Supabase files (`supabase/`, `src/utils/supabase/`) are leftovers and can be removed.

## Run

Needs Node.js 20+.

```bash
npm install
npm run dev
```

## Check before shipping

```bash
npm test                              # logic, content and tenses tests
npx tsx scripts/measure-content-pads.ts   # must say failing: 0 / 720
npm run lint
npm run build                         # needs internet (Google Fonts)
```

## Offline on iPhone

Open the site in Safari, Add to Home Screen, open "Save course" once on wifi.

## Docs

- [PRD.md](./PRD.md): product ideas (some parts are out of date)
- [COURSE_STRUCTURE.md](./COURSE_STRUCTURE.md): pathway design
- [docs/BUG_BACKLOG.md](./docs/BUG_BACKLOG.md): bug list
- [AGENTS.md](./AGENTS.md) and [.claude/napkin.md](./.claude/napkin.md): rules and past mistakes

## Deployment

TODO owner to confirm: the napkin says the live site is on Hostinger (deployed from the owner's Mac), older docs said GitHub Pages. There is no deploy workflow in this repo.
