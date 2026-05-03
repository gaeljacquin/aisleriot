import { useEffect, useRef, useState } from 'react'
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
import { GameControls } from '../index'
import { ConfirmModal } from '#/components/ConfirmModal'
import { useFreeCell } from '#/lib/hooks/useFreeCell'
import type {
  FreeCellPileId,
  DraggableCardData,
  DroppableZoneData,
} from '#/lib/games/freecell'
import type { Card } from '#/lib/types'

const OVERLAY_CARD_OFFSET = 48
const CARD_HEIGHT = 160

interface FreeCellBoardProps {
  onHowToPlay: () => void
}

export default function FreeCellBoard({
  onHowToPlay: _onHowToPlay,
}: FreeCellBoardProps) {
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
    isAutoMoving,
    triggerAutoMove,
  } = useFreeCell()

  // Handle animated automoves
  useEffect(() => {
    if (isAutoMoving && status === 'playing') {
      const timer = setTimeout(() => {
        triggerAutoMove()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isAutoMoving, triggerAutoMove, status])

  const [draggedCards, setDraggedCards] = useState<Card[] | null>(null)
  const lastDropWasValid = useRef(false)
  const [devStatus, setDevStatus] = useState<'won' | null>(null)
  const [devUnlimitedMoves, setDevUnlimitedMoves] = useState(false)
  const [showDevTools, setShowDevTools] = useState(false)
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
      <div className="flex flex-1 flex-col min-h-0">
        {/* Board — dimmed when won */}
        <div className={cn('flex flex-col gap-6', isGameOver && 'opacity-50')}>
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

        {/* Spacer to push controls to the bottom */}
        <div className="flex-1" />

        {/* Action buttons + Stats */}
        <GameControls
          onUndo={onUndo}
          canUndo={canUndo}
          onHowToPlay={_onHowToPlay}
          onRestart={() => setConfirmRestart(true)}
          onNewGame={() => setConfirmNewGame(true)}
          isGameOver={isGameOver}
          showDevTools={showDevTools}
          onToggleDevTools={() => setShowDevTools(!showDevTools)}
          score={score}
          moveCount={moveCount}
          variantName="FreeCell"
          devMoveAnywhere={devUnlimitedMoves}
          onToggleMoveAnywhere={() => setDevUnlimitedMoves((v) => !v)}
          devPeekTableau={devStatus === 'won'}
          onTogglePeekTableau={() =>
            setDevStatus(devStatus === 'won' ? null : 'won')
          }
        />

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
            style={{ height: overlayHeight, width: 112 }}
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
