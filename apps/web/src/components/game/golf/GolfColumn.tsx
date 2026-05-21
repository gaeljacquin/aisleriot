import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { createPortal } from 'react-dom'
import Card from '../Card'
import CardSlot from '../CardSlot'
import { useWasteRef } from './WasteRefContext'
import type { Pile } from '#/lib/types'

interface GolfColumnProps {
  column: Pile
  onPlayCard: (columnId: string) => void
  isValidMove: (columnId: string) => boolean
}

interface FlyState {
  startX: number
  startY: number
  endX: number
  endY: number
}

export default function GolfColumn({
  column,
  onPlayCard,
  isValidMove,
}: GolfColumnProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const wasteRef = useWasteRef()
  const [flyState, setFlyState] = useState<FlyState | null>(null)

  const cards = column.cards
  const topCardIdx = cards.length - 1

  function handleClick() {
    if (cards.length === 0) return

    if (!isValidMove(column.id)) {
      onPlayCard(column.id)
      return
    }

    const cardEl = cardRef.current
    const wasteEl = wasteRef?.current
    if (!cardEl || !wasteEl) {
      onPlayCard(column.id)
      return
    }

    const cardRect = cardEl.getBoundingClientRect()
    const wasteRect = wasteEl.getBoundingClientRect()

    setFlyState({
      startX: cardRect.left,
      startY: cardRect.top,
      endX: wasteRect.left,
      endY: wasteRect.top,
    })
  }

  const containerHeight =
    cards.length === 0
      ? 'var(--card-height)'
      : `calc((${cards.length} - 1) * var(--card-overlap-y) + var(--card-height))`

  return (
    <div
      className="relative"
      style={{
        width: 'var(--card-width)',
        minHeight: containerHeight,
      }}
    >
      <CardSlot role="tableau" className="absolute top-0 left-0" />

      {cards.map((card, i) => {
        const isTop = i === topCardIdx
        const isFlying = flyState && isTop

        return (
          <div
            key={card.id}
            ref={isTop ? cardRef : undefined}
            className="absolute"
            style={{
              top: `calc(${i} * var(--card-overlap-y))`,
              left: 0,
              zIndex: i,
              width: 'var(--card-width)',
              height: 'var(--card-height)',
            }}
          >
            {isTop ? (
              <div className="h-full w-full">
                {!isFlying && (
                  <Card
                    suit={card.suit}
                    rank={card.rank}
                    faceUp={true}
                    onClick={handleClick}
                  />
                )}
              </div>
            ) : (
              <Card suit={card.suit} rank={card.rank} faceUp={true} />
            )}
          </div>
        )
      })}

      {/* Flying card portal */}
      {flyState &&
        createPortal(
          <motion.div
            className="golf-container"
            style={{
              position: 'fixed',
              left: flyState.startX,
              top: flyState.startY,
              width: 'var(--card-width)',
              height: 'var(--card-height)',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: flyState.endX - flyState.startX,
              y: flyState.endY - flyState.startY,
              opacity: 0,
              scale: 0.85,
            }}
            transition={{ duration: 0.3, ease: 'easeIn' }}
            onAnimationComplete={() => {
              setFlyState(null)
              onPlayCard(column.id)
            }}
          >
            <Card
              suit={cards[topCardIdx].suit}
              rank={cards[topCardIdx].rank}
              faceUp={true}
            />
          </motion.div>,
          document.body,
        )}
    </div>
  )
}
