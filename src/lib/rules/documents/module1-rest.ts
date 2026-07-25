import type { GrammarRuleDocument } from '@/lib/rules/types'

const C1 = '22222222-0000-0000-0000-000000000101'
const C2 = '22222222-0000-0000-0000-000000000102'
const C3 = '22222222-0000-0000-0000-000000000103'
const C4 = '22222222-0000-0000-0000-000000000104'

function baseExamples(items: Array<{ french: string; english: string; focus?: string }>) {
  return items
}

export const ETRE_PRESENT: GrammarRuleDocument = {
  id: '30000000-0000-0000-0000-000000000002',
  slug: 'etre-present',
  title: 'Être in the present tense',
  category: 'Verbs',
  summary: 'Être means “to be” and is irregular in the present: je suis, tu es, il/elle/on est, nous sommes, vous êtes, ils/elles sont.',
  full_explanation:
    'Use être for identity, nationality, profession, location with adjectives, and descriptions. Memorize the six forms — they never follow the regular -er pattern. Pair every form with the matching subject pronoun.',
  examples: [
    { french: 'Je suis Marc.', english: 'I am Marc.' },
    { french: 'Elle est française.', english: 'She is French.' },
  ],
  unlockChapterIds: [C1],
  linkedLessons: [{ chapterId: C1, lessonLabel: 'Lesson 1.1', title: "Bonjour, je m'appelle…" }],
  relatedRules: [
    { slug: 'subject-pronouns', label: 'Subject pronouns' },
    { slug: 'cest-versus-il-est', label: "C'est vs il/elle est" },
  ],
  masteryCategories: ['être-present', 'etre-present'],
  quickReference: {
    bullets: [
      'je suis · tu es · il/elle/on est · nous sommes · vous êtes · ils/elles sont',
      'Use for identity, nationality, profession, descriptions.',
      'Never “je es” or “nous suis”.',
      'Agreement: Je suis français / Elle est française.',
    ],
    table: {
      headers: ['Pronoun', 'être (présent)'],
      rows: [
        ['je', 'suis'],
        ['tu', 'es'],
        ['il / elle / on', 'est'],
        ['nous', 'sommes'],
        ['vous', 'êtes'],
        ['ils / elles', 'sont'],
      ],
    },
  },
  deepDive: {
    whyItMatters:
      'Être is one of the two most frequent verbs in French (with avoir). Every introduction, nationality, and many descriptions run through it. Module 1 Lesson 1.1 is built on je suis / tu es / nous sommes — if these forms are shaky, the whole chapter collapses.',
    sections: [
      {
        heading: 'What être expresses',
        body: 'Identity and names in some patterns (Je suis étudiant), nationality (Elle est française), profession (Il est professeur), temporary or permanent description (Nous sommes contents), and set phrases like Nous sommes lundi (day of the week with “we are”). It does NOT express age — that is avoir (J’ai vingt ans).',
      },
      {
        heading: 'Irregular — learn by heart',
        body: 'There is no shortcut from an infinitive stem. Write the table daily for a week. Notice silent letters: the -s in suis is not stressed; êtes has a circumflex; sont ends with a silent -t.',
        table: {
          headers: ['Form', 'Rough sound cue'],
          rows: [
            ['suis', 'swee'],
            ['es', 'eh'],
            ['est', 'eh'],
            ['sommes', 'sum'],
            ['êtes', 'et'],
            ['sont', 'so(n)'],
          ],
        },
      },
      {
        heading: 'Agreement with adjectives',
        body: 'After être, adjectives agree with the subject: Il est français / Elle est française / Ils sont français / Elles sont françaises. Nationality adjectives are not capitalized in French.',
      },
      {
        heading: 'Negative and questions',
        body: 'Negation: Je ne suis pas anglais. Questions: Tu es française ? / Êtes-vous français ? Inversion with vous is common in polite speech: Êtes-vous… ?',
      },
    ],
    contrastEn: {
      headers: ['English', 'French'],
      rows: [
        ['I am 20 years old', 'J’ai vingt ans (avoir, not être)'],
        ['I am a student', 'Je suis étudiant (no “a” required the same way)'],
        ['They are French', 'Ils sont français / Elles sont françaises'],
      ],
    },
    commonMistakes: [
      { wrong: 'Je es français.', right: 'Je suis français.', why: 'je → suis' },
      { wrong: 'Nous suis ici.', right: 'Nous sommes ici.', why: 'nous → sommes' },
      { wrong: 'Vous est professeur.', right: 'Vous êtes professeur.', why: 'vous → êtes' },
      { wrong: 'Je suis vingt ans.', right: 'J’ai vingt ans.', why: 'Age uses avoir' },
      { wrong: 'Elle est français.', right: 'Elle est française.', why: 'Adjective agrees' },
    ],
    pronunciationNotes: ['est and es sound similar; context + subject tell them apart.', 'êtes: pronounce the first vowel; final -s silent.'],
  },
  examplesByGroup: [
    {
      heading: 'Identity & nationality',
      items: baseExamples([
        { french: 'Je suis étudiant.', english: 'I am a student.' },
        { french: 'Tu es anglais.', english: 'You are English.' },
        { french: 'Elle est française.', english: 'She is French.' },
        { french: 'Nous sommes amis.', english: 'We are friends.' },
        { french: 'Vous êtes professeur.', english: 'You are a teacher.' },
        { french: 'Ils sont contents.', english: 'They are happy.' },
      ]),
    },
    {
      heading: 'From Lesson 1.1',
      items: baseExamples([
        { french: 'Je suis français.', english: 'I am French.' },
        { french: 'Oui, je suis française.', english: 'Yes, I am French.' },
        { french: 'Vous êtes une classe internationale.', english: 'You are an international class.' },
        { french: 'Paul est anglais.', english: 'Paul is English.' },
      ]),
    },
  ],
  drills: [
    {
      id: 'etre-cloze',
      title: 'Fill the blank',
      exercise: {
        id: 'etre-c1',
        type: 'cloze',
        category: 'être-present',
        source: 'grammar',
        text: 'Nous ___ étudiants.',
        answers: ['sommes'],
        prompt: 'Type the form of être.',
        explanation: 'nous → sommes.',
      },
    },
    {
      id: 'etre-mcq',
      title: 'Pick the correct form',
      exercise: {
        id: 'etre-m1',
        type: 'mcq',
        category: 'être-present',
        source: 'grammar',
        options: ['Je suis français.', 'Je es français.', 'Je est français.'],
        answer: 0,
        prompt: 'Which sentence is correct?',
        explanation: 'je + suis.',
      },
    },
  ],
}

