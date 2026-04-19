import type { Card, GameStatus, Suit } from '#/lib/types'

export type KlondikeTableauId =
  | 'tableau-0'
  | 'tableau-1'
  | 'tableau-2'
  | 'tableau-3'
  | 'tableau-4'
  | 'tableau-5'
  | 'tableau-6'

export type KlondikeFoundationId =
  | 'foundation-hearts'
  | 'foundation-diamonds'
  | 'foundation-clubs'
  | 'foundation-spades'

export type KlondikePileId = KlondikeTableauId | KlondikeFoundationId | 'waste'

export interface KlondikeState {
  tableau: Record<KlondikeTableauId, Card[]> // index 0=deepest (face-down), last=top (face-up)
  foundation: Record<KlondikeFoundationId, Card[]> // last=top
  stock: Card[] // face-down; last=top of stock
  waste: Card[] // face-up; last=playable top
  drawCount: 1 | 3
  score: number
  moveCount: number
  status: GameStatus
  usedUndo: boolean
  currentSeed: number | undefined
  redealsUsed: number
  currentDealCount: number
  wasteDeals: number[]
}

export interface KlondikeMove {
  fromPile: KlondikeTableauId | KlondikeFoundationId | 'waste'
  fromIndex: number
  toPile: KlondikeTableauId | KlondikeFoundationId
}

export interface DraggableCardData {
  type: 'card'
  cards: Card[] // sequence being dragged (length 1 = single card)
  pileId: KlondikeTableauId | KlondikeFoundationId | 'waste'
  fromIndex: number
}

export interface DroppableZoneData {
  type: 'pile'
  pileId: KlondikeTableauId | KlondikeFoundationId
  role: 'tableau' | 'foundation'
}

export const TABLEAU_IDS: KlondikeTableauId[] = [
  'tableau-0',
  'tableau-1',
  'tableau-2',
  'tableau-3',
  'tableau-4',
  'tableau-5',
  'tableau-6',
]

export const FOUNDATION_IDS: KlondikeFoundationId[] = [
  'foundation-hearts',
  'foundation-diamonds',
  'foundation-clubs',
  'foundation-spades',
]

export const FOUNDATION_SUITS: Record<KlondikeFoundationId, Suit> = {
  'foundation-hearts': 'hearts',
  'foundation-diamonds': 'diamonds',
  'foundation-clubs': 'clubs',
  'foundation-spades': 'spades',
}
