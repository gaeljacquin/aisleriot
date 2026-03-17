import type { Card, GameStatus } from '#/lib/types'

export type TriPeaksCellId = string // e.g. 'cell-0', 'cell-18'

export interface TriPeaksCell {
  id: TriPeaksCellId
  card: Card
  blockedBy: TriPeaksCellId[] // empty = currently available
  removed: boolean
}

export interface TriPeaksState {
  cells: Record<TriPeaksCellId, TriPeaksCell>
  stock: Card[]
  waste: Card[]
  chain: number
  score: number
  moveCount: number
  status: GameStatus
  usedUndo: boolean // tracks whether undo was used (for clean win stat)
}
