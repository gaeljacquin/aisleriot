import { useRef, useState, useMemo } from 'react'
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
import { TopBar } from '@/components/layout/TopBar'
import { ActionRail } from '@/components/layout/ActionRail'
import { ConfirmModal } from '#/components/ConfirmModal'
import { useGrandfathersClock } from '#/lib/hooks/use-grandfathers-clock'
import { getVariant } from '@workspace/constants'
import type { Card as CardType } from '#/lib/types'
import {
  PlusSignIcon,
  UndoIcon,
  Refresh04Icon,
  BookOpen01Icon,
  ViewIcon,
  ChampionIcon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'
import { useDevModeStore } from '#/stores/dev-mode'
import { GrandfathersClockCard } from './GrandfathersClockCard'
import GrandfathersClockFoundation from './GrandfathersClockFoundation'
import GrandfathersClockColumn from './GrandfathersClockColumn'
import { BoardLabel } from '../BoardLabel'
import type {
  DraggableCardData,
  DroppableZoneData,
} from '#/lib/games/grandfathers-clock'

interface GrandfathersClockBoardProps {
  onHowToPlay: () => void
}

const CLOCK_POSITIONS = [
  { id: 'foundation-12', label: '12', angle: 0 },
  { id: 'foundation-1', label: '1', angle: 30 },
  { id: 'foundation-2', label: '2', angle: 60 },
  { id: 'foundation-3', label: '3', angle: 90 },
  { id: 'foundation-4', label: '4', angle: 120 },
  { id: 'foundation-5', label: '5', angle: 150 },
  { id: 'foundation-6', label: '6', angle: 180 },
  { id: 'foundation-7', label: '7', angle: 210 },
  { id: 'foundation-8', label: '8', angle: 240 },
  { id: 'foundation-9', label: '9', angle: 270 },
  { id: 'foundation-10', label: '10', angle: 300 },
  { id: 'foundation-11', label: '11', angle: 330 },
]

export default function GrandfathersClockBoard({
  onHowToPlay,
}: GrandfathersClockBoardProps) {
  const {
    tableau,
    foundation,
    score,
    moveCount,
    status,
    canUndo,
    onMoveCard,
    onAutoMove,
    onNewGame,
    onRestartGame,
    onUndo,
    devSetStatus,
  } = useGrandfathersClock()

  const { isDevMode, toggleDevMode } = useDevModeStore()
  const variant = getVariant('grandfathers-clock')

  const [draggedCards, setDraggedCards] = useState<CardType[] | null>(null)
  const lastDropWasValid = useRef(false)
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
      onMoveCard({
        fromPileId: activeData.fromPileId,
        fromIndex: activeData.fromIndex,
        toPileId: overData.pileId,
      })
    } else {
      lastDropWasValid.current = false
    }

    setDraggedCards(null)
  }

  function handleDoubleClick(pileId: string) {
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
      label: 'Restart',
      onClick: () => setConfirmRestart(true),
    },
    { icon: BookOpen01Icon, label: 'How to Play', onClick: onHowToPlay },
  ]

  const devActions = [
    {
      icon: ViewIcon,
      label: 'Debug',
      onClick: toggleDevMode,
      active: isDevMode,
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

  const foundationMap = useMemo(() => {
    return foundation.reduce(
      (acc, f) => {
        acc[f.id] = f.cards
        return acc
      },
      {} as Record<string, CardType[]>,
    )
  }, [foundation])

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full grandfathers-clock-container">
        <style>{`
          .grandfathers-clock-container {
            --card-width: 6.5rem;
            --card-height: 9.3rem;
            --card-offset-tableau: 2.25rem;
            --clock-radius: 22rem;
            --clock-size: 54rem;
          }

          @media (max-width: 1536px) {
            .grandfathers-clock-container {
              --card-width: 5.5rem;
              --card-height: calc(var(--card-width) * 1.428);
              --card-offset-tableau: 2rem;
              --clock-radius: 18rem;
              --clock-size: calc(var(--clock-radius) * 2.8);
            }
          }

          @media (max-width: 1024px) {
            .grandfathers-clock-container {
              --card-width: 5.2rem;
              --card-height: calc(var(--card-width) * 1.428);
              --card-offset-tableau: 1.8rem;
              --clock-radius: 16rem;
              --clock-size: calc(var(--clock-radius) * 2.6);
            }
          }

          @media (max-width: 768px) {
            .grandfathers-clock-container {
              --card-width: 4.5rem;
              --card-height: calc(var(--card-width) * 1.428);
              --card-offset-tableau: 1.6rem;
              --clock-radius: 13rem;
              --clock-size: calc(var(--clock-radius) * 2.5);
            }
          }

          @media (max-width: 640px) {
            .grandfathers-clock-container {
              --card-width: 3.2rem;
              --card-height: calc(var(--card-width) * 1.428);
              --card-offset-tableau: 1.25rem;
              --clock-radius: 9rem;
              --clock-size: calc(var(--clock-radius) * 2.6);
            }
          }
        `}</style>

        <div className="flex h-full flex-col">
          <TopBar
            title={variant.name}
            subtitle={variant.subtitle}
            stats={stats}
            status={status}
            className="mb-0 px-4 pt-4 sm:px-6 sm:pt-4"
          />

          <div className="flex-1 overflow-auto felt-scroll px-2 sm:px-4 py-2 sm:pt-4 sm:pb-8">
            <div
              className={cn(
                'mx-auto w-full flex flex-col 2xl:flex-row-reverse items-center 2xl:items-start 2xl:justify-center gap-6 sm:gap-6 md:gap-4 lg:gap-2 xl:gap-1 2xl:gap-16 2xl:pt-8',
                isGameOver && 'opacity-50',
              )}
            >
              {/* Clock Foundations */}
              <div
                className="relative md:mt-4 lg:-mt-10 2xl:mt-0 shrink-0"
                style={{
                  width: 'var(--clock-size)',
                  height: 'var(--clock-size)',
                }}
              >
                {CLOCK_POSITIONS.map((pos) => {
                  const sin = Math.sin((pos.angle * Math.PI) / 180)
                  const cos = Math.cos((pos.angle * Math.PI) / 180)
                  return (
                    <div
                      key={pos.id}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `calc(50% + ${sin} * var(--clock-radius))`,
                        top: `calc(50% - ${cos} * var(--clock-radius))`,
                      }}
                    >
                      <GrandfathersClockFoundation
                        id={pos.id}
                        cards={foundationMap[pos.id]}
                        label={pos.label}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Tableau */}
              <div className="flex flex-col items-center gap-4 md:gap-1 md:-mt-4 lg:-mt-10 xl:-mt-12 2xl:mt-0">
                <BoardLabel label="Tableau" />
                <div className="flex flex-wrap sm:flex-nowrap 2xl:grid 2xl:grid-cols-4 justify-center gap-2 sm:gap-3 md:gap-4 2xl:gap-x-8 2xl:gap-y-12">
                  {tableau.map((col) => (
                    <GrandfathersClockColumn
                      key={col.id}
                      id={col.id}
                      cards={col.cards}
                      onDoubleClick={handleDoubleClick}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

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

        <DragOverlay dropAnimation={dropAnimation}>
          {draggedCards && (
            <div
              style={{
                width: 'var(--card-width)',
                height: 'var(--card-height)',
              }}
            >
              <GrandfathersClockCard card={draggedCards[0]} />
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  )
}
