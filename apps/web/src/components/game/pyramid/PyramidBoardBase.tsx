import { useRef, useState, useMemo } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { Waste, Stock } from '../index'
import StockEmptyIndicator from '../StockEmptyIndicator'
import PyramidGrid from './PyramidGrid'
import { PyramidWasteRefContext } from './PyramidWasteRefContext'
import { TopBar } from '@/components/layout/TopBar'
import { ActionRail } from '@/components/layout/ActionRail'
import { DevRail } from '@/components/layout/DevRail'
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
    <div className="mt-10 flex items-center justify-center gap-20">
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
    { icon: BookOpen01Icon, label: 'Rules', onClick: onHowToPlay },
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
                status !== 'playing' && status !== 'idle' && 'opacity-50',
              )}
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
    </PyramidWasteRefContext>
  )
}
