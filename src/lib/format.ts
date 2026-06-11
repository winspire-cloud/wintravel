const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatUSD(amount: number): string {
  return usd.format(amount);
}

export function timeRemaining(endsAt: string, from: Date = new Date()) {
  const ms = new Date(endsAt).getTime() - from.getTime();
  if (ms <= 0) return { ended: true as const, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const seconds = Math.floor(ms / 1000);
  return {
    ended: false as const,
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

export function formatEndDate(endsAt: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  }).format(new Date(endsAt));
}
