# Conversations → Create Space flow (linked to Profile Insights)

Add an in-conversation flow where the user asks Joule about reaching more buyers, gets a scripted reply with a suggestion to open a dedicated space, and can create a space that lands on the existing Profile Insights page.

## Flow

1. On `/conversations`, the user types a message (or clicks a suggested prompt) and presses Enter.
2. The empty hero state is replaced by a simple chat transcript: user bubble + Joule reply.
3. Joule's reply is scripted (mock) text about buyer reach, ending with a "Create a space to dive deeper" call-to-action button inside the message.
4. Clicking the CTA shows a brief inline "Creating space…" state (~1s spinner), then navigates to `/spaces/profile-insights`.
5. The Profile Insights space is treated as the created space — no new route or data model.

## Trigger

Any submitted message triggers the scripted Joule reply. The four suggested prompt chips also submit. This keeps the prototype deterministic without wiring real AI.

## Scripted Joule reply (draft copy)

Title: "Here's how your profile reach looks today"

Body: A short paragraph like — "Based on your current profile, catalog coverage, and certifications, I can see 8 signals worth exploring. Buyers in Automotive filter heavily on ISO 14001 and ESG ratings, and peers in your segment publish 3× more catalog SKUs. Want to dive deeper together in a dedicated space?"

CTA button: "Create space" (primary). Secondary text link: "Not now".

Copy can be tweaked; happy to iterate.

## Spaces list connection

Profile Insights already exists in `MOCK_SPACES` (`src/components/SpacesListPanel.tsx`). After the CTA click, the user lands on `/spaces/profile-insights` with the Spaces list panel open, so the "new" space appears highlighted in the list — reinforcing the link.

No changes to `MOCK_SPACES` unless you'd like the entry's subtitle/meta to reflect that it originated from a conversation (e.g. meta: "Created from conversation").

## Technical details

Files touched:
- `src/pages/Conversations.tsx` — add local state for messages, an onSubmit handler, transcript rendering, and the Create-space CTA that navigates via `useNavigate` after a short `setTimeout` spinner.

No new routes, no changes to `App.tsx`, no data model changes. All scripted; no AI call.

## Out of scope

- Real AI/streamed responses.
- Persisting the conversation across reloads.
- A distinct new space page separate from Profile Insights.
