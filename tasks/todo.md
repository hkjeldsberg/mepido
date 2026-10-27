# Me Pido — v1 Plan

## Decisions
- No auth. Free for all: anyone with URL can view + edit. "Del liste" copies list URL.
- No `users` table.
- Existing Supabase project, literal Postgres schema `mepido` (must be added to API → Exposed schemas).
- Storage bucket `item-images` (public, 5 MB, image/*). Image = upload OR URL (one required).
- Items: `is_starred` ("mest ønsket"), `quantity`, `position` (drag reorder). Starred shown first.
- Image URL stored as-is (no OG scraping in v1).
- UI fully Norwegian (bokmål). Integer price → "1 299 kr"; free text shown verbatim.
- Dark mode follows system.
- Stack: Next.js (App Router, latest) + TS + Tailwind + shadcn/ui + Framer Motion (`motion`) + `@supabase/supabase-js` + `@dnd-kit` for reorder. pnpm.
- User deploys. No git commands.

## Data model (`supabase/migrations/0001_mepido.sql`)
- `mepido.wishlists`: id uuid pk, slug text unique, title, description, cover_image_url, created_at, updated_at
- `mepido.items`: id uuid pk, wishlist_id fk (cascade), title, description, price_string, url, image_url, is_starred bool, quantity int ≥1, position int, created_at, updated_at
- RLS on, anon policies allow select/insert/update/delete (free-for-all by design)
- Grants on schema `mepido` to anon/authenticated
- Storage bucket + anon upload/read policies

## Routes
- `/` — hero "Mine Ønskelister" + grid of wishlists + "Ny liste" card
- `/l/[slug]` — list header (title, Del liste, edit/delete list) + item grid + "Legg til ønske" card
- Item detail = shared-layout modal (Framer `layoutId` from card → glass modal), inline edit + save (optimistic)

## Tasks
- [x] 1. Scaffold Next.js app (pnpm, TS, Tailwind, ESLint, App Router, src/)
- [x] 2. shadcn init + components (button, input, textarea, dialog, label, sonner, alert-dialog)
- [x] 3. Install motion, supabase-js, dnd-kit
- [x] 4. Write migration SQL + `.env.local.example`; user runs SQL + exposes schema + fills keys
- [x] 5. Supabase client (server + browser), typed DB types, data layer (server actions for mutations)
- [x] 6. Design tokens: Inter, glass utilities, soft shadows, light/dark
- [x] 7. Dashboard: hero, wishlist cards (spring hover scale), create-list modal
- [x] 8. List page: header, Del liste (clipboard + toast), rename/delete list
- [x] 9. Item grid: cards (image/title/price, star, qty badge), hover-revealed edit/delete, add-item card
- [x] 10. Add/edit item modal: upload (Storage) or URL, price, link, description, qty, star
- [x] 11. Detail modal from card origin (layoutId), "Kjøp her", inline edit + optimistic save/delete
- [x] 12. Drag reorder (persist `position`), starred-first sort
- [x] 13. Responsive pass (mobile → wide), a11y (focus, esc, reduced motion)
- [x] 14. Verify: `pnpm build` + lint clean, run dev, browser test full flow (create list → add items both image modes → edit → star → reorder → delete → share link)

## Needs from you
- Supabase URL + anon key in `.env.local` (after step 4)
- Run migration SQL in Supabase SQL editor; add `mepido` to Exposed schemas

## Review (2026-10-27)
Verified in Chrome against real Supabase: create list → add item (image URL) → add item (upload to Storage) →
detail modal morph → edit/save → star → drag reorder (mouse + keyboard) → cross-group guard → reload persistence →
delete item → share/copy → rename list → delete list → not-found page. Mobile width (390px) + dark mode checked.
`pnpm lint` + `pnpm build` clean.

Bugs found + fixed during verification:
- Modal stole focus from `autoFocus` inputs → only focus panel if focus not already inside.
- Create-list modal stayed open in hidden previous route (Next 16 keeps routes mounted for back nav) → close before `router.push`.
- Image URL committed on blur caused layout shift, so the submit click missed → URL committed live, fixed-height preview.
- dnd-kit hydration mismatch (auto `DndDescribedBy-N` ids) → stable `id` via `useId()`.
- Escape closed every stacked modal → module-level modal stack, top modal only.
- Add card taller than item cards; hero blobs cut with hard edge; glass too see-through.

Known v1 gaps:
- Deleted items/lists leave uploaded images in Storage (anon has no delete policy).
- No auth: anyone with URL can edit (by design).

