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
import { TopBar } from '@/components/layout/TopBar'
import { ActionRail } from '@/components/layout/ActionRail'
import { ConfirmModal } from '#/components/ConfirmModal'
import { useSimpleSimon } from '#/lib/hooks/useSimpleSimon'
import { getVariant } from '@workspace/constants'
import type {
  SimpleSimonMove,
  DraggableCardData,
  DroppableZoneData,
} from '#/lib/games/simple-simon'
import type { Card as CardType } from '#/lib/types'
import {
  PlusSignIcon,
  UndoIcon,
  Refresh04Icon,
  BookOpen01Icon,
  ChampionIcon,
  TouchIcon,
  Cancel01Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import { useDevModeStore } from '#/stores/dev-mode'
import { BoardLabel } from '../BoardLabel'
import SimpleSimonTableau from './SimpleSimonTableau'
import SimpleSimonFoundation from './SimpleSimonFoundation'
import SimpleSimonCard from './SimpleSimonCard'

interface SimpleSimonBoardProps {
  onHowToPlay: () => void
}

export default function SimpleSimonBoard({
  onHowToPlay,
}: SimpleSimonBoardProps) {
  const {
    tableau,
    foundations,
    draggableFromIndex,
    score,
    moveCount,
    status,
    canUndo,
    onMoveCard,
    onMoveCardForce,
    onNewGame,
    onRestartGame,
    onUndo,
    devSetStatus,
  } = useSimpleSimon()

  const { isDevMode, toggleDevMode } = useDevModeStore()
  const variant = getVariant('simple-simon')

  const [draggedCards, setDraggedCards] = useState<CardType[] | null>(null)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [confirmNewGame, setConfirmNewGame] = useState(false)
  const [devMoveAnywhere, setDevMoveAnywhere] = useState(false)

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
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setDraggedCards(null)

    if (!over) return

    const activeData = active.data.current as DraggableCardData | undefined
    const overData = over.data.current as DroppableZoneData | undefined

    if (activeData?.type === 'card' && overData?.type === 'pile') {
      const move = {
        fromPileId: activeData.fromPileId,
        fromIndex: activeData.fromIndex,
        toPileId: overData.pileId,
      }

      if (devMoveAnywhere) {
        onMoveCardForce(move)
      } else {
        onMoveCard(move)
      }
    }
  }

  const actions = [
    {
      label: 'New Game',
      icon: PlusSignIcon,
      onClick: () => setConfirmNewGame(true),
    },
    {
      label: 'Restart',
      icon: Refresh04Icon,
      onClick: () => setConfirmRestart(true),
    },
    {
      label: 'Undo',
      icon: UndoIcon,
      onClick: onUndo,
      disabled: !canUndo,
    },
    {
      label: 'How to Play',
      icon: BookOpen01Icon,
      onClick: onHowToPlay,
    },
  ]

  const devActions = [
    {
      icon: ViewIcon,
      label: 'Debug',
      onClick: toggleDevMode,
      active: isDevMode,
    },
    {
      icon: TouchIcon,
      label: 'Moves',
      onClick: () => setDevMoveAnywhere(!devMoveAnywhere),
      active: devMoveAnywhere,
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

  const stats = useMemo(
    () => [
      { label: 'Score', value: score },
      { label: 'Moves', value: moveCount },
    ],
    [score, moveCount],
  )

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen flex-col overflow-hidden simple-simon-container">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .simple-simon-container {
            --card-width: 7.5rem;
            --card-height: calc(var(--card-width) * 1.428);
            --card-gap-x: 1.25rem;
            --card-offset-spider: 2.25rem;
            --row-gap: 3rem;
          }

          @media (max-width: 1536px) {
            .simple-simon-container {
              --card-width: clamp(4.5rem, 8vw, 7rem);
              --card-gap-x: 1.25vw;
              --card-offset-spider: 2rem;
            }
          }

          @media (max-width: 1024px) {
            .simple-simon-container {
              --card-width: clamp(3.5rem, 7.5vw, 6rem);
              --card-gap-x: 1vw;
              --card-offset-spider: 1.75rem;
            }
          }

          @media (max-width: 640px) {
            .simple-simon-container {
              --card-width: clamp(3.2rem, 16vw, 5rem);
              --card-gap-x: 1.5vw;
              --card-offset-spider: 1.5rem;
            }
          }
        `,
          }}
        />

        <TopBar
          title={variant.name}
          subtitle={variant.subtitle}
          stats={stats}
          status={status}
          className="mb-4 px-6 pt-6 sm:px-8 sm:pt-8"
        />

        <div className="flex-1 overflow-auto felt-scroll px-4 sm:px-8 py-1 sm:py-2">
          <div
            className={cn(
              'mx-auto w-fit flex flex-col items-center gap-10',
              status !== 'playing' && 'opacity-50',
            )}
          >
            <div className="flex flex-col items-center gap-2">
              <BoardLabel label="Foundations" />
              <div className="flex justify-center gap-[var(--card-gap-x)]">
                {Object.entries(foundations).map(([id, cards]) => (
                  <SimpleSimonFoundation
                    key={id}
                    id={id as any}
                    cards={cards}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <BoardLabel label="Tableau" />
              <SimpleSimonTableau
                tableau={tableau}
                draggableFromIndex={draggableFromIndex}
                devMoveAnywhere={devMoveAnywhere}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center pb-6 pt-2">
          <ActionRail actions={actions} devActions={devActions} />
        </div>

        <DragOverlay>
          {draggedCards && (
            <div className="opacity-80">
              <div
                className="relative"
                style={{
                  width: 'var(--card-width)',
                  height: `calc(((${draggedCards.length} - 1) * var(--card-offset-spider)) + var(--card-height))`,
                }}
              >
                {draggedCards.map((card, i) => (
                  <div
                    key={card.id}
                    className="absolute w-full"
                    style={{
                      top: `calc(${i} * var(--card-offset-spider))`,
                      left: 0,
                      zIndex: i,
                    }}
                  >
                    <SimpleSimonCard card={card} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </DragOverlay>

        <ConfirmModal
          open={confirmRestart}
          onOpenChange={setConfirmRestart}
          title="Restart Game?"
          description="Replay the same deal from the beginning."
          confirmLabel="Restart"
          onConfirm={() => {
            onRestartGame()
            setConfirmRestart(false)
          }}
        />

        <ConfirmModal
          open={confirmNewGame}
          onOpenChange={setConfirmNewGame}
          title="New Game?"
          description="Start a fresh game with a new deal."
          confirmLabel="New Game"
          onConfirm={() => {
            onNewGame()
            setConfirmNewGame(false)
          }}
        />
      </div>
    </DndContext>
  )
}
