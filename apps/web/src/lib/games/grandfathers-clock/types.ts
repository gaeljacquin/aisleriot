import type { Card, GameStatus } from '#/lib/types'

export type GrandfathersClockState = {
  tableau: Record<string, Card[]>
  foundation: Record<string, Card[]>
  score: number
  moveCount: number
  status: GameStatus
  currentSeed: number
  usedUndo: boolean
}

export const TABLEAU_IDS = [
  'tableau-1',
  'tableau-2',
  'tableau-3',
  'tableau-4',
  'tableau-5',
  'tableau-6',
  'tableau-7',
  'tableau-8',
] as const

export const FOUNDATION_IDS = [
  'foundation-1',
  'foundation-2',
  'foundation-3',
  'foundation-4',
  'foundation-5',
  'foundation-6',
  'foundation-7',
  'foundation-8',
  'foundation-9',
  'foundation-10',
  'foundation-11',
  'foundation-12',
] as const

export type GrandfathersClockPileId =
  (typeof TABLEAU_IDS)[number] | (typeof FOUNDATION_IDS)[number]

export type DraggableCardData = {
  type: 'card'
  cards: Card[]
  fromPileId: string
  fromIndex: number
}

export type DroppableZoneData = {
  type: 'pile'
  pileId: string
  role: 'tableau' | 'foundation'
}
