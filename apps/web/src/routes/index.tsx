import { createFileRoute, Link } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PlayIcon,
  Book02Icon,
  Settings02Icon,
  UserGroupIcon,
  ArrowRight01Icon,
  ArrowRight02Icon,
} from '@hugeicons/core-free-icons'
import { appInfo } from '@workspace/constants'
import { cn } from '@workspace/ui/lib/utils'
import { useThemeStore } from '@/stores/theme'
import Footer from '@/components/Footer'
import ThemeToggle from '@/components/ThemeToggle'

export const Route = createFileRoute('/')({ component: Home })

const menuItems = [
  {
    label: 'New Game',
    subtitle: 'Select a variant',
    icon: PlayIcon,
    to: '/new-game' as const,
    primary: true,
  },
  {
    label: 'How to Play',
    subtitle: 'Learn the rules',
    icon: Book02Icon,
    to: '/how-to-play' as const,
  },
  {
    label: 'Settings',
    subtitle: "Personalize to your heart's content",
    icon: Settings02Icon,
    to: '/settings' as const,
  },
  {
    label: 'Credits',
    subtitle: 'whoami',
    icon: UserGroupIcon,
    to: '/credits' as const,
  },
  {
    label: 'More Games',
    subtitle: "Let's have fun!",
    icon: ArrowRight01Icon,
    to: 'https://tr.ee/uBF_3IDko-',
    external: true,
  },
]

function Home() {
  const { mode } = useThemeStore()

  // Use the JPEG versions as requested.
  const logoSrc = mode === 'dark' ? '/logo-dark.jpg' : '/logo.jpg'

  return (
    <main
      className="relative h-screen overflow-hidden bg-background transition-colors duration-300"
      style={{
        backgroundImage: 'var(--bg-gradient-felt), var(--image-noise)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover, 180px 180px',
      }}
    >
      {/* Subtle vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,var(--color-felt-shadow)/0.7)]"
      />

      <div className="container relative mx-auto flex h-full flex-col px-4 py-6 md:py-10">
        {/* Tiny header */}
        <header className="flex items-center justify-between">
          <span className="font-serif text-xs uppercase tracking-[0.4em] text-gold/80">
            {appInfo.title}
          </span>
          <div className="flex items-center gap-4">
            <ThemeToggle size="sm" />
          </div>
        </header>

        {/* Main Content Area: Vertically Centered */}
        <div className="flex flex-1 flex-col items-center justify-center">
          {/* Hero section */}
          <section className="flex flex-col items-center text-center">
            <img
              src={logoSrc}
              alt={appInfo.title}
              className="mb-4 h-40 w-auto object-contain rounded-lg md:h-52"
            />

            <h1 className="font-serif text-5xl leading-none text-cream md:text-7xl">
              Aisle<span className="font-light italic text-gold">riot</span>
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-cream-dim font-serif">
              A Solitaire Suite
            </p>
          </section>

          {/* Menu Grid - pulled up by being in the same centered container */}
          <section className="mx-auto mt-6 grid w-full max-w-md gap-3 md:mt-8 md:gap-4">
            {menuItems.map((item, i) => (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  'group relative flex items-center gap-4 rounded-xl border px-5 py-3 transition-all duration-300 md:py-4',
                  'hover:-translate-y-0.5 hover:shadow-card-lift',
                  item.primary
                    ? 'border-gold/70 bg-linear-to-br from-gold-soft via-gold to-gold-deep text-felt-deep'
                    : 'border-gold/30 bg-felt-light/40 text-cream hover:border-gold/60',
                )}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className={cn(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-lg border',
                    item.primary
                      ? 'border-felt-deep/20 bg-felt-deep/10'
                      : 'border-gold/20 bg-felt-deep/40 text-gold',
                  )}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    className="h-5 w-5"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-serif text-lg font-medium leading-tight">
                    {item.label}
                  </div>
                  {/* <div
                    className={cn(
                      'text-xs font-medium',
                      item.primary ? 'text-felt-deep/60' : 'text-cream-dim/80',
                    )}
                  >
                    {item.subtitle}
                  </div> */}
                </div>
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  className="h-4 w-4 opacity-40 transition-transform group-hover:translate-x-1 group-hover:opacity-80"
                />
              </Link>
            ))}
          </section>
        </div>

        <Footer />
      </div>
    </main>
  )
}
