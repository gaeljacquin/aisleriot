import { AnimatePresence, motion } from 'motion/react'
import Card from './Card'
import CardSlot from './CardSlot'
import type { Card as CardType } from '#/lib/types'

interface WasteProps {
  topCard: CardType | null
  animate?: boolean
}

export default function Waste({ topCard, animate = true }: WasteProps) {
  if (!topCard) {
    return <CardSlot role="waste" />
  }

  if (!animate) {
    return <Card suit={topCard.suit} rank={topCard.rank} faceUp={true} />
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={topCard.suit + topCard.rank}
        initial={{ x: -80, rotateY: -90, opacity: 0 }}
        animate={{ x: 0, rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Card suit={topCard.suit} rank={topCard.rank} faceUp={true} />
      </motion.div>
    </AnimatePresence>
  )
}