export const CEST_VS_ILEST: GrammarRuleDocument = {
  id: '30000000-0000-0000-0000-000000000003',
  slug: 'cest-versus-il-est',
  title: "C'est vs il/elle est",
  category: 'Syntax',
  summary: "Use c'est before a noun or name; use il/elle est before an adjective or nationality.",
  full_explanation:
    "C'est identifies or introduces (C'est Marie, C'est un café). Il/elle est describes a known person or thing (Elle est française, Il est grand). Never C'est française for nationality.",
  examples: [
    { french: "C'est Marc.", english: 'That is Marc.' },
    { french: 'Il est français.', english: 'He is French.' },
  ],
  unlockChapterIds: [C1],
  linkedLessons: [{ chapterId: C1, lessonLabel: 'Lesson 1.1', title: "Bonjour, je m'appelle…" }],
  relatedRules: [
    { slug: 'etre-present', label: 'Être in the present tense' },
    { slug: 'subject-pronouns', label: 'Subject pronouns' },
  ],
  masteryCategories: ['cest-versus-il-est'],
  quickReference: {
    bullets: [
      "C'est + noun / name / determiner phrase",
      'Il/elle est + adjective / nationality / profession (no article)',
      "❌ C'est française · ✅ Elle est française",
      "Plural: Ce sont + plural noun (Ce sont mes amis)",
    ],
    table: {
      headers: ["Use c'est…", 'Use il/elle est…'],
      rows: [
        ["C'est Marie.", 'Elle est française.'],
        ["C'est un étudiant.", 'Il est étudiant.'],
        ["C'est important.", 'Il est grand.'],
      ],
    },
  },
  deepDive: {
    whyItMatters:
      "English “it's / that's / he is” collapses into one idea. French splits identification (c'est) from description (il/elle est). Lesson 1.1 reading calls this une différence très importante — because C'est française is a classic beginner error.",
    sections: [
      {
        heading: "C'est for identification",
        body: "Point to or name something: C'est Marc. C'est mon ami. C'est un café. C'est important. After c'est you usually need a noun phrase (article + noun) or a name.",
      },
      {
        heading: 'Il/elle est for description',
        body: 'Describe a person already known: Elle est française. Il est grand. Il est professeur (profession often without article). The subject pronoun matches the person.',
      },
      {
        heading: 'Profession pattern',
        body: "Il est médecin / Elle est professeure — no un/une after il/elle est for many professions. But C'est un médecin when identifying: Who's that? C'est un médecin.",
      },
      {
        heading: 'Ce sont',
        body: "Plural identification uses Ce sont: Ce sont mes parents. Not C'est mes parents in careful French (you'll hear C'est + plural in speech; prefer Ce sont in writing).",
      },
    ],
    contrastEn: {
      headers: ['English', 'French'],
      rows: [
        ["It's Marie.", "C'est Marie."],
        ["She's French.", 'Elle est française.'],
        ["He's a student.", 'Il est étudiant. / C\'est un étudiant.'],
      ],
    },
    commonMistakes: [
      { wrong: "C'est française.", right: 'Elle est française.', why: 'Nationality = il/elle est + adjective' },
      { wrong: "Il est Marie.", right: "C'est Marie.", why: 'Name identification = c\'est' },
      { wrong: "C'est mon amis.", right: 'Ce sont mes amis.', why: 'Plural → ce sont' },
      { wrong: 'Elle est une française.', right: 'Elle est française.', why: 'No article with nationality adjective' },
    ],
  },
  examplesByGroup: [
    {
      heading: 'Identification',
      items: baseExamples([
        { french: "C'est Marc.", english: 'That is Marc.' },
        { french: "Moi, c'est Marie.", english: "I'm Marie." },
        { french: "C'est un café.", english: "It's a café." },
        { french: "C'est important.", english: "It's important." },
      ]),
    },
    {
      heading: 'Description',
      items: baseExamples([
        { french: 'Il est français.', english: 'He is French.' },
        { french: 'Elle est française.', english: 'She is French.' },
        { french: 'Il est étudiant.', english: 'He is a student.' },
        { french: 'Elle est grande.', english: 'She is tall.' },
      ]),
    },
  ],
  drills: [
    {
      id: 'cest-minimal',
      title: 'Choose the correct sentence',
      exercise: {
        id: 'cest-m1',
        type: 'minimal-pair',
        category: 'cest-versus-il-est',
        source: 'grammar',
        options: ["C'est Sophie.", 'Elle est Sophie.', 'Il est Sophie.'],
        answer: 0,
        prompt: 'Identify Sophie by name.',
        explanation: "C'est + name.",
      },
    },
    {
      id: 'cest-mcq',
      title: 'Nationality',
      exercise: {
        id: 'cest-m2',
        type: 'mcq',
        category: 'cest-versus-il-est',
        source: 'grammar',
        options: ['Elle est française.', "C'est française.", 'Elle française.'],
        answer: 0,
        prompt: 'How do you say she is French?',
        explanation: 'Elle est + nationality adjective.',
      },
    },
  ],
}

