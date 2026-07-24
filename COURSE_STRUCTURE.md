# French Course Structure — Pathway, Duration & Content Map

| Field | Value |
| --- | --- |
| **Product** | L'Art du Français (reading, grammar, vocabulary) |
| **Companion doc** | [PRD.md](./PRD.md) |
| **Recommended duration** | **18–24 months** (standard track) |
| **Outcome target** | **CEFR C1 reading** · **~8,000 tracked lemmas** · full tense/mood system · register & nuance |
| **Shipped today** | **Module 1 only** (4 deep chapters) · Review/Vocab Vault wired · Modules 2–12 = pathway shell |

---

## 0. Honest audit (read this first)

### Are we covering “the entire French language”?

**No — not yet.** A fluent reader of French needs roughly:

| Domain | What “fluent reading” requires | Status in this product |
| --- | --- | --- |
| Vocabulary | ~8,000–10,000 high-utility lemmas + collocations | **~300** bundled in Module 1; rest planned |
| Grammar | All indicative tenses, conditionnel, subjunctive, passive, relatives, discourse | **Present + A1 foundations** shipped; rest mapped |
| Nuance | Register (*tu/vous*, soutenu/familier/argot), false friends, connectors, idioms | Started in Module 1 briefs; deep work in later modules |
| Volume | ~150k–250k words of guided reading over the course | Module 1 ≈ **1,100** reading words total |
| Retention | SRS + mistake remediation for months | **Review page live**; lessons enqueue words + grammar misses |

Finishing **chapter 1.1 in one minute** was a real signal that early chapters were demos, not study units. Module 1 is now rebuilt to **~30–60+ minutes per chapter**. That still leaves **~92 planned chapters** unauthored.

### Why 12 × 4 was too weak

| Old plan | Problem |
| --- | --- |
| 12 modules × **4** chapters = **48** weeks | One chapter/week cannot absorb A1→C1 if each chapter is thin |
| “18+ lemmas” quality bar (Module 1) | Far below the **60–100 new lemmas/week** adults need for multi-year fluency |
| ~30-token readings | Not enough input for grammar to stick |
| 10 exercises | Not enough retrieval practice |

**New default:** **12 modules × 8 chapters = 96 chapters**, each a **full study session** (not a snack). Calendar ≈ **18–24 months** at 1 chapter/week + weekly Review.

### Shipped vs planned (snapshot)

| Layer | Planned | Shipped |
| --- | ---: | ---: |
| Modules (pathway) | 12 | 12 shell titles in DB |
| Chapters (pathway) | **96** (target) / 48 shell today | **4 playable** (Module 1) |
| Tracked lemmas | ~8,000 | **~297** in Module 1 bundle |
| Review / Vocab Vault UI | Yes | **Yes** — lessons enqueue lemmas; mistakes appear under Remembrance |
| Modules 2–12 lessons | Full map below | **Not authored yet** |

---

## 1. What “fluent” means here

This product trains **reading + grammar + vocabulary**, not speaking.

Fluency target = you can:

* Read **news, essays, novels, admin French** with a dictionary only for niche terms
* Parse **all standard tenses/moods** (including subjunctive & literary past recognition)
* Feel **register** (soutenu / courant / familier / argot) and common idioms
* Hold **~8,000 core lemmas** in long-term memory via SRS

That is **years of input** for most adults. Compressing it into six months produces recognition without retention.

### Vocabulary math

| Milestone | Cumulative lemmas | CEFR (reading) |
| --- | ---: | --- |
| Survival social | 1,000 | A1 |
| Daily life + past/future | 2,200 | A2 |
| Opinions, media, most tenses | 4,000 | B1 |
| Abstract topics, nuance | 6,000 | B2 |
| Literary / formal / idioms | **8,000+** | **C1 reading** |

Sustainable adult pace: **~10–15 new lemmas/day that stick**. Over **20 months** ≈ **6,000–9,000** new + reinforcement → **~8,000** course total is realistic.

