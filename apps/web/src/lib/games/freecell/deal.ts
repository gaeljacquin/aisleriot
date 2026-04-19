import { createShuffledDeck } from '#/lib/utils'
import type { Card } from '#/lib/types'
import type { FreeCellState } from './types'
import { TABLEAU_IDS, FREECELL_IDS, FOUNDATION_IDS } from './types'

/**
 * Standard FreeCell deal:
 * - Columns 0–3: 7 cards each
 * - Columns 4–7: 6 cards each
 * - All cards faceUp: true
 */
export function createInitialState(seed?: number): FreeCellState {
  const resolvedSeed = seed ?? Math.floor(Math.random() * 1_000_000)
  const shuffled = createShuffledDeck(resolvedSeed).map((c: Card) => ({
    ...c,
    faceUp: true,
  }))

  const tableau: FreeCellState['tableau'] = {}
  let cardIndex = 0

  for (let col = 0; col < 8; col++) {
    const count = col < 4 ? 7 : 6
    tableau[TABLEAU_IDS[col]] = shuffled.slice(cardIndex, cardIndex + count)
    cardIndex += count
  }

  const freeCells: FreeCellState['freeCells'] = {}
  for (const id of FREECELL_IDS) {
    freeCells[id] = null
  }

  const foundation: FreeCellState['foundation'] = {}
  for (const id of FOUNDATION_IDS) {
    foundation[id] = []
  }

  return {
    tableau,
    freeCells,
    foundation,
    score: 0,
    moveCount: 0,
    status: 'playing',
    usedUndo: false,
    currentSeed: resolvedSeed,
    isAutoMoving: false,
  }
}
