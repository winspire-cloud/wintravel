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

## Supabase

The production database is the **Win Travel** project
(`rviyruqoztvsbjakehhc`, us-east-1) on the Winspire Supabase org. Both
migrations in `supabase/migrations/` are applied and `supabase/seed.sql` has
been run (12 listings, 11 house vendors).

Point the app at it via `.env.local` (and the same vars in Vercel):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rviyruqoztvsbjakehhc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_MMHTAyi25UzDJEUV9uSEyQ_Wmo9Np_L
```

The publishable key is safe to expose to browsers — row-level security
governs all access; rotate it anytime in Settings → API.

To stand up a fresh database instead: create a project, apply the files in
`supabase/migrations/` in order, then run `supabase/seed.sql`.

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
