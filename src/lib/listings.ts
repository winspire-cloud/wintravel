import { demoListings } from "./catalog";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";
import type { Category, Listing } from "./types";

export interface ListingFilter {
  category?: Category;
  sort?: "ending" | "bid-low" | "bid-high" | "value";
  query?: string;
}

interface ListingRow {
  id: string;
  slug: string;
  title: string;
  location: string;
  country: string;
  category: Category;
  nights: number;
  guests: number;
  description: string;
  inclusions: string[];
  retail_value: number;
  starting_bid: number;
  current_bid: number | null;
  bid_count: number;
  bid_increment: number;
  buy_now_price: number | null;
  ends_at: string;
  image_url: string;
  vendor_name: string;
  featured: boolean;
  status: Listing["status"];
}

function fromRow(row: ListingRow): Listing {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location,
    country: row.country,
    category: row.category,
    nights: row.nights,
    guests: row.guests,
    description: row.description,
    inclusions: row.inclusions ?? [],
    retailValue: row.retail_value,
    startingBid: row.starting_bid,
    currentBid: row.current_bid ?? row.starting_bid,
    bidCount: row.bid_count,
    bidIncrement: row.bid_increment,
    buyNowPrice: row.buy_now_price,
    endsAt: row.ends_at,
    image: row.image_url,
    vendor: row.vendor_name,
    featured: row.featured,
    status: row.status,
  };
}

function applyFilter(listings: Listing[], filter: ListingFilter): Listing[] {
  let result = listings.filter((l) => l.status === "live");
  if (filter.category) {
    result = result.filter((l) => l.category === filter.category);
  }
  if (filter.query) {
    const q = filter.query.toLowerCase();
    result = result.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.country.toLowerCase().includes(q),
    );
  }
  switch (filter.sort) {
    case "bid-low":
      result.sort((a, b) => a.currentBid - b.currentBid);
      break;
    case "bid-high":
      result.sort((a, b) => b.currentBid - a.currentBid);
      break;
    case "value":
      result.sort((a, b) => b.retailValue - a.retailValue);
      break;
    default:
      result.sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
  }
  return result;
}

export async function getListings(filter: ListingFilter = {}): Promise<Listing[]> {
  if (!isSupabaseConfigured()) {
    return applyFilter(demoListings, filter);
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings_with_bids")
    .select("*")
    .eq("status", "live");
  if (error || !data) {
    console.error("Falling back to demo catalog:", error?.message);
    return applyFilter(demoListings, filter);
  }
  return applyFilter((data as ListingRow[]).map(fromRow), filter);
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  if (!isSupabaseConfigured()) {
    return demoListings.find((l) => l.slug === slug) ?? null;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings_with_bids")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) {
    return demoListings.find((l) => l.slug === slug) ?? null;
  }
  return fromRow(data as ListingRow);
}

export async function getFeaturedListings(count = 3): Promise<Listing[]> {
  const all = await getListings({ sort: "ending" });
  const featured = all.filter((l) => l.featured);
  const rest = all.filter((l) => !l.featured);
  return [...featured, ...rest].slice(0, count);
}
