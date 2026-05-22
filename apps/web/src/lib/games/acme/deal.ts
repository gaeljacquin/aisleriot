import { createShuffledDeck } from '#/lib/utils'
import type { Card } from '#/lib/types'
import type { AcmeState } from './types'
import { TABLEAU_IDS } from './types'

export function createInitialState(seed?: number): AcmeState {
  const resolvedSeed = seed ?? Math.floor(Math.random() * 1_000_000)
  const deck = createShuffledDeck(resolvedSeed)

  const foundation: AcmeState['foundation'] = {} as AcmeState['foundation']
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

  const reserve: Card[] = []
  for (let i = 0; i < 13; i++) {
    reserve.push({
      ...remainingDeck[i],
      faceUp: true,
    })
  }

  const tableau: AcmeState['tableau'] = {} as AcmeState['tableau']
  let cardIndex = 13
  for (let i = 0; i < 4; i++) {
    tableau[TABLEAU_IDS[i]] = [{ ...remainingDeck[cardIndex], faceUp: true }]
    cardIndex++
  }

  const stock = remainingDeck
    .slice(cardIndex)
    .map((c) => ({ ...c, faceUp: false }))

  return {
    tableau,
    foundation,
    reserve,
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
