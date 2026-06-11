export type Category =
  | "beach"
  | "city"
  | "adventure"
  | "wine"
  | "mountain"
  | "safari";

export const CATEGORY_LABELS: Record<Category, string> = {
  beach: "Beach & Islands",
  city: "City & Culture",
  adventure: "Adventure",
  wine: "Food & Wine",
  mountain: "Ski & Mountain",
  safari: "Safari & Wildlife",
};

export type ListingStatus = "live" | "scheduled" | "ended";

export interface Listing {
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
  retailValue: number;
  startingBid: number;
  currentBid: number;
  bidCount: number;
  bidIncrement: number;
  buyNowPrice: number | null;
  endsAt: string;
  image: string;
  vendor: string;
  featured: boolean;
  status: ListingStatus;
}

export interface Bid {
  id: string;
  listingId: string;
  listingTitle: string;
  amount: number;
  placedAt: string;
  leading: boolean;
}

export interface Purchase {
  id: string;
  listingId: string;
  listingTitle: string;
  amount: number;
  kind: "auction_win" | "buy_now";
  status: "pending" | "paid" | "fulfilled";
  purchasedAt: string;
  buyer?: string;
}
