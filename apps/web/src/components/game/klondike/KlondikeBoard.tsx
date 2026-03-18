import KlondikeBoardBase from './KlondikeBoardBase'
import { useKlondikeDrawOne } from '#/lib/hooks/useKlondikeDrawOne'

interface KlondikeBoardProps {
  onHowToPlay: () => void
}

export default function KlondikeBoard({ onHowToPlay }: KlondikeBoardProps) {
  return <KlondikeBoardBase useGame={useKlondikeDrawOne} onHowToPlay={onHowToPlay} />
}
