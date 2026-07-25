---
# Grammar Rule — content spec example
# This file shows the TARGET depth for one rule in the Rulebook.
# App mapping: slug `subject-pronouns` → unlock after Lesson 1.1 complete.

id: "30000000-0000-0000-0000-000000000001"
slug: subject-pronouns
title: Subject pronouns
category: Syntax
summary: French verbs change with the subject — je, tu, il/elle/on, nous, vous, ils/elles. You usually keep the pronoun in speech.

unlock:
  type: chapter_complete
  chapter_ids:
    - "22222222-0000-0000-0000-000000000101"  # Lesson 1.1 · Bonjour, je m'appelle…

linked_lessons:
  - lesson: "1.1"
    title: "Bonjour, je m'appelle…"
    href: "/lesson/22222222-0000-0000-0000-000000000101/"
  - lesson: "1.2"
    title: "Les chiffres et le calendrier"
    note: "Review — nous, vous in class scenes"

related_rules:
  - slug: etre-present
    label: "Être in the present tense"
  - slug: cest-versus-il-est
    label: "C'est vs il/elle est"

mastery:
  exercise_categories:
    - subject-pronouns
  targets:
    introduced: "Lesson 1.1 completed"
    practiced: "≥70% on subject-pronoun drills"
    solid: "3 correct reviews in a row, 7+ days apart"

authoring_bar:
  min_words: 900
  min_examples: 12
  requires_table: true
  requires_contrast_en: true
  requires_common_mistakes: true
  requires_mini_drills: true
---

# Subject pronouns

> **Quick reference** · Unlocks after **Lesson 1.1**

| Pronoun | Meaning | Register / notes |
|---------|---------|------------------|
| **je** | I | Drops to **j'** before vowel: *j'habite* |
| **tu** | you (one person, informal) | Friends, peers, children |
| **il** | he, it (m.) | Also impersonal *il* = “it” (*il pleut*) |
| **elle** | she, it (f.) | |
| **on** | one, we (spoken) | Informal “we”; verb = **3rd person singular** |
| **nous** | we | Formal written “we”; always plural verb |
| **vous** | you (formal **or** plural) | Default with strangers |
| **ils** | they (m. or mixed) | |
| **elles** | they (f. only) | All female group |

**One-line rule:** The subject pronoun tells **who does the action**. French almost always keeps it — unlike Spanish, you cannot drop it.

---

## Tab 1 · Quick reference *(default view — ~30 sec)*

- **je / tu / il / elle / on / nous / vous / ils / elles**
- Verb ending must **match** the pronoun: *je suis* but *nous sommes*.
- **tu** = informal · **vous** = polite or plural · when unsure → **vous**.
- **on** = “we” in conversation; conjugate like **il/elle**: *on habite*, not *on habitons*.

---

## Tab 2 · Deep dive *(~5–8 min read)*

### Why this matters

Every French sentence with an action needs a clear subject. English keeps word order (*The dog bites the man* vs *The man bites the dog*). French leans on **verb endings** and **pronouns** so the listener always knows who acts.

In Module 1 you meet pronouns in introductions, nationality, and where people live. Get this wrong and every verb sounds off — not just one word.

### The full paradigm

French has **nine** subject forms (seven if you count *il/elle* as one slot). They are **not** optional in normal speech.

| Person | Singular | Plural |
|--------|----------|--------|
| 1st | je | nous |
| 2nd | tu · **vous** | **vous** |
| 3rd | il · elle · **on** | ils · elles |

**Person** = who is talking or who is talked about.  
**Number** = one vs many.  
**Gender** (3rd person only) = *il/ils* vs *elle/elles*.

### Step-by-step: pick the right pronoun

1. **Who acts?** (I, you, he, we, they…)
2. **How many?** (one → singular column; two+ → plural)
3. **Formal or informal?** (one “you” → *tu* or *vous*)
4. **All female group?** (they → *elles*; otherwise *ils*)

**Example walkthrough**

> *We are students in Paris.*

