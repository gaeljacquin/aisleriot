import type { Card } from '#/lib/types'
import { shuffleDeck } from '#/lib/utils/deck'
import type { SpiderState, SpiderTableauId, SpiderFoundationId } from './types'
import { TABLEAU_IDS } from './types'

const RANKS = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
] as const

/**
 * Creates 2 decks of cards with all cards of the same suit ('spades').
 * Total: 8 sets of 13 cards = 104 cards.
 */
export function createSpiderDeck(): Card[] {
  const cards: Card[] = []
  for (let set = 0; set < 8; set++) {
    for (const rank of RANKS) {
      cards.push({
        id: `spades-${rank}-${set}-${Math.random().toString(36).substring(2, 9)}`,
        suit: 'spades',
        rank,
        faceUp: false,
      })
    }
  }
  return cards
}

export function createInitialState(seed?: number): SpiderState {
  const resolvedSeed = seed ?? Math.floor(Math.random() * 1_000_000)
  const cards = createSpiderDeck()
  const shuffled = shuffleDeck(cards, resolvedSeed)

  const tableau: Record<SpiderTableauId, Card[]> = {
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

  let cardIndex = 0
  for (let i = 0; i < TABLEAU_IDS.length; i++) {
    const id = TABLEAU_IDS[i]
    const count = i < 4 ? 6 : 5
    const columnCards = shuffled.slice(cardIndex, cardIndex + count)
    cardIndex += count

    tableau[id] = columnCards.map((card, idx) => ({
      ...card,
      faceUp: idx === count - 1,
    }))
  }

  const stock = shuffled.slice(cardIndex).map((card) => ({
    ...card,
    faceUp: false,
  }))

  const foundations: Record<SpiderFoundationId, Card[]> = {
    'foundation-0': [],
    'foundation-1': [],
    'foundation-2': [],
    'foundation-3': [],
    'foundation-4': [],
    'foundation-5': [],
    'foundation-6': [],
    'foundation-7': [],
  }

  return {
    tableau,
    foundations,
    stock,
    score: 500,
    moveCount: 0,
    status: 'playing',
    usedUndo: false,
    currentSeed: resolvedSeed,
  }
}
