import Link from "next/link";
import { AuctionCard } from "@/components/AuctionCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { formatUSD } from "@/lib/format";
import { getFeaturedListings, getListings } from "@/lib/listings";
import { CATEGORY_LABELS, type Category } from "@/lib/types";

const CATEGORY_ART: Record<Category, string> = {
  beach: "/art/maldives.svg",
  city: "/art/paris.svg",
  adventure: "/art/patagonia.svg",
  wine: "/art/napa.svg",
  mountain: "/art/zermatt.svg",
  safari: "/art/serengeti.svg",
};

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Find your trip",
    body: "Browse curated packages from verified luxury vendors — every lot lists exactly what's included, its retail value, and when bidding closes.",
  },
  {
    step: "02",
    title: "Bid your price",
    body: "Place a bid in seconds. We'll alert you the moment you're outbid, and you pay nothing unless you win.",
  },
  {
    step: "03",
    title: "Book and go",
    body: "Win the auction, settle securely, and coordinate dates directly with the vendor's concierge. Most packages stay valid for 24 months.",
  },
];

export default async function HomePage() {
  const [featured, all] = await Promise.all([getFeaturedListings(3), getListings()]);
  const totalRetail = all.reduce((sum, l) => sum + l.retailValue, 0);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-hairline">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[7fr_5fr] lg:py-28">
            <div className="flex flex-col justify-center">
              <p className="kicker text-bronze">The Travel Auction Marketplace</p>
              <h1 className="mt-5 text-5xl font-light leading-[1.06] tracking-tight sm:text-6xl">
                Extraordinary travel,
                <br />
                <span className="font-black">won at your price.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
                Five-star resorts, private villas, and once-in-a-lifetime experiences —
                listed by verified vendors and sold to the highest bidder. No memberships,
                no markups, no payment unless you win.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/marketplace"
                  className="kicker bg-ink px-8 py-4 text-white transition-colors hover:bg-bronze"
                >
                  Browse Auctions
                </Link>
                <Link
                  href="/#how-it-works"
                  className="kicker border border-ink px-8 py-4 text-ink transition-colors hover:border-bronze hover:text-bronze"
                >
                  How It Works
                </Link>
              </div>

              <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-hairline pt-8">
                <div>
                  <dt className="kicker text-faint">Live Lots</dt>
                  <dd className="tabular mt-1 text-2xl font-black">{all.length}</dd>
                </div>
                <div>
                  <dt className="kicker text-faint">Retail Value Listed</dt>
                  <dd className="tabular mt-1 text-2xl font-black">{formatUSD(totalRetail)}</dd>
                </div>
                <div>
                  <dt className="kicker text-faint">Verified Vendors</dt>
                  <dd className="tabular mt-1 text-2xl font-black">40+</dd>
                </div>
              </dl>
            </div>

            <div className="relative hidden lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element -- local SVG art */}
              <img
                src="/art/santorini.svg"
                alt="Santorini caldera"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 border border-hairline bg-white/95 p-5 backdrop-blur">
                <p className="kicker text-faint">Closing Soon · Oia, Santorini</p>
                <p className="mt-1 font-bold">Cliffside Cave Suite with Caldera Plunge Pool</p>
                <p className="tabular mt-1 text-sm text-muted">
                  Current bid {formatUSD(6200)} · retail {formatUSD(12800)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing soon */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="kicker text-bronze">On the Block</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">Closing soon</h2>
            </div>
            <Link href="/marketplace" className="kicker text-ink-soft hover:text-bronze">
              View all →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <AuctionCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="border-y border-hairline bg-paper">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <p className="kicker text-bronze">Collections</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Where will you go?</h2>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                <Link
                  key={cat}
                  href={`/marketplace?category=${cat}`}
                  className="group border border-hairline bg-white transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_-16px_rgba(22,24,29,0.3)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- local SVG art */}
                  <img
                    src={CATEGORY_ART[cat]}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                  <p className="kicker px-3 py-3.5 text-center text-ink-soft group-hover:text-bronze">
                    {CATEGORY_LABELS[cat]}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-20">
          <p className="kicker text-bronze">The Process</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">How Win Travel works</h2>
          <div className="mt-12 grid gap-px border border-hairline bg-hairline md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="bg-white p-8 lg:p-10">
                <span className="tabular text-4xl font-light text-bronze">{item.step}</span>
                <h3 className="mt-5 text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vendor CTA */}
        <section className="bg-ink text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="kicker text-bronze">For Hotels, Resorts & Operators</p>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Turn unsold inventory into demand.
              </h2>
              <p className="mt-4 max-w-lg leading-relaxed text-white/70">
                List your rooms, villas, and experiences in front of thousands of motivated
                bidders. You set the reserve, the schedule, and the inclusions — we bring
                the audience and handle settlement.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/vendor/signup"
                className="kicker bg-bronze px-8 py-4 text-white transition-colors hover:bg-bronze-deep"
              >
                Become a Vendor
              </Link>
              <Link
                href="/vendor/login"
                className="kicker border border-white/40 px-8 py-4 text-white transition-colors hover:border-bronze hover:text-bronze"
              >
                Vendor Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
