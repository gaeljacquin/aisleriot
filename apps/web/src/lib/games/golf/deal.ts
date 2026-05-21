import { createShuffledDeck } from '#/lib/utils'
import type { Pile } from '#/lib/types'
import type { GolfState } from './types'

export function createInitialState(seed?: number): GolfState {
  const resolvedSeed = seed ?? Math.floor(Math.random() * 1_000_000)
  const shuffled = createShuffledDeck(resolvedSeed)

  const columns: Pile[] = []
  for (let i = 0; i < 7; i++) {
    const cards = shuffled.slice(i * 5, (i + 1) * 5).map((card) => ({
      ...card,
      faceUp: true,
    }))
    columns.push({
      id: `column-${i}`,
      role: 'tableau',
      cards,
    })
  }

  // First card to waste
  const wasteCard = { ...shuffled[35], faceUp: true }
  const waste = [wasteCard]

  // Remaining 16 cards to stock (35 dealt to columns, 1 to waste = 36)
  // Wait, 7 * 5 = 35. 52 - 35 = 17.
  // shuffled[35] is the 36th card.
  // shuffled[36] to shuffled[51] are the remaining 16 cards.
  const stock = shuffled.slice(36).map((card) => ({ ...card, faceUp: false }))

  return {
    columns,
    stock,
    waste,
    score: 0,
    moveCount: 0,
    status: 'playing',
    usedUndo: false,
    currentSeed: resolvedSeed,
  }
}
