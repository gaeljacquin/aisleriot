---
name: freecell-record-types-no-undefined
description: FreeCellState uses Record<FreeCellPileId, T> where FreeCellPileId = string, so index access never returns undefined per TypeScript — defensive undefined guards are always-falsy lint errors
type: project
---

`FreeCellState.tableau`, `.freeCells`, and `.foundation` are all typed as `Record<FreeCellPileId, T>` where `FreeCellPileId = string`. TypeScript treats `Record<string, T>` index access as always returning `T` (not `T | undefined`) because `noUncheckedIndexedAccess` is not enabled in this project.

This means guards like `if (!pile || ...)` after `pile = state.tableau[someId]` are always-falsy and trigger `@typescript-eslint/no-unnecessary-condition`.

Similarly, `Card[]` index access (e.g. `movedCards[0]`) returns `Card` not `Card | undefined`, so `if (card)` after such access is always-truthy.

**Why:** The codebase was written defensively for safety, but TypeScript disagrees with the type assertions.

**How to apply:** When fixing these violations, remove the unnecessary guard. The surrounding logic (validation before reaching this point) makes the guard redundant at runtime too. For `while (true)` loops, replace with `for (;;)` to avoid `@typescript-eslint/no-unnecessary-condition` on the literal `true`.
