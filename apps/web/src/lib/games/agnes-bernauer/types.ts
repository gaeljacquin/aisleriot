import type { Card, GameStatus, Rank, Suit } from '#/lib/types'

export type AgnesBernauerTableauId =
  | 'tableau-0'
  | 'tableau-1'
  | 'tableau-2'
  | 'tableau-3'
  | 'tableau-4'
  | 'tableau-5'
  | 'tableau-6'

export type AgnesBernauerFoundationId =
  'foundation-0' | 'foundation-1' | 'foundation-2' | 'foundation-3'

export type AgnesBernauerReserveId =
  | 'reserve-0'
  | 'reserve-1'
  | 'reserve-2'
  | 'reserve-3'
  | 'reserve-4'
  | 'reserve-5'
  | 'reserve-6'

export type AgnesBernauerPileId =
  | AgnesBernauerTableauId
  | AgnesBernauerFoundationId
  | AgnesBernauerReserveId
  | 'stock'

export interface AgnesBernauerState {
  tableau: Record<AgnesBernauerTableauId, Card[]>
  foundation: Record<AgnesBernauerFoundationId, Card[]>
  foundationSuits: Record<AgnesBernauerFoundationId, Suit>
  reserve: Record<AgnesBernauerReserveId, Card[]>
  stock: Card[]
  baseRank: Rank
  score: number
  moveCount: number
  status: GameStatus
  usedUndo: boolean
  currentSeed: number | undefined
}

export interface AgnesBernauerMove {
  fromPile:
    AgnesBernauerTableauId | AgnesBernauerFoundationId | AgnesBernauerReserveId
  fromIndex: number
  toPile: AgnesBernauerTableauId | AgnesBernauerFoundationId
}

export interface DraggableCardData {
  type: 'card'
  cards: Card[]
  pileId:
    AgnesBernauerTableauId | AgnesBernauerFoundationId | AgnesBernauerReserveId
  fromIndex: number
}

export interface DroppableZoneData {
  type: 'pile'
  pileId: AgnesBernauerTableauId | AgnesBernauerFoundationId
  role: 'tableau' | 'foundation'
}

export const TABLEAU_IDS: AgnesBernauerTableauId[] = [
  'tableau-0',
  'tableau-1',
  'tableau-2',
  'tableau-3',
  'tableau-4',
  'tableau-5',
  'tableau-6',
]

export const FOUNDATION_IDS: AgnesBernauerFoundationId[] = [
  'foundation-0',
  'foundation-1',
  'foundation-2',
  'foundation-3',
]

export const RESERVE_IDS: AgnesBernauerReserveId[] = [
  'reserve-0',
  'reserve-1',
  'reserve-2',
  'reserve-3',
  'reserve-4',
  'reserve-5',
  'reserve-6',
]
