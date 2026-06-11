import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { Countdown } from "@/components/Countdown";
import { DemoBanner } from "@/components/DemoBanner";
import { NewListingForm } from "@/components/NewListingForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { demoListings, demoPurchases } from "@/lib/catalog";
import { formatUSD } from "@/lib/format";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Vendor Console" };

export default async function VendorDashboardPage() {
  let vendorName = "Atoll Private Collection";
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: vendor } = await supabase
        .from("vendors")
        .select("name")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (vendor?.name) vendorName = vendor.name;
    }
  }

  const inventory = demoListings.filter((l) => l.vendor === vendorName);
  const orders = demoPurchases;
  const totalBids = inventory.reduce((sum, l) => sum + l.bidCount, 0);
  const grossSales = orders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <DemoBanner />

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker text-bronze">Vendor Console</p>
              <h1 className="mt-2 text-3xl font-black">{vendorName}</h1>
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

          <dl className="mt-8 grid gap-px border border-hairline bg-hairline sm:grid-cols-3">
            {[
              ["Active Lots", String(inventory.length)],
              ["Bids Received", String(totalBids)],
              ["Gross Sales", formatUSD(grossSales)],
            ].map(([label, value]) => (
              <div key={label} className="bg-white p-6">
                <dt className="kicker text-faint">{label}</dt>
                <dd className="tabular mt-2 text-3xl font-black">{value}</dd>
              </div>
            ))}
          </dl>

          <section className="mt-10">
            <h2 className="kicker text-faint">Inventory</h2>
            <div className="mt-4 overflow-x-auto border border-hairline bg-white">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-hairline">
                    {["Lot", "Collection", "Current Bid", "Bids", "Closes", "Status"].map((h) => (
                      <th key={h} className="kicker px-5 py-3.5 font-bold text-faint">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {inventory.map((l) => (
                    <tr key={l.id}>
                      <td className="max-w-xs px-5 py-4">
                        <Link href={`/auctions/${l.slug}`} className="font-bold hover:text-bronze">
                          {l.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted">
                          {l.location}, {l.country}
                        </p>
                      </td>
                      <td className="px-5 py-4 capitalize text-muted">{l.category}</td>
                      <td className="tabular px-5 py-4 font-bold">{formatUSD(l.currentBid)}</td>
                      <td className="tabular px-5 py-4">{l.bidCount}</td>
                      <td className="px-5 py-4">
                        <Countdown endsAt={l.endsAt} className="text-xs font-bold" />
                      </td>
                      <td className="px-5 py-4">
                        <span className="kicker bg-verdigris/10 px-2.5 py-1 text-verdigris">
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {inventory.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-muted">
                        No live lots yet — publish your first listing below.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="kicker text-faint">Recent Orders</h2>
            <div className="mt-4 divide-y divide-hairline border border-hairline bg-white">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
                >
                  <div>
                    <p className="font-bold">{o.listingTitle}</p>
                    <p className="mt-1 text-xs text-muted">
                      {o.buyer} · {o.kind === "auction_win" ? "Auction win" : "Buy now"} ·{" "}
                      {new Date(o.purchasedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="tabular font-black">{formatUSD(o.amount)}</span>
                    <span
                      className={`kicker px-3 py-1.5 ${
                        o.status === "fulfilled"
                          ? "bg-verdigris/10 text-verdigris"
                          : "bg-bronze/10 text-bronze-deep"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 border border-hairline bg-white p-6 sm:p-8">
            <p className="kicker text-bronze">New Listing</p>
            <h2 className="mt-2 text-2xl font-black">Put a lot on the block</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Listings go live in the marketplace immediately. You set the reserve via the
              starting bid; settlement is handled by Win Travel within 72 hours of close.
            </p>
            <div className="mt-8">
              <NewListingForm />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
