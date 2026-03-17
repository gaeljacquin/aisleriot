import { useTriPeaksAlt } from '#/lib/hooks/useTriPeaksAlt'
import TriPeaksBoardBase from './TriPeaksBoardBase'

interface TriPeaksAltBoardProps {
  onHowToPlay: () => void
}

export default function TriPeaksAltBoard({ onHowToPlay }: TriPeaksAltBoardProps) {
  return <TriPeaksBoardBase useGame={useTriPeaksAlt} onHowToPlay={onHowToPlay} />
}
