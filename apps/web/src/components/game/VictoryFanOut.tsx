import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { motion } from 'motion/react'
import { cn } from '@workspace/ui/lib/utils'
import { useVictoryAnimationStore } from '#/stores/victory-animation'
import Card from './Card'
import type { Suit, Rank } from '#/lib/types'

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
const RANKS: Rank[] = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
]
const ALL_CARDS = SUITS.flatMap((suit) =>
  RANKS.map((rank) => ({ id: `${rank}-${suit}`, suit, rank })),
)

interface CardState {
  id: string
  suit: Suit
  rank: Rank
  initialX: number
  initialY: number
  targetX: number
  targetY: number
  rotation: number
  originalZIndex: number
  returnX?: number
  returnY?: number
  returnZIndex?: number
}

interface VictoryFanOutProps {
  isVisible: boolean
}

export default function VictoryFanOut({ isVisible }: VictoryFanOutProps) {
  const [cards, setCards] = useState<CardState[]>([])
  const [isReturning, setIsReturning] = useState(false)
  const [isBoardReset, setIsBoardReset] = useState(false)
  
  const { isAnimating, setIsAnimating } = useVictoryAnimationStore()
  const maxZIndexRef = useRef(100)
  
  // Use layout effect to measure before paint when becoming visible
  useLayoutEffect(() => {
    if (isVisible && !isAnimating) {
      setIsAnimating(true)
      setIsReturning(false)

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const cardWidth = 112 
      const cardHeight = 160

      const domCards = Array.from(document.querySelectorAll('[data-card-id]:not(.victory-card)'))

      const capturedCards = ALL_CARDS.map((cardInfo) => {
        const el = document.querySelector(`[data-card-id="${cardInfo.id}"]`)
        if (!el) return null

        let initialX = viewportWidth / 2 - cardWidth / 2
        let initialY = viewportHeight / 2 - cardHeight / 2
        let originalZIndex = 0

        const rect = el.getBoundingClientRect()
        initialX = rect.left
        initialY = rect.top

        const domOrder = domCards.indexOf(el)
        originalZIndex = domOrder !== -1 ? domOrder : 0

        const targetX =
          Math.random() * (viewportWidth - 80 + cardWidth) + (40 - cardWidth)
        const targetY =
          Math.random() * (viewportHeight - 80 + cardHeight) + (40 - cardHeight)
        const rotation = Math.random() * 90 - 45

        return {
          ...cardInfo,
          initialX,
          initialY,
          targetX,
          targetY,
          rotation,
          originalZIndex,
        }
      }).filter((c): c is CardState => c !== null)

      setCards(capturedCards)
      maxZIndexRef.current = 100
    }
  }, [isVisible, isAnimating, setIsAnimating])

  // Handle return animation when visibility is lost
  useLayoutEffect(() => {
    if (!isVisible && isAnimating && !isReturning && cards.length > 0) {
      // Re-measure positions. If the game was reset, this captures the NEW layout.
      let hasMoved = false
      const domCards = Array.from(document.querySelectorAll('[data-card-id]:not(.victory-card)'))

      const updatedCards = cards.map((c) => {
        const el = document.querySelector(`[data-card-id="${c.id}"]`)
        let returnX = c.initialX
        let returnY = c.initialY
        let returnZIndex = c.originalZIndex

        if (el) {
          const rect = el.getBoundingClientRect()
          returnX = rect.left
          returnY = rect.top

          if (Math.abs(returnX - c.initialX) > 1 || Math.abs(returnY - c.initialY) > 1) {
            hasMoved = true
          }

          const domOrder = domCards.indexOf(el)
          returnZIndex = domOrder !== -1 ? domOrder : 0
        }

        return { ...c, returnX, returnY, returnZIndex }
      })

      setIsBoardReset(hasMoved)
      setCards(updatedCards)
      setIsReturning(true)
    }
  }, [isVisible, isAnimating, isReturning, cards])

  const handleReturnComplete = () => {
    // Only clear everything once the return animation is fully done
    setCards([])
    setIsReturning(false)
    setIsAnimating(false)
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }

  const bringToFront = () => {
    maxZIndexRef.current = Math.min(maxZIndexRef.current + 1, 990)
  }

  // Prevent scrolling while active
  useEffect(() => {
    if (isAnimating) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isAnimating])

  if (!isAnimating && !isVisible) return null

  return (
    <>
      <style>{`
        /* Hide original cards when victory is active (including return) */
        ${isAnimating ? `
          [data-card-id]:not(.victory-card) {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }
        ` : ''}
      `}</style>
      
      <div className="fixed inset-0 z-[50] pointer-events-none victory-overlay">
        {cards.map((card) => (
          <DraggableVictoryCard 
            key={card.id} 
            card={card} 
            isReturning={isReturning}
            onReturnComplete={handleReturnComplete}
            bringToFront={bringToFront}
            maxZIndexRef={maxZIndexRef}
            isBoardReset={isBoardReset}
          />
        ))}
      </div>
    </>
  )
}

function DraggableVictoryCard({ 
  card, 
  isReturning, 
  onReturnComplete,
  bringToFront,
  maxZIndexRef,
  isBoardReset,
}: { 
  card: CardState, 
  isReturning: boolean,
  onReturnComplete: () => void,
  bringToFront: () => void,
  maxZIndexRef: React.MutableRefObject<number>,
  isBoardReset: boolean,
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const [localZIndex, setLocalZIndex] = useState(100)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const handleNativeDragStart = (e: DragEvent) => {
      e.preventDefault()
    }

    el.addEventListener('dragstart', handleNativeDragStart)
    return () => el.removeEventListener('dragstart', handleNativeDragStart)
  }, [])

  const handleInteraction = () => {
    if (isReturning) return
    bringToFront()
    setLocalZIndex(maxZIndexRef.current)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{
        x: card.initialX,
        y: card.initialY,
        rotate: 0,
        zIndex: card.originalZIndex,
      }}
      animate={{
        x: isReturning ? (card.returnX ?? card.initialX) : card.targetX,
        y: isReturning ? (card.returnY ?? card.initialY) : card.targetY,
        rotate: isReturning ? 0 : card.rotation,
        zIndex: isReturning ? (card.returnZIndex ?? card.originalZIndex) : (isDragging ? 999 : localZIndex),
      }}
      style={{
        touchAction: 'none',
        position: 'absolute',
      }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 100,
      }}
      drag={isAnimationComplete && !isReturning}
      dragMomentum={false}
      onAnimationComplete={() => {
        setIsAnimationComplete(true)
        if (isReturning) {
          onReturnComplete()
        }
      }}
      onDragStart={() => {
        setIsDragging(true)
        handleInteraction()
      }}
      onDragEnd={() => setIsDragging(false)}
      onPointerDown={handleInteraction}
      draggable="false"
      className={cn(
        'victory-card-wrapper pointer-events-auto',
        isAnimationComplete && !isReturning ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      )}
    >
      <Card 
        suit={card.suit} 
        rank={card.rank} 
        faceUp={isReturning && isBoardReset ? false : true} 
        className="victory-card"
      />
    </motion.div>
  )
}
