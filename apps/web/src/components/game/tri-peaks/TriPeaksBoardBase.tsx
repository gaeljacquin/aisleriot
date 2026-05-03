import { useRef, useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { Stock, Waste, GameControls } from '../index'
import PeakGrid from './PeakGrid'
import { WasteRefContext } from './WasteRefContext'
import { ConfirmModal } from '#/components/ConfirmModal'
import type { UseTriPeaksResult } from '#/lib/hooks/useTriPeaks'

interface TriPeaksBoardBaseProps {
  useGame: () => UseTriPeaksResult
  onHowToPlay: () => void
  variantName: string
}

export default function TriPeaksBoardBase({
  useGame,
  onHowToPlay: _onHowToPlay,
  variantName,
}: TriPeaksBoardBaseProps) {
  const {
    cells,
    availableCells,
    wasteTop,
    stockCount,
    canDraw,
    chain,
    score,
    status,
    canUndo,
    onPlayCard,
    onDraw,
    onNewGame,
    onRestartGame,
    onUndo,
    isValidMove,
  } = useGame()

  const wasteRef = useRef<HTMLDivElement>(null)
  const lastAction = useRef<'draw' | 'play'>('play')
  const [devStatus, setDevStatus] = useState<'won' | 'lost' | null>(null)
  const [showDevTools, setShowDevTools] = useState(false)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [confirmNewGame, setConfirmNewGame] = useState(false)

  const effectiveStatus = devStatus ?? status
  const isGameOver = effectiveStatus === 'won' || effectiveStatus === 'lost'

  return (
    <WasteRefContext value={wasteRef}>
      <div className="flex flex-1 flex-col min-h-0">
        {/* Board area — dimmed when game over */}
        <div className={cn('relative', isGameOver && 'opacity-50')}>
          {/* Pyramid */}
          <PeakGrid
            cells={cells}
            availableCells={availableCells}
            onPlayCard={(id) => {
              lastAction.current = 'play'
              onPlayCard(id)
            }}
            isValidMove={isValidMove}
          />

          {/* Stock + Waste row */}
          <div className="mt-10 flex items-center justify-center gap-20">
            <Stock
              count={stockCount}
              onClick={() => {
                lastAction.current = 'draw'
                onDraw()
              }}
              disabled={!canDraw}
            />
            <div ref={wasteRef} className="inline-block">
              <Waste topCard={wasteTop} animate={false} />
            </div>
          </div>
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
          moveCount={chain} // TriPeaks uses chain as a key stat
          variantName={variantName}
          devMoveAnywhere={devStatus === 'won'}
          onToggleMoveAnywhere={() =>
            setDevStatus(devStatus === 'won' ? null : 'won')
          }
          devPeekTableau={devStatus === 'lost'}
          onTogglePeekTableau={() =>
            setDevStatus(devStatus === 'lost' ? null : 'lost')
          }
        />

        {/* End-game result — shown below board, NOT absolute */}

        {isGameOver && (
          <div className="flex flex-col items-center gap-3 py-4 mt-4">
            <p
              className={cn(
                'rounded px-3 py-1.5 text-3xl font-black tracking-wide',
                effectiveStatus === 'won'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
              )}
            >
              {effectiveStatus === 'won' ? 'VICTORY' : 'GAME OVER'}
            </p>
          </div>
        )}

        {/* Dev-only Victory/Game Over toggle buttons */}
        {/* {import.meta.env.DEV && showDevTools && (
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
        )} */}

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
      </div>
    </WasteRefContext>
  )
}
