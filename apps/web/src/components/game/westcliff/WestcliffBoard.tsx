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
import WestcliffColumn from './WestcliffColumn'
import WestcliffFoundation from './WestcliffFoundation'
import WestcliffWaste from './WestcliffWaste'
import WestcliffStock from './WestcliffStock'
import Card from '../Card'
import { TopBar } from '@/components/layout/TopBar'
import { ActionRail } from '@/components/layout/ActionRail'
import { ConfirmModal } from '#/components/ConfirmModal'
import { getVariant } from '@workspace/constants'
import { useWestcliff } from '#/lib/hooks/useWestcliff'
import type { DraggableCardData, DroppableZoneData } from '#/lib/games/westcliff'
import type { Card as CardType } from '#/lib/types'
import {
  PlusSignIcon,
  UndoIcon,
  Refresh04Icon,
  BookOpen01Icon,
  ViewIcon,
  TouchIcon,
  ChampionIcon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'
import { useDevModeStore } from '#/stores/dev-mode'
import { BoardLabel } from '../BoardLabel'
import { VictoryFanOut } from '..'
import { useVictoryAnimationStore } from '#/stores/victory-animation'

const OVERLAY_CARD_OFFSET = 36
const CARD_HEIGHT = 160

interface WestcliffBoardProps {
  onHowToPlay: () => void
}

export default function WestcliffBoard({ onHowToPlay }: WestcliffBoardProps) {
  const { isAnimating: isVictoryAnimating } = useVictoryAnimationStore()
  const {
    tableau,
    foundation,
    waste,
    stockCount,
    stockEmpty,
    canRedeal,
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
    devSetStatus,
  } = useWestcliff()

  const { isDevMode, toggleDevMode } = useDevModeStore()
  const variant = getVariant('westcliff')

  const [draggedCards, setDraggedCards] = useState<CardType[] | null>(null)
  const lastDropWasValid = useRef(false)
  const [devMoveAnywhere, setDevMoveAnywhere] = useState(false)
  const [devPeekTableau, setDevPeekTableau] = useState(false)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [confirmNewGame, setConfirmNewGame] = useState(false)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
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

  const dropAnimation = lastDropWasValid.current
    ? null
    : { duration: 300, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }

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
      icon: Refresh04Icon,
      label: 'Restart',
      onClick: () => setConfirmRestart(true),
    },
    {
      icon: UndoIcon,
      label: 'Undo',
      onClick: onUndo,
      disabled: !canUndo || status === 'won',
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
      icon: Refresh04Icon,
      label: 'Peek',
      onClick: () => setDevPeekTableau(!devPeekTableau),
      active: devPeekTableau,
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
      <style>{`
        .westcliff-container {
          --card-width: 6.5rem;
          --card-height: calc(var(--card-width) * 1.428);
          --card-gap-westcliff: 1rem;
        }

        @media (max-width: 1536px) {
          .westcliff-container {
            --card-width: clamp(4.5rem, 7.5vw, 6rem);
            --card-gap-westcliff: 0.8vw;
          }
        }

        @media (max-width: 1024px) {
          .westcliff-container {
            --card-width: clamp(3.5rem, 7vw, 5rem);
            --card-gap-westcliff: 0.6vw;
          }
        }

        @media (max-width: 640px) {
          .westcliff-container {
            --card-width: clamp(3rem, 8.5vw, 4.5rem);
            --card-gap-westcliff: 0.5vw;
          }
        }
      `}</style>

      <div className="flex h-full flex-col westcliff-container">
        <TopBar
          title={variant.name}
          subtitle={variant.subtitle}
          stats={stats}
          status={status}
          className="mb-6 px-6 pt-6 sm:px-8 sm:pt-8"
        />

        {/* Board Container */}
        <div className="flex-1 overflow-auto felt-scroll px-4 sm:px-8 py-4">
          <div
            className={cn(
              'mx-auto w-fit flex flex-col gap-8 items-center',
              status === 'lost' && 'opacity-50',
              isVictoryAnimating && 'pointer-events-none',
            )}
          >
            {/* Top Row: Stock, Waste, Spacers, Foundations */}
            <div
              className="grid grid-cols-10"
              style={{
                gap: 'var(--card-gap-westcliff)',
                gridTemplateColumns: 'repeat(10, var(--card-width))',
              }}
            >
              <div className="flex flex-col items-start gap-2">
                <BoardLabel
                  label={`Stock (${stockCount})`}
                  className="w-full"
                />
                <WestcliffStock
                  stockCount={stockCount}
                  stockEmpty={stockEmpty}
                  canRedeal={canRedeal}
                  onClick={onFlipStock}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <BoardLabel
                  label={`Waste (${waste.length})`}
                  color="gold"
                  className="w-full"
                />
                <WestcliffWaste
                  waste={waste}
                  moveAnywhere={devMoveAnywhere}
                  onDoubleClick={() => onAutoMove('waste')}
                />
              </div>

              {/* Empty spacers (Columns 3-6) */}
              <div />
              <div />
              <div />
              <div />

              {/* Foundations (Columns 7-10) */}
              <div className="col-span-4 flex flex-col items-center gap-2">
                <BoardLabel label="Foundation" />
                <div
                  className="grid grid-cols-4 w-full"
                  style={{
                    gap: 'var(--card-gap-westcliff)',
                    gridTemplateColumns: 'repeat(4, var(--card-width))',
                  }}
                >
                  {foundation.map((f) => (
                    <WestcliffFoundation
                      key={f.id}
                      id={f.id}
                      cards={f.cards}
                      suit={f.suit}
                      draggable={true}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: 10 Tableau Columns */}
            <div className="flex flex-col items-center gap-2">
              <BoardLabel
                label={`Tableau (${tableau.reduce(
                  (acc, col) => acc + col.cards.length,
                  0,
                )})`}
              />
              <div
                className="grid grid-cols-10"
                style={{
                  gap: 'var(--card-gap-westcliff)',
                  gridTemplateColumns: 'repeat(10, var(--card-width))',
                }}
              >
                {tableau.map((col) => (
                  <WestcliffColumn
                    key={col.id}
                    id={col.id}
                    cards={col.cards}
                    draggableFrom={
                      devMoveAnywhere
                        ? Math.max(
                            0,
                            col.cards.findIndex((c) => c.faceUp),
                          )
                        : draggableFromIndex[col.id]
                    }
                    peekTableau={devPeekTableau}
                    onDoubleClick={(pileId) => onAutoMove(pileId)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <VictoryFanOut isVisible={status === 'won'} />

        {/* Action Rail */}
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
                <Card suit={card.suit} rank={card.rank} faceUp={card.faceUp} />
              </div>
            ))}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
