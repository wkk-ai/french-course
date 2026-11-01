import type { LifeDocument } from '@/lib/visual/types'

/**
 * Module 1 real-life documents, keyed by chapter id.
 * Only words already taught in Module 1 (plus the usual dictionary) so every word is tappable.
 */

const U1_A = '22222222-0000-0000-0000-000000000101'
const U2_A = '22222222-0000-0000-0000-000000000102'
const U3_A = '22222222-0000-0000-0000-000000000103'
const U4_A = '22222222-0000-0000-0000-000000000104'

export const LESSON_DOCUMENTS: Record<string, LifeDocument[]> = {
  [U1_A]: [
    {
      kind: 'chat',
      title: 'A first message',
      app: 'Messages',
      contact: 'Marc',
      messages: [
        { from: 'them', name: 'Marc', fr: 'Bonjour ! Je m’appelle Marc.', en: 'Hello! My name is Marc.' },
        { from: 'me', fr: 'Bonjour Marc ! Je m’appelle Marie.', en: 'Hello Marc! My name is Marie.' },
        { from: 'them', name: 'Marc', fr: 'Tu es française ?', en: 'Are you French?' },
        { from: 'me', fr: 'Oui, je suis française. Et toi ?', en: 'Yes, I am French. And you?' },
        { from: 'them', name: 'Marc', fr: 'Je suis anglais. J’habite à Paris.', en: 'I am English. I live in Paris.' },
        { from: 'me', fr: 'Merci ! Au revoir, Marc !', en: 'Thanks! Goodbye, Marc!' },
      ],
    },
  ],
  [U2_A]: [
    {
      kind: 'agenda',
      title: 'My week',
      days: [
        { day: { fr: 'lundi', en: 'Monday' }, items: [{ fr: 'un café avec Marc', en: 'a coffee with Marc', time: '8 h' }] },
        { day: { fr: 'mardi', en: 'Tuesday' }, items: [{ fr: 'un thé avec Marie', en: 'a tea with Marie', time: '9 h' }] },
        { day: { fr: 'mercredi', en: 'Wednesday' }, items: [{ fr: 'deux croissants pour la famille', en: 'two croissants for the family', time: '7 h' }] },
      ],
    },
  ],
  [U3_A]: [
    {
      kind: 'menu',
      title: 'The café menu',
      place: { fr: 'Le Café', en: 'The café' },
      sections: [
        {
          heading: { fr: 'Boissons', en: 'Drinks' },
          items: [
            { fr: 'un café', en: 'a coffee', price: '2 €' },
            { fr: 'un thé', en: 'a tea', price: '3 €' },
            { fr: 'de l’eau', en: 'water', price: '1 €' },
          ],
        },
        {
          heading: { fr: 'À manger', en: 'To eat' },
          items: [{ fr: 'un croissant', en: 'a croissant', price: '2 €' }],
        },
      ],
    },
    {
      kind: 'receipt',
      title: 'The bill',
      place: { fr: 'Le Café', en: 'The café' },
      lines: [
        { fr: 'un café', en: 'a coffee', price: '2 €' },
        { fr: 'un croissant', en: 'a croissant', price: '2 €' },
      ],
      total: { label: { fr: 'L’addition', en: 'The bill' }, amount: '4 €' },
      footer: { fr: 'Merci ! Au revoir !', en: 'Thank you! Goodbye!' },
    },
  ],
  [U4_A]: [
    {
      kind: 'family',
      title: 'My family',
      parents: [
        { fr: 'mon père', en: 'my father' },
        { fr: 'ma mère', en: 'my mother' },
      ],
      siblings: [
        { fr: 'mon frère', en: 'my brother' },
        { fr: 'ma sœur', en: 'my sister' },
      ],
      me: { fr: 'moi', en: 'me' },
    },
  ],
}

export function getLessonDocuments(chapterId: string): LifeDocument[] {
  return LESSON_DOCUMENTS[chapterId] ?? []
}
