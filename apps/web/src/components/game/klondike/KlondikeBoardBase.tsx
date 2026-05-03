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
import KlondikeColumn from './KlondikeColumn'
import KlondikeFoundation from './KlondikeFoundation'
import KlondikeWaste from './KlondikeWaste'
import KlondikeStock from './KlondikeStock'
import Card from '../Card'
import { TopBar } from '@/components/layout/TopBar'
import { ActionRail } from '@/components/layout/ActionRail'
import { DevRail } from '@/components/layout/DevRail'
import { ConfirmModal } from '#/components/ConfirmModal'
import { getVariant } from '@workspace/constants'
import type { UseKlondikeResult } from '#/lib/hooks/useKlondikeDrawOne'
import type { DraggableCardData, DroppableZoneData } from '#/lib/games/klondike'
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

const OVERLAY_CARD_OFFSET = 40
const CARD_HEIGHT = 160

interface KlondikeBoardBaseProps {
  useGame: () => UseKlondikeResult
  onHowToPlay: () => void
}

export default function KlondikeBoardBase({
  useGame,
  onHowToPlay,
}: KlondikeBoardBaseProps) {
  const {
    tableau,
    foundation,
    waste,
    stockCount,
    stockEmpty,
    canRedeal,
    redealsLeft,
    drawCount,
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
    currentDealCount,
    devSetStatus,
  } = useGame()

  const variantId = drawCount === 1 ? 'klondike-draw-1' : 'klondike-draw-3'
  const variant = getVariant(variantId)

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

  const isGameOver = status === 'won'

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
      ...(redealsLeft !== null
        ? [{ label: 'Recycles', value: redealsLeft }]
        : []),
    ],
    [score, moveCount, redealsLeft],
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
      onClick: () => setDevMoveAnywhere(!devMoveAnywhere),
      active: devMoveAnywhere,
    },
    {
      icon: ViewIcon,
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
      <div className="flex h-full flex-col">
        <TopBar
          title={variant.name}
          subtitle={variant.subtitle}
          stats={stats}
          status={status}
          className="mb-8"
        />

        {/* Rail + Board Container */}
        <div className="flex flex-1 gap-4 sm:gap-8 min-h-0">
          {/* Side Rails - Action & Dev (Left side) */}
          <aside className="hidden flex-col gap-4 py-8 pl-2 sm:pl-4 md:flex">
            <ActionRail actions={actions} />
            <DevRail actions={devActions} />
          </aside>

          {/* Main Felt Board */}
          <div className="flex-1 overflow-auto felt-scroll px-0 py-4 sm:py-8">
            <div
              className={cn(
                'mx-auto w-fit flex flex-col gap-10',
                isGameOver && 'opacity-50',
              )}
            >
              {/* Top row: stock + waste | empty | foundations */}
              <div className="grid grid-cols-7 gap-12">
                {/* Stock + Waste */}
                <div className="flex gap-12 col-span-2">
                  <KlondikeStock
                    stockCount={stockCount}
                    stockEmpty={stockEmpty}
                    canRedeal={canRedeal}
                    onClick={onFlipStock}
                  />
                  <KlondikeWaste
                    waste={waste}
                    drawCount={drawCount}
                    moveAnywhere={devMoveAnywhere}
                    onDoubleClick={() => onAutoMove('waste')}
                    currentDealCount={currentDealCount}
                  />
                </div>

                {/* Empty space (Column 3) */}
                <div />

                {/* Foundations (Columns 4-7) */}
                <div className="grid grid-cols-4 gap-12 col-span-4">
                  {foundation.map((f) => (
                    <KlondikeFoundation
                      key={f.id}
                      id={f.id}
                      cards={f.cards}
                      suit={f.suit}
                      draggable={true}
                    />
                  ))}
                </div>
              </div>

              {/* Tableau */}
              <div className="grid grid-cols-7 gap-12">
                {tableau.map((col) => (
                  <KlondikeColumn
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

        {/* Mobile Action Rails */}
        <div className="mt-4 flex flex-col gap-2 md:hidden">
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
