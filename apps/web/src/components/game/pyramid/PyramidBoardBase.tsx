import { useRef, useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { Card, Waste } from '../index'
import StockEmptyIndicator from '../StockEmptyIndicator'
import PyramidGrid from './PyramidGrid'
import { PyramidWasteRefContext } from './PyramidWasteRefContext'
import { ConfirmModal } from '#/components/ConfirmModal'
import { isKing } from '#/lib/games/pyramid'
import type { PyramidCellId } from '#/lib/games/pyramid'
import type { Card as CardType } from '#/lib/types'
import type { UsePyramidResult } from '#/lib/hooks/usePyramid'

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
    onRestartGame,
    onUndo,
  } = game

  const wasteRef = useRef<HTMLDivElement>(null)
  const [selectedCellId, setSelectedCellId] = useState<PyramidCellId | null>(
    null,
  )
  const [selectedWaste, setSelectedWaste] = useState(false)
  const [devStatus, setDevStatus] = useState<'won' | 'lost' | null>(null)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [confirmNewGame, setConfirmNewGame] = useState(false)

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
      setSelectedWaste(false)
      return
    }

    // Waste was selected first — try to pair with this cell
    if (selectedWaste) {
      onRemovePairWithWaste(cellId)
      setSelectedWaste(false)
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
      setSelectedWaste(false)
      return
    }

    if (selectedCellId !== null) {
      onRemovePairWithWaste(selectedCellId)
      setSelectedCellId(null)
      setSelectedWaste(false)
      return
    }

    // Toggle waste selection
    setSelectedWaste((prev) => !prev)
  }

  function handleStockClick() {
    if (canDraw) {
      onDraw()
    } else if (canRecycle) {
      onRecycle()
    }
  }

  function clearSelection() {
    setSelectedCellId(null)
    setSelectedWaste(false)
  }

  const stockRowCtx: PyramidBoardBaseStockRowContext<T> = {
    stockCount,
    wasteTop,
    canDraw,
    canRecycle,
    recyclesRemaining,
    wasteRef,
    selectedCellId,
    clearSelection,
    handleStockClick,
    handleWasteTopClick,
    onDraw,
    onRecycle,
    game,
  }

  return (
    <PyramidWasteRefContext value={wasteRef}>
      <div className="flex flex-col">
        {/* Score display */}
        <div className="flex items-center justify-center gap-5 mb-6">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/50 px-6 py-3 min-w-20">
            <span className="text-xs font-medium text-muted-foreground">
              Score
            </span>
            <span className="text-xl font-bold text-primary tabular-nums">
              {score}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/50 px-6 py-3 min-w-20">
            <span className="text-xs font-medium text-muted-foreground">
              Recycles
            </span>
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

        {/* Action buttons */}
        <div className="flex flex-row justify-center px-3 gap-7 mb-10">
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
            onClick={() => setConfirmRestart(true)}
            className="cursor-pointer rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            Restart
          </button>
          <button
            type="button"
            onClick={() => setConfirmNewGame(true)}
            className={cn(
              'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              isGameOver
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            )}
          >
            {isGameOver ? 'Play Again' : 'New Game'}
          </button>
        </div>

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
              {stockCount > 0 ? (
                <div
                  className="cursor-pointer"
                  onClick={handleStockClick}
                  role="button"
                  aria-label={`Stock pile, ${stockCount} cards remaining`}
                >
                  <Card suit="spades" rank="A" faceUp={false} />
                </div>
              ) : (
                <StockEmptyIndicator
                  canRecycle={canRecycle}
                  onClick={handleStockClick}
                />
              )}
              <div ref={wasteRef} className="inline-block">
                <div
                  className={cn(
                    'cursor-default',
                    wasteTop !== null && 'cursor-pointer',
                  )}
                  onClick={handleWasteTopClick}
                >
                  <Waste
                    topCard={wasteTop}
                    highlighted={selectedWaste}
                    animate={false}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dev-only Victory/Game Over toggle buttons */}
        {import.meta.env.DEV && (
          <div className="mt-12 flex flex-col items-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-8">
            <span className="text-xs font-bold text-slate-100 dark:text-slate-400 uppercase tracking-wider">
              Dev Tools
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDevStatus(devStatus === 'won' ? null : 'won')}
                className="cursor-pointer rounded px-2 py-1 text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
              >
                {devStatus === 'won' ? 'Hide Victory' : 'Show Victory'}
              </button>
              <button
                type="button"
                onClick={() =>
                  setDevStatus(devStatus === 'lost' ? null : 'lost')
                }
                className="cursor-pointer rounded px-2 py-1 text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
              >
                {devStatus === 'lost' ? 'Hide Game Over' : 'Show Game Over'}
              </button>
            </div>
          </div>
        )}

        {/* End-game result */}
        {isGameOver && (
          <div className="flex flex-col items-center gap-3 py-2">
            <p
              className={cn(
                'rounded px-3 py-1.5 text-xl font-black tracking-wide',
                effectiveStatus === 'won'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
              )}
            >
              {effectiveStatus === 'won' ? 'VICTORY' : 'GAME OVER'}
            </p>
          </div>
        )}
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