### Tracks

| Track | Calendar | Daily commitment | End level |
| --- | ---: | --- | --- |
| **Intensive** | **15 months** | 60–75 min | Strong B2 → C1 reading |
| **Standard (recommended)** | **18–24 months** | 45–60 min | **C1 reading prep** |
| **Relaxed** | **30 months** | 25–35 min | B2+ → C1 |

**5–6 months** is only honest for an **A2 bridge**, not “whole French.”

---

## 2. Course architecture (revised)

```
Course (12 modules ≈ 18–24 months)
 └── Module (theme + CEFR band · 8 chapters · ~5–7 weeks)
      └── Chapter (1 deep study unit)
           ├── Pre-lesson brief (theory + nuance traps)
           ├── Guided reading (250–800+ words, omni-clickable)
           ├── Conversation / routine speech
           ├── Vocabulary set (SRS seed on complete)
           ├── Grammar drills (20–30 items)
           └── Spiral review hooks → Review tab
```

| Level | Modules | Chapters | New lemmas (approx.) | Grammar focus |
| ---: | ---: | ---: | ---: | --- |
| A1 | 1–2 | 16 | 1,400 | Present, articles, negation, questions, near future, possessives |
| A2 | 3–4 | 16 | 1,400 | Passé composé, imparfait, futur, pronouns *y/en*, COD/COI |
| B1 | 5–7 | 24 | 2,200 | PQP, conditionnel, relatives, subjunctive intro, discourse |
| B2 | 8–10 | 24 | 2,000 | Full subjunctive, passive, causative, connectors, reported speech |
| C1 prep | 11–12 | 16 | 1,000 | Passé simple (recognition), register, admin, literary, idioms |

**Totals (target):** **12 modules · 96 chapters · ~8,000 tracked lemmas**.

**Weekly rhythm (standard):** 4–5 study days (brief → reading → dialogue → drills) · **1 Review day** · 1–2 rest/flex.

### Chapter quality bar (non-negotiable)

Every authored chapter must meet:

| Block | Minimum |
| --- | --- |
| Theory brief | **900+ characters**, with **nuance traps** (register, false friends, silent letters) |
| Guided reading | **220+ French words** (connected prose) |
| Conversation | **12+ turns** applying the chapter grammar |
| New lemmas | **60–100** made clickable (meanings + example phrase) |
| Exercises | **22–30**, locked after answer, wrong → correct + explanation |
| Study time | **~30–60+ minutes** for a careful learner |

---

## 3. Module map (96 chapters)

Lemma lists are **curriculum targets**. Words marked *(review)* spiral from earlier chapters.

> **Implementation note:** The live app currently exposes a **48-chapter pathway shell**. Module 1’s **4 chapters** are fully authored to the quality bar above. Expanding the DB pathway from 48 → 96 chapters is the next platform step; until then, author denser content inside each module’s chapters and split modules when the pathway is upgraded.

---

### Module 1 — Les Fondamentaux *(A1 · Weeks 1–8)* — **SHIPPED (4 deep chapters)**

**Goal:** Identity, politeness, *être/avoir*, gender, greetings, numbers/time, café, family — with **tu/vous** and register awareness from day one.

| Ch | Title | Grammar | New | Focus |
| ---: | --- | --- | ---: | --- |
| 1.1 | Bonjour, je m'appelle… | Subject pronouns; *être*; *c'est* vs *il/elle est*; greetings | 70+ | First meetings, nationality, *habiter*, politeness ladder |
| 1.2 | Les chiffres et le calendrier | Numbers; days; *avoir* for age; time adverbs | 70+ | Age, week planning, *aujourd'hui/demain/hier* |
| 1.3 | Au café | *prendre/vouloir/aimer/payer*; articles & partitives | 70+ | Ordering, bill, *s'il vous plaît* |
| 1.4 | Ma famille | *mon/ma/mes*; kinship; *avoir* + people | 70+ | Family descriptions, agreement |

