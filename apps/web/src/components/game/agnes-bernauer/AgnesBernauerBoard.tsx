import { useRef, useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import { useAgnesBernauerStore } from '#/lib/stores/agnes-bernauer'
import {
  TABLEAU_IDS,
  FOUNDATION_IDS,
  RESERVE_IDS,
} from '#/lib/games/agnes-bernauer'
import type {
  AgnesBernauerMove,
  DraggableCardData,
  DroppableZoneData,
} from '#/lib/games/agnes-bernauer'
import type { Card as CardType } from '#/lib/types'
import AgnesBernauerColumn from './AgnesBernauerColumn'
import AgnesBernauerFoundation from './AgnesBernauerFoundation'
import AgnesBernauerReserve from './AgnesBernauerReserve'
import Stock from '../Stock'
import Card from '../Card'
import { BoardLabel } from '../BoardLabel'
import { TopBar } from '@/components/layout/TopBar'
import { ActionRail } from '@/components/layout/ActionRail'
import { ConfirmModal } from '#/components/ConfirmModal'
import { getVariant } from '@workspace/constants'
import {
  PlusSignIcon,
  UndoIcon,
  Refresh04Icon,
  BookOpen01Icon,
  TouchIcon,
  ChampionIcon,
  Cancel01Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import { useDevModeStore } from '#/stores/dev-mode'
import { VictoryFanOut } from '..'
import { useVictoryAnimationStore } from '#/stores/victory-animation'

interface AgnesBernauerBoardProps {
  onHowToPlay: () => void
}

export default function AgnesBernauerBoard({
  onHowToPlay,
}: AgnesBernauerBoardProps) {
  const { isAnimating: isVictoryAnimating } = useVictoryAnimationStore()
  const state = useAgnesBernauerStore()
  const { isDevMode, toggleDevMode } = useDevModeStore()
  const variant = getVariant('agnes-bernauer')

  const [draggedCards, setDraggedCards] = useState<CardType[] | null>(null)
  const lastDropWasValid = useRef(false)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [confirmNewGame, setConfirmNewGame] = useState(false)
  const [devUnlimitedMoves, setDevUnlimitedMoves] = useState(false)

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
      DraggableCardData | undefined
    const overData = event.over?.data.current as DroppableZoneData | undefined

    if (activeData?.type === 'card' && overData?.type === 'pile') {
      lastDropWasValid.current = true
      const move: AgnesBernauerMove = {
        fromPile: activeData.pileId,
        fromIndex: activeData.fromIndex,
        toPile: overData.pileId,
      }
      if (devUnlimitedMoves) {
        state.moveCardForce(move)
      } else {
        state.moveCard(move)
      }
    } else {
      lastDropWasValid.current = false
    }

    setDraggedCards(null)
  }

  const isGameOver = state.status !== 'playing'

  const dropAnimation = lastDropWasValid.current
    ? null
    : {
        duration: 300,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }

  const stats = useMemo(
    () => [
      { label: 'Score', value: state.score },
      { label: 'Moves', value: state.moveCount },
    ],
    [state.score, state.moveCount],
  )

  const actions = [
    {
      icon: PlusSignIcon,
      label: 'New',
      onClick: () => setConfirmNewGame(true),
    },
    {
      icon: Refresh04Icon,
      label: 'Restart',
      onClick: () => setConfirmRestart(true),
    },
    {
      icon: UndoIcon,
      label: 'Undo',
      onClick: state.undo,
      disabled: !state.canUndo || isGameOver,
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
      icon: TouchIcon,
      label: 'Moves',
      onClick: () => setDevUnlimitedMoves(!devUnlimitedMoves),
      active: devUnlimitedMoves,
    },
    {
      icon: ChampionIcon,
      label: 'Win',
      onClick: () =>
        state.devSetStatus(state.status === 'won' ? 'playing' : 'won'),
      active: state.status === 'won',
    },
    {
      icon: Cancel01Icon,
      label: 'Lose',
      onClick: () =>
        state.devSetStatus(state.status === 'lost' ? 'playing' : 'lost'),
      active: state.status === 'lost',
    },
  ]

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full agnes-container">
        <style>{`
          .agnes-container {
            --card-width: 7.5rem;
            --card-height: 10.7rem;
            --row-gap: 4rem;
            --card-offset: 2.5rem;
          }

          @media (max-width: 1536px) {
            .agnes-container {
              --card-width: clamp(5rem, 9vw, 7rem);
              --card-height: calc(var(--card-width) * 1.428);
              --row-gap: 3vw;
            }
          }

          @media (max-width: 640px) {
            .agnes-container {
              --card-width: clamp(3.5rem, 11vw, 4.5rem);
              --card-height: calc(var(--card-width) * 1.428);
              --row-gap: 2vw;
            }
          }
        `}</style>

        <div className="flex h-full flex-col">
          <TopBar
            title={variant.name}
            subtitle={variant.subtitle}
            stats={stats}
            status={state.status}
            className="mb-8 px-6 pt-6 sm:px-8 sm:pt-8"
          />

          <div className="flex-1 overflow-auto felt-scroll px-4 sm:px-8 py-4 sm:py-8">
            <div
              className={cn(
                'mx-auto w-full lg:w-fit flex flex-col items-center',
                state.status === 'lost' && 'opacity-50',
                isVictoryAnimating && 'pointer-events-none',
              )}
              style={{ gap: 'var(--row-gap)' }}
            >
              {/* Row 1: Stock and Foundations */}
              <div className="flex justify-center gap-4 w-full">
                <div className="flex flex-col items-center gap-2">
                  <BoardLabel label={`Stock (${state.stock.length})`} />
                  <Stock
                    count={state.stock.length}
                    onClick={state.flipStock}
                    disabled={isGameOver}
                  />
                </div>
                {/* Spacers to align foundations with columns 3, 4, 5, 6 */}
                <div style={{ width: 'var(--card-width)' }} />
                <div style={{ width: 'var(--card-width)' }} />
                <div className="flex flex-col items-center gap-2">
                  <BoardLabel label="Foundations" />
                  <div className="flex gap-4">
                    {FOUNDATION_IDS.map((id) => (
                      <AgnesBernauerFoundation
                        key={id}
                        id={id}
                        cards={state.foundation[id]}
                        suit={state.foundationSuits[id]}
                        baseRank={state.baseRank}
                        disabled={isGameOver}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Reserve (7 piles aligned with Tableau) */}
              <div className="flex flex-col items-center gap-2">
                <BoardLabel
                  label={`Reserve (${Object.values(state.reserve).reduce(
                    (acc, pile) => acc + pile.length,
                    0,
                  )})`}
                />
                <div className="flex justify-center gap-4 w-full">
                  {RESERVE_IDS.map((id) => (
                    <AgnesBernauerReserve
                      key={id}
                      id={id}
                      cards={state.reserve[id]}
                      disabled={isGameOver}
                    />
                  ))}
                </div>
              </div>

              {/* Row 3: Tableau */}
              <div className="flex flex-col items-center gap-2">
                <BoardLabel
                  label={`Tableau (${Object.values(state.tableau).reduce(
                    (acc, pile) => acc + pile.length,
                    0,
                  )})`}
                />
                <div className="flex justify-center gap-4 w-full">
                  {TABLEAU_IDS.map((id) => (
                    <AgnesBernauerColumn
                      key={id}
                      id={id}
                      cards={state.tableau[id]}
                      state={state}
                      disabled={isGameOver}
                      devUnlimitedMoves={devUnlimitedMoves}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <VictoryFanOut isVisible={state.status === 'won'} />

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
            state.restartGame()
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
            state.newGame()
            setConfirmNewGame(false)
          }}
          title="New Game?"
          description="Are you sure you want to start a new game? Current progress will be lost."
          confirmLabel="New Game"
        />

        <DragOverlay dropAnimation={dropAnimation}>
          {draggedCards && (
            <div className="flex flex-col">
              {draggedCards.map((card, index) => (
                <div
                  key={card.id}
                  style={{
                    marginTop:
                      index === 0
                        ? 0
                        : 'calc(-1 * var(--card-height) + var(--card-offset))',
                    width: 'var(--card-width)',
                    height: 'var(--card-height)',
                  }}
                >
                  <Card
                    suit={card.suit}
                    rank={card.rank}
                    faceUp={card.faceUp}
                  />
                </div>
              ))}
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  )
}
