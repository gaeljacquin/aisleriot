import { createShuffledDeck } from '#/lib/utils'
import type { Card } from '#/lib/types'
import type { WestcliffState } from './types'
import { TABLEAU_IDS, FOUNDATION_IDS } from './types'

/**
 * Standard Westcliff deal:
 * - 10 columns of 3 cards each (total 30 cards dealt to tableau)
 * - In each column, bottom 2 cards face-down, top 1 face-up
 * - Remaining 22 cards go to stock face-down
 * - waste = []
 * - foundation = empty
 */
export function createInitialState(seed?: number): WestcliffState {
  const resolvedSeed = seed ?? Math.floor(Math.random() * 1_000_000)
  const shuffled = createShuffledDeck(resolvedSeed)

  const tableau: WestcliffState['tableau'] = {} as WestcliffState['tableau']
  let cardIndex = 0

  for (let col = 0; col < 10; col++) {
    const colCards = shuffled
      .slice(cardIndex, cardIndex + 3)
      .map((c: Card, i: number) => ({
        ...c,
        faceUp: i === 2,
      }))
    tableau[TABLEAU_IDS[col]] = colCards
    cardIndex += 3
  }

  const stock = shuffled
    .slice(cardIndex)
    .map((c: Card) => ({ ...c, faceUp: false }))

  const foundation: WestcliffState['foundation'] =
    {} as WestcliffState['foundation']
  for (const id of FOUNDATION_IDS) {
    foundation[id] = []
  }

  return {
    tableau,
    foundation,
    stock,
    waste: [],
    score: 0,
    moveCount: 0,
    status: 'playing',
    usedUndo: false,
    currentSeed: resolvedSeed,
    redealsUsed: 0,
  }
}
