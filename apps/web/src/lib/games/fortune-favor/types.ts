import type { Card, GameStatus, Suit } from '#/lib/types'

export type FortuneFavorTableauId =
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
  | 'tableau-10'
  | 'tableau-11'

export const TABLEAU_IDS: FortuneFavorTableauId[] = [
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
  'tableau-10',
  'tableau-11',
]

export type FortuneFavorFoundationId =
  | 'foundation-clubs'
  | 'foundation-diamonds'
  | 'foundation-hearts'
  | 'foundation-spades'

export const FOUNDATION_IDS: FortuneFavorFoundationId[] = [
  'foundation-clubs',
  'foundation-diamonds',
  'foundation-hearts',
  'foundation-spades',
]

export const FOUNDATION_SUITS: Suit[] = [
  'clubs',
  'diamonds',
  'hearts',
  'spades',
]

export interface FortuneFavorState {
  tableau: Record<FortuneFavorTableauId, Card[]>
  foundation: Record<FortuneFavorFoundationId, Card[]>
  stock: Card[]
  waste: Card[]
  score: number
  moveCount: number
  status: GameStatus
  usedUndo: boolean
  currentSeed: number
}
