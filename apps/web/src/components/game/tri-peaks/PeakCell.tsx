import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { createPortal } from 'react-dom'
import Card from '../Card'
import { useWasteRef } from './WasteRefContext'
import type { TriPeaksCell, TriPeaksCellId } from '#/lib/games/tri-peaks'

interface PeakCellProps {
  cell: TriPeaksCell
  isAvailable: boolean
  onClick: (id: TriPeaksCellId) => void
  isValidMove: (id: TriPeaksCellId) => boolean
}

interface FlyState {
  startX: number
  startY: number
  endX: number
  endY: number
}

export default function PeakCell({
  cell,
  isAvailable,
  onClick,
  isValidMove,
}: PeakCellProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const wasteRef = useWasteRef()
  const [flyState, setFlyState] = useState<FlyState | null>(null)

  function handleClick() {
    if (!isAvailable) return

    if (!isValidMove(cell.id)) {
      onClick(cell.id)
      return
    }

    const cardEl = cardRef.current
    const wasteEl = wasteRef?.current
    if (!cardEl || !wasteEl) {
      onClick(cell.id)
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

  // Removed cells keep their space in the layout but don't block clicks
  if (cell.removed) {
    return (
      <div
        className="pointer-events-none"
        style={{
          width: 'var(--card-width, 7rem)',
          height: 'var(--card-height, 10rem)',
        }}
        aria-hidden="true"
      />
    )
  }

  const isBlocked = !isAvailable

  if (isBlocked) {
    return (
      <div
        style={{
          width: 'var(--card-width, 7rem)',
          height: 'var(--card-height, 10rem)',
        }}
      >
        <Card suit={cell.card.suit} rank={cell.card.rank} faceUp={false} />
      </div>
    )
  }

  return (
    <>
      <div
        ref={cardRef}
        style={{
          width: 'var(--card-width, 7rem)',
          height: 'var(--card-height, 10rem)',
        }}
      >
        {!flyState && (
          <Card
            suit={cell.card.suit}
            rank={cell.card.rank}
            faceUp={true}
            onClick={handleClick}
          />
        )}
      </div>

      {/* Flying card portal — renders at document.body level with fixed positioning */}
      {flyState &&
        createPortal(
          <motion.div
            className="tri-peaks-container"
            style={{
              position: 'fixed',
              left: flyState.startX,
              top: flyState.startY,
              width: 'var(--card-width, 7rem)',
              height: 'var(--card-height, 10rem)',
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
              onClick(cell.id)
            }}
          >
            <Card suit={cell.card.suit} rank={cell.card.rank} faceUp={true} />
          </motion.div>,
          document.body,
        )}
    </>
  )
}
