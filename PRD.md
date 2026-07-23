# Product Requirements Document: French Learning Web Application

| Field | Value |
| --- | --- |
| **Status** | Draft |
| **Last updated** | 2026-07-23 |
| **UX reference** | Stitch prototypes — `design/stitch-l-art-du-francais/` |
| **Owner** | Product |
| **Primary platform** | Mobile-first web (PWA) |

## Table of contents

1. [Product overview](#1-product-overview)
2. [Technical stack](#2-technical-stack-recommendation)
3. [Core mechanics & discovery engine](#3-core-mechanics--discovery-engine)
4. [Engagement, UX & analytics](#4-deep-engagement-ux--learner-analytics-features)
5. [Database architecture](#5-supabase-database-architecture-postgresql)
6. [Out of scope](#6-out-of-scope)
7. [Release phasing](#7-release-phasing)
8. [Success metrics](#8-success-metrics)
9. [UX design & wireframes](#9-ux-design--wireframes-stitch--linguistique-moderne)

---

## 1. Product Overview

**Objective:** Create a mobile-first, web-based French learning application focused entirely on reading comprehension, structural grammar, and practical vocabulary, deliberately bypassing audio features.

**Target audience:** Learners who want a self-paced, highly structured environment to confidently master French vocabulary and grammar through reading.

**Core philosophy:**

* **Theory before practice:** Clear explanations precede all exercises.
* **Frictionless discovery:** Every word is clickable; curiosity is instantly rewarded.
* **Intelligent personalization:** The app adapts to what the user struggles with and what they care about.
* **Visual phonetic clarity:** Audio is replaced by intuitive visual rules (phonetics, silent letters, liaisons).
* **Respectful learner tracking:** Deep data visualization over superficial gamification; active mistake remediation; life-friendly consistency tracking.

---

## 2. Technical Stack Recommendation

* **Frontend framework:** Next.js (React) — App Router, SSR, and API routes.
* **Styling:** Tailwind CSS for fluid, mobile-first design scaling (tokens aligned with **Linguistique Moderne** — see §9).
* **Icons:** Google Material Symbols Outlined (filled state for active nav and emphasis).
* **Data visualization:** Recharts / D3.js for interactive analytics.
* **PWA & offline:** Service Worker architecture (Serwist / `@ducanh2912/next-pwa`) with IndexedDB local caching.
* **Backend & database:** Supabase (Auth, PostgreSQL DB, Realtime, Edge Functions).
* **Hosting / deployment:** Vercel (frontend) + Supabase Cloud.

---

## 3. Core Mechanics & Discovery Engine

| Feature | Description |
| --- | --- |
| **Linear Pathways** | Gamified map of Modules → Chapters (Beginner to Advanced). |
| **Pre-Lesson Briefs** | Theory, rules, and context presented cleanly before exercises. |
| **Omni-Clickable Text** | Every single word in the app can be clicked for a definition pop-up. |
| **The Verb Engine** | Clicking a verb reveals its full conjugation table across all tenses. |
| **Contextual Translations** | The pop-up highlights the specific meaning used in the current sentence first. |
| **The Idiom & Slang Decoder** | Specialized tag within tooltips flagging idioms (e.g., *coup de foudre* = "love at first sight") and casual SMS abbreviations (e.g., *mdr* = *mort de rire* / LOL). |
| **Register & Formality Detector** | Color badges in tooltips classifying word register: **Soutenu** (Formal), **Courant** (Standard), **Familier** (Informal), **Argot** (Slang). |
| **Silent Phonetics & Liaison Guide** | Strikethrough toggle on unpronounced silent final consonants (e.g., *parl~~ent~~*), visual arc indicators for mandatory liaisons (`les ‿ enfants`), and IPA transcriptions. |
| **Grammar Rulebook & Cross-Reference** | Centralized, searchable library of all French grammar rules. Tooltips on words/verbs include direct links to relevant Rulebook entries. |
| **"In The Wild" Reading Engine** | Sandbox area for pasting external French text (news, recipes, blogs). Tokenizes text instantly with Omni-Clickable dictionary and Verb Engine integration. |

---

## 4. Deep Engagement, UX & Learner Analytics Features

* **The Learner Command Center (Advanced Analytics Dashboard):** Dedicated dashboard page featuring interactive charts (Recharts/D3.js) displaying vocabulary growth curve over time, GitHub-style reading activity heatmap, and granular grammar accuracy breakdowns (e.g., 90% Present vs 40% Passé Composé).
* **Mistake Review & Remediation Center ("Most Mistaken Words"):** A dedicated review tab isolating words and grammar structures with highest error rates. Users can run targeted micro-quizzes and mark items as resolved/mastered once completed.
* **Authentic Sentence Bookmarking & Custom Decks:** Save whole target sentences from modules or "In The Wild" imports into custom decks for contextual SRS review.
* **Bionic Focus Reader:** Toggle bolds the first few letters of each word to guide reading velocity, alongside a line-focus dimming mode for dense paragraphs.
* **Daily Reading Volume Tracker:** Tracks daily words read (e.g., 300 words/day goal) with visual progress rings on the home dashboard.
* **Progressive Web App (PWA) Architecture (Offline Mode):** Service Worker strategy caching current chapters, core dictionary, and daily Vocab Vault tasks for offline reading on subways or flights. Silently syncs progress to Supabase upon reconnection.
* **"Life-Friendly" Streak Forgiveness:** Allows users to "bank" extra reading time on weekends to earn "Streak Freezes", preventing punitive streak resets due to busy schedules.
* **The "X-Ray" Sentence Scanner:** A toggle switch above reading exercises color-coding sentence syntax (Nouns blue, verbs red, adjectives green).
* **Spaced Repetition System (SRS) "Vocab Vault":** Supabase-backed tracking using SM-2 logic to inject clicked words into daily warm-up quizzes right before predicted forgetting thresholds.
* **Cognitive Load Tracking (Time-on-Text):** Detects 15s+ hesitation on sentences to offer subtle grammar hints.
* **The "False Friend" Alert System:** Flags false cognates (e.g., *actuellement*) with caution indicators and trap explanations.
* **Dynamic Interest-Based Scenarios (AI Integration):** LLM API integration generating customized reading scenarios based on user interests while maintaining module grammar constraints.
* **Gamified "Syntax Builder":** Tactile drag-and-drop sentence construction with scrambled French word blocks.
* **Adaptive Diagnostic & Placement Engine:** Periodic diagnostic assessments benchmarking current reading comprehension across CEFR levels (A1–C1).

---

## 5. Supabase Database Architecture (PostgreSQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Master Vocabulary & Idiom Dictionary
CREATE TABLE vocabulary (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   word VARCHAR(255) NOT NULL,
   base_translation VARCHAR(255) NOT NULL,
   part_of_speech VARCHAR(50),
   gender VARCHAR(10),
   register VARCHAR(50) DEFAULT 'Courant', -- 'Soutenu', 'Courant', 'Familier', 'Argot'
   ipa_pronunciation VARCHAR(255),
   is_idiom BOOLEAN DEFAULT FALSE,
   is_slang BOOLEAN DEFAULT FALSE,
   idiom_explanation TEXT,
   memory_hook TEXT,
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User SRS Progress (The "Vocab Vault")
CREATE TABLE user_vocab_progress (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
   vocab_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE NOT NULL,

   -- SRS Algorithm Fields (SM-2)
   repetition_count INTEGER DEFAULT 0,
   ease_factor REAL DEFAULT 2.5,
   interval_days INTEGER DEFAULT 0,

   -- Timing & Mistake Tracking
   next_review_at TIMESTAMPTZ DEFAULT NOW(),
   last_reviewed_at TIMESTAMPTZ,
   total_encounters INTEGER DEFAULT 1,
   mistake_count INTEGER DEFAULT 0,
   is_graduated BOOLEAN DEFAULT FALSE,

   UNIQUE(user_id, vocab_id)
);

-- 3. Mistake Log & Remediation Tracking ("Most Mistaken Words")
CREATE TABLE user_mistakes (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
   vocab_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE,
   grammar_category VARCHAR(100),
   error_context TEXT,
   error_count INTEGER DEFAULT 1,
   is_resolved BOOLEAN DEFAULT FALSE,
   resolved_at TIMESTAMPTZ,
   last_error_at TIMESTAMPTZ DEFAULT NOW(),
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Streak & Banked Time Tracking
CREATE TABLE user_streaks (
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
   current_streak INTEGER DEFAULT 0,
   longest_streak INTEGER DEFAULT 0,
   banked_minutes REAL DEFAULT 0.0,
   streak_freezes_available INTEGER DEFAULT 0,
   last_active_date DATE DEFAULT CURRENT_DATE
);

-- 5. Learner Grammar Mastery Metrics (Command Center)
CREATE TABLE user_grammar_mastery (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
   grammar_category VARCHAR(100) NOT NULL,
   total_attempts INTEGER DEFAULT 0,
   correct_attempts INTEGER DEFAULT 0,
   updated_at TIMESTAMPTZ DEFAULT NOW(),
   UNIQUE(user_id, grammar_category)
);

-- 6. Custom "In The Wild" Saved Texts
CREATE TABLE user_custom_texts (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
   title VARCHAR(255) NOT NULL,
   content TEXT NOT NULL,
   word_count INTEGER NOT NULL,
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Grammar Reference Library
CREATE TABLE grammar_rules (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   slug VARCHAR(100) UNIQUE NOT NULL,
   title VARCHAR(255) NOT NULL,
   category VARCHAR(100) NOT NULL,
   summary TEXT NOT NULL,
   full_explanation TEXT NOT NULL,
   examples JSONB NOT NULL,
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Bookmarked Sentences (Contextual Vault)
CREATE TABLE user_bookmarked_sentences (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
   sentence_french TEXT NOT NULL,
   sentence_english TEXT NOT NULL,
   highlighted_word_id UUID REFERENCES vocabulary(id),
   source_type VARCHAR(50) NOT NULL, -- 'module', 'in_the_wild'
   notes TEXT,
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Daily Volume Tracking
CREATE TABLE user_daily_reading_stats (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
   date DATE DEFAULT CURRENT_DATE,
   words_read INTEGER DEFAULT 0,
   minutes_spent REAL DEFAULT 0.0,
   articles_completed INTEGER DEFAULT 0,
   UNIQUE(user_id, date)
);

-- Row Level Security (RLS) Policies
ALTER TABLE user_vocab_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_grammar_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_custom_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarked_sentences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_reading_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own vocab progress" ON user_vocab_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own mistakes" ON user_mistakes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own streaks" ON user_streaks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own grammar mastery" ON user_grammar_mastery FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own custom texts" ON user_custom_texts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public view grammar rules" ON grammar_rules FOR SELECT USING (true);
CREATE POLICY "Users access own bookmarked sentences" ON user_bookmarked_sentences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own daily reading stats" ON user_daily_reading_stats FOR ALL USING (auth.uid() = user_id);
```

---

## 6. Out of Scope

* **Audio playback and pronunciation practice** (listening/speaking drills, TTS as a primary learning mode).
* **Live tutoring, chat rooms, or social feeds.**
* **Native mobile apps** (iOS/Android store binaries) in initial releases; PWA is the mobile delivery mechanism.
* **Full CEFR certification** or proctored exams; diagnostics are for placement and progress only.

---

## 7. Release Phasing

| Phase | Focus | Representative deliverables |
| --- | --- | --- |
| **MVP** | Read + click-to-learn loop | Auth (Supabase), linear pathways, pre-lesson briefs, omni-clickable text, verb engine, grammar rulebook (read-only), basic exercises, `vocabulary` + user progress tables |
| **V1** | Personalization & retention | Vocab Vault (SM-2), mistake remediation center, daily reading tracker, streaks with banked time, Command Center v1 (vocab curve + heatmap), PWA offline for current chapter + dictionary |
| **V2** | Depth & differentiation | In The Wild engine, bookmarked sentences / custom decks, X-Ray scanner, bionic reader, false-friend alerts, cognitive load hints, syntax builder |
| **V3** | Scale & adaptation | Adaptive diagnostic (CEFR), LLM interest-based scenarios (with grammar guardrails), full grammar mastery breakdowns in Command Center |

Dependencies: MVP discovery engine (tokenization, dictionary, verb conjugations) blocks most later features; RLS and user-scoped tables must ship with first authenticated release.

---

## 8. Success Metrics

* **Engagement:** Median daily words read; weekly active learners completing at least one lesson segment.
* **Learning signal:** Reduction in repeat mistakes on `user_mistakes` items marked resolved; SM-2 review completion rate for Vocab Vault.
* **Comprehension:** Grammar category accuracy trends in `user_grammar_mastery`; diagnostic level stability or improvement over 90 days.
* **Product fit:** Click-through rate on word tooltips; bookmark and custom-text save rate; offline session completion with successful sync.
* **Retention:** 4-week retention; streak length distribution with freeze usage (validates life-friendly design without punishing churn).

---

## 9. UX Design & Wireframes (Stitch / Linguistique Moderne)

Interactive HTML prototypes and the **Linguistique Moderne** design system define the target UI for implementation. Source assets live in the repository at:

| Asset | Path |
| --- | --- |
| Design system spec | `design/stitch-l-art-du-francais/linguistique_moderne/DESIGN.md` |
| Home — modules & chapters | `design/stitch-l-art-du-francais/home_m_dulos_e_cap_tulos/code.html` |
| Reading lesson — X-Ray & word tooltip | `design/stitch-l-art-du-francais/li_o_de_leitura_x_ray_mode/code.html` |
| Grammar Rulebook | `design/stitch-l-art-du-francais/grammar_rulebook/code.html` |
| Learner Command Center | `design/stitch-l-art-du-francais/centro_de_comando_analytics_final_fix/code.html` |

Open any `code.html` file in a browser to review layout, spacing, and component behavior. Prototypes use Tailwind CDN with extended theme tokens matching production intent.

### 9.1 Brand & design principles

**Style name:** Linguistique Moderne — **Optimistic Modernism** with **Tactile Minimalism**.

* Friendly, rounded UI (Nunito Sans) paired with a rigorous reading layer (Source Serif 4).
* French Tricolore as digital semantics: blue = structure/nouns, red = verbs and critical actions, green = progress/success, orange = warnings.
* No soft ambient shadows; depth comes from **2px borders + 4px bottom “press” borders** on cards and buttons (active state: translate 2px down, bottom border shrinks to 2px).
* Reading canvas uses `#FFFFFF` (`reading-bg`); app shell uses `#F9F9F9` (`background`) to separate chrome from content.
* **Fluid-to-fixed layout:** chrome uses full width; reading and rule content max at **680px** (`max-width-reading`).

### 9.2 Design tokens (implementation)

| Token group | Key values |
| --- | --- |
| **Primary** | `#003E7A` (primary), `#0055A4` (primary-container) |
| **Accent / verbs** | `#EF4135` (syntax-verb), `#B71513` (secondary) |
| **Success / adjectives** | `#58CC02` (success, syntax-adj) |
| **Warning** | `#FF9600` |
| **Reading ink** | `#3C3C3C` (ink-dark), `#777777` (ink-medium) |
| **Syntax highlighting** | Nouns `#0055A4`, verbs `#EF4135`, adjectives `#58CC02` — 10% opacity fill + 2px bottom border |
| **Typography** | UI: Nunito Sans (12–32px scale). Reading: Source Serif 4 at 18px / 30px line height |
| **Spacing** | 4px base unit; 16px mobile margins, 48px desktop; 24px gutter |
| **Radii** | 8px UI default, 12px buttons/cards (`xl`), full pills for badges and filters |

**Linguistic UI (must match prototypes):**

* Silent letters: ~40% opacity + `line-through`.
* Liaisons: thin arc under word junction (`outline-variant` / ink-medium).
* Register badges: pill tags (e.g. **Courant**) on word tooltips.

Full token YAML lives in `linguistique_moderne/DESIGN.md`.

### 9.3 Information architecture & navigation

**Primary navigation (mobile):** fixed bottom bar, four tabs — **Learn**, **Review**, **Rules**, **Center**. Active tab: primary color, **4px top border**, filled Material icon.

**Desktop (Rules screen pattern):** bottom nav hidden (`md:hidden`); **fixed left sidebar** (64 width) with same four destinations; active item uses `primary-fixed` tint + left border accent.

**Global top bar (most screens):** fixed 64px height, streak/goal or search, optional XP label (`label-caps`). Lesson flow suppresses global bottom nav for focus (close + linear progress only).

| Tab | PRD mapping | Prototype |
| --- | --- | --- |
| Learn | Linear pathways, daily reading goal, module map | Home HTML |
| Review | Vocab Vault, mistake remediation, SRS | Not wireframed yet |
| Rules | Grammar Rulebook & cross-links from tooltips | Grammar Rulebook HTML |
| Center | Learner Command Center analytics | Command Center HTML |

### 9.4 Screen specifications

#### A. Home — Modules & chapters (`home_m_dulos_e_cap_tulos`)

Maps to **Linear Pathways**, **Daily Reading Volume Tracker**, and streak UX.

* **Header:** “Reading Goal” + streak icon (warning color); XP in caps on the right.
* **Stats banner:** tactile card with **Current Streak** (e.g. 15 days) and **Unit/Module mastery %** (success color).
* **Pathway map:** vertical module sections with icon header, completion label, chapter dividers (centered caps labels).
* **Chapter nodes:** circular progress ring (8px stroke, rounded caps); states — **active** (primary ring + “START” bounce pill), **completed** (success ring + star), **locked** (grayscale, lock icon, no progress fill).
* **Chapter card:** title + “Lesson X of Y” or “Completed” / “Locked”; 4px bottom border accent on active chapter.

#### B. Reading lesson — X-Ray mode (`li_o_de_leitura_x_ray_mode`)

Maps to **Omni-Clickable Text**, **X-Ray Sentence Scanner**, **Silent Phonetics & Liaison Guide**, **Register & Formality Detector**, **Verb Engine** entry point.

* **Header:** close control, **lesson progress bar** (success fill, optional shimmer), compact **streak pill**.
* **Instruction:** headline-md — “Read and analyze the sentence”.
* **Reading canvas:** white card, 32px serif line with wrap; **X-RAY toggle** (success when on) top-right.
* **X-Ray on:** syntax classes on tokens (noun/article blue, verb red); legend below sentence.
* **Word click:** anchored tooltip — lemma, register pill, contextual translation, **Conjugate** (primary, verb engine). *Prototype includes a “Play” control; exclude from MVP per §6 (no audio-first features).*
* **Footer:** full-width **Check** CTA (success, tactile bottom border).

#### C. Grammar Rulebook (`grammar_rulebook`)

Maps to **Grammar Rulebook & Cross-Reference** and per-rule mastery tied to `grammar_rules` / `user_grammar_mastery`.

* **Header:** full-width **search** input (rounded-full, search icon).
* **Title block:** “Grammar Rulebook” + subtitle in reading serif.
* **Category pills:** horizontal scroll — All, Verbs, Nouns, Syntax, Phonetics; active pill filled primary; category-colored inactive pills.
* **Rule cards:** 2-column grid on desktop; category chip (syntax colors), optional “hot” icon, title, 2-line summary, **mastery bar** (success / warning / empty by percent), chevron affordance.
* **Detail view:** not in prototype; implement as drill-down with `full_explanation` + examples JSONB.

#### D. Learner Command Center (`centro_de_comando_analytics_final_fix`)

Maps to **Learner Command Center** analytics.

* **Header:** “Learner Command Center” + XP.
* **Vocabulary Growth:** area + line chart (primary blue), weekly x-axis — implement with Recharts in production.
* **Reading Activity:** 7-column **GitHub-style heatmap** (success green intensity scale).
* **Grammar Accuracy:** **radar chart** by tense/category (Present, Past, Future, Subjunctive, Conditional) — green fill; data from `user_grammar_mastery`.

### 9.5 Component library (from prototypes)

| Component | Behavior |
| --- | --- |
| **Tactile / flat-3D card** | White surface, 2px border, 4px bottom border, `xl` radius |
| **Progress ring** | SVG circle, 8px stroke, primary (in progress) or success (complete) |
| **Progress bar** | 4px–16px height, rounded-full, success fill on `surface-container-high` track |
| **Bottom nav item** | Icon + `label-caps`; active: top border + filled icon |
| **Word tooltip** | Popover above token, pointer caret, register badge, action row |
| **Toggle (X-Ray)** | Pill switch; checked state uses success green |

### 9.6 UX ↔ PRD traceability

| PRD feature (§3–§4) | Primary screen |
| --- | --- |
| Linear Pathways | Home |
| Daily reading / streaks | Home header + banner; lesson streak pill |
| Omni-clickable + verb conjugation | Reading lesson tooltip |
| X-Ray Sentence Scanner | Reading lesson toggle |
| Silent letters & liaisons | Reading lesson token styling |
| Grammar Rulebook | Rules tab |
| Command Center charts | Center tab |
| Mistake Review / Vocab Vault | Review tab (UX TBD; nav slot reserved) |

### 9.7 Implementation notes

* Port Tailwind `theme.extend` blocks from any prototype into `tailwind.config` (colors, fontSize, spacing aliases).
* Support `darkMode: "class"` as in prototypes for future theme toggle.
* Use `pb-safe` / safe-area insets on bottom nav and sticky CTAs for PWA on iOS.
* Lesson routes should use the **focused chrome** pattern (no bottom nav) from the reading prototype; tab routes use bottom nav or desktop sidebar.
