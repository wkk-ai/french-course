import type { LessonContent, VerbConjugation, VocabularyWord } from '@/lib/course'
import { conversationLine, readingParagraphs } from '@/lib/lesson-text'
export { MODULE1_RULES } from '@/lib/rules/catalog'

export const MODULE1_CHAPTER_IDS = [
  '22222222-0000-0000-0000-000000000101',
  '22222222-0000-0000-0000-000000000102',
  '22222222-0000-0000-0000-000000000103',
  '22222222-0000-0000-0000-000000000104',
] as const

export const MODULE1_VOCABULARY: VocabularyWord[] = [
  { id: '32a8a816-c56b-4e67-8549-bdfbc98e9b60', word: "bonjour", base_translation: "hello; good morning", meanings: ["hello", "good morning"], example: { french: "Bonjour, comment ça va ?", english: "Hello, how are you?" }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'bɔ̃.ʒuʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '12a8a816-c56b-4e67-8549-bdfbc98e9b60', word: "je", base_translation: "I", meanings: ["I (subject pronoun)"], example: { french: "Je suis étudiant.", english: "I am a student." }, part_of_speech: 'pronoun', gender: null, register: 'Courant', ipa_pronunciation: 'ʒə', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '22a8a816-c56b-4e67-8549-bdfbc98e9b60', word: "s'appeler", base_translation: "to be called", meanings: ["to be named", "to call oneself"], example: { french: "Je m'appelle Marie.", english: "My name is Marie." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'sa.plə.le', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '42a8a816-c56b-4e67-8549-bdfbc98e9b60', word: "Marc", base_translation: "Marc", meanings: ["proper name"], example: { french: "Je m'appelle Marc.", english: "My name is Marc." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'maʁk', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000001', word: "être", base_translation: "to be", meanings: ["to be (identity/description)"], example: { french: "Je suis français.", english: "I am French." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'ɛtʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000002', word: "français", base_translation: "French (m.)", meanings: ["French nationality/language (m.)"], example: { french: "Il est français.", english: "He is French." }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'fʁɑ̃.sɛ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000003', word: "Paris", base_translation: "Paris", meanings: ["capital of France"], example: { french: "J'habite à Paris.", english: "I live in Paris." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'pa.ʁi', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000004', word: "comment", base_translation: "how", meanings: ["how?"], example: { french: "Comment ça va ?", english: "How are you?" }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'kɔ.mɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000005', word: "ça", base_translation: "it; that", meanings: ["that/it (informal)"], example: { french: "Ça va bien.", english: "I'm doing well." }, part_of_speech: 'pronoun', gender: null, register: 'Courant', ipa_pronunciation: 'sa', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000006', word: "bien", base_translation: "well", meanings: ["well", "fine"], example: { french: "Ça va bien, merci.", english: "I'm fine, thank you." }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'bjɛ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000007', word: "merci", base_translation: "thank you", meanings: ["thanks", "thank you"], example: { french: "Merci beaucoup !", english: "Thank you very much!" }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'mɛʁ.si', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000008', word: "au revoir", base_translation: "goodbye", meanings: ["goodbye"], example: { french: "Au revoir, à demain !", english: "Goodbye, see you tomorrow!" }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'o ʁə.vwaʁ', is_idiom: true, is_slang: false, idiom_explanation: "Common farewell; slightly more formal than salut." },
  { id: '10000000-0000-0000-0000-000000000009', word: "aujourd'hui", base_translation: "today", meanings: ["today"], example: { french: "Aujourd'hui, c'est lundi.", english: "Today is Monday." }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'o.ʒuʁ.dɥi', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000010', word: "lundi", base_translation: "Monday", meanings: ["Monday"], example: { french: "Le cours est lundi.", english: "The class is on Monday." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'lœ̃.di', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000011', word: "mardi", base_translation: "Tuesday", meanings: ["Tuesday"], example: { french: "Demain, c'est mardi.", english: "Tomorrow is Tuesday." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'maʁ.di', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000012', word: "mercredi", base_translation: "Wednesday", meanings: ["Wednesday"], example: { french: "Mercredi, je reste à la maison.", english: "On Wednesday I stay home." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'mɛʁ.kʁə.di', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000013', word: "un", base_translation: "a; one (m.)", meanings: ["a/an (m.)", "one"], example: { french: "Je prends un café.", english: "I'll have a coffee." }, part_of_speech: 'determiner', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'œ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000014', word: "deux", base_translation: "two", meanings: ["two"], example: { french: "J'ai deux frères.", english: "I have two brothers." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'dø', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000015', word: "trois", base_translation: "three", meanings: ["three"], example: { french: "Nous sommes trois.", english: "There are three of us." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'tʁwa', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000016', word: "avoir", base_translation: "to have", meanings: ["to have", "to be (for age)"], example: { french: "J'ai vingt ans.", english: "I am twenty years old." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'a.vwaʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000017', word: "ans", base_translation: "years (of age)", meanings: ["years old"], example: { french: "Elle a quinze ans.", english: "She is fifteen." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000018', word: "café", base_translation: "coffee; café", meanings: ["coffee", "café (place)"], example: { french: "On va au café ?", english: "Shall we go to the café?" }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ka.fe', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000019', word: "thé", base_translation: "tea", meanings: ["tea"], example: { french: "Je prends un thé.", english: "I'll have a tea." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'te', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000020', word: "eau", base_translation: "water", meanings: ["water"], example: { french: "De l'eau, s'il vous plaît.", english: "Water, please." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'o', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000021', word: "croissant", base_translation: "croissant", meanings: ["croissant"], example: { french: "Un croissant, s'il vous plaît.", english: "A croissant, please." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'kʁwa.sɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000022', word: "prendre", base_translation: "to take; to have (food/drink)", meanings: ["to take", "to have (food/drink)"], example: { french: "Je prends un café.", english: "I'll have a coffee." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'pʁɑ̃dʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000023', word: "vouloir", base_translation: "to want", meanings: ["to want"], example: { french: "Je veux de l'eau.", english: "I want water." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'vu.lwaʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000024', word: "payer", base_translation: "to pay", meanings: ["to pay"], example: { french: "Je paie l'addition.", english: "I'll pay the bill." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'pɛ.je', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000025', word: "famille", base_translation: "family", meanings: ["family"], example: { french: "Ma famille est petite.", english: "My family is small." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'fa.mij', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000026', word: "mère", base_translation: "mother", meanings: ["mother"], example: { french: "Ma mère habite à Lyon.", english: "My mother lives in Lyon." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'mɛʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000027', word: "père", base_translation: "father", meanings: ["father"], example: { french: "Mon père est grand.", english: "My father is tall." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'pɛʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000028', word: "frère", base_translation: "brother", meanings: ["brother"], example: { french: "J'ai un frère.", english: "I have a brother." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'fʁɛʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000029', word: "sœur", base_translation: "sister", meanings: ["sister"], example: { french: "Ma sœur s'appelle Marie.", english: "My sister is called Marie." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'sœʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000030', word: "mon", base_translation: "my (m.)", meanings: ["my (masculine singular)"], example: { french: "Mon frère est jeune.", english: "My brother is young." }, part_of_speech: 'determiner', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'mɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000031', word: "ma", base_translation: "my (f.)", meanings: ["my (feminine singular)"], example: { french: "Ma sœur est française.", english: "My sister is French." }, part_of_speech: 'determiner', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'ma', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000032', word: "petit", base_translation: "small; little", meanings: ["small", "little"], example: { french: "Ma famille est petite.", english: "My family is small." }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'pə.ti', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000033', word: "grand", base_translation: "big; tall", meanings: ["big", "tall"], example: { french: "Mon frère est grand.", english: "My brother is tall." }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'gʁɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000034', word: "bonsoir", base_translation: "good evening", meanings: ["good evening"], example: { french: "Bonsoir, monsieur.", english: "Good evening, sir." }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'bɔ̃.swaʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000035', word: "salut", base_translation: "hi; bye (informal)", meanings: ["hi", "bye (casual)"], example: { french: "Salut Marc !", english: "Hi Marc!" }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'sa.ly', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000036', word: "s'il vous plaît", base_translation: "please (formal)", meanings: ["please (formal)"], example: { french: "Un café, s'il vous plaît.", english: "A coffee, please." }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'sil vu plɛ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000037', word: "pardon", base_translation: "sorry; excuse me", meanings: ["sorry", "excuse me"], example: { french: "Pardon ?", english: "Excuse me? / Pardon?" }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'paʁ.dɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000038', word: "habiter", base_translation: "to live; to reside", meanings: ["to live somewhere"], example: { french: "J'habite à Paris.", english: "I live in Paris." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'a.bi.te', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000039', word: "ville", base_translation: "city; town", meanings: ["city", "town"], example: { french: "Paris est une grande ville.", english: "Paris is a big city." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'vil', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000040', word: "pays", base_translation: "country", meanings: ["country"], example: { french: "La France est un beau pays.", english: "France is a beautiful country." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'pɛ.i', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000041', word: "française", base_translation: "French (f.)", meanings: ["French (feminine)"], example: { french: "Elle est française.", english: "She is French." }, part_of_speech: 'adjective', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'fʁɑ̃.sɛz', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000042', word: "anglais", base_translation: "English (m.)", meanings: ["English (m.)"], example: { french: "Il est anglais.", english: "He is English." }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ɑ̃.ɡlɛ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000043', word: "tu", base_translation: "you (informal)", meanings: ["you (singular informal)"], example: { french: "Tu es étudiant ?", english: "Are you a student?" }, part_of_speech: 'pronoun', gender: null, register: 'Courant', ipa_pronunciation: 'ty', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000044', word: "elle", base_translation: "she", meanings: ["she"], example: { french: "Elle habite à Lyon.", english: "She lives in Lyon." }, part_of_speech: 'pronoun', gender: null, register: 'Courant', ipa_pronunciation: 'ɛl', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000045', word: "il", base_translation: "he", meanings: ["he"], example: { french: "Il prend un café.", english: "He is having a coffee." }, part_of_speech: 'pronoun', gender: null, register: 'Courant', ipa_pronunciation: 'il', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000046', word: "jeudi", base_translation: "Thursday", meanings: ["Thursday"], example: { french: "On se voit jeudi.", english: "See you Thursday." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ʒø.di', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000047', word: "vendredi", base_translation: "Friday", meanings: ["Friday"], example: { french: "Mon anniversaire est vendredi.", english: "My birthday is on Friday." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'vɑ̃.dʁə.di', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000048', word: "samedi", base_translation: "Saturday", meanings: ["Saturday"], example: { french: "Samedi, on va au café.", english: "On Saturday we're going to the café." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'sam.di', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000049', word: "dimanche", base_translation: "Sunday", meanings: ["Sunday"], example: { french: "Dimanche, je reste à la maison.", english: "On Sunday I stay home." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'di.mɑ̃ʃ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000050', word: "semaine", base_translation: "week", meanings: ["week"], example: { french: "Cette semaine, j'ai trois cours.", english: "This week I have three classes." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'sə.mɛn', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000051', word: "mois", base_translation: "month", meanings: ["month"], example: { french: "Le mois prochain.", english: "Next month." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'mwa', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000052', word: "année", base_translation: "year", meanings: ["year"], example: { french: "Bonne année !", english: "Happy New Year!" }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'a.ne', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000053', word: "demain", base_translation: "tomorrow", meanings: ["tomorrow"], example: { french: "À demain !", english: "See you tomorrow!" }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'də.mɛ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000054', word: "hier", base_translation: "yesterday", meanings: ["yesterday"], example: { french: "Hier, c'était dimanche.", english: "Yesterday was Sunday." }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'jɛʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000055', word: "anniversaire", base_translation: "birthday", meanings: ["birthday", "anniversary"], example: { french: "Joyeux anniversaire !", english: "Happy birthday!" }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'a.ni.vɛʁ.sɛʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000056', word: "vingt", base_translation: "twenty", meanings: ["twenty"], example: { french: "J'ai vingt ans.", english: "I am twenty." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'vɛ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000057', word: "dix", base_translation: "ten", meanings: ["ten"], example: { french: "J'ai dix euros.", english: "I have ten euros." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'dis', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000058', word: "quinze", base_translation: "fifteen", meanings: ["fifteen"], example: { french: "Elle a quinze ans.", english: "She is fifteen." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'kɛ̃z', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000059', word: "trente", base_translation: "thirty", meanings: ["thirty"], example: { french: "Il a trente ans.", english: "He is thirty." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'tʁɑ̃t', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000060', word: "lait", base_translation: "milk", meanings: ["milk"], example: { french: "Du lait, s'il vous plaît.", english: "Some milk, please." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'lɛ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000061', word: "pain", base_translation: "bread", meanings: ["bread"], example: { french: "Elle aime le pain.", english: "She likes bread." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'pɛ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000062', word: "sucre", base_translation: "sugar", meanings: ["sugar"], example: { french: "Un peu de sucre ?", english: "A little sugar?" }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'sykʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000063', word: "addition", base_translation: "bill (restaurant)", meanings: ["bill/check"], example: { french: "L'addition, s'il vous plaît.", english: "The bill, please." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'a.di.sjɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000064', word: "serveur", base_translation: "waiter", meanings: ["waiter"], example: { french: "Le serveur apporte le café.", english: "The waiter brings the coffee." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'sɛʁ.vœʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000065', word: "aimer", base_translation: "to like; to love", meanings: ["to like", "to love"], example: { french: "J'aime le thé.", english: "I like tea." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'ɛ.me', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000066', word: "manger", base_translation: "to eat", meanings: ["to eat"], example: { french: "On mange un croissant.", english: "We're eating a croissant." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'mɑ̃.ʒe', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000067', word: "boire", base_translation: "to drink", meanings: ["to drink"], example: { french: "Je bois de l'eau.", english: "I drink water." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'bwaʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000068', word: "commander", base_translation: "to order", meanings: ["to order food"], example: { french: "Je commande un café.", english: "I'm ordering a coffee." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'kɔ.mɑ̃.de', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000069', word: "une", base_translation: "a; one (f.)", meanings: ["a/an (f.)", "one"], example: { french: "Une sœur et un frère.", english: "One sister and one brother." }, part_of_speech: 'determiner', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'yn', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000070', word: "parents", base_translation: "parents", meanings: ["parents"], example: { french: "Mes parents habitent à Lyon.", english: "My parents live in Lyon." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'pa.ʁɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000071', word: "fils", base_translation: "son", meanings: ["son"], example: { french: "Ils ont un fils.", english: "They have a son." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'fis', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000072', word: "fille", base_translation: "daughter; girl", meanings: ["daughter", "girl"], example: { french: "Ils ont une fille.", english: "They have a daughter." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'fij', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000073', word: "enfant", base_translation: "child", meanings: ["child"], example: { french: "Deux enfants.", english: "Two children." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ɑ̃.fɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000074', word: "mes", base_translation: "my (plural)", meanings: ["my (plural)"], example: { french: "Mes parents sont à Lyon.", english: "My parents are in Lyon." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'mɛ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000075', word: "jeune", base_translation: "young", meanings: ["young"], example: { french: "Ma sœur est jeune.", english: "My sister is young." }, part_of_speech: 'adjective', gender: null, register: 'Courant', ipa_pronunciation: 'ʒœn', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000076', word: "ami", base_translation: "friend (m.)", meanings: ["friend (male)"], example: { french: "Mon ami s'appelle Paul.", english: "My friend is called Paul." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'a.mi', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000077', word: "amie", base_translation: "friend (f.)", meanings: ["friend (female)"], example: { french: "Mon amie Marie habite ici.", english: "My friend Marie lives here." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'a.mi', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000078', word: "Marie", base_translation: "Marie", meanings: ["proper name"], example: { french: "Elle s'appelle Marie.", english: "Her name is Marie." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'ma.ʁi', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000079', word: "Lyon", base_translation: "Lyon", meanings: ["city in France"], example: { french: "Ils habitent à Lyon.", english: "They live in Lyon." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'ljɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000080', word: "étudiant", base_translation: "student (m.)", meanings: ["student"], example: { french: "Je suis étudiant.", english: "I am a student." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'e.ty.djɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000081', word: "à bientôt", base_translation: "see you soon", meanings: ["see you soon", "talk soon"], example: { french: "Merci, à bientôt !", english: "Thanks, see you soon!" }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'a bjɛ̃.to', is_idiom: true, is_slang: false, idiom_explanation: "Friendly goodbye when you expect to meet again soon." },
  { id: '10000000-0000-0000-0000-000000000082', word: "et", base_translation: "and", meanings: ["and"], example: { french: "Marc et Marie.", english: "Marc and Marie." }, part_of_speech: 'conjunction', gender: null, register: 'Courant', ipa_pronunciation: 'e', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000083', word: "à", base_translation: "to; at; in", meanings: ["to", "at", "in (cities)"], example: { french: "J'habite à Paris.", english: "I live in Paris." }, part_of_speech: 'preposition', gender: null, register: 'Courant', ipa_pronunciation: 'a', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000084', word: "aussi", base_translation: "also; too", meanings: ["also", "too"], example: { french: "Moi aussi !", english: "Me too!" }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'o.si', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000085', word: "oui", base_translation: "yes", meanings: ["yes"], example: { french: "Oui, s'il vous plaît.", english: "Yes, please." }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'wi', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000086', word: "non", base_translation: "no", meanings: ["no"], example: { french: "Non, merci.", english: "No, thank you." }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'nɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000087', word: "avec", base_translation: "with", meanings: ["with"], example: { french: "Avec plaisir.", english: "With pleasure." }, part_of_speech: 'preposition', gender: null, register: 'Courant', ipa_pronunciation: 'a.vɛk', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000088', word: "pour", base_translation: "for", meanings: ["for"], example: { french: "Pour moi, un thé.", english: "For me, a tea." }, part_of_speech: 'preposition', gender: null, register: 'Courant', ipa_pronunciation: 'puʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000089', word: "de", base_translation: "of; from; some", meanings: ["of", "from", "some"], example: { french: "Un peu de sucre.", english: "A little sugar." }, part_of_speech: 'preposition', gender: null, register: 'Courant', ipa_pronunciation: 'də', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000090', word: "du", base_translation: "some (m.); of the", meanings: ["some (m.)", "of the"], example: { french: "Du sucre ?", english: "Some sugar?" }, part_of_speech: 'determiner', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'dy', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000091', word: "le", base_translation: "the (m.)", meanings: ["the (masculine)"], example: { french: "Le serveur arrive.", english: "The waiter arrives." }, part_of_speech: 'determiner', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'lə', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000092', word: "en", base_translation: "in; to", meanings: ["in/to (countries)"], example: { french: "Elle habite en France.", english: "She lives in France." }, part_of_speech: 'preposition', gender: null, register: 'Courant', ipa_pronunciation: 'ɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000093', word: "France", base_translation: "France", meanings: ["France"], example: { french: "J'habite en France.", english: "I live in France." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'fʁɑ̃s', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000094', word: "toi", base_translation: "you (stressed)", meanings: ["you (informal stressed)"], example: { french: "Et toi ?", english: "And you?" }, part_of_speech: 'pronoun', gender: null, register: 'Courant', ipa_pronunciation: 'twa', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000095', word: "moi", base_translation: "me; I (stressed)", meanings: ["me", "I (emphatic)"], example: { french: "Moi aussi !", english: "Me too!" }, part_of_speech: 'pronoun', gender: null, register: 'Courant', ipa_pronunciation: 'mwa', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000096', word: "vous", base_translation: "you (formal/plural)", meanings: ["you formal/plural"], example: { french: "Vous désirez ?", english: "What would you like?" }, part_of_speech: 'pronoun', gender: null, register: 'Courant', ipa_pronunciation: 'vu', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000097', word: "on", base_translation: "one; we (informal)", meanings: ["one", "we (casual)"], example: { french: "On se voit samedi ?", english: "Shall we meet Saturday?" }, part_of_speech: 'pronoun', gender: null, register: 'Courant', ipa_pronunciation: 'ɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000098', word: "très", base_translation: "very", meanings: ["very"], example: { french: "Très bien.", english: "Very well." }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'tʁɛ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000099', word: "peu", base_translation: "a little", meanings: ["a little"], example: { french: "Un peu de sucre.", english: "A little sugar." }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'pø', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000100', word: "va", base_translation: "goes; is going (aller)", meanings: ["goes", "in ça va: how are things"], example: { french: "Comment ça va ?", english: "How are you?" }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'va', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000101', word: "enchanté", base_translation: "nice to meet you", meanings: ["pleased to meet you", "delighted"], example: { french: "Enchanté, Marie.", english: "Nice to meet you, Marie." }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'ɑ̃.ʃɑ̃.te', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000102', word: "son", base_translation: "his; her (m.)", meanings: ["his/her (masculine noun)", "its"], example: { french: "Son anniversaire est vendredi.", english: "His/her birthday is Friday." }, part_of_speech: 'determiner', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'sɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000103', word: "cette", base_translation: "this; that (f.)", meanings: ["this (feminine)", "that (feminine)"], example: { french: "Cette semaine, j'ai trois cours.", english: "This week I have three classes." }, part_of_speech: 'determiner', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'sɛt', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000104', word: "cours", base_translation: "class; course", meanings: ["class", "course", "lesson"], example: { french: "J'ai trois cours.", english: "I have three classes." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'kuʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000105', word: "quel", base_translation: "what; which", meanings: ["what", "which"], example: { french: "Quel âge as-tu ?", english: "How old are you?" }, part_of_speech: 'determiner', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'kɛl', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000106', word: "âge", base_translation: "age", meanings: ["age"], example: { french: "Quel âge as-tu ?", english: "How old are you?" }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ɑʒ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000107', word: "mademoiselle", base_translation: "miss", meanings: ["miss", "young woman (formal address)"], example: { french: "Bonjour, mademoiselle.", english: "Hello, miss." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'mad.mwa.zɛl', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000108', word: "super", base_translation: "great; awesome", meanings: ["great", "awesome"], example: { french: "Super !", english: "Great!" }, part_of_speech: 'interjection', gender: null, register: 'Familier', ipa_pronunciation: 'sy.pɛʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000109', word: "se", base_translation: "oneself; each other", meanings: ["reflexive pronoun", "each other"], example: { french: "On se voit samedi ?", english: "Shall we see each other Saturday?" }, part_of_speech: 'pronoun', gender: null, register: 'Courant', ipa_pronunciation: 'sə', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000110', word: "voir", base_translation: "to see", meanings: ["to see", "to meet"], example: { french: "On se voit demain.", english: "See you tomorrow." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'vwaʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000111', word: "au", base_translation: "to the; at the (m.)", meanings: ["to the (m.)", "at the (m.)"], example: { french: "Au café.", english: "At the café." }, part_of_speech: 'preposition', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'o', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000112', word: "apporter", base_translation: "to bring", meanings: ["to bring"], example: { french: "Le serveur apporte le café.", english: "The waiter brings the coffee." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'a.pɔʁ.te', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000113', word: "désirer", base_translation: "to want; to desire", meanings: ["to want", "to desire (formal service)"], example: { french: "Vous désirez ?", english: "What would you like?" }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'de.zi.ʁe', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000114', word: "plaisir", base_translation: "pleasure", meanings: ["pleasure"], example: { french: "Avec plaisir.", english: "With pleasure." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'plɛ.ziʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000115', word: "sûr", base_translation: "sure; certain", meanings: ["sure", "certain"], example: { french: "Bien sûr !", english: "Of course!" }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'syʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000116', word: "des", base_translation: "some (plural)", meanings: ["some (plural)", "of the (plural)"], example: { french: "Tu as des frères ?", english: "Do you have brothers?" }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'de', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000117', word: "ta", base_translation: "your (f. informal)", meanings: ["your (feminine singular, informal)"], example: { french: "Comment s'appelle ta sœur ?", english: "What's your sister's name?" }, part_of_speech: 'determiner', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'ta', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000118', word: "ton", base_translation: "your (m. informal)", meanings: ["your (masculine singular, informal)"], example: { french: "Et ton père ?", english: "And your father?" }, part_of_speech: 'determiner', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'tɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000119', word: "nous", base_translation: "we", meanings: ["we (subject pronoun)"], example: { french: "Nous sommes amis.", english: "We are friends." }, part_of_speech: 'pronoun', gender: null, register: 'Courant', ipa_pronunciation: 'nu', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000120', word: "matin", base_translation: "morning", meanings: ["morning", "in the morning"], example: { french: "Le matin, je prends un café.", english: "In the morning, I have a coffee." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ma.tɛ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000121', word: "soir", base_translation: "evening", meanings: ["evening", "in the evening"], example: { french: "Le soir, on dit bonsoir.", english: "In the evening, we say good evening." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'swaʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000122', word: "quotidien", base_translation: "daily; everyday", meanings: ["daily", "everyday life"], example: { french: "Au quotidien, on dit bonjour.", english: "In everyday life, we say hello." }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'kɔ.ti.djɛ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000123', word: "parler", base_translation: "to speak; to talk", meanings: ["to speak", "to talk"], example: { french: "Je parle français.", english: "I speak French." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'paʁ.le', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000124', word: "inconnu", base_translation: "stranger; unknown", meanings: ["stranger", "unknown person"], example: { french: "Parler à un inconnu.", english: "To speak to a stranger." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ɛ̃.kɔ.ny', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000125', word: "utiliser", base_translation: "to use", meanings: ["to use"], example: { french: "On utilise vous.", english: "We use \"vous\"." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'y.ti.li.ze', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000126', word: "utile", base_translation: "useful", meanings: ["useful", "helpful"], example: { french: "C'est très utile.", english: "It's very useful." }, part_of_speech: 'adjective', gender: null, register: 'Courant', ipa_pronunciation: 'y.til', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000127', word: "autre", base_translation: "other; another", meanings: ["other", "another"], example: { french: "Une autre ville.", english: "Another city." }, part_of_speech: 'adjective', gender: null, register: 'Courant', ipa_pronunciation: 'otʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000128', word: "différence", base_translation: "difference", meanings: ["difference"], example: { french: "C'est une différence importante.", english: "It's an important difference." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'di.fe.ʁɑ̃s', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000129', word: "important", base_translation: "important", meanings: ["important", "significant"], example: { french: "C'est très important.", english: "It's very important." }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ɛ̃.pɔʁ.tɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000130', word: "rencontrer", base_translation: "to meet", meanings: ["to meet", "to encounter"], example: { french: "Marc et Marie se rencontrent.", english: "Marc and Marie meet." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'ʁɑ̃.kɔ̃.tʁe', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000131', word: "répondre", base_translation: "to answer; to reply", meanings: ["to answer", "to reply"], example: { french: "Elle répond oui.", english: "She answers yes." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'ʁe.pɔ̃dʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000132', word: "demander", base_translation: "to ask", meanings: ["to ask (a question)"], example: { french: "Il demande l'addition.", english: "He asks for the bill." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'də.mɑ̃.de', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000133', word: "dire", base_translation: "to say; to tell", meanings: ["to say", "to tell"], example: { french: "Il dit bonjour.", english: "He says hello." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'diʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000134', word: "Paul", base_translation: "Paul", meanings: ["proper name"], example: { french: "Paul est anglais.", english: "Paul is English." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'pɔl', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000135', word: "base", base_translation: "basis; foundation", meanings: ["basis", "foundation"], example: { french: "C'est la base.", english: "It's the foundation." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'baz', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000136', word: "université", base_translation: "university", meanings: ["university"], example: { french: "À l'université.", english: "At the university." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'y.ni.vɛʁ.si.te', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000137', word: "professeur", base_translation: "teacher; professor", meanings: ["teacher", "professor"], example: { french: "Le professeur dit bonjour.", english: "The teacher says hello." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'pʁɔ.fɛ.sœʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000138', word: "classe", base_translation: "class; classroom", meanings: ["class", "classroom"], example: { french: "Une classe internationale.", english: "An international class." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'klas', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000139', word: "international", base_translation: "international", meanings: ["international"], example: { french: "Une classe internationale.", english: "An international class." }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ɛ̃.tɛʁ.na.sjɔ.nal', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000140', word: "Thomas", base_translation: "Thomas", meanings: ["proper name"], example: { french: "Je m'appelle Thomas.", english: "My name is Thomas." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'tɔ.ma', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000141', word: "Sophie", base_translation: "Sophie", meanings: ["proper name"], example: { french: "Moi, c'est Sophie.", english: "I'm Sophie." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'sɔ.fi', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000142', word: "étudiante", base_translation: "student (f.)", meanings: ["student (female)"], example: { french: "Je suis étudiante.", english: "I am a student." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'e.ty.djɑ̃t', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000143', word: "plus", base_translation: "more; plus", meanings: ["more", "plus (math)"], example: { french: "Un nom plus un prénom.", english: "A name plus a first name." }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'ply', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000144', word: "monde", base_translation: "world; people", meanings: ["world", "people (tout le monde)"], example: { french: "Bonjour à tout le monde.", english: "Hello everyone." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'mɔ̃d', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000145', word: "rue", base_translation: "street", meanings: ["street"], example: { french: "Dans la rue.", english: "In the street." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'ʁy', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000146', word: "politesse", base_translation: "politeness", meanings: ["politeness", "courtesy"], example: { french: "La politesse est importante.", english: "Politeness is important." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'pɔ.li.tɛs', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000147', word: "souvent", base_translation: "often", meanings: ["often", "frequently"], example: { french: "On dit souvent merci.", english: "We often say thank you." }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'su.vɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000148', word: "calendrier", base_translation: "calendar", meanings: ["calendar"], example: { french: "Marc regarde le calendrier.", english: "Marc looks at the calendar." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ka.lɑ̃.dʁje', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000149', word: "regarder", base_translation: "to look at; to watch", meanings: ["to look at", "to watch"], example: { french: "Marc regarde le calendrier.", english: "Marc looks at the calendar." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'ʁə.gaʁ.de', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000150', word: "maison", base_translation: "house; home", meanings: ["house", "home"], example: { french: "Je reste à la maison.", english: "I stay home." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'mɛ.zɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000151', word: "rester", base_translation: "to stay; to remain", meanings: ["to stay", "to remain"], example: { french: "Elle reste à la maison.", english: "She stays home." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'ʁɛs.te', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000152', word: "organiser", base_translation: "to organize", meanings: ["to organize", "to arrange"], example: { french: "Organiser la vie.", english: "To organize life." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'ɔʁ.ga.ni.ze', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000153', word: "heure", base_translation: "hour; o'clock", meanings: ["hour", "o'clock (time)"], example: { french: "À dix heures.", english: "At ten o'clock." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'œʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000154', word: "midi", base_translation: "noon; midday", meanings: ["noon", "midday"], example: { french: "Il est midi.", english: "It is noon." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'mi.di', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000155', word: "combien", base_translation: "how much; how many", meanings: ["how much", "how many"], example: { french: "Combien ça coûte ?", english: "How much does it cost?" }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'kɔ̃.bjɛ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000156', word: "euro", base_translation: "euro", meanings: ["euro (currency)"], example: { french: "Deux euros.", english: "Two euros." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ø.ʁo', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000157', word: "coûter", base_translation: "to cost", meanings: ["to cost"], example: { french: "Ça coûte trois euros.", english: "It costs three euros." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'ku.te', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000158', word: "touriste", base_translation: "tourist", meanings: ["tourist"], example: { french: "Un touriste demande le prix.", english: "A tourist asks the price." }, part_of_speech: 'noun', gender: null, register: 'Courant', ipa_pronunciation: 'tu.ʁist', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000159', word: "chaque", base_translation: "each; every", meanings: ["each", "every"], example: { french: "Chaque mois.", english: "Every month." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'ʃak', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000160', word: "environ", base_translation: "approximately; about", meanings: ["approximately", "about"], example: { french: "Environ trente jours.", english: "About thirty days." }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'ɑ̃.vi.ʁɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000161', word: "cinquante", base_translation: "fifty", meanings: ["fifty"], example: { french: "Cinquante euros.", english: "Fifty euros." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'sɛ̃.kɑ̃t', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000162', word: "quatre", base_translation: "four", meanings: ["four"], example: { french: "Quatre euros.", english: "Four euros." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'katʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000163', word: "cinq", base_translation: "five", meanings: ["five"], example: { french: "Cinq jours.", english: "Five days." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'sɛ̃k', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000164', word: "six", base_translation: "six", meanings: ["six"], example: { french: "Six heures.", english: "Six o'clock." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'sis', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000165', word: "sept", base_translation: "seven", meanings: ["seven"], example: { french: "Sept jours.", english: "Seven days." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'sɛt', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000166', word: "huit", base_translation: "eight", meanings: ["eight"], example: { french: "Huit euros.", english: "Eight euros." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'ɥit', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000167', word: "neuf", base_translation: "nine", meanings: ["nine"], example: { french: "Neuf ans.", english: "Nine years." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'nœf', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000168', word: "onze", base_translation: "eleven", meanings: ["eleven"], example: { french: "Onze heures.", english: "Eleven o'clock." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'ɔ̃z', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000169b', word: "douze", base_translation: "twelve", meanings: ["twelve"], example: { french: "Douze mois.", english: "Twelve months." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'duz', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000170', word: "treize", base_translation: "thirteen", meanings: ["thirteen"], example: { french: "Treize ans.", english: "Thirteen years." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'tʁɛz', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000171', word: "quatorze", base_translation: "fourteen", meanings: ["fourteen"], example: { french: "Quatorze jours.", english: "Fourteen days." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'ka.tɔʁz', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000172', word: "seize", base_translation: "sixteen", meanings: ["sixteen"], example: { french: "Seize ans.", english: "Sixteen years." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'sɛz', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000173', word: "dix-sept", base_translation: "seventeen", meanings: ["seventeen"], example: { french: "Dix-sept ans.", english: "Seventeen years." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'di.sɛt', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000174b', word: "dix-huit", base_translation: "eighteen", meanings: ["eighteen"], example: { french: "Dix-huit ans.", english: "Eighteen years." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'di.zɥit', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000175', word: "dix-neuf", base_translation: "nineteen", meanings: ["nineteen"], example: { french: "Dix-neuf ans.", english: "Nineteen years." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'di.znœf', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000176', word: "fête", base_translation: "party; celebration", meanings: ["party", "celebration"], example: { french: "Une fête d'anniversaire.", english: "A birthday party." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'fɛt', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000177', word: "planifier", base_translation: "to plan", meanings: ["to plan", "to schedule"], example: { french: "Elle planifie sa semaine.", english: "She plans her week." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'pla.ni.fje', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000178', word: "reposer", base_translation: "to rest", meanings: ["to rest", "to relax"], example: { french: "Elle se repose.", english: "She rests." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'ʁə.po.ze', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000179', word: "préparer", base_translation: "to prepare", meanings: ["to prepare", "to get ready"], example: { french: "Elle prépare la semaine.", english: "She prepares for the week." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'pʁe.pa.ʁe', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000180', word: "examen", base_translation: "exam; test", meanings: ["exam", "test"], example: { french: "Un examen de français.", english: "A French exam." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ɛɡ.za.mɛ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000181', word: "parfait", base_translation: "perfect", meanings: ["perfect", "great"], example: { french: "Parfait !", english: "Perfect!" }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'paʁ.fɛ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000182', word: "d'accord", base_translation: "okay; agreed", meanings: ["okay", "agreed", "all right"], example: { french: "D'accord !", english: "Okay!" }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'da.kɔʁ', is_idiom: true, is_slang: false, idiom_explanation: "Fixed expression meaning agreement." },
  { id: '10000000-0000-0000-0000-000000000183', word: "après-demain", base_translation: "the day after tomorrow", meanings: ["the day after tomorrow"], example: { french: "Après-demain, c'est mercredi.", english: "The day after tomorrow is Wednesday." }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'a.pʁɛ də.mɛ̃', is_idiom: true, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000184', word: "quelle", base_translation: "what; which (f.)", meanings: ["what (f.)", "which (f.)"], example: { french: "Quelle heure est-il ?", english: "What time is it?" }, part_of_speech: 'determiner', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'kɛl', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000185', word: "les", base_translation: "the (plural)", meanings: ["the (plural)"], example: { french: "Les jours de la semaine.", english: "The days of the week." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'le', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000186', word: "la", base_translation: "the (f.)", meanings: ["the (feminine)"], example: { french: "La semaine.", english: "The week." }, part_of_speech: 'determiner', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'la', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000187', word: "coin", base_translation: "corner", meanings: ["corner"], example: { french: "Au café du coin.", english: "At the café on the corner." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'kwɛ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000188', word: "installer", base_translation: "to sit down; to settle", meanings: ["to sit down", "to install oneself"], example: { french: "Ils s'installent à la terrasse.", english: "They sit on the terrace." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'ɛ̃s.tale', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000189', word: "terrasse", base_translation: "terrace; patio", meanings: ["terrace", "outdoor seating"], example: { french: "À la terrasse du café.", english: "On the café terrace." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'tɛ.ʁas', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000190', word: "chaud", base_translation: "hot; warm", meanings: ["hot", "warm"], example: { french: "Un café chaud.", english: "A hot coffee." }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ʃo', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000191', word: "délicieux", base_translation: "delicious", meanings: ["delicious", "tasty"], example: { french: "Le thé est délicieux.", english: "The tea is delicious." }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'de.li.sjø', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000192', word: "beurre", base_translation: "butter", meanings: ["butter"], example: { french: "Du pain avec du beurre.", english: "Bread with butter." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'bœʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000193', word: "voisine", base_translation: "neighbor (f.)", meanings: ["neighbor (female)", "at the next table"], example: { french: "La table voisine.", english: "The neighboring table." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'vwa.zin', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000194', word: "couple", base_translation: "couple", meanings: ["couple", "pair"], example: { french: "Un couple au café.", english: "A couple at the café." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'kupl', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000195', word: "jus", base_translation: "juice", meanings: ["juice"], example: { french: "Du jus d'orange.", english: "Orange juice." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ʒy', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000196', word: "orange", base_translation: "orange", meanings: ["orange (fruit/color)"], example: { french: "Du jus d'orange.", english: "Orange juice." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'ɔ.ʁɑ̃ʒ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000197', word: "homme", base_translation: "man", meanings: ["man", "husband (context)"], example: { french: "L'homme paie.", english: "The man pays." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ɔm', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000198', word: "donner", base_translation: "to give", meanings: ["to give"], example: { french: "Elle donne dix euros.", english: "She gives ten euros." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'dɔ.ne', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000199', word: "menu", base_translation: "menu", meanings: ["menu"], example: { french: "Marc regarde le menu.", english: "Marc looks at the menu." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'mə.ny', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000200', word: "chocolat", base_translation: "chocolate", meanings: ["chocolate"], example: { french: "Un chocolat chaud.", english: "A hot chocolate." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ʃɔ.kɔ.la', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000201', word: "petit-déjeuner", base_translation: "breakfast", meanings: ["breakfast"], example: { french: "Après le petit-déjeuner.", english: "After breakfast." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'pə.ti de.ʒø.ne', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000202', word: "carte", base_translation: "card; menu", meanings: ["card (bank)", "menu (la carte)"], example: { french: "Payer avec une carte.", english: "To pay with a card." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'kaʁt', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000203', word: "tradition", base_translation: "tradition", meanings: ["tradition"], example: { french: "Une tradition française.", english: "A French tradition." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'tʁa.di.sjɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000204', word: "parfois", base_translation: "sometimes", meanings: ["sometimes"], example: { french: "Parfois l'après-midi aussi.", english: "Sometimes in the afternoon too." }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'paʁ.fwa', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000205', word: "après-midi", base_translation: "afternoon", meanings: ["afternoon"], example: { french: "L'après-midi.", english: "The afternoon." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'a.pʁɛ mi.di', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000206', word: "comptoir", base_translation: "counter", meanings: ["counter (bar/café)"], example: { french: "Au comptoir du café.", english: "At the café counter." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'kɔ̃.twaʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000207', word: "voilà", base_translation: "here is; there you go", meanings: ["here is", "there you go"], example: { french: "Voilà vos boissons.", english: "Here are your drinks." }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'vwa.la', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000208', word: "faire", base_translation: "to do; to make", meanings: ["to do", "to make", "ça fait = it costs"], example: { french: "Ça fait sept euros.", english: "That comes to seven euros." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'fɛʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000209', word: "beaucoup", base_translation: "a lot; very much", meanings: ["a lot", "very much"], example: { french: "Merci beaucoup !", english: "Thank you very much!" }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'bo.ku', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000210', word: "de rien", base_translation: "you're welcome", meanings: ["you're welcome", "don't mention it"], example: { french: "De rien.", english: "You're welcome." }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'də ʁjɛ̃', is_idiom: true, is_slang: false, idiom_explanation: "Polite reply to merci." },
  { id: '10000000-0000-0000-0000-000000000211', word: "uni", base_translation: "close; united", meanings: ["close-knit", "united"], example: { french: "Une famille unie.", english: "A close family." }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'y.ni', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000212', word: "Pierre", base_translation: "Pierre", meanings: ["proper name"], example: { french: "Mon père s'appelle Pierre.", english: "My father's name is Pierre." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'pjɛʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000213', word: "Claire", base_translation: "Claire", meanings: ["proper name"], example: { french: "Ma mère s'appelle Claire.", english: "My mother's name is Claire." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'klɛʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000214', word: "cadet", base_translation: "younger (sibling)", meanings: ["younger", "junior"], example: { french: "Ma sœur cadette.", english: "My younger sister." }, part_of_speech: 'adjective', gender: null, register: 'Courant', ipa_pronunciation: 'ka.dɛ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000215', word: "Jeanne", base_translation: "Jeanne", meanings: ["proper name"], example: { french: "Ma grand-mère s'appelle Jeanne.", english: "My grandmother is called Jeanne." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'ʒan', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000216', word: "Isabelle", base_translation: "Isabelle", meanings: ["proper name"], example: { french: "Ma tante Isabelle.", english: "My aunt Isabelle." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'i.za.bɛl', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000217', word: "Henri", base_translation: "Henri", meanings: ["proper name"], example: { french: "Mon oncle Henri.", english: "My uncle Henri." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'ɑ̃.ʁi', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000218', word: "Anne", base_translation: "Anne", meanings: ["proper name"], example: { french: "Ma tante Anne.", english: "My aunt Anne." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'an', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000219', word: "Lucie", base_translation: "Lucie", meanings: ["proper name"], example: { french: "Ma tante Lucie.", english: "My aunt Lucie." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'ly.si', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000220', word: "Lucas", base_translation: "Lucas", meanings: ["proper name"], example: { french: "Son frère s'appelle Lucas.", english: "Her brother is called Lucas." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'ly.ka', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000221', word: "Emma", base_translation: "Emma", meanings: ["proper name"], example: { french: "Sa sœur s'appelle Emma.", english: "Her sister is called Emma." }, part_of_speech: 'proper noun', gender: null, register: 'Courant', ipa_pronunciation: 'ɛ.ma', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000222', word: "sympa", base_translation: "nice; friendly", meanings: ["nice", "friendly (informal)"], example: { french: "Elle est très sympa.", english: "She is very nice." }, part_of_speech: 'adjective', gender: null, register: 'Familier', ipa_pronunciation: 'sɛ̃.pa', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000223', word: "retrouver", base_translation: "to meet up; to find again", meanings: ["to meet up", "to find again"], example: { french: "Les familles se retrouvent.", english: "Families get together." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'ʁə.tʁu.ve', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000224', word: "repas", base_translation: "meal", meanings: ["meal"], example: { french: "Un bon repas.", english: "A good meal." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ʁə.pa', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000225', word: "raconter", base_translation: "to tell (a story)", meanings: ["to tell", "to recount"], example: { french: "Il raconte des histoires.", english: "He tells stories." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'ʁa.kɔ̃.te', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000226', word: "histoire", base_translation: "story; history", meanings: ["story", "history"], example: { french: "Des histoires.", english: "Stories." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'is.twaʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000227', word: "fromage", base_translation: "cheese", meanings: ["cheese"], example: { french: "Du pain et du fromage.", english: "Bread and cheese." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'fʁɔ.maʒ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000228', word: "jouer", base_translation: "to play", meanings: ["to play"], example: { french: "Les enfants jouent.", english: "The children play." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'ʒwe', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000229', word: "jardin", base_translation: "garden", meanings: ["garden", "yard"], example: { french: "Dans le jardin.", english: "In the garden." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ʒaʁ.dɛ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000230', word: "moment", base_translation: "moment", meanings: ["moment", "time"], example: { french: "Un beau moment.", english: "A beautiful moment." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'mɔ.mɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000231', word: "chouette", base_translation: "great; cool", meanings: ["great", "cool (informal)"], example: { french: "Ta famille a l'air chouette !", english: "Your family seems great!" }, part_of_speech: 'adjective', gender: null, register: 'Familier', ipa_pronunciation: 'ʃwɛt', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000232', word: "air", base_translation: "look; air", meanings: ["look (avoir l'air)", "air"], example: { french: "Avoir l'air chouette.", english: "To seem great." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ɛʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000233', word: "où", base_translation: "where", meanings: ["where?"], example: { french: "Tes parents habitent où ?", english: "Where do your parents live?" }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'u', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000234', word: "mais", base_translation: "but", meanings: ["but", "however"], example: { french: "Il est anglais mais il habite en France.", english: "He is English but he lives in France." }, part_of_speech: 'conjunction', gender: null, register: 'Courant', ipa_pronunciation: 'mɛ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000235', word: "plusieurs", base_translation: "several", meanings: ["several", "a number of"], example: { french: "Plusieurs cousins.", english: "Several cousins." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'ply.zjœʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000236', word: "ensemble", base_translation: "together", meanings: ["together"], example: { french: "Un moment ensemble.", english: "A moment together." }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'ɑ̃.sɑ̃bl', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000237', word: "grand-mère", base_translation: "grandmother", meanings: ["grandmother"], example: { french: "Ma grand-mère habite à Paris.", english: "My grandmother lives in Paris." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'gʁɑ̃.mɛʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000238', word: "grand-père", base_translation: "grandfather", meanings: ["grandfather"], example: { french: "Mon grand-père raconte des histoires.", english: "My grandfather tells stories." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'gʁɑ̃.pɛʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000239', word: "oncle", base_translation: "uncle", meanings: ["uncle"], example: { french: "Mon oncle Paul.", english: "My uncle Paul." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ɔ̃kl', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000240', word: "tante", base_translation: "aunt", meanings: ["aunt"], example: { french: "Ma tante Anne.", english: "My aunt Anne." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'tɑ̃t', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000241', word: "cousin", base_translation: "cousin (m.)", meanings: ["cousin (male)"], example: { french: "J'ai trois cousins.", english: "I have three cousins." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ku.zɛ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000242', word: "cousine", base_translation: "cousin (f.)", meanings: ["cousin (female)"], example: { french: "Une cousine.", english: "A female cousin." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'ku.zin', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000243', word: "mari", base_translation: "husband", meanings: ["husband"], example: { french: "Son mari.", english: "Her husband." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ma.ʁi', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000244', word: "femme", base_translation: "woman; wife", meanings: ["woman", "wife"], example: { french: "Sa femme.", english: "His wife." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'fam', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000245', word: "différent", base_translation: "different", meanings: ["different"], example: { french: "Une famille différente.", english: "A different family." }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'di.fe.ʁɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000246', word: "tout", base_translation: "all; every", meanings: ["all", "every (tout le monde)"], example: { french: "Tout le monde.", english: "Everyone." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'tu', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000247', word: "peut", base_translation: "can (pouvoir)", meanings: ["can", "may (from pouvoir)"], example: { french: "On peut dire salut.", english: "We can say hi." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'pø', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000248', word: "pouvoir", base_translation: "to be able to; can", meanings: ["to be able to", "can"], example: { french: "On peut dire salut.", english: "We can say hi." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'pu.vwaʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000249', word: "se", base_translation: "oneself (reflexive)", meanings: ["oneself", "each other"], example: { french: "On se voit samedi.", english: "We see each other Saturday." }, part_of_speech: 'pronoun', gender: null, register: 'Courant', ipa_pronunciation: 'sə', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000250', word: "zéro", base_translation: "zero", meanings: ["zero"], example: { french: "Zéro euro.", english: "Zero euros." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'ze.ʁo', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000251', word: "jour", base_translation: "day", meanings: ["day"], example: { french: "Chaque jour.", english: "Every day." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ʒuʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000252', word: "bon", base_translation: "good", meanings: ["good"], example: { french: "Un bon repas.", english: "A good meal." }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'bɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000253', word: "beau", base_translation: "beautiful; handsome", meanings: ["beautiful", "handsome"], example: { french: "Un beau moment.", english: "A beautiful moment." }, part_of_speech: 'adjective', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'bo', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000254', word: "partir", base_translation: "to leave", meanings: ["to leave", "to go"], example: { french: "En partant.", english: "When leaving." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'paʁ.tiʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000255', word: "étudier", base_translation: "to study", meanings: ["to study"], example: { french: "Elle étudie à la maison.", english: "She studies at home." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'e.ty.dje', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000256', word: "fêter", base_translation: "to celebrate", meanings: ["to celebrate"], example: { french: "Fêter un anniversaire.", english: "To celebrate a birthday." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'fɛ.te', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000257', word: "semaine prochaine", base_translation: "next week", meanings: ["next week"], example: { french: "La semaine prochaine.", english: "Next week." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'sə.mɛn pʁɔ.ʃɛn', is_idiom: true, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000258', word: "cinquante-deux", base_translation: "fifty-two", meanings: ["fifty-two"], example: { french: "Cinquante-deux semaines.", english: "Fifty-two weeks." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'sɛ̃.kɑ̃t dø', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000259', word: "voici", base_translation: "here is", meanings: ["here is", "here are"], example: { french: "Voici dix euros.", english: "Here are ten euros." }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'vwa.si', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000260', word: "simple", base_translation: "simple; easy", meanings: ["simple", "easy"], example: { french: "C'est simple.", english: "It's simple." }, part_of_speech: 'adjective', gender: null, register: 'Courant', ipa_pronunciation: 'sɛ̃pl', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000261', word: "du", base_translation: "some (m.); of the", meanings: ["some (m.)", "of the"], example: { french: "Du beurre.", english: "Some butter." }, part_of_speech: 'determiner', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'dy', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000262', word: "ce", base_translation: "this; that", meanings: ["this", "that (demonstrative)"], example: { french: "Ce café.", english: "This café." }, part_of_speech: 'determiner', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'sə', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000263', word: "travail", base_translation: "work", meanings: ["work", "job"], example: { french: "Les jours de travail.", english: "Work days." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'tʁa.vaj', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000264', word: "école", base_translation: "school", meanings: ["school"], example: { french: "Les jours d'école.", english: "School days." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'e.kɔl', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000265', word: "toujours", base_translation: "always", meanings: ["always"], example: { french: "On dit toujours bonjour.", english: "We always say hello." }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'tu.ʒuʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000266', word: "vie", base_translation: "life", meanings: ["life"], example: { french: "Organiser la vie.", english: "To organize life." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'vi', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000267', word: "week-end", base_translation: "weekend", meanings: ["weekend"], example: { french: "Le week-end.", english: "The weekend." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'wikɛnd', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000268', word: "identifier", base_translation: "to identify", meanings: ["to identify"], example: { french: "Identifier une personne.", english: "To identify a person." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'ɛ̃.dɑ̃.ti.fje', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000269', word: "décrire", base_translation: "to describe", meanings: ["to describe"], example: { french: "Décrire une personne.", english: "To describe a person." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'de.kʁiʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000272', word: "attention", base_translation: "attention; watch out", meanings: ["attention", "watch out"], example: { french: "Attention !", english: "Watch out!" }, part_of_speech: 'interjection', gender: null, register: 'Courant', ipa_pronunciation: 'a.tɑ̃.sjɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000273', word: "dans", base_translation: "in; into", meanings: ["in", "into"], example: { french: "Dans la rue.", english: "In the street." }, part_of_speech: 'preposition', gender: null, register: 'Courant', ipa_pronunciation: 'dɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000274', word: "conversation", base_translation: "conversation", meanings: ["conversation"], example: { french: "Une bonne conversation.", english: "A good conversation." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'kɔ̃.vɛʁ.sa.sjɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000275', word: "nationalité", base_translation: "nationality", meanings: ["nationality"], example: { french: "Pour la nationalité.", english: "For nationality." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'na.sjɔ.na.li.te', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000276', word: "nom", base_translation: "name; surname", meanings: ["name", "surname"], example: { french: "Un nom.", english: "A name." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'nɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000277', word: "ou", base_translation: "or", meanings: ["or"], example: { french: "Un inconnu ou un professeur.", english: "A stranger or a teacher." }, part_of_speech: 'conjunction', gender: null, register: 'Courant', ipa_pronunciation: 'u', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000278', word: "personne", base_translation: "person", meanings: ["person", "nobody (with ne)"], example: { french: "Une personne.", english: "A person." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'pɛʁ.sɔn', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000279', word: "présenter", base_translation: "to introduce; to present", meanings: ["to introduce", "to present"], example: { french: "Se présenter.", english: "To introduce oneself." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'pʁe.zɑ̃.te', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000280', word: "après", base_translation: "after", meanings: ["after"], example: { french: "Après le petit-déjeuner.", english: "After breakfast." }, part_of_speech: 'preposition', gender: null, register: 'Courant', ipa_pronunciation: 'a.pʁɛ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000281', word: "argent", base_translation: "money; silver", meanings: ["money", "silver"], example: { french: "L'argent.", english: "Money." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'aʁ.ʒɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000282', word: "nombre", base_translation: "number", meanings: ["number"], example: { french: "Les nombres.", english: "Numbers." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'nɔ̃bʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000283', word: "question", base_translation: "question", meanings: ["question"], example: { french: "Des questions utiles.", english: "Useful questions." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'kɛs.tjɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000284', word: "partout", base_translation: "everywhere", meanings: ["everywhere"], example: { french: "Les nombres servent partout.", english: "Numbers are used everywhere." }, part_of_speech: 'adverb', gender: null, register: 'Courant', ipa_pronunciation: 'paʁ.tu', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000285', word: "arriver", base_translation: "to arrive", meanings: ["to arrive"], example: { french: "Le serveur arrive.", english: "The waiter arrives." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'a.ʁi.ve', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000286', word: "boisson", base_translation: "drink; beverage", meanings: ["drink", "beverage"], example: { french: "Vos boissons.", english: "Your drinks." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'bwa.sɔ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000287', word: "table", base_translation: "table", meanings: ["table"], example: { french: "À la table voisine.", english: "At the neighboring table." }, part_of_speech: 'noun', gender: 'feminine', register: 'Courant', ipa_pronunciation: 'tabl', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000288', word: "chez", base_translation: "at the home of; at", meanings: ["at the home of", "at (chez Marie)"], example: { french: "Chez Marie.", english: "At Marie's place." }, part_of_speech: 'preposition', gender: null, register: 'Courant', ipa_pronunciation: 'ʃe', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000289', word: "ils", base_translation: "they (m.)", meanings: ["they (masculine/mixed)"], example: { french: "Ils ont des frères.", english: "They have brothers." }, part_of_speech: 'pronoun', gender: null, register: 'Courant', ipa_pronunciation: 'il', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000290', word: "tes", base_translation: "your (plural informal)", meanings: ["your (plural, informal)"], example: { french: "Tes parents.", english: "Your parents." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'tɛ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000291', word: "gens", base_translation: "people", meanings: ["people"], example: { french: "Les gens prennent un café.", english: "People have a coffee." }, part_of_speech: 'noun', gender: 'masculine', register: 'Courant', ipa_pronunciation: 'ʒɑ̃', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000292', word: "vos", base_translation: "your (plural/formal)", meanings: ["your (plural/formal)"], example: { french: "Vos boissons.", english: "Your drinks." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'vo', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000293', word: "ces", base_translation: "these; those", meanings: ["these", "those"], example: { french: "Ces questions.", english: "These questions." }, part_of_speech: 'determiner', gender: null, register: 'Courant', ipa_pronunciation: 'se', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000294', word: "servir", base_translation: "to serve", meanings: ["to serve", "to be used for"], example: { french: "Les nombres servent partout.", english: "Numbers are used everywhere." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'sɛʁ.viʁ', is_idiom: false, is_slang: false, idiom_explanation: null },
  { id: '10000000-0000-0000-0000-000000000295', word: "aller", base_translation: "to go", meanings: ["to go"], example: { french: "On va au café.", english: "We're going to the café." }, part_of_speech: 'verb', gender: null, register: 'Courant', ipa_pronunciation: 'a.le', is_idiom: false, is_slang: false, idiom_explanation: null },
]

const V = MODULE1_VOCABULARY


export const MODULE1_LESSONS: Record<string, LessonContent> = {
  '22222222-0000-0000-0000-000000000101': {
    brief: {
      title: 'Introduce yourself with confidence',
      body: 'What this lesson is for: meet people, say who you are, and use the most important polite words in French.\n\n**1. Words to learn first (meanings)**\nBefore any grammar, learn these with their English meanings. Do not skip this list.\n\nGreetings and politeness:\n- *bonjour* = hello / good day (daytime; the default polite greeting)\n- *bonsoir* = good evening\n- *salut* = hi / bye (casual; friends and peers only)\n- *au revoir* = goodbye\n- *à bientôt* = see you soon\n- *merci* = thank you\n- *s\'il vous plaît* = please (formal or plural *vous*)\n- *s\'il te plaît* = please (informal *tu*)\n- *pardon* = excuse me / sorry (to get attention or apologize lightly)\n- *enchanté* / *enchantée* = pleased to meet you (speaker gender: *enchantée* if the speaker is feminine)\n\nPeople and identity:\n- *je* = I\n- *tu* = you (informal singular)\n- *il* = he / it (masculine)\n- *elle* = she / it (feminine)\n- *nous* = we\n- *vous* = you (formal singular, or any plural)\n- *ils* = they (masculine or mixed group)\n- *elles* = they (all feminine)\n- *français* / *française* = French (person or language; adjective agrees in gender)\n- *anglais* / *anglaise* = English (person)\n- *étudiant* / *étudiante* = student\n- *ami* / *amie* = friend\n- *ville* = city\n- *France* = France\n- *Paris*, *Lyon* = city names (proper names — learn as labels, not Review flashcards)\n\nKey verbs (learn as infinitives — the dictionary form):\n- *être* = to be\n- *s\'appeler* = to be called / to call oneself\n- *habiter* = to live (in a place)\n- *aimer* = to like / to love\n- *dire* = to say (you will hear *dit* = says)\n\nUseful chunks (learn as whole phrases):\n- *je m\'appelle…* = my name is…\n- *moi, c\'est…* = I am… / this is me, …\n- *comment ça va ?* = how are you?\n- *ça va bien* = I am fine / it is going well\n- *comment vous appelez-vous ?* = what is your name? (formal)\n- *comment tu t\'appelles ?* = what is your name? (informal)\n\n**2. Subject pronouns — who does the action**\nFrench usually keeps the subject pronoun. The verb form changes with the pronoun.\n- *je* + verb = I …\n- *tu* + verb = you … (one friend / peer)\n- *il/elle* + verb = he/she …\n- *nous* + verb = we …\n- *vous* + verb = you … (respect, stranger, or several people)\n- *ils/elles* + verb = they …\n\nTrap: English often drops “you”; French rarely drops *tu/vous*.\n\n**3. Être (to be) — present forms**\nMemorize these; *être* is irregular:\n- *je suis* = I am\n- *tu es* = you are (informal)\n- *il/elle est* = he/she is\n- *nous sommes* = we are\n- *vous êtes* = you are (formal/plural)\n- *ils/elles sont* = they are\n\nUse *être* for: identity, nationality, profession, descriptions (*je suis français*, *elle est étudiante*).\n\n**4. Name vs description (critical trap)**\nTwo different tools:\n- **Identify a person by name:** *c\'est* + name → *C\'est Marie.* = That is Marie. / It is Marie.\n- **Describe nationality or quality:** *il/elle est* + adjective → *Elle est française.* = She is French.\n\nNever say *c\'est française*. That mixes the two patterns. Say *C\'est Marie* or *Elle est française*.\n\n**5. Je m\'appelle…**\nPattern: *je m\'appelle* + first name. Meaning: I call myself… / My name is…\nInformal variant: *Moi, c\'est Marc.*\n\n**6. Habiter (to live somewhere)**\n- City: *habiter à* + city → *J\'habite à Paris.* = I live in Paris.\n- Feminine country (many end in -e): *habiter en* + country → *J\'habite en France.* = I live in France.\nPresent forms you need now: *j\'habite*, *tu habites*, *il/elle habite*, *nous habitons*, *vous habitez*, *ils/elles habitent*.\n\n**7. Tu vs vous (register)**\n- *tu*: friends, family, children, classmates who offered *tu*\n- *vous*: strangers, elders, teachers, shop staff, first meetings — or talking to more than one person\nWhen unsure, start with *vous*. Switching to *tu* later is safer than the reverse.\n\n**8. Nationality adjectives agree**\nThe adjective matches the person:\n- masculine: *français*, *anglais*\n- feminine: *française*, *anglaise*\nSo: *Il est français.* / *Elle est française.*\n\n**9. How a first meeting often goes**\n1. Greeting: *Bonjour !* or *Salut !* (only if casual)\n2. Name: *Je m\'appelle…* / *Moi, c\'est…*\n3. Optional: *Enchanté(e).*\n4. Question: *Tu es française ?* / *Vous êtes anglais ?*\n5. Place: *J\'habite à…*\n6. Closing: *Au revoir* / *À bientôt* + *merci* when thanks are due\n\n**10. What to practice in this lesson**\nSay who you are, pick *tu* or *vous* on purpose, use *c\'est* only for names, and use *il/elle est* for nationality. Every French word above should feel linked to an English meaning before you rush the conjugations.',
      ruleSlugs: ["subject-pronouns","etre-present","cest-versus-il-est"],
    },
    reading: readingParagraphs('c1', [
      'Bonjour ! Je m\'appelle Marc et je suis français. J\'habite à Paris, une grande ville en France. Je suis étudiant et j\'aime ma ville. Mon amie Marie est française aussi : elle habite à Lyon, une autre grande ville. Nous sommes amis et nous aimons le français.',
      'En France, la politesse est très importante au quotidien. Voici les formules utiles :\n- bonjour le matin\n- bonsoir le soir\n- salut entre amis\n- vous et s\'il vous plaît avec un inconnu ou un professeur\n- pardon quand on dérange',
      'Pour se présenter, on dit : Je m\'appelle… ou Moi, c\'est… plus un nom. Pour la nationalité : Je suis français ou Elle est française. Attention à la différence : C\'est Marc identifie une personne. Il est français décrit. C\'est une différence très importante en français !',
      'Marc et Marie se rencontrent à Paris un lundi. Marc dit : Bonjour ! Je m\'appelle Marc. Enchanté. Marie répond : Salut Marc ! Moi, c\'est Marie. Enchantée. Marc demande : Tu es française ? Marie dit : Oui, je suis française. Et toi ? Marc répond : Je suis français. J\'habite à Paris. Marie ajoute : Moi aussi ! Comment ça va ? Marc dit : Ça va bien, merci.',
      'Le soir, Marc dit bonsoir à son ami Paul. Paul est anglais mais il habite en France. Marc demande : Tu es anglais ? Paul répond : Oui, je suis anglais, mais j\'habite à Paris avec plaisir. En partant, les amis disent au revoir et à bientôt. En France, on dit souvent merci — c\'est la base d\'une bonne conversation.',
      'Dans une classe à Paris, le professeur dit : Bonjour ! Comment vous appelez-vous ? Un étudiant répond : Je m\'appelle Thomas. Je suis anglais. Une étudiante dit : Moi, c\'est Sophie. Je suis française. J\'habite à Lyon. Le professeur conclut : Très bien ! Vous êtes une classe internationale.',
    ], V),
    conversation: {
      title: 'Meeting Marie',
      setting: 'Marc meets Marie for the first time in Paris.',
      lines: [
        conversationLine('Marc', 'Bonjour ! Je m\'appelle Marc. Enchanté.', 'c1-l0', V),
        conversationLine('Marie', 'Salut Marc ! Moi, c\'est Marie. Enchantée.', 'c1-l1', V),
        conversationLine('Marc', 'Tu es française ?', 'c1-l2', V),
        conversationLine('Marie', 'Oui, je suis française. Et toi ?', 'c1-l3', V),
        conversationLine('Marc', 'Je suis français. J\'habite à Paris.', 'c1-l4', V),
        conversationLine('Marie', 'Moi aussi ! J\'habite à Lyon. Comment ça va ?', 'c1-l5', V),
        conversationLine('Marc', 'Ça va bien, merci. Et toi ?', 'c1-l6', V),
        conversationLine('Marie', 'Très bien, merci ! Tu es étudiant ?', 'c1-l7', V),
        conversationLine('Marc', 'Oui, je suis étudiant. Et toi ?', 'c1-l8', V),
        conversationLine('Marie', 'Oui, moi aussi. Je suis étudiante.', 'c1-l9', V),
        conversationLine('Marc', 'Super ! C\'est une grande ville, Lyon.', 'c1-l10', V),
        conversationLine('Marie', 'Oui, et Paris aussi ! C\'est une très grande ville.', 'c1-l11', V),
        conversationLine('Marc', 'Au revoir, Marie ! À bientôt !', 'c1-l12', V),
        conversationLine('Marie', 'Au revoir, Marc ! Merci et à bientôt !', 'c1-l13', V),
      ],
    },
    exercises: [
          {
                "id": "c1-e1",
                "category": "être-present",
                "prompt": "Complete: Je ___ Marc.",
                "options": [
                      "est",
                      "suis",
                      "sont"
                ],
                "answer": 1,
                "explanation": "With je, être becomes suis."
          },
          {
                "id": "c1-e2",
                "category": "cest-versus-il-est",
                "prompt": "Which sentence identifies someone by name?",
                "options": [
                      "Il est Marc.",
                      "C'est Marc.",
                      "Je est Marc."
                ],
                "answer": 1,
                "explanation": "Use c'est before a name or noun phrase."
          },
          {
                "id": "c1-e3",
                "category": "être-present",
                "prompt": "Choose the correct form for elle.",
                "options": [
                      "Elle suis française.",
                      "Elle est française.",
                      "Elle sont française."
                ],
                "answer": 1,
                "explanation": "Il/elle/on takes est."
          },
          {
                "id": "c1-e4",
                "category": "subject-pronouns",
                "prompt": "Which pronoun means \"you\" (informal)?",
                "options": [
                      "il",
                      "tu",
                      "elle"
                ],
                "answer": 1,
                "explanation": "Tu is the informal singular \"you\"."
          },
          {
                "id": "c1-e5",
                "category": "greetings",
                "prompt": "What do you say in the evening?",
                "options": [
                      "Bonjour",
                      "Bonsoir",
                      "Salut matin"
                ],
                "answer": 1,
                "explanation": "Bonsoir is used in the evening."
          },
          {
                "id": "c1-e6",
                "category": "cest-versus-il-est",
                "prompt": "Fill in: ___ française. (describing Marie)",
                "options": [
                      "C'est",
                      "Elle est",
                      "Je suis"
                ],
                "answer": 1,
                "explanation": "Use il/elle est before an adjective of nationality."
          },
          {
                "id": "c1-e7",
                "category": "greetings",
                "prompt": "Which phrase is polite \"please\" (formal)?",
                "options": [
                      "pardon",
                      "s'il vous plaît",
                      "salut"
                ],
                "answer": 1,
                "explanation": "S'il vous plaît is the formal please."
          },
          {
                "id": "c1-e8",
                "category": "être-present",
                "prompt": "Nous ___ à Lyon. (we are)",
                "options": [
                      "suis",
                      "êtes",
                      "sommes"
                ],
                "answer": 2,
                "explanation": "Nous sommes is the nous form of être."
          },
          {
                "id": "c1-e9",
                "category": "identity",
                "prompt": "How do you say \"My name is Marie\"?",
                "options": [
                      "Je suis Marie.",
                      "Je m'appelle Marie.",
                      "J'habite Marie."
                ],
                "answer": 1,
                "explanation": "Je m'appelle + name is the usual introduction."
          },
          {
                "id": "c1-e10",
                "category": "conversation",
                "prompt": "In a first meeting, Marc says \"Enchanté.\" What does he mean?",
                "options": [
                      "Goodbye",
                      "Nice to meet you",
                      "I am English"
                ],
                "answer": 1,
                "explanation": "Enchanté means pleased to meet you."
          },
          {
                "id": "c1-e11",
                "category": "habiter",
                "prompt": "J'___ à Paris.",
                "options": [
                      "habite",
                      "habites",
                      "habitent"
                ],
                "answer": 0,
                "explanation": "Je habite → j'habite."
          },
          {
                "id": "c1-e12",
                "category": "prepositions",
                "prompt": "She lives in France: Elle habite ___ France.",
                "options": [
                      "à",
                      "en",
                      "de"
                ],
                "answer": 1,
                "explanation": "Use en before most feminine country names."
          },
          {
                "id": "c1-e13",
                "category": "tu-vous",
                "prompt": "With a stranger in a shop, you should use…",
                "options": [
                      "tu",
                      "vous",
                      "on"
                ],
                "answer": 1,
                "explanation": "Vous is the polite default with strangers."
          },
          {
                "id": "c1-e14",
                "category": "cest-versus-il-est",
                "prompt": "___ une grande ville. (identifying)",
                "options": [
                      "C'est",
                      "Elle est",
                      "Il est"
                ],
                "answer": 0,
                "explanation": "C'est + noun phrase for identification."
          },
          {
                "id": "c1-e15",
                "category": "habiter",
                "prompt": "How do you say “She lives in Lyon”?",
                "options": [
                      "Elle habite à Lyon.",
                      "Elle est à Lyon.",
                      "Elle a Lyon."
                ],
                "answer": 0,
                "explanation": "Habiter + à + city: Elle habite à Lyon."
          },
          {
                "id": "c1-e16",
                "category": "greetings",
                "prompt": "\"See you soon\" in French is…",
                "options": [
                      "au revoir",
                      "à bientôt",
                      "bonsoir"
                ],
                "answer": 1,
                "explanation": "À bientôt = see you soon."
          },
          {
                "id": "c1-e17",
                "category": "être-present",
                "prompt": "Ils ___ français.",
                "options": [
                      "est",
                      "sont",
                      "sommes"
                ],
                "answer": 1,
                "explanation": "Ils/elles → sont."
          },
          {
                "id": "c1-e18",
                "category": "conversation",
                "prompt": "Marie says \"Moi aussi!\" — she means…",
                "options": [
                      "Me neither",
                      "Me too",
                      "Goodbye"
                ],
                "answer": 1,
                "explanation": "Moi aussi = me too."
          },
          {
                "id": "c1-e19",
                "category": "greetings",
                "prompt": "Casual hello/goodbye between friends:",
                "options": [
                      "bonjour",
                      "salut",
                      "monsieur"
                ],
                "answer": 1,
                "explanation": "Salut is informal hi/bye."
          },
          {
                "id": "c1-e20",
                "category": "identity",
                "prompt": "Paul is ___ but lives in France.",
                "options": [
                      "français",
                      "anglais",
                      "parisien"
                ],
                "answer": 1,
                "explanation": "Paul est anglais."
          },
          {
                "id": "c1-e21",
                "category": "être-present",
                "prompt": "Vous ___ étudiants ?",
                "options": [
                      "êtes",
                      "est",
                      "es"
                ],
                "answer": 0,
                "explanation": "Vous êtes."
          },
          {
                "id": "c1-e22",
                "category": "cest-versus-il-est",
                "prompt": "Which sentence identifies someone by name?",
                "options": [
                      "C'est Marie.",
                      "Elle est Marie.",
                      "Il est Marie."
                ],
                "answer": 0,
                "explanation": "C'est + name. Il/elle est + adjective or nationality."
          },
          {
                "id": "c1-e23",
                "category": "greetings",
                "prompt": "\"Excuse me / sorry\" when you didn't hear:",
                "options": [
                      "merci",
                      "pardon",
                      "enchanté"
                ],
                "answer": 1,
                "explanation": "Pardon ? = excuse me?"
          },
          {
                "id": "c1-e24",
                "category": "tu-vous",
                "prompt": "How do you ask (informal) if someone is French?",
                "options": [
                      "Tu es française ?",
                      "C'est française ?",
                      "Tu as française ?"
                ],
                "answer": 0,
                "explanation": "Tu es + adjective for nationality."
          }
    ],
    wordCount: 368,
  },
  '22222222-0000-0000-0000-000000000102': {
    brief: {
      title: 'Numbers, days, and age',
      body: 'What this lesson is for: say numbers, talk about the week, and give ages correctly.\n\n**1. Words to learn first (meanings)**\nLearn meanings before the grammar patterns that use them.\n\nNumbers 0–20 (say them out loud):\n- *zéro* = 0\n- *un* / *une* = 1 (form depends on gender of the noun later)\n- *deux* = 2\n- *trois* = 3\n- *quatre* = 4\n- *cinq* = 5\n- *six* = 6\n- *sept* = 7\n- *huit* = 8\n- *neuf* = 9\n- *dix* = 10\n- *onze* = 11\n- *douze* = 12\n- *treize* = 13\n- *quatorze* = 14\n- *quinze* = 15\n- *seize* = 16\n- *dix-sept* = 17\n- *dix-huit* = 18\n- *dix-neuf* = 19\n- *vingt* = 20\n\nHigher anchors you will meet:\n- *vingt et un* = 21\n- *trente* = 30 · *trente-deux* = 32\n- *quarante* = 40 · *cinquante* = 50 · *soixante* = 60\n- *soixante-dix* = 70 · *quatre-vingts* = 80 · *quatre-vingt-dix* = 90 · *cent* = 100\n\nDays of the week (French does **not** capitalize them):\n- *lundi* = Monday\n- *mardi* = Tuesday\n- *mercredi* = Wednesday\n- *jeudi* = Thursday\n- *vendredi* = Friday\n- *samedi* = Saturday\n- *dimanche* = Sunday\n\nTime words:\n- *aujourd\'hui* = today\n- *demain* = tomorrow\n- *hier* = yesterday\n- *semaine* = week\n- *mois* = month\n- *année* / *an* = year (*année* = the year as a period; *an* often after numbers for age)\n- *ans* = years (of age) — used in *j\'ai X ans*\n- *âge* = age\n- *anniversaire* = birthday\n- *calendrier* = calendar\n- *cette semaine* = this week\n- *la semaine prochaine* = next week\n\nVerbs:\n- *avoir* = to have (also used for age — see below)\n- *être* = to be (already known — do **not** use it for age)\n- *regarder* = to look at / to watch\n\nUseful chunks:\n- *quel âge as-tu ?* = how old are you? (informal)\n- *quel âge avez-vous ?* = how old are you? (formal)\n- *j\'ai … ans* = I am … years old\n- *mon anniversaire est…* = my birthday is…\n- *on se voit…* = see you / we see each other on…\n\n**2. Age uses avoir, never être**\nEnglish: “I **am** twenty.”\nFrench: *J\'ai vingt ans.* = I **have** twenty years.\n\nPattern: **avoir + number + ans**\n- *J\'ai vingt ans.* = I am 20.\n- *Elle a trente ans.* = She is 30.\nNever *Je suis vingt ans.* That is a classic beginner error.\n\n*Avoir* present (you need these):\n- *j\'ai* = I have\n- *tu as* = you have\n- *il/elle a* = he/she has\n- *nous avons* = we have\n- *vous avez* = you have\n- *ils/elles ont* = they have\n\n**3. Asking age**\n- Informal: *Quel âge as-tu ?*\n- Formal: *Quel âge avez-vous ?*\nAnswer: *J\'ai … ans.*\n\n**4. Days and planning**\nDays are lowercase: *vendredi*, not *Vendredi* (unless starting a sentence).\nTo say when something happens: *Mon anniversaire est vendredi.* = My birthday is on Friday.\nMeeting plan: *On se voit samedi ?* = Shall we meet on Saturday? / See you Saturday?\n\n**5. Today / tomorrow / yesterday**\n- *Aujourd\'hui, c\'est lundi.* = Today is Monday.\n- *Demain, c\'est mardi.*\n- *Hier, c\'était dimanche.* (you may see *c\'était* = it was — recognition is enough for now)\n\n**6. Numbers in speech**\nFrench numbers are building blocks: learn 1–20 solidly, then tens. Hyphens matter in writing (*dix-sept*, *trente-deux*). *Vingt et un* keeps *et*; many later compounds use hyphens.\n\n**7. Register**\nAsking age can feel personal. With strangers, prefer *vous* and soften with *pardon* if needed. With friends, *tu* is fine.\n\n**8. What to practice**\nCount 0–20 without English, say your age with *avoir*, name every weekday, and build one sentence with *aujourd\'hui* / *demain* / a day name. Every number and day above should mean something in English before you drill speed.',
      ruleSlugs: ["numbers-and-age"],
    },
    reading: readingParagraphs('c2', [
      'Aujourd\'hui, c\'est lundi. Demain, c\'est mardi, et après-demain, c\'est mercredi. Marc regarde le calendrier : cette semaine, il a trois cours de français. Hier, c\'était dimanche, et Marie est restée à la maison avec sa famille.',
      'Marc a vingt ans. Marie a vingt ans aussi. Son anniversaire est vendredi. Les amis disent : Joyeux anniversaire ! En France, on dit toujours J\'ai … ans pour l\'âge. Exemples :\n- J\'ai quinze ans\n- Elle a trente ans\n- Nous avons dix-huit ans',
      'Les jours de la semaine sont importants pour organiser la vie. Lundi, mardi, mercredi, jeudi et vendredi sont les jours de travail ou d\'école. Samedi et dimanche sont le week-end. Marc demande : On se voit samedi ? Marie répond : Oui, samedi à dix heures.',
      'Les nombres servent partout : l\'âge, l\'heure, l\'argent. Marc a dix euros. Un café coûte deux euros et un croissant coûte un euro cinquante. Un touriste demande : Combien ça coûte ? Le serveur répond : Ça coûte trois euros.',
      'Chaque mois a environ trente jours. Une année a douze mois et cinquante-deux semaines. Questions utiles au quotidien :\n- Quel jour sommes-nous ?\n- Nous sommes lundi.\n- Quelle heure est-il ?\n- Il est midi.',
      'Marie planifie sa semaine :\n- lundi et mercredi : des cours\n- mardi : café avec Marc\n- jeudi : étudier à la maison\n- vendredi : son anniversaire\n- samedi : se reposer\n- dimanche : préparer la semaine prochaine',
    ], V),
    conversation: {
      title: 'Planning the week',
      setting: 'Marc, Marie, and their teacher discuss age, days, and birthdays.',
      lines: [
        conversationLine('Professeur', 'Bonjour ! Aujourd\'hui, c\'est lundi. Quel jour sommes-nous demain ?', 'c2-l0', V),
        conversationLine('Marc', 'Demain, c\'est mardi.', 'c2-l1', V),
        conversationLine('Professeur', 'Très bien. Marie, quel âge as-tu ?', 'c2-l2', V),
        conversationLine('Marie', 'J\'ai vingt ans.', 'c2-l3', V),
        conversationLine('Marc', 'Moi aussi, j\'ai vingt ans.', 'c2-l4', V),
        conversationLine('Professeur', 'Et Marc, quel âge as-tu ?', 'c2-l5', V),
        conversationLine('Marc', 'J\'ai vingt ans aussi.', 'c2-l6', V),
        conversationLine('Marie', 'Mon anniversaire est vendredi.', 'c2-l7', V),
        conversationLine('Marc', 'Super ! On se voit samedi pour fêter ?', 'c2-l8', V),
        conversationLine('Marie', 'Oui, samedi à quinze heures au café.', 'c2-l9', V),
        conversationLine('Marc', 'Parfait. Hier, c\'était dimanche. Demain, c\'est mardi.', 'c2-l10', V),
        conversationLine('Marie', 'Cette semaine, j\'ai trois cours.', 'c2-l11', V),
        conversationLine('Professeur', 'La semaine prochaine, nous avons un examen.', 'c2-l12', V),
        conversationLine('Marc', 'D\'accord. À bientôt et bonne semaine !', 'c2-l13', V),
      ],
    },
    exercises: [
          {
                "id": "c2-e1",
                "category": "numbers-and-age",
                "prompt": "How do you say \"I am 20 years old\"?",
                "options": [
                      "Je suis vingt ans.",
                      "J'ai vingt ans.",
                      "Je suis vingt."
                ],
                "answer": 1,
                "explanation": "Age uses avoir: j'ai + number + ans."
          },
          {
                "id": "c2-e2",
                "category": "calendar",
                "prompt": "Which day follows lundi?",
                "options": [
                      "dimanche",
                      "mardi",
                      "vendredi"
                ],
                "answer": 1,
                "explanation": "Mardi is Tuesday."
          },
          {
                "id": "c2-e3",
                "category": "calendar",
                "prompt": "Which day is the weekend day after vendredi?",
                "options": [
                      "jeudi",
                      "samedi",
                      "lundi"
                ],
                "answer": 1,
                "explanation": "Samedi follows vendredi."
          },
          {
                "id": "c2-e4",
                "category": "numbers-and-age",
                "prompt": "Elle ___ quinze ans.",
                "options": [
                      "est",
                      "a",
                      "sont"
                ],
                "answer": 1,
                "explanation": "Elle a quinze ans."
          },
          {
                "id": "c2-e5",
                "category": "calendar",
                "prompt": "\"Yesterday\" in French is…",
                "options": [
                      "demain",
                      "hier",
                      "aujourd'hui"
                ],
                "answer": 1,
                "explanation": "Hier means yesterday."
          },
          {
                "id": "c2-e6",
                "category": "numbers",
                "prompt": "Which number is 30?",
                "options": [
                      "dix",
                      "vingt",
                      "trente"
                ],
                "answer": 2,
                "explanation": "Trente is thirty."
          },
          {
                "id": "c2-e7",
                "category": "calendar",
                "prompt": "Days of the week in French are usually…",
                "options": [
                      "capitalized",
                      "not capitalized",
                      "always plural"
                ],
                "answer": 1,
                "explanation": "French days are not capitalized."
          },
          {
                "id": "c2-e8",
                "category": "days",
                "prompt": "How do you say “My birthday is on Friday”?",
                "options": [
                      "Mon anniversaire est lundi.",
                      "Mon anniversaire est vendredi.",
                      "Mon anniversaire est dimanche."
                ],
                "answer": 1,
                "explanation": "Vendredi = Friday."
          },
          {
                "id": "c2-e9",
                "category": "numbers-and-age",
                "prompt": "Nous ___ dix-huit ans.",
                "options": [
                      "sommes",
                      "avons",
                      "êtes"
                ],
                "answer": 1,
                "explanation": "Nous avons + age."
          },
          {
                "id": "c2-e10",
                "category": "calendar",
                "prompt": "Aujourd'hui means…",
                "options": [
                      "tomorrow",
                      "today",
                      "yesterday"
                ],
                "answer": 1,
                "explanation": "Aujourd'hui = today."
          },
          {
                "id": "c2-e11",
                "category": "numbers",
                "prompt": "Which is 15?",
                "options": [
                      "cinq",
                      "quinze",
                      "cinquante"
                ],
                "answer": 1,
                "explanation": "Quinze = fifteen."
          },
          {
                "id": "c2-e12",
                "category": "numbers",
                "prompt": "Which is 12?",
                "options": [
                      "deux",
                      "douze",
                      "vingt"
                ],
                "answer": 1,
                "explanation": "Douze = twelve."
          },
          {
                "id": "c2-e13",
                "category": "calendar",
                "prompt": "Demain means…",
                "options": [
                      "tomorrow",
                      "today",
                      "Monday"
                ],
                "answer": 0,
                "explanation": "Demain = tomorrow."
          },
          {
                "id": "c2-e14",
                "category": "numbers-and-age",
                "prompt": "Quel âge ___ -tu ?",
                "options": [
                      "es",
                      "as",
                      "a"
                ],
                "answer": 1,
                "explanation": "Quel âge as-tu ? uses avoir."
          },
          {
                "id": "c2-e15",
                "category": "calendar",
                "prompt": "The day before mardi is…",
                "options": [
                      "lundi",
                      "mercredi",
                      "dimanche"
                ],
                "answer": 0,
                "explanation": "Monday comes before Tuesday."
          },
          {
                "id": "c2-e16",
                "category": "numbers",
                "prompt": "Un café coûte deux ___ .",
                "options": [
                      "ans",
                      "euros",
                      "semaines"
                ],
                "answer": 1,
                "explanation": "Price in euros."
          },
          {
                "id": "c2-e17",
                "category": "calendar",
                "prompt": "Cette ___ , j'ai trois cours.",
                "options": [
                      "année",
                      "semaine",
                      "heure"
                ],
                "answer": 1,
                "explanation": "Cette semaine."
          },
          {
                "id": "c2-e18",
                "category": "days",
                "prompt": "How do you say “See you on Saturday”?",
                "options": [
                      "On se voit vendredi.",
                      "On se voit samedi.",
                      "On se voit lundi."
                ],
                "answer": 1,
                "explanation": "Samedi = Saturday."
          },
          {
                "id": "c2-e19",
                "category": "numbers",
                "prompt": "Which is 18?",
                "options": [
                      "dix-huit",
                      "huit",
                      "quatre"
                ],
                "answer": 0,
                "explanation": "Dix-huit = eighteen."
          },
          {
                "id": "c2-e20",
                "category": "calendar",
                "prompt": "La semaine ___ = next week",
                "options": [
                      "prochaine",
                      "hier",
                      "petite"
                ],
                "answer": 0,
                "explanation": "La semaine prochaine."
          },
          {
                "id": "c2-e21",
                "category": "numbers-and-age",
                "prompt": "Never say age with…",
                "options": [
                      "avoir",
                      "être",
                      "avoir or être"
                ],
                "answer": 1,
                "explanation": "Never je suis vingt ans."
          },
          {
                "id": "c2-e22",
                "category": "calendar",
                "prompt": "How many days in a French week?",
                "options": [
                      "five",
                      "seven",
                      "ten"
                ],
                "answer": 1,
                "explanation": "Seven days: lundi to dimanche."
          },
          {
                "id": "c2-e23",
                "category": "numbers",
                "prompt": "\"How much does it cost?\" is…",
                "options": [
                      "Combien ça coûte ?",
                      "Quel âge as-tu ?",
                      "Quel jour sommes-nous ?"
                ],
                "answer": 0,
                "explanation": "Combien ça coûte ?"
          },
          {
                "id": "c2-e24",
                "category": "reading",
                "prompt": "Il est ___ = It is noon.",
                "options": [
                      "midi",
                      "minuit",
                      "mardi"
                ],
                "answer": 0,
                "explanation": "Midi = noon."
          }
    ],
    wordCount: 266,
  },
  '22222222-0000-0000-0000-000000000103': {
    brief: {
      title: 'Order politely at a café',
      body: 'What this lesson is for: order food and drinks politely, understand articles (*un/une* vs *du/de la*), and pay the bill.\n\n**1. Words to learn first (meanings)**\nDo not jump to *je prends* until these mean something in English.\n\nPlaces and people:\n- *café* = café / coffee shop (also the drink “coffee”)\n- *terrasse* = outdoor seating / patio\n- *serveur* / *serveuse* = waiter / waitress\n- *client* / *cliente* = customer\n- *addition* = the bill / check\n- *menu* = menu\n\nDrinks and food:\n- *café* = coffee (drink)\n- *thé* = tea\n- *eau* = water\n- *lait* = milk\n- *sucre* = sugar\n- *croissant* = croissant\n- *pain* = bread\n- *chocolat* = chocolate\n- *chocolat chaud* = hot chocolate\n- *boisson* = drink / beverage\n- *euro* / *euros* = euro(s)\n\nPoliteness (review + café):\n- *bonjour* = hello\n- *s\'il vous plaît* = please (use with staff)\n- *merci* = thank you\n- *de rien* = you are welcome\n- *au revoir* = goodbye\n- *pardon* = excuse me\n\nQuantity words you will hear:\n- *un* / *une* = a / one (masculine / feminine countable)\n- *du* = some (masculine mass) — from *de + le*\n- *de la* = some (feminine mass)\n- *de l\'* = some (before a vowel sound)\n- *des* = some (plural)\n- *un peu de* = a little (of)\n\nVerbs (infinitives):\n- *prendre* = to take / to have (food or drink) — café staple: *je prends*\n- *vouloir* = to want — polite: *je voudrais* = I would like\n- *aimer* = to like\n- *commander* = to order\n- *manger* = to eat\n- *boire* = to drink\n- *payer* = to pay\n- *désirer* = to desire / to want (waiter: *Vous désirez ?* = What would you like?)\n- *coûter* = to cost\n- *s\'installer* = to sit down / to settle (at a table)\n\nUseful chunks:\n- *je prends…* = I will have…\n- *je voudrais…* = I would like…\n- *vous désirez ?* = what would you like?\n- *l\'addition, s\'il vous plaît* = the bill, please\n- *et avec ceci ?* = and with that? / anything else?\n- *ça fait … euros* = that comes to … euros\n\n**2. Countable vs “some” (articles)**\nIf you can count cups or items, use *un/une*:\n- *un café* = a coffee (one cup)\n- *une eau* is less common; people often say *de l\'eau* for water as a drink amount\n- *un croissant* = a croissant\n\nIf you mean an unspecified amount of a substance, use partitives:\n- *du thé* = some tea\n- *de l\'eau* = some water\n- *du sucre* = some sugar\n- *de la confiture* = some jam (feminine mass noun — pattern)\n\nRough guide: *un/une* = one item; *du/de la/de l\'* = some amount of stuff.\n\n**3. Ordering patterns**\nNatural orders:\n- *Je prends un café, s\'il vous plaît.*\n- *Je voudrais un thé et de l\'eau, s\'il vous plaît.*\nPolite stack: order + *s\'il vous plaît*. Use *vous* with staff.\n\nWaiter may say: *Vous désirez ?* Answer with *je prends…* or *je voudrais…*\n\n**4. Key verb forms for this lesson**\n- *prendre*: *je prends, tu prends, il/elle prend, nous prenons, vous prenez, ils/elles prennent*\n- *vouloir*: focus on *je voudrais* (polite) and *vous voulez*\n- *aimer*: *j\'aime, tu aimes, il/elle aime…*\n- *payer*: *je paie* / *je paye* (both seen), *vous payez*\n\n**5. Paying**\n- Ask: *L\'addition, s\'il vous plaît.*\n- Price talk: *Ça fait sept euros.* = That comes to seven euros.\nTipping is appreciated but not a US-style obligation; politeness matters more than the tip amount at this level.\n\n**6. Silent letters (awareness)**\nIn *vous voulez*, the final *-z* of *voulez* is usually silent. In *ils prennent*, final *-nt* is silent. Spelling still shows the letters — listening and writing both matter.\n\n**7. Register**\nCafé staff = *vous* + *s\'il vous plaît* + *merci*. *Salut* to a waiter is too casual for most places.\n\n**8. What to practice**\nName drinks/food with English meanings, choose *un* vs *du/de l\'*, build one full polite order, then ask for *l\'addition*. If *thé* or *sucre* is still empty noise, go back to section 1 before conjugating.',
      ruleSlugs: ["articles-partitives","er-present","silent-final-consonants"],
    },
    reading: readingParagraphs('c3', [
      'Au café du coin, Marc et Marie s\'installent à la terrasse. Il est dix heures du matin. Le serveur arrive et dit : Bonjour ! Vous désirez ? Marc répond : Je prends un café et un croissant, s\'il vous plaît. Marie dit : Pour moi, un thé et de l\'eau, s\'il vous plaît.',
      'Le serveur demande : Vous voulez du sucre ? Marie répond : Oui, un peu de sucre, merci. Marc dit : Non, merci. Le serveur apporte les boissons chaudes. Le café est chaud et le thé est délicieux. Marie aime le pain français avec du beurre.',
      'À la table voisine, un couple commande deux cafés et du jus d\'orange. L\'homme demande : Combien ça coûte ? La serveuse répond : Ça coûte huit euros. La femme dit : Je paie. Elle donne dix euros. La serveuse dit : Merci. De rien.',
      'Marc regarde le menu :\n- café\n- thé\n- chocolat chaud\n- eau\n- jus\n- croissant\n- pain\nMarc demande : Tu veux un chocolat chaud ? Marie répond : Non, je prends du thé. Marc ajoute : Moi, je prends un café. J\'aime le café français.',
      'Après le petit-déjeuner, Marc dit : L\'addition, s\'il vous plaît. Le serveur apporte l\'addition : quatre euros cinquante pour Marc, trois euros pour Marie. Marc paie avec une carte. Il dit merci beaucoup. Le serveur répond : De rien. Au revoir !',
      'En France, le café est une tradition. Les gens prennent un café le matin, parfois l\'après-midi aussi. On commande à la terrasse ou au comptoir. On dit toujours bonjour au serveur et merci en partant. C\'est la politesse de base.',
    ], V),
    conversation: {
      title: 'At the café',
      setting: 'Marc and Marie order breakfast with a waiter.',
      lines: [
        conversationLine('Serveur', 'Bonjour ! Vous désirez ?', 'c3-l0', V),
        conversationLine('Marc', 'Je prends un café et un croissant, s\'il vous plaît.', 'c3-l1', V),
        conversationLine('Marie', 'Pour moi, un thé et de l\'eau, s\'il vous plaît.', 'c3-l2', V),
        conversationLine('Serveur', 'Avec plaisir. Vous voulez du sucre ?', 'c3-l3', V),
        conversationLine('Marie', 'Oui, un peu de sucre, merci.', 'c3-l4', V),
        conversationLine('Marc', 'Non, merci. Et du lait, s\'il vous plaît.', 'c3-l5', V),
        conversationLine('Serveur', 'Bien sûr. Voilà vos boissons.', 'c3-l6', V),
        conversationLine('Marie', 'Merci ! Le thé est délicieux.', 'c3-l7', V),
        conversationLine('Marc', 'J\'aime ce café. Tu veux un croissant ?', 'c3-l8', V),
        conversationLine('Marie', 'Non merci, je prends du pain.', 'c3-l9', V),
        conversationLine('Marc', 'L\'addition, s\'il vous plaît.', 'c3-l10', V),
        conversationLine('Serveur', 'Ça fait sept euros cinquante.', 'c3-l11', V),
        conversationLine('Marc', 'Je paie. Voici dix euros.', 'c3-l12', V),
        conversationLine('Serveur', 'Merci beaucoup. De rien. Au revoir !', 'c3-l13', V),
      ],
    },
    exercises: [
          {
                "id": "c3-e1",
                "category": "articles-partitives",
                "prompt": "Choose the countable order.",
                "options": [
                      "Je prends eau.",
                      "Je prends un café.",
                      "Je prends de café."
                ],
                "answer": 1,
                "explanation": "Use un/une for one countable item."
          },
          {
                "id": "c3-e2",
                "category": "er-present",
                "prompt": "Which form matches il?",
                "options": [
                      "je prends",
                      "il prend",
                      "nous prenez"
                ],
                "answer": 1,
                "explanation": "Il prend is third-person singular."
          },
          {
                "id": "c3-e3",
                "category": "articles-partitives",
                "prompt": "\"Some water\" is usually…",
                "options": [
                      "un eau",
                      "de l'eau",
                      "le eaux"
                ],
                "answer": 1,
                "explanation": "Feminine noun starting with a vowel: de l'eau."
          },
          {
                "id": "c3-e4",
                "category": "cafe-vocab",
                "prompt": "Who brings the bill?",
                "options": [
                      "le croissant",
                      "le serveur",
                      "le sucre"
                ],
                "answer": 1,
                "explanation": "Le serveur is the waiter."
          },
          {
                "id": "c3-e5",
                "category": "vouloir",
                "prompt": "Elle ___ un thé.",
                "options": [
                      "veux",
                      "veut",
                      "voulons"
                ],
                "answer": 1,
                "explanation": "Elle veut."
          },
          {
                "id": "c3-e6",
                "category": "politeness",
                "prompt": "The polite way to order ends with…",
                "options": [
                      "salut",
                      "s'il vous plaît",
                      "pardon alone"
                ],
                "answer": 1,
                "explanation": "Add s'il vous plaît when requesting."
          },
          {
                "id": "c3-e7",
                "category": "aimer",
                "prompt": "Translate: \"She likes bread.\"",
                "options": [
                      "Elle aime le pain.",
                      "Elle est le pain.",
                      "Elle a le pain."
                ],
                "answer": 0,
                "explanation": "Aimer + definite article for likes in general."
          },
          {
                "id": "c3-e8",
                "category": "payer",
                "prompt": "Marc ___ l'addition.",
                "options": [
                      "paie",
                      "est",
                      "habite"
                ],
                "answer": 0,
                "explanation": "Payer → il/elle paie."
          },
          {
                "id": "c3-e9",
                "category": "articles-partitives",
                "prompt": "How do you order tea and water politely?",
                "options": [
                      "un café et un croissant",
                      "un thé et de l'eau",
                      "du sucre seulement"
                ],
                "answer": 1,
                "explanation": "Un thé (countable cup) + de l'eau (some water)."
          },
          {
                "id": "c3-e10",
                "category": "articles-partitives",
                "prompt": "Du sucre means…",
                "options": [
                      "the sugar (specific)",
                      "some sugar",
                      "two sugars"
                ],
                "answer": 1,
                "explanation": "Du = de + le, an unspecified amount."
          },
          {
                "id": "c3-e11",
                "category": "articles-partitives",
                "prompt": "\"Some tea\" is…",
                "options": [
                      "du thé",
                      "de la thé",
                      "un thé seulement"
                ],
                "answer": 0,
                "explanation": "Thé is masculine → du thé."
          },
          {
                "id": "c3-e12",
                "category": "vouloir",
                "prompt": "Vous ___ du sucre ?",
                "options": [
                      "veut",
                      "voulez",
                      "veux"
                ],
                "answer": 1,
                "explanation": "Vous voulez."
          },
          {
                "id": "c3-e13",
                "category": "politeness",
                "prompt": "After \"merci\", the waiter may say…",
                "options": [
                      "de rien",
                      "au revoir only",
                      "pardon"
                ],
                "answer": 0,
                "explanation": "De rien = you're welcome."
          },
          {
                "id": "c3-e14",
                "category": "cafe-vocab",
                "prompt": "To ask for the bill:",
                "options": [
                      "L'addition, s'il vous plaît.",
                      "Bonjour, merci.",
                      "Je suis café."
                ],
                "answer": 0,
                "explanation": "L'addition = the bill."
          },
          {
                "id": "c3-e15",
                "category": "prendre",
                "prompt": "Nous ___ un croissant.",
                "options": [
                      "prenons",
                      "prenez",
                      "prend"
                ],
                "answer": 0,
                "explanation": "Nous prenons."
          },
          {
                "id": "c3-e16",
                "category": "aimer",
                "prompt": "J'___ le café français.",
                "options": [
                      "aime",
                      "ai",
                      "est"
                ],
                "answer": 0,
                "explanation": "J'aime le café."
          },
          {
                "id": "c3-e17",
                "category": "café-vocab",
                "prompt": "Where do you sit outside at a café?",
                "options": [
                      "à la terrasse",
                      "à la rue",
                      "à l'école"
                ],
                "answer": 0,
                "explanation": "À la terrasse = on the terrace / patio."
          },
          {
                "id": "c3-e18",
                "category": "articles-partitives",
                "prompt": "Un peu ___ sucre.",
                "options": [
                      "de",
                      "du",
                      "des"
                ],
                "answer": 0,
                "explanation": "Un peu de + noun."
          },
          {
                "id": "c3-e19",
                "category": "commander",
                "prompt": "Ils ___ deux cafés.",
                "options": [
                      "commandent",
                      "commande",
                      "commandes"
                ],
                "answer": 0,
                "explanation": "Ils commandent."
          },
          {
                "id": "c3-e20",
                "category": "boire",
                "prompt": "Elle ___ du thé.",
                "options": [
                      "boit",
                      "bois",
                      "boivent"
                ],
                "answer": 0,
                "explanation": "Elle boit."
          },
          {
                "id": "c3-e21",
                "category": "cafe-vocab",
                "prompt": "Chocolat ___ = hot chocolate",
                "options": [
                      "chaud",
                      "froid",
                      "grand"
                ],
                "answer": 0,
                "explanation": "Chocolat chaud."
          },
          {
                "id": "c3-e22",
                "category": "politeness",
                "prompt": "Always say ___ when entering a café.",
                "options": [
                      "bonjour",
                      "au revoir",
                      "l'addition"
                ],
                "answer": 0,
                "explanation": "Bonjour first!"
          },
          {
                "id": "c3-e23",
                "category": "payer",
                "prompt": "Ça ___ sept euros.",
                "options": [
                      "fait",
                      "est",
                      "a"
                ],
                "answer": 0,
                "explanation": "Ça fait = it comes to / costs."
          },
          {
                "id": "c3-e24",
                "category": "politeness",
                "prompt": "When asking for milk at a café, add…",
                "options": [
                      "s'il vous plaît",
                      "salut",
                      "pardon seulement"
                ],
                "answer": 0,
                "explanation": "S'il vous plaît is the polite please."
          }
    ],
    wordCount: 289,
  },
  '22222222-0000-0000-0000-000000000104': {
    brief: {
      title: 'Talk about your family',
      body: 'What this lesson is for: name family members, say who belongs to whom with possessives (*mon/ma/mes*), and describe people with *avoir* and *être*.\n\n**1. Words to learn first (meanings)**\nThis is the most important section. Learn each kinship word **with English** before any grammar example. If *frère* is still empty sound, stop here and learn it.\n\nCore family (start here):\n- *famille* = family (*la famille* — feminine noun)\n- *père* = father\n- *mère* = mother\n- *frère* = brother\n- *sœur* = sister (the *œ* is one letter sound roughly like “eu” in French *peur*)\n- *parents* = parents (both mother and father; plural masculine form, but means the couple)\n- *enfant* = child\n- *fils* = son (final *-s* usually silent: roughly “fees”)\n- *fille* = daughter (also means “girl” in other contexts)\n- *mari* = husband\n- *femme* = wife (also means “woman” — context decides)\n\nExtended family:\n- *grand-père* = grandfather\n- *grand-mère* = grandmother\n- *grands-parents* = grandparents\n- *oncle* = uncle\n- *tante* = aunt\n- *cousin* = male cousin\n- *cousine* = female cousin\n\nUseful describing words:\n- *grand* / *grande* = tall / big\n- *petit* / *petite* = small / short (also “little”)\n- *jeune* = young\n- *vieux* / *vieille* = old (person)\n- *français* / *française* = French\n- *anglais* / *anglaise* = English\n\nVerbs:\n- *avoir* = to have → for “I have a brother”\n- *être* = to be → for “my father is tall”\n- *s\'appeler* = to be called → for names: *Ma sœur s\'appelle Sophie.* = My sister is called Sophie.\n- *habiter* = to live\n\nPlace chunk:\n- *chez* = at the home of → *chez mes parents* = at my parents place\n\nUseful question chunks:\n- *Tu as des frères et sœurs ?* = Do you have brothers and sisters?\n- *Comment s\'appelle ta sœur ?* = What is your sister name?\n- *Ils habitent où ?* / *Tes parents habitent où ?* = Where do they / your parents live?\n\n**2. Gender of family nouns (why mon/ma later)**\nFrench nouns have gender. You need this before possessives:\n- Masculine examples: *père, frère, fils, oncle, cousin, mari*\n- Feminine examples: *mère, sœur, fille, tante, cousine, femme, famille*\nPlural mixed or parents: *parents, enfants, frères* (brothers, or brothers and sisters in some talk — *frères et sœurs* is clearer)\n\n**3. Possessive adjectives — after you know the nouns**\nEnglish “my” is one word. French changes with the **thing owned**, not the owner gender.\n\nMy:\n- *mon* + masculine singular → *mon père* (my father), *mon frère* (my brother)\n- *ma* + feminine singular → *ma mère* (my mother), *ma sœur* (my sister)\n- *mes* + plural → *mes parents* (my parents), *mes frères* (my brothers)\n\nYour (informal *tu*):\n- *ton* / *ta* / *tes* → *ton père*, *ta sœur*, *tes parents*\n\nHis / her / its:\n- *son* / *sa* / *ses* → form follows the noun: *son père* can mean “his father” or “her father”; *sa mère* = his/her mother\n\nTrap: *son/sa/ses* does **not** tell you the owner gender. Look at the noun (*père* vs *mère*).\n\nBefore a feminine noun starting with a vowel sound, French often uses *mon/ton/son* for ease of pronunciation (e.g. *mon amie*). You will meet this later; for *mère/sœur* use *ma/ta/sa*.\n\n**4. Avoir for having family members**\nPattern: **avoir + (un/une/des) + family noun**\n- *J\'ai un frère.* = I have a brother.\n- *J\'ai une sœur.* = I have a sister.\n- *Elle a deux sœurs.* = She has two sisters.\n- *Nous avons des enfants.* = We have children.\n\nThis is *avoir* (to have), not *être*.\n\n**5. Être for descriptions**\nPattern: **possessive + noun + être + adjective**\n- *Mon père est grand.* = My father is tall.\n- *Ma sœur est jeune.* = My sister is young.\n- *Mes parents sont français.* = My parents are French.\n\nAdjective agreement: feminine forms often add *-e* (*grande, petite, française*).\n\n**6. Names with s\'appeler**\n- *Ma sœur s\'appelle Sophie.* = My sister is called Sophie.\n- *Mon frère s\'appelle Lucas.* = My brother is called Lucas.\n\n**7. Chez**\n- *chez mes parents* = at my parents home\n- *chez Marie* = at Marie place\n\n**8. Register**\nFamily talk with friends = *tu*. Talking about someone else family with a stranger = *vous* for the person you are speaking to, while *son/sa* still track the family nouns.\n\n**9. Build-up order (do this in your head)**\n1. Know *frère* = brother, *père* = father, etc.\n2. Add *mon/ma/mes*\n3. Make *J\'ai un frère*\n4. Make *Mon frère est jeune*\n5. Make *Mon frère s\'appelle…*\n\n**10. What to practice**\nTranslate into French only after the English meanings in section 1 are solid: my father, my sister, I have two brothers, my mother is French, at my parents place. Grammar without meanings is empty pattern-matching — this lesson refuses that.',
      ruleSlugs: ["possessive-adjectives","numbers-and-age"],
    },
    reading: readingParagraphs('c4', [
      'Ma famille est petite mais très unie. Mon père et ma mère habitent à Lyon. Mon père s\'appelle Pierre et ma mère s\'appelle Claire. Ils ont deux enfants : mon frère Thomas et moi, Marc. Ma sœur cadette s\'appelle Sophie.',
      'Mon frère Thomas est grand et mon amie dit qu\'il est sympa. Ma sœur Sophie est jeune : elle a quinze ans. J\'ai aussi une grand-mère à Paris. Ma grand-mère s\'appelle Jeanne. Elle habite avec mon oncle Paul et ma tante Isabelle.',
      'Mes parents ont des frères et sœurs aussi. Mon père a un frère, mon oncle Henri, et une sœur, ma tante Anne. Ma mère a une sœur, ma tante Lucie. J\'ai trois cousins : deux cousins et une cousine. Nous nous voyons souvent le dimanche.',
      'Chez Marie, la famille est différente. Elle a un frère et une sœur. Son frère s\'appelle Lucas et sa sœur s\'appelle Emma. Ses parents habitent en France. Son père est français et sa mère est anglaise. Marie dit : Ma famille est internationale !',
      'Le dimanche, les familles se retrouvent souvent. Mes parents préparent un bon repas. Mon grand-père raconte des histoires. Ma grand-mère apporte du pain et du fromage. Les enfants jouent dans le jardin. C\'est un beau moment ensemble.',
      'Pour parler de la famille en français, on utilise souvent avoir. Exemples :\n- J\'ai un frère\n- Elle a deux enfants\n- Nous avons une grande famille\nOn utilise être pour décrire :\n- Mon père est grand\n- Ma mère est française\nC\'est simple et très utile !',
    ], V),
    conversation: {
      title: 'Talking about family',
      setting: 'A friend asks Marc about his family.',
      lines: [
        conversationLine('Ami', 'Tu as une grande famille ?', 'c4-l0', V),
        conversationLine('Marc', 'Non, ma famille est petite.', 'c4-l1', V),
        conversationLine('Ami', 'Tu as des frères et sœurs ?', 'c4-l2', V),
        conversationLine('Marc', 'Oui, j\'ai un frère et une sœur.', 'c4-l3', V),
        conversationLine('Ami', 'Comment s\'appelle ta sœur ?', 'c4-l4', V),
        conversationLine('Marc', 'Ma sœur s\'appelle Sophie. Elle est jeune.', 'c4-l5', V),
        conversationLine('Ami', 'Et ton frère ?', 'c4-l6', V),
        conversationLine('Marc', 'Mon frère s\'appelle Thomas. Il est grand.', 'c4-l7', V),
        conversationLine('Ami', 'Tes parents habitent où ?', 'c4-l8', V),
        conversationLine('Marc', 'Mes parents habitent à Lyon avec mon grand-père.', 'c4-l9', V),
        conversationLine('Ami', 'Tu as des cousins ?', 'c4-l10', V),
        conversationLine('Marc', 'Oui, j\'ai trois cousins et une cousine.', 'c4-l11', V),
        conversationLine('Ami', 'Super ! Et ta grand-mère ?', 'c4-l12', V),
        conversationLine('Marc', 'Ma grand-mère habite à Paris. Elle est très sympa.', 'c4-l13', V),
        conversationLine('Ami', 'Ta famille a l\'air chouette !', 'c4-l14', V),
        conversationLine('Marc', 'Merci ! Et toi, tu as des enfants ?', 'c4-l15', V),
      ],
    },
    exercises: [
          {
                "id": "c4-e1",
                "category": "possessive-adjectives",
                "prompt": "Choose the correct phrase for \"my sister\".",
                "options": [
                      "mon sœur",
                      "ma sœur",
                      "mes sœur"
                ],
                "answer": 1,
                "explanation": "Sœur is feminine singular → ma."
          },
          {
                "id": "c4-e2",
                "category": "numbers-and-age",
                "prompt": "Which verb means \"to have\"?",
                "options": [
                      "être",
                      "avoir",
                      "prendre"
                ],
                "answer": 1,
                "explanation": "Avoir = to have."
          },
          {
                "id": "c4-e3",
                "category": "possessive-adjectives",
                "prompt": "\"My brother\" is…",
                "options": [
                      "ma frère",
                      "mon frère",
                      "mes frère"
                ],
                "answer": 1,
                "explanation": "Frère is masculine → mon."
          },
          {
                "id": "c4-e4",
                "category": "family",
                "prompt": "Parents means…",
                "options": [
                      "children",
                      "parents",
                      "friends"
                ],
                "answer": 1,
                "explanation": "Les parents = parents."
          },
          {
                "id": "c4-e5",
                "category": "avoir-family",
                "prompt": "J'___ un frère.",
                "options": [
                      "suis",
                      "ai",
                      "est"
                ],
                "answer": 1,
                "explanation": "J'ai un frère."
          },
          {
                "id": "c4-e6",
                "category": "possessive-adjectives",
                "prompt": "Mes is used with…",
                "options": [
                      "singular masculine only",
                      "plural nouns",
                      "only feminine"
                ],
                "answer": 1,
                "explanation": "Mes = my + plural."
          },
          {
                "id": "c4-e7",
                "category": "family",
                "prompt": "Un fils is…",
                "options": [
                      "a daughter",
                      "a son",
                      "a mother"
                ],
                "answer": 1,
                "explanation": "Fils = son."
          },
          {
                "id": "c4-e8",
                "category": "family",
                "prompt": "“My parents live in Lyon” in French is…",
                "options": [
                      "Mes parents habitent à Lyon.",
                      "Mes parents sont à Lyon.",
                      "Mon parents habitent à Lyon."
                ],
                "answer": 0,
                "explanation": "Mes parents + habitent à + city."
          },
          {
                "id": "c4-e9",
                "category": "adjectives",
                "prompt": "Ma sœur est ___.",
                "options": [
                      "jeune",
                      "jeunes",
                      "jeuneux"
                ],
                "answer": 0,
                "explanation": "Jeune agrees; invariable here."
          },
          {
                "id": "c4-e10",
                "category": "possessive-adjectives",
                "prompt": "___ parents habitent à Lyon.",
                "options": [
                      "Ma",
                      "Mon",
                      "Mes"
                ],
                "answer": 2,
                "explanation": "Parents is plural → mes."
          },
          {
                "id": "c4-e11",
                "category": "family",
                "prompt": "Grand-mère means…",
                "options": [
                      "grandfather",
                      "grandmother",
                      "uncle"
                ],
                "answer": 1,
                "explanation": "Grand-mère = grandmother."
          },
          {
                "id": "c4-e12",
                "category": "family",
                "prompt": "Mon ___ s'appelle Pierre. (father)",
                "options": [
                      "mère",
                      "père",
                      "oncle"
                ],
                "answer": 1,
                "explanation": "Père = father."
          },
          {
                "id": "c4-e13",
                "category": "possessive-adjectives",
                "prompt": "Sa sœur = ___",
                "options": [
                      "his/her sister",
                      "my sister",
                      "your sister"
                ],
                "answer": 0,
                "explanation": "Sa = his/her before feminine noun."
          },
          {
                "id": "c4-e14",
                "category": "family",
                "prompt": "Une cousine is…",
                "options": [
                      "a female cousin",
                      "an aunt",
                      "a niece"
                ],
                "answer": 0,
                "explanation": "Cousine = female cousin."
          },
          {
                "id": "c4-e15",
                "category": "avoir-family",
                "prompt": "Tu ___ des frères ?",
                "options": [
                      "es",
                      "as",
                      "a"
                ],
                "answer": 1,
                "explanation": "Tu as des frères."
          },
          {
                "id": "c4-e16",
                "category": "family",
                "prompt": "Oncle means…",
                "options": [
                      "uncle",
                      "aunt",
                      "cousin"
                ],
                "answer": 0,
                "explanation": "Oncle = uncle."
          },
          {
                "id": "c4-e17",
                "category": "family",
                "prompt": "How do you say “I have three cousins”?",
                "options": [
                      "J'ai deux cousins.",
                      "J'ai trois cousins.",
                      "J'ai quatre cousins."
                ],
                "answer": 1,
                "explanation": "J'ai + number + cousins."
          },
          {
                "id": "c4-e18",
                "category": "possessive-adjectives",
                "prompt": "Ton frère = ___",
                "options": [
                      "your brother (informal)",
                      "my brother",
                      "his brother"
                ],
                "answer": 0,
                "explanation": "Ton = your (m. noun, informal)."
          },
          {
                "id": "c4-e19",
                "category": "être-family",
                "prompt": "Mon père ___ grand.",
                "options": [
                      "est",
                      "a",
                      "ai"
                ],
                "answer": 0,
                "explanation": "Descriptions use être."
          },
          {
                "id": "c4-e20",
                "category": "family",
                "prompt": "Fille can mean…",
                "options": [
                      "son or daughter",
                      "daughter or girl",
                      "mother"
                ],
                "answer": 1,
                "explanation": "Fille = daughter or girl."
          },
          {
                "id": "c4-e21",
                "category": "être-present",
                "prompt": "How do you say “His/her mother is English”?",
                "options": [
                      "Sa mère est française.",
                      "Sa mère est anglaise.",
                      "Sa mère est espagnole."
                ],
                "answer": 1,
                "explanation": "Sa mère est anglaise."
          },
          {
                "id": "c4-e22",
                "category": "possessive-adjectives",
                "prompt": "Before \"famille\" (f.), use…",
                "options": [
                      "mon",
                      "ma",
                      "mes"
                ],
                "answer": 1,
                "explanation": "Ma famille."
          },
          {
                "id": "c4-e23",
                "category": "family",
                "prompt": "How do you say “My sister is called Sophie”?",
                "options": [
                      "Ma sœur s'appelle Marie.",
                      "Ma sœur s'appelle Sophie.",
                      "Ma sœur s'appelle Emma."
                ],
                "answer": 1,
                "explanation": "Ma sœur s'appelle + name."
          },
          {
                "id": "c4-e24",
                "category": "family",
                "prompt": "Les enfants = ___",
                "options": [
                      "the children",
                      "the parents",
                      "the friends"
                ],
                "answer": 0,
                "explanation": "Enfants = children."
          }
    ],
    wordCount: 268,
  },
}

export const MODULE1_CONJUGATIONS: VerbConjugation[] = [
  { id: 'conj-etre-1', vocab_id: '10000000-0000-0000-0000-000000000001', tense: 'Présent', pronoun: 'je', form: 'suis', order_index: 1 },
  { id: 'conj-etre-2', vocab_id: '10000000-0000-0000-0000-000000000001', tense: 'Présent', pronoun: 'tu', form: 'es', order_index: 2 },
  { id: 'conj-etre-3', vocab_id: '10000000-0000-0000-0000-000000000001', tense: 'Présent', pronoun: 'il / elle / on', form: 'est', order_index: 3 },
  { id: 'conj-etre-4', vocab_id: '10000000-0000-0000-0000-000000000001', tense: 'Présent', pronoun: 'nous', form: 'sommes', order_index: 4 },
  { id: 'conj-etre-5', vocab_id: '10000000-0000-0000-0000-000000000001', tense: 'Présent', pronoun: 'vous', form: 'êtes', order_index: 5 },
  { id: 'conj-etre-6', vocab_id: '10000000-0000-0000-0000-000000000001', tense: 'Présent', pronoun: 'ils / elles', form: 'sont', order_index: 6 },
  { id: 'conj-appeler-1', vocab_id: '22a8a816-c56b-4e67-8549-bdfbc98e9b60', tense: 'Présent', pronoun: 'je', form: "m'appelle", order_index: 1 },
  { id: 'conj-appeler-2', vocab_id: '22a8a816-c56b-4e67-8549-bdfbc98e9b60', tense: 'Présent', pronoun: 'tu', form: "t'appelles", order_index: 2 },
  { id: 'conj-appeler-3', vocab_id: '22a8a816-c56b-4e67-8549-bdfbc98e9b60', tense: 'Présent', pronoun: 'il / elle / on', form: "s'appelle", order_index: 3 },
  { id: 'conj-appeler-4', vocab_id: '22a8a816-c56b-4e67-8549-bdfbc98e9b60', tense: 'Présent', pronoun: 'nous', form: 'nous appelons', order_index: 4 },
  { id: 'conj-appeler-5', vocab_id: '22a8a816-c56b-4e67-8549-bdfbc98e9b60', tense: 'Présent', pronoun: 'vous', form: 'vous appelez', order_index: 5 },
  { id: 'conj-appeler-6', vocab_id: '22a8a816-c56b-4e67-8549-bdfbc98e9b60', tense: 'Présent', pronoun: 'ils / elles', form: "s'appellent", order_index: 6 },
  { id: 'conj-avoir-1', vocab_id: '10000000-0000-0000-0000-000000000016', tense: 'Présent', pronoun: 'je', form: 'ai', order_index: 1 },
  { id: 'conj-avoir-2', vocab_id: '10000000-0000-0000-0000-000000000016', tense: 'Présent', pronoun: 'tu', form: 'as', order_index: 2 },
  { id: 'conj-avoir-3', vocab_id: '10000000-0000-0000-0000-000000000016', tense: 'Présent', pronoun: 'il / elle / on', form: 'a', order_index: 3 },
  { id: 'conj-avoir-4', vocab_id: '10000000-0000-0000-0000-000000000016', tense: 'Présent', pronoun: 'nous', form: 'avons', order_index: 4 },
  { id: 'conj-avoir-5', vocab_id: '10000000-0000-0000-0000-000000000016', tense: 'Présent', pronoun: 'vous', form: 'avez', order_index: 5 },
  { id: 'conj-avoir-6', vocab_id: '10000000-0000-0000-0000-000000000016', tense: 'Présent', pronoun: 'ils / elles', form: 'ont', order_index: 6 },
  { id: 'conj-habiter-1', vocab_id: '10000000-0000-0000-0000-000000000038', tense: 'Présent', pronoun: 'je', form: 'habite', order_index: 1 },
  { id: 'conj-habiter-2', vocab_id: '10000000-0000-0000-0000-000000000038', tense: 'Présent', pronoun: 'tu', form: 'habites', order_index: 2 },
  { id: 'conj-habiter-3', vocab_id: '10000000-0000-0000-0000-000000000038', tense: 'Présent', pronoun: 'il / elle / on', form: 'habite', order_index: 3 },
  { id: 'conj-habiter-4', vocab_id: '10000000-0000-0000-0000-000000000038', tense: 'Présent', pronoun: 'nous', form: 'habitons', order_index: 4 },
  { id: 'conj-habiter-5', vocab_id: '10000000-0000-0000-0000-000000000038', tense: 'Présent', pronoun: 'vous', form: 'habitez', order_index: 5 },
  { id: 'conj-habiter-6', vocab_id: '10000000-0000-0000-0000-000000000038', tense: 'Présent', pronoun: 'ils / elles', form: 'habitent', order_index: 6 },
  { id: 'conj-prendre-1', vocab_id: '10000000-0000-0000-0000-000000000022', tense: 'Présent', pronoun: 'je', form: 'prends', order_index: 1 },
  { id: 'conj-prendre-2', vocab_id: '10000000-0000-0000-0000-000000000022', tense: 'Présent', pronoun: 'tu', form: 'prends', order_index: 2 },
  { id: 'conj-prendre-3', vocab_id: '10000000-0000-0000-0000-000000000022', tense: 'Présent', pronoun: 'il / elle / on', form: 'prend', order_index: 3 },
  { id: 'conj-prendre-4', vocab_id: '10000000-0000-0000-0000-000000000022', tense: 'Présent', pronoun: 'nous', form: 'prenons', order_index: 4 },
  { id: 'conj-prendre-5', vocab_id: '10000000-0000-0000-0000-000000000022', tense: 'Présent', pronoun: 'vous', form: 'prenez', order_index: 5 },
  { id: 'conj-prendre-6', vocab_id: '10000000-0000-0000-0000-000000000022', tense: 'Présent', pronoun: 'ils / elles', form: 'prennent', order_index: 6 },
  { id: 'conj-vouloir-1', vocab_id: '10000000-0000-0000-0000-000000000023', tense: 'Présent', pronoun: 'je', form: 'veux', order_index: 1 },
  { id: 'conj-vouloir-2', vocab_id: '10000000-0000-0000-0000-000000000023', tense: 'Présent', pronoun: 'tu', form: 'veux', order_index: 2 },
  { id: 'conj-vouloir-3', vocab_id: '10000000-0000-0000-0000-000000000023', tense: 'Présent', pronoun: 'il / elle / on', form: 'veut', order_index: 3 },
  { id: 'conj-vouloir-4', vocab_id: '10000000-0000-0000-0000-000000000023', tense: 'Présent', pronoun: 'nous', form: 'voulons', order_index: 4 },
  { id: 'conj-vouloir-5', vocab_id: '10000000-0000-0000-0000-000000000023', tense: 'Présent', pronoun: 'vous', form: 'voulez', order_index: 5 },
  { id: 'conj-vouloir-6', vocab_id: '10000000-0000-0000-0000-000000000023', tense: 'Présent', pronoun: 'ils / elles', form: 'veulent', order_index: 6 },
  { id: 'conj-aimer-1', vocab_id: '10000000-0000-0000-0000-000000000065', tense: 'Présent', pronoun: 'je', form: 'aime', order_index: 1 },
  { id: 'conj-aimer-2', vocab_id: '10000000-0000-0000-0000-000000000065', tense: 'Présent', pronoun: 'tu', form: 'aimes', order_index: 2 },
  { id: 'conj-aimer-3', vocab_id: '10000000-0000-0000-0000-000000000065', tense: 'Présent', pronoun: 'il / elle / on', form: 'aime', order_index: 3 },
  { id: 'conj-aimer-4', vocab_id: '10000000-0000-0000-0000-000000000065', tense: 'Présent', pronoun: 'nous', form: 'aimons', order_index: 4 },
  { id: 'conj-aimer-5', vocab_id: '10000000-0000-0000-0000-000000000065', tense: 'Présent', pronoun: 'vous', form: 'aimez', order_index: 5 },
  { id: 'conj-aimer-6', vocab_id: '10000000-0000-0000-0000-000000000065', tense: 'Présent', pronoun: 'ils / elles', form: 'aiment', order_index: 6 },
  { id: 'conj-payer-1', vocab_id: '10000000-0000-0000-0000-000000000024', tense: 'Présent', pronoun: 'je', form: 'paie', order_index: 1 },
  { id: 'conj-payer-2', vocab_id: '10000000-0000-0000-0000-000000000024', tense: 'Présent', pronoun: 'tu', form: 'paies', order_index: 2 },
  { id: 'conj-payer-3', vocab_id: '10000000-0000-0000-0000-000000000024', tense: 'Présent', pronoun: 'il / elle / on', form: 'paie', order_index: 3 },
  { id: 'conj-payer-4', vocab_id: '10000000-0000-0000-0000-000000000024', tense: 'Présent', pronoun: 'nous', form: 'payons', order_index: 4 },
  { id: 'conj-payer-5', vocab_id: '10000000-0000-0000-0000-000000000024', tense: 'Présent', pronoun: 'vous', form: 'payez', order_index: 5 },
  { id: 'conj-payer-6', vocab_id: '10000000-0000-0000-0000-000000000024', tense: 'Présent', pronoun: 'ils / elles', form: 'paient', order_index: 6 },
  { id: 'conj-aller-1', vocab_id: '10000000-0000-0000-0000-000000000295', tense: 'Présent', pronoun: 'je', form: 'vais', order_index: 1 },
  { id: 'conj-aller-2', vocab_id: '10000000-0000-0000-0000-000000000295', tense: 'Présent', pronoun: 'tu', form: 'vas', order_index: 2 },
  { id: 'conj-aller-3', vocab_id: '10000000-0000-0000-0000-000000000295', tense: 'Présent', pronoun: 'il / elle / on', form: 'va', order_index: 3 },
  { id: 'conj-aller-4', vocab_id: '10000000-0000-0000-0000-000000000295', tense: 'Présent', pronoun: 'nous', form: 'allons', order_index: 4 },
  { id: 'conj-aller-5', vocab_id: '10000000-0000-0000-0000-000000000295', tense: 'Présent', pronoun: 'vous', form: 'allez', order_index: 5 },
  { id: 'conj-aller-6', vocab_id: '10000000-0000-0000-0000-000000000295', tense: 'Présent', pronoun: 'ils / elles', form: 'vont', order_index: 6 },
  { id: 'conj-faire-1', vocab_id: '10000000-0000-0000-0000-000000000208', tense: 'Présent', pronoun: 'je', form: 'fais', order_index: 1 },
  { id: 'conj-faire-2', vocab_id: '10000000-0000-0000-0000-000000000208', tense: 'Présent', pronoun: 'tu', form: 'fais', order_index: 2 },
  { id: 'conj-faire-3', vocab_id: '10000000-0000-0000-0000-000000000208', tense: 'Présent', pronoun: 'il / elle / on', form: 'fait', order_index: 3 },
  { id: 'conj-faire-4', vocab_id: '10000000-0000-0000-0000-000000000208', tense: 'Présent', pronoun: 'nous', form: 'faisons', order_index: 4 },
  { id: 'conj-faire-5', vocab_id: '10000000-0000-0000-0000-000000000208', tense: 'Présent', pronoun: 'vous', form: 'faites', order_index: 5 },
  { id: 'conj-faire-6', vocab_id: '10000000-0000-0000-0000-000000000208', tense: 'Présent', pronoun: 'ils / elles', form: 'font', order_index: 6 },
  { id: 'conj-etudier-1', vocab_id: '10000000-0000-0000-0000-000000000255', tense: 'Présent', pronoun: 'je', form: 'étudie', order_index: 1 },
  { id: 'conj-etudier-2', vocab_id: '10000000-0000-0000-0000-000000000255', tense: 'Présent', pronoun: 'tu', form: 'étudies', order_index: 2 },
  { id: 'conj-etudier-3', vocab_id: '10000000-0000-0000-0000-000000000255', tense: 'Présent', pronoun: 'il / elle / on', form: 'étudie', order_index: 3 },
  { id: 'conj-etudier-4', vocab_id: '10000000-0000-0000-0000-000000000255', tense: 'Présent', pronoun: 'nous', form: 'étudions', order_index: 4 },
  { id: 'conj-etudier-5', vocab_id: '10000000-0000-0000-0000-000000000255', tense: 'Présent', pronoun: 'vous', form: 'étudiez', order_index: 5 },
  { id: 'conj-etudier-6', vocab_id: '10000000-0000-0000-0000-000000000255', tense: 'Présent', pronoun: 'ils / elles', form: 'étudient', order_index: 6 },
]

