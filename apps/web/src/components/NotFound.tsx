import { appInfo } from '@workspace/constants'
import { useThemeStore } from '@/stores/theme'
import BackLink from './BackLink'

export default function NotFound() {
  const { mode } = useThemeStore()

  // Use the JPEG versions as requested.
  const logoSrc = mode === 'legacy-dark' ? '/logo-dark.jpg' : '/logo.jpg'

  return (
    <main
      className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-background transition-colors duration-300"
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

      <div className="relative z-10 flex flex-col items-center gap-10 px-4 text-center">
        <section className="flex flex-col items-center text-center">
          <img
            src={logoSrc}
            alt={appInfo.title}
            className="mb-4 h-32 w-auto rounded-lg object-contain opacity-80 md:h-40"
          />

          <div className="rounded-sm border border-gold/40 bg-felt-light/40 p-8 shadow-card backdrop-blur-sm md:p-12">
            <h1 className="font-serif text-5xl leading-none text-cream md:text-7xl">
              404
            </h1>
            <p className="mt-4 font-serif text-xl text-cream-dim md:text-2xl">
              Page Not Found
            </p>
          </div>
        </section>

        <BackLink label="Main Menu" destination="/" variant="button" />
      </div>
    </main>
  )
}
