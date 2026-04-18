import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon, Refresh01Icon } from '@hugeicons/core-free-icons'
import { cn } from '@workspace/ui/lib/utils'
import Card from '../Card'
import CardSlot from '../CardSlot'
import StockEmptyIndicator from '../StockEmptyIndicator'
import PyramidBoardBase from './PyramidBoardBase'
import { usePyramidAlt } from '#/lib/hooks/usePyramidAlt'
import type { UsePyramidAltResult } from '#/lib/hooks/usePyramidAlt'
import { isKing } from '#/lib/games/pyramid'
import type { PyramidCellId } from '#/lib/games/pyramid'
import type { PyramidBoardBaseStockRowContext } from './PyramidBoardBase'

interface PyramidAltBoardProps {
  onHowToPlay: () => void
}

export default function PyramidAltBoard({ onHowToPlay }: PyramidAltBoardProps) {
  const [selectedIsStock, setSelectedIsStock] = useState(false)
  const [selectedIsWaste, setSelectedIsWaste] = useState(false)
  const altGame = usePyramidAlt()

  const onBeforeCellClick = useCallback(
    (
      cellId: PyramidCellId,
      _defaultHandler: (id: PyramidCellId) => void,
    ): boolean => {
      if (selectedIsStock) {
        altGame.onRemovePairWithStock(cellId)
        setSelectedIsStock(false)
        return true
      }
      if (selectedIsWaste) {
        // Pair waste top with this cell via the base handler (selectedCellId is null here,
        // so we can't use handleWasteTopClick directly — call the store action instead)
        altGame.onRemovePairWithWaste(cellId)
        setSelectedIsWaste(false)
        return true
      }
      return false
    },
    [selectedIsStock, selectedIsWaste, altGame],
  )

  const renderStockRow = useCallback(
    (ctx: PyramidBoardBaseStockRowContext<UsePyramidAltResult>) => {
      const canAction =
        (ctx.canDraw && !ctx.game.stockTopIsKing) || ctx.canRecycle

      return (
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-4">
            {/* Stock top — face-up, interactive */}
            <div className="relative h-28 w-20">
              {/* Persistent background: face-down card while stock has cards, empty indicator otherwise */}
              {ctx.stockCount > 0 ? (
                <Card
                  suit="spades"
                  rank="A"
                  faceUp={false}
                  className="absolute inset-0"
                />
              ) : (
                <StockEmptyIndicator
                  canRecycle={ctx.canRecycle}
                  onClick={ctx.onRecycle}
                />
              )}

              {/* Animated face-up stockTop overlay */}
              {ctx.stockCount > 0 && ctx.game.stockTop && (
                <div className="absolute inset-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${ctx.game.stockTop.suit}-${ctx.game.stockTop.rank}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={
                        ctx.game.stockTopIsKing
                          ? { rotateY: 360, opacity: 0, scale: 0 }
                          : { opacity: 0 }
                      }
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <Card
                        suit={ctx.game.stockTop.suit}
                        rank={ctx.game.stockTop.rank}
                        faceUp={true}
                        highlighted={selectedIsStock}
                        onClick={() => {
                          if (ctx.game.stockTopIsKing) {
                            ctx.game.onRemoveAloneFromStock()
                            setSelectedIsStock(false)
                            setSelectedIsWaste(false)
                            ctx.clearSelection()
                          } else if (ctx.selectedCellId !== null) {
                            // A pyramid cell is selected — clicking stock should deselect it, not select stock
                            ctx.clearSelection()
                          } else {
                            setSelectedIsWaste(false)
                            setSelectedIsStock((prev) => !prev)
                          }
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Draw / Recycle button */}
            <button
              type="button"
              className={cn(
                'rounded-xl p-3 shadow-md cursor-pointer transition-colors',
                'bg-teal-600 dark:bg-teal-500 text-primary-foreground hover:bg-primary/90',
                !canAction && 'cursor-not-allowed opacity-40',
              )}
              disabled={!canAction}
              onClick={() => {
                setSelectedIsStock(false)
                setSelectedIsWaste(false)
                if (ctx.canDraw && !ctx.game.stockTopIsKing) ctx.onDraw()
                else if (ctx.canRecycle) ctx.onRecycle()
              }}
              aria-label={
                ctx.canDraw && !ctx.game.stockTopIsKing
                  ? 'Draw card'
                  : 'Recycle waste'
              }
            >
              <HugeiconsIcon
                icon={
                  !ctx.canDraw && ctx.canRecycle
                    ? Refresh01Icon
                    : ArrowRight02Icon
                }
                className="size-6"
              />
            </button>

            {/* Waste pile */}
            <div ref={ctx.wasteRef} className="inline-block">
              <div
                className={cn(
                  'cursor-default',
                  ctx.wasteTop !== null && 'cursor-pointer',
                )}
                onClick={() => {
                  if (!ctx.wasteTop) return
                  if (isKing(ctx.wasteTop)) {
                    ctx.game.onRemoveWasteKing()
                    setSelectedIsStock(false)
                    setSelectedIsWaste(false)
                  } else if (selectedIsStock && ctx.game.stockTop) {
                    ctx.game.onRemovePairStockWithWaste()
                    setSelectedIsStock(false)
                  } else if (ctx.selectedCellId !== null) {
                    ctx.handleWasteTopClick()
                    setSelectedIsWaste(false)
                  } else if (selectedIsWaste) {
                    // Deselect on second click
                    setSelectedIsWaste(false)
                  } else {
                    setSelectedIsStock(false)
                    setSelectedIsWaste(true)
                  }
                }}
              >
                {ctx.wasteTop ? (
                  <Card
                    suit={ctx.wasteTop.suit}
                    rank={ctx.wasteTop.rank}
                    faceUp={true}
                    highlighted={selectedIsWaste}
                  />
                ) : (
                  <CardSlot role="waste" />
                )}
              </div>
            </div>
          </div>
        </div>
      )
    },
    [selectedIsStock, selectedIsWaste],
  )

  return (
    <PyramidBoardBase
      useGame={usePyramidAlt}
      onHowToPlay={onHowToPlay}
      renderStockRow={renderStockRow}
      onBeforeCellClick={onBeforeCellClick}
    />
  )
}
