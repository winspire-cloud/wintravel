"use client";

import { useActionState, useState } from "react";
import { placeBid, type BidState } from "@/app/actions/bids";
import { formatEndDate, formatUSD } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { Countdown } from "./Countdown";

const INITIAL: BidState = { error: null, success: null };

export function BidPanel({ listing }: { listing: Listing }) {
  const minimum = listing.currentBid + listing.bidIncrement;
  const [amount, setAmount] = useState(minimum);
  const [state, formAction, pending] = useActionState(placeBid, INITIAL);

  const quickBids = [minimum, minimum + listing.bidIncrement * 2, minimum + listing.bidIncrement * 4];

  return (
    <aside className="border border-hairline bg-white">
      <div className="border-b border-hairline bg-paper px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="kicker text-muted">Lot Closes</span>
          <Countdown endsAt={listing.endsAt} className="text-sm font-bold" />
        </div>
        <p className="mt-1 text-xs text-faint">{formatEndDate(listing.endsAt)}</p>
      </div>

      <div className="space-y-6 p-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="kicker text-faint">Current Bid</p>
            <p className="tabular mt-1 text-3xl font-black">{formatUSD(listing.currentBid)}</p>
            <p className="mt-1 text-xs text-muted">{listing.bidCount} bids placed</p>
          </div>
          <div className="text-right">
            <p className="kicker text-faint">Retail Value</p>
            <p className="tabular mt-1 text-lg font-bold text-muted">
              {formatUSD(listing.retailValue)}
            </p>
          </div>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="listing_id" value={listing.id} />
          <input type="hidden" name="minimum" value={minimum} />

          <div className="flex gap-2">
            {quickBids.map((qb) => (
              <button
                key={qb}
                type="button"
                onClick={() => setAmount(qb)}
                className={`tabular flex-1 border px-2 py-2.5 text-sm font-bold transition-colors ${
                  amount === qb
                    ? "border-bronze bg-bronze text-white"
                    : "border-hairline text-ink-soft hover:border-bronze hover:text-bronze"
                }`}
              >
                {formatUSD(qb)}
              </button>
            ))}
          </div>

          <div className="flex items-stretch border border-hairline focus-within:border-bronze">
            <span className="flex items-center border-r border-hairline bg-paper px-4 text-sm font-bold text-muted">
              USD
            </span>
            <input
              type="number"
              name="amount"
              value={amount}
              min={minimum}
              step={listing.bidIncrement}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="tabular w-full px-4 py-3 text-lg font-bold outline-none"
              aria-label="Bid amount"
            />
          </div>
          <p className="text-xs text-muted">
            Minimum bid {formatUSD(minimum)} · increments of {formatUSD(listing.bidIncrement)}
          </p>

          {state.error && (
            <p className="border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
              {state.error}
            </p>
          )}
          {state.success && (
            <p className="border border-verdigris/30 bg-verdigris/5 px-4 py-3 text-sm text-verdigris">
              {state.success}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="kicker w-full bg-ink py-4 text-white transition-colors hover:bg-bronze disabled:opacity-50"
          >
            {pending ? "Placing Bid…" : "Place Bid"}
          </button>
        </form>

        {listing.buyNowPrice && (
          <div className="border-t border-hairline pt-5">
            <button
              type="button"
              className="kicker w-full border border-ink py-4 text-ink transition-colors hover:border-bronze hover:text-bronze"
            >
              Buy Now · {formatUSD(listing.buyNowPrice)}
            </button>
            <p className="mt-2 text-center text-xs text-faint">
              Skip the auction and book instantly
            </p>
          </div>
        )}

        <ul className="space-y-2 border-t border-hairline pt-5 text-xs text-muted">
          <li>— Fulfilled by {listing.vendor}, a verified vendor</li>
          <li>— No payment until you win</li>
          <li>— 24 months to travel, book when ready</li>
        </ul>
      </div>
    </aside>
  );
}
