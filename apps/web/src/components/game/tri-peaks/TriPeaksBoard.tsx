import { useTriPeaks } from '#/lib/hooks/useTriPeaks'
import TriPeaksBoardBase from './TriPeaksBoardBase'

interface TriPeaksBoardProps {
  onHowToPlay: () => void
  variantName?: string
}

export default function TriPeaksBoard({
  onHowToPlay,
  variantName = 'Tri Peaks',
}: TriPeaksBoardProps) {
  return (
    <TriPeaksBoardBase
      useGame={useTriPeaks}
      onHowToPlay={onHowToPlay}
      variantName={variantName}
    />
  )
}
