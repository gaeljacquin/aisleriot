import { rankValue, oppColor } from '#/lib/utils'
import type { Card } from '#/lib/types'
import type { FreeCellState, FreeCellPileId, FreeCellMove } from './types'
import {
  TABLEAU_IDS,
  FREECELL_IDS,
  FOUNDATION_IDS,
  FOUNDATION_SUITS,
} from './types'

// ---------------------------------------------------------------------------
// Sequence helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if cards form a valid FreeCell sequence:
 * alternating color, strictly descending rank.
 * cards[0] is highest rank (fan top), last is lowest rank (fan bottom).
 */
export function isValidSequence(cards: Card[]): boolean {
  if (cards.length === 0) return false
  if (cards.length === 1) return true

  for (let i = 0; i < cards.length - 1; i++) {
    const upper = cards[i]
    const lower = cards[i + 1]
    if (!oppColor(upper, lower)) return false
    if (rankValue(upper.rank) - rankValue(lower.rank) !== 1) return false
  }
  return true
}

// ---------------------------------------------------------------------------
// Move capacity
// ---------------------------------------------------------------------------

/**
 * Maximum number of cards movable as a sequence.
 * Formula: (emptyFreeCells + 1) * 2^(emptyTableauCols)
 * where emptyTableauCols does NOT count the destination column.
 */
export function maxMovableCards(
  emptyFreeCells: number,
  emptyTableauCols: number,
  destinationIsEmpty: boolean,
): number {
  const effectiveCols = destinationIsEmpty
    ? Math.max(0, emptyTableauCols - 1)
    : emptyTableauCols
  return (emptyFreeCells + 1) * Math.pow(2, effectiveCols)
}

// ---------------------------------------------------------------------------
// State helpers
// ---------------------------------------------------------------------------

function countEmptyFreeCells(state: FreeCellState): number {
  return FREECELL_IDS.filter((id) => state.freeCells[id] === null).length
}

function countEmptyTableauCols(state: FreeCellState): number {
  return TABLEAU_IDS.filter((id) => state.tableau[id].length === 0).length
}

// ---------------------------------------------------------------------------
// Move validators
// ---------------------------------------------------------------------------

/**
 * Can the card at fromIndex in fromPileId move to a foundation pile?
 * Only valid if fromIndex is the last index (single top card).
 */
export function canMoveToFoundation(
  state: FreeCellState,
  fromPileId: FreeCellPileId,
  fromIndex: number,
): boolean {
  let card: Card | null = null

  if (fromPileId.startsWith('tableau-')) {
    const pile = state.tableau[fromPileId]
    if (!pile || fromIndex !== pile.length - 1) return false
    card = pile[fromIndex] ?? null
  } else if (fromPileId.startsWith('freecell-')) {
    const fc = state.freeCells[fromPileId]
    if (fc === null) return false
    // fromIndex is ignored for freecell — it's always a single card
    card = fc
  } else {
    return false
  }

  if (!card) return false

  // Find foundation pile for this card's suit
  const foundationId = `foundation-${card.suit}` as FreeCellPileId
  const pile = state.foundation[foundationId]

  if (pile.length === 0) {
    return rankValue(card.rank) === 1 // must be Ace
  }
  const top = pile[pile.length - 1]
  return rankValue(card.rank) === rankValue(top.rank) + 1
}

/**
 * Can the top card of fromPile move to any free cell?
 * fromIndex must be the last element (single card only from tableau or freecell not applicable).
 */
export function canMoveToFreeCell(
  state: FreeCellState,
  fromPileId: FreeCellPileId,
  fromIndex: number,
): boolean {
  // Only single cards can go to a free cell
  if (fromPileId.startsWith('tableau-')) {
    const pile = state.tableau[fromPileId]
    if (!pile || fromIndex !== pile.length - 1) return false
  } else {
    return false // freecell→freecell or foundation→freecell not allowed
  }

  return countEmptyFreeCells(state) > 0
}

/**
 * Can the sequence starting at fromIndex in fromPileId move to toPileId (tableau)?
 */
