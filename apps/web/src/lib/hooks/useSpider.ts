import { useCallback } from 'react'
import { useSpiderStore } from '#/lib/stores/spider'
import { draggableFromIndex, canDealStock } from '#/lib/games/spider/rules'
import type { SpiderMove } from '#/lib/games/spider'

export function useSpider() {
  const store = useSpiderStore()

  const onMoveCard = useCallback(
    (move: SpiderMove) => {
      store.moveCard(move)
    },
    [store],
  )

  const onMoveCardForce = useCallback(
    (move: SpiderMove) => {
      store.moveCardForce(move)
    },
    [store],
  )

  const onDealStock = useCallback(() => {
    return store.dealStock()
  }, [store])

  const onNewGame = useCallback(
    (seed?: number) => {
      store.newGame(seed)
    },
    [store],
  )

  const onRestartGame = useCallback(() => {
    store.restartGame()
  }, [store])

  const onUndo = useCallback(() => {
    store.undo()
  }, [store])

  return {
    ...store,
    draggableFromIndex: (pileId: string) => draggableFromIndex(store, pileId),
    canDealStock: canDealStock(store),
    onMoveCard,
    onMoveCardForce,
    onDealStock,
    onNewGame,
    onRestartGame,
    onUndo,
    canUndo: store.past.length > 0,
  }
}