**Shipped depth (Module 1):** ~297 lemmas in dictionary · ~1,100 reading words · 24 exercises × 4 · 14–16 dialogue turns each.

**When pathway expands to 8 chapters/module**, split Module 1 further into: alphabet/phonetics, *aller* + places, questions (*est-ce que*), and a Module 1 checkpoint reading.

---

### Module 2 — La vie quotidienne *(A1 · Weeks 9–16)*

Routine, town, weather, negation, questions.

| Ch | Title | Grammar | New | Themes |
| ---: | --- | --- | ---: | --- |
| 2.1 | Ma journée | Present -ER/-IR/-RE; reflexives | 90 | se lever, travailler, matin/soir |
| 2.2 | Les horaires | Time *à/de…à*; *quart/demi* | 80 | schedules, school/work |
| 2.3 | En ville | Prepositions; *il y a* | 90 | rue, métro, magasin, directions |
| 2.4 | Demander son chemin | Questions; politeness | 80 | où, comment, pardon |
| 2.5 | Le temps qu'il fait | Impersonal *il*; weather | 85 | beau/mauvais, pluie, vent |
| 2.6 | S'habiller | Clothing; *porter* | 85 | vêtements, couleurs |
| 2.7 | Ce n'est pas possible | Negation *ne…pas/jamais/plus* | 80 | rien, personne, *de* after negation |
| 2.8 | Checkpoint — Une semaine à Paris | Mixed A1 | 60 | long reading + review drills |

---

### Module 3 — Passé et souvenirs *(A2 · Weeks 17–24)*

| Ch | Title | Grammar | New |
| ---: | --- | --- | ---: |
| 3.1 | Hier soir | Passé composé (*avoir*) | 90 |
| 3.2 | Verbes du weekend | Irregular PP (*fait, dit, vu…*) | 85 |
| 3.3 | Vacances | PC with *être* (DR MRS VANDERTRAMP) | 90 |
| 3.4 | Accords du participe | Agreement rules | 75 |
| 3.5 | Quand j'étais petit | Imparfait | 95 |
| 3.6 | Habitudes d'autrefois | Imparfait narratives | 85 |
| 3.7 | Il pleuvait… soudain | PC vs imparfait | 90 |
| 3.8 | Checkpoint — Récit de voyage | Mixed past | 70 |

---

### Module 4 — Futur, projets et personnes *(A2 · Weeks 25–32)*

| Ch | Title | Grammar | New |
| ---: | --- | --- | ---: |
| 4.1 | Je vais + infinitif | Futur proche | 80 |
| 4.2 | Demain | Futur simple | 90 |
| 4.3 | Irréguliers du futur | être, avoir, aller, faire, pouvoir… | 85 |
| 4.4 | Je te le dis | COD pronouns | 85 |
| 4.5 | Je lui parle | COI pronouns | 80 |
| 4.6 | On y va | *y* and *en* | 85 |
| 4.7 | Les fêtes | Comparatives / superlatives | 90 |
| 4.8 | Checkpoint — Projets d'avenir | Mixed A2 | 70 |

---

### Module 5 — Santé, corps et obligations *(B1 · Weeks 33–40)*

| Ch | Title | Grammar | New |
| ---: | --- | --- | ---: |
| 5.1 | Chez le médecin | Body; health lexicon | 95 |
| 5.2 | Impératif | Affirmative / negative | 80 |
| 5.3 | Il faut / on doit | Obligation | 85 |
| 5.4 | Il faut que… | Subjunctive triggers (intro) | 100 |
| 5.5 | Être / avoir / aller / faire au subj. | Core irregulars | 90 |
| 5.6 | En marchant | Present participle / gérondif | 80 |
| 5.7 | Les règles | Public signs; formal *vous* | 85 |
| 5.8 | Checkpoint — Une journée malade | Mixed | 70 |

---

### Module 6 — Travail et société *(B1 · Weeks 41–48)*

