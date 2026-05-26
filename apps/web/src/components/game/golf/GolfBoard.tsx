import { useRef, useState, useMemo } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { Waste, Stock } from '../index'
import { BoardLabel } from '../BoardLabel'
import { TopBar } from '@/components/layout/TopBar'
import { ActionRail } from '@/components/layout/ActionRail'
import { ConfirmModal } from '#/components/ConfirmModal'
import { getVariant } from '@workspace/constants'
import { useGolf } from '#/lib/hooks/useGolf'
import {
  PlusSignIcon,
  UndoIcon,
  Refresh04Icon,
  BookOpen01Icon,
  TouchIcon,
  ChampionIcon,
  Cancel01Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import { useDevModeStore } from '#/stores/dev-mode'
import { VictoryFanOut } from '..'
import { useVictoryAnimationStore } from '#/stores/victory-animation'
import GolfColumn from './GolfColumn'
import { WasteRefContext } from './WasteRefContext'

interface GolfBoardProps {
  onHowToPlay: () => void
}

export function GolfBoard({ onHowToPlay }: GolfBoardProps) {
  const { isAnimating: isVictoryAnimating } = useVictoryAnimationStore()
  const {
    columns,
    wasteTop,
    stockCount,
    canDraw,
    score,
    moveCount,
    status,
    canUndo,
    onPlayCard,
    onDraw,
    onNewGame,
    onRestartGame,
    onUndo,
    isValidMove,
    devSetStatus,
  } = useGolf()

  const variant = getVariant('golf')
  const wasteRef = useRef<HTMLDivElement>(null)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [confirmNewGame, setConfirmNewGame] = useState(false)

  const isGameOver = status === 'won' || status === 'lost'

  const { isDevMode, toggleDevMode } = useDevModeStore()

  const stats = useMemo(
    () => [
      { label: 'Cleared', value: `${score}/35` },
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
      disabled: !canUndo || isGameOver,
    },
    { icon: BookOpen01Icon, label: 'How to Play', onClick: onHowToPlay },
  ]

  const [devMoveAnywhere, setDevMoveAnywhere] = useState(false)

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
    <WasteRefContext value={wasteRef}>
      <style>{`
        .golf-container {
          --card-width: 8rem;
          --card-height: 11.4rem;
          --card-gap-x: 1.5rem;
          --card-overlap-y: 2.5rem;
          --rail-gap: 4rem;
        }

        @media (max-width: 1536px) {
          .golf-container {
            --card-width: clamp(3.5rem, min(9vw, 14vh), 7.5rem);
            --card-height: calc(var(--card-width) * 1.428);
            --card-gap-x: clamp(0.5rem, 1.5vw, 1.25rem);
            --card-overlap-y: calc(var(--card-height) * 0.22);
            --rail-gap: 3vmin;
          }
        }

        @media (max-width: 640px) {
          .golf-container {
            --card-width: clamp(2.2rem, 12vw, 4.5rem);
            --card-height: calc(var(--card-width) * 1.428);
            --card-gap-x: 0.4rem;
            --card-overlap-y: calc(var(--card-height) * 0.25);
            --rail-gap: 2vmin;
          }
        }
      `}</style>
      <div className="flex h-full flex-col golf-container">
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
              'mx-auto w-fit flex flex-col items-center gap-8',
              status === 'lost' && 'opacity-50',
              isVictoryAnimating && 'pointer-events-none',
            )}
          >
            {/* Tableau */}
            <div
              className="flex justify-center"
              style={{ gap: 'var(--card-gap-x)' }}
            >
              {columns.map((column) => (
                <GolfColumn
                  key={column.id}
                  column={column}
                  onPlayCard={onPlayCard}
                  isValidMove={(id) => devMoveAnywhere || isValidMove(id)}
                />
              ))}
            </div>

            {/* Stock + Waste row */}
            <div
              className="mt-6 flex items-center justify-center"
              style={{ gap: 'var(--rail-gap)' }}
            >
              <div className="flex flex-col items-center gap-2">
                <BoardLabel label="Stock" />
                <Stock
                  count={stockCount}
                  onClick={onDraw}
                  disabled={!canDraw}
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <BoardLabel label="Waste" color="gold" />
                <div
                  ref={wasteRef}
                  className="relative"
                  style={{
                    width: 'var(--card-width)',
                    height: 'var(--card-height)',
                  }}
                >
                  <Waste topCard={wasteTop} animate={false} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <VictoryFanOut isVisible={status === 'won'} />

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
    </WasteRefContext>
  )
}
