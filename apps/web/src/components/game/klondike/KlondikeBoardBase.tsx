import { useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import KlondikeColumn from './KlondikeColumn'
import KlondikeFoundation from './KlondikeFoundation'
import KlondikeWaste from './KlondikeWaste'
import KlondikeStock from './KlondikeStock'
import Card from '../Card'
import { ConfirmModal } from '#/components/ConfirmModal'
import type { UseKlondikeResult } from '#/lib/hooks/useKlondikeDrawOne'
import type { DraggableCardData, DroppableZoneData } from '#/lib/games/klondike'
import type { Card as CardType } from '#/lib/types'

const OVERLAY_CARD_OFFSET = 28
const CARD_HEIGHT = 112

interface KlondikeBoardBaseProps {
  useGame: () => UseKlondikeResult
  onHowToPlay: () => void
}

export default function KlondikeBoardBase({ useGame, onHowToPlay }: KlondikeBoardBaseProps) {
  const {
    tableau,
    foundation,
    waste,
    stockCount,
    stockEmpty,
    canRedeal,
    redealsLeft,
    drawCount,
    draggableFromIndex,
    score,
    moveCount,
    status,
    canUndo,
    onMoveCard,
    onMoveCardForce,
    onAutoMove,
    onFlipStock,
    onNewGame,
    onRestartGame,
    onUndo,
  } = useGame()

  const [draggedCards, setDraggedCards] = useState<CardType[] | null>(null)
  const lastDropWasValid = useRef(false)
  const [devMoveAnywhere, setDevMoveAnywhere] = useState(false)
  const [devPeekTableau, setDevPeekTableau] = useState(false)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [confirmNewGame, setConfirmNewGame] = useState(false)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as DraggableCardData | undefined
    if (data?.type === 'card') {
      setDraggedCards(data.cards)
    }
    lastDropWasValid.current = false
  }

  function handleDragEnd(event: DragEndEvent) {
    const activeData = event.active.data.current as DraggableCardData | undefined
    const overData = event.over?.data.current as DroppableZoneData | undefined

    if (activeData?.type === 'card' && overData?.type === 'pile') {
      lastDropWasValid.current = true
      const move = {
        fromPile: activeData.pileId,
        fromIndex: activeData.fromIndex,
        toPile: overData.pileId,
      }
      if (devMoveAnywhere) {
        onMoveCardForce(move)
      } else {
        onMoveCard(move)
      }
    } else {
      lastDropWasValid.current = false
    }

    setDraggedCards(null)
  }

  const isGameOver = status === 'won'

  const dropAnimation = lastDropWasValid.current
    ? null
    : { duration: 300, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }

  const overlayHeight =
    draggedCards && draggedCards.length > 1
      ? (draggedCards.length - 1) * OVERLAY_CARD_OFFSET + CARD_HEIGHT
      : CARD_HEIGHT

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4">
        {/* Score + moves HUD */}
        <div className="flex items-center justify-center gap-5">
          <div className="flex min-w-20 flex-col items-center rounded-2xl bg-muted/50 px-6 py-3">
            <span className="text-xs font-medium text-black dark:text-muted-foreground">Score</span>
            <span className="text-xl font-bold tabular-nums text-green-900 dark:text-green-500">{score}</span>
          </div>
          <div className="flex min-w-20 flex-col items-center rounded-2xl bg-muted/50 px-6 py-3">
            <span className="text-xs font-medium text-black dark:text-muted-foreground">Moves</span>
            <span className="text-xl font-bold tabular-nums text-black dark:text-foreground">{moveCount}</span>
          </div>
          {redealsLeft !== null && (
            <div className="flex min-w-20 flex-col items-center rounded-2xl bg-muted/50 px-6 py-3">
              <span className="text-xs font-medium text-black dark:text-muted-foreground">Recycles</span>
              <span className="text-xl font-bold tabular-nums text-black dark:text-foreground">{redealsLeft}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-row justify-center px-3 gap-7">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={cn(
              'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              !canUndo && 'cursor-not-allowed opacity-40',
            )}
          >
            Undo
          </button>
          <button
            type="button"
            onClick={onHowToPlay}
            className="cursor-pointer rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            How to Play
          </button>
          <button
            type="button"
            onClick={() => setConfirmRestart(true)}
            className="cursor-pointer rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            Restart
          </button>
          <button
            type="button"
            onClick={() => setConfirmNewGame(true)}
            className={cn(
              'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              isGameOver
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            )}
          >
            New Game
          </button>
        </div>

        {/* Dev toggles */}
        {import.meta.env.DEV && (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setDevMoveAnywhere((v) => !v)}
              className={cn(
                'cursor-pointer rounded px-2 py-1 text-xs font-medium',
                devMoveAnywhere
                  ? 'bg-blue-200 text-blue-900 hover:bg-blue-300 dark:bg-blue-800/50 dark:text-blue-300'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
              )}
            >
              {devMoveAnywhere ? 'Move Anywhere ON' : 'Move Anywhere OFF'} (Dev)
            </button>
            <button
              type="button"
              onClick={() => setDevPeekTableau((v) => !v)}
              className={cn(
                'cursor-pointer rounded px-2 py-1 text-xs font-medium',
                devPeekTableau
                  ? 'bg-amber-200 text-amber-900 hover:bg-amber-300 dark:bg-amber-800/50 dark:text-amber-300'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
              )}
            >
              {devPeekTableau ? 'Peek Tableau ON' : 'Peek Tableau OFF'} (Dev)
            </button>
          </div>
        )}

        {/* Board */}
        <div className={cn('flex flex-col gap-3', isGameOver && 'opacity-50')}>
          {/* Top row: stock + waste | buttons (centered) | foundations */}
          <div className="flex items-center justify-between gap-2">
            {/* Stock + Waste */}
            <div className="flex shrink-0 items-start gap-2">
              <KlondikeStock
                stockCount={stockCount}
                stockEmpty={stockEmpty}
                canRedeal={canRedeal}
                onClick={onFlipStock}
              />
              <KlondikeWaste
                waste={waste}
                drawCount={drawCount}
                moveAnywhere={devMoveAnywhere}
                onDoubleClick={() => onAutoMove('waste')}
              />
            </div>

            {/* Foundations — floated right */}
            <div className="flex shrink-0 items-start gap-2">
              {foundation.map((f) => (
                <KlondikeFoundation
                  key={f.id}
                  id={f.id}
                  cards={f.cards}
                  suit={f.suit}
                  draggable={true}
                />
              ))}
            </div>
          </div>

          {/* Tableau */}
          <div className="flex gap-2">
            {tableau.map((col) => (
              <KlondikeColumn
                key={col.id}
                id={col.id}
                cards={col.cards}
                draggableFrom={devMoveAnywhere ? Math.max(0, col.cards.findIndex((c) => c.faceUp)) : draggableFromIndex[col.id]}
                peekTableau={devPeekTableau}
                onDoubleClick={(pileId) => onAutoMove(pileId)}
              />
            ))}
          </div>
        </div>

        {/* Victory message */}
        {isGameOver && (
          <div className="flex flex-col items-center gap-3 py-2">
            <p className="rounded px-3 py-1.5 text-xl font-black tracking-wide bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">VICTORY</p>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmRestart}
        onOpenChange={setConfirmRestart}
        title="Restart Game?"
        description="Replay the same deal from the beginning."
        confirmLabel="Restart"
        onConfirm={onRestartGame}
      />
      <ConfirmModal
        open={confirmNewGame}
        onOpenChange={setConfirmNewGame}
        title="New Game?"
        description="Start a fresh game with a new deal."
        confirmLabel="New Game"
        onConfirm={onNewGame}
      />

      {/* Drag overlay */}
      <DragOverlay dropAnimation={dropAnimation}>
        {draggedCards && draggedCards.length > 0 && (
          <div className="relative" style={{ height: overlayHeight, width: 80 }}>
            {draggedCards.map((card, i) => (
              <div
                key={card.id}
                style={{
                  position: i === 0 ? 'relative' : 'absolute',
                  top: i === 0 ? 0 : i * OVERLAY_CARD_OFFSET,
                  left: 0,
                  zIndex: i,
                }}
              >
                <Card suit={card.suit} rank={card.rank} faceUp={card.faceUp} />
              </div>
            ))}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