| Ch | Title | Grammar | New |
| ---: | --- | --- | ---: |
| 6.1 | Mon premier job | Work lexicon | 95 |
| 6.2 | Avant cela… | Plus-que-parfait | 90 |
| 6.3 | Si j'avais… | Conditionnel présent; *si* type 2 | 95 |
| 6.4 | Je voudrais / je pourrais | Modal conditionnel | 85 |
| 6.5 | La presse | *qui / que / où* | 100 |
| 6.6 | Dont (intro) | *dont* | 90 |
| 6.7 | On dit que… | Passive intro; *on* | 85 |
| 6.8 | Checkpoint — Article de journal | Mixed | 75 |

---

### Module 7 — Relations et émotions *(B1 · Weeks 49–56)*

| Ch | Title | Grammar | New |
| ---: | --- | --- | ---: |
| 7.1 | Amitié et amour | Emotion lexicon | 90 |
| 7.2 | Penser que / ne pas penser que | Indicative vs subjunctive | 95 |
| 7.3 | Ce qui / ce que / ce dont | Free relatives | 90 |
| 7.4 | Se disputer / se réconcilier | Reciprocals | 85 |
| 7.5 | Intensité | *très, trop, assez, si* | 80 |
| 7.6 | Lettres personnelles | *tu/vous* register | 85 |
| 7.7 | Courriel professionnel | Formal closings | 90 |
| 7.8 | Checkpoint — Une lettre difficile | Mixed | 70 |

---

### Module 8 — France et francophonie *(B2 · Weeks 57–64)*

| Ch | Title | Grammar | New |
| ---: | --- | --- | ---: |
| 8.1 | La République | Institutions; passive | 95 |
| 8.2 | Laïcité et débat | Formal opinion | 90 |
| 8.3 | Québec | Lexical variation | 100 |
| 8.4 | Afrique francophone | Culture + lexicon | 100 |
| 8.5 | Belgique & Suisse | Variation | 85 |
| 8.6 | D'ici demain | Futur antérieur | 85 |
| 8.7 | Se faire couper les cheveux | Causative *faire* | 90 |
| 8.8 | Checkpoint — Portrait francophone | Mixed | 75 |

---

### Module 9 — Opinions et débats *(B2 · Weeks 65–72)*

| Ch | Title | Grammar | New |
| ---: | --- | --- | ---: |
| 9.1 | Pour ou contre | Connectors | 95 |
| 9.2 | Cependant / néanmoins | Contrast | 85 |
| 9.3 | Bien que / quoique | Concessive subjunctive | 95 |
| 9.4 | Discours rapporté | Backshift | 100 |
| 9.5 | Verbes de déclaration | affirmer, nier, suggérer | 90 |
| 9.6 | Si j'avais su | Conditionnel passé; *si* type 3 | 95 |
| 9.7 | Regret et hypothèse | nuance | 85 |
| 9.8 | Checkpoint — Éditorial | Mixed | 80 |

---

### Module 10 — Science, tech et environnement *(B2 · Weeks 73–80)*

| Ch | Title | Grammar | New |
| ---: | --- | --- | ---: |
| 10.1 | Le numérique | Tech lexicon; nominalization | 110 |
| 10.2 | Données et vie privée | Abstract nouns | 95 |
| 10.3 | Le climat | Environment | 100 |
| 10.4 | Dont (advanced) | Quantities / *dont* | 90 |
| 10.5 | Lequel / laquelle | Complex relatives | 90 |
| 10.6 | Il fit un geste | Passé simple recognition | 85 |
| 10.7 | La recherche | Academic register | 95 |
| 10.8 | Checkpoint — Vulgarisation | Mixed | 80 |

---

### Module 11 — Art, littérature et registre *(C1 prep · Weeks 81–88)*

