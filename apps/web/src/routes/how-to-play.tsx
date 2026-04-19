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
    <main className="flex h-full flex-col px-6 py-10">
      <div className="flex flex-1 flex-col items-center justify-center pb-24">
        <div className="w-full max-w-sm space-y-10">
          <h1 className="text-center text-3xl font-bold text-foreground">
            How to Play
          </h1>
          <VariantGrid onSelect={setSelectedVariant} />
        </div>

        <div className="mt-14">
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
