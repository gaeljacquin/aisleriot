---
name: dnd-kit Wiring Conventions
description: How to wire dnd-kit for FreeCell-style card drag-and-drop in this monorepo
type: project
---

## Data Shapes

Two discriminated types attached to dnd-kit `data`:

```ts
DraggableCardData = {
  type: 'card'
  cards: Card[]           // sequence being dragged (length 1 = single card)
  fromPileId: FreeCellPileId
  fromIndex: number
}

DroppableZoneData = {
  type: 'pile'
  pileId: FreeCellPileId
  role: 'tableau' | 'foundation' | 'freecell'
}
```

## Sensor Config

```ts
useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
)
```

## Draggable IDs

- Tableau sequence: `draggable-${pileId}-seq`
- FreeCell card: `draggable-${freecellId}`

## Droppable IDs

- All drop zones: `droppable-${pileId}`

## DragOverlay Pattern

- Track `draggedCards: Card[] | null` in useState; set in `onDragStart`, clear in `onDragEnd`
- Track `lastDropWasValid` via `useRef<boolean>` (not state — avoids re-render)
- `dropAnimation={null}` for valid drops; spring return animation for invalid:
  ```ts
  { duration: 300, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }
  ```
- Render fanned cards in overlay: `position: absolute`, top offset = `i * CARD_OFFSET`

## Fan Layout Constants

- `CARD_OFFSET = 28` px between cards in a vertical fan
- `CARD_HEIGHT = 112` px (h-28 = 7rem)
- Container height = `(cards.length - 1) * CARD_OFFSET + CARD_HEIGHT`

## Column Architecture

- Non-draggable cards: plain divs absolutely positioned in fan
- Draggable sequence: single `useDraggable` wrapping ALL cards from `fromIndex` to end
- Draggable sequence positioned absolutely at `top: fromIndex * CARD_OFFSET`
- Individual cards within sequence use `position: absolute` with own top offset

## FreeCellFreeCell

- Always `useDroppable`; if occupied, also `useDraggable` on inner component
- Empty: renders `CardSlot`; occupied: renders draggable `FreeCellCard`
- Double-click on occupied cell triggers `onAutoMove`

## FreeCellFoundation

- `useDroppable` only — cards not draggable from foundation
- Empty: `CardSlot` with suit symbol overlay at ~30% opacity

## `draggableFromIndex` computation (rules.ts)

Walk from top card downward, extend sequence while:
1. Adjacent pair is opposite color AND rank difference = 1
2. Sequence length <= `maxMovableCards(emptyFC, emptyTC, false)`

Break on first violation; `seqStart` is the lowest draggable index.
This is conservative (uses `destinationIsEmpty=false`); actual `canMoveToTableau` validates against real target at drop time.

## Auto-cascade in store

After every `moveCard`, loop `getAutoMoveTargets` until empty, apply all in same state update (no history push per cascade step). Score += 10 per auto-moved card.

## HistoryConfig for FreeCell

```ts
{
  maxDepth: 'unlimited',
  undoScoreMode: 'penalize',
  undoPenaltyScore: 5,  // -5 per undo (set via setHistoryConfig after store creation)
}
```
