import { useRef, useState, useMemo } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { Waste, Stock } from '../index'
import PeakGrid from './PeakGrid'
import { WasteRefContext } from './WasteRefContext'
import { TopBar } from '@/components/layout/TopBar'
import { ActionRail } from '@/components/layout/ActionRail'
import { DevRail } from '@/components/layout/DevRail'
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
    <WasteRefContext value={wasteRef}>
      <style>{`
        .tri-peaks-container {
          --card-width: 7rem;
          --card-height: 10rem;
          --card-gap-tri: 1rem;
          --card-overlap-tri: 4rem;
          --card-step-x: calc(var(--card-width) + var(--card-gap-tri));
          --card-step-y: calc(var(--card-height) - var(--card-overlap-tri));
          --rail-gap: 4rem;
        }

        @media (max-width: 1400px) {
          .tri-peaks-container {
            --card-width: 6rem;
            --card-height: 8.5rem;
            --card-gap-tri: 0.75rem;
            --card-overlap-tri: 3.5rem;
            --rail-gap: 3rem;
          }
        }

        @media (max-width: 1200px) {
          .tri-peaks-container {
            --card-width: 5.25rem;
            --card-height: 7.5rem;
            --card-gap-tri: 0.5rem;
            --card-overlap-tri: 3rem;
            --rail-gap: 2.5rem;
          }
        }

        @media (max-width: 1000px) {
          .tri-peaks-container {
            --card-width: 4.5rem;
            --card-height: 6.4rem;
            --card-gap-tri: 0.25rem;
            --card-overlap-tri: 2.5rem;
            --rail-gap: 2rem;
          }
        }

        @media (max-width: 800px) {
          .tri-peaks-container {
            --card-width: 3.75rem;
            --card-height: 5.35rem;
            --card-gap-tri: 0.125rem;
            --card-overlap-tri: 2rem;
            --rail-gap: 1.5rem;
          }
        }
      `}</style>
      <div className="flex h-full flex-col tri-peaks-container">
        <TopBar
          title={variant.name}
          subtitle={variant.subtitle}
          stats={stats}
          status={status}
          className="mb-8"
        />

        {/* Board Container */}
        <div className="flex-1 overflow-auto felt-scroll px-0 py-4 sm:py-8">
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

            {/* Stock + Waste row + Split Rails */}
            <div
              className="mt-6 flex items-center justify-center"
              style={{ gap: 'var(--rail-gap)' }}
            >
              <ActionRail
                actions={actions.slice(0, 3)}
                orientation="vertical"
                showBackLink={false}
                showDivider={false}
                showSettingsLink={false}
                className="hidden md:flex"
              />

              <div className="flex items-center gap-4 sm:gap-8">
                <Stock
                  count={stockCount}
                  onClick={onDraw}
                  disabled={!canDraw}
                />
                <div ref={wasteRef} className="inline-block">
                  <Waste topCard={wasteTop} animate={false} />
                </div>
              </div>

              <ActionRail
                actions={actions.slice(3)}
                orientation="vertical"
                className="hidden md:flex"
              />
            </div>

            {/* Mobile Action Rails */}
            <div className="flex flex-col gap-2 md:hidden w-full">
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

            {/* Centered Dev Rail (Desktop) */}
            <div className="hidden md:flex justify-center mt-4">
              <DevRail actions={devActions} orientation="horizontal" />
            </div>
          </div>
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
