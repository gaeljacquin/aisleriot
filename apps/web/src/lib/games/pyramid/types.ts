import type { Card, GameStatus } from '#/lib/types'

export type PyramidCellId = string // e.g. 'cell-0' through 'cell-27'

export interface PyramidCell {
  id: PyramidCellId
  card: Card
  blockedBy: PyramidCellId[] // empty = currently available
  removed: boolean
}

export interface PyramidState {
  cells: Record<PyramidCellId, PyramidCell>
  stock: Card[]   // top = last element
  waste: Card[]   // top = last element
  recyclesUsed: number
  score: number
  moveCount: number
  status: GameStatus
  usedUndo: boolean
}
