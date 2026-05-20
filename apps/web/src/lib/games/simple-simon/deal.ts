import { createShuffledDeck } from '#/lib/utils/deck'
import type {
  SimpleSimonState,
  SimpleSimonTableauId,
  SimpleSimonFoundationId,
} from './types'
import { TABLEAU_IDS, FOUNDATION_IDS } from './types'

export function dealSimpleSimon(seed?: number): SimpleSimonState {
  const deck = createShuffledDeck(seed)
  // Simple Simon: All cards are face-up
  const faceUpDeck = deck.map((card) => ({ ...card, faceUp: true }))

  const tableau: Record<SimpleSimonTableauId, any[]> = {
    'tableau-0': [],
    'tableau-1': [],
    'tableau-2': [],
    'tableau-3': [],
    'tableau-4': [],
    'tableau-5': [],
    'tableau-6': [],
    'tableau-7': [],
    'tableau-8': [],
    'tableau-9': [],
  }

  // Column heights: 8, 8, 8, 7, 6, 5, 4, 3, 2, 1 (Total 52)
  const heights = [8, 8, 8, 7, 6, 5, 4, 3, 2, 1]
  let cardIndex = 0

  for (let i = 0; i < TABLEAU_IDS.length; i++) {
    const id = TABLEAU_IDS[i]
    const height = heights[i]
    tableau[id] = faceUpDeck.slice(cardIndex, cardIndex + height)
    cardIndex += height
  }

  const foundations: Record<SimpleSimonFoundationId, any[]> = {
    'foundation-0': [],
    'foundation-1': [],
    'foundation-2': [],
    'foundation-3': [],
  }

  return {
    tableau,
    foundations,
    score: 0,
    moveCount: 0,
    status: 'playing',
    usedUndo: false,
    currentSeed: seed,
  }
}
