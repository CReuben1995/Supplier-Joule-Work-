# Card selection, floating toolbar, and insight popover

Make cards on the Discover page and the Space pages interactive: clicking a card selects it (purple highlight), shows a floating pill toolbar above it, and the bulb icon opens an insight popover with a link to the source application.

## Behaviour

1. Click a card -> card gets a purple outline/ring and a floating toolbar appears centered above it.
2. Toolbar contains four icon buttons, in this order:
   - Drag (move handle) — grab cursor, visual affordance only
   - Move up / down (chevron up-down) — reorders the card within its section
   - Delete (trash) — removes the card from the section for the session
   - Bulb (insights) — opens the insight popover
3. Clicking outside the card, pressing Escape, or clicking the card again deselects it and hides the toolbar.
4. Only one card can be selected at a time.

## Insight popover

Opens anchored next to the card (right side, flipping when there is no room), styled like the reference:

- Title = card title, with a short grey subtitle line
- Tabs: Summary / Steps / Sources — Sources is the list view from the reference
- Body content is card-specific mock content
- Close (X) at top right
- Bottom of the popover: a link row "View in SAP Business Network" that opens the SAP Business Network application in a new browser tab (`target="_blank"`, `rel="noopener noreferrer"`)

## Where it applies

- Discover page (`src/pages/Index.tsx`): the main dashboard cards
- Space pages: `ProfileInsights`, `CompleteProfile`, `SpaceDetail`, `WaveDetail` — the insight/section cards

## Technical notes

- New `src/components/cards/SelectableCard.tsx`: wrapper that owns selected state, renders the ring, the floating toolbar, and the popover. Accepts `title`, `subtitle`, `insight` (summary text, steps, sources[], sourceLink) and handlers `onMoveUp`, `onMoveDown`, `onDelete`.
- New `src/components/cards/CardToolbar.tsx` and `src/components/cards/InsightPopover.tsx` (built on the existing shadcn `Popover`).
- Selection coordination via a lightweight context (`SelectedCardProvider`) so only one card is active; outside-click and Escape handled there.
- Reorder/delete is local React state per section (prototype behaviour, not persisted).
- Colors use existing tokens (`primary`, `primary-soft`, `border`) — no hardcoded hex.
- Drag button is a visual affordance only unless you want real drag-and-drop reordering.
