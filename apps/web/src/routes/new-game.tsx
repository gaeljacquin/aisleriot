import { useState, useMemo } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Cancel01Icon,
  FilterIcon,
  Search01Icon,
  Bookmark02Icon,
  BookmarkAdd02Icon,
  BookmarkCheck02Icon,
  BookmarkMinus01Icon,
} from '@hugeicons/core-free-icons'
import { gameVariants } from '@workspace/constants'
import { cn } from '@workspace/ui/lib/utils'
import { Input } from '@workspace/ui/components/input'
import { Button, buttonVariants } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import BackLink from '@/components/BackLink'
import { VariantCard } from '@/components/VariantCard'
import { VariantCardSkeleton } from '@/components/VariantCardSkeleton'
import { useGameSelectionStore } from '@/stores/game-selection'
import type { GameFilter } from '@/stores/game-selection'
import { useFavoritesStore } from '@/stores/favorites'

export const Route = createFileRoute('/new-game')({ component: NewGame })

function NewGame() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [hoveredHeartId, setHoveredHeartId] = useState<string | null>(null)
  const [hoveredVariantId, setHoveredVariantId] = useState<string | null>(null)
  const { gameFilter, setGameFilter } = useGameSelectionStore()
  const { favorites, toggleFavorite } = useFavoritesStore()

  const filteredVariants = useMemo(() => {
    return gameVariants.filter((v) => {
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase())
      let matchesFilter = false

      if (gameFilter === 'all') {
        matchesFilter = true
      } else if (gameFilter === 'popular') {
        matchesFilter = !!v.most_popular
      } else if (gameFilter === 'favorites') {
        matchesFilter = !!v.gael_favorite
      } else {
        matchesFilter = favorites.includes(v.id)
      }

      return matchesSearch && matchesFilter
    })
  }, [search, gameFilter, favorites])

  const selectedVariant = useMemo(() => {
    return gameVariants.find((v) => v.id === selectedId) || null
  }, [selectedId])

  function handlePlay(variantId: string) {
    const variant = gameVariants.find((v) => v.id === variantId)
    if (variant?.placeholder) return
    navigate({ to: `/${variantId}` })
  }

  return (
    <TooltipProvider>
      <main className="relative flex min-h-full flex-col overflow-y-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto w-full max-w-6xl">
          <header className="relative mb-10 flex items-center justify-between">
            <BackLink variant="compact" label="Main Menu" />
            <div className="flex flex-col items-center">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-gold sm:text-4xl">
                New Game
              </h1>
            </div>
            <div className="w-25" /> {/* Spacer to balance the BackLink */}
          </header>

          <section className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:gap-12">
            {/* Picker Area */}
            <div className="flex flex-col gap-6">
              <div className="flex gap-2">
                <Tooltip>
                  <DropdownMenu
                    open={isFilterOpen}
                    onOpenChange={setIsFilterOpen}
                  >
                    <TooltipTrigger
                      render={
                        <DropdownMenuTrigger
                          className={cn(
                            buttonVariants({ variant: 'outline' }),
                            'h-10 w-10 shrink-0 border-gold/80 bg-felt-deep/80 p-0 text-gold/60 hover:bg-gold/10 hover:text-gold rounded-md data-[state=open]:bg-gold/10 data-[state=open]:text-gold',
                            gameFilter !== 'all' && 'text-gold bg-gold/10',
                          )}
                        />
                      }
                    >
                      <HugeiconsIcon icon={FilterIcon} className="h-5 w-5" />
                    </TooltipTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-48 bg-felt-deep border-gold/20 text-cream rounded-xl font-serif"
                    >
                      <DropdownMenuRadioGroup
                        value={gameFilter}
                        onValueChange={(val: GameFilter) => {
                          setGameFilter(val)
                          setIsFilterOpen(false)
                        }}
                      >
                        <DropdownMenuRadioItem
                          value="all"
                          onSelect={() => setIsFilterOpen(false)}
                          className="focus:bg-gold/10 focus:text-gold data-[state=checked]:text-gold rounded-lg cursor-pointer"
                        >
                          All
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                          value="favorites"
                          onSelect={() => setIsFilterOpen(false)}
                          className="focus:bg-gold/10 focus:text-gold data-[state=checked]:text-gold rounded-lg cursor-pointer"
                        >
                          Gaël's Favorites
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                          value="popular"
                          onSelect={() => setIsFilterOpen(false)}
                          className="focus:bg-gold/10 focus:text-gold data-[state=checked]:text-gold rounded-lg cursor-pointer"
                        >
                          Most Popular
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                          value="your_favorite"
                          onSelect={() => setIsFilterOpen(false)}
                          className="focus:bg-gold/10 focus:text-gold data-[state=checked]:text-gold rounded-lg cursor-pointer"
                        >
                          Your Favorites
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <TooltipContent>
                    <p>
                      {gameFilter === 'popular'
                        ? 'Most Popular'
                        : gameFilter === 'all'
                          ? 'All'
                          : gameFilter === 'favorites'
                            ? "Gaël's Favorites"
                            : 'Your Favorites'}
                    </p>
                  </TooltipContent>
                </Tooltip>

                <div className="relative flex-1 bg-felt-light/40 rounded-md">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      className="h-4 w-4 text-gold/40"
                    />
                  </div>
                  <Input
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearch(e.target.value)
                    }
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

              <div className="overflow-hidden rounded-xl border border-gold/90 bg-felt-light/20">
                <div className="flex h-70 flex-col gap-1 overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-thumb-gold/20">
                  {filteredVariants.length > 0 ? (
                    filteredVariants.map((variant) => {
                      const isSelected = variant.id === selectedId
                      const isFavorite = favorites.includes(variant.id)

                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedId(variant.id)}
                          onMouseEnter={() => setHoveredVariantId(variant.id)}
                          onMouseLeave={() => setHoveredVariantId(null)}
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
                                variant.placeholder && 'line-through',
                              )}
                            >
                              {variant.name}
                            </span>
                          </div>
                          <div
                            className="relative"
                            onMouseEnter={() => setHoveredHeartId(variant.id)}
                            onMouseLeave={() => setHoveredHeartId(null)}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(variant.id)
                            }}
                          >
                            <HugeiconsIcon
                              icon={
                                isFavorite
                                  ? hoveredHeartId === variant.id
                                    ? BookmarkMinus01Icon
                                    : BookmarkCheck02Icon
                                  : hoveredVariantId === variant.id
                                    ? BookmarkAdd02Icon
                                    : Bookmark02Icon
                              }
                              className={cn(
                                'h-4 w-4 transition-all duration-200 text-gold',
                                !isFavorite &&
                                  hoveredVariantId !== variant.id &&
                                  'opacity-40',
                              )}
                            />
                          </div>
                        </button>
                      )
                    })
                  ) : (
                    <div className="flex flex-1 items-center justify-center text-center text-sm text-cream-dim/60 font-serif">
                      <span>
                        {gameFilter === 'your_favorite' && !search
                          ? 'No favorites bookmarked.'
                          : 'No match found.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex flex-col gap-6 md:sticky md:top-6">
              <div className="flex-1">
                {selectedVariant && !selectedVariant.placeholder ? (
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
    </TooltipProvider>
  )
}
