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
  'foundation-4',
  'foundation-5',
  'foundation-6',
  'foundation-7',
] as const

export type SpiderTableauId = (typeof TABLEAU_IDS)[number]
export type SpiderFoundationId = (typeof FOUNDATION_IDS)[number]
export type SpiderPileId = SpiderTableauId | SpiderFoundationId | 'stock'

export interface SpiderState {
  tableau: Record<SpiderTableauId, Card[]>
  foundations: Record<SpiderFoundationId, Card[]>
  stock: Card[]
  score: number
  moveCount: number
  status: GameStatus
  usedUndo: boolean
  currentSeed?: number
}

export interface SpiderMove {
  fromPileId: SpiderPileId
  fromIndex: number
  toPileId: SpiderPileId
}

export type DraggableCardData = {
  type: 'card'
  cards: Card[]
  fromPileId: SpiderPileId
  fromIndex: number
}

export type DroppableZoneData = {
  type: 'pile'
  pileId: SpiderPileId
  role: 'tableau' | 'foundation' | 'stock'
}
