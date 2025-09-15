// Date helpers for single-day ranges.
// For now, we support two time zones:
// - 'UTC' (offset +00:00)
// - 'Asia/Tokyo' (JST, offset +09:00)
// TODO(UTC-support): Generalize to arbitrary IANA zones via a tz lib.

export type IsoString = string;

function dayRangeWithOffset(
  date: string,
  offset: string
): { start: IsoString; end: IsoString } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
  }
  const start = new Date(`${date}T00:00:00${offset}`);
  const end = new Date(`${date}T24:00:00${offset}`); // next day 00:00 in that zone
  return { start: start.toISOString(), end: end.toISOString() };
}

export function dayRange(
  date: string,
  timezone: "UTC" | "Asia/Tokyo" = "UTC"
): { start: IsoString; end: IsoString } {
  if (timezone === "Asia/Tokyo") return dayRangeWithOffset(date, "+09:00");
  return dayRangeWithOffset(date, "+00:00");
}
