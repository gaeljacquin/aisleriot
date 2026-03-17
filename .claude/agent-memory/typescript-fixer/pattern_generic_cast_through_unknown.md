---
name: generic intersection cast through unknown
description: TS2352 when casting object spread of generic TState into Partial<TState & Slice> — fix is to cast through unknown
type: project
---

In `apps/web/src/lib/stores/slices/history.ts`, spreading a generic `TState` and adding known history slice properties, then casting to `Partial<TState & HistorySlice<TState>>`, produces TS2352 because neither type sufficiently overlaps.

Fix: cast through `unknown` first — `{ ...value } as unknown as Partial<TState & HistorySlice<TState>>`.

This is safe because the runtime shape is correct; TypeScript just can't verify the overlap when one side involves a generic intersection.
