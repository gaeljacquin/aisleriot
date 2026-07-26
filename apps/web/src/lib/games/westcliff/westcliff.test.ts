import { describe, it, expect, beforeEach } from 'vitest'
import {
  createInitialState,
  canMoveToTableau,
  canMoveToFoundation,
  canRedeal,
  isValidTableauSequence,
  isGameWon,
} from './index'
import type { Card } from '#/lib/types'
import { useWestcliffStore } from '#/lib/stores/westcliff'

describe('Westcliff Solitaire Rules Engine', () => {
  it('creates valid initial state for Westcliff deal', () => {
    const state = createInitialState(12345)

    // 10 tableau columns
    const tableauKeys = Object.keys(state.tableau)
    expect(tableauKeys.length).toBe(10)

    let totalTableauCards = 0
    for (const key of tableauKeys) {
      const col = state.tableau[key as keyof typeof state.tableau]
      expect(col.length).toBe(3)
      expect(col[0].faceUp).toBe(false)
      expect(col[1].faceUp).toBe(false)
      expect(col[2].faceUp).toBe(true)
      totalTableauCards += col.length
    }
    expect(totalTableauCards).toBe(30)

    // Stock has 22 cards (52 - 30 = 22)
    expect(state.stock.length).toBe(22)
    expect(state.stock.every((c) => !c.faceUp)).toBe(true)

    // Waste is empty
    expect(state.waste.length).toBe(0)

    // 4 Foundations are empty
    expect(Object.keys(state.foundation).length).toBe(4)
    for (const fKey of Object.keys(state.foundation)) {
      expect(state.foundation[fKey as keyof typeof state.foundation].length).toBe(0)
    }
  })

  it('validates tableau sequence correctly', () => {
    const card1: Card = { id: '1', suit: 'hearts', rank: '10', faceUp: true }
    const card2: Card = { id: '2', suit: 'clubs', rank: '9', faceUp: true }
    const card3: Card = { id: '3', suit: 'diamonds', rank: '8', faceUp: true }

    expect(isValidTableauSequence([card1, card2, card3])).toBe(true)

    // Same color
    const sameColorCard: Card = { id: '4', suit: 'diamonds', rank: '9', faceUp: true }
    expect(isValidTableauSequence([card1, sameColorCard])).toBe(false)

    // Non-consecutive rank
    const nonConsecutiveCard: Card = { id: '5', suit: 'spades', rank: '7', faceUp: true }
    expect(isValidTableauSequence([card1, nonConsecutiveCard])).toBe(false)

    // Face-down card
    const faceDownCard: Card = { id: '6', suit: 'clubs', rank: '9', faceUp: false }
    expect(isValidTableauSequence([card1, faceDownCard])).toBe(false)
  })

  it('allows ANY card or sequence to fill an empty tableau space in Westcliff', () => {
    const state = createInitialState(12345)
    // Make tableau-0 empty
    state.tableau['tableau-0'] = []
    // Place a 5 of Spades on waste
    state.waste = [{ id: 'waste-card', suit: 'spades', rank: '5', faceUp: true }]

    // Moving 5 of Spades to empty tableau column should be VALID in Westcliff
    const canMove = canMoveToTableau(state, 'waste', 0, 'tableau-0')
    expect(canMove).toBe(true)
  })

  it('validates standard building down on occupied tableau columns', () => {
    const state = createInitialState(12345)
    state.tableau['tableau-0'] = [
      { id: '1', suit: 'spades', rank: 'K', faceUp: false },
      { id: '2', suit: 'spades', rank: 'Q', faceUp: false },
      { id: '3', suit: 'hearts', rank: '10', faceUp: true },
    ]
    state.waste = [{ id: 'w1', suit: 'clubs', rank: '9', faceUp: true }]

    // Black 9 onto Red 10 -> Valid
    expect(canMoveToTableau(state, 'waste', 0, 'tableau-0')).toBe(true)

    // Red 9 onto Red 10 -> Invalid (same color)
    state.waste = [{ id: 'w2', suit: 'diamonds', rank: '9', faceUp: true }]
    expect(canMoveToTableau(state, 'waste', 0, 'tableau-0')).toBe(false)
  })

  it('validates moving Ace to foundation and building up in suit', () => {
    const state = createInitialState(12345)
    state.waste = [{ id: 'w1', suit: 'hearts', rank: 'A', faceUp: true }]

    // Move Ace of Hearts to empty foundation-hearts
    expect(canMoveToFoundation(state, 'waste', 0)).toBe(true)

    // Build 2 of Hearts on Ace of Hearts foundation
    state.foundation['foundation-hearts'] = [{ id: 'w1', suit: 'hearts', rank: 'A', faceUp: true }]
    state.waste = [{ id: 'w2', suit: 'hearts', rank: '2', faceUp: true }]
    expect(canMoveToFoundation(state, 'waste', 0)).toBe(true)

    // 3 of Hearts on Ace of Hearts foundation -> Invalid
    state.waste = [{ id: 'w3', suit: 'hearts', rank: '3', faceUp: true }]
    expect(canMoveToFoundation(state, 'waste', 0)).toBe(false)
  })

  it('does not allow redeals', () => {
    const state = createInitialState(12345)
    expect(canRedeal(state)).toBe(false)
  })

  it('detects game win when all foundations are complete', () => {
    const state = createInitialState(12345)
    expect(isGameWon(state)).toBe(false)

    const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const

    for (const suit of suits) {
      state.foundation[`foundation-${suit}`] = ranks.map((rank) => ({
        id: `${suit}-${rank}`,
        suit,
        rank,
        faceUp: true,
      }))
    }

    expect(isGameWon(state)).toBe(true)
  })
})

describe('Westcliff Zustand Store', () => {
  beforeEach(() => {
    useWestcliffStore.getState().newGame(999)
  })

  it('flips cards from stock to waste', () => {
    const store = useWestcliffStore.getState()
    const initialStockLen = store.stock.length
    expect(initialStockLen).toBe(22)
    expect(store.waste.length).toBe(0)

    store.flipStock()

    const updatedStore = useWestcliffStore.getState()
    expect(updatedStore.stock.length).toBe(21)
    expect(updatedStore.waste.length).toBe(1)
    expect(updatedStore.waste[0].faceUp).toBe(true)
  })

  it('handles card moves and auto-flips exposed face-down tableau cards', () => {
    // Manually setup store state for predictable test
    useWestcliffStore.setState({
      tableau: {
        'tableau-0': [
          { id: 't0-1', suit: 'spades', rank: 'K', faceUp: false },
          { id: 't0-2', suit: 'hearts', rank: 'Q', faceUp: true },
        ],
        'tableau-1': [],
        'tableau-2': [],
        'tableau-3': [],
        'tableau-4': [],
        'tableau-5': [],
        'tableau-6': [],
        'tableau-7': [],
        'tableau-8': [],
        'tableau-9': [],
      },
      status: 'playing',
    })

    // Move Q of Hearts to empty tableau-1 space
    useWestcliffStore.getState().moveCard({
      fromPile: 'tableau-0',
      fromIndex: 1,
      toPile: 'tableau-1',
    })

    const afterMove = useWestcliffStore.getState()
    // Q of Hearts moved to tableau-1
    expect(afterMove.tableau['tableau-1'].length).toBe(1)
    expect(afterMove.tableau['tableau-1'][0].rank).toBe('Q')

    // Top card of tableau-0 was face-down K of Spades, should be auto-flipped to face-up!
    expect(afterMove.tableau['tableau-0'].length).toBe(1)
    expect(afterMove.tableau['tableau-0'][0].faceUp).toBe(true)
  })
})
