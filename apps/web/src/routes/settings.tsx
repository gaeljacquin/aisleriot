import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { cn } from '@workspace/ui/lib/utils'
import BackLink from '@/components/BackLink'
import { useCardSettingsStore } from '@/stores/card-settings'
import type { CardStyle } from '@/stores/card-settings'
import CardPrimitive from '@/components/game/CardPrimitive'
import type { Suit, Rank } from '@/lib/types/card'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeftBigIcon, ArrowRightBigIcon } from '@hugeicons/core-free-icons'

export const Route = createFileRoute('/settings')({ component: Settings })

const CARDFACETEXT = 'Card Face'

const cardStyleOptions: { value: CardStyle; label: string }[] = [
  { value: 'basic', label: 'Basic' },
  { value: 'four-color', label: '4-Color' },
  { value: 'large', label: 'Large' },
  { value: 'large-four-color', label: 'Large 4-Color' },
]

const BACKS = [
  { id: 'default', label: 'Default' },
  { id: 'classic', label: 'Crimson' },
  { id: 'lattice', label: 'Lattice' },
  { id: 'monogram', label: 'Monogram' },
] as const

const DEFAULT_SUITS: Suit[] = ['hearts', 'spades', 'diamonds', 'clubs']
const PREVIEW_RANKS: Rank[] = ['A', 'K', '10', '2']

function CardStyleToggleGroup() {
  const { cardStyle, setCardStyle } = useCardSettingsStore()

  return (
    <div
      role="group"
      aria-label={CARDFACETEXT}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {cardStyleOptions.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setCardStyle(value)}
          aria-pressed={cardStyle === value}
          className={cn(
            'flex flex-col items-center gap-2 rounded-xl border p-3 transition-all cursor-pointer',
            cardStyle === value
              ? 'border-gold bg-felt-light/60 shadow-card'
              : 'border-gold/20 bg-felt-deep/60 hover:border-gold/50',
          )}
        >
          <span
            className={cn(
              'text-[10px] font-bold uppercase tracking-wider',
              cardStyle === value ? 'text-gold' : 'text-cream-dim',
            )}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}

function CardBackToggleGroup() {
  const { cardBack, setCardBack } = useCardSettingsStore()

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {BACKS.map((b) => (
        <button
          key={b.id}
          type="button"
          onClick={() => setCardBack(b.id)}
          className={cn(
            'group flex flex-col items-center gap-2 rounded-xl border p-3 transition-all cursor-pointer',
            cardBack === b.id
              ? 'border-gold bg-felt-light/60 shadow-card'
              : 'border-gold/20 bg-felt-deep/60 hover:border-gold/50',
          )}
        >
          <div
            className="relative h-16 w-12 overflow-hidden rounded-md border border-gold/40 shadow-sm"
            style={{
              backgroundImage:
                b.id === 'default'
                  ? 'linear-gradient(135deg, hsl(215 25% 27%), hsl(215 25% 15%))'
                  : b.id === 'classic'
                    ? 'linear-gradient(135deg, hsl(354 50% 30%), hsl(354 60% 18%))'
                    : b.id === 'lattice'
                      ? 'repeating-linear-gradient(45deg, hsl(44 56% 54% / 0.4) 0 2px, hsl(158 64% 11%) 2px 8px)'
                      : 'linear-gradient(135deg, hsl(158 64% 11%), hsl(158 70% 5%))',
            }}
          >
            {/* Pattern Overlays for Preview */}
            {b.id === 'default' && (
              <div className="pointer-events-none absolute inset-0 opacity-20">
                <div className="h-full w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.15)_4px,rgba(255,255,255,0.15)_5px)]" />
              </div>
            )}
            {(b.id === 'classic' || b.id === 'monogram') && (
              <div className="pointer-events-none absolute inset-0 opacity-10">
                <div className="h-full w-full bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
              </div>
            )}
          </div>
          <span
            className={cn(
              'text-[10px] font-bold uppercase tracking-wider transition-colors',
              cardBack === b.id
                ? 'text-gold'
                : 'text-cream-dim group-hover:text-cream',
            )}
          >
            {b.label}
          </span>
        </button>
      ))}
    </div>
  )
}

function CardPreview() {
  const [suits, setSuits] = useState<Suit[]>(DEFAULT_SUITS)

  const rotateLeft = () => {
    setSuits((prev) => [...prev.slice(1), prev[0]])
  }

  const rotateRight = () => {
    setSuits((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)])
  }

  return (
    <div className="flex items-center justify-center gap-8 pt-4">
      <button
        onClick={rotateLeft}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-felt-light/40 text-cream-dim transition-colors hover:bg-gold hover:text-felt-deep cursor-pointer"
        aria-label="Rotate suits left"
      >
        <HugeiconsIcon icon={ArrowLeftBigIcon} size={20} />
      </button>

      <div className="flex -space-x-12 sm:-space-x-16">
        <div className="h-44 w-32 rotate-[-15deg] transition-transform hover:rotate-[-20deg]">
          <CardPrimitive
            suit={suits[0]}
            rank={PREVIEW_RANKS[0]}
            faceUp={true}
          />
        </div>
        <div className="z-10 h-44 w-32 rotate-[-5deg] transition-transform hover:rotate-[-10deg]">
          <CardPrimitive
            suit={suits[1]}
            rank={PREVIEW_RANKS[1]}
            faceUp={true}
          />
        </div>
        <div className="z-20 h-44 w-32 rotate-[5deg] transition-transform hover:rotate-10">
          <CardPrimitive
            suit={suits[2]}
            rank={PREVIEW_RANKS[2]}
            faceUp={true}
          />
        </div>
        <div className="h-44 w-32 rotate-15 transition-transform hover:rotate-20">
          <CardPrimitive
            suit={suits[3]}
            rank={PREVIEW_RANKS[3]}
            faceUp={true}
          />
        </div>
      </div>

      <button
        onClick={rotateRight}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-felt-light/40 text-cream-dim transition-colors hover:bg-gold hover:text-felt-deep cursor-pointer"
        aria-label="Rotate suits right"
      >
        <HugeiconsIcon icon={ArrowRightBigIcon} size={20} />
      </button>
    </div>
  )
}

function Settings() {
  return (
    <main className="relative flex min-h-full flex-col overflow-y-auto px-6 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-gold sm:text-5xl">
            Settings
          </h1>
        </header>

        <div className="space-y-12">
          {/* Card Appearance Section */}
          <section className="space-y-6">
            <label className="block text-xs font-bold uppercase tracking-[0.25em] text-cream-dim">
              {CARDFACETEXT}
            </label>
            <CardStyleToggleGroup />
            <CardPreview />
          </section>

          <div className="h-px w-full bg-linear-to-r from-transparent via-gold/30 to-transparent" />

          {/* Card Back Section */}
          <section className="space-y-6">
            <label className="block text-xs font-bold uppercase tracking-[0.25em] text-cream-dim">
              Card Back
            </label>
            <CardBackToggleGroup />
          </section>

          <div className="h-px w-full bg-linear-to-r from-transparent via-gold/30 to-transparent" />

          {/* Game Settings Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between opacity-40 grayscale pointer-events-none">
              <div className="space-y-1">
                <label className="block text-base font-medium text-cream font-serif">
                  Sound FX
                </label>
              </div>
              <div className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed items-center rounded-full bg-muted transition-colors">
                <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-cream transition-transform" />
              </div>
            </div>
          </section>
        </div>

        <div className="mt-20 flex justify-center">
          <BackLink />
        </div>
      </div>
    </main>
  )
}
