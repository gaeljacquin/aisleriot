import { usePyramid } from '#/lib/hooks/usePyramid'
import PyramidBoardBase from './PyramidBoardBase'

interface PyramidBoardProps {
  onHowToPlay: () => void
  variantName?: string
}

export default function PyramidBoard({
  onHowToPlay,
  variantName = 'Pyramid',
}: PyramidBoardProps) {
  return (
    <PyramidBoardBase
      useGame={usePyramid}
      onHowToPlay={onHowToPlay}
      variantName={variantName}
    />
  )
}
