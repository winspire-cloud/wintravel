"use server";

import { refresh } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export interface BidState {
  error: string | null;
  success: string | null;
}

export async function placeBid(_prev: BidState, formData: FormData): Promise<BidState> {
  const amount = Number(formData.get("amount"));
  const listingId = String(formData.get("listing_id") ?? "");
  const minimum = Number(formData.get("minimum"));

  if (!Number.isFinite(amount) || amount < minimum) {
    return { error: `Your bid must be at least $${minimum.toLocaleString()}.`, success: null };
  }

  if (!isSupabaseConfigured()) {
    return {
      error: null,
      success:
        "Demo mode — your bid was validated but not recorded. Connect Supabase to enable live bidding.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Sign in to place a bid.", success: null };
  }

  const { error } = await supabase
    .from("bids")
    .insert({ listing_id: listingId, bidder_id: user.id, amount });
  if (error) return { error: error.message, success: null };

  refresh();
  return { error: null, success: "Bid placed. You're in the running." };
}
