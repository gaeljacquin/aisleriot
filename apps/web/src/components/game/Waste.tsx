import { AnimatePresence, motion } from 'motion/react'
import Card from './Card'
import CardSlot from './CardSlot'
import type { Card as CardType } from '#/lib/types'

interface WasteProps {
  topCard: CardType | null
  highlighted?: boolean
  animate?: boolean
}

export default function Waste({
  topCard,
  highlighted,
  animate = true,
}: WasteProps) {
  if (!topCard) {
    return <CardSlot role="waste" />
  }

  if (!animate) {
    return (
      <Card
        suit={topCard.suit}
        rank={topCard.rank}
        faceUp={true}
        highlighted={highlighted}
      />
    )
  }

  return (
    <div className="relative h-40 w-28">
      <CardSlot role="waste" className="absolute inset-0" />
      <AnimatePresence>
        <motion.div
          key={topCard.suit + topCard.rank}
          className="absolute inset-0"
          initial={{ x: -112, rotateY: -90, opacity: 0 }}
          animate={{ x: 0, rotateY: 0, opacity: 1 }}
          exit={{ opacity: 1, transition: { duration: 0.3 } }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Card
            suit={topCard.suit}
            rank={topCard.rank}
            faceUp={true}
            highlighted={highlighted}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
