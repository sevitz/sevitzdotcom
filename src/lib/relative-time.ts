const DAY = 864e5;

/** "today", "4d ago", "1w ago", "5m ago" (months), "1y ago", "1y 3m ago". */
export function relativeTime(iso: string, now: Date = new Date()): string {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / DAY);
  if (days < 1) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}m ago`;
  const years = Math.floor(days / 365);
  const months = Math.min(11, Math.floor((days % 365) / 30));
  return months > 0 ? `${years}y ${months}m ago` : `${years}y ago`;
}
