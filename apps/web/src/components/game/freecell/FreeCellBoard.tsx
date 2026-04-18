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
import FreeCellTopRow from './FreeCellTopRow'
import FreeCellTableau from './FreeCellTableau'
import FreeCellCard from './FreeCellCard'
import { ConfirmModal } from '#/components/ConfirmModal'
import { useFreeCell } from '#/lib/hooks/useFreeCell'
import type {
  FreeCellPileId,
  DraggableCardData,
  DroppableZoneData,
} from '#/lib/games/freecell'
import type { Card } from '#/lib/types'

const OVERLAY_CARD_OFFSET = 36
const CARD_HEIGHT = 112

interface FreeCellBoardProps {
  onHowToPlay: () => void
}

export default function FreeCellBoard({ onHowToPlay }: FreeCellBoardProps) {
  const {
    tableau,
    freeCells,
    foundation,
    draggableFromIndex,
    score,
    moveCount,
    status,
    canUndo,
    onMoveCard,
    onMoveCardForce,
    onAutoMove,
    onNewGame,
    onRestartGame,
    onUndo,
  } = useFreeCell()

  const [draggedCards, setDraggedCards] = useState<Card[] | null>(null)
  const lastDropWasValid = useRef(false)
  const [devStatus, setDevStatus] = useState<'won' | null>(null)
  const [devUnlimitedMoves, setDevUnlimitedMoves] = useState(false)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [confirmNewGame, setConfirmNewGame] = useState(false)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
  )

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as DraggableCardData | undefined
    if (data?.type === 'card') {
      setDraggedCards(data.cards)
    }
    lastDropWasValid.current = false
  }

  function handleDragEnd(event: DragEndEvent) {
    const activeData = event.active.data.current as
      | DraggableCardData
      | undefined
    const overData = event.over?.data.current as DroppableZoneData | undefined

    if (activeData?.type === 'card' && overData?.type === 'pile') {
      lastDropWasValid.current = true
      const move = {
        fromPileId: activeData.fromPileId,
        fromIndex: activeData.fromIndex,
        toPileId: overData.pileId,
      }
      if (devUnlimitedMoves) {
        onMoveCardForce(move)
      } else {
        onMoveCard(move)
      }
    } else {
      lastDropWasValid.current = false
    }

    setDraggedCards(null)
  }

  function handleFreeCellDoubleClick(pileId: FreeCellPileId) {
    onAutoMove(pileId)
  }

  function handleTableauDoubleClick(pileId: FreeCellPileId) {
    onAutoMove(pileId)
  }

  const effectiveStatus = devStatus ?? status
  const isGameOver = effectiveStatus === 'won'

  const dropAnimation = lastDropWasValid.current
    ? null
    : {
        duration: 300,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }

  const overlayHeight =
    draggedCards && draggedCards.length > 1
      ? (draggedCards.length - 1) * OVERLAY_CARD_OFFSET + CARD_HEIGHT
      : CARD_HEIGHT

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col">
        {/* Score + move count */}
        <div className="flex items-center justify-center gap-5 mb-6">
          <div className="flex min-w-20 flex-col items-center rounded-2xl bg-muted/50 px-6 py-3">
            <span className="text-xs font-medium text-muted-foreground">
              Score
            </span>
            <span className="text-xl font-bold tabular-nums text-primary">
              {score}
            </span>
          </div>
          <div className="flex min-w-20 flex-col items-center rounded-2xl bg-muted/50 px-6 py-3">
            <span className="text-xs font-medium text-muted-foreground">
              Moves
            </span>
            <span className="text-xl font-bold tabular-nums">{moveCount}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-row justify-center px-3 gap-7 mb-10">
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

        {/* Board — dimmed when won */}
        <div className={cn('flex flex-col gap-3', isGameOver && 'opacity-50')}>
          <FreeCellTopRow
            freeCells={freeCells}
            foundation={foundation}
            onFreeCellDoubleClick={handleFreeCellDoubleClick}
          />
          <FreeCellTableau
            tableau={tableau}
            draggableFromIndex={draggableFromIndex}
            devUnlimitedMoves={devUnlimitedMoves}
            onDoubleClick={handleTableauDoubleClick}
          />
        </div>

        {/* Dev-only toggles */}
        {import.meta.env.DEV && (
          <div className="mt-12 flex flex-col items-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-8">
            <span className="text-xs font-bold text-slate-100 dark:text-slate-400 uppercase tracking-wider">
              Dev Tools
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDevStatus(devStatus === 'won' ? null : 'won')}
                className="cursor-pointer rounded px-2 py-1 text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
              >
                {devStatus === 'won' ? 'Hide Victory' : 'Show Victory'}
              </button>
              <button
                type="button"
                onClick={() => setDevUnlimitedMoves((v) => !v)}
                className={cn(
                  'cursor-pointer rounded px-2 py-1 text-xs font-medium',
                  devUnlimitedMoves
                    ? 'bg-blue-200 text-blue-900 hover:bg-blue-300 dark:bg-blue-800/50 dark:text-blue-300'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
                )}
              >
                {devUnlimitedMoves
                  ? 'Unlimited Moves ON'
                  : 'Unlimited Moves OFF'}
              </button>
            </div>
          </div>
        )}

        {/* Victory message */}
        {isGameOver && (
          <div className="flex flex-col items-center gap-3 py-2">
            <p className="rounded px-3 py-1.5 text-xl font-black tracking-wide bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              VICTORY
            </p>
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
          <div
            className="relative"
            style={{ height: overlayHeight, width: 80 }}
          >
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
                <FreeCellCard card={card} />
              </div>
            ))}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