export const NUMBERS_AND_AGE: GrammarRuleDocument = {
  id: '30000000-0000-0000-0000-000000000004',
  slug: 'numbers-and-age',
  title: 'Numbers and age',
  category: 'Syntax',
  summary: 'French uses avoir, not être, to say how old someone is: j’ai vingt ans.',
  full_explanation:
    'Age = avoir + number + ans. Days of the week are not capitalized. Numbers stay mostly unchanged before nouns. Learn 1–20 solidly, then tens.',
  examples: [
    { french: "J'ai dix-huit ans.", english: 'I am eighteen.' },
    { french: 'Nous sommes trois.', english: 'There are three of us.' },
  ],
  unlockChapterIds: [C2, C4],
  linkedLessons: [
    { chapterId: C2, lessonLabel: 'Lesson 1.2', title: 'Les chiffres et le calendrier' },
    { chapterId: C4, lessonLabel: 'Lesson 1.4', title: 'Ma famille', note: 'Ages in family talk' },
  ],
  relatedRules: [{ slug: 'etre-present', label: 'Être in the present (not for age)' }],
  masteryCategories: ['numbers', 'avoir-age', 'numbers-and-age', 'time', 'days'],
  quickReference: {
    bullets: [
      "Age: J'ai + number + ans (not Je suis + number).",
      'Days: lundi, mardi… — lowercase in French.',
      'Quel âge as-tu ? / Quel âge avez-vous ?',
      'Elle a quinze ans — avoir conjugates with the subject.',
    ],
    table: {
      headers: ['Number', 'French'],
      rows: [
        ['1–5', 'un, deux, trois, quatre, cinq'],
        ['6–10', 'six, sept, huit, neuf, dix'],
        ['11–15', 'onze, douze, treize, quatorze, quinze'],
        ['16–20', 'seize, dix-sept, dix-huit, dix-neuf, vingt'],
      ],
    },
  },
  deepDive: {
    whyItMatters:
      'English “I am twenty” tricks learners into être. French literally says “I have twenty years.” Lesson 1.2 and family talk in 1.4 repeat this pattern constantly. Days and calendar phrases use être differently: Nous sommes lundi / C’est lundi.',
    sections: [
      {
        heading: 'Age formula',
        body: "J'ai vingt ans. Tu as quel âge ? Elle a quinze ans. Nous avons trente ans. Always ans (years) for people. Babies may use mois (months).",
      },
      {
        heading: 'Asking age politely',
        body: 'Informal: Quel âge as-tu ? Formal: Quel âge avez-vous ? Avoid blunt age questions with strangers if unsure of culture — but for the grammar, use avoir.',
      },
      {
        heading: 'Days and the calendar',
        body: 'Days: lundi → dimanche, not capitalized. Aujourd’hui / demain / hier. Quel jour sommes-nous ? → Nous sommes lundi. or C’est lundi.',
      },
      {
        heading: 'Counting people',
        body: 'Nous sommes trois = there are three of us. Combien êtes-vous ? → Nous sommes quatre.',
      },
    ],
    contrastEn: {
      headers: ['English', 'French'],
      rows: [
        ['I am 18.', "J'ai dix-huit ans."],
        ['How old are you?', 'Quel âge as-tu / avez-vous ?'],
        ['Today is Monday.', "Aujourd'hui, c'est lundi. / Nous sommes lundi."],
      ],
    },
    commonMistakes: [
      { wrong: 'Je suis vingt ans.', right: "J'ai vingt ans.", why: 'Age = avoir' },
      { wrong: 'Elle est quinze ans.', right: 'Elle a quinze ans.', why: 'avoir conjugates' },
      { wrong: 'Lundi is Monday (capital L)', right: 'lundi', why: 'Days lowercase in French' },
      { wrong: "J'ai vingt année.", right: "J'ai vingt ans.", why: 'Use ans for age' },
    ],
  },
  examplesByGroup: [
    {
      heading: 'Age',
      items: baseExamples([
        { french: "J'ai vingt ans.", english: 'I am twenty.' },
        { french: 'Tu as quel âge ?', english: 'How old are you?' },
        { french: 'Elle a quinze ans.', english: 'She is fifteen.' },
        { french: 'Nous avons trente ans.', english: 'We are thirty.' },
      ]),
    },
    {
      heading: 'Calendar',
      items: baseExamples([
        { french: "Aujourd'hui, c'est lundi.", english: 'Today is Monday.' },
        { french: 'Demain, c’est mardi.', english: 'Tomorrow is Tuesday.' },
        { french: 'Nous sommes lundi.', english: 'It is Monday.' },
        { french: 'Une année a cinquante-deux semaines.', english: 'A year has fifty-two weeks.' },
      ]),
    },
  ],
  drills: [
    {
      id: 'age-cloze',
      title: 'Age with avoir',
      exercise: {
        id: 'age-c1',
        type: 'cloze',
        category: 'avoir-age',
        source: 'grammar',
        text: "J'___ vingt ans.",
        answers: ['ai'],
        prompt: 'Type the missing word (avoir).',
        explanation: "J'ai vingt ans.",
      },
    },
    {
      id: 'age-translate',
      title: 'Translate',
      exercise: {
        id: 'age-t1',
        type: 'translate',
        category: 'numbers',
        source: 'grammar',
        direction: 'en-fr',
        answers: ['trois', 'Trois'],
        prompt: 'Translate “three”.',
        explanation: 'trois = three.',
      },
    },
  ],
}

