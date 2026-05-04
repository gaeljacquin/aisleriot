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
      <div className="mx-auto w-full max-w-6xl">
        <header className="relative mb-12 flex items-center justify-center">
          <div className="absolute left-0">
            <BackLink variant="compact" label="Main Menu" />
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-gold sm:text-5xl">
            New Game
          </h1>
        </header>

        <div className="w-full">
          <VariantGrid onSelect={handleSelect} />
        </div>
      </div>
    </main>
  )
}
