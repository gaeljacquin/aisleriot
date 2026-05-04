import { useRef, useState, useMemo } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { Waste, Stock } from '../index'
import StockEmptyIndicator from '../StockEmptyIndicator'
import PyramidGrid from './PyramidGrid'
import { PyramidWasteRefContext } from './PyramidWasteRefContext'
import { TopBar } from '@/components/layout/TopBar'
import { ActionRail } from '@/components/layout/ActionRail'
import { ConfirmModal } from '#/components/ConfirmModal'
import { isKing } from '#/lib/games/pyramid'
import { getVariant } from '@workspace/constants'
import type { GameVariantId } from '@workspace/constants'
import type { PyramidCellId } from '#/lib/games/pyramid'
import type { Card as CardType } from '#/lib/types'
import type { UsePyramidResult } from '#/lib/hooks/usePyramid'
import {
  PlusSignIcon,
  UndoIcon,
  Refresh04Icon,
  BookOpen01Icon,
  TouchIcon,
  ChampionIcon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'

export interface PyramidBoardBaseStockRowContext<T extends UsePyramidResult> {
  stockCount: number
  wasteTop: CardType | null
  canDraw: boolean
  canRecycle: boolean
  recyclesRemaining: number
  wasteRef: React.RefObject<HTMLDivElement | null>
  selectedCellId: PyramidCellId | null
  clearSelection: () => void
  handleStockClick: () => void
  handleWasteTopClick: () => void
  onDraw: () => void
  onRecycle: () => void
  game: T
}

function PyramidTable({
  cells,
  availableCells,
  selectedId,
  onCellClick,
}: {
  cells: any[]
  availableCells: PyramidCellId[]
  selectedId: PyramidCellId | null
  onCellClick: (id: PyramidCellId) => void
}) {
  return (
    <PyramidGrid
      cells={cells}
      availableCells={availableCells}
      selectedCellId={selectedId}
      onCellClick={onCellClick}
    />
  )
}

function PyramidStockRow({
  stockCount,
  canDraw,
  canRecycle,
  onDraw,
  onRecycle,
  wasteTop,
  onWasteClick,
  wasteRef,
}: {
  stockCount: number
  canDraw: boolean
  canRecycle: boolean
  onDraw: () => void
  onRecycle: () => void
  wasteTop: CardType | null
  onWasteClick: () => void
  wasteRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ gap: 'calc(var(--pyramid-gap, 2rem) * 2)' }}
    >
      <div
        className="relative"
        style={{
          width: 'var(--card-width, 7rem)',
          height: 'var(--card-height, 10rem)',
        }}
      >
        {stockCount > 0 ? (
          <Stock count={stockCount} onClick={onDraw} disabled={!canDraw} />
        ) : (
          <StockEmptyIndicator canRecycle={canRecycle} onClick={onRecycle} />
        )}
      </div>

      <div ref={wasteRef} className="inline-block">
        <div
          className={cn(
            'cursor-default',
            wasteTop !== null && 'cursor-pointer',
          )}
          onClick={onWasteClick}
        >
          <Waste topCard={wasteTop} animate={false} />
        </div>
      </div>
    </div>
  )
}

interface PyramidBoardBaseProps<T extends UsePyramidResult> {
  useGame: () => T
  onHowToPlay: () => void
  variantId: GameVariantId
  renderStockRow?: (ctx: PyramidBoardBaseStockRowContext<T>) => React.ReactNode
  onBeforeCellClick?: (
    cellId: PyramidCellId,
    defaultHandler: (id: PyramidCellId) => void,
  ) => boolean
}

