import { describe, it, expect } from 'vitest'
import { isValidSequence, canMoveToTableau } from './rules'
import type { Card } from '#/lib/types'
import { createInitialState } from './index'

describe('Simple Simon Rules', () => {
  const sK: Card = { id: 'sK', suit: 'spades', rank: 'K', faceUp: true }
  const sQ: Card = { id: 'sQ', suit: 'spades', rank: 'Q', faceUp: true }
  const hQ: Card = { id: 'hQ', suit: 'hearts', rank: 'Q', faceUp: true }
  const sJ: Card = { id: 'sJ', suit: 'spades', rank: 'J', faceUp: true }
  const sA: Card = { id: 'sA', suit: 'spades', rank: 'A', faceUp: true }

  describe('isValidSequence', () => {
    it('should return true for single card', () => {
      expect(isValidSequence([sK])).toBe(true)
    })

    it('should return true for descending same suit sequence', () => {
      expect(isValidSequence([sK, sQ, sJ])).toBe(true)
    })

    it('should return false for descending different suit sequence', () => {
      expect(isValidSequence([sK, hQ])).toBe(false)
    })

    it('should return false for non-descending sequence', () => {
      expect(isValidSequence([sQ, sK])).toBe(false)
    })
  })

  describe('canMoveToTableau', () => {
    it('should allow moving to empty column', () => {
      const state = createInitialState(1)
      state.tableau['tableau-0'] = []
      const fromPile = state.tableau['tableau-1']
      const lastIndex = fromPile.length - 1
      expect(canMoveToTableau(state, 'tableau-1', lastIndex, 'tableau-0')).toBe(
        true,
      )
    })

    it('should allow building down regardless of suit', () => {
      const state = createInitialState(1)
      state.tableau['tableau-0'] = [sK]
      state.tableau['tableau-1'] = [hQ]
      expect(canMoveToTableau(state, 'tableau-1', 0, 'tableau-0')).toBe(true)
    })

    it('should NOT allow building on Ace', () => {
      const state = createInitialState(1)
      state.tableau['tableau-0'] = [sA]
      state.tableau['tableau-1'] = [
        { id: 's2', suit: 'spades', rank: '2', faceUp: true },
      ]
      expect(canMoveToTableau(state, 'tableau-1', 0, 'tableau-0')).toBe(false)
    })
  })
})
