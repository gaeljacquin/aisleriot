import { useTriPeaks } from '#/lib/hooks/useTriPeaks'
import TriPeaksBoardBase from './TriPeaksBoardBase'

interface TriPeaksBoardProps {
  onHowToPlay: () => void
}

export default function TriPeaksBoard({ onHowToPlay }: TriPeaksBoardProps) {
  return (
    <TriPeaksBoardBase
      useGame={useTriPeaks}
      onHowToPlay={onHowToPlay}
      variantId="tri-peaks"
    />
  )
}
