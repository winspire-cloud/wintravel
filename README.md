# Win Travel

A B2C travel auction marketplace: verified vendors list luxury stays and
experiences, travelers bid on them. Built with Next.js 16 (App Router,
Turbopack), Tailwind CSS v4, and Supabase — deployed on Vercel.

The site runs in **demo mode** out of the box (sample catalog, validated but
unrecorded bids). Connecting a Supabase project switches on real accounts,
bidding, and vendor inventory with no code changes.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Landing page |
| `/marketplace` | Live auctions with category filters, search, and sorting |
| `/auctions/[slug]` | Lot detail with live countdown and bid panel |
| `/login`, `/signup` | Traveler auth |
| `/vendor/login`, `/vendor/signup` | Vendor auth |
| `/account` | Traveler dashboard — active bids and purchases |
| `/vendor/dashboard` | Vendor console — inventory, orders, publish new lots |

## Local development

```bash
npm install
npm run dev
```

## Connecting Supabase

1. Create a Supabase project (note: a new project on a paid org is ~$10/mo).
2. Run the schema migration: paste `supabase/migrations/20260611000000_init.sql`
   into the SQL editor (or `supabase db push` with the CLI).
3. Seed the launch catalog: run `supabase/seed.sql` the same way.
4. Copy `.env.example` to `.env.local` and fill in your project URL and
   publishable key (Settings → API).

What the migration sets up:

- `profiles` — created automatically on signup via trigger; the signup forms
  pass `role` (`customer`/`vendor`) and `company` in user metadata, and vendor
  signups get a `vendors` row automatically.
- `listings`, `bids`, `purchases` — with row-level security: live listings are
  public, vendors manage only their own inventory, bidders write only their
  own bids, buyers/vendors see only their own purchases.
- A `bids` trigger enforces auction rules server-side (lot must be live and
  unexpired; bid must clear the current high bid plus the increment).
- `listings_with_bids` view — what the app reads: listings joined with vendor
  name, current high bid, and bid count.

## Deploying to Vercel

Import the repo in Vercel — no special configuration needed. Set
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in
Project → Settings → Environment Variables (omit them to deploy in demo mode).

## Destination art

The poster art in `public/art/` is generated — no licensed photography.
Regenerate or extend via:

```bash
node scripts/generate-art.mjs
```
