import type { Card, GameStatus, Suit } from '#/lib/types'

export type WestcliffTableauId =
  | 'tableau-0'
  | 'tableau-1'
  | 'tableau-2'
  | 'tableau-3'
  | 'tableau-4'
  | 'tableau-5'
  | 'tableau-6'
  | 'tableau-7'
  | 'tableau-8'
  | 'tableau-9'

export type WestcliffFoundationId =
  | 'foundation-hearts'
  | 'foundation-diamonds'
  | 'foundation-clubs'
  | 'foundation-spades'

export const TABLEAU_IDS: WestcliffTableauId[] = [
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
]

export const FOUNDATION_IDS: WestcliffFoundationId[] = [
  'foundation-hearts',
  'foundation-diamonds',
  'foundation-clubs',
  'foundation-spades',
]

export const FOUNDATION_SUITS: Record<WestcliffFoundationId, Suit> = {
  'foundation-hearts': 'hearts',
  'foundation-diamonds': 'diamonds',
  'foundation-clubs': 'clubs',
  'foundation-spades': 'spades',
}

export interface WestcliffState {
  tableau: Record<WestcliffTableauId, Card[]>
  foundation: Record<WestcliffFoundationId, Card[]>
  stock: Card[]
  waste: Card[]
  score: number
  moveCount: number
  status: GameStatus
  usedUndo: boolean
  currentSeed: number
  redealsUsed: number
}

export interface WestcliffMove {
  fromPile: string
  fromIndex: number
  toPile: string
}

export type DraggableCardData = {
  type: 'card'
  cards: Card[]
  pileId: string
  fromIndex: number
}

export type DroppableZoneData = {
  type: 'pile'
  pileId: string
  role?: string
}
