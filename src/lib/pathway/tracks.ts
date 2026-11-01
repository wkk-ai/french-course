import { PATHWAY_MODULES, type PathwayModule } from '@/lib/pathway/catalog'

/**
 * Three tracks, built for the goal: hold a normal conversation and a business conversation.
 * - Conversation: the main path, A1 to B2 everyday speech. Do this first.
 * - Business: work French. Start once the Conversation track reaches the past tenses.
 * - Advanced reading: literature, law, philosophy, long media. Optional and skippable.
 * Module numbers below are the catalog order (1-36).
 */

export type TrackId = 'conversation' | 'business' | 'advanced'

export type Track = {
  id: TrackId
  title: string
  short: string
  description: string
  optional: boolean
  moduleOrders: number[]
}

export const TRACKS: Track[] = [
  {
    id: 'conversation',
    title: 'Conversation',
    short: 'Main path',
    description: 'Everyday French from your first “Bonjour” to talking about your past, plans, feelings and opinions. Do this first.',
    optional: false,
    moduleOrders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 17, 18, 19, 26],
  },
  {
    id: 'business',
    title: 'Business',
    short: 'Work French',
    description: 'Work, meetings, money and paperwork. Start after the Conversation track covers the past tenses (module 8).',
    optional: false,
    moduleOrders: [14, 21, 29, 31],
  },
  {
    id: 'advanced',
    title: 'Advanced reading',
    short: 'Optional',
    description: 'News, politics, science, literature, law and philosophy. Rare words you do not need for conversation. Skip freely.',
    optional: true,
    moduleOrders: [16, 20, 22, 23, 24, 25, 27, 28, 30, 32, 33, 34, 35, 36],
  },
]

export const TRACK_BY_ID = new Map(TRACKS.map((track) => [track.id, track]))

const TRACK_BY_ORDER = new Map<number, TrackId>(TRACKS.flatMap((track) => track.moduleOrders.map((order) => [order, track.id] as const)))

export function trackForModuleOrder(orderIndex: number): TrackId {
  return TRACK_BY_ORDER.get(orderIndex) ?? 'advanced'
}

export function modulesForTrack(trackId: TrackId): PathwayModule[] {
  const track = TRACK_BY_ID.get(trackId)
  if (!track) return []
  const byOrder = new Map(PATHWAY_MODULES.map((module) => [module.orderIndex, module]))
  return track.moduleOrders.map((order) => byOrder.get(order)).filter((module): module is PathwayModule => Boolean(module))
}

export function chapterIdsForTrack(trackId: TrackId): string[] {
  return modulesForTrack(trackId).flatMap((module) => module.subchapters.map((sub) => sub.id))
}
