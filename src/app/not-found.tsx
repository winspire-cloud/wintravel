import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-paper px-6 py-24">
        <div className="max-w-md text-center">
          <p className="kicker text-bronze">404</p>
          <h1 className="mt-3 text-3xl font-black">That lot has left the block.</h1>
          <p className="mt-3 text-muted">
            The page you&apos;re looking for doesn&apos;t exist or the auction has been
            removed.
          </p>
          <Link
            href="/marketplace"
            className="kicker mt-8 inline-block bg-ink px-8 py-4 text-white transition-colors hover:bg-bronze"
          >
            Browse Live Auctions
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
