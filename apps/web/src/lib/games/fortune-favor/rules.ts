import { rankValue } from '#/lib/utils'
import type { Card } from '#/lib/types'
import type {
  FortuneFavorState,
  FortuneFavorTableauId,
  FortuneFavorFoundationId,
} from './types'
import { TABLEAU_IDS } from './types'

export function canMoveToTableau(
  state: FortuneFavorState,
  fromPile: FortuneFavorTableauId | FortuneFavorFoundationId | 'waste',
  fromIndex: number,
  toPile: FortuneFavorTableauId,
): boolean {
  if (fromPile === toPile) return false

  const card = resolveSourceCard(state, fromPile, fromIndex)
  if (!card || !card.faceUp) return false

  // Only one card at a time can be moved.
  if (!isTopCard(state, fromPile, fromIndex)) return false

  const targetPile = state.tableau[toPile]

  if (targetPile.length === 0) {
    // Spaces are automatically filled from stock or waste.
    // Manual move to an empty space is only allowed when both stock and waste are empty.
    if (state.stock.length > 0 || state.waste.length > 0) return false
    return true
  }

  const targetTop = targetPile[targetPile.length - 1]

  // Build down by suit
  return (
    card.suit === targetTop.suit &&
    rankValue(targetTop.rank) - rankValue(card.rank) === 1
  )
}

export function canMoveToFoundation(
  state: FortuneFavorState,
  fromPile: FortuneFavorTableauId | FortuneFavorFoundationId | 'waste',
  fromIndex: number,
): boolean {
  const card = resolveSourceCard(state, fromPile, fromIndex)
  if (!card || !card.faceUp) return false

  if (!isTopCard(state, fromPile, fromIndex)) return false

  const foundationId = `foundation-${card.suit}` as FortuneFavorFoundationId
  const pile = state.foundation[foundationId]

  if (!pile || pile.length === 0) {
    return rankValue(card.rank) === 1
  }

  const top = pile[pile.length - 1]
  return rankValue(card.rank) === rankValue(top.rank) + 1
}

export function hasLegalMoves(state: FortuneFavorState): boolean {
  const sources: (
    FortuneFavorTableauId | FortuneFavorFoundationId | 'waste'
  )[] = ['waste', ...TABLEAU_IDS]

  for (const source of sources) {
    let card: Card | null = null
    let index = -1

    if (source === 'waste') {
      if (state.waste.length > 0) {
        index = state.waste.length - 1
        card = state.waste[index]
      }
    } else if (source.startsWith('tableau-')) {
      const pile = state.tableau[source as FortuneFavorTableauId]
      if (pile.length > 0) {
        index = pile.length - 1
        card = pile[index]
      }
    }

    if (!card) continue

    // Check foundation move
    if (canMoveToFoundation(state, source, index)) return true

    // Check tableau moves
    for (const toTableau of TABLEAU_IDS) {
      if (canMoveToTableau(state, source, index, toTableau)) return true
    }
  }

  return false
}

export function resolveSourceCard(
  state: FortuneFavorState,
  fromPile: string,
  fromIndex: number,
): Card | null {
  if (fromPile === 'waste') {
    if (state.waste.length === 0 || fromIndex !== state.waste.length - 1)
      return null
    return state.waste[fromIndex]
  }
  if (fromPile.startsWith('tableau-')) {
    const pile = state.tableau[fromPile as FortuneFavorTableauId]
    if (!pile || pile.length === 0 || fromIndex !== pile.length - 1) return null
    return pile[fromIndex]
  }
  if (fromPile.startsWith('foundation-')) {
    const pile = state.foundation[fromPile as FortuneFavorFoundationId]
    if (!pile || pile.length === 0 || fromIndex !== pile.length - 1) return null
    return pile[fromIndex]
  }
  return null
}

export function isTopCard(
  state: FortuneFavorState,
  pileId: string,
  index: number,
): boolean {
  if (pileId === 'waste') return index === state.waste.length - 1
  if (pileId.startsWith('tableau-')) {
    const pile = state.tableau[pileId as FortuneFavorTableauId]
    return !!pile && index === pile.length - 1
  }
  if (pileId.startsWith('foundation-')) {
    const pile = state.foundation[pileId as FortuneFavorFoundationId]
    return !!pile && index === pile.length - 1
  }
  return false
}