- Who acts? → **we** → 1st person plural → **nous**
- Verb with *être*: **nous sommes**
- Full sentence: **Nous sommes étudiants à Paris.**

> *You (stranger) are French?*

- One addressee, not a friend → **vous**
- **Vous êtes français ?** (or *française* / *français* depending on who you address)

### *On* — the pronoun textbooks under-teach

In everyday French, **on** often replaces **nous**:

| Written / careful | Spoken / common |
|-------------------|-----------------|
| Nous habitons à Lyon. | On habite à Lyon. |
| Nous sommes amis. | On est amis. |

- **On** takes **il/elle** verb forms: *on est*, *on habite*, *on a*.
- Meaning: “we”, “people”, or vague “one” (*On dit que…* = People say that…).
- In Lesson 1.1 reading you also see impersonal **on** in *quand on dérange* (when one disturbs someone).

### *Tu* vs *vous* — social grammar, not optional

| Use **tu** | Use **vous** |
|------------|--------------|
| Friends, family, children | Strangers, elders, professionals |
| Peers who offer *tu* | Shopkeepers, teachers, first meeting |
| *Salut* situations | *Bonjour* + surname situations |

**Module 1 pattern:** Marc asks Marie *Tu es française ?* — they're young and informal. The teacher says *Comment **vous** appelez-vous ?* — classroom formality.

**Practical rule:** Start with **vous**. Switch to **tu** only when a French speaker invites it (*On peut se tutoyer ?*).

### Contrast with English

| English habit | French reality |
|---------------|----------------|
| Drop “you” in imperatives only | Drop subject? **Almost never** (*Suis français* ❌) |
| “You” = one word | **tu** AND **vous** — must choose |
| “It” for weather | **il** pleut, **il** faut — no *ça* as subject here |
| “They” gender-neutral | **ils** if any male in group; **elles** if all female |
| “We” always *nous* | Spoken **on** is normal |

### Common mistakes (and fixes)

| ❌ Don't say | ✅ Say instead | Why |
|-------------|---------------|-----|
| *Suis étudiant.* | **Je** suis étudiant. | Subject cannot be dropped |
| *Tu êtes français ?* | **Tu es** français ? | *tu* → *es*, not *êtes* |
| *Vous es professeur ?* | **Vous êtes** professeur ? | *vous* → *êtes*, not *es* |
| *On habitons à Paris.* | **On habite** à Paris. | *on* = 3rd singular |
| *Elles est françaises.* | **Elles sont** françaises. | Plural subject → plural verb |
| *Ils est anglais.* | **Ils sont** anglais. | *ils* needs *sont* |
| *Je m'appelle tu Thomas.* | **Je m'appelle Thomas.** | Name doesn't need *tu* |

### Pronunciation notes

- **je** before vowel → **j'** : *j'habite*, *j'aime* (elision).
- **tu** before vowel → **t'** in fast speech: *t'habites* (still write *tu habites* in full forms).
- **ils/elles** + vowel: *ils habitent* — the **s** may link (*ils‿ont*) in liaison; the **-ent** ending is silent.

### How this connects to *être* (next rule)

Subject pronouns are the **left column** of every conjugation table. With *être* in the present:

| | |
|--|--|
| je | suis |
| tu | es |
| il / elle / on | est |
| nous | sommes |
| vous | êtes |
| ils / elles | sont |

You cannot master *être* without stable pronouns. See: **Être in the present tense**.

### How this connects to *c'est* vs *il est*

- **Je suis** + adjective/nationality → *Je suis français.*
- **C'est** + name → *C'est Marie.* (identification, not a subject-pronoun swap)
- **Il/elle est** + adjective → *Elle est française.* (description)

Subject pronouns are still there — the trap is choosing **c'est** vs **il/elle est**, not dropping the pronoun.

---

## Tab 3 · Examples from your lessons *(read in context)*

Sentences you have already seen in **Lesson 1.1**. Tap any line in the app to open the dictionary.

### Introductions

