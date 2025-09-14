// JST helpers. For now we operate in JST (+09:00) and return UTC ISO strings.
// TODO(UTC-support): Generalize to arbitrary IANA time zones and UTC offsets.

export type IsoString = string;

export function jstDayRange(date: string): { start: IsoString; end: IsoString } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
  }
  const startJst = new Date(`${date}T00:00:00+09:00`);
  const endJst = new Date(`${date}T24:00:00+09:00`); // next day 00:00 JST
  return { start: startJst.toISOString(), end: endJst.toISOString() };
}

