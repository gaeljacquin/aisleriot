import { createDeck, shuffleDeck } from '#/lib/utils'
import type { KlondikeState } from './types'
import { TABLEAU_IDS, FOUNDATION_IDS } from './types'

/**
 * Standard Klondike deal:
 * - Column i gets i+1 cards; bottom i cards face-down, top 1 face-up
 * - Remaining 24 cards go to stock (face-down)
 * - waste = []
 */
export function createInitialState(drawCount: 1 | 3, seed?: number): KlondikeState {
  const resolvedSeed = seed ?? Math.floor(Math.random() * 1_000_000)
  const shuffled = shuffleDeck(createDeck(), resolvedSeed)

  const tableau: KlondikeState['tableau'] = {} as KlondikeState['tableau']
  let cardIndex = 0

  for (let col = 0; col < 7; col++) {
    const count = col + 1
    const colCards = shuffled.slice(cardIndex, cardIndex + count).map((c, i) => ({
      ...c,
      faceUp: i === count - 1,
    }))
    tableau[TABLEAU_IDS[col]] = colCards
    cardIndex += count
  }

  // Remaining 24 cards go to stock, all face-down
  const stock = shuffled.slice(cardIndex).map((c) => ({ ...c, faceUp: false }))

  const foundation: KlondikeState['foundation'] = {} as KlondikeState['foundation']
  for (const id of FOUNDATION_IDS) {
    foundation[id] = []
  }

  return {
    tableau,
    foundation,
    stock,
    waste: [],
    drawCount,
    score: 0,
    moveCount: 0,
    status: 'playing',
    usedUndo: false,
    currentSeed: resolvedSeed,
    redealsUsed: 0,
  }
}
