import { useState, useMemo } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Cancel01Icon,
  Search01Icon,
  Tick01Icon,
} from '@hugeicons/core-free-icons'
import { gameVariants } from '@workspace/constants'
import { cn } from '@workspace/ui/lib/utils'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import BackLink from '@/components/BackLink'
import ThemeToggle from '@/components/ThemeToggle'
import { VariantCard } from '@/components/VariantCard'
import { VariantCardSkeleton } from '@/components/VariantCardSkeleton'

export const Route = createFileRoute('/new-game')({ component: NewGame })

function NewGame() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filteredVariants = useMemo(() => {
    return gameVariants.filter((v) =>
      v.name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search])

  const selectedVariant = useMemo(() => {
    return gameVariants.find((v) => v.id === selectedId) || null
  }, [selectedId])

  function handlePlay(variantId: string) {
    navigate({ to: `/${variantId}` })
  }

  return (
    <main className="relative flex min-h-full flex-col overflow-y-auto px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <header className="relative mb-10 flex items-center justify-between">
          <BackLink variant="compact" label="Main Menu" />
          <div className="flex flex-col items-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-gold sm:text-4xl">
              New Game
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <section className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:gap-12">
          {/* Picker Area */}
          <div className="flex flex-col gap-6">
            <div className="flex gap-2">
              <div className="relative flex-1 bg-felt-light/40 rounded-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    className="h-4 w-4 text-gold/40"
                  />
                </div>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="h-10 border-gold/80 bg-felt-deep/80 pl-10 pr-10 text-cream placeholder:text-cream-dim/50 focus-visible:ring-gold/30 rounded-lg font-serif"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gold/40 hover:text-gold"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                variant="default"
                disabled={!selectedId}
                onClick={() => setSelectedId(null)}
                className="h-10 border border-gold/90 bg-felt-light/40 text-cream hover:bg-gold/10 disabled:opacity-30 rounded-md font-serif text-xs w-12"
              >
                Clear
              </Button>
            </div>

            <div className="flex flex-col gap-1 overflow-y-auto rounded-xl border border-gold/90 bg-felt-light/20 p-2 scrollbar-thin scrollbar-thumb-gold/20 max-h-[400px] md:max-h-none md:flex-1 min-h-[280px]">
              {filteredVariants.length > 0 ? (
                filteredVariants.map((v) => {
                  const isSelected = v.id === selectedId
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedId(v.id)}
                      className={cn(
                        'group flex items-center gap-3 rounded-lg px-4 py-2 text-left transition-all duration-200',
                        isSelected
                          ? 'bg-gold/15 text-cream ring-1 ring-inset ring-gold/30'
                          : 'text-cream-dim hover:bg-gold/5 hover:text-cream',
                      )}
                    >
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span
                          className={cn(
                            'font-serif text-sm leading-tight',
                            !isSelected && 'hover:cursor-pointer',
                          )}
                        >
                          {v.name}
                        </span>
                      </div>
                      {isSelected && (
                        <HugeiconsIcon
                          icon={Tick01Icon}
                          className="h-3.5 w-3.5 text-gold"
                        />
                      )}
                    </button>
                  )
                })
              ) : (
                <div className="flex items-center justify-center text-cream-dim/60 text-sm min-h-[280px]">
                  <span className="text-center">No match found.</span>
                </div>
              )}
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex flex-col gap-6 md:sticky md:top-6">
            <div className="flex-1">
              {selectedVariant ? (
                <div className="flex flex-col gap-6">
                  <VariantCard
                    variant={selectedVariant}
                    className="w-full bg-felt-light/40"
                    onClick={() => handlePlay(selectedVariant.id)}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-6 opacity-60">
                  <VariantCardSkeleton className="w-full" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Decorative cards footer */}
        <footer className="mt-16 flex justify-center opacity-20 transition-opacity hover:opacity-40">
          <div className="h-px w-full max-w-md bg-linear-to-r from-transparent via-gold/50 to-transparent" />
        </footer>
      </div>
    </main>
  )
}
