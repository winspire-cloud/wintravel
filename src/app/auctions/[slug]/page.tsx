import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BidPanel } from "@/components/BidPanel";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { formatUSD } from "@/lib/format";
import { getListingBySlug, getListings } from "@/lib/listings";
import { AuctionCard } from "@/components/AuctionCard";
import { CATEGORY_LABELS } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Auction not found" };
  return {
    title: listing.title,
    description: `${listing.location}, ${listing.country} — current bid ${formatUSD(listing.currentBid)}, retail value ${formatUSD(listing.retailValue)}.`,
  };
}

export default async function AuctionPage({ params }: Props) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const related = (await getListings({ category: listing.category }))
    .filter((l) => l.id !== listing.id)
    .slice(0, 3);

  const facts: [string, string][] = [
    ["Destination", `${listing.location}, ${listing.country}`],
    ["Duration", `${listing.nights} nights`],
    ["Travelers", `Up to ${listing.guests} guests`],
    ["Collection", CATEGORY_LABELS[listing.category]],
    ["Vendor", listing.vendor],
    ["Lot Number", `WT-${listing.id.toUpperCase()}`],
  ];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <nav className="kicker flex items-center gap-2 text-faint">
            <Link href="/marketplace" className="hover:text-bronze">
              Marketplace
            </Link>
            <span>/</span>
            <Link href={`/marketplace?category=${listing.category}`} className="hover:text-bronze">
              {CATEGORY_LABELS[listing.category]}
            </Link>
          </nav>
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[8fr_4fr]">
          <article>
            {/* eslint-disable-next-line @next/next/no-img-element -- local SVG art */}
            <img
              src={listing.image}
              alt={`${listing.location}, ${listing.country}`}
              className="aspect-[16/9] w-full border border-hairline object-cover"
            />

            <p className="kicker mt-8 text-bronze">
              {listing.location} · {listing.country}
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              {listing.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              {listing.description}
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-3">
              {facts.map(([label, value]) => (
                <div key={label} className="bg-white p-5">
                  <dt className="kicker text-faint">{label}</dt>
                  <dd className="mt-1.5 text-sm font-bold">{value}</dd>
                </div>
              ))}
            </dl>

            <section className="mt-10">
              <h2 className="kicker text-bronze">What&apos;s Included</h2>
              <ul className="mt-5 divide-y divide-hairline border-y border-hairline">
                {listing.inclusions.map((item) => (
                  <li key={item} className="flex items-baseline gap-4 py-3.5">
                    <span aria-hidden className="block h-1.5 w-1.5 shrink-0 translate-y-[-2px] bg-bronze" />
                    <span className="text-sm text-ink-soft">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10 border border-hairline bg-paper p-6">
              <h2 className="kicker text-faint">Good to Know</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Travel within 24 months of settlement, subject to availability and blackout
                dates published by {listing.vendor}. Airfare is not included unless listed
                above. Winning bids are binding; payment is collected within 72 hours of the
                auction close.
              </p>
            </section>
          </article>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <BidPanel listing={listing} />
          </div>
        </div>

        {related.length > 0 && (
          <section className="mx-auto max-w-7xl border-t border-hairline px-6 py-16">
            <p className="kicker text-bronze">More From This Collection</p>
            <h2 className="mt-3 text-2xl font-black">You may also like</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((l) => (
                <AuctionCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
