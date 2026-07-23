# L'Art du Français

Reading-first French learning with structured grammar, vocabulary review, and learner analytics. The shipped starter curriculum contains Module 1 (four complete lessons); the remaining 44 chapters are visible as authored-pathway placeholders.

## Requirements

- Node.js 20+
- A Supabase project or local Supabase CLI stack

## Setup

1. Copy `.env.example` to `.env.local` and set the public Supabase URL and anon key.
2. Apply database changes and seed the curriculum:

```bash
supabase db reset       # local development: migrations + seed
# or
supabase db push        # linked hosted project: migrations
supabase db execute --file supabase/seed.sql --linked
```

3. Install dependencies and run the app:

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm run build
```

## Hosted Supabase checklist

- Add the production URL in Supabase Auth → URL Configuration → Site URL and Redirect URLs.
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the deployment environment.
- Apply `supabase/migrations/` before loading `supabase/seed.sql`.
- Do not expose the service-role key to the browser. This app does not require it at runtime.

## Current product boundary

- Functional: authentication, progression, four Module 1 lessons, clickable dictionary, conjugation modal, grammar Rulebook, SM-2 review, mistake queue, analytics, and offline shell caching.
- Planned content: 44 additional lesson bodies and the expanded vocabulary corpus described in [COURSE_STRUCTURE.md](./COURSE_STRUCTURE.md).
