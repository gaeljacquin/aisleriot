import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { GameVariant } from '@workspace/constants'
import BackLink from '@/components/BackLink'
import { VariantGrid } from '@/components/VariantGrid'

export const Route = createFileRoute('/new-game')({ component: NewGame })

function NewGame() {
  const navigate = useNavigate()

  function handleSelect(variant: GameVariant) {
    navigate({ to: `/${variant.id}` as '/klondike-draw-1' })
  }

  return (
    <main className="relative flex min-h-full flex-col overflow-y-auto px-6 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-gold sm:text-5xl">
            New Game
          </h1>
          <p className="mt-3 font-serif text-sm text-cream-dim">
            Select a variant to start your journey.
          </p>
        </header>

        <div className="w-full space-y-10">
          <VariantGrid onSelect={handleSelect} showDescription={false} />
        </div>

        <div className="mt-20 flex justify-center">
          <BackLink />
        </div>
      </div>
    </main>
  )
}
