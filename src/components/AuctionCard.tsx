import Link from "next/link";
import { formatUSD } from "@/lib/format";
import { CATEGORY_LABELS, type Listing } from "@/lib/types";
import { Countdown } from "./Countdown";

export function AuctionCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/auctions/${listing.slug}`}
      className="group flex flex-col border border-hairline bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(22,24,29,0.25)]"
    >
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- local SVG art, no optimization needed */}
        <img
          src={listing.image}
          alt={`${listing.location}, ${listing.country}`}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="kicker absolute left-4 top-4 bg-white/95 px-2.5 py-1.5 text-ink">
          {CATEGORY_LABELS[listing.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="kicker text-faint">
          {listing.location} · {listing.nights} nights
        </p>
        <h3 className="mt-2 text-lg font-bold leading-snug">{listing.title}</h3>

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <div>
            <p className="kicker text-faint">Current Bid</p>
            <p className="tabular mt-1 text-xl font-black">
              {formatUSD(listing.currentBid)}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              Retail {formatUSD(listing.retailValue)} · {listing.bidCount} bids
            </p>
          </div>
          <div className="text-right">
            <p className="kicker text-faint">Ends In</p>
            <Countdown endsAt={listing.endsAt} className="mt-1 block text-sm font-bold" />
          </div>
        </div>
      </div>
    </Link>
  );
}
