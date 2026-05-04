import { useEffect, useRef, useState, useMemo } from 'react'
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
import { TopBar } from '@/components/layout/TopBar'
import { ActionRail } from '@/components/layout/ActionRail'
import { ConfirmModal } from '#/components/ConfirmModal'
import { useFreeCell } from '#/lib/hooks/useFreeCell'
import { getVariant } from '@workspace/constants'
import type {
  FreeCellPileId,
  DraggableCardData,
  DroppableZoneData,
} from '#/lib/games/freecell'
import type { Card as CardType } from '#/lib/types'
import {
  PlusSignIcon,
  UndoIcon,
  Refresh04Icon,
  BookOpen01Icon,
  TouchIcon,
  ChampionIcon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'

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
    isAutoMoving,
    triggerAutoMove,
    devSetStatus,
  } = useFreeCell()

  const variant = getVariant('freecell')

  // Handle animated automoves
  useEffect(() => {
    if (isAutoMoving && status === 'playing') {
      const timer = setTimeout(() => {
        triggerAutoMove()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isAutoMoving, triggerAutoMove, status])

  const [draggedCards, setDraggedCards] = useState<CardType[] | null>(null)
  const lastDropWasValid = useRef(false)
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

  const isGameOver = status === 'won'

  const dropAnimation = lastDropWasValid.current
    ? null
    : {
        duration: 300,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }

  const stats = useMemo(
    () => [
      { label: 'Score', value: score },
      { label: 'Moves', value: moveCount },
    ],
    [score, moveCount],
  )

  const actions = [
    {
      icon: PlusSignIcon,
      label: 'New',
      onClick: () => setConfirmNewGame(true),
    },
    {
      icon: UndoIcon,
      label: 'Undo',
      onClick: onUndo,
      disabled: !canUndo || isGameOver,
    },
    {
      icon: Refresh04Icon,
      label: 'Reset',
      onClick: () => setConfirmRestart(true),
    },
    { icon: BookOpen01Icon, label: 'How to Play', onClick: onHowToPlay },
  ]

  const devActions = [
    {
      icon: TouchIcon,
      label: 'Moves',
      onClick: () => setDevUnlimitedMoves(!devUnlimitedMoves),
      active: devUnlimitedMoves,
    },
    {
      icon: ChampionIcon,
      label: 'Win',
      onClick: () => devSetStatus(status === 'won' ? 'playing' : 'won'),
      active: status === 'won',
    },
    {
      icon: Cancel01Icon,
      label: 'Lose',
      onClick: () => devSetStatus(status === 'lost' ? 'playing' : 'lost'),
      active: status === 'lost',
    },
  ]

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full freecell-container">
        <style>{`
          .freecell-container {
            /* Default for extra large screens (> 1536px) */
            --card-width: 7.5rem;
            --card-height: 10.7rem;
            --card-gap-free: 1.25rem;
            --card-offset-free: 3rem;
            --rail-gap: 2rem;
            --row-gap: 4rem;
          }

          @media (max-width: 1536px) {
            .freecell-container {
              --card-width: clamp(5rem, 9.5vw, 7rem);
              --card-height: calc(var(--card-width) * 1.428);
              --card-gap-free: 1.25vw;
              --card-offset-free: 4vw;
              --rail-gap: 2.5vw;
              --row-gap: 4vw;
            }
          }

          @media (max-width: 640px) {
            .freecell-container {
              --card-width: clamp(4rem, 11vw, 5rem);
              --card-height: calc(var(--card-width) * 1.428);
              --card-gap-free: 1vw;
              --card-offset-free: 5vw;
              --rail-gap: 2vw;
              --row-gap: 3vw;
            }
          }
        `}</style>

        <div className="flex h-full flex-col">
          <TopBar
            title={variant.name}
            subtitle={variant.subtitle}
            stats={stats}
            status={status}
            className="mb-8 px-6 pt-6 sm:px-8 sm:pt-8"
          />

          {/* Board Container */}
          <div className="flex-1 overflow-auto felt-scroll px-4 sm:px-8 py-4 sm:py-8">
            <div
              className={cn(
                'mx-auto w-full lg:w-fit flex flex-col items-center',
                isGameOver && 'opacity-50',
              )}
              style={{ gap: 'var(--row-gap)' }}
            >
              {/* Top Row */}
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
          </div>

          {/* Bottom Action Rail - pinned to bottom */}
          <div className="flex w-full justify-center pb-6 pt-2">
            <ActionRail
              actions={actions}
              devActions={devActions}
              className="max-w-fit"
            />
          </div>
        </div>

        <ConfirmModal
          open={confirmRestart}
          onOpenChange={setConfirmRestart}
          onConfirm={() => {
            onRestartGame()
            setConfirmRestart(false)
          }}
          title="Restart Game?"
          description="Are you sure you want to restart this game? All progress will be lost."
          confirmLabel="Restart"
        />

        <ConfirmModal
          open={confirmNewGame}
          onOpenChange={setConfirmNewGame}
          onConfirm={() => {
            onNewGame()
            setConfirmNewGame(false)
          }}
          title="New Game?"
          description="Are you sure you want to start a new game? Current progress will be lost."
          confirmLabel="New Game"
        />

        {/* Drag overlay */}
        <DragOverlay dropAnimation={dropAnimation}>
          {draggedCards && draggedCards.length > 0 && (
            <div
              className="relative freecell-container"
              style={{
                width: 'var(--card-width)',
                height: `calc(((${draggedCards.length} - 1) * var(--card-offset-free)) + var(--card-height))`,
              }}
            >
              {draggedCards.map((card, i) => (
                <div
                  key={card.id}
                  style={{
                    position: i === 0 ? 'relative' : 'absolute',
                    top: `calc(${i} * var(--card-offset-free))`,
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
      </div>
    </DndContext>
  )
}
