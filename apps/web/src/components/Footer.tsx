import { appInfo } from '@workspace/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-4 text-center text-sm text-muted-foreground">
          <p>
            &copy; 2026 {currentYear > 2026 ? <span>- {currentYear} </span> : null}
            <a
              href={`${appInfo.authorUrl}`}
              target="_blank"
              className="text-primary/90 hover:text-primary hover:underline"
            >
              {appInfo.author}
            </a>
            . All rights reserved.
          </p>
        </div>
    </footer>
  )
}
