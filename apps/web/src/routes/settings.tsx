import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { cn } from '@workspace/ui/lib/utils'
import { useThemeStore } from '@/stores/theme'
import type { ThemeMode } from '@/lib/theme'
import BackLink from '@/components/BackLink'
import { useCardSettingsStore } from '@/stores/card-settings'
import type { CardStyle } from '@/stores/card-settings'
import CardPrimitive from '@/components/game/CardPrimitive'
import type { Suit, Rank } from '@/lib/types/card'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeftBigIcon, ArrowRightBigIcon } from '@hugeicons/core-free-icons'

export const Route = createFileRoute('/settings')({ component: Settings })

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'auto', label: 'System' },
  { value: 'dark', label: 'Dark' },
]

const cardStyleOptions: { value: CardStyle; label: string }[] = [
  { value: 'basic', label: 'Basic' },
  { value: 'four-color', label: 'Basic four-color' },
  { value: 'large', label: 'Large face' },
  { value: 'large-four-color', label: 'Large face four-color' },
]

const DEFAULT_SUITS: Suit[] = ['hearts', 'spades', 'diamonds', 'clubs']
const PREVIEW_RANKS: Rank[] = ['A', 'K', '10', '2']

function ThemeToggleGroup() {
  const { mode, setMode } = useThemeStore()

  return (
    <div
      role="group"
      aria-label="Theme"
      className="flex w-fit overflow-hidden rounded-lg border border-border"
    >
      {themeOptions.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setMode(value)}
          aria-pressed={mode === value}
          className={cn(
            'px-5 py-2 text-sm font-medium transition-colors',
            mode === value
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-muted',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function CardStyleToggleGroup() {
  const { cardStyle, setCardStyle } = useCardSettingsStore()

  return (
    <div
      role="group"
      aria-label="Card Face Style"
      className="grid grid-cols-1 gap-2 sm:grid-cols-2"
    >
      {cardStyleOptions.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setCardStyle(value)}
          aria-pressed={cardStyle === value}
          className={cn(
            'px-4 py-3 text-sm font-medium transition-all rounded-xl border-2',
            cardStyle === value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted cursor-pointer',
          )}
        >
          {label}
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
    <div className="flex items-center justify-center gap-12 pt-4">
      <button
        onClick={rotateLeft}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
        aria-label="Rotate suits left"
      >
        <HugeiconsIcon icon={ArrowLeftBigIcon} />
      </button>

      <div className="flex -space-x-12">
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
        className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
        aria-label="Rotate suits right"
      >
        <HugeiconsIcon icon={ArrowRightBigIcon} />
      </button>
    </div>
  )
}

function Settings() {
  return (
    <main className="flex min-h-full flex-col py-10">
      <div className="flex flex-1 flex-col items-center justify-center pb-24">
        <div className="w-full max-w-xl space-y-12">
          <h1 className="text-center text-3xl font-bold text-foreground">
            Settings
          </h1>

          <section className="space-y-4">
            <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Card Face Style
            </h2>
            <div className="space-y-8">
              <CardStyleToggleGroup />
              <CardPreview />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Appearance
            </h2>
            <div className="flex justify-center">
              <ThemeToggleGroup />
            </div>
          </section>
        </div>

        <div className="mt-14">
          <BackLink />
        </div>
      </div>
    </main>
  )
}
