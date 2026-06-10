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
import { useAcme } from '#/lib/hooks/use-acme'
import { getVariant } from '@workspace/constants'
import type { Card as CardType } from '#/lib/types'
import {
  PlusSignIcon,
  UndoIcon,
  Refresh04Icon,
  BookOpen01Icon,
  ChampionIcon,
  ViewIcon,
  TouchIcon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'
import { useDevModeStore } from '#/stores/dev-mode'
import Stock from '../Stock'
import StockEmptyIndicator from '../StockEmptyIndicator'
import { BoardLabel } from '../BoardLabel'
import { VictoryFanOut } from '..'
import { useVictoryAnimationStore } from '#/stores/victory-animation'
import {
  AcmeTableau,
  AcmeReserve,
  AcmeFoundation,
  AcmeWaste,
  AcmeCard,
} from './'

interface AcmeBoardProps {
  onHowToPlay: () => void
}

export default function AcmeBoard({ onHowToPlay }: AcmeBoardProps) {
  const { isAnimating: isVictoryAnimating } = useVictoryAnimationStore()
  const {
    tableau,
    foundation,
    reserve,
    stock,
    waste,
    score,
    moveCount,
    status,
    canUndo,
    redealsUsed,
    onMoveCard,
    onMoveCardForce,
    onAutoMove,
    onFlipStock,
    onNewGame,
    onRestartGame,
    onUndo,
    devSetStatus,
  } = useAcme()

  const { isDevMode, toggleDevMode } = useDevModeStore()
  const variant = getVariant('acme')

  const [draggedCards, setDraggedCards] = useState<CardType[] | null>(null)
  const lastDropWasValid = useRef(false)
  const [devMoveAnywhere, setDevMoveAnywhere] = useState(false)
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
    const data = event.active.data.current as any
    if (data?.type === 'card') {
      setDraggedCards(data.cards)
    }
    lastDropWasValid.current = false
  }

  function handleDragEnd(event: DragEndEvent) {
    const activeData = event.active.data.current as any
    const overData = event.over?.data.current as any

    if (activeData?.type === 'card' && overData?.type === 'pile') {
      lastDropWasValid.current = true
      const move = {
        fromPile: activeData.fromPileId,
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

  const isGameOver = status === 'won' || status === 'lost'

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
      { label: 'Recycles', value: 1 - redealsUsed },
    ],
    [score, moveCount, redealsUsed],
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
      onClick: onUndo,
      disabled: !canUndo || isGameOver,
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

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full acme-container">
        <style>{`
          .acme-container {
            --card-width: 7.5rem;
            --card-height: 10.7rem;
            --card-gap-free: 1.25rem;
            --card-offset-free: 2.5rem;
            --row-gap: 4rem;
          }

          @media (max-width: 1536px) {
            .acme-container {
              --card-width: clamp(5rem, 9.5vw, 7rem);
              --card-height: calc(var(--card-width) * 1.428);
              --card-gap-free: 1.25vw;
              --card-offset-free: 3vw;
              --row-gap: 4vw;
            }
          }

          @media (max-width: 640px) {
            .acme-container {
              --card-width: clamp(4rem, 11vw, 5rem);
              --card-height: calc(var(--card-width) * 1.428);
              --card-gap-free: 1vw;
              --card-offset-free: 4vw;
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

          <div className="flex-1 overflow-auto felt-scroll px-4 sm:px-8 py-4 sm:py-8">
            <div
              className={cn(
                'mx-auto w-full lg:w-fit flex gap-[calc(var(--card-gap-free)*4)] items-start',
                status === 'lost' && 'opacity-50',
                isVictoryAnimating && 'pointer-events-none',
              )}
            >
              {/* Left Column: Stock/Waste and Reserve */}
              <div
                className="flex flex-col items-start"
                style={{ gap: 'var(--row-gap)' }}
              >
                <div className="flex gap-(--card-gap-free)">
                  <div className="flex flex-col items-center gap-2">
                    <BoardLabel label={`Stock (${stock.length})`} />
                    {stock.length > 0 ? (
                      <Stock count={stock.length} onClick={onFlipStock} />
                    ) : (
                      <StockEmptyIndicator
                        canRecycle={redealsUsed < 1}
                        onClick={onFlipStock}
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <BoardLabel label={`Waste (${waste.length})`} />
                    <AcmeWaste
                      waste={waste}
                      devMoveAnywhere={devMoveAnywhere}
                      onDoubleClick={() => onAutoMove('waste')}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <BoardLabel label={`Reserve (${reserve.length})`} />
                  <AcmeReserve
                    reserve={reserve}
                    devMoveAnywhere={devMoveAnywhere}
                    onDoubleClick={() => onAutoMove('reserve')}
                  />
                </div>
              </div>

              {/* Right Column: Foundation and Tableau */}
              <div
                className="flex flex-col items-center"
                style={{ gap: 'var(--row-gap)' }}
              >
                <div className="flex flex-col items-center gap-2">
                  <BoardLabel label="Foundation" />
                  <AcmeFoundation foundation={foundation} />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <BoardLabel
                    label={`Tableau (${tableau.reduce(
                      (acc, pile) => acc + pile.cards.length,
                      0,
                    )})`}
                  />
                  <AcmeTableau
                    tableau={tableau}
                    devMoveAnywhere={devMoveAnywhere}
                    onDoubleClick={onAutoMove}
                  />
                </div>
              </div>
            </div>
          </div>

          <VictoryFanOut isVisible={status === 'won'} />

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
              <AcmeCard card={draggedCards[0]} />
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  )
}