export function canMoveToTableau(
  state: FreeCellState,
  fromPileId: FreeCellPileId,
  fromIndex: number,
  toPileId: FreeCellPileId,
): boolean {
  if (fromPileId === toPileId) return false
  if (!toPileId.startsWith('tableau-')) return false

  let sequence: Card[]

  if (fromPileId.startsWith('tableau-')) {
    const pile = state.tableau[fromPileId]
    if (!pile || fromIndex < 0 || fromIndex >= pile.length) return false
    sequence = pile.slice(fromIndex)
  } else if (fromPileId.startsWith('freecell-')) {
    const card = state.freeCells[fromPileId]
    if (card === null) return false
    sequence = [card]
  } else {
    return false // foundation→tableau not allowed
  }

  if (!isValidSequence(sequence)) return false

  const emptyFC = countEmptyFreeCells(state)
  const emptyTC = countEmptyTableauCols(state)
  const targetPile = state.tableau[toPileId]
  const destinationIsEmpty = targetPile.length === 0

  const maxCards = maxMovableCards(emptyFC, emptyTC, destinationIsEmpty)
  if (sequence.length > maxCards) return false

  if (destinationIsEmpty) return true

  const targetTop = targetPile[targetPile.length - 1]
  const seqTop = sequence[0]
  return (
    oppColor(seqTop, targetTop) &&
    rankValue(targetTop.rank) - rankValue(seqTop.rank) === 1
  )
}

// ---------------------------------------------------------------------------
// Auto-move helpers
// ---------------------------------------------------------------------------

/**
 * Returns the lowest foundation rank among the opposite-color suits to the given suit.
 * Red suits: hearts/diamonds. Black suits: clubs/spades.
 */
function lowestFoundationRankOfOppositeColors(
  state: FreeCellState,
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades',
): number {
  const isRed = suit === 'hearts' || suit === 'diamonds'
  const oppIds = isRed
    ? (['foundation-clubs', 'foundation-spades'] as FreeCellPileId[])
    : (['foundation-hearts', 'foundation-diamonds'] as FreeCellPileId[])

  let lowest = Infinity
  for (const id of oppIds) {
    const pile = state.foundation[id]
    const rank = pile.length === 0 ? 0 : rankValue(pile[pile.length - 1].rank)
    if (rank < lowest) lowest = rank
  }
  return lowest === Infinity ? 0 : lowest
}

/**
 * Is a card safe to auto-move to foundation?
 * Microsoft standard: rank R is safe if R <= lowestFoundationRankOfOppositeColors + 2.
 * Aces and Twos are always safe.
 */
export function isSafeToAutoMove(state: FreeCellState, card: Card): boolean {
  const r = rankValue(card.rank)
  if (r <= 2) return true
  const opp = lowestFoundationRankOfOppositeColors(state, card.suit)
  return r <= opp + 2
}

/**
 * Returns all moves that are safe to auto-move to foundation
 * (checks tableau tops and occupied freecells).
 */
export function getAutoMoveTargets(state: FreeCellState): FreeCellMove[] {
  const moves: FreeCellMove[] = []

  // Check tableau tops
  for (const pileId of TABLEAU_IDS) {
    const pile = state.tableau[pileId]
    if (pile.length === 0) continue
    const card = pile[pile.length - 1]
    const fromIndex = pile.length - 1
    if (
      canMoveToFoundation(state, pileId, fromIndex) &&
      isSafeToAutoMove(state, card)
    ) {
      moves.push({
        fromPileId: pileId,
        fromIndex,
        toPileId: `foundation-${card.suit}` as FreeCellPileId,
      })
    }
  }

  // Check freecells
  for (const fcId of FREECELL_IDS) {
    const card = state.freeCells[fcId]
    if (card === null) continue
    if (
      canMoveToFoundation(state, fcId, 0) &&
      isSafeToAutoMove(state, card)
    ) {
      moves.push({
        fromPileId: fcId,
        fromIndex: 0,
        toPileId: `foundation-${card.suit}` as FreeCellPileId,
      })
    }
  }

  return moves
}

// ---------------------------------------------------------------------------
// Win condition
// ---------------------------------------------------------------------------

export function isGameWon(state: FreeCellState): boolean {
  return FOUNDATION_IDS.every((id) => state.foundation[id].length === 13)
}

// ---------------------------------------------------------------------------
// Draggable boundary helper
// ---------------------------------------------------------------------------

/**
 * For a tableau pile, find the lowest index i such that
 * isValidSequence(pile.slice(i)) is true.
 * Max-card capacity is only enforced at drop time, not at drag time.
 *
 * Returns pile.length - 1 when only the top card is draggable.
 * Returns 0 when all cards form a valid sequence.
 */
export function draggableFromIndex(
  state: FreeCellState,
  pileId: FreeCellPileId,
): number {
  const pile = state.tableau[pileId]
  if (!pile || pile.length === 0) return 0

  let seqStart = pile.length - 1

  for (let i = pile.length - 2; i >= 0; i--) {
    const upper = pile[i]
    const lower = pile[i + 1]
    if (!oppColor(upper, lower)) break
    if (rankValue(upper.rank) - rankValue(lower.rank) !== 1) break
    seqStart = i
  }

  return seqStart
}

export { FOUNDATION_SUITS, FOUNDATION_IDS, FREECELL_IDS, TABLEAU_IDS }
