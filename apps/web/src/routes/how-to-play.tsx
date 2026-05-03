import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { GameVariant } from '@workspace/constants'
import BackLink from '@/components/BackLink'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { VariantGrid } from '@/components/VariantGrid'

export const Route = createFileRoute('/how-to-play')({ component: HowToPlay })

function HowToPlay() {
  const [selectedVariant, setSelectedVariant] = useState<GameVariant | null>(
    null,
  )

  return (
    <main className="relative flex min-h-full flex-col overflow-y-auto px-6 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-gold sm:text-5xl">
            How to Play
          </h1>
          <p className="mt-3 font-serif text-sm text-cream-dim">
            Master the rules of each variant.
          </p>
        </header>

        <div className="w-full space-y-10">
          <VariantGrid onSelect={setSelectedVariant} />
        </div>

        <div className="mt-20 flex justify-center">
          <BackLink />
        </div>
      </div>

      <HowToPlayModal
        variant={selectedVariant}
        open={!!selectedVariant}
        onOpenChange={(open) => {
          if (!open) setSelectedVariant(null)
        }}
      />
    </main>
  )
}
