import { rankValue, oppColor } from '#/lib/utils'
import type { Card, Suit } from '#/lib/types'
import type {
  WestcliffState,
  WestcliffTableauId,
  WestcliffFoundationId,
} from './types'
import { FOUNDATION_SUITS } from './types'

/**
 * Returns true if cards form a valid Westcliff tableau sequence:
 * alternating color, strictly descending rank, ALL cards faceUp.
 * cards[0] is highest rank, last is lowest.
 */
export function isValidTableauSequence(cards: Card[]): boolean {
  if (cards.length === 0) return false
  if (cards.length === 1) return cards[0].faceUp

  for (let i = 0; i < cards.length - 1; i++) {
    const upper = cards[i]
    const lower = cards[i + 1]
    if (!upper.faceUp || !lower.faceUp) return false
    if (!oppColor(upper, lower)) return false
    if (rankValue(upper.rank) - rankValue(lower.rank) !== 1) return false
  }
  return true
}

/**
 * Can the sequence starting at fromIndex in fromPile move to toPile (tableau)?
 */
export function canMoveToTableau(
  state: WestcliffState,
  fromPile: string,
  fromIndex: number,
  toPile: WestcliffTableauId,
): boolean {
  if (fromPile === toPile) return false

  let sequence: Card[]

  if (fromPile === 'waste') {
    if (
      state.waste.length === 0 ||
      fromIndex < 0 ||
      fromIndex >= state.waste.length
    )
      return false
    sequence = [state.waste[fromIndex]]
  } else if (fromPile.startsWith('tableau-')) {
    const pile = state.tableau[fromPile as WestcliffTableauId]
    if (!pile || fromIndex < 0 || fromIndex >= pile.length) return false
    sequence = pile.slice(fromIndex)
  } else if (fromPile.startsWith('foundation-')) {
    const pile = state.foundation[fromPile as WestcliffFoundationId]
    if (!pile || pile.length === 0) return false
    if (fromIndex !== pile.length - 1) return false
    sequence = [pile[pile.length - 1]]
  } else {
    return false
  }

  if (!isValidTableauSequence(sequence)) return false

  const targetPile = state.tableau[toPile]
  if (!targetPile) return false
  const seqTop = sequence[0]

  if (targetPile.length === 0) {
    // Westcliff rule: Spaces may be filled with ANY available card or packed sequence
    return true
  }

  const targetTop = targetPile[targetPile.length - 1]
  return (
    targetTop.faceUp &&
    oppColor(seqTop, targetTop) &&
    rankValue(targetTop.rank) - rankValue(seqTop.rank) === 1
  )
}

/**
 * Can the card at fromPile/fromIndex move to foundation?
 * Only a single top card can go to foundation.
 */
export function canMoveToFoundation(
  state: WestcliffState,
  fromPile: string,
  fromIndex: number,
): boolean {
  const card = resolveSourceCard(state, fromPile, fromIndex)
  if (card === null) return false
  if (!card.faceUp) return false

  const foundationId = `foundation-${card.suit}` as WestcliffFoundationId
  const pile = state.foundation[foundationId]
  if (!pile) return false

  if (pile.length === 0) {
    return rankValue(card.rank) === 1 // must be Ace
  }
  const top = pile[pile.length - 1]
  return rankValue(card.rank) === rankValue(top.rank) + 1
}

/**
 * Resolve the single card at a source pile + index.
 * Returns null if the source is invalid.
 */
function resolveSourceCard(
  state: WestcliffState,
  fromPile: string,
  fromIndex: number,
): Card | null {
  if (fromPile === 'waste') {
    if (
      state.waste.length === 0 ||
      fromIndex < 0 ||
      fromIndex >= state.waste.length
    )
      return null
    return state.waste[fromIndex]
  }
  if (fromPile.startsWith('tableau-')) {
    const pile = state.tableau[fromPile as WestcliffTableauId]
    if (!pile || pile.length === 0) return null
    if (fromIndex !== pile.length - 1) return null
    return pile[pile.length - 1]
  }
  return null
}

/**
 * Can we flip cards from stock to waste?
 */
export function canFlipStock(state: WestcliffState): boolean {
  return state.stock.length > 0
}

/**
 * Can we recycle the waste back to stock?
 * Westcliff allows no redeal.
 */
export function canRedeal(_state: WestcliffState): boolean {
  return false
}

/**
 * Should the top card of a tableau column be auto-flipped face-up?
 */
export function autoFlipTop(column: Card[]): boolean {
  if (column.length === 0) return false
  return !column[column.length - 1].faceUp
}

/**
 * Is the game won? All 4 foundations have 13 cards.
 */
export function isGameWon(state: WestcliffState): boolean {
  return Object.values(state.foundation).every((pile) => pile.length === 13)
}

/**
 * For a Westcliff tableau pile, find the lowest index i such that
 * all cards from i to the end are face-up and form a valid sequence.
 */
export function draggableFromIndex(
  state: WestcliffState,
  pileId: WestcliffTableauId,
): number {
  const pile = state.tableau[pileId]
  if (!pile || pile.length === 0) return 0

  let firstFaceUp = pile.length - 1
  for (let i = 0; i < pile.length; i++) {
    if (pile[i].faceUp) {
      firstFaceUp = i
      break
    }
  }

  let seqStart = pile.length - 1
  for (let i = pile.length - 2; i >= firstFaceUp; i--) {
    const upper = pile[i]
    const lower = pile[i + 1]
    if (!upper.faceUp || !lower.faceUp) break
    if (!oppColor(upper, lower)) break
    if (rankValue(upper.rank) - rankValue(lower.rank) !== 1) break
    seqStart = i
  }

  return seqStart
}

/**
 * Returns the lowest foundation rank among the opposite-color suits to the given suit.
 */
function lowestFoundationRankOfOppositeColors(
  state: WestcliffState,
  suit: Suit,
): number {
  const isRed = suit === 'hearts' || suit === 'diamonds'
  const oppIds = isRed
    ? (['foundation-clubs', 'foundation-spades'] as WestcliffFoundationId[])
    : (['foundation-hearts', 'foundation-diamonds'] as WestcliffFoundationId[])

  let lowest = Infinity
  for (const id of oppIds) {
    const pile = state.foundation[id]
    const rank =
      !pile || pile.length === 0 ? 0 : rankValue(pile[pile.length - 1].rank)
    if (rank < lowest) lowest = rank
  }
  return lowest === Infinity ? 0 : lowest
}

/**
 * Is a card safe to auto-move to foundation?
 */
export function isSafeToAutoMove(state: WestcliffState, card: Card): boolean {
  const r = rankValue(card.rank)
  if (r <= 2) return true
  const opp = lowestFoundationRankOfOppositeColors(state, card.suit)
  return r <= opp + 2
}

export { FOUNDATION_SUITS }