export const ARTICLES_PARTITIVES: GrammarRuleDocument = {
  id: '30000000-0000-0000-0000-000000000005',
  slug: 'articles-partitives',
  title: 'Articles for food and drink',
  category: 'Nouns',
  summary: 'Use un/une for one countable item and du/de la/de l’ for an unspecified amount.',
  full_explanation:
    'French articles carry gender and number. At the café: un café (one coffee), de l’eau (some water), du thé. After negation, partitives often become de/d’.',
  examples: [
    { french: 'Je prends un café.', english: 'I am having a coffee.' },
    { french: "Elle veut de l'eau.", english: 'She wants water.' },
  ],
  unlockChapterIds: [C3],
  linkedLessons: [{ chapterId: C3, lessonLabel: 'Lesson 1.3', title: 'Au café' }],
  relatedRules: [{ slug: 'er-present', label: 'Regular -ER verbs (prendre, payer…)' }],
  masteryCategories: ['articles', 'articles-partitives', 'café-vocab', 'ordering'],
  quickReference: {
    bullets: [
      'un / une = one countable unit',
      'du / de la / de l’ = some (amount)',
      'le / la / les = the (specific)',
      'Negation: Je ne veux pas de café.',
    ],
    table: {
      headers: ['Meaning', 'Masculine', 'Feminine', 'Before vowel'],
      rows: [
        ['a / one', 'un', 'une', 'un / une'],
        ['some', 'du', 'de la', "de l'"],
        ['the', 'le', 'la', "l'"],
      ],
    },
  },
  deepDive: {
    whyItMatters:
      'Ordering food without articles sounds broken. Lesson 1.3 (Au café) is built on Je prends un… / Je voudrais de l’…. Gender (café m., eau f.) decides un vs une and du vs de la.',
    sections: [
      {
        heading: 'Countable vs amount',
        body: 'Un café = one coffee (a cup). Du café = some coffee (coffee as a substance). Une eau is rare — prefer de l’eau for water as a drink.',
      },
      {
        heading: 'Gender memory tips',
        body: 'Learn article with the noun: un café, une limonade, de l’eau, du thé, un croissant, une tarte. Never memorize café alone without gender.',
      },
      {
        heading: 'After vouloir / prendre',
        body: 'Je prends un café. Je voudrais de l’eau. Vous désirez ? — answer with article + noun.',
      },
      {
        heading: 'Negation',
        body: 'Affirmative: J’ai du pain. Negative: Je n’ai pas de pain. Partitive/indefinite often → de/d’ in the negative.',
      },
    ],
    contrastEn: {
      headers: ['English', 'French'],
      rows: [
        ['I’d like water', "Je voudrais de l'eau"],
        ['a coffee', 'un café'],
        ['some tea', 'du thé'],
      ],
    },
    commonMistakes: [
      { wrong: 'Je prends café.', right: 'Je prends un café.', why: 'Need an article' },
      { wrong: "Je veux une eau.", right: "Je veux de l'eau.", why: 'Water as amount → de l’' },
      { wrong: 'Je ne veux pas du café.', right: 'Je ne veux pas de café.', why: 'Negation → de' },
      { wrong: 'de le thé', right: 'du thé', why: 'de + le = du' },
    ],
  },
  examplesByGroup: [
    {
      heading: 'Café orders',
      items: baseExamples([
        { french: 'Je prends un café.', english: 'I’ll have a coffee.' },
        { french: 'Je voudrais un thé.', english: 'I would like a tea.' },
        { french: "Elle veut de l'eau.", english: 'She wants water.' },
        { french: 'Nous prenons deux croissants.', english: 'We’re having two croissants.' },
      ]),
    },
    {
      heading: 'Articles in contrast',
      items: baseExamples([
        { french: 'le café', english: 'the coffee (that one / in general)' },
        { french: 'du café', english: 'some coffee' },
        { french: 'un café', english: 'a coffee' },
        { french: "de l'eau", english: 'some water' },
      ]),
    },
  ],
  drills: [
    {
      id: 'art-mcq',
      title: 'One coffee',
      exercise: {
        id: 'art-1',
        type: 'mcq',
        category: 'articles',
        source: 'grammar',
        options: ['un café', 'du café', 'le café'],
        answer: 0,
        prompt: 'One coffee — which article?',
        explanation: 'Un café = one coffee.',
      },
    },
    {
      id: 'art-mcq2',
      title: 'Some water',
      exercise: {
        id: 'art-2',
        type: 'mcq',
        category: 'articles-partitives',
        source: 'grammar',
        options: ["de l'eau", 'une eau', "du l'eau"],
        answer: 0,
        prompt: 'Some water — which form?',
        explanation: "De l'eau — partitive before a vowel.",
      },
    },
  ],
}

