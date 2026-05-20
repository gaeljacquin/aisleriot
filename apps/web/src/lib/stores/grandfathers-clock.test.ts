import { describe, it, expect, beforeEach } from 'vitest'
import { useGrandfathersClockStore } from './grandfathers-clock'

describe('Grandfathers Clock Store Undo', () => {
  beforeEach(() => {
    useGrandfathersClockStore.getState().newGame(123)
  })

  it('should be able to undo a move', () => {
    const store = useGrandfathersClockStore.getState()

    // 1. Initial state
    expect(store.moveCount).toBe(0)
    expect(store.canUndo).toBe(false)

    // 2. Find a valid move
    // We'll look for a card that can move to foundation or tableau
    let moveFound = false
    let moveParams: any = null

    for (const fromId of Object.keys(store.tableau)) {
      const fromPile = store.tableau[fromId]
      if (fromPile.length === 0) continue
      const card = fromPile[fromPile.length - 1]

      // Try foundations
      for (const toId of Object.keys(store.foundation)) {
        const toPile = store.foundation[toId]
        const topCard = toPile[toPile.length - 1]

        // isValidFoundationMove logic: same suit, build up wrap
        const topRankVal = (r: string) => {
          if (r === 'A') return 1
          if (r === 'J') return 11
          if (r === 'Q') return 12
          if (r === 'K') return 13
          return parseInt(r)
        }

        const trv = topRankVal(topCard.rank)
        const nextRankVal = trv === 13 ? 1 : trv + 1

        if (
          card.suit === topCard.suit &&
          topRankVal(card.rank) === nextRankVal
        ) {
          moveFound = true
          moveParams = {
            fromPileId: fromId,
            fromIndex: fromPile.length - 1,
            toPileId: toId,
          }
          break
        }
      }
      if (moveFound) break
    }

    if (!moveFound) {
      // If no foundation move, try tableau move
      for (const fromId of Object.keys(store.tableau)) {
        const fromPile = store.tableau[fromId]
        if (fromPile.length === 0) continue
        const card = fromPile[fromPile.length - 1]

        for (const toId of Object.keys(store.tableau)) {
          if (fromId === toId) continue
          const toPile = store.tableau[toId]
          if (toPile.length === 0) {
            moveFound = true
            moveParams = {
              fromPileId: fromId,
              fromIndex: fromPile.length - 1,
              toPileId: toId,
            }
            break
          }

          const topCard = toPile[toPile.length - 1]
          // isValidTableauMove logic: build down regardless of suit, wrap A to K
          const topRankVal = (r: string) => {
            if (r === 'A') return 1
            if (r === 'J') return 11
            if (r === 'Q') return 12
            if (r === 'K') return 13
            return parseInt(r)
          }
          const trv = topRankVal(topCard.rank)
          const nextRankVal = trv === 1 ? 13 : trv - 1

          if (topRankVal(card.rank) === nextRankVal) {
            moveFound = true
            moveParams = {
              fromPileId: fromId,
              fromIndex: fromPile.length - 1,
              toPileId: toId,
            }
            break
          }
        }
        if (moveFound) break
      }
    }

    expect(moveFound).toBe(true)

    // 3. Perform move
    useGrandfathersClockStore.getState().moveCard(moveParams)

    const afterMove = useGrandfathersClockStore.getState()
    expect(afterMove.moveCount).toBe(1)
    expect(afterMove.canUndo).toBe(true)

    // 4. Undo
    useGrandfathersClockStore.getState().undo()

    const afterUndo = useGrandfathersClockStore.getState()
    expect(afterUndo.moveCount).toBe(0)
    expect(afterUndo.canUndo).toBe(false)
    expect(afterUndo.tableau).toEqual(store.tableau)
    expect(afterUndo.foundation).toEqual(store.foundation)
  })
})
