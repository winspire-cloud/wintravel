-- Win Travel — initial schema
-- Apply with: supabase db push, or paste into the Supabase SQL editor.

create type public.user_role as enum ('customer', 'vendor', 'admin');
create type public.listing_status as enum ('draft', 'scheduled', 'live', 'ended', 'archived');
create type public.listing_category as enum ('beach', 'city', 'adventure', 'wine', 'mountain', 'safari');
create type public.purchase_kind as enum ('auction_win', 'buy_now');
create type public.purchase_status as enum ('pending', 'paid', 'fulfilled', 'cancelled');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  -- Nullable so house/seeded vendors can exist before a user claims them.
  owner_id uuid references public.profiles (id) on delete set null,
  name text not null,
  slug text not null unique,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors (id) on delete cascade,
  slug text not null unique,
  title text not null,
  location text not null,
  country text not null,
  category public.listing_category not null,
  nights integer not null default 1 check (nights > 0),
  guests integer not null default 2 check (guests > 0),
  description text not null default '',
  inclusions jsonb not null default '[]'::jsonb,
  retail_value numeric(12, 2) not null check (retail_value >= 0),
  starting_bid numeric(12, 2) not null check (starting_bid >= 0),
  bid_increment numeric(12, 2) not null default 100 check (bid_increment > 0),
  buy_now_price numeric(12, 2),
  image_url text not null default '',
  featured boolean not null default false,
  status public.listing_status not null default 'draft',
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.bids (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  bidder_id uuid not null references public.profiles (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  created_at timestamptz not null default now()
);

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  amount numeric(12, 2) not null check (amount >= 0),
  kind public.purchase_kind not null,
  status public.purchase_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index listings_status_idx on public.listings (status, ends_at);
create index bids_listing_idx on public.bids (listing_id, amount desc);
create index purchases_buyer_idx on public.purchases (buyer_id);

-- ---------------------------------------------------------------------------
-- View consumed by the app: listings plus live bid aggregates
-- ---------------------------------------------------------------------------

create view public.listings_with_bids
with (security_invoker = true) as
select
  l.*,
  v.name as vendor_name,
  coalesce(max(b.amount), l.starting_bid) as current_bid,
  count(b.id)::integer as bid_count
from public.listings l
join public.vendors v on v.id = l.vendor_id
left join public.bids b on b.listing_id = l.id
group by l.id, v.name;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

-- Create a profile (and vendor record when applicable) on signup, driven by
-- the metadata sent from the app's signup forms.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role public.user_role :=
    coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'customer')::public.user_role;
  v_company text := nullif(new.raw_user_meta_data ->> 'company', '');
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data ->> 'full_name', v_role);

  if v_role = 'vendor' then
    insert into public.vendors (owner_id, name, slug)
    values (
      new.id,
      coalesce(v_company, 'New Vendor'),
      lower(regexp_replace(coalesce(v_company, 'vendor'), '[^a-zA-Z0-9]+', '-', 'g'))
        || '-' || left(new.id::text, 8)
    );
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Reject bids that are late, on closed lots, or below the minimum.
create function public.enforce_bid_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  l public.listings%rowtype;
  v_high numeric(12, 2);
  v_min numeric(12, 2);
begin
  select * into l from public.listings where id = new.listing_id for update;

  if l.id is null then
    raise exception 'Listing not found.';
  end if;
  if l.status <> 'live' or l.ends_at <= now() then
    raise exception 'This auction is closed.';
  end if;

  select max(amount) into v_high from public.bids where listing_id = l.id;
  v_min := case when v_high is null then l.starting_bid else v_high + l.bid_increment end;

  if new.amount < v_min then
    raise exception 'Bid must be at least %.', v_min;
  end if;

  return new;
end;
$$;

create trigger bids_enforce_rules
  before insert on public.bids
  for each row execute function public.enforce_bid_rules();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.vendors enable row level security;
alter table public.listings enable row level security;
alter table public.bids enable row level security;
alter table public.purchases enable row level security;

create policy "profiles are self-readable"
  on public.profiles for select using (id = auth.uid());
create policy "profiles are self-editable"
  on public.profiles for update using (id = auth.uid());

create policy "vendors are publicly readable"
  on public.vendors for select using (true);
create policy "vendors manage their own record"
  on public.vendors for update using (owner_id = auth.uid());

create policy "live listings are publicly readable"
  on public.listings for select
  using (
    status in ('live', 'ended')
    or vendor_id in (select id from public.vendors where owner_id = auth.uid())
  );
create policy "vendors insert their own listings"
  on public.listings for insert
  with check (vendor_id in (select id from public.vendors where owner_id = auth.uid()));
create policy "vendors update their own listings"
  on public.listings for update
  using (vendor_id in (select id from public.vendors where owner_id = auth.uid()));
create policy "vendors delete their own listings"
  on public.listings for delete
  using (vendor_id in (select id from public.vendors where owner_id = auth.uid()));

-- Bid history is public, as on any auction floor; writing requires auth.
create policy "bids are publicly readable"
  on public.bids for select using (true);
create policy "signed-in users place their own bids"
  on public.bids for insert
  with check (bidder_id = auth.uid());

create policy "buyers see their purchases"
  on public.purchases for select
  using (
    buyer_id = auth.uid()
    or listing_id in (
      select l.id from public.listings l
      join public.vendors v on v.id = l.vendor_id
      where v.owner_id = auth.uid()
    )
  );
create policy "buyers create their purchases"
  on public.purchases for insert
  with check (buyer_id = auth.uid());