export const ER_PRESENT: GrammarRuleDocument = {
  id: '30000000-0000-0000-0000-000000000006',
  slug: 'er-present',
  title: 'Regular -ER verbs in the present',
  category: 'Verbs',
  summary: 'Remove -er and add -e, -es, -e, -ons, -ez, -ent.',
  full_explanation:
    'Most French verbs are -er verbs. Drop -er, add the endings. The ils/elles -ent is usually silent. Watch spelling changes in verbs like payer (je paie).',
  examples: [
    { french: "Je paie l'addition.", english: 'I pay the bill.' },
    { french: 'Ils parlent français.', english: 'They speak French.' },
  ],
  unlockChapterIds: [C3],
  linkedLessons: [{ chapterId: C3, lessonLabel: 'Lesson 1.3', title: 'Au café' }],
  relatedRules: [
    { slug: 'subject-pronouns', label: 'Subject pronouns' },
    { slug: 'silent-final-consonants', label: 'Silent final consonants' },
  ],
  masteryCategories: ['er-present', 'prendre', 'payer', 'aimer', 'habiter'],
  quickReference: {
    bullets: [
      'Stem = infinitive minus -er',
      'Endings: -e -es -e -ons -ez -ent',
      'ils/elles -ent is silent',
      'Examples: parler, habiter, aimer, payer',
    ],
    table: {
      headers: ['Pronoun', 'parler'],
      rows: [
        ['je', 'parle'],
        ['tu', 'parles'],
        ['il/elle/on', 'parle'],
        ['nous', 'parlons'],
        ['vous', 'parlez'],
        ['ils/elles', 'parlent'],
      ],
    },
  },
  deepDive: {
    whyItMatters:
      'Once you own -er present, hundreds of verbs open: parler, habiter, aimer, commander, payer. Café Lesson 1.3 uses Je prends (irregular prendre) alongside regular patterns — keep them separate in your mind. The endings are tiny, but they carry person and number; without them, French cannot tell “I speak” from “they speak” in writing. Practice the six endings until they feel automatic, then apply them to every new -er infinitive you meet in readings and café dialogues.',
    sections: [
      {
        heading: 'Build any -er present',
        body: '1) Take infinitive (parler). 2) Drop -er → parl-. 3) Add ending for the subject. Je parle / Nous parlons / Ils parlent.',
      },
      {
        heading: 'Silent -ent',
        body: 'Ils parlent sounds like il parle — the -ent is silent. Spelling still needs -ent. See Silent final consonants.',
      },
      {
        heading: 'Payer and spelling',
        body: 'Je paie / je paye both exist; modern preference often je paie. Vous payez keeps y.',
      },
      {
        heading: 'Not all café verbs are -er',
        body: 'prendre (je prends), boire (je bois), vouloir (je veux / je voudrais) are irregular — learn separately even when the chapter mixes them.',
      },
    ],
    contrastEn: {
      headers: ['English', 'French'],
      rows: [
        ['I speak', 'Je parle'],
        ['They speak', 'Ils parlent (silent -ent)'],
        ['We live in Paris', "Nous habitons à Paris"],
      ],
    },
    commonMistakes: [
      { wrong: 'Je parles.', right: 'Je parle.', why: 'je → -e' },
      { wrong: 'Nous parle.', right: 'Nous parlons.', why: 'nous → -ons' },
      { wrong: 'Ils parle.', right: 'Ils parlent.', why: 'Need -ent in writing' },
      { wrong: 'Tu parler.', right: 'Tu parles.', why: 'Conjugate; don’t leave infinitive' },
    ],
  },
  examplesByGroup: [
    {
      heading: 'parler / habiter / aimer',
      items: baseExamples([
        { french: 'Je parle français.', english: 'I speak French.' },
        { french: "J'habite à Paris.", english: 'I live in Paris.' },
        { french: "J'aime le café.", english: 'I like coffee.' },
        { french: 'Nous parlons anglais.', english: 'We speak English.' },
        { french: 'Vous habitez où ?', english: 'Where do you live?' },
        { french: 'Ils aiment Lyon.', english: 'They like Lyon.' },
      ]),
    },
    {
      heading: 'Café / payer',
      items: baseExamples([
        { french: "Je paie l'addition.", english: 'I pay the bill.' },
        { french: 'Vous payez comment ?', english: 'How are you paying?' },
        { french: 'Ils commandent un thé.', english: 'They order a tea.' },
        { french: 'On parle au serveur.', english: 'We talk to the waiter.' },
      ]),
    },
  ],
  drills: [
    {
      id: 'er-cloze',
      title: 'Conjugate',
      exercise: {
        id: 'er-1',
        type: 'cloze',
        category: 'er-present',
        source: 'grammar',
        text: 'Tu ___ français.',
        answers: ['parles'],
        prompt: 'Type the -er form.',
        explanation: 'tu → -es.',
      },
    },
    {
      id: 'er-cloze2',
      title: 'habiter',
      exercise: {
        id: 'er-2',
        type: 'cloze',
        category: 'habiter',
        source: 'grammar',
        text: "J'___ à Paris.",
        answers: ['habite'],
        prompt: 'Conjugate habiter.',
        explanation: "J'habite à Paris.",
      },
    },
  ],
}

