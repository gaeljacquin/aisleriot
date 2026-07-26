import { createShuffledDeck } from '#/lib/utils'
import type { Card } from '#/lib/types'
import type { FortuneFavorState } from './types'
import { TABLEAU_IDS } from './types'

export function createInitialState(seed?: number): FortuneFavorState {
  const resolvedSeed = seed ?? Math.floor(Math.random() * 1_000_000)
  const deck = createShuffledDeck(resolvedSeed)

  const foundation: FortuneFavorState['foundation'] =
    {} as FortuneFavorState['foundation']
  const remainingDeck: Card[] = []
  const acesRemoved = new Set<string>()

  for (const card of deck) {
    if (card.rank === 'A' && !acesRemoved.has(card.suit)) {
      acesRemoved.add(card.suit)
      foundation[`foundation-${card.suit}`] = [{ ...card, faceUp: true }]
    } else {
      remainingDeck.push(card)
    }
  }

  const tableau: FortuneFavorState['tableau'] =
    {} as FortuneFavorState['tableau']
  let cardIndex = 0
  for (let i = 0; i < 12; i++) {
    tableau[TABLEAU_IDS[i]] = [{ ...remainingDeck[cardIndex], faceUp: true }]
    cardIndex++
  }

  const stock = remainingDeck
    .slice(cardIndex)
    .map((c) => ({ ...c, faceUp: false }))

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
  }
}
