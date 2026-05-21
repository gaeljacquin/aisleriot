import type { Card } from './card'

export type PileRole =
  | 'tableau'
  | 'foundation'
  | 'stock'
  | 'waste'
  | 'freecell'
  | 'peak'
  | 'discard'
  | 'reserve'

export type PileId = string

export interface Pile {
  id: PileId
  role: PileRole
  cards: Card[]
}
