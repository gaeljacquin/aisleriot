# Dev Commands

## Running the App

```bash
nr dev          # Start all apps (runs turbo dev)
```

Or run the web app directly:

```bash
cd apps/web && nr dev
```

Dev server starts at `http://localhost:3000`.

## Building

```bash
nr build        # Build all apps and packages (runs turbo build)
```

## Testing

```bash
nr test         # Run Vitest tests across all packages
```

Or in a specific package:

```bash
cd apps/web && nr test
```

## Linting & Formatting

```bash
nr lint         # ESLint across all packages (excludes packages/ui)
nr format       # Prettier format check
nr typecheck    # TypeScript type checking
```

Auto-fix lint and format issues:

```bash
cd apps/web && nr format:write   # prettier --write + eslint --fix
```

## Adding UI Components

To add a shadcn/ui component to the shared `packages/ui` library:

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

This places the component in `packages/ui/src/components/`. Import it in any app via:

```tsx
import { Button } from '@workspace/ui/components/button';
```

## Cleaning

```bash
rm -rf .turbo apps/web/dist packages/ui/dist
```
