# Risk detail → Joule side chat

Wire the "View risk detail →" link inside the "Risk score increased" attention item on the Discover (Index) page so it opens the existing right-side chat panel and seeds a Joule conversation explaining the Prewave risk score, styled consistently with the Conversations page chat.

## Behavior

1. Click "View risk detail →" on the Risk score card.
2. The side chat panel (already implemented via `chatOpen` state in `src/pages/Index.tsx`) slides in.
3. A pre-seeded conversation renders:
   - Centered timestamp header ("Today, HH:MM AM/PM") — same style as `Conversations.tsx`.
   - User bubble: "What does the increased risk score mean?"
   - Typing indicator (dot-bounce) for ~1.2s.
   - Joule assistant reply explaining Prewave's Labor Unrest signal, what drove the change, and buyer impact. No Joule avatar next to reply (per memory rule).
   - Message action toolbar under the reply: Copy, Thumbs Up, Thumbs Down, Regenerate, Details, Suggestions, Sources badge — same icons used in `MessageBubble.tsx`.
4. Below the reply, three quick-reply pill buttons (outlined primary, matching the "Create Space" pill style from `MessageBubble.tsx`) to explore further:
   - "What triggered this alert?"
   - "How does it affect Acme?"
   - "Show mitigation steps"
5. Clicking a quick reply appends it as a new user bubble and shows a short scripted Joule follow-up (typing → reply with the same action row). Quick replies then hide.

## Technical notes

- Add a new state `riskSeeded` (or reuse the seeding pattern already used by `seededBatch` / `jouleReplyVisible`) in `src/pages/Index.tsx`. When "View risk detail →" is clicked: `setChatOpen(true)` and `setRiskSeeded(true)`, mutually exclusive with the existing `seededBatch` path.
- Reuse existing local styling in the chat aside; do not introduce new files. Keep the transcript layout consistent with the Conversations chat (timestamp, assistant text with no avatar, action row, primary outlined pill buttons).
- The change is contained to `src/pages/Index.tsx`.
