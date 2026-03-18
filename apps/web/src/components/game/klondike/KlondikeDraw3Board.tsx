import KlondikeBoardBase from './KlondikeBoardBase'
import { useKlondikeDrawThree } from '#/lib/hooks/useKlondikeDrawThree'

interface KlondikeDraw3BoardProps {
  onHowToPlay: () => void
}

export default function KlondikeDraw3Board({ onHowToPlay }: KlondikeDraw3BoardProps) {
  return <KlondikeBoardBase useGame={useKlondikeDrawThree} onHowToPlay={onHowToPlay} />
}
