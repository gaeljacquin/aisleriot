import type { GameVariantId, Suit, Rank } from '@workspace/constants'

export interface PreviewCard {
  suit: Suit
  rank: Rank
  faceUp: boolean
}

export type PreviewDeal = {
  [key in GameVariantId]: any // Specific structures for each
}

// Just defining the structures here for clarity
export const PREVIEW_DEALS: Record<string, any> = {
  'klondike-draw-1': {
    stock: { faceUp: false },
    waste: { suit: 'hearts', rank: '2', faceUp: true },
    foundations: [{ suit: 'hearts', rank: 'A', faceUp: true }, null, null, null],
    tableau: [
      [{ suit: 'spades', rank: 'K', faceUp: true }],
      [{ suit: 'hearts', rank: 'Q', faceUp: false }, { suit: 'clubs', rank: 'J', faceUp: true }],
      [{ suit: 'diamonds', rank: '10', faceUp: false }, { suit: 'spades', rank: '9', faceUp: false }, { suit: 'hearts', rank: '8', faceUp: true }],
      [{ suit: 'clubs', rank: '7', faceUp: false }, { suit: 'diamonds', rank: '6', faceUp: false }, { suit: 'spades', rank: '5', faceUp: false }, { suit: 'hearts', rank: '4', faceUp: true }],
      [{ suit: 'clubs', rank: '3', faceUp: false }, { suit: 'diamonds', rank: '2', faceUp: false }, { suit: 'spades', rank: 'A', faceUp: false }, { suit: 'hearts', rank: 'K', faceUp: false }, { suit: 'clubs', rank: 'Q', faceUp: true }],
      [{ suit: 'diamonds', rank: 'J', faceUp: false }, { suit: 'spades', rank: '10', faceUp: false }, { suit: 'hearts', rank: '9', faceUp: false }, { suit: 'clubs', rank: '8', faceUp: false }, { suit: 'diamonds', rank: '7', faceUp: false }, { suit: 'spades', rank: '6', faceUp: true }],
      [{ suit: 'hearts', rank: '5', faceUp: false }, { suit: 'clubs', rank: '4', faceUp: false }, { suit: 'diamonds', rank: '3', faceUp: false }, { suit: 'spades', rank: '2', faceUp: false }, { suit: 'hearts', rank: 'A', faceUp: false }, { suit: 'clubs', rank: 'K', faceUp: false }, { suit: 'diamonds', rank: 'Q', faceUp: true }],
    ]
  },
  'klondike-draw-3': {
    stock: { faceUp: false },
    waste: [
      { suit: 'diamonds', rank: 'K', faceUp: true },
      { suit: 'hearts', rank: 'Q', faceUp: true },
      { suit: 'clubs', rank: 'J', faceUp: true }
    ],
    foundations: [
      { suit: 'hearts', rank: 'A', faceUp: true },
      { suit: 'clubs', rank: 'A', faceUp: true },
      null,
      null
    ],
    tableau: [
      [{ suit: 'spades', rank: 'J', faceUp: true }],
      [{ suit: 'hearts', rank: '10', faceUp: false }, { suit: 'clubs', rank: '9', faceUp: true }],
      [{ suit: 'diamonds', rank: '8', faceUp: false }, { suit: 'spades', rank: '7', faceUp: false }, { suit: 'hearts', rank: '6', faceUp: true }],
      [{ suit: 'clubs', rank: '5', faceUp: false }, { suit: 'diamonds', rank: '4', faceUp: false }, { suit: 'spades', rank: '3', faceUp: false }, { suit: 'hearts', rank: '2', faceUp: true }],
      [{ suit: 'clubs', rank: 'A', faceUp: false }, { suit: 'diamonds', rank: 'K', faceUp: false }, { suit: 'spades', rank: 'Q', faceUp: false }, { suit: 'hearts', rank: 'J', faceUp: false }, { suit: 'clubs', rank: '10', faceUp: true }],
      [{ suit: 'diamonds', rank: '9', faceUp: false }, { suit: 'spades', rank: '8', faceUp: false }, { suit: 'hearts', rank: '7', faceUp: false }, { suit: 'clubs', rank: '6', faceUp: false }, { suit: 'diamonds', rank: '5', faceUp: false }, { suit: 'spades', rank: '4', faceUp: true }],
      [{ suit: 'hearts', rank: '3', faceUp: false }, { suit: 'clubs', rank: '2', faceUp: false }, { suit: 'diamonds', rank: 'A', faceUp: false }, { suit: 'spades', rank: 'K', faceUp: false }, { suit: 'hearts', rank: 'Q', faceUp: false }, { suit: 'clubs', rank: 'J', faceUp: false }, { suit: 'diamonds', rank: '10', faceUp: true }],
    ]
  },
  'freecell': {
    freecells: [null, null, null, null],
    foundations: [{ suit: 'hearts', rank: 'A', faceUp: true }, null, null, null],
    columns: [
      [{ suit: 'spades', rank: 'K', faceUp: true }, { suit: 'hearts', rank: 'Q', faceUp: true }, { suit: 'clubs', rank: 'J', faceUp: true }, { suit: 'diamonds', rank: '10', faceUp: true }, { suit: 'spades', rank: '9', faceUp: true }, { suit: 'hearts', rank: '8', faceUp: true }, { suit: 'clubs', rank: '7', faceUp: true }],
      [{ suit: 'diamonds', rank: '6', faceUp: true }, { suit: 'spades', rank: '5', faceUp: true }, { suit: 'hearts', rank: '4', faceUp: true }, { suit: 'clubs', rank: '3', faceUp: true }, { suit: 'diamonds', rank: '2', faceUp: true }, { suit: 'spades', rank: 'A', faceUp: true }, { suit: 'hearts', rank: 'K', faceUp: true }],
      [{ suit: 'clubs', rank: 'Q', faceUp: true }, { suit: 'diamonds', rank: 'J', faceUp: true }, { suit: 'spades', rank: '10', faceUp: true }, { suit: 'hearts', rank: '9', faceUp: true }, { suit: 'clubs', rank: '8', faceUp: true }, { suit: 'diamonds', rank: '7', faceUp: true }, { suit: 'spades', rank: '6', faceUp: true }],
      [{ suit: 'hearts', rank: '5', faceUp: true }, { suit: 'clubs', rank: '4', faceUp: true }, { suit: 'diamonds', rank: '3', faceUp: true }, { suit: 'spades', rank: '2', faceUp: true }, { suit: 'hearts', rank: 'A', faceUp: true }, { suit: 'clubs', rank: 'K', faceUp: true }],
      [{ suit: 'diamonds', rank: 'Q', faceUp: true }, { suit: 'spades', rank: 'J', faceUp: true }, { suit: 'hearts', rank: '10', faceUp: true }, { suit: 'clubs', rank: '9', faceUp: true }, { suit: 'diamonds', rank: '8', faceUp: true }, { suit: 'spades', rank: '7', faceUp: true }],
      [{ suit: 'hearts', rank: '6', faceUp: true }, { suit: 'clubs', rank: '5', faceUp: true }, { suit: 'diamonds', rank: '4', faceUp: true }, { suit: 'spades', rank: '3', faceUp: true }, { suit: 'hearts', rank: '2', faceUp: true }, { suit: 'clubs', rank: 'A', faceUp: true }],
      [{ suit: 'diamonds', rank: 'K', faceUp: true }, { suit: 'spades', rank: 'Q', faceUp: true }, { suit: 'hearts', rank: 'J', faceUp: true }, { suit: 'clubs', rank: '10', faceUp: true }, { suit: 'diamonds', rank: '9', faceUp: true }, { suit: 'spades', rank: '8', faceUp: true }],
      [{ suit: 'hearts', rank: '7', faceUp: true }, { suit: 'clubs', rank: '6', faceUp: true }, { suit: 'diamonds', rank: '5', faceUp: true }, { suit: 'spades', rank: '4', faceUp: true }, { suit: 'hearts', rank: '3', faceUp: true }, { suit: 'clubs', rank: '2', faceUp: true }],
    ]
  },
  'pyramid': {
    pyramid: [
      [{ suit: 'spades', rank: 'A', faceUp: true }],
      [{ suit: 'hearts', rank: '2', faceUp: true }, { suit: 'clubs', rank: '3', faceUp: true }],
      [{ suit: 'diamonds', rank: '4', faceUp: true }, { suit: 'spades', rank: '5', faceUp: true }, { suit: 'hearts', rank: '6', faceUp: true }],
      [{ suit: 'clubs', rank: '7', faceUp: true }, { suit: 'diamonds', rank: '8', faceUp: true }, { suit: 'spades', rank: '9', faceUp: true }, { suit: 'hearts', rank: '10', faceUp: true }],
      [{ suit: 'clubs', rank: 'J', faceUp: true }, { suit: 'diamonds', rank: 'Q', faceUp: true }, { suit: 'spades', rank: 'K', faceUp: true }, { suit: 'hearts', rank: 'A', faceUp: true }, { suit: 'clubs', rank: '2', faceUp: true }],
      [{ suit: 'diamonds', rank: '3', faceUp: true }, { suit: 'spades', rank: '4', faceUp: true }, { suit: 'hearts', rank: '5', faceUp: true }, { suit: 'clubs', rank: '6', faceUp: true }, { suit: 'diamonds', rank: '7', faceUp: true }, { suit: 'spades', rank: '8', faceUp: true }],
      [{ suit: 'hearts', rank: '9', faceUp: true }, { suit: 'clubs', rank: '10', faceUp: true }, { suit: 'diamonds', rank: 'J', faceUp: true }, { suit: 'spades', rank: 'Q', faceUp: true }, { suit: 'hearts', rank: 'K', faceUp: true }, { suit: 'clubs', rank: 'A', faceUp: true }, { suit: 'diamonds', rank: '2', faceUp: true }],
    ],
    stock: { faceUp: false },
    waste: { suit: 'spades', rank: '3', faceUp: true }
  },
  'pyramid-alt': {
    pyramid: [
      [{ suit: 'hearts', rank: 'K', faceUp: true }],
      [{ suit: 'clubs', rank: 'Q', faceUp: true }, { suit: 'diamonds', rank: 'J', faceUp: true }],
      [{ suit: 'spades', rank: '10', faceUp: true }, { suit: 'hearts', rank: '9', faceUp: true }, { suit: 'clubs', rank: '8', faceUp: true }],
      [{ suit: 'diamonds', rank: '7', faceUp: true }, { suit: 'spades', rank: '6', faceUp: true }, { suit: 'hearts', rank: '5', faceUp: true }, { suit: 'clubs', rank: '4', faceUp: true }],
      [{ suit: 'diamonds', rank: '3', faceUp: true }, { suit: 'spades', rank: '2', faceUp: true }, { suit: 'hearts', rank: 'A', faceUp: true }, { suit: 'clubs', rank: 'K', faceUp: true }, { suit: 'diamonds', rank: 'Q', faceUp: true }],
      [{ suit: 'spades', rank: 'J', faceUp: true }, { suit: 'hearts', rank: '10', faceUp: true }, { suit: 'clubs', rank: '9', faceUp: true }, { suit: 'diamonds', rank: '8', faceUp: true }, { suit: 'spades', rank: '7', faceUp: true }, { suit: 'hearts', rank: '6', faceUp: true }],
      [{ suit: 'clubs', rank: '5', faceUp: true }, { suit: 'diamonds', rank: '4', faceUp: true }, { suit: 'spades', rank: '3', faceUp: true }, { suit: 'hearts', rank: '2', faceUp: true }, { suit: 'clubs', rank: 'A', faceUp: true }, { suit: 'diamonds', rank: 'K', faceUp: true }, { suit: 'spades', rank: 'Q', faceUp: true }],
    ],
    stock: { suit: 'hearts', rank: 'J', faceUp: true },
    waste: { suit: 'clubs', rank: '10', faceUp: true }
  },
  'tri-peaks': {
    peaks: [
      // row 1: 3 cards
      { suit: 'hearts', rank: 'A', faceUp: false }, { suit: 'clubs', rank: '2', faceUp: false }, { suit: 'diamonds', rank: '3', faceUp: false },
      // row 2: 6 cards
      { suit: 'spades', rank: '4', faceUp: false }, { suit: 'hearts', rank: '5', faceUp: false }, { suit: 'clubs', rank: '6', faceUp: false }, { suit: 'diamonds', rank: '7', faceUp: false }, { suit: 'spades', rank: '8', faceUp: false }, { suit: 'hearts', rank: '9', faceUp: false },
      // row 3: 9 cards
      { suit: 'clubs', rank: '10', faceUp: false }, { suit: 'diamonds', rank: 'J', faceUp: false }, { suit: 'spades', rank: 'Q', faceUp: false }, { suit: 'hearts', rank: 'K', faceUp: false }, { suit: 'clubs', rank: 'A', faceUp: false }, { suit: 'diamonds', rank: '2', faceUp: false }, { suit: 'spades', rank: '3', faceUp: false }, { suit: 'hearts', rank: '4', faceUp: false }, { suit: 'clubs', rank: '5', faceUp: false },
      // row 4: 10 cards
      { suit: 'diamonds', rank: '6', faceUp: true }, { suit: 'spades', rank: '7', faceUp: true }, { suit: 'hearts', rank: '8', faceUp: true }, { suit: 'clubs', rank: '9', faceUp: true }, { suit: 'diamonds', rank: '10', faceUp: true }, { suit: 'spades', rank: 'J', faceUp: true }, { suit: 'hearts', rank: 'Q', faceUp: true }, { suit: 'clubs', rank: 'K', faceUp: true }, { suit: 'diamonds', rank: 'A', faceUp: true }, { suit: 'spades', rank: '2', faceUp: true },
    ],
    stock: { faceUp: false },
    waste: { suit: 'hearts', rank: '3', faceUp: true }
  },
  'tri-peaks-alt': {
    peaks: [
      // row 1: 3 cards
      { suit: 'clubs', rank: 'K', faceUp: false }, { suit: 'diamonds', rank: 'Q', faceUp: false }, { suit: 'spades', rank: 'J', faceUp: false },
      // row 2: 6 cards
      { suit: 'hearts', rank: '10', faceUp: false }, { suit: 'clubs', rank: '9', faceUp: false }, { suit: 'diamonds', rank: '8', faceUp: false }, { suit: 'spades', rank: '7', faceUp: false }, { suit: 'hearts', rank: '6', faceUp: false }, { suit: 'clubs', rank: '5', faceUp: false },
      // row 3: 9 cards
      { suit: 'diamonds', rank: '4', faceUp: false }, { suit: 'spades', rank: '3', faceUp: false }, { suit: 'hearts', rank: '2', faceUp: false }, { suit: 'clubs', rank: 'A', faceUp: false }, { suit: 'diamonds', rank: 'K', faceUp: false }, { suit: 'spades', rank: 'Q', faceUp: false }, { suit: 'hearts', rank: 'J', faceUp: false }, { suit: 'clubs', rank: '10', faceUp: false }, { suit: 'diamonds', rank: '9', faceUp: false },
      // row 4: 10 cards
      { suit: 'spades', rank: '8', faceUp: true }, { suit: 'hearts', rank: '7', faceUp: true }, { suit: 'clubs', rank: '6', faceUp: true }, { suit: 'diamonds', rank: '5', faceUp: true }, { suit: 'spades', rank: '4', faceUp: true }, { suit: 'hearts', rank: '3', faceUp: true }, { suit: 'clubs', rank: '2', faceUp: true }, { suit: 'diamonds', rank: 'A', faceUp: true }, { suit: 'spades', rank: 'K', faceUp: true }, { suit: 'hearts', rank: 'Q', faceUp: true },
    ],
    stock: { faceUp: false },
    waste: { suit: 'clubs', rank: 'J', faceUp: true }
  }
}
