import type { Card, GameStatus, Suit } from '#/lib/types'

export const TABLEAU_IDS = [
  'tableau-0',
  'tableau-1',
  'tableau-2',
  'tableau-3',
] as const
export type AcmeTableauId = (typeof TABLEAU_IDS)[number]

export const FOUNDATION_SUITS: Suit[] = [
  'clubs',
  'diamonds',
  'hearts',
  'spades',
]
export const FOUNDATION_IDS = FOUNDATION_SUITS.map(
  (s) => `foundation-${s}`,
) as `foundation-${Suit}`[]
export type AcmeFoundationId = (typeof FOUNDATION_IDS)[number]

export interface AcmeState {
  tableau: Record<AcmeTableauId, Card[]>
  foundation: Record<AcmeFoundationId, Card[]>
  reserve: Card[]
  stock: Card[]
  waste: Card[]

  score: number
  moveCount: number
  status: GameStatus
  usedUndo: boolean
  currentSeed: number
  redealsUsed: number
}