export const POSSESSIVE_ADJECTIVES: GrammarRuleDocument = {
  id: '30000000-0000-0000-0000-000000000007',
  slug: 'possessive-adjectives',
  title: 'Possessive adjectives: mon, ma, mes',
  category: 'Nouns',
  summary: 'Possessives agree with the noun possessed, not with the owner.',
  full_explanation:
    'mon + masculine singular, ma + feminine singular, mes + plural. Before a feminine noun starting with a vowel, use mon (mon amie). Family Lesson 1.4 is built on this.',
  examples: [
    { french: 'Mon frère est petit.', english: 'My brother is small.' },
    { french: 'Ma sœur est grande.', english: 'My sister is tall.' },
  ],
  unlockChapterIds: [C4],
  linkedLessons: [{ chapterId: C4, lessonLabel: 'Lesson 1.4', title: 'Ma famille' }],
  relatedRules: [{ slug: 'numbers-and-age', label: 'Numbers and age (family ages)' }],
  masteryCategories: ['possessives', 'possessive-adjectives', 'family'],
  quickReference: {
    bullets: [
      'Agree with the thing owned, not the owner.',
      'mon / ton / son (m. sg.) · ma / ta / sa (f. sg.) · mes / tes / ses (pl.)',
      'mon amie (f. + vowel) — use mon, not ma',
      'notre / votre / leur · nos / vos / leurs',
    ],
    table: {
      headers: ['Owner', 'm. sg.', 'f. sg.', 'plural'],
      rows: [
        ['my', 'mon', 'ma', 'mes'],
        ['your (tu)', 'ton', 'ta', 'tes'],
        ['his/her', 'son', 'sa', 'ses'],
        ['our', 'notre', 'notre', 'nos'],
        ['your (vous)', 'votre', 'votre', 'vos'],
        ['their', 'leur', 'leur', 'leurs'],
      ],
    },
  },
  deepDive: {
    whyItMatters:
      'English “his/her” tracks the owner’s gender. French son/sa tracks the noun: son frère even if the owner is a woman. Lesson 1.4 (Ma famille) is impossible without this flip.',
    sections: [
      {
        heading: 'Agree with the possessed noun',
        body: 'Ma sœur (sœur f.) / Mon frère (frère m.) / Mes parents (plural). The speaker’s gender does not change mon/ma.',
      },
      {
        heading: 'Vowel exception',
        body: 'Feminine noun + vowel sound → mon/ton/son for euphony: mon amie, mon école. Still feminine meaning.',
      },
      {
        heading: 'Family with avoir',
        body: "J'ai un frère. J'ai une sœur. Combine with possessives: Mon frère s'appelle… Ma mère est…",
      },
      {
        heading: 'son / sa / ses',
        body: 'His or her: Son père, sa mère, ses enfants. Context tells you whose.',
      },
    ],
    contrastEn: {
      headers: ['English', 'French'],
      rows: [
        ['her brother', 'son frère (frère is masculine)'],
        ['his sister', 'sa sœur'],
        ['my friend (f.)', 'mon amie'],
      ],
    },
    commonMistakes: [
      { wrong: 'Ma frère', right: 'Mon frère', why: 'frère is masculine' },
      { wrong: 'Mon sœur', right: 'Ma sœur', why: 'sœur is feminine' },
      { wrong: 'Ma amie', right: 'Mon amie', why: 'f. + vowel → mon' },
      { wrong: 'Mes père', right: 'Mon père', why: 'singular noun → mon' },
    ],
  },
  examplesByGroup: [
    {
      heading: 'Family',
      items: baseExamples([
        { french: 'Mon père s’appelle Pierre.', english: 'My father’s name is Pierre.' },
        { french: 'Ma mère s’appelle Claire.', english: 'My mother’s name is Claire.' },
        { french: 'Mes frères sont grands.', english: 'My brothers are tall.' },
        { french: 'Ma sœur est grande.', english: 'My sister is tall.' },
        { french: 'Son frère s’appelle Lucas.', english: 'Her/his brother is called Lucas.' },
        { french: 'Sa sœur s’appelle Emma.', english: 'Her/his sister is called Emma.' },
      ]),
    },
    {
      heading: 'More possessives',
      items: baseExamples([
        { french: 'Notre famille.', english: 'Our family.' },
        { french: 'Vos parents.', english: 'Your parents.' },
        { french: 'Leurs enfants.', english: 'Their children.' },
        { french: 'Mon amie.', english: 'My (female) friend.' },
      ]),
    },
  ],
  drills: [
    {
      id: 'poss-cloze',
      title: 'Feminine possessive',
      exercise: {
        id: 'poss-1',
        type: 'cloze',
        category: 'possessives',
        source: 'grammar',
        text: '___ sœur est grande.',
        answers: ['Ma', 'ma'],
        prompt: 'Type the possessive.',
        explanation: 'Ma sœur — feminine singular.',
      },
    },
    {
      id: 'poss-mcq',
      title: 'Agreement',
      exercise: {
        id: 'poss-2',
        type: 'mcq',
        category: 'possessive-adjectives',
        source: 'grammar',
        options: ['Mes frères sont grands.', 'Ma frères sont grands.', 'Mon frères sont grands.'],
        answer: 0,
        prompt: 'Which plural possessive is correct?',
        explanation: 'Mes + plural noun.',
      },
    },
  ],
}

