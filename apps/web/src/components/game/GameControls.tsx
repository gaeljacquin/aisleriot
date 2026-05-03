import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { cn } from '@workspace/ui/lib/utils'

interface GameControlsProps {
  onUndo: () => void
  canUndo: boolean
  onHowToPlay: () => void
  onRestart: () => void
  onNewGame: () => void
  isGameOver: boolean
  showDevTools?: boolean
  onToggleDevTools?: () => void
  // Stats
  score: number
  moveCount: number
  redealsLeft?: number | null
  // Game Info
  variantName: string
  // Dev toggles
  devMoveAnywhere?: boolean
  onToggleMoveAnywhere?: () => void
  devPeekTableau?: boolean
  onTogglePeekTableau?: () => void
}

export default function GameControls({
  onUndo,
  canUndo,
  onHowToPlay,
  onRestart,
  onNewGame,
  showDevTools: _showDevTools,
  onToggleDevTools: _onToggleDevTools,
  score,
  moveCount,
  redealsLeft,
  variantName,
  devMoveAnywhere,
  onToggleMoveAnywhere,
  devPeekTableau,
  onTogglePeekTableau,
}: GameControlsProps) {
  const [isReturnHovered, setIsReturnHovered] = useState(false)

  return (
    <div className="flex flex-col items-center pb-4">
      <div className="flex flex-col items-center gap-6">
        {/* Game Mode Name */}
        <h1 className="rounded-lg bg-amber-100 px-4 py-1.5 text-2xl font-bold text-amber-900 shadow-sm dark:bg-amber-950 dark:text-amber-100">
          {variantName}
        </h1>

        {/* Stats Boxes */}
        <div className="flex items-center gap-4">
          <div className="flex min-w-28 flex-col items-center rounded-2xl bg-muted/60 px-8 py-2 shadow-inner border border-white/10">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/90">
              Score
            </span>
            <span className="text-2xl font-black tabular-nums text-green-700 dark:text-green-400">
              {score}
            </span>
          </div>
          <div className="flex min-w-28 flex-col items-center rounded-2xl bg-muted/60 px-8 py-2 shadow-inner border border-white/10">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/90">
              Moves
            </span>
            <span className="text-2xl font-black tabular-nums text-foreground">
              {moveCount}
            </span>
          </div>
          {redealsLeft !== undefined && redealsLeft !== null && (
            <div className="flex min-w-28 flex-col items-center rounded-2xl bg-muted/60 px-8 py-2 shadow-inner border border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/90">
                Recycles
              </span>
              <span className="text-2xl font-black tabular-nums text-foreground">
                {redealsLeft}
              </span>
            </div>
          )}
        </div>

        {/* Main Actions Row */}
        <div className="flex flex-row flex-wrap justify-center gap-4 px-3">
          <Link
            to="/new-game"
            onMouseEnter={() => setIsReturnHovered(true)}
            onMouseLeave={() => setIsReturnHovered(false)}
            className={cn(
              'inline-flex items-center gap-2 cursor-pointer rounded-xl px-6 py-3 text-lg font-bold transition-all no-underline shadow-md active:scale-95',
              'bg-[#DC143C] text-white hover:bg-[#B21031]',
            )}
          >
            <motion.span
              animate={isReturnHovered ? { x: [0, -2, 0] } : { x: 0 }}
              transition={{
                duration: 0.6,
                repeat: isReturnHovered ? Infinity : 0,
                ease: 'easeInOut',
              }}
              className="flex items-center"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} className="size-5" />
            </motion.span>
            Game Menu
          </Link>

          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={cn(
              'cursor-pointer rounded-xl px-6 py-3 text-lg font-bold transition-all bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95',
              !canUndo && 'cursor-not-allowed opacity-40 active:scale-100',
            )}
          >
            Undo
          </button>

          <button
            type="button"
            onClick={onHowToPlay}
            className="cursor-pointer rounded-xl bg-secondary px-6 py-3 text-lg font-bold text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-95"
          >
            How to Play
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="cursor-pointer rounded-xl bg-secondary px-6 py-3 text-lg font-bold text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-95"
          >
            Restart
          </button>

          <button
            type="button"
            onClick={onNewGame}
            className="cursor-pointer rounded-xl bg-secondary px-6 py-3 text-lg font-bold text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-95"
          >
            New Game
          </button>
        </div>

        {/* Dev Tools Section */}
        {import.meta.env.DEV && (
          <div className="flex flex-col items-center gap-4 w-full max-w-2xl pt-4">
            {/* Separator */}
            <div className="h-px w-full bg-white/10 shadow-[0_1px_0_rgba(0,0,0,0.05)]" />

            <div className="flex flex-col items-center gap-3">
              <span className="rounded-full bg-slate-900/40 px-3 py-0.5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-100 backdrop-blur-sm border border-white/10">
                Developer Tools
              </span>
              <div className="flex flex-row flex-wrap justify-center gap-3">
                {onToggleMoveAnywhere && (
                  <button
                    type="button"
                    onClick={onToggleMoveAnywhere}
                    className={cn(
                      'cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm',
                      devMoveAnywhere
                        ? 'bg-blue-600 text-white border border-blue-400/50'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/5',
                    )}
                  >
                    Move Anywhere: {devMoveAnywhere ? 'ON' : 'OFF'}
                  </button>
                )}
                {onTogglePeekTableau && (
                  <button
                    type="button"
                    onClick={onTogglePeekTableau}
                    className={cn(
                      'cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm',
                      devPeekTableau
                        ? 'bg-amber-600 text-white border border-amber-400/50'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/5',
                    )}
                  >
                    Peek Tableau: {devPeekTableau ? 'ON' : 'OFF'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
