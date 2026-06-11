import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { Countdown } from "@/components/Countdown";
import { DemoBanner } from "@/components/DemoBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { demoBids, demoListings, demoPurchases } from "@/lib/catalog";
import { formatUSD } from "@/lib/format";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  let email = "traveler@example.com";
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email) email = user.email;
  }

  const bids = demoBids;
  const purchases = demoPurchases;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-paper">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <DemoBanner />

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker text-bronze">Traveler Account</p>
              <h1 className="mt-2 text-3xl font-black">My bids & trips</h1>
              <p className="mt-1 text-sm text-muted">{email}</p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="kicker border border-hairline px-5 py-2.5 text-ink-soft transition-colors hover:border-claret hover:text-claret"
              >
                Sign Out
              </button>
            </form>
          </div>

          <section className="mt-10">
            <h2 className="kicker text-faint">Active Bids</h2>
            <div className="mt-4 divide-y divide-hairline border border-hairline bg-white">
              {bids.map((bid) => {
                const listing = demoListings.find((l) => l.id === bid.listingId);
                return (
                  <div
                    key={bid.id}
                    className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
                  >
                    <div className="min-w-0">
                      <Link
                        href={listing ? `/auctions/${listing.slug}` : "/marketplace"}
                        className="font-bold hover:text-bronze"
                      >
                        {bid.listingTitle}
                      </Link>
                      <p className="mt-1 text-xs text-muted">
                        Your bid {formatUSD(bid.amount)}
                        {listing && <> · current {formatUSD(listing.currentBid)}</>}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      {listing && (
                        <Countdown endsAt={listing.endsAt} className="text-sm font-bold" />
                      )}
                      <span
                        className={`kicker px-3 py-1.5 ${
                          bid.leading
                            ? "bg-verdigris/10 text-verdigris"
                            : "bg-claret/10 text-claret"
                        }`}
                      >
                        {bid.leading ? "Leading" : "Outbid"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="kicker text-faint">Purchases</h2>
            <div className="mt-4 divide-y divide-hairline border border-hairline bg-white">
              {purchases.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
                >
                  <div>
                    <p className="font-bold">{p.listingTitle}</p>
                    <p className="mt-1 text-xs text-muted">
                      {p.kind === "auction_win" ? "Won at auction" : "Buy now"} ·{" "}
                      {new Date(p.purchasedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="tabular font-black">{formatUSD(p.amount)}</span>
                    <span className="kicker bg-sand px-3 py-1.5 text-ink-soft">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <p className="mt-10 text-sm text-muted">
            Looking for something new?{" "}
            <Link href="/marketplace" className="font-bold text-bronze hover:underline">
              Browse live auctions →
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
