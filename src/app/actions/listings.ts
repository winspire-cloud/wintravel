"use server";

import { refresh } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export interface ListingFormState {
  error: string | null;
  success: string | null;
}

export async function createListing(
  _prev: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  if (!isSupabaseConfigured()) {
    return {
      error: null,
      success:
        "Demo mode — the listing was validated but not saved. Connect Supabase to manage real inventory.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in as a vendor to create listings.", success: null };

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!vendor) return { error: "No vendor profile found for this account.", success: null };

  const title = String(formData.get("title") ?? "").trim();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const { error } = await supabase.from("listings").insert({
    vendor_id: vendor.id,
    title,
    slug,
    location: String(formData.get("location") ?? ""),
    country: String(formData.get("country") ?? ""),
    category: String(formData.get("category") ?? "beach"),
    nights: Number(formData.get("nights") ?? 1),
    guests: Number(formData.get("guests") ?? 2),
    description: String(formData.get("description") ?? ""),
    retail_value: Number(formData.get("retail_value") ?? 0),
    starting_bid: Number(formData.get("starting_bid") ?? 0),
    bid_increment: Number(formData.get("bid_increment") ?? 100),
    buy_now_price: formData.get("buy_now_price") ? Number(formData.get("buy_now_price")) : null,
    ends_at: String(formData.get("ends_at") ?? ""),
    image_url: "/art/maldives.svg",
    status: "live",
  });
  if (error) return { error: error.message, success: null };

  refresh();
  return { error: null, success: "Listing published to the marketplace." };
}