export default function PyramidBoardBase<T extends UsePyramidResult>({
  useGame,
  onHowToPlay,
  variantId,
  renderStockRow,
  onBeforeCellClick,
}: PyramidBoardBaseProps<T>) {
  const {
    cells,
    availableCells,
    wasteTop,
    stockCount,
    canDraw,
    canRecycle,
    recyclesRemaining,
    score,
    status,
    canUndo,
    onRemoveAlone,
    onRemovePair,
    onRemovePairWithWaste,
    onRemoveWasteKing,
    onDraw,
    onRecycle,
    onNewGame,
    onRestartGame,
    onUndo,
    devSetStatus,
  } = useGame()

  const variant = getVariant(variantId)
  const wasteRef = useRef<HTMLDivElement>(null)
  const [selectedCellId, setSelectedCellId] = useState<PyramidCellId | null>(
    null,
  )
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [confirmNewGame, setConfirmNewGame] = useState(false)

  const selectedId = selectedCellId

  const handleCellClick = (id: PyramidCellId) => {
    if (onBeforeCellClick) {
      const handled = onBeforeCellClick(id, (innerId) => {
        setSelectedCellId(innerId)
      })
      if (handled) return
    }

    if (selectedCellId === id) {
      setSelectedCellId(null)
      return
    }

    const card = cells.find((c) => c.id === id)?.card
    if (!card) return

    if (isKing(card)) {
      onRemoveAlone(id)
      setSelectedCellId(null)
      return
    }

    if (selectedCellId) {
      onRemovePair(selectedCellId, id)
      setSelectedCellId(null)
    } else {
      setSelectedCellId(id)
    }
  }

  const handleWasteTopClick = () => {
    if (!wasteTop) return

    if (isKing(wasteTop)) {
      onRemoveWasteKing()
      setSelectedCellId(null)
      return
    }

    if (selectedCellId) {
      onRemovePairWithWaste(selectedCellId)
      setSelectedCellId(null)
    }
  }

  const clearSelection = () => setSelectedCellId(null)

  const stats = useMemo(
    () => [
      { label: 'Score', value: score },
      { label: 'Recycles', value: recyclesRemaining },
    ],
    [score, recyclesRemaining],
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
      disabled: !canUndo || (status !== 'playing' && status !== 'idle'),
    },
    {
      icon: Refresh04Icon,
      label: 'Reset',
      onClick: () => setConfirmRestart(true),
    },
    { icon: BookOpen01Icon, label: 'How to Play', onClick: onHowToPlay },
  ]

  const [devMoveAnywhere, setDevMoveAnywhere] = useState(false)

  const devActions = [
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
    <PyramidWasteRefContext value={wasteRef}>
      <style>{`
        .pyramid-container {
          --card-width: 7.5rem;
          --card-height: 10.7rem;
          --card-step-x: 8.25rem;
          --card-step-y: 6.5rem;
          --pyramid-gap: 2rem;
          --stock-row-mt: 2rem;
        }

        @media (max-width: 1536px) {
          .pyramid-container {
            --card-width: clamp(3.5rem, min(10vw, 11vh), 7.5rem);
            --card-height: calc(var(--card-width) * 1.428);
            --card-step-x: calc(var(--card-width) * 1.12);
            --card-step-y: calc(var(--card-height) * 0.62);
            --pyramid-gap: 1.5vmin;
            --stock-row-mt: 1.5vmin;
          }
        }

        @media (max-width: 640px) {
          .pyramid-container {
            --card-width: clamp(2rem, min(12vw, 10vh), 4.5rem);
            --card-height: calc(var(--card-width) * 1.428);
            --card-step-x: var(--card-width);
            --card-step-y: calc(var(--card-height) * 0.55);
            --pyramid-gap: 1vmin;
            --stock-row-mt: 1vmin;
          }
        }
      `}</style>
      <div className="flex h-full flex-col pyramid-container">
        <TopBar
          title={variant.name}
          subtitle={variant.subtitle}
          stats={stats}
          status={status}
          className="mb-4 px-6 pt-6 sm:px-8 sm:pt-8"
        />

        {/* Board Container */}
        <div className="flex-1 overflow-hidden felt-scroll px-4 sm:px-8 py-1 sm:py-2">
          <div
            className={cn(
              'mx-auto w-fit flex flex-col',
              status !== 'playing' && status !== 'idle' && 'opacity-50',
            )}
            style={{ gap: 'var(--stock-row-mt)' }}
          >
            {/* Pyramid Table */}
            <div className="flex justify-center">
              <PyramidTable
                cells={cells}
                availableCells={availableCells}
                selectedId={selectedId}
                onCellClick={handleCellClick}
              />
            </div>

            {renderStockRow ? (
              renderStockRow({
                game: useGame(),
                stockCount,
                canDraw,
                canRecycle,
                onDraw,
                onRecycle,
                wasteTop,
                selectedCellId: selectedId,
                handleWasteTopClick,
                clearSelection,
                wasteRef,
                recyclesRemaining,
                handleStockClick: onDraw,
              })
            ) : (
              <PyramidStockRow
                stockCount={stockCount}
                canDraw={canDraw}
                canRecycle={canRecycle}
                onDraw={onDraw}
                onRecycle={onRecycle}
                wasteTop={wasteTop}
                onWasteClick={handleWasteTopClick}
                wasteRef={wasteRef}
              />
            )}
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
    </PyramidWasteRefContext>
  )
}
