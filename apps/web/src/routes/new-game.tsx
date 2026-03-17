import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { GameVariant } from '@workspace/constants'
import BackLink from '@/components/BackLink'
import { VariantGrid } from '@/components/VariantGrid'

export const Route = createFileRoute('/new-game')({ component: NewGame })

function NewGame() {
  const navigate = useNavigate()

  function handleSelect(variant: GameVariant) {
    navigate({ to: `/${variant.id}` as '/klondike' })
  }

  return (
    <main className="flex h-full flex-col px-6 py-10">
      <div className="mb-10">
        <BackLink />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-sm space-y-10">
          <h1 className="text-center text-3xl font-bold text-foreground">New Game</h1>
          <VariantGrid onSelect={handleSelect} showDescription={false} />
        </div>
      </div>
    </main>
  )
}
