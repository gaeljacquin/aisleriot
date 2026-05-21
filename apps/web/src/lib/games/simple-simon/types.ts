import type { Card, GameStatus } from '#/lib/types'

export const TABLEAU_IDS = [
  'tableau-0',
  'tableau-1',
  'tableau-2',
  'tableau-3',
  'tableau-4',
  'tableau-5',
  'tableau-6',
  'tableau-7',
  'tableau-8',
  'tableau-9',
] as const

export const FOUNDATION_IDS = [
  'foundation-0',
  'foundation-1',
  'foundation-2',
  'foundation-3',
] as const

export type SimpleSimonTableauId = (typeof TABLEAU_IDS)[number]
export type SimpleSimonFoundationId = (typeof FOUNDATION_IDS)[number]
export type SimpleSimonPileId = SimpleSimonTableauId | SimpleSimonFoundationId

export interface SimpleSimonState {
  tableau: Record<SimpleSimonTableauId, Card[]>
  foundations: Record<SimpleSimonFoundationId, Card[]> // Stores completed sequences of 13
  score: number
  moveCount: number
  status: GameStatus
  usedUndo: boolean
  currentSeed: number | undefined
}

export interface SimpleSimonMove {
  fromPileId: SimpleSimonPileId
  fromIndex: number
  toPileId: SimpleSimonPileId
}

export type DraggableCardData = {
  type: 'card'
  cards: Card[]
  fromPileId: SimpleSimonPileId
  fromIndex: number
}

export type DroppableZoneData = {
  type: 'pile'
  pileId: SimpleSimonPileId
  role: 'tableau' | 'foundation'
}
