import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft02Icon, PropertyViewIcon } from '@hugeicons/core-free-icons'
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
}

export default function GameControls({
  onUndo,
  canUndo,
  onHowToPlay,
  onRestart,
  onNewGame,
  showDevTools,
  onToggleDevTools,
}: GameControlsProps) {
  const [isMenuHovered, setIsMenuHovered] = useState(false)

  return (
    <div className="flex flex-row flex-wrap justify-center gap-4 px-3 mb-10">
            <Link
        to="/new-game"
        onMouseEnter={() => setIsMenuHovered(true)}
        onMouseLeave={() => setIsMenuHovered(false)}
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors no-underline',
          'bg-[#DC143C] text-white hover:bg-[#B21031]',
        )}
      >
        <motion.span
          animate={isMenuHovered ? { x: [0, -3, 0] } : { x: 0 }}
          transition={{
            duration: 0.6,
            repeat: isMenuHovered ? Infinity : 0,
            ease: 'easeInOut',
          }}
          className="flex items-center"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
        </motion.span>
        Game Menu
      </Link>

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
        onClick={onRestart}
        className="cursor-pointer rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
      >
        Restart
      </button>

      <button
        type="button"
        onClick={onNewGame}
        className={cn(
          'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        )}
      >
        New Game
      </button>

      {/* Dev Tools Toggle */}
      {import.meta.env.DEV && onToggleDevTools && (
        <button
          type="button"
          onClick={onToggleDevTools}
          className={cn(
            'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            showDevTools
              ? 'bg-slate-700 text-white hover:bg-slate-800'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          )}
          title="Toggle Dev Tools"
        >
          <HugeiconsIcon icon={PropertyViewIcon} className="size-4" />
        </button>
      )}
    </div>
  )
}
