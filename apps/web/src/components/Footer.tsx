import { appInfo } from '@workspace/constants'
import ThemeToggle from './ThemeToggle'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="flex flex-col items-center gap-4 py-6 md:gap-6 md:pt-10">
      <div className="h-px w-24 bg-linear-to-r from-transparent via-gold/30 to-transparent" />
      <div className="flex flex-col items-center gap-3">
        <ThemeToggle size="sm" />
        <div className="text-center text-[10px] font-medium uppercase tracking-[0.3em] text-cream-dim/40 mt-2">
          &copy; 2026{' '}
          {currentYear > 2026 ? <span>- {currentYear} </span> : null}
          <a
            href={`${appInfo.authorUrl}`}
            target="_blank"
            className="text-primary/90 hover:text-primary hover:underline"
          >
            {appInfo.author}
          </a>
          . All rights reserved.
        </div>
      </div>
    </footer>
  )
}
