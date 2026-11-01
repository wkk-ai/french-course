# L'Art du Français

French for real conversation: daily life and work. Reading-first, with tappable words, visual real-life documents, a tenses guide you can open any time, spaced review and a grammar rulebook.

Goal: hold a normal conversation and a business conversation. Rare, literary vocabulary belongs in separate skippable modules.

## What is in the app

- **Learn**, in three tracks: **Conversation** (main path), **Business** (work French), **Advanced reading** (optional, skippable). 36 modules x 5 units x A/B/C/D (720 chapters). Module 1 is hand-written; later modules are generated and still being audited. Track list: `src/lib/pathway/tracks.ts`.
- **Real-life documents** inside lessons: chat, menu, bill, family tree, agenda (Module 1 so far). Words are tappable. English can be hidden.
- **Tenses** tab: "How do I say it?" Pick a goal (talk about the future, say what happened, be polite, say "if"...). Each page has when to use it, how to build it, everyday and work sentences, full conjugation tables and a quiz. Always open, no order.
- **Listen button**: the phone reads French aloud. Listen only. No voice recording or grading.
- **Review**: spaced repetition on words you met.
- **Rules**: grammar rulebook.
- **Center**: progress stats.

## Login and sync (Neon)

- Email + password login (Neon Auth). Asked once per phone; after that the app opens offline.
- Login goes through a small relay (`neon-functions/auth-relay`, Neon Function `authrelay` in project `french-course-auth-proxy`, US East because Functions are not in São Paulo yet). Reason: iPhone Safari blocks cookies between github.io and neon.tech; the relay keeps the Neon Auth cookie and the app uses no browser cookies. Redeploy it with the Neon MCP `deploy_function` or `neon functions deploy authrelay --src neon-functions/auth-relay/index.mjs`.
- Progress is saved on the phone first, then synced to Neon when online (table `learner_state`, one row per person per key; row security means each person only reads and writes their own rows).
- Merge rules never lose progress from either device (`src/lib/cloud/merge.ts`).
- Neon project: `french-course` (`flat-sky-76475546`, São Paulo region). The database sleeps when idle and wakes in under a second; no keep-alive job is needed.
- The Neon addresses in `src/lib/cloud/config.ts` are public by design. Never put a database password or connection string in the app.
- After creating your own account, turn off new sign-ups: Neon Console > project french-course > Auth > Email and password > disable sign-up.
- Honest limit: GitHub Pages is a public static host. Login protects your progress, not the lesson text (the lesson files can still be downloaded by anyone who knows the address).

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
npm run build:pages                   # same build as the deploy; needs internet (Google Fonts)
```

## Offline on iPhone

Open the site in Safari, Add to Home Screen, open "Save course" once on wifi.

## Docs

- [PRD.md](./PRD.md): product ideas (some parts are out of date)
- [COURSE_STRUCTURE.md](./COURSE_STRUCTURE.md): pathway design
- [docs/BUG_BACKLOG.md](./docs/BUG_BACKLOG.md): bug list
- [AGENTS.md](./AGENTS.md) and [.claude/napkin.md](./.claude/napkin.md): rules and past mistakes

## Deployment: GitHub Pages

- Every push to `main` runs tests, the content check and the build, then publishes to https://wkk-ai.github.io/french-course/ (`.github/workflows/deploy-pages.yml`). A failing test blocks the deploy.
- One-time setup: GitHub repo > Settings > Pages > Source: GitHub Actions (or `GH_TOKEN=... python3 scripts/configure-github-pages.py`).
- A private repo needs a paid GitHub plan for Pages; otherwise make the repo public.
- No secrets are needed.
