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
        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-8">
            <div
              className="relative"
              style={{
                width: 'var(--card-width, 7rem)',
                height: 'var(--card-height, 10rem)',
              }}
            >
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
                            altGame.onRemovePairWithStock(ctx.selectedCellId)
                            ctx.clearSelection()
                            setSelectedIsStock(false)
                            setSelectedIsWaste(false)
                          } else if (selectedIsWaste) {
                            altGame.onRemovePairStockWithWaste()
                            setSelectedIsWaste(false)
                            setSelectedIsStock(false)
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

            <button
              type="button"
              className={cn(
                'rounded-full p-4 border border-gold/30 bg-gold/10 shadow-sm cursor-pointer transition-all',
                'text-gold hover:bg-gold/20 hover:border-gold/50 hover:scale-110 active:scale-95',
                !canAction && 'cursor-not-allowed opacity-20 hover:scale-100',
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
                    ctx.clearSelection()
                  } else if (selectedIsStock && ctx.game.stockTop) {
                    ctx.game.onRemovePairStockWithWaste()
                    setSelectedIsStock(false)
                    setSelectedIsWaste(false)
                    ctx.clearSelection()
                  } else if (ctx.selectedCellId !== null) {
                    ctx.handleWasteTopClick()
                    setSelectedIsWaste(false)
                    setSelectedIsStock(false)
                  } else if (selectedIsWaste) {
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
    [selectedIsStock, selectedIsWaste, altGame],
  )

  return (
    <PyramidBoardBase
      useGame={usePyramidAlt}
      onHowToPlay={onHowToPlay}
      renderStockRow={renderStockRow}
      onBeforeCellClick={onBeforeCellClick}
      variantId="pyramid-alt"
    />
  )
}
