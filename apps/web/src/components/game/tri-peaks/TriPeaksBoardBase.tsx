import { useRef, useState, useMemo } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { Waste, Stock } from '../index'
import PeakGrid from './PeakGrid'
import { WasteRefContext } from './WasteRefContext'
import { TopBar } from '@/components/layout/TopBar'
import { ActionRail } from '@/components/layout/ActionRail'
import { ConfirmModal } from '#/components/ConfirmModal'
import { getVariant } from '@workspace/constants'
import type { GameVariantId } from '@workspace/constants'
import type { UseTriPeaksResult } from '#/lib/hooks/useTriPeaks'
import {
  PlusSignIcon,
  UndoIcon,
  Refresh04Icon,
  BookOpen01Icon,
  TouchIcon,
  ChampionIcon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'

interface TriPeaksBoardBaseProps {
  useGame: () => UseTriPeaksResult
  onHowToPlay: () => void
  variantId: GameVariantId
}

export default function TriPeaksBoardBase({
  useGame,
  onHowToPlay,
  variantId,
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
    devSetStatus,
  } = useGame()

  const variant = getVariant(variantId)
  const wasteRef = useRef<HTMLDivElement>(null)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [confirmNewGame, setConfirmNewGame] = useState(false)

  const isGameOver = status === 'won' || status === 'lost'

  const stats = useMemo(
    () => [
      { label: 'Score', value: score },
      { label: 'Chain', value: chain },
    ],
    [score, chain],
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
    <WasteRefContext value={wasteRef}>
      <style>{`
        .tri-peaks-container {
          --card-width: 7.5rem;
          --card-height: 10.7rem;
          --card-gap-tri: 1.25rem;
          --card-overlap-tri: 4rem;
          --card-step-x: 8.5rem;
          --card-step-y: 6.7rem;
          --rail-gap: 4rem;
        }

        @media (max-width: 1536px) {
          .tri-peaks-container {
            --card-width: clamp(3rem, min(8vw, 13vh), 7.2rem);
            --card-height: calc(var(--card-width) * 1.428);
            --card-step-x: calc(var(--card-width) * 1.13);
            --card-step-y: calc(var(--card-height) * 0.58);
            --rail-gap: 3vmin;
          }
        }

        @media (max-width: 640px) {
          .tri-peaks-container {
            --card-width: clamp(1.8rem, min(8.5vw, 12vh), 3.8rem);
            --card-height: calc(var(--card-width) * 1.428);
            --card-step-x: calc(var(--card-width) * 1.08);
            --card-step-y: calc(var(--card-height) * 0.55);
            --rail-gap: 2vmin;
          }
        }
      `}</style>
      <div className="flex h-full flex-col tri-peaks-container">
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
              status !== 'playing' && status !== 'idle' && 'opacity-50',
            )}
          >
            {/* Pyramid */}
            <PeakGrid
              cells={cells}
              availableCells={availableCells}
              onPlayCard={onPlayCard}
              isValidMove={(id) => devMoveAnywhere || isValidMove(id)}
            />

            {/* Stock + Waste row */}
            <div
              className="mt-6 flex items-center justify-center"
              style={{ gap: 'var(--rail-gap)' }}
            >
              <div
                className="flex items-center"
                style={{ gap: 'var(--rail-gap)' }}
              >
                <Stock
                  count={stockCount}
                  onClick={onDraw}
                  disabled={!canDraw}
                />
                <div ref={wasteRef} className="inline-block">
                  <Waste topCard={wasteTop} animate={false} />
                </div>
              </div>
            </div>
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
    </WasteRefContext>
  )
}
