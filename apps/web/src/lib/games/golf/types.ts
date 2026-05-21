import type { Card, Pile, GameStatus } from '#/lib/types'

export interface GolfState {
  columns: Pile[]
  stock: Card[]
  waste: Card[]
  score: number
  moveCount: number
  status: GameStatus
  usedUndo: boolean
  currentSeed: number
}
