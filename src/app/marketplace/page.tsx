import type { Metadata } from "next";
import Link from "next/link";
import { AuctionCard } from "@/components/AuctionCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getListings, type ListingFilter } from "@/lib/listings";
import { CATEGORY_LABELS, type Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse live travel auctions — luxury stays and experiences from verified vendors.",
};

const SORTS: { value: NonNullable<ListingFilter["sort"]>; label: string }[] = [
  { value: "ending", label: "Ending Soonest" },
  { value: "bid-low", label: "Lowest Bid" },
  { value: "bid-high", label: "Highest Bid" },
  { value: "value", label: "Retail Value" },
];

function isCategory(value: string): value is Category {
  return value in CATEGORY_LABELS;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = params.category && isCategory(params.category) ? params.category : undefined;
  const sort = SORTS.find((s) => s.value === params.sort)?.value ?? "ending";
  const query = params.q?.trim() || undefined;

  const listings = await getListings({ category, sort, query });

  const chipHref = (cat?: Category) => {
    const sp = new URLSearchParams();
    if (cat) sp.set("category", cat);
    if (sort !== "ending") sp.set("sort", sort);
    if (query) sp.set("q", query);
    const qs = sp.toString();
    return `/marketplace${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-hairline bg-paper">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <p className="kicker text-bronze">Live Auctions</p>
            <h1 className="mt-3 text-4xl font-black sm:text-5xl">The Marketplace</h1>
            <p className="mt-3 max-w-xl text-muted">
              {listings.length} live {listings.length === 1 ? "lot" : "lots"}
              {category ? ` in ${CATEGORY_LABELS[category]}` : " across every collection"}.
              Every package is fulfilled by a verified vendor.
            </p>
          </div>
        </section>

        <section className="sticky top-16 z-30 border-b border-hairline bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3.5">
            <div className="flex flex-wrap gap-2">
              <Link
                href={chipHref(undefined)}
                className={`kicker px-3.5 py-2 transition-colors ${
                  !category ? "bg-ink text-white" : "text-ink-soft hover:text-bronze"
                }`}
              >
                All
              </Link>
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                <Link
                  key={cat}
                  href={chipHref(cat)}
                  className={`kicker px-3.5 py-2 transition-colors ${
                    category === cat ? "bg-ink text-white" : "text-ink-soft hover:text-bronze"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </Link>
              ))}
            </div>

            <form method="GET" action="/marketplace" className="flex items-center gap-2">
              {category && <input type="hidden" name="category" value={category} />}
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search destinations…"
                className="w-44 border border-hairline px-3 py-2 text-sm outline-none focus:border-bronze"
              />
              <select
                name="sort"
                defaultValue={sort}
                className="border border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-bronze"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="kicker border border-ink px-4 py-2 transition-colors hover:border-bronze hover:text-bronze"
              >
                Apply
              </button>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          {listings.length === 0 ? (
            <div className="border border-hairline bg-paper px-8 py-20 text-center">
              <p className="text-xl font-bold">No live lots match that search.</p>
              <p className="mt-2 text-muted">
                Try another collection, or{" "}
                <Link href="/marketplace" className="font-bold text-bronze hover:underline">
                  view all auctions
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <AuctionCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
