import Link from "next/link";

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Marketplace",
    links: [
      { href: "/marketplace", label: "All Auctions" },
      { href: "/marketplace?category=beach", label: "Beach & Islands" },
      { href: "/marketplace?category=safari", label: "Safari & Wildlife" },
      { href: "/marketplace?category=mountain", label: "Ski & Mountain" },
    ],
  },
  {
    heading: "Travelers",
    links: [
      { href: "/signup", label: "Create Account" },
      { href: "/login", label: "Sign In" },
      { href: "/account", label: "My Bids" },
      { href: "/#how-it-works", label: "How It Works" },
    ],
  },
  {
    heading: "Vendors",
    links: [
      { href: "/vendor/signup", label: "Become a Vendor" },
      { href: "/vendor/login", label: "Vendor Sign In" },
      { href: "/vendor/dashboard", label: "Inventory Console" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="block h-3.5 w-3.5 bg-bronze" />
              <span className="text-[17px] font-black uppercase tracking-[0.18em]">
                Win<span className="font-light">Travel</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              The auction marketplace for extraordinary travel. Five-star stays and
              once-in-a-lifetime experiences, won at your price.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="kicker text-faint">{col.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-soft transition-colors hover:text-bronze"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-hairline pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Win Travel. All rights reserved.</p>
          <p>All packages fulfilled by verified travel vendors.</p>
        </div>
      </div>
    </footer>
  );
}
