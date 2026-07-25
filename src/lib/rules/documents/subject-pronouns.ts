import type { GrammarRuleDocument } from '@/lib/rules/types'

const C1 = '22222222-0000-0000-0000-000000000101'
const C2 = '22222222-0000-0000-0000-000000000102'
const C3 = '22222222-0000-0000-0000-000000000103'
const C4 = '22222222-0000-0000-0000-000000000104'

export const SUBJECT_PRONOUNS: GrammarRuleDocument = {
  id: '30000000-0000-0000-0000-000000000001',
  slug: 'subject-pronouns',
  title: 'Subject pronouns',
  category: 'Syntax',
  summary:
    'French verbs change with the subject — je, tu, il/elle/on, nous, vous, ils/elles. You usually keep the pronoun in speech.',
  full_explanation:
    'A subject pronoun tells who performs the action. French almost always keeps it because verb endings alone are not always distinct. Learn the paradigm, tu vs vous, and spoken on before conjugating être.',
  examples: [
    { french: 'Je suis français.', english: 'I am French.', focus: 'je' },
    { french: 'Nous sommes ici.', english: 'We are here.', focus: 'nous' },
  ],
  unlockChapterIds: [C1],
  linkedLessons: [
    { chapterId: C1, lessonLabel: 'Lesson 1.1', title: "Bonjour, je m'appelle…" },
    { chapterId: C2, lessonLabel: 'Lesson 1.2', title: 'Les chiffres et le calendrier', note: 'Review — nous, vous in class scenes' },
  ],
  relatedRules: [
    { slug: 'etre-present', label: 'Être in the present tense' },
    { slug: 'cest-versus-il-est', label: "C'est vs il/elle est" },
  ],
  masteryCategories: ['subject-pronouns'],
  quickReference: {
    bullets: [
      'je / tu / il / elle / on / nous / vous / ils / elles',
      'Verb ending must match the pronoun: je suis but nous sommes.',
      'tu = informal · vous = polite or plural · when unsure → vous.',
      'on = “we” in conversation; conjugate like il/elle: on habite, not on habitons.',
    ],
    table: {
      caption: 'Subject pronouns at a glance',
      headers: ['Pronoun', 'Meaning', 'Register / notes'],
      rows: [
        ['je', 'I', "Drops to j' before vowel: j'habite"],
        ['tu', 'you (one person, informal)', 'Friends, peers, children'],
        ['il', 'he, it (m.)', 'Also impersonal il = “it” (il pleut)'],
        ['elle', 'she, it (f.)', ''],
        ['on', 'one, we (spoken)', 'Informal “we”; verb = 3rd person singular'],
        ['nous', 'we', 'Written “we”; always plural verb'],
        ['vous', 'you (formal or plural)', 'Default with strangers'],
        ['ils', 'they (m. or mixed)', ''],
        ['elles', 'they (f. only)', 'All-female group'],
      ],
    },
  },
  deepDive: {
    whyItMatters:
      'Every French sentence with an action needs a clear subject. English leans on word order; French leans on verb endings and pronouns so the listener always knows who acts. In Module 1 you meet pronouns in introductions, nationality, and where people live. Get this wrong and every verb sounds off — not just one word.',
    sections: [
      {
        heading: 'The full paradigm',
        body: 'French has nine subject forms (seven if you count il/elle as one slot). They are not optional in normal speech. Person = who is talking or talked about. Number = one vs many. Gender (3rd person only) = il/ils vs elle/elles.',
        table: {
          headers: ['Person', 'Singular', 'Plural'],
          rows: [
            ['1st', 'je', 'nous'],
            ['2nd', 'tu · vous', 'vous'],
            ['3rd', 'il · elle · on', 'ils · elles'],
          ],
        },
      },
      {
        heading: 'Step-by-step: pick the right pronoun',
        body: '1) Who acts? 2) How many? 3) Formal or informal for “you”? 4) All-female group for “they”? Example: We are students in Paris → nous → Nous sommes étudiants à Paris. You (stranger) are French? → vous → Vous êtes français ?',
      },
      {
        heading: 'On — the pronoun textbooks under-teach',
        body: 'In everyday French, on often replaces nous. On takes il/elle verb forms: on est, on habite, on a. Meaning: “we”, “people”, or vague “one” (On dit que…). In Lesson 1.1 you also see impersonal on in quand on dérange.',
        table: {
          headers: ['Written / careful', 'Spoken / common'],
          rows: [
            ['Nous habitons à Lyon.', 'On habite à Lyon.'],
            ['Nous sommes amis.', 'On est amis.'],
          ],
        },
      },
      {
        heading: 'Tu vs vous — social grammar',
        body: 'Tu: friends, family, children, peers who offer tu, Salut situations. Vous: strangers, elders, professionals, shopkeepers, teachers, first meeting, Bonjour + surname. Module 1: Marc asks Marie Tu es française ? (informal). The teacher says Comment vous appelez-vous ? Practical rule: start with vous; switch to tu only when invited (On peut se tutoyer ?).',
      },
      {
        heading: 'How this connects to être and c’est',
        body: 'Subject pronouns are the left column of every conjugation table. With être: je suis, tu es, il/elle/on est, nous sommes, vous êtes, ils/elles sont. Je suis + adjective/nationality; C’est + name identifies; Il/elle est + adjective describes. The trap is choosing c’est vs il/elle est — not dropping the pronoun.',
      },
    ],
    contrastEn: {
      caption: 'English habit vs French reality',
      headers: ['English habit', 'French reality'],
      rows: [
        ['Drop “you” in imperatives only', 'Drop subject? Almost never (Suis français ❌)'],
        ['“You” = one word', 'tu AND vous — must choose'],
        ['“It” for weather', 'il pleut, il faut — no ça as subject here'],
        ['“They” gender-neutral', 'ils if any male; elles if all female'],
        ['“We” always nous', 'Spoken on is normal'],
      ],
    },
    commonMistakes: [
      { wrong: 'Suis étudiant.', right: 'Je suis étudiant.', why: 'Subject cannot be dropped' },
      { wrong: 'Tu êtes français ?', right: 'Tu es français ?', why: 'tu → es, not êtes' },
      { wrong: 'Vous es professeur ?', right: 'Vous êtes professeur ?', why: 'vous → êtes, not es' },
      { wrong: 'On habitons à Paris.', right: 'On habite à Paris.', why: 'on = 3rd singular' },
      { wrong: 'Elles est françaises.', right: 'Elles sont françaises.', why: 'Plural subject → plural verb' },
      { wrong: 'Ils est anglais.', right: 'Ils sont anglais.', why: 'ils needs sont' },
    ],
    pronunciationNotes: [
      "je before vowel → j' : j'habite, j'aime (elision).",
      'ils/elles + vowel: liaison possible (ils‿ont); the -ent ending is silent.',
    ],
  },
  examplesByGroup: [
    {
      heading: 'Introductions',
      items: [
        { french: "Je m'appelle Marc.", english: 'My name is Marc.', focus: 'je' },
        { french: "Moi, c'est Marie.", english: "I'm Marie.", focus: 'moi / c’est' },
        { french: 'Tu es française ?', english: 'Are you French? (informal)', focus: 'tu' },
        { french: 'Comment vous appelez-vous ?', english: 'What is your name? (formal)', focus: 'vous' },
        { french: 'Nous sommes amis.', english: 'We are friends.', focus: 'nous' },
        { french: 'Ils habitent en France.', english: 'They live in France.', focus: 'ils' },
      ],
    },
    {
      heading: 'Nationality & description',
      items: [
        { french: 'Je suis français.', english: 'I am French.', focus: 'je' },
        { french: 'Elle est française.', english: 'She is French.', focus: 'elle' },
        { french: 'Il habite à Paris.', english: 'He lives in Paris.', focus: 'il' },
        { french: 'Vous êtes une classe internationale.', english: 'You are an international class.', focus: 'vous' },
      ],
    },
    {
      heading: 'Informal on',
      items: [
        { french: 'On dit souvent merci.', english: 'People often say thank you.', focus: 'on' },
        { french: 'pardon quand on dérange', english: 'sorry when one disturbs', focus: 'on' },
      ],
    },
  ],
  dialogueSample: {
    title: 'Meeting Marie (Lesson 1.1)',
    lines: [
      { speaker: 'Marc', text: "Bonjour ! Je m'appelle Marc. Enchanté." },
      { speaker: 'Marie', text: "Salut Marc ! Moi, c'est Marie. Enchantée." },
      { speaker: 'Marc', text: 'Tu es française ?' },
      { speaker: 'Marie', text: 'Oui, je suis française. Et toi ?' },
      { speaker: 'Marc', text: "Je suis français. J'habite à Paris." },
      { speaker: 'Marie', text: "Moi aussi ! J'habite à Lyon. Comment ça va ?" },
    ],
    note: 'Pronouns: je (×3), tu (×1). Marie repeats je for clarity.',
  },
  drills: [
    {
      id: 'sp-drill-match',
      title: 'Match pronoun to English',
      exercise: {
        id: 'sp-match-1',
        type: 'match',
        category: 'subject-pronouns',
        source: 'grammar',
        prompt: 'Match each pronoun to its English meaning.',
        left: ['nous', 'elles', 'vous', 'on'],
        right: ['we', 'they (all female)', 'you (formal or plural)', 'we / one / people'],
        pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
        explanation: 'nous = we; elles = they (f.); vous = formal/plural you; on = we/one/people.',
      },
    },
    {
      id: 'sp-drill-register',
      title: 'Choose tu or vous',
      exercise: {
        id: 'sp-register-1',
        type: 'register',
        category: 'subject-pronouns',
        source: 'grammar',
        situation: 'You ask a university professor their name for the first time.',
        options: ['Comment tu t’appelles ?', 'Comment vous appelez-vous ?', 'Comment on s’appelle ?'],
        answer: 1,
        prompt: 'Which form is correct?',
        explanation: 'Use vous with a professor / stranger.',
      },
    },
    {
      id: 'sp-drill-cloze',
      title: 'Complete with être',
      exercise: {
        id: 'sp-cloze-1',
        type: 'cloze',
        category: 'subject-pronouns',
        source: 'grammar',
        text: 'On ___ contents.',
        answers: ['est'],
        prompt: 'Type the correct form of être.',
        explanation: 'On takes 3rd singular: on est.',
      },
    },
  ],
}
