import { useState, useMemo } from 'react'
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
import { useSpider } from '#/lib/hooks/useSpider'
import { getVariant } from '@workspace/constants'
import type {
  DraggableCardData,
  DroppableZoneData,
  SpiderFoundationId,
} from '#/lib/games/spider'
import { FOUNDATION_IDS } from '#/lib/games/spider'
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
import { VictoryFanOut } from '..'
import { useVictoryAnimationStore } from '#/stores/victory-animation'
import SpiderTableau from './SpiderTableau'
import SpiderFoundation from './SpiderFoundation'
import SpiderStock from './SpiderStock'
import SpiderCard from './SpiderCard'

interface SpiderBoardProps {
  onHowToPlay: () => void
}

export default function SpiderBoard({ onHowToPlay }: SpiderBoardProps) {
  const { isAnimating: isVictoryAnimating } = useVictoryAnimationStore()
  const {
    tableau,
    foundations,
    stock,
    canDealStock,
    draggableFromIndex,
    score,
    moveCount,
    status,
    canUndo,
    onMoveCard,
    onMoveCardForce,
    onDealStock,
    onNewGame,
    onRestartGame,
    onUndo,
    devSetStatus,
  } = useSpider()

  const { isDevMode, toggleDevMode } = useDevModeStore()
  const variant = getVariant('spider')

  const [draggedCards, setDraggedCards] = useState<CardType[] | null>(null)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [confirmNewGame, setConfirmNewGame] = useState(false)
  const [devMoveAnywhere, setDevMoveAnywhere] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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

  function handleStockClick() {
    if (stock.length === 0) return
    if (!canDealStock) {
      setErrorMessage(
        'All 10 tableau columns must contain at least 1 card to deal.',
      )
      setTimeout(() => setErrorMessage(null), 3000)
      return
    }
    setErrorMessage(null)
    onDealStock()
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

  const completedFoundationsCount = useMemo(
    () => FOUNDATION_IDS.filter((id) => foundations[id].length === 13).length,
    [foundations],
  )

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen flex-col overflow-hidden spider-container">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .spider-container {
            --card-width: 6.5rem;
            --card-height: calc(var(--card-width) * 1.428);
            --card-gap-x: 0.75rem;
            --card-offset-spider: 1.75rem;
            --row-gap: 2rem;
          }

          @media (max-width: 1536px) {
            .spider-container {
              --card-width: clamp(3.8rem, 7.5vw, 6rem);
              --card-gap-x: 0.75vw;
              --card-offset-spider: 1.5rem;
            }
          }

          @media (max-width: 1024px) {
            .spider-container {
              --card-width: clamp(3.2rem, 7vw, 5rem);
              --card-gap-x: 0.5vw;
              --card-offset-spider: 1.25rem;
            }
          }

          @media (max-width: 640px) {
            .spider-container {
              --card-width: clamp(2.8rem, 8.8vw, 4.2rem);
              --card-gap-x: 0.4vw;
              --card-offset-spider: 1.1rem;
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

        {errorMessage && (
          <div className="mx-auto mb-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-serif shadow-lg animate-fade-in">
            {errorMessage}
          </div>
        )}

        <div className="flex-1 overflow-auto felt-scroll px-2 sm:px-6 py-1 sm:py-2">
          <div
            className={cn(
              'mx-auto w-fit flex flex-col items-center gap-6 sm:gap-8',
              status === 'lost' && 'opacity-50',
              isVictoryAnimating && 'pointer-events-none',
            )}
          >
            {/* Top Row: Stock + Foundations */}
            <div className="flex w-full items-center justify-between gap-4 sm:gap-8 px-2">
              <div className="flex flex-col items-center gap-1.5">
                <BoardLabel label="Stock" />
                <SpiderStock
                  stockCount={stock.length}
                  onClick={handleStockClick}
                  disabled={!canDealStock && stock.length > 0}
                />
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <BoardLabel label={`Foundations (${completedFoundationsCount}/8)`} />
                <div className="flex justify-center gap-1.5 sm:gap-2">
                  {FOUNDATION_IDS.map((id: SpiderFoundationId) => (
                    <SpiderFoundation
                      key={id}
                      id={id}
                      cards={foundations[id]}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Tableau */}
            <div className="flex flex-col items-center gap-2">
              <BoardLabel
                label={`Tableau (${Object.values(tableau).reduce(
                  (acc, column) => acc + column.length,
                  0,
                )} cards)`}
              />
              <SpiderTableau
                tableau={tableau}
                draggableFromIndex={draggableFromIndex}
                devMoveAnywhere={devMoveAnywhere}
              />
            </div>
          </div>
        </div>

        <VictoryFanOut isVisible={status === 'won'} />

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
                    <SpiderCard card={card} />
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
