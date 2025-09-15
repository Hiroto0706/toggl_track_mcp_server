import type { ISODateString, Timezone } from "../schemas/date.js";

export function dayRange(
	date: ISODateString,
	timezone: Timezone = "UTC",
): { start: string; end: string } {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
	}
	const offset = timezone === "Asia/Tokyo" ? "+09:00" : "+00:00";
	const start = new Date(`${date}T00:00:00${offset}`);
	const end = new Date(`${date}T24:00:00${offset}`);
	return { start: start.toISOString(), end: end.toISOString() };
}
