# TypeScript Fixer Agent Memory

## Project

- [web app typecheck script](./project_web_typecheck.md) — `apps/web` was missing `typecheck` script so turbo skipped it; added 2026-03-17

## Error Patterns

- [generic intersection cast through unknown](./pattern_generic_cast_through_unknown.md) — TS2352 in `history.ts` slice when spreading generic TState into Partial intersection; fix is `as unknown as TargetType`
