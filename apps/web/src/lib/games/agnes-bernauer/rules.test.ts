import { describe, it, expect } from 'vitest'
import { getFoundationTargetId, canMoveToFoundation } from './rules'
import type { AgnesBernauerState } from './types'
import type { Card } from '#/lib/types'

describe('Agnes Bernauer Rules', () => {
  const createBaseState = (): AgnesBernauerState => ({
    tableau: {
      'tableau-0': [],
      'tableau-1': [],
      'tableau-2': [],
      'tableau-3': [],
      'tableau-4': [],
      'tableau-5': [],
      'tableau-6': [],
    },
    foundation: {
      'foundation-0': [],
      'foundation-1': [],
      'foundation-2': [],
      'foundation-3': [],
    },
    foundationSuits: {
      'foundation-0': 'hearts',
      'foundation-1': 'diamonds',
      'foundation-2': 'clubs',
      'foundation-3': 'spades',
    },
    reserve: {
      'reserve-0': [],
      'reserve-1': [],
      'reserve-2': [],
      'reserve-3': [],
      'reserve-4': [],
      'reserve-5': [],
      'reserve-6': [],
    },
    stock: [],
    baseRank: '7',
    score: 0,
    moveCount: 0,
    status: 'playing',
    usedUndo: false,
    currentSeed: 123,
  })

  it('should move base rank card to its matching suit foundation', () => {
    const state = createBaseState()
    const card: Card = {
      id: 'spades-7',
      suit: 'spades',
      rank: '7',
      faceUp: true,
    }

    // It SHOULD return 'foundation-3' because foundationSuits['foundation-3'] === 'spades'
    expect(getFoundationTargetId(state, card)).toBe('foundation-3')
  })

  it('should move base rank card to correct foundation even if others are empty', () => {
    const state = createBaseState()
    const card: Card = { id: 'clubs-7', suit: 'clubs', rank: '7', faceUp: true }
    expect(getFoundationTargetId(state, card)).toBe('foundation-2')
  })

  describe('canMoveToFoundation', () => {
    it('should return true only for the correct foundation suit when empty', () => {
      const state = createBaseState()
      // tableau-0 has the spades-7
      state.tableau['tableau-0'] = [
        { id: 'spades-7', suit: 'spades', rank: '7', faceUp: true },
      ]

      expect(canMoveToFoundation(state, 'tableau-0', 0)).toBe(true)
    })

    it('should return false if the base rank card is moved but its designated foundation is already occupied by another suit (should not happen in real game, but testing logic)', () => {
      const state = createBaseState()
      // Occupy foundation-3 (spades) with something else (invalid state but tests the check)
      state.foundation['foundation-3'] = [
        { id: 'hearts-7', suit: 'hearts', rank: '7', faceUp: true },
      ]
      state.tableau['tableau-0'] = [
        { id: 'spades-7', suit: 'spades', rank: '7', faceUp: true },
      ]

      // Since foundation-3 is occupied and it's the only one for spades, it should return false
      expect(canMoveToFoundation(state, 'tableau-0', 0)).toBe(false)
    })
  })
})
