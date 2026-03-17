---
name: web app typecheck script
description: The apps/web package was missing a typecheck script, so turbo typecheck skipped it
type: project
---

The `apps/web` package (name: `client` in package.json) was missing a `"typecheck": "tsc --noEmit"` script. Because turbo only runs tasks that exist in a package's scripts, `pnpm typecheck` from the root silently skipped the web app entirely.

**Why:** The web app was set up without a typecheck script when the monorepo was scaffolded.

**How to apply:** If `pnpm typecheck` only reports 1 successful task instead of 2+, check that `apps/web/package.json` still has the `typecheck` script. The fix was added on 2026-03-17.
