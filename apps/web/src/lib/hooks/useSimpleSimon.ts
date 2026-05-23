import { useCallback } from 'react'
import { useSimpleSimonStore } from '#/lib/stores/simple-simon'
import { draggableFromIndex } from '#/lib/games/simple-simon/rules'
import type { SimpleSimonMove } from '#/lib/games/simple-simon'

export function useSimpleSimon() {
  const store = useSimpleSimonStore()

  const onMoveCard = useCallback(
    (move: SimpleSimonMove) => {
      store.moveCard(move)
    },
    [store],
  )

  const onMoveCardForce = useCallback(
    (move: SimpleSimonMove) => {
      store.moveCardForce(move)
    },
    [store],
  )

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
    onMoveCard,
    onMoveCardForce,
    onNewGame,
    onRestartGame,
    onUndo,
    canUndo: store.past.length > 0,
  }
}
