/**
 * Tenses guide — "How do I say it?" path.
 * Hand-written. Goal: spoken conversation (daily life + work), not literary French.
 * Every French example has an English meaning. Native-speaker review still recommended.
 */

export type TimelinePosition = 'past' | 'now' | 'future' | 'wish'

export type GuideExample = { fr: string; en: string }

export type GuideStep = { title: string; body: string; example?: GuideExample }

export type GuideQuestion = {
  id: string
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

export type TenseGoal = {
  slug: string
  /** What the learner wants to do, in plain words. */
  title: string
  /** The French forms, as a reminder line. */
  subtitle: string
  /** Core = needed for normal conversation. Optional = skippable. */
  level: 'Core' | 'Core · later' | 'Optional'
  /** Where it sits on the timeline picture. */
  timeline: { position: TimelinePosition; label: string }
  summary: string
  whenToUse: string[]
  steps: GuideStep[]
  life: GuideExample[]
  work: GuideExample[]
  traps: string[]
  /** Engine tense names to show as full tables. */
  tenses: string[]
  /** Which verb groups to show tables for. */
  verbGroups: Array<'regular' | 'core' | 'more'>
  /** Extra hand-built table for compound structures (futur proche, venir de…). */
  structure?: { title: string; verb: string; rows: Array<[string, string]> }
  quiz: GuideQuestion[]
}

export const REGULAR_VERBS = ['parler', 'finir', 'vendre'] as const
export const CORE_IRREGULAR_VERBS = ['être', 'avoir', 'aller', 'faire'] as const
export const MORE_IRREGULAR_VERBS = ['pouvoir', 'vouloir', 'devoir', 'savoir', 'venir', 'prendre', 'dire', 'voir', 'partir', 'mettre'] as const

export const TENSE_GOALS: TenseGoal[] = [
  {
    slug: 'now',
    title: 'Talk about now and habits',
    subtitle: 'Présent · je parle, je finis, je vends',
    level: 'Core',
    timeline: { position: 'now', label: 'Présent' },
    summary: 'The tense you use most. One form covers “I speak”, “I am speaking” and “I do speak”.',
    whenToUse: [
      'Things that are true now: Je suis fatigué.',
      'Habits and routines: Je prends le métro tous les jours.',
      'Things happening around now: Je travaille sur un projet.',
      'Plans with a time word: Je pars demain.',
    ],
    steps: [
      { title: 'Regular -er verbs (most verbs)', body: 'Drop -er and add -e, -es, -e, -ons, -ez, -ent.', example: { fr: 'parler → je parle, nous parlons', en: 'to speak → I speak, we speak' } },
      { title: '-ir verbs like finir', body: 'Add -is, -is, -it, -issons, -issez, -issent.', example: { fr: 'finir → je finis, nous finissons', en: 'to finish → I finish, we finish' } },
      { title: '-re verbs like vendre', body: 'Drop -re and add -s, -s, nothing, -ons, -ez, -ent.', example: { fr: 'vendre → je vends, il vend', en: 'to sell → I sell, he sells' } },
      { title: 'Learn four irregular verbs by heart', body: 'être, avoir, aller and faire are the most used verbs in French. Everything else builds on them.' },
    ],
    life: [
      { fr: "Je m'appelle Julie et j'habite à Lyon.", en: 'My name is Julie and I live in Lyon.' },
      { fr: 'Tu veux un café ?', en: 'Do you want a coffee?' },
      { fr: 'On mange à huit heures.', en: 'We eat at eight. (on = we, everyday speech)' },
      { fr: 'Elle prend le métro tous les matins.', en: 'She takes the metro every morning.' },
    ],
    work: [
      { fr: 'Je travaille dans une banque.', en: 'I work in a bank.' },
      { fr: 'Nous préparons la réunion de lundi.', en: "We are preparing Monday's meeting." },
      { fr: 'Le client attend votre réponse.', en: 'The client is waiting for your answer.' },
      { fr: 'Je vous envoie le document.', en: "I'm sending you the document." },
    ],
    traps: [
      'There is no separate “I am speaking” form. Je parle means both I speak and I am speaking.',
      'On means “we” in everyday speech: On y va ! = Let’s go!',
      '-er verbs: tu parles ends in -s, il parle does not. They sound the same when spoken.',
    ],
    tenses: ['Présent'],
    verbGroups: ['regular', 'core', 'more'],
    quiz: [
      { id: 'now-1', prompt: 'Nous ___ français. (parler)', options: ['parlons', 'parlez', 'parlent'], answer: 0, explanation: 'Nous always ends in -ons in the present.' },
      { id: 'now-2', prompt: 'Ils ___ en retard. (être)', options: ['sont', 'sommes', 'êtes'], answer: 0, explanation: 'Ils / elles + être = sont.' },
      { id: 'now-3', prompt: 'Tu ___ à quelle heure ? (finir)', options: ['finis', 'finit', 'finissons'], answer: 0, explanation: 'Tu + -ir verb = -is.' },
      { id: 'now-4', prompt: 'How do you say “I am working”?', options: ['Je suis travaillant.', 'Je travaille.', "J'ai travaillé."], answer: 1, explanation: 'French uses the plain present for “I am working”.' },
      { id: 'now-5', prompt: 'Elle ___ deux enfants. (avoir)', options: ['a', 'as', 'ont'], answer: 0, explanation: 'Il / elle / on + avoir = a.' },
    ],
  },
  {
    slug: 'plans',
    title: 'Say what you are going to do',
    subtitle: 'Futur proche · je vais partir',
    level: 'Core',
    timeline: { position: 'future', label: 'Futur proche' },
    summary: 'The everyday way to talk about the future. aller + infinitive. Easy and used all the time.',
    whenToUse: [
      'Plans and intentions: Ce soir, je vais cuisiner.',
      'Things you are sure will happen soon: Il va pleuvoir.',
      'Almost any friendly conversation about tomorrow, tonight or next week.',
    ],
    steps: [
      { title: 'Conjugate aller in the present', body: 'je vais, tu vas, il va, nous allons, vous allez, ils vont.' },
      { title: 'Add the infinitive of the action', body: 'The second verb never changes. It stays in the infinitive.', example: { fr: 'Je vais manger.', en: "I'm going to eat." } },
      { title: 'Negative goes around aller', body: 'Ne … pas surrounds aller, not the infinitive.', example: { fr: 'Je ne vais pas venir.', en: "I'm not going to come." } },
      { title: 'Add a time word', body: 'demain, ce soir, la semaine prochaine, dans deux jours, bientôt.' },
    ],
    life: [
      { fr: 'Ce soir, je vais cuisiner pour des amis.', en: "Tonight I'm going to cook for friends." },
      { fr: 'Demain, on va visiter le musée.', en: "Tomorrow we're going to visit the museum." },
      { fr: 'Tu vas venir à la fête ?', en: 'Are you going to come to the party?' },
      { fr: 'Il va pleuvoir, prends un parapluie.', en: "It's going to rain, take an umbrella." },
    ],
    work: [
      { fr: "Je vais vous envoyer l'offre cet après-midi.", en: "I'm going to send you the offer this afternoon." },
      { fr: 'Nous allons lancer le produit en mars.', en: "We're going to launch the product in March." },
      { fr: 'La réunion va commencer dans cinq minutes.', en: 'The meeting is going to start in five minutes.' },
    ],
    traps: [
      'Do not conjugate the second verb: je vais parler, never je vais parle.',
      'In conversation people use this far more than the “real” future (next page).',
      'The present tense also works with a time word: Je pars demain.',
    ],
    tenses: ['Présent'],
    verbGroups: [],
    structure: {
      title: 'aller + infinitive',
      verb: 'parler',
      rows: [
        ['je', 'je vais parler'],
        ['tu', 'tu vas parler'],
        ['il / elle / on', 'il va parler'],
        ['nous', 'nous allons parler'],
        ['vous', 'vous allez parler'],
        ['ils / elles', 'ils vont parler'],
      ],
    },
    quiz: [
      { id: 'plans-1', prompt: 'How do you say “Tomorrow I’m going to work from home”?', options: ['Demain, je vais travailler à la maison.', 'Demain, je vais travaille à la maison.', 'Demain, je suis travailler à la maison.'], answer: 0, explanation: 'aller (conjugated) + infinitive.' },
      { id: 'plans-2', prompt: 'Nous ___ visiter Paris.', options: ['vais', 'allons', 'allez'], answer: 1, explanation: 'Nous + aller = allons.' },
      { id: 'plans-3', prompt: 'Which means “They are going to arrive soon”?', options: ['Ils vont arriver bientôt.', 'Ils sont arrivés bientôt.', 'Ils allez arriver bientôt.'], answer: 0, explanation: 'Ils + vont + infinitive.' },
      { id: 'plans-4', prompt: 'Tu ___ venir ce soir ?', options: ['vas', 'va', 'vais'], answer: 0, explanation: 'Tu + aller = vas.' },
      { id: 'plans-5', prompt: 'How do you say “I’m not going to leave”?', options: ['Je ne vais pas partir.', 'Je vais ne pas partir.', 'Je ne pas vais partir.'], answer: 0, explanation: 'Ne … pas goes around aller.' },
    ],
  },
  {
    slug: 'future',
    title: 'Make promises and talk about the future',
    subtitle: 'Futur simple · je parlerai, je finirai, je vendrai',
    level: 'Core',
    timeline: { position: 'future', label: 'Futur simple' },
    summary: 'The “will” tense. Firmer than aller + infinitive. Very common in business emails, promises and announcements.',
    whenToUse: [
      'Promises and firm commitments: Je vous répondrai demain.',
      'Predictions: Il fera beau ce week-end.',
      'Announcements and written business French: La réunion aura lieu à dix heures.',
      'After quand (when): Quand tu arriveras, appelle-moi.',
    ],
    steps: [
      { title: 'Take the whole infinitive', body: 'Add -ai, -as, -a, -ons, -ez, -ont.', example: { fr: 'parler → je parlerai, nous parlerons', en: 'to speak → I will speak, we will speak' } },
      { title: '-re verbs lose the final e', body: 'vendre → je vendrai.', example: { fr: 'vendre → tu vendras', en: 'to sell → you will sell' } },
      { title: 'Irregular stems, same endings', body: 'être → ser-, avoir → aur-, aller → ir-, faire → fer-, pouvoir → pourr-, vouloir → voudr-, devoir → devr-, savoir → saur-, venir → viendr-, voir → verr-, envoyer → enverr-.', example: { fr: 'Nous irons à Lyon.', en: 'We will go to Lyon.' } },
    ],
    life: [
      { fr: "Je t'appellerai demain.", en: "I'll call you tomorrow." },
      { fr: 'Il fera beau ce week-end.', en: 'The weather will be nice this weekend.' },
      { fr: 'Quand tu arriveras, on mangera.', en: 'When you arrive, we will eat.' },
      { fr: "Un jour, j'habiterai à Paris.", en: 'One day I will live in Paris.' },
    ],
    work: [
      { fr: 'Je vous répondrai avant vendredi.', en: 'I will answer you before Friday.' },
      { fr: 'Nous livrerons la commande lundi.', en: 'We will deliver the order on Monday.' },
      { fr: 'La réunion aura lieu à dix heures.', en: 'The meeting will take place at ten.' },
      { fr: 'Le directeur sera présent.', en: 'The director will be present.' },
    ],
    traps: [
      'Friends: Je vais t’appeler. Contracts and emails: Je vous appellerai. Same meaning, firmer tone.',
      'After quand / dès que French uses the future where English uses the present: Quand tu arriveras…',
      'The stem can be irregular but the endings never change.',
    ],
    tenses: ['Futur simple'],
    verbGroups: ['regular', 'core', 'more'],
    quiz: [
      { id: 'future-1', prompt: 'Je ___ à mon chef demain. (parler)', options: ['parlerai', 'parlerais', 'parlait'], answer: 0, explanation: 'Infinitive + -ai.' },
      { id: 'future-2', prompt: 'Ils ___ là à midi. (être)', options: ['seront', 'seraient', 'étaient'], answer: 0, explanation: 'être → ser- + -ont.' },
      { id: 'future-3', prompt: 'Nous ___ à Lyon en mai. (aller)', options: ['irons', 'allons', 'allerons'], answer: 0, explanation: 'aller has the irregular stem ir-.' },
      { id: 'future-4', prompt: 'Which is a firm business promise: “I will send it on Monday”?', options: ["Je l'enverrai lundi.", "Je l'envoyais lundi.", "Je l'ai envoyé lundi."], answer: 0, explanation: 'envoyer → enverr- + -ai.' },
      { id: 'future-5', prompt: 'Demain il ___ beau. (faire)', options: ['fera', 'fait', 'ferait'], answer: 0, explanation: 'faire → fer- + -a.' },
    ],
  },
  {
    slug: 'past-done',
    title: 'Say what happened',
    subtitle: 'Passé composé · j’ai parlé, je suis allé',
    level: 'Core',
    timeline: { position: 'past', label: 'Passé composé' },
    summary: 'The main past tense in conversation. For things that happened and are finished.',
    whenToUse: [
      'Finished events: Hier, j’ai vu un film.',
      'A sequence of things in a story: Je me suis levé, j’ai mangé, je suis parti.',
      'Anything with a clear end or time: ce matin, la semaine dernière, en 2020.',
    ],
    steps: [
      { title: 'Auxiliary + past participle', body: 'Use avoir (most verbs) or être (see step 3) in the present, then the participle.', example: { fr: "J'ai mangé une pizza.", en: 'I ate a pizza.' } },
      { title: 'Make the participle', body: '-er → -é (parlé), -ir → -i (fini), -re → -u (vendu). Irregulars: avoir eu, être été, faire fait, prendre pris, voir vu, pouvoir pu, vouloir voulu, devoir dû, savoir su, dire dit, mettre mis, venir venu.' },
      { title: 'Use être for movement and change verbs', body: 'aller, venir, arriver, partir, rester, entrer, sortir, rentrer, tomber, naître, mourir, and every reflexive verb (se lever → je me suis levé). The participle then agrees with the subject.', example: { fr: 'Elle est arrivée à huit heures.', en: 'She arrived at eight.' } },
    ],
    life: [
      { fr: "Hier, j'ai vu un film.", en: 'Yesterday I saw a film.' },
      { fr: 'Elle est arrivée à huit heures.', en: 'She arrived at eight.' },
      { fr: 'Nous avons mangé au restaurant.', en: 'We ate at the restaurant.' },
      { fr: "Je me suis levé à sept heures.", en: 'I got up at seven.' },
    ],
    work: [
      { fr: "J'ai envoyé le contrat ce matin.", en: 'I sent the contract this morning.' },
      { fr: "Nous avons signé l'accord la semaine dernière.", en: 'We signed the agreement last week.' },
      { fr: 'Le directeur est parti hier soir.', en: 'The director left yesterday evening.' },
      { fr: 'Vous avez reçu mon e-mail ?', en: 'Did you receive my email?' },
    ],
    traps: [
      'Negation wraps the auxiliary: Je n’ai pas mangé.',
      'With être the participle agrees: elle est partie, ils sont partis.',
      'One tense covers “I ate”, “I have eaten” and “I did eat”.',
    ],
    tenses: ['Passé composé'],
    verbGroups: ['regular', 'core', 'more'],
    quiz: [
      { id: 'past-done-1', prompt: 'Hier, nous ___ une pizza. (manger)', options: ['avons mangé', 'sommes mangé', 'mangeons'], answer: 0, explanation: 'manger takes avoir.' },
      { id: 'past-done-2', prompt: 'Elle ___ au bureau. (aller)', options: ['est allée', 'a allé', 'va allée'], answer: 0, explanation: 'aller takes être and the participle agrees: allée.' },
      { id: 'past-done-3', prompt: 'How do you say “I didn’t finish the report”?', options: ["Je n'ai pas fini le rapport.", 'Je ne pas ai fini le rapport.', "Je n'ai fini pas le rapport."], answer: 0, explanation: 'ne … pas wraps the auxiliary.' },
      { id: 'past-done-4', prompt: 'Past participle of prendre?', options: ['pris', 'prendu', 'pri'], answer: 0, explanation: 'prendre → pris (irregular).' },
      { id: 'past-done-5', prompt: 'Which verb uses être?', options: ['partir', 'manger', 'finir'], answer: 0, explanation: 'partir is a movement verb: je suis parti.' },
    ],
  },
  {
    slug: 'past-background',
    title: 'Describe the past and what used to be',
    subtitle: 'Imparfait · je parlais, je finissais, j’étais',
    level: 'Core',
    timeline: { position: 'past', label: 'Imparfait' },
    summary: 'The “scene-setting” past: how things were, what you used to do, what was going on when something happened.',
    whenToUse: [
      'Habits in the past: Quand j’étais petit, je jouais dehors.',
      'Descriptions of weather, age, feelings and places: Il faisait froid.',
      'Something in progress when something else happened: Je dormais quand tu as téléphoné.',
      'Polite softening: Je voulais vous parler du contrat.',
    ],
    steps: [
      { title: 'Start from the nous form of the present', body: 'nous parlons → parl-, nous finissons → finiss-, nous prenons → pren-.' },
      { title: 'Add -ais, -ais, -ait, -ions, -iez, -aient', body: 'The endings are the same for every verb.', example: { fr: 'je parlais, nous parlions', en: 'I used to speak, we used to speak' } },
      { title: 'One exception: être', body: 'The stem is ét-: j’étais, tu étais, il était, nous étions, vous étiez, ils étaient.' },
    ],
    life: [
      { fr: "Quand j'étais petit, j'habitais à Lyon.", en: 'When I was little I lived in Lyon.' },
      { fr: 'Il pleuvait et il faisait froid.', en: 'It was raining and it was cold.' },
      { fr: 'Nous mangions toujours chez ma grand-mère le dimanche.', en: 'We always used to eat at my grandmother’s on Sundays.' },
      { fr: "Je dormais quand tu as téléphoné.", en: 'I was sleeping when you called.' },
    ],
    work: [
      { fr: 'À l’époque, nous travaillions avec trois clients.', en: 'Back then we worked with three clients.' },
      { fr: 'Je voulais vous parler du contrat.', en: 'I wanted to talk to you about the contract. (polite)' },
      { fr: "L'entreprise employait vingt personnes.", en: 'The company employed twenty people.' },
    ],
    traps: [
      'Passé composé = an event with an end. Imparfait = background or habit.',
      'Story pattern: imparfait sets the scene, passé composé tells what happened. Il pleuvait quand je suis sorti.',
      'Je mangeais keeps the e after g so the g stays soft.',
    ],
    tenses: ['Imparfait'],
    verbGroups: ['regular', 'core', 'more'],
    quiz: [
      { id: 'past-bg-1', prompt: 'Quand j’étais enfant, je ___ dehors. (jouer)', options: ['jouais', "j'ai joué", 'jouerai'], answer: 0, explanation: 'A past habit uses the imparfait.' },
      { id: 'past-bg-2', prompt: 'Il ___ froid ce matin-là. (faire)', options: ['faisait', 'a fait', 'fera'], answer: 0, explanation: 'Weather description sets the scene.' },
      { id: 'past-bg-3', prompt: 'Which sets the scene: “It was raining”?', options: ['Il pleuvait.', 'Il a plu.', 'Il pleuvra.'], answer: 0, explanation: 'Imparfait for background.' },
      { id: 'past-bg-4', prompt: 'Nous ___ tard chaque soir (used to). (finir)', options: ['finissions', 'finirons', 'avons fini'], answer: 0, explanation: 'nous finissons → finiss- + -ions.' },
      { id: 'past-bg-5', prompt: 'Je ___ fatigué. (être, was)', options: ['étais', 'suis', 'serai'], answer: 0, explanation: 'être → ét- + -ais.' },
    ],
  },
  {
    slug: 'recent',
    title: 'Say what just happened or is happening now',
    subtitle: 'venir de + infinitif · être en train de + infinitif',
    level: 'Core',
    timeline: { position: 'now', label: 'Tout de suite' },
    summary: 'Two tiny patterns that sound very natural. Just did something? In the middle of something?',
    whenToUse: [
      'Something finished a moment ago: Je viens d’arriver.',
      'Something in progress right now: Je suis en train de conduire.',
      'Business updates: Je viens de recevoir votre message.',
    ],
    steps: [
      { title: 'Just did: venir (present) + de + infinitive', body: 'de becomes d’ before a vowel.', example: { fr: "Je viens d'arriver.", en: 'I just arrived.' } },
      { title: 'Doing right now: être (present) + en train de + infinitive', body: 'Stresses that it is happening at this moment.', example: { fr: 'Nous sommes en train de dîner.', en: "We're in the middle of dinner." } },
    ],
    life: [
      { fr: "Je viens d'arriver.", en: 'I just arrived.' },
      { fr: 'Elle vient de partir.', en: 'She just left.' },
      { fr: 'Ne m’appelle pas, je suis en train de conduire.', en: "Don't call me, I'm driving." },
      { fr: 'Nous sommes en train de dîner.', en: "We're in the middle of dinner." },
    ],
    work: [
      { fr: 'Je viens de recevoir votre message.', en: 'I just received your message.' },
      { fr: 'Nous venons de signer le contrat.', en: 'We just signed the contract.' },
      { fr: 'Il est en train de finir la présentation.', en: 'He is finishing the presentation right now.' },
      { fr: 'Je suis en train de vérifier les chiffres.', en: "I'm checking the numbers right now." },
    ],
    traps: [
      'Say Je viens de finir, not “J’ai juste fini”.',
      'de + vowel → d’: Je viens d’arriver.',
      'venir de also works in the imparfait: Il venait d’arriver (he had just arrived).',
    ],
    tenses: ['Présent'],
    verbGroups: [],
    structure: {
      title: 'venir de + infinitive',
      verb: 'arriver',
      rows: [
        ['je', "je viens d'arriver"],
        ['tu', "tu viens d'arriver"],
        ['il / elle / on', "il vient d'arriver"],
        ['nous', "nous venons d'arriver"],
        ['vous', "vous venez d'arriver"],
        ['ils / elles', "ils viennent d'arriver"],
      ],
    },
    quiz: [
      { id: 'recent-1', prompt: 'How do you say “I just arrived”?', options: ["Je viens d'arriver.", 'Je suis venu arriver.', 'Je viens arriver.'], answer: 0, explanation: 'venir de + infinitive.' },
      { id: 'recent-2', prompt: 'Nous ___ de signer.', options: ['venons', 'allons', 'sommes'], answer: 0, explanation: 'Nous + venir = venons.' },
      { id: 'recent-3', prompt: 'How do you say “She is in the middle of working”?', options: ['Elle est en train de travailler.', 'Elle est travaillant.', 'Elle vient travailler.'], answer: 0, explanation: 'être en train de + infinitive.' },
      { id: 'recent-4', prompt: 'Il vient ___ partir.', options: ['de', 'à', 'en'], answer: 0, explanation: 'venir de + infinitive.' },
      { id: 'recent-5', prompt: 'How do you say “They are in the middle of eating”?', options: ['Ils sont en train de manger.', 'Ils vont manger.', 'Ils viennent manger.'], answer: 0, explanation: 'être en train de.' },
    ],
  },
  {
    slug: 'polite',
    title: 'Be polite: ask, suggest, say what you would like',
    subtitle: 'Conditionnel · je voudrais, pourriez-vous, on pourrait',
    level: 'Core',
    timeline: { position: 'wish', label: 'Conditionnel' },
    summary: 'The tense of politeness. Use it in shops, restaurants, emails and meetings.',
    whenToUse: [
      'Polite requests: Pourriez-vous m’aider ?',
      'What you would like: Je voudrais un café. J’aimerais réserver une table.',
      'Soft suggestions and advice: On pourrait y aller. Vous devriez contacter le service client.',
    ],
    steps: [
      { title: 'Take the futur simple stem', body: 'The stem is the same: parler → parler-, être → ser-, aller → ir-, pouvoir → pourr-.' },
      { title: 'Add the imparfait endings', body: '-ais, -ais, -ait, -ions, -iez, -aient.', example: { fr: 'je voudrais, nous pourrions', en: 'I would like, we could' } },
      { title: 'Memorize five phrases', body: 'Je voudrais… · J’aimerais… · Pourriez-vous… ? · On pourrait… · Vous devriez…' },
    ],
    life: [
      { fr: "Je voudrais un café, s'il vous plaît.", en: "I'd like a coffee, please." },
      { fr: "Tu pourrais m'aider ?", en: 'Could you help me?' },
      { fr: "J'aimerais réserver une table pour deux.", en: "I'd like to book a table for two." },
      { fr: 'On pourrait aller au cinéma.', en: 'We could go to the cinema.' },
    ],
    work: [
      { fr: "Pourriez-vous m'envoyer le devis ?", en: 'Could you send me the quote?' },
      { fr: 'Je voudrais prendre rendez-vous.', en: "I'd like to make an appointment." },
      { fr: 'Nous aimerions discuter du budget.', en: "We'd like to discuss the budget." },
      { fr: 'Vous devriez contacter le service client.', en: 'You should contact customer service.' },
    ],
    traps: [
      'Je veux un café sounds blunt. Je voudrais un café is the polite version.',
      'Pouvez-vous… ? is fine; Pourriez-vous… ? is softer.',
      'The stem matches the futur (serai / serais, irai / irais). Only the ending changes.',
    ],
    tenses: ['Conditionnel présent'],
    verbGroups: ['regular', 'core', 'more'],
    quiz: [
      { id: 'polite-1', prompt: 'Which is the most polite way to order?', options: ["Je voudrais de l'eau, s'il vous plaît.", "Je veux de l'eau.", "Donne l'eau."], answer: 0, explanation: 'vouloir in the conditionnel.' },
      { id: 'polite-2', prompt: '“Pourriez-vous m’aider ?” means…', options: ['Could you help me?', 'Will you help me?', 'Did you help me?'], answer: 0, explanation: 'pourriez = you could (formal).' },
      { id: 'polite-3', prompt: 'Nous ___ discuter du prix. (aimer, would like)', options: ['aimerions', 'aimons', 'aimerons'], answer: 0, explanation: 'Infinitive + -ions.' },
      { id: 'polite-4', prompt: 'Tu ___ dormir plus. (devoir, advice)', options: ['devrais', 'dois', 'devras'], answer: 0, explanation: 'devr- + -ais = you should.' },
      { id: 'polite-5', prompt: 'On ___ manger ici ? (pouvoir, could we?)', options: ['pourrait', 'pourra', 'pouvait'], answer: 0, explanation: 'pourr- + -ait.' },
    ],
  },
  {
    slug: 'commands',
    title: 'Give instructions and advice',
    subtitle: 'Impératif · parle ! parlons ! parlez !',
    level: 'Core',
    timeline: { position: 'now', label: 'Impératif' },
    summary: 'Directions, recipes, advice and polite work phrases like Veuillez patienter.',
    whenToUse: [
      'Directions: Tournez à gauche.',
      'Advice to friends: Ne t’inquiète pas.',
      'Invitations: Entrez, asseyez-vous.',
      'Formal emails (“please find attached”): Veuillez trouver le document ci-joint.',
    ],
    steps: [
      { title: 'Take tu / nous / vous from the present', body: 'Drop the pronoun. tu parles → Parle ! · nous parlons → Parlons ! · vous parlez → Parlez !' },
      { title: '-er verbs drop the -s in the tu form', body: 'Tu parles → Parle ! · Tu vas → Va !' },
      { title: 'Four irregular verbs', body: 'être: sois / soyons / soyez · avoir: aie / ayons / ayez · savoir: sache / sachons / sachez · vouloir: veuillez (formal).' },
      { title: 'Negative and pronouns', body: 'Ne parle pas ! · Pronouns come after in positive commands: Dis-moi.' },
    ],
    life: [
      { fr: 'Viens ici !', en: 'Come here!' },
      { fr: 'Prends la première rue à droite.', en: 'Take the first street on the right.' },
      { fr: "Ne t'inquiète pas.", en: "Don't worry." },
      { fr: 'Allons-y !', en: "Let's go!" },
    ],
    work: [
      { fr: "Veuillez patienter, s'il vous plaît.", en: 'Please wait.' },
      { fr: 'Envoyez-moi le fichier avant midi.', en: 'Send me the file before noon.' },
      { fr: "N'hésitez pas à me contacter.", en: "Don't hesitate to contact me." },
      { fr: "Soyez à l'heure.", en: 'Be on time.' },
    ],
    traps: [
      'With strangers and at work use vous: Entrez. Asseyez-vous.',
      'The tu form of -er verbs has no -s: Parle, not Parles.',
      'Positive commands put the pronoun after the verb: Dis-moi.',
    ],
    tenses: ['Impératif'],
    verbGroups: ['regular', 'core', 'more'],
    quiz: [
      { id: 'commands-1', prompt: 'Tell a friend: “Come here!”', options: ['Viens ici !', 'Venez ici !', 'Tu viens ici !'], answer: 0, explanation: 'tu viens → Viens !' },
      { id: 'commands-2', prompt: 'Politely, to a stranger: “Please wait.”', options: ['Veuillez patienter.', 'Patiente !', 'Attends !'], answer: 0, explanation: 'Veuillez + infinitive is the formal form.' },
      { id: 'commands-3', prompt: 'Parler, tu form, as a command?', options: ['Parle !', 'Parles !', 'Parlez !'], answer: 0, explanation: '-er verbs drop the -s.' },
      { id: 'commands-4', prompt: 'How do you say “Don’t worry” to a friend?', options: ["Ne t'inquiète pas.", 'Ne inquiète pas.', "Pas t'inquiète."], answer: 0, explanation: 'ne … pas around the verb.' },
      { id: 'commands-5', prompt: 'Être as a command, vous form?', options: ['Soyez', 'Êtes', 'Soit'], answer: 0, explanation: 'être → soyez.' },
    ],
  },
  {
    slug: 'if',
    title: 'Say “if…”: conditions and what-ifs',
    subtitle: 'si + présent → futur · si + imparfait → conditionnel',
    level: 'Core',
    timeline: { position: 'wish', label: 'Si…' },
    summary: 'Two patterns cover almost every “if” sentence you need in conversation and negotiation.',
    whenToUse: [
      'Real conditions: S’il pleut, on reste à la maison.',
      'Daydreams and unreal things: Si j’avais le temps, je voyagerais.',
      'Offers and negotiation: Si vous commandez cent pièces, nous vous offrirons une remise.',
    ],
    steps: [
      { title: 'Likely: si + présent, then futur / présent / impératif', body: 'The “if” part is in the present. The result can be future, present or a command.', example: { fr: 'Si tu viens, on mangera ensemble.', en: "If you come, we'll eat together." } },
      { title: 'Unlikely or imaginary: si + imparfait, then conditionnel', body: 'The “if” part is in the imparfait. The result is in the conditionnel.', example: { fr: 'Si j’avais le temps, je voyagerais.', en: 'If I had time, I would travel.' } },
      { title: 'Never put the future or conditionnel right after si', body: 'Si j’aurais is wrong. Always si + present or imparfait.' },
    ],
    life: [
      { fr: "S'il pleut, on reste à la maison.", en: "If it rains, we stay home." },
      { fr: 'Si tu veux, on peut y aller.', en: 'If you want, we can go.' },
      { fr: "Si j'avais plus de temps, je ferais du sport.", en: 'If I had more time, I would do sport.' },
      { fr: "Si j'étais toi, je partirais.", en: "If I were you, I'd leave." },
    ],
    work: [
      { fr: 'Si vous commandez cent pièces, nous vous offrirons une remise.', en: 'If you order a hundred pieces, we will offer you a discount.' },
      { fr: "Si vous avez des questions, n'hésitez pas à me contacter.", en: "If you have any questions, don't hesitate to contact me." },
      { fr: 'Si nous avions plus de budget, nous embaucherions deux personnes.', en: 'If we had more budget, we would hire two people.' },
    ],
    traps: [
      'Never put the future or conditionnel right after si.',
      'si + il = s’il, si + ils = s’ils. si + elle stays si elle.',
      'For the past (“if I had known…”) see “Say what would have happened”.',
      'Si tu veux is a friendly everyday offer.',
    ],
    tenses: ['Imparfait', 'Conditionnel présent'],
    verbGroups: ['core'],
    quiz: [
      { id: 'if-1', prompt: 'Si tu ___, on mangera ensemble. (venir)', options: ['viens', 'viendras', 'viendrais'], answer: 0, explanation: 'si + present.' },
      { id: 'if-2', prompt: "Si j'___ du temps, je voyagerais. (avoir)", options: ['avais', 'aurais', 'ai'], answer: 0, explanation: 'si + imparfait → conditionnel.' },
      { id: 'if-3', prompt: 'Which is correct?', options: ["Si j'avais de l'argent, j'achèterais une maison.", "Si j'aurais de l'argent, j'achèterais une maison.", "Si j'ai de l'argent, j'achèterais une maison."], answer: 0, explanation: 'si + imparfait, conditionnel.' },
      { id: 'if-4', prompt: 'Si vous commandez cent pièces, nous vous ___ une remise. (offrir)', options: ['offrirons', 'offririons', 'offrirez'], answer: 0, explanation: 'si + present → future.' },
      { id: 'if-5', prompt: "S'il ___ demain, on restera à la maison. (pleuvoir)", options: ['pleut', 'pleuvra', 'pleuvrait'], answer: 0, explanation: 'si + present, never future.' },
    ],
  },
  {
    slug: 'must-want',
    title: 'Say what must happen or what you want others to do',
    subtitle: 'Subjonctif · il faut que je parte · je veux que tu viennes',
    level: 'Core · later',
    timeline: { position: 'wish', label: 'Subjonctif' },
    summary: 'Use it after il faut que and je veux que. You do not need every trigger to hold a normal conversation.',
    whenToUse: [
      'Obligation: Il faut que je parte.',
      'Wanting someone else to do something: Je veux que tu viennes.',
      'Emotions about someone else: Je suis content que tu sois là.',
      'Business: Il faut que nous finissions avant vendredi.',
    ],
    steps: [
      { title: 'Use que + subject + subjonctif', body: 'The trigger (il faut, je veux, je suis content) is followed by que.' },
      { title: 'Make the form from ils', body: 'Take ils from the present, drop -ent, add -e, -es, -e, -ions, -iez, -ent. ils parlent → que je parle · ils finissent → que je finisse.' },
      { title: 'Learn the irregulars', body: 'être sois · avoir aie · aller aille · faire fasse · pouvoir puisse · vouloir veuille · savoir sache.' },
      { title: 'Same subject? Use the infinitive', body: 'Je veux partir (I want to leave). Je veux que tu partes (I want you to leave).' },
    ],
    life: [
      { fr: 'Il faut que je parte.', en: 'I have to leave.' },
      { fr: 'Je veux que tu viennes.', en: 'I want you to come.' },
      { fr: 'Je suis content que tu sois là.', en: "I'm glad you're here." },
      { fr: 'Appelle-moi avant que je parte.', en: 'Call me before I leave.' },
    ],
    work: [
      { fr: 'Il faut que nous finissions avant vendredi.', en: 'We have to finish before Friday.' },
      { fr: "Je voudrais que vous m'envoyiez le dossier.", en: "I'd like you to send me the file." },
      { fr: 'Il est important que tout le monde soit présent.', en: 'It is important that everyone is present.' },
      { fr: 'Bien que le budget soit limité, nous avançons.', en: 'Although the budget is limited, we are moving forward.' },
    ],
    traps: [
      'Same subject → infinitive. Different subjects → que + subjonctif.',
      'Il faut partir (one must leave) is fine. Il faut que je parte is more personal.',
      'Start with il faut que and je veux que. The other triggers come with time.',
    ],
    tenses: ['Subjonctif présent'],
    verbGroups: ['regular', 'core', 'more'],
    quiz: [
      { id: 'must-1', prompt: 'Il faut que je ___. (partir)', options: ['parte', 'pars', 'partirai'], answer: 0, explanation: 'ils partent → que je parte.' },
      { id: 'must-2', prompt: 'Je veux que tu ___ à l’heure. (être)', options: ['sois', 'es', 'seras'], answer: 0, explanation: 'être → sois.' },
      { id: 'must-3', prompt: 'Which is correct?', options: ['Je veux partir.', 'Je veux que je parte.', 'Je veux que partir.'], answer: 0, explanation: 'Same subject → infinitive.' },
      { id: 'must-4', prompt: 'Il faut que nous ___ ce soir. (finir)', options: ['finissions', 'finissons', 'finirons'], answer: 0, explanation: 'ils finissent → que nous finissions.' },
      { id: 'must-5', prompt: 'Il faut que vous ___ le contrat. (avoir)', options: ['ayez', 'avez', 'aurez'], answer: 0, explanation: 'avoir → ayez.' },
    ],
  },
  {
    slug: 'past-before',
    title: 'Say what had already happened',
    subtitle: 'Plus-que-parfait · j’avais fini, elle était partie',
    level: 'Core · later',
    timeline: { position: 'past', label: 'Plus-que-parfait' },
    summary: 'The past before the past. One thing had already happened when something else happened.',
    whenToUse: [
      'Before another past moment: Quand je suis arrivé, le film avait commencé.',
      'Reporting what someone said: Il m’a dit qu’il avait fini.',
      'Regrets with si seulement: Si seulement j’avais su !',
    ],
    steps: [
      { title: 'Imparfait of avoir or être + past participle', body: 'Same idea as the passé composé, but the helper verb is in the imparfait.', example: { fr: 'J’avais fini. Elle était partie.', en: 'I had finished. She had left.' } },
      { title: 'Same être verbs as the passé composé', body: 'aller, venir, partir, arriver, rester… and reflexive verbs. The participle agrees with the subject.', example: { fr: 'Nous étions déjà rentrés.', en: 'We had already come home.' } },
      { title: 'The earlier action gets the plus-que-parfait', body: 'The later action stays in the passé composé or imparfait.', example: { fr: 'Il avait plu, alors la rue était mouillée.', en: 'It had rained, so the street was wet.' } },
    ],
    life: [
      { fr: 'Quand je suis arrivé, le film avait déjà commencé.', en: 'When I arrived, the film had already started.' },
      { fr: 'Elle était déjà partie.', en: 'She had already left.' },
      { fr: 'Je n’avais jamais vu Paris avant.', en: 'I had never seen Paris before.' },
      { fr: 'Si seulement j’avais su !', en: 'If only I had known!' },
    ],
    work: [
      { fr: 'Le client avait déjà signé quand nous avons appelé.', en: 'The client had already signed when we called.' },
      { fr: 'Il m’a dit qu’il avait envoyé le rapport.', en: 'He told me he had sent the report.' },
      { fr: 'Nous avions prévu une réunion, mais elle a été annulée.', en: 'We had planned a meeting, but it was cancelled.' },
    ],
    traps: [
      'English often says “he said he finished”; French needs Il a dit qu’il avait fini.',
      'déjà and jamais go between the helper and the participle: j’avais déjà mangé.',
      'With être the participle agrees: elles étaient parties.',
    ],
    tenses: ['Plus-que-parfait'],
    verbGroups: ['regular', 'core', 'more'],
    quiz: [
      { id: 'pqp-1', prompt: 'Quand je suis arrivé, il ___ (partir, had already left).', options: ['était déjà parti', 'est déjà parti', 'avait déjà parti'], answer: 0, explanation: 'partir takes être; imparfait of être + parti.' },
      { id: 'pqp-2', prompt: 'Il m’a dit qu’il ___ le rapport. (finir)', options: ['avait fini', 'avait finir', 'était fini'], answer: 0, explanation: 'avoir in the imparfait + fini.' },
      { id: 'pqp-3', prompt: 'How do you say “I had never seen this film”?', options: ['Je n’avais jamais vu ce film.', 'Je n’ai jamais vu ce film.', 'Je ne voyais jamais ce film.'], answer: 0, explanation: 'Je n’ai jamais vu means “I have never seen”.' },
      { id: 'pqp-4', prompt: 'Nous ___ (manger, had eaten).', options: ['avions mangé', 'avons mangé', 'étions mangé'], answer: 0, explanation: 'manger takes avoir: avions mangé.' },
      { id: 'pqp-5', prompt: '“If only I had known!” =', options: ['Si seulement j’avais su !', 'Si seulement je savais !', 'Si seulement j’aurais su !'], answer: 0, explanation: 'Si seulement + plus-que-parfait for the past.' },
    ],
  },
  {
    slug: 'as-if',
    title: 'Say “as if…”',
    subtitle: 'comme si + imparfait · comme si j’avais fait',
    level: 'Core · later',
    timeline: { position: 'wish', label: 'Comme si' },
    summary: 'comme si means “as if”. Use the imparfait for “as if it were”, the plus-que-parfait for “as if it had happened”.',
    whenToUse: [
      'As if, at the same time: Il parle comme s’il était le chef.',
      'As if something had happened: Elle me regarde comme si j’avais fait une erreur.',
      'A common phrase: Fais comme si de rien n’était.',
    ],
    steps: [
      { title: 'comme si + imparfait = as if (now)', body: 'The “as if” part happens at the same time.', example: { fr: 'Il parle comme s’il savait tout.', en: 'He talks as if he knew everything.' } },
      { title: 'comme si + plus-que-parfait = as if … had', body: 'The “as if” part happened before.', example: { fr: 'Tu me regardes comme si j’avais fait quelque chose.', en: 'You look at me as if I had done something.' } },
      { title: 'si + il becomes s’il', body: 'comme s’il, comme s’ils. But comme si elle stays as it is.' },
    ],
    life: [
      { fr: 'Il parle comme s’il savait tout.', en: 'He talks as if he knew everything.' },
      { fr: 'Elle me regarde comme si j’avais fait quelque chose de mal.', en: 'She looks at me as if I had done something wrong.' },
      { fr: 'Tu manges comme si tu n’avais pas mangé depuis une semaine.', en: 'You eat as if you hadn’t eaten for a week.' },
      { fr: 'Fais comme si de rien n’était.', en: 'Act as if nothing happened.' },
    ],
    work: [
      { fr: 'Il agit comme s’il était le directeur.', en: 'He acts as if he were the director.' },
      { fr: 'Ils parlent du projet comme s’il était déjà fini.', en: 'They talk about the project as if it were already finished.' },
      { fr: 'Elle a répondu comme si elle n’avait pas lu l’e-mail.', en: 'She answered as if she hadn’t read the email.' },
    ],
    traps: [
      'Never the conditionnel after comme si: comme si j’aurais is wrong.',
      'Same rule as si: imparfait or plus-que-parfait only.',
      'comme s’il (with il/ils), but comme si elle.',
    ],
    tenses: ['Imparfait', 'Plus-que-parfait'],
    verbGroups: ['core'],
    quiz: [
      { id: 'asif-1', prompt: 'Il parle comme s’il ___ tout. (savoir)', options: ['savait', 'saurait', 'sait'], answer: 0, explanation: 'comme si + imparfait.' },
      { id: 'asif-2', prompt: '“as if I had done something wrong” =', options: ['comme si j’avais fait quelque chose de mal', 'comme si j’aurais fait quelque chose de mal', 'comme si je fais quelque chose de mal'], answer: 0, explanation: 'comme si + plus-que-parfait for “had done”.' },
      { id: 'asif-3', prompt: 'Ils parlent du projet comme s’il ___ déjà fini. (être)', options: ['était', 'serait', 'est'], answer: 0, explanation: 'comme si + imparfait.' },
      { id: 'asif-4', prompt: 'Which spelling is right?', options: ['comme s’il', 'comme si il', 'comme si’l'], answer: 0, explanation: 'si + il = s’il.' },
      { id: 'asif-5', prompt: 'Tu manges comme si tu n’___ pas mangé.', options: ['avais', 'aurais', 'as'], answer: 0, explanation: 'Plus-que-parfait: avais mangé.' },
    ],
  },
  {
    slug: 'would-have',
    title: 'Say what would have happened',
    subtitle: 'Conditionnel passé · j’aurais fait, si j’avais su',
    level: 'Core · later',
    timeline: { position: 'past', label: 'Conditionnel passé' },
    summary: 'Regrets and “what if” about the past. Very common: j’aurais dû (I should have), j’aurais pu (I could have).',
    whenToUse: [
      'Regrets: J’aurais dû t’appeler.',
      'Something you would have liked: J’aurais aimé venir.',
      'Unreal past with si: Si j’avais su, je serais venu.',
    ],
    steps: [
      { title: 'Conditionnel of avoir or être + past participle', body: 'Same être verbs as the passé composé.', example: { fr: 'J’aurais fait. Je serais venu.', en: 'I would have done. I would have come.' } },
      { title: 'si + plus-que-parfait, then conditionnel passé', body: 'The third kind of “if” sentence: things that did not happen.', example: { fr: 'Si j’avais su, je serais venu.', en: 'If I had known, I would have come.' } },
      { title: 'Learn three by heart', body: 'j’aurais dû = I should have · j’aurais pu = I could have · j’aurais aimé = I would have liked.' },
    ],
    life: [
      { fr: 'J’aurais dû t’appeler.', en: 'I should have called you.' },
      { fr: 'Si j’avais su, je serais venu.', en: 'If I had known, I would have come.' },
      { fr: 'On aurait pu prendre le train.', en: 'We could have taken the train.' },
      { fr: 'J’aurais aimé te voir.', en: 'I would have liked to see you.' },
    ],
    work: [
      { fr: 'Nous aurions préféré une autre date.', en: 'We would have preferred another date.' },
      { fr: 'Si vous m’aviez prévenu, j’aurais préparé le dossier.', en: 'If you had warned me, I would have prepared the file.' },
      { fr: 'Vous auriez dû nous contacter plus tôt.', en: 'You should have contacted us earlier.' },
      { fr: 'Sans ce retard, nous aurions fini en mars.', en: 'Without this delay, we would have finished in March.' },
    ],
    traps: [
      'Never the conditionnel right after si: si j’aurais su is wrong.',
      'j’aurais dû + infinitive: j’aurais dû partir (I should have left).',
      'je ferais = I would do; j’aurais fait = I would have done.',
    ],
    tenses: ['Conditionnel passé'],
    verbGroups: ['regular', 'core', 'more'],
    quiz: [
      { id: 'wh-1', prompt: 'Si j’avais su, je ___ venu.', options: ['serais', 'aurais', 'suis'], answer: 0, explanation: 'venir takes être: serais venu.' },
      { id: 'wh-2', prompt: '“I should have called you” =', options: ['J’aurais dû t’appeler.', 'Je devrais t’appeler.', 'J’ai dû t’appeler.'], answer: 0, explanation: 'Je devrais = I should; J’aurais dû = I should have.' },
      { id: 'wh-3', prompt: 'Si vous m’___ prévenu, j’aurais préparé le dossier.', options: ['aviez', 'auriez', 'avez'], answer: 0, explanation: 'si + plus-que-parfait.' },
      { id: 'wh-4', prompt: 'On ___ prendre le train. (could have)', options: ['aurait pu', 'pourrait', 'a pu'], answer: 0, explanation: 'aurait pu = could have.' },
      { id: 'wh-5', prompt: '“I would have liked to come” =', options: ['J’aurais aimé venir.', 'J’aimerais venir.', 'J’avais aimé venir.'], answer: 0, explanation: 'Conditionnel passé of aimer.' },
    ],
  },
  {
    slug: 'will-have',
    title: 'Say what will be done by then',
    subtitle: 'Futur antérieur · j’aurai fini, quand tu seras arrivé',
    level: 'Core · later',
    timeline: { position: 'future', label: 'Futur antérieur' },
    summary: 'Something finished before a moment in the future. Common in plans and business deadlines.',
    whenToUse: [
      'Done before a future moment: J’aurai fini avant midi.',
      'After quand, dès que, une fois que: Appelle-moi quand tu seras arrivé.',
      'Guessing what happened (“he must have missed the bus”): Il aura raté le bus.',
    ],
    steps: [
      { title: 'Futur of avoir or être + past participle', body: 'Same être verbs as the passé composé.', example: { fr: 'J’aurai fini. Elle sera partie.', en: 'I will have finished. She will have left.' } },
      { title: 'With quand / dès que for the first of two future actions', body: 'English uses “have done”; French uses the futur antérieur.', example: { fr: 'Dès que j’aurai reçu le contrat, je le signerai.', en: 'As soon as I have received the contract, I will sign it.' } },
    ],
    life: [
      { fr: 'J’aurai fini avant midi.', en: 'I will have finished before noon.' },
      { fr: 'Appelle-moi quand tu seras arrivé.', en: 'Call me when you have arrived.' },
      { fr: 'Dans un an, j’aurai appris le français.', en: 'In a year, I will have learned French.' },
      { fr: 'Il est en retard, il aura raté le bus.', en: 'He is late, he must have missed the bus.' },
    ],
    work: [
      { fr: 'Dès que j’aurai reçu le contrat, je vous l’enverrai.', en: 'As soon as I have received the contract, I will send it to you.' },
      { fr: 'Nous aurons terminé le projet avant la fin du mois.', en: 'We will have finished the project before the end of the month.' },
      { fr: 'Une fois que vous aurez signé, nous lancerons la commande.', en: 'Once you have signed, we will start the order.' },
    ],
    traps: [
      'After quand / dès que French uses the futur antérieur, not the present perfect: quand tu auras fini.',
      'In relaxed speech people often simplify. Recognise it first, then use it in emails.',
    ],
    tenses: ['Futur antérieur'],
    verbGroups: ['regular', 'core'],
    quiz: [
      { id: 'wl-1', prompt: 'Appelle-moi quand tu ___ arrivé.', options: ['seras', 'es', 'serais'], answer: 0, explanation: 'Futur of être + arrivé.' },
      { id: 'wl-2', prompt: 'J’___ fini avant midi.', options: ['aurai', 'aurais', 'ai'], answer: 0, explanation: 'aurai (futur), not aurais (conditionnel).' },
      { id: 'wl-3', prompt: '“As soon as I have received it, I will send it” =', options: ['Dès que je l’aurai reçu, je l’enverrai.', 'Dès que je l’ai reçu, je l’enverrai.', 'Dès que je le recevrais, je l’enverrai.'], answer: 0, explanation: 'dès que + futur antérieur.' },
      { id: 'wl-4', prompt: 'Dans un an, nous ___ appris le français.', options: ['aurons', 'aurions', 'avons'], answer: 0, explanation: 'Futur of avoir + appris.' },
    ],
  },
  {
    slug: 'must-past',
    title: 'Feel about something that happened',
    subtitle: 'Subjonctif passé · je suis content que tu sois venu',
    level: 'Core · later',
    timeline: { position: 'wish', label: 'Subjonctif passé' },
    summary: 'Same triggers as the subjonctif (content que, désolé que, je ne pense pas que), but the action is already done.',
    whenToUse: [
      'Feelings about a finished action: Je suis content que tu sois venu.',
      'Doubt about the past: Je ne pense pas qu’il ait compris.',
      'Something that must be done by a deadline: Il faut que vous ayez signé avant lundi.',
    ],
    steps: [
      { title: 'Subjonctif of avoir or être + past participle', body: 'que j’aie, que tu aies, qu’il ait… / que je sois, que tu sois…', example: { fr: 'que j’aie fini, que tu sois venu', en: 'that I finished, that you came' } },
      { title: 'Use it when the action came first', body: 'Présent: que tu viennes (you are coming). Passé: que tu sois venu (you came).' },
    ],
    life: [
      { fr: 'Je suis content que tu sois venu.', en: 'I’m glad you came.' },
      { fr: 'Je suis désolé que tu aies attendu.', en: 'I’m sorry you waited.' },
      { fr: 'Je ne pense pas qu’il ait compris.', en: 'I don’t think he understood.' },
      { fr: 'C’est dommage qu’elle soit partie.', en: 'It’s a pity she left.' },
    ],
    work: [
      { fr: 'Je suis ravi que vous ayez accepté notre offre.', en: 'I’m delighted you accepted our offer.' },
      { fr: 'Il faut que vous ayez signé avant lundi.', en: 'You must have signed before Monday.' },
      { fr: 'Bien qu’il ait fini tard, il est venu à la réunion.', en: 'Although he finished late, he came to the meeting.' },
    ],
    traps: [
      'que tu viennes = you come / are coming; que tu sois venu = you came.',
      'que j’aie has no -s; que tu aies has one.',
    ],
    tenses: ['Subjonctif passé'],
    verbGroups: ['regular', 'core'],
    quiz: [
      { id: 'sp-1', prompt: 'Je suis content que tu ___ venu.', options: ['sois', 'es', 'seras'], answer: 0, explanation: 'Subjonctif of être + venu.' },
      { id: 'sp-2', prompt: 'Je ne pense pas qu’il ___ compris.', options: ['ait', 'a', 'aura'], answer: 0, explanation: 'Doubt → subjonctif: ait compris.' },
      { id: 'sp-3', prompt: '“I’m sorry you waited” =', options: ['Je suis désolé que tu aies attendu.', 'Je suis désolé que tu as attendu.', 'Je suis désolé que tu attendras.'], answer: 0, explanation: 'désolé que + subjonctif passé.' },
      { id: 'sp-4', prompt: 'Bien qu’elle ___ fini tard, elle est venue.', options: ['ait', 'a', 'avait'], answer: 0, explanation: 'bien que always takes the subjonctif.' },
    ],
  },
  {
    slug: 'while-doing',
    title: 'Say while or by doing',
    subtitle: 'Gérondif · en parlant, en faisant',
    level: 'Core',
    timeline: { position: 'now', label: 'Gérondif' },
    summary: 'en + verb-ant: two things at the same time, or how you do something.',
    whenToUse: [
      'Two things at once: Je mange en regardant la télé.',
      'How: On apprend en pratiquant.',
      'When (“when I arrived…”): En arrivant, j’ai vu Marc.',
    ],
    steps: [
      { title: 'Take the nous form of the present', body: 'Drop -ons and add -ant.', example: { fr: 'nous parlons → en parlant', en: 'we speak → while speaking' } },
      { title: 'Put en in front', body: 'en faisant, en finissant, en prenant.' },
      { title: 'Three irregulars', body: 'être → en étant · avoir → en ayant · savoir → en sachant.' },
    ],
    life: [
      { fr: 'Je mange en regardant la télé.', en: 'I eat while watching TV.' },
      { fr: 'J’ai appris le français en voyageant.', en: 'I learned French by travelling.' },
      { fr: 'En arrivant, j’ai vu Marc.', en: 'When I arrived, I saw Marc.' },
      { fr: 'Il chante en conduisant.', en: 'He sings while driving.' },
    ],
    work: [
      { fr: 'Vous pouvez payer en ligne en utilisant ce lien.', en: 'You can pay online by using this link.' },
      { fr: 'En signant aujourd’hui, vous avez une remise.', en: 'By signing today, you get a discount.' },
      { fr: 'Elle a répondu en souriant.', en: 'She answered with a smile.' },
    ],
    traps: [
      'Both actions need the same person: Je mange en regardant (I eat, I watch).',
      '-ger verbs keep the e: en mangeant.',
      'It is not “I am eating” — that is just je mange.',
    ],
    tenses: ['Gérondif'],
    verbGroups: ['regular', 'core', 'more'],
    quiz: [
      { id: 'ger-1', prompt: 'Il chante ___ (conduire).', options: ['en conduisant', 'en conduire', 'en conduit'], answer: 0, explanation: 'nous conduisons → en conduisant.' },
      { id: 'ger-2', prompt: 'Gérondif of être?', options: ['en étant', 'en êtant', 'en être'], answer: 0, explanation: 'être is irregular: étant.' },
      { id: 'ger-3', prompt: '“I learned French by travelling” =', options: ['J’ai appris le français en voyageant.', 'J’ai appris le français par voyager.', 'J’ai appris le français en voyage.'], answer: 0, explanation: 'en + -ant shows how.' },
      { id: 'ger-4', prompt: 'Gérondif of manger?', options: ['en mangeant', 'en mangant', 'en mangeons'], answer: 0, explanation: '-ger verbs keep the e.' },
    ],
  },
  {
    slug: 'books-only',
    title: 'Recognise book tenses',
    subtitle: 'Passé simple · il parla, ils furent',
    level: 'Optional',
    timeline: { position: 'past', label: 'Passé simple' },
    summary: 'You will read these in novels, history and some news. You never need to say them. In speech use the passé composé.',
    whenToUse: [
      'Novels and fairy tales: Elle ouvrit la porte et sortit.',
      'History: Le roi mourut en 1715.',
      'Company histories: L’entreprise fut fondée en 1920.',
    ],
    steps: [
      { title: 'Recognise only', body: 'Read it, understand it, do not use it when you speak.' },
      { title: 'Regular endings', body: '-er: il parla, ils parlèrent · -ir / -re: il finit, ils finirent.' },
      { title: 'Common irregulars', body: 'être → il fut · avoir → il eut · faire → il fit · venir → il vint · aller → il alla.' },
    ],
    life: [
      { fr: 'Elle ouvrit la porte et sortit.', en: 'She opened the door and went out.' },
      { fr: 'Le roi mourut en 1715.', en: 'The king died in 1715.' },
      { fr: 'Ils furent très heureux.', en: 'They were very happy.' },
    ],
    work: [
      { fr: 'L’entreprise fut fondée en 1920.', en: 'The company was founded in 1920.' },
      { fr: 'Il devint directeur en 1985.', en: 'He became director in 1985.' },
      { fr: 'La société ouvrit son premier magasin à Lyon.', en: 'The company opened its first shop in Lyon.' },
    ],
    traps: [
      'When you speak, say il a parlé, not il parla.',
      'il finit can be present or passé simple: the context tells you.',
      'Two more book-only forms exist: passé antérieur (il eut fini) and subjonctif imparfait (qu’il fût). Recognise, skip.',
    ],
    tenses: ['Passé simple'],
    verbGroups: ['regular', 'core', 'more'],
    quiz: [
      { id: 'ps-1', prompt: '“Il parla” in normal speech is…', options: ['Il a parlé.', 'Il parlera.', 'Il parlait.'], answer: 0, explanation: 'Passé simple → passé composé when speaking.' },
      { id: 'ps-2', prompt: '“Ils furent” comes from…', options: ['être', 'faire', 'fuir'], answer: 0, explanation: 'être: il fut, ils furent.' },
      { id: 'ps-3', prompt: 'Should you use the passé simple when talking?', options: ['No, use the passé composé', 'Yes, always', 'Only with friends'], answer: 0, explanation: 'It is a written, literary tense.' },
    ],
  },

]

export const GOAL_BY_SLUG = new Map(TENSE_GOALS.map((goal) => [goal.slug, goal]))
