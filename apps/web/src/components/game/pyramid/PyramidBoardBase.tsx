import { useRef, useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { Card, Waste, GameControls } from '../index'
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
  variantName: string
}

export default function PyramidBoardBase<T extends UsePyramidResult>({
  useGame,
  onHowToPlay: _onHowToPlay,
  renderStockRow,
  onBeforeCellClick,
  variantName,
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
  const [showDevTools, setShowDevTools] = useState(false)
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
      <div className="flex flex-1 flex-col min-h-0">
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
            <div className="mt-10 flex items-center justify-center gap-20">
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

        {/* Spacer to push controls to the bottom */}
        <div className="flex-1" />

        {/* Action buttons + Stats */}
        <GameControls
          onUndo={onUndo}
          canUndo={canUndo}
          onHowToPlay={_onHowToPlay}
          onRestart={() => setConfirmRestart(true)}
          onNewGame={() => setConfirmNewGame(true)}
          isGameOver={isGameOver}
          showDevTools={showDevTools}
          onToggleDevTools={() => setShowDevTools(!showDevTools)}
          score={score}
          moveCount={score} // Pyramid uses score as a proxy for progress
          redealsLeft={recyclesRemaining}
          variantName={variantName}
          devMoveAnywhere={devStatus === 'won'}
          onToggleMoveAnywhere={() => setDevStatus(devStatus === 'won' ? null : 'won')}
          devPeekTableau={devStatus === 'lost'}
          onTogglePeekTableau={() => setDevStatus(devStatus === 'lost' ? null : 'lost')}
        />

        {/* End-game result */}

        {isGameOver && (
          <div className="flex flex-col items-center gap-3 py-2 mt-2">
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
