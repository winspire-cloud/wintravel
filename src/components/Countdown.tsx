"use client";

import { useSyncExternalStore } from "react";
import { timeRemaining } from "@/lib/format";

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

// Seconds since epoch on the client, null during SSR/hydration so the
// server and client first paint always match.
function useNowSeconds() {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
}

export function Countdown({
  endsAt,
  className = "",
}: {
  endsAt: string;
  className?: string;
}) {
  const nowSeconds = useNowSeconds();

  if (nowSeconds === null) {
    return <span className={`tabular ${className}`}>—d —h —m</span>;
  }

  const t = timeRemaining(endsAt, new Date(nowSeconds * 1000));
  if (t.ended) {
    return <span className={`text-claret ${className}`}>Auction ended</span>;
  }

  const urgent = t.days === 0 && t.hours < 12;
  return (
    <span className={`tabular ${urgent ? "text-claret" : ""} ${className}`}>
      {t.days > 0 && `${t.days}d `}
      {String(t.hours).padStart(2, "0")}h {String(t.minutes).padStart(2, "0")}m{" "}
      {t.days === 0 && `${String(t.seconds).padStart(2, "0")}s`}
    </span>
  );
}
