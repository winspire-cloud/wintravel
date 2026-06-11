"use client";

import { useActionState } from "react";
import { createListing, type ListingFormState } from "@/app/actions/listings";
import { CATEGORY_LABELS } from "@/lib/types";

const INITIAL: ListingFormState = { error: null, success: null };

export function NewListingForm() {
  const [state, formAction, pending] = useActionState(createListing, INITIAL);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <Field label="Title" name="title" className="sm:col-span-2" />
      <Field label="Location" name="location" />
      <Field label="Country" name="country" />

      <label className="block">
        <span className="kicker text-faint">Collection</span>
        <select
          name="category"
          className="mt-1.5 w-full border border-hairline bg-white px-4 py-3 text-sm outline-none focus:border-bronze"
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <Field label="Auction ends" name="ends_at" type="datetime-local" />

      <Field label="Nights" name="nights" type="number" min={1} defaultValue="5" />
      <Field label="Guests" name="guests" type="number" min={1} defaultValue="2" />
      <Field label="Retail value (USD)" name="retail_value" type="number" min={0} />
      <Field label="Starting bid (USD)" name="starting_bid" type="number" min={0} />
      <Field label="Bid increment (USD)" name="bid_increment" type="number" min={50} defaultValue="250" />
      <Field label="Buy now price (USD, optional)" name="buy_now_price" type="number" min={0} required={false} />

      <label className="block sm:col-span-2">
        <span className="kicker text-faint">Description</span>
        <textarea
          name="description"
          rows={4}
          required
          className="mt-1.5 w-full border border-hairline px-4 py-3 text-sm outline-none focus:border-bronze"
        />
      </label>

      {state.error && (
        <p className="border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret sm:col-span-2">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="border border-verdigris/30 bg-verdigris/5 px-4 py-3 text-sm text-verdigris sm:col-span-2">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="kicker bg-ink py-4 text-white transition-colors hover:bg-bronze disabled:opacity-50 sm:col-span-2"
      >
        {pending ? "Publishing…" : "Publish Listing"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  min,
  defaultValue,
  required = true,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  min?: number;
  defaultValue?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="kicker text-faint">{label}</span>
      <input
        name={name}
        type={type}
        min={min}
        defaultValue={defaultValue}
        required={required}
        className="mt-1.5 w-full border border-hairline px-4 py-3 text-sm outline-none focus:border-bronze"
      />
    </label>
  );
}
