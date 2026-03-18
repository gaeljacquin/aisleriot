import Card from '../Card'
import StockEmptyIndicator from '../StockEmptyIndicator'

interface KlondikeStockProps {
  stockCount: number
  stockEmpty: boolean
  canRedeal: boolean
  onClick: () => void
}

/**
 * The stock pile.
 *
 * - Stock has cards: show face-down card back (clickable to flip)
 * - Stock empty + canRedeal: green-border circle; light green bg on hover; click to recycle
 * - Stock empty + !canRedeal: red X; light red bg on hover; click is a no-op
 */
export default function KlondikeStock({
  stockCount,
  stockEmpty,
  canRedeal,
  onClick,
}: KlondikeStockProps) {
  if (!stockEmpty && stockCount > 0) {
    return (
      <div
        className="cursor-pointer"
        onClick={onClick}
        role="button"
        aria-label={`Stock pile, ${stockCount} cards remaining`}
      >
        <Card suit="spades" rank="A" faceUp={false} />
      </div>
    )
  }

  return <StockEmptyIndicator canRecycle={canRedeal} onClick={onClick} />
}
