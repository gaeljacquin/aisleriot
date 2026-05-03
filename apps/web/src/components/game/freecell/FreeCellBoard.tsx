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
import { DevRail } from '@/components/layout/DevRail'
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

const OVERLAY_CARD_OFFSET = 48
const CARD_HEIGHT = 160

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

  const overlayHeight =
    draggedCards && draggedCards.length > 1
      ? (draggedCards.length - 1) * OVERLAY_CARD_OFFSET + CARD_HEIGHT
      : CARD_HEIGHT

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
    { icon: BookOpen01Icon, label: 'Rules', onClick: onHowToPlay },
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
            --card-width: 7rem;
            --card-height: 10rem;
            --card-gap-free: 1rem;
            --card-offset-free: 3rem;
            --rail-gap: 1.5rem;
            --row-gap: 3rem;
          }

          @media (max-width: 1400px) {
            .freecell-container {
              --card-width: 6rem;
              --card-height: 8.5rem;
              --card-gap-free: 0.75rem;
              --card-offset-free: 2.5rem;
              --rail-gap: 1rem;
              --row-gap: 2.5rem;
            }
          }

          @media (max-width: 1200px) {
            .freecell-container {
              --card-width: 5.25rem;
              --card-height: 7.5rem;
              --card-gap-free: 0.5rem;
              --card-offset-free: 2.2rem;
              --rail-gap: 1.25rem;
              --row-gap: 2rem;
            }
          }

          @media (max-width: 1000px) {
            .freecell-container {
              --card-width: 4.5rem;
              --card-height: 6.4rem;
              --card-gap-free: 0.375rem;
              --card-offset-free: 1.8rem;
              --rail-gap: 1rem;
              --row-gap: 1.5rem;
            }
          }

          @media (max-width: 800px) {
            .freecell-container {
              --card-width: 3.75rem;
              --card-height: 5.35rem;
              --card-gap-free: 0.25rem;
              --card-offset-free: 1.5rem;
              --rail-gap: 0.75rem;
              --row-gap: 1.25rem;
            }
          }
        `}</style>

        <div className="flex h-full flex-col">
          <TopBar
            title={variant.name}
            subtitle={variant.subtitle}
            stats={stats}
            status={status}
            className="mb-8"
          />

          {/* Board Container */}
          <div className="flex-1 overflow-auto felt-scroll px-0 py-4 sm:py-8">
            <div
              className={cn(
                'mx-auto w-fit flex flex-col items-center',
                isGameOver && 'opacity-50',
              )}
              style={{ gap: 'var(--row-gap)' }}
            >
              {/* Top Row with Split Rails */}
              <div
                className="flex items-center justify-center"
                style={{ gap: 'var(--rail-gap)' }}
              >
                <ActionRail
                  actions={actions.slice(0, 3)}
                  orientation="vertical"
                  showBackLink={false}
                  showDivider={false}
                  showSettingsLink={false}
                  className="hidden md:flex"
                />

                <FreeCellTopRow
                  freeCells={freeCells}
                  foundation={foundation}
                  onFreeCellDoubleClick={handleFreeCellDoubleClick}
                />

                <ActionRail
                  actions={actions.slice(3)}
                  orientation="vertical"
                  className="hidden md:flex"
                />
              </div>

              <FreeCellTableau
                tableau={tableau}
                draggableFromIndex={draggableFromIndex}
                devUnlimitedMoves={devUnlimitedMoves}
                onDoubleClick={handleTableauDoubleClick}
              />

              {/* Mobile Action Rails */}
              <div className="flex flex-col gap-2 md:hidden w-full">
                <ActionRail
                  actions={actions}
                  orientation="horizontal"
                  className="justify-between"
                />
                <DevRail
                  actions={devActions}
                  orientation="horizontal"
                  className="justify-center"
                />
              </div>

              {/* Centered Dev Rail (Desktop) */}
              <div className="hidden md:flex justify-center mt-4">
                <DevRail actions={devActions} orientation="horizontal" />
              </div>
            </div>
          </div>
        </div>

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
