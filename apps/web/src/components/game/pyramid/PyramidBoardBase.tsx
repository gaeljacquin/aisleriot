import { useRef, useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { Stock, Waste } from '../index'
import PyramidGrid from './PyramidGrid'
import { PyramidWasteRefContext } from './PyramidWasteRefContext'
import { isKing } from '#/lib/games/pyramid'
import type { PyramidCellId } from '#/lib/games/pyramid'
import type { Card } from '#/lib/types'
import type { UsePyramidResult } from '#/lib/hooks/usePyramid'

export interface PyramidBoardBaseStockRowContext<T extends UsePyramidResult> {
  stockCount: number
  wasteTop: Card | null
  canDraw: boolean
  canRecycle: boolean
  recyclesRemaining: number
  wasteRef: React.RefObject<HTMLDivElement | null>
  selectedCellId: PyramidCellId | null
  handleStockClick: () => void
  handleWasteTopClick: () => void
  onDraw: () => void
  onRecycle: () => void
  game: T
}

interface PyramidBoardBaseProps<T extends UsePyramidResult> {
  useGame: () => T
  onHowToPlay: () => void
  renderStockRow?: (ctx: PyramidBoardBaseStockRowContext<T>) => React.ReactNode
  onBeforeCellClick?: (
    cellId: PyramidCellId,
    defaultHandler: (cellId: PyramidCellId) => void,
  ) => boolean
}

export default function PyramidBoardBase<T extends UsePyramidResult>({
  useGame,
  onHowToPlay,
  renderStockRow,
  onBeforeCellClick,
}: PyramidBoardBaseProps<T>) {
  const game = useGame()
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
    onUndo,
  } = game

  const wasteRef = useRef<HTMLDivElement>(null)
  const [selectedCellId, setSelectedCellId] = useState<PyramidCellId | null>(null)
  const [devStatus, setDevStatus] = useState<'won' | 'lost' | null>(null)

  const effectiveStatus = devStatus ?? status
  const isGameOver = effectiveStatus === 'won' || effectiveStatus === 'lost'

  function baseCellHandler(cellId: PyramidCellId) {
    if (status !== 'playing') return

    const cell = cells.find((c) => c.id === cellId)
    if (!cell) return

    // King removes alone
    if (isKing(cell.card)) {
      onRemoveAlone(cellId)
      setSelectedCellId(null)
      return
    }

    // No selection yet — select this cell
    if (selectedCellId === null) {
      setSelectedCellId(cellId)
      return
    }

    // Deselect if same cell tapped again
    if (selectedCellId === cellId) {
      setSelectedCellId(null)
      return
    }

    // Attempt pair
    onRemovePair(selectedCellId, cellId)
    setSelectedCellId(null)
  }

  function handleCellClick(cellId: PyramidCellId) {
    if (onBeforeCellClick) {
      const intercepted = onBeforeCellClick(cellId, baseCellHandler)
      if (intercepted) return
    }
    baseCellHandler(cellId)
  }

  function handleWasteTopClick() {
    if (status !== 'playing') return
    if (!wasteTop) return

    if (isKing(wasteTop)) {
      onRemoveWasteKing()
      setSelectedCellId(null)
      return
    }

    if (selectedCellId === null) return
    onRemovePairWithWaste(selectedCellId)
    setSelectedCellId(null)
  }

  function handleStockClick() {
    if (canDraw) {
      onDraw()
    } else if (canRecycle) {
      onRecycle()
    }
  }

  // Stock button: enabled if can draw OR can recycle
  const stockActionAvailable = canDraw || canRecycle

  const stockRowCtx: PyramidBoardBaseStockRowContext<T> = {
    stockCount,
    wasteTop,
    canDraw,
    canRecycle,
    recyclesRemaining,
    wasteRef,
    selectedCellId,
    handleStockClick,
    handleWasteTopClick,
    onDraw,
    onRecycle,
    game,
  }

  return (
    <PyramidWasteRefContext value={wasteRef}>
      <div className="flex flex-col gap-4">
        {/* Score display */}
        <div className="flex items-center justify-center gap-5 mb-3">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/50 px-6 py-3 min-w-20">
            <span className="text-xs font-medium text-muted-foreground">Score</span>
            <span className="text-xl font-bold text-primary tabular-nums">{score}</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/50 px-6 py-3 min-w-20">
            <span className="text-xs font-medium text-muted-foreground">Recycles</span>
            <span
              className={cn(
                'text-xl font-bold tabular-nums',
                recyclesRemaining > 0 ? 'text-foreground' : 'text-red-500',
              )}
            >
              {recyclesRemaining}
            </span>
          </div>
        </div>

        {/* Dev-only Victory/Game Over toggle buttons */}
        {import.meta.env.DEV && (
          <div className="flex items-center justify-center gap-2 -mt-5">
            <button
              type="button"
              onClick={() => setDevStatus(devStatus === 'won' ? null : 'won')}
              className="cursor-pointer rounded px-2 py-1 text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
            >
              {devStatus === 'won' ? 'Hide Victory' : 'Show Victory'} (Dev)
            </button>
            <button
              type="button"
              onClick={() => setDevStatus(devStatus === 'lost' ? null : 'lost')}
              className="cursor-pointer rounded px-2 py-1 text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
            >
              {devStatus === 'lost' ? 'Hide Game Over' : 'Show Game Over'} (Dev)
            </button>
          </div>
        )}

        {/* Board area — dimmed when game over */}
        <div className={cn('relative', isGameOver && 'opacity-50')}>
          {/* Pyramid grid */}
          <PyramidGrid
            cells={cells}
            availableCells={availableCells}
            selectedCellId={selectedCellId}
            onCellClick={handleCellClick}
          />

          {/* Stock + Waste row — custom or default */}
          {renderStockRow ? (
            renderStockRow(stockRowCtx)
          ) : (
            <div className="mt-6 flex items-center justify-center gap-12">
              <Stock
                count={stockCount}
                onClick={handleStockClick}
                disabled={!stockActionAvailable}
              />
              <div ref={wasteRef} className="inline-block">
                <div
                  className={cn(
                    'cursor-default',
                    selectedCellId !== null && wasteTop !== null && 'cursor-pointer',
                  )}
                  onClick={handleWasteTopClick}
                >
                  <Waste
                    topCard={wasteTop}
                    animate={false}
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Undo + How to Play buttons */}
        <div className="mt-6 flex items-center justify-evenly gap-8">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={cn(
              'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              !canUndo && 'cursor-not-allowed opacity-40',
            )}
          >
            Undo
          </button>
          <button
            type="button"
            onClick={onHowToPlay}
            className="cursor-pointer rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            How to Play
          </button>
          <button
            type="button"
            onClick={onNewGame}
            className={cn(
              "cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isGameOver ? "bg-primary text-primary-foreground hover:bg-primary" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {isGameOver ? 'Play Again' : 'New Game'}
          </button>
        </div>

        {/* End-game result */}
        {isGameOver && (
          <div className="flex flex-col items-center gap-3 py-2">
            <p
              className={cn(
                'text-xl font-black tracking-wide',
                effectiveStatus === 'won' ? 'text-primary' : 'text-red-500',
              )}
            >
              {effectiveStatus === 'won' ? 'VICTORY' : 'GAME OVER'}
            </p>
          </div>
        )}
      </div>
    </PyramidWasteRefContext>
  )
}
