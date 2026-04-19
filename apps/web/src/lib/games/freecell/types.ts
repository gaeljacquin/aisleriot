import type { Card, GameStatus, Suit } from '#/lib/types'

export type FreeCellPileId = string
// 'tableau-0' through 'tableau-7'
// 'freecell-0' through 'freecell-3'
// 'foundation-hearts' | 'foundation-diamonds' | 'foundation-clubs' | 'foundation-spades'

export interface FreeCellMove {
  fromPileId: FreeCellPileId
  fromIndex: number // index in pile.cards where drag started; sequence = pile.cards.slice(fromIndex)
  toPileId: FreeCellPileId
}

export interface FreeCellState {
  tableau: Record<FreeCellPileId, Card[]> // 'tableau-0'..'tableau-7'; index 0=deepest, last=exposed top
  freeCells: Record<FreeCellPileId, Card | null> // 'freecell-0'..'freecell-3'; null=empty
  foundation: Record<FreeCellPileId, Card[]> // 'foundation-<suit>'; last=top
  score: number
  moveCount: number
  status: GameStatus
  usedUndo: boolean
  currentSeed: number | undefined
  isAutoMoving: boolean
}

export interface DraggableCardData {
  type: 'card'
  cards: Card[] // sequence being dragged (length 1 = single card)
  fromPileId: FreeCellPileId
  fromIndex: number
}

export interface DroppableZoneData {
  type: 'pile'
  pileId: FreeCellPileId
  role: 'tableau' | 'foundation' | 'freecell'
}

export const TABLEAU_IDS: FreeCellPileId[] = [
  'tableau-0',
  'tableau-1',
  'tableau-2',
  'tableau-3',
  'tableau-4',
  'tableau-5',
  'tableau-6',
  'tableau-7',
]

export const FREECELL_IDS: FreeCellPileId[] = [
  'freecell-0',
  'freecell-1',
  'freecell-2',
  'freecell-3',
]

export const FOUNDATION_IDS: FreeCellPileId[] = [
  'foundation-hearts',
  'foundation-diamonds',
  'foundation-clubs',
  'foundation-spades',
]

export const FOUNDATION_SUITS: Record<FreeCellPileId, Suit> = {
  'foundation-hearts': 'hearts',
  'foundation-diamonds': 'diamonds',
  'foundation-clubs': 'clubs',
  'foundation-spades': 'spades',
}
