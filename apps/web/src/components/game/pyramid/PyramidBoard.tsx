import { usePyramid } from '#/lib/hooks/usePyramid'
import PyramidBoardBase from './PyramidBoardBase'

interface PyramidBoardProps {
  onHowToPlay: () => void
}

export default function PyramidBoard({ onHowToPlay }: PyramidBoardProps) {
  return (
    <PyramidBoardBase
      useGame={usePyramid}
      onHowToPlay={onHowToPlay}
      variantId="pyramid"
    />
  )
}
