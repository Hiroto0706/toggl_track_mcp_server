import { Temporal } from "@js-temporal/polyfill";
import type { ISODateString } from "../schemas/date.js";

export const dayRange = (
	date: ISODateString,
	timeZone: string = "UTC",
): { start: string; end: string } => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
	}
	const plainDate = Temporal.PlainDate.from(date);
	const startZdt = plainDate.toZonedDateTime({
		timeZone,
		plainTime: Temporal.PlainTime.from("00:00"),
	});
	const endZdt = startZdt.add({ days: 1 });
	return {
		start: startZdt.toInstant().toString(),
		end: endZdt.toInstant().toString(),
	};
};