export const SILENT_FINALS: GrammarRuleDocument = {
  id: '30000000-0000-0000-0000-000000000008',
  slug: 'silent-final-consonants',
  title: 'Silent final consonants',
  category: 'Phonetics',
  summary: 'Many final consonants are silent in ordinary speech, but spelling still records them.',
  full_explanation:
    'Final -s on plurals and the -ent of ils/elles verbs are usually silent. Liaison can make a silent letter audible before a vowel. Spelling and sound diverge — trust both.',
  examples: [
    { french: 'Ils parlent.', english: 'They speak.' },
    { french: 'Les cafés.', english: 'The cafés.' },
  ],
  unlockChapterIds: [C3],
  linkedLessons: [{ chapterId: C3, lessonLabel: 'Lesson 1.3', title: 'Au café' }],
  relatedRules: [{ slug: 'er-present', label: 'Regular -ER verbs' }],
  masteryCategories: ['silent-final-consonants', 'er-present'],
  quickReference: {
    bullets: [
      'Plural -s usually silent: les amis',
      'ils/elles -ent silent: ils parlent ≈ il parle',
      'Liaison: you may hear the consonant before a vowel (ils‿ont)',
      'Write the letters even when you don’t say them',
    ],
    table: {
      headers: ['Written', 'Usually hear'],
      rows: [
        ['les cafés', 'lé café'],
        ['ils parlent', 'il parl'],
        ['vous êtes', 'vouz et (liaison)'],
        ['petit', 'peti (final t silent)'],
      ],
    },
  },
  deepDive: {
    whyItMatters:
      'If you pronounce every letter, you sound non-native and mis-hear plurals. If you drop letters in writing, verbs look singular. Lesson 1.3 marks silent segments visually — match ear and eye.',
    sections: [
      {
        heading: 'Plural -s / -x',
        body: 'les, des, mes, vos — the -s is silent unless liaison. Les amis can sound like lé-z-ami.',
      },
      {
        heading: 'Verb ending -ent',
        body: 'Ils habitent, elles parlent — write -ent, say nothing extra. This is not the adverb ending -ment (lentement), which is pronounced.',
      },
      {
        heading: 'Other silent finals',
        body: 'Many words end in silent -t, -d, -s, -x: petit, grand, bas. Exceptions exist (sac — c is heard). Learn word by word.',
      },
      {
        heading: 'Liaison vs silence',
        body: 'Silent letter can wake up before a vowel: vous‿êtes, ils‿ont, les‿amis. Not every boundary is a liaison — listen for models in dialogue.',
      },
    ],
    contrastEn: {
      headers: ['English instinct', 'French'],
      rows: [
        ['Say every letter', 'Many finals silent'],
        ['Plural -s always heard', 'Plural -s often silent'],
        ['They talk ends with /k/', 'ils parlent — no extra -ent sound'],
      ],
    },
    commonMistakes: [
      { wrong: 'Pronouncing ils parlent as parl-ent', right: 'parl (like il parle)', why: '-ent silent' },
      { wrong: 'Writing ils parle', right: 'ils parlent', why: 'Spelling needs -ent' },
      { wrong: 'Ignoring liaison in vous êtes', right: 'hear z-link', why: 'Common liaison' },
    ],
    pronunciationNotes: [
      'Train pairs: il parle / ils parlent (same sound, different spelling).',
      'Use lesson X-Ray / silent marks when available.',
    ],
  },
  examplesByGroup: [
    {
      heading: 'Silent plurals & verbs',
      items: baseExamples([
        { french: 'Ils parlent.', english: 'They speak.' },
        { french: 'Elles habitent à Lyon.', english: 'They live in Lyon.' },
        { french: 'Les cafés.', english: 'The cafés.' },
        { french: 'Mes parents.', english: 'My parents.' },
      ]),
    },
    {
      heading: 'Liaison moments',
      items: baseExamples([
        { french: 'Vous êtes étudiants.', english: 'You are students.' },
        { french: 'Ils ont un frère.', english: 'They have a brother.' },
        { french: 'Les amis.', english: 'The friends.' },
        { french: 'Nous allons.', english: 'We go / we’re going.' },
      ]),
    },
  ],
  drills: [
    {
      id: 'silent-tf',
      title: 'True or false',
      exercise: {
        id: 'sil-1',
        type: 'true-false',
        category: 'silent-final-consonants',
        source: 'grammar',
        statement: 'The -ent ending in ils parlent is usually silent in speech.',
        answer: true,
        prompt: 'Is this statement true?',
        explanation: 'Yes — write -ent, don’t pronounce an extra syllable.',
      },
    },
    {
      id: 'silent-mcq',
      title: 'Spelling',
      exercise: {
        id: 'sil-2',
        type: 'mcq',
        category: 'er-present',
        source: 'grammar',
        options: ['Ils parlent français.', 'Ils parle français.', 'Ils parler français.'],
        answer: 0,
        prompt: 'Which written form is correct?',
        explanation: 'ils/elles need -ent even when silent.',
      },
    },
  ],
}
