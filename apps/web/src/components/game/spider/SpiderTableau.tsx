import SpiderColumn from './SpiderColumn'
import type { SpiderTableauId } from '#/lib/games/spider'
import { TABLEAU_IDS } from '#/lib/games/spider'
import type { Card } from '#/lib/types'

interface SpiderTableauProps {
  tableau: Record<SpiderTableauId, Card[]>
  draggableFromIndex: (pileId: string) => number
  devMoveAnywhere?: boolean
}

export default function SpiderTableau({
  tableau,
  draggableFromIndex,
  devMoveAnywhere,
}: SpiderTableauProps) {
  return (
    <div className="flex justify-center gap-(--card-gap-x)">
      {TABLEAU_IDS.map((id) => {
        const cards = tableau[id]
        const draggableFrom = devMoveAnywhere
          ? 0
          : draggableFromIndex(id)

        return (
          <SpiderColumn
            key={id}
            id={id}
            cards={cards}
            draggableFrom={draggableFrom}
          />
        )
      })}
    </div>
  )
}
