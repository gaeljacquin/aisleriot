import Card from '../Card'
import StockEmptyIndicator from '../StockEmptyIndicator'

interface WestcliffStockProps {
  stockCount: number
  stockEmpty: boolean
  canRedeal: boolean
  onClick: () => void
}

export default function WestcliffStock({
  stockCount,
  stockEmpty,
  canRedeal,
  onClick,
}: WestcliffStockProps) {
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
