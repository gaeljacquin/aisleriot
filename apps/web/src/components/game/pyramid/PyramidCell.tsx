import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@workspace/ui/lib/utils'
import Card from '../Card'
import type { PyramidCell as PyramidCellType, PyramidCellId } from '#/lib/games/pyramid'

interface PyramidCellProps {
  cell: PyramidCellType
  isAvailable: boolean
  isSelected: boolean
  onClick: (id: PyramidCellId) => void
}

export default function PyramidCell({ cell, isAvailable, isSelected, onClick }: PyramidCellProps) {
  // Removed cells keep their space in the layout
  if (cell.removed) {
    return <div className="h-28 w-20" aria-hidden="true" />
  }

  // Blocked — face-up but not interactive
  if (!isAvailable) {
    return (
      <div className="h-28 w-20">
        <Card suit={cell.card.suit} rank={cell.card.rank} faceUp={true} />
      </div>
    )
  }

  return (
    <div
      className={cn('h-28 w-20')}
    >
      <AnimatePresence>
        <motion.div
          key={cell.id + '-available'}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Card
            suit={cell.card.suit}
            rank={cell.card.rank}
            faceUp={true}
            highlighted={isSelected}
            onClick={() => onClick(cell.id)}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
