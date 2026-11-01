/**
 * Real-life documents shown inside lessons: a chat, a menu, a receipt, an ID card, an agenda, a family tree.
 * They are drawn by the app (no photos, no copyright). Every French line carries its English meaning.
 */

export type Line = { fr: string; en: string }

export type ChatMessage = Line & { from: 'me' | 'them'; name?: string }

export type LifeDocument =
  | { kind: 'chat'; title: string; app: string; contact: string; messages: ChatMessage[] }
  | { kind: 'menu'; title: string; place: Line; sections: Array<{ heading: Line; items: Array<Line & { price: string }> }> }
  | { kind: 'receipt'; title: string; place: Line; lines: Array<Line & { price: string }>; total: { label: Line; amount: string }; footer: Line }
  | { kind: 'idcard'; title: string; header: Line; fields: Array<{ label: Line; value: Line }> }
  | { kind: 'agenda'; title: string; days: Array<{ day: Line; items: Array<Line & { time?: string }> }> }
  | { kind: 'family'; title: string; parents: Array<Line>; siblings: Array<Line>; me: Line }