| French | English | Pronoun focus |
|--------|---------|---------------|
| **Je** m'appelle Marc. | My name is Marc. | *je* + elision *m'appelle* |
| **Moi, c'est** Marie. | I'm Marie. | *moi* emphasis; *c'est* for name |
| **Tu** es française ? | Are you French? (informal) | *tu* + *es* |
| **Vous** appelez-vous ? | What is your name? (formal) | *vous* + reflexive |
| **Nous** sommes amis. | We are friends. | *nous* + plural verb |
| **Ils** habitent en France. | They live in France. | *ils* + *-ent* (silent) |

### Nationality & description

| French | English | Pronoun focus |
|--------|---------|---------------|
| **Je** suis français. | I am French. | 1st singular |
| **Elle** est française. | She is French. | *elle* + agreement |
| **Il** habite à Paris. | He lives in Paris. | *il* subject |
| **Vous** êtes une classe internationale. | You are an international class. | plural *vous* |

### Informal *on*

| French | English | Pronoun focus |
|--------|---------|---------------|
| **On** dit souvent merci. | People often say thank you. | impersonal *on* |
| *pardon quand **on** dérange* | sorry when one disturbs | indefinite *on* |

### Mini-dialogue (Lesson 1.1 conversation)

```
Marc   : Bonjour ! Je m'appelle Marc. Enchanté.
Marie  : Salut Marc ! Moi, c'est Marie. Enchantée.
Marc   : Tu es française ?
Marie  : Oui, je suis française. Et toi ?
Marc   : Je suis français. J'habite à Paris.
Marie  : Moi aussi ! J'habite à Lyon. Comment ça va ?
```

**Pronouns used:** je (×3), tu (×1), implicit subject in *Enchanté(e)*.  
**Notice:** Marie answers *Oui, **je** suis française* — subject repeated for clarity.

---

## Tab 4 · Try it *(inline drills — not story memory)*

### Drill A · Match pronoun to English

| French | → English |
|--------|-----------|
| nous | ? |
| elles | ? |
| vous | ? |
| on | ? |

<details>
<summary>Answers</summary>

- nous → we  
- elles → they (all female)  
- vous → you (formal or plural)  
- on → we / one / people (context)

</details>

### Drill B · Choose *tu* or *vous*

1. You ask a university professor their name. → **vous**  
2. You ask your classmate Marie (same age, friendly). → **tu**  
3. You speak to two strangers in a shop. → **vous**  
4. You text your brother. → **tu**

### Drill C · Complete with the correct *être* form

1. Je ___ étudiant. → **suis**  
2. Tu ___ française ? → **es**  
3. Nous ___ à Paris. → **sommes**  
4. Ils ___ anglais. → **sont**  
5. On ___ contents. → **est**

### Drill D · Fix the error

1. *Vous es professeur ?* → **Vous êtes professeur ?**  
2. *Elle sont française.* → **Elle est française.**  
3. *On sommes amis.* → **On est amis.**

---

## Practice in the app

| Action | Where |
|--------|--------|
| Re-read rule in lesson | Lesson 1.1 brief → chips **Subject pronouns** |
| Exercises tagged `subject-pronouns` | Lesson 1.1 · Review weak spots |
| Related rules | **Être present** · **C'est vs il/elle est** |

**Mastery path**

1. **Introduced** — complete Lesson 1.1  
2. **Practiced** — ≥70% on pronoun + *être* drills  
3. **Solid** — Review queue: 3× correct, spaced over a week  

---

## Author notes (not shown to learner)

- **Do not** quiz plot (*where does Marie live*). Quiz **forms** and **register**.
- **Do not** flashcard proper names (Marc, Marie) as vocabulary targets.
- Regenerate `exercise.category: subject-pronouns` for all drills in this rule.
- Estimated learner time: **6–10 minutes** first read; **2 minutes** on return (Quick reference tab).

---

*Example authored for French Course Module 1 · Rulebook v2 spec · ~1,100 words in learner-facing sections*
