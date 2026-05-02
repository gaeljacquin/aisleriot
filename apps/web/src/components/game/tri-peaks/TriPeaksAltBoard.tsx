import { useTriPeaksAlt } from '#/lib/hooks/useTriPeaksAlt'
import TriPeaksBoardBase from './TriPeaksBoardBase'

interface TriPeaksAltBoardProps {
  onHowToPlay: () => void
  variantName?: string
}

export default function TriPeaksAltBoard({
  onHowToPlay,
  variantName = 'Tri Peaks Alt',
}: TriPeaksAltBoardProps) {
  return (
    <TriPeaksBoardBase
      useGame={useTriPeaksAlt}
      onHowToPlay={onHowToPlay}
      variantName={variantName}
    />
  )
}