| Ch | Title | Grammar | New |
| ---: | --- | --- | ---: |
| 11.1 | Au musée | Art lexicon | 95 |
| 11.2 | Décrire une œuvre | Rich adjectives | 90 |
| 11.3 | Extrait littéraire | PS + imparfait literary | 100 |
| 11.4 | Figures de style | Metaphor, irony | 85 |
| 11.5 | Argot et SMS | Register decoder | 90 |
| 11.6 | Idiomes courants | *coup de foudre*, *avoir le cafard*… | 100 |
| 11.7 | Discours formel | Subjunctive past; fixed expressions | 90 |
| 11.8 | Checkpoint — Deux registres | Mixed | 75 |

---

### Module 12 — Maîtrise et monde réel *(C1 prep · Weeks 89–96)*

| Ch | Title | Grammar | New |
| ---: | --- | --- | ---: |
| 12.1 | Administratif | Forms, préfecture, CAF | 100 |
| 12.2 | Contrats et notices | Dense formal French | 90 |
| 12.3 | False friends | *actuellement, attendre, librairie*… | 90 |
| 12.4 | Pièges avancés | *depuis/pendant*, *savoir/connaître* | 85 |
| 12.5 | Synthèse B2/C1 | Essay model connectors | 80 |
| 12.6 | Médias longs | 900–1,200 word reading | 70 |
| 12.7 | Capstone prep | Mixed tense radar | 60 |
| 12.8 | Capstone — In The Wild | Import + annotate | 40 |

**Final reading exam:** ~1,500 words, all tenses; grammar radar toward C1 thresholds.

---

## 4. Grammar coverage checklist

Every item appears in briefs, readings, and drills at least twice (teach + spiral).

| Domain | Topics | Intro | Spiral |
| --- | --- | --- | --- |
| Present | All groups; reflexive; impersonal | M1–2 | All |
| Past | PC, imparfait, PQP, passé simple (rec.) | M3, 6, 10–11 | 4–12 |
| Future | Proche, simple, antérieur | M4, 8 | 5–12 |
| Conditional | Present, past; *si* clauses | M6, 9 | 7–12 |
| Subjunctive | Present, past; triggers | M5, 7, 9, 11 | 8–12 |
| Imperative | Aff/neg; formal | M5 | 12 |
| Voice | Passive, causative | M6, 8 | 9–10 |
| Pronouns | COD/COI, *y/en*, relatives, *ce-*, *lequel*, *dont* | M4, 6–7, 10 | 8–12 |
| Negation | pas, jamais, plus, personne, rien | M2 | All |
| Connectors | Time, cause, contrast, opinion | M3+ | 9–12 |
| Register | Tu/vous, soutenu/familier/argot | M1, 7, 11 | 11–12 |

---

## 5. Review system (Vocab Vault)

| Feature | Behavior |
| --- | --- |
| **Lesson complete** | All clickable lemmas from reading + dialogue are enqueued for SRS |
| **Wrong exercise** | Grammar category logged → Remembrance Queue |
| **Review tab** | Due words (SM-2) + unresolved mistakes |
| **Fallback** | Local vault if remote vocab seed is blocked |

---

## 6. Production estimates (full 96-chapter course)

| Metric | Target |
| --- | ---: |
| Chapters | **96** |
| Guided reading words | **~180,000–220,000** |
| Unique lemmas | **~8,000** |
| Exercises | **~2,400–2,800** |
| Grammar Rulebook entries | **~120–150** |
| Calendar (standard) | **18–24 months** |

---

## 7. Summary

| Question | Answer |
| --- | --- |
| Covering all of French already? | **No.** Pathway + Module 1 deep content only. |
| Is 12×4 enough? | **No** for C1 reading fluency. Target **12×8 = 96**. |
| Ideal length? | **18–24 months** at 45–60 min/day. |
| What changed after the 1-minute chapter? | Module 1 chapters rebuilt to **30–60+ min** depth; Review enqueue fixed; structure doc raised to fluency bar. |
| Next content priority | Author **Module 2** (8 chapters) to the same quality bar, then expand pathway IDs 48→96. |
