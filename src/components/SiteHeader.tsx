import Link from "next/link";

const NAV = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/vendor/login", label: "For Vendors" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span aria-hidden className="block h-3.5 w-3.5 bg-bronze" />
          <span className="text-[17px] font-black uppercase tracking-[0.18em]">
            Win<span className="font-light">Travel</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="kicker text-ink-soft transition-colors hover:text-bronze"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="kicker hidden px-3 py-2 text-ink-soft transition-colors hover:text-bronze sm:block"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="kicker bg-ink px-5 py-2.5 text-white transition-colors hover:bg-bronze"
          >
            Join
          </Link>
        </div>
      </div>
    </header>
  );
}
